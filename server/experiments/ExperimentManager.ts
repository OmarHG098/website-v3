import fs from "fs";
import path from "path";
import * as yaml from "js-yaml";
import type {
  ExperimentConfig,
  ExperimentsFile,
  ExperimentAssignment,
  VisitorContext,
  ExperimentVariant,
  CareerProgram,
} from "@shared/schema";
import { experimentsFileSchema } from "@shared/schema";

const CONTENT_DIR = path.join(process.cwd(), "marketing-content");
const STATE_FILE = path.join(process.cwd(), "experiments-state.json");
const FLUSH_INTERVAL = 30000; // 30 seconds

interface ExperimentState {
  counts: Record<string, Record<string, number>>; // experiment -> variant -> count
  lastFlushed: number;
}

interface VariantContent {
  slug: string;
  version: number;
  content: CareerProgram;
}

export class ExperimentManager {
  private configCache: Map<string, ExperimentsFile> = new Map();
  private contentCache: Map<string, VariantContent> = new Map();
  private state: ExperimentState = { counts: {}, lastFlushed: Date.now() };
  private flushTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.loadState();
    this.startFlushTimer();
  }

  private loadState(): void {
    try {
      if (fs.existsSync(STATE_FILE)) {
        const data = fs.readFileSync(STATE_FILE, "utf-8");
        this.state = JSON.parse(data);
        console.log("[Experiments] Loaded state:", Object.keys(this.state.counts).length, "experiments");
      }
    } catch (error) {
      console.error("[Experiments] Error loading state:", error);
    }
  }

  private saveState(): void {
    try {
      this.state.lastFlushed = Date.now();
      fs.writeFileSync(STATE_FILE, JSON.stringify(this.state, null, 2));
    } catch (error) {
      console.error("[Experiments] Error saving state:", error);
    }
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.saveState();
    }, FLUSH_INTERVAL);
  }

  public shutdown(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.saveState();
  }

  /**
   * Load experiments config for a program
   */
  private loadExperimentsConfig(programSlug: string): ExperimentsFile | null {
    const cacheKey = `program:${programSlug}`;
    
    if (this.configCache.has(cacheKey)) {
      return this.configCache.get(cacheKey)!;
    }

    const configPath = path.join(CONTENT_DIR, "programs", programSlug, "experiments.yml");
    
    if (!fs.existsSync(configPath)) {
      return null;
    }

    try {
      const content = fs.readFileSync(configPath, "utf-8");
      const parsed = yaml.load(content);
      const validated = experimentsFileSchema.parse(parsed);
      this.configCache.set(cacheKey, validated);
      return validated;
    } catch (error) {
      console.error(`[Experiments] Error loading config for ${programSlug}:`, error);
      return null;
    }
  }

  /**
   * Load variant content file
   */
  private loadVariantContent(
    programSlug: string,
    variantSlug: string,
    version: number,
    locale: string
  ): CareerProgram | null {
    const cacheKey = `${programSlug}:${variantSlug}.v${version}.${locale}`;
    
    if (this.contentCache.has(cacheKey)) {
      return this.contentCache.get(cacheKey)!.content;
    }

    const filePath = path.join(
      CONTENT_DIR,
      "programs",
      programSlug,
      `${variantSlug}.v${version}.${locale}.yml`
    );

    if (!fs.existsSync(filePath)) {
      console.warn(`[Experiments] Variant file not found: ${filePath}`);
      return null;
    }

    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const parsed = yaml.load(content) as CareerProgram;
      this.contentCache.set(cacheKey, {
        slug: variantSlug,
        version,
        content: parsed,
      });
      return parsed;
    } catch (error) {
      console.error(`[Experiments] Error loading variant content:`, error);
      return null;
    }
  }

  /**
   * Deterministic hash for consistent bucketing
   */
  private hash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Check if visitor matches targeting rules
   */
  private matchesTargeting(
    targeting: ExperimentConfig["targeting"],
    context: VisitorContext
  ): boolean {
    if (!targeting) return true;

    if (targeting.regions?.length && context.region) {
      if (!targeting.regions.includes(context.region)) return false;
    }

    if (targeting.countries?.length && context.country) {
      if (!targeting.countries.includes(context.country)) return false;
    }

    if (targeting.languages?.length && context.language) {
      if (!targeting.languages.includes(context.language)) return false;
    }

    if (targeting.utm_sources?.length && context.utm_source) {
      if (!targeting.utm_sources.includes(context.utm_source)) return false;
    }

    if (targeting.utm_campaigns?.length && context.utm_campaign) {
      if (!targeting.utm_campaigns.includes(context.utm_campaign)) return false;
    }

    if (targeting.utm_mediums?.length && context.utm_medium) {
      if (!targeting.utm_mediums.includes(context.utm_medium)) return false;
    }

    if (targeting.devices?.length && context.device) {
      if (!targeting.devices.includes(context.device)) return false;
    }

    if (targeting.hours?.length && context.hour !== undefined) {
      if (!targeting.hours.includes(context.hour)) return false;
    }

    if (targeting.days_of_week?.length && context.day_of_week !== undefined) {
      if (!targeting.days_of_week.includes(context.day_of_week)) return false;
    }

    return true;
  }

  /**
   * Select a variant based on allocation percentages and session hash
   */
  private selectVariant(
    experiment: ExperimentConfig,
    sessionId: string
  ): ExperimentVariant | null {
    const hashKey = `${sessionId}:${experiment.slug}`;
    const hashValue = this.hash(hashKey) % 100;

    let cumulative = 0;
    for (const variant of experiment.variants) {
      cumulative += variant.allocation;
      if (hashValue < cumulative) {
        return variant;
      }
    }

    // Fallback to first variant
    return experiment.variants[0] || null;
  }

  /**
   * Get current visitor count for an experiment
   */
  private getExperimentCount(experimentSlug: string): number {
    const expCounts = this.state.counts[experimentSlug] || {};
    return Object.values(expCounts).reduce((sum, count) => sum + count, 0);
  }

  /**
   * Record an experiment exposure (increment count)
   */
  private recordExposure(experimentSlug: string, variantSlug: string): void {
    if (!this.state.counts[experimentSlug]) {
      this.state.counts[experimentSlug] = {};
    }
    if (!this.state.counts[experimentSlug][variantSlug]) {
      this.state.counts[experimentSlug][variantSlug] = 0;
    }
    this.state.counts[experimentSlug][variantSlug]++;
  }

  /**
   * Get experiment assignment for a visitor
   */
  public getAssignment(
    programSlug: string,
    context: VisitorContext,
    existingAssignments: ExperimentAssignment[] = []
  ): ExperimentAssignment | null {
    const config = this.loadExperimentsConfig(programSlug);
    if (!config) return null;

    // Find first active experiment that matches targeting
    for (const experiment of config.experiments) {
      // Skip non-active experiments
      if (experiment.status !== "active") continue;

      // Check if max visitors reached
      if (experiment.max_visitors) {
        const currentCount = this.getExperimentCount(experiment.slug);
        if (currentCount >= experiment.max_visitors) continue;
      }

      // Check targeting
      if (!this.matchesTargeting(experiment.targeting, context)) continue;

      // Check existing assignment
      const existing = existingAssignments.find(
        (a) => a.experiment_slug === experiment.slug
      );
      if (existing) {
        return existing;
      }

      // Select variant
      const variant = this.selectVariant(experiment, context.session_id);
      if (!variant) continue;

      // Record exposure
      this.recordExposure(experiment.slug, variant.slug);

      return {
        experiment_slug: experiment.slug,
        variant_slug: variant.slug,
        variant_version: variant.version,
        assigned_at: Date.now(),
      };
    }

    return null;
  }

  /**
   * Get variant content for an assignment
   */
  public getVariantContent(
    programSlug: string,
    assignment: ExperimentAssignment,
    locale: string
  ): CareerProgram | null {
    return this.loadVariantContent(
      programSlug,
      assignment.variant_slug,
      assignment.variant_version,
      locale
    );
  }

  /**
   * Get experiment statistics
   */
  public getStats(): Record<string, Record<string, number>> {
    return { ...this.state.counts };
  }

  /**
   * Clear config cache (for hot reload in dev)
   */
  public clearCache(): void {
    this.configCache.clear();
    this.contentCache.clear();
    console.log("[Experiments] Cache cleared");
  }
}

// Singleton instance
let instance: ExperimentManager | null = null;

export function getExperimentManager(): ExperimentManager {
  if (!instance) {
    instance = new ExperimentManager();
  }
  return instance;
}
