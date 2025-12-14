import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";
import { deepMerge } from "./utils/deepMerge";

const MARKETING_CONTENT_PATH = path.join(process.cwd(), "marketing-content", "programs");
const LANDINGS_CONTENT_PATH = path.join(process.cwd(), "marketing-content", "landings");
const LOCATIONS_CONTENT_PATH = path.join(process.cwd(), "marketing-content", "locations");
const PAGES_CONTENT_PATH = path.join(process.cwd(), "marketing-content", "pages");
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getBaseUrl(): string {
  // Use explicit SITE_URL if set
  if (process.env.SITE_URL) {
    return process.env.SITE_URL.replace(/\/$/, ""); // Remove trailing slash
  }

  // Fall back to Replit's domain
  if (process.env.REPLIT_DEV_DOMAIN) {
    return `https://${process.env.REPLIT_DEV_DOMAIN}`;
  }

  // Development fallback
  return "http://localhost:5000";
}

// ============================================================================
// CANONICAL SITEMAP ENTRY - Single Source of Truth
// ============================================================================

type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
type EntryType = "static" | "program" | "landing" | "location" | "template_page";

interface CanonicalSitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: ChangeFreq;
  priority: number;
  label: string;
  type: EntryType;
  locale?: string;
}

interface SitemapCache {
  entries: CanonicalSitemapEntry[];
  generatedAt: number;
}

let sitemapCache: SitemapCache | null = null;

// ============================================================================
// Content Meta Interfaces
// ============================================================================

interface ContentMeta {
  page_title?: string;
  robots?: string;
  priority?: number;
  change_frequency?: ChangeFreq;
  redirects?: string[];
}

interface AvailableProgram {
  slug: string;
  locale: string;
  title: string;
  meta: ContentMeta;
}

interface AvailableLanding {
  slug: string;
  locale: string;
  title: string;
  meta: ContentMeta;
}

interface AvailableLocation {
  slug: string;
  locale: string;
  name: string;
  visibility: string;
  meta: ContentMeta;
}

interface AvailableTemplatePage {
  slug: string;
  locale: string;
  template: string;
  title: string;
  meta: ContentMeta;
}

// Template pages URL routing (slug to URL path mapping)
const templatePageRoutes: Record<string, { en: string; es: string }> = {
  "job-guarantee": {
    en: "/en/job-guarantee",
    es: "/es/garantia-empleo",
  },
};

// ============================================================================
// Data Fetchers
// ============================================================================

function getAvailablePrograms(): AvailableProgram[] {
  try {
    if (!fs.existsSync(MARKETING_CONTENT_PATH)) {
      return [];
    }

    const programs: AvailableProgram[] = [];
    const dirs = fs.readdirSync(MARKETING_CONTENT_PATH);

    for (const dir of dirs) {
      const programPath = path.join(MARKETING_CONTENT_PATH, dir);
      if (!fs.statSync(programPath).isDirectory()) continue;

      // Load _common.yml for shared properties (slug, title, schema, meta)
      const commonPath = path.join(programPath, "_common.yml");
      let commonData: Record<string, unknown> = {};
      if (fs.existsSync(commonPath)) {
        try {
          const commonContent = fs.readFileSync(commonPath, "utf-8");
          commonData = yaml.load(commonContent) as Record<string, unknown>;
        } catch (parseError) {
          console.error(`Error parsing _common.yml for ${dir}:`, parseError);
        }
      }

      // Only process locale files (en.yml, es.yml) - skip _common.yml, experiments.yml, and variant files
      const files = fs.readdirSync(programPath).filter(f => 
        f.endsWith(".yml") && 
        !f.startsWith("_") && 
        !f.includes(".v") && 
        f !== "experiments.yml"
      );

      for (const file of files) {
        const locale = file.replace(".yml", "");
        const filePath = path.join(programPath, file);

        try {
          const content = fs.readFileSync(filePath, "utf-8");
          const localeData = yaml.load(content) as Record<string, unknown>;

          // Deep merge common data with locale data (locale takes precedence)
          const merged = deepMerge(commonData, localeData) as {
            slug?: string;
            title?: string;
            meta?: ContentMeta;
          };

          // Use meta.page_title for the localized title, with fallback chain
          const meta = merged.meta || {};
          programs.push({
            slug: merged.slug || dir,
            locale,
            title: meta.page_title || merged.title || dir,
            meta,
          });
        } catch (parseError) {
          console.error(`Error parsing program ${filePath}:`, parseError);
        }
      }
    }

    return programs;
  } catch (error) {
    console.error("Error scanning programs:", error);
    return [];
  }
}

function getAvailableLandings(): AvailableLanding[] {
  try {
    if (!fs.existsSync(LANDINGS_CONTENT_PATH)) {
      return [];
    }

    const landings: AvailableLanding[] = [];
    const dirs = fs.readdirSync(LANDINGS_CONTENT_PATH);

    for (const dir of dirs) {
      const landingPath = path.join(LANDINGS_CONTENT_PATH, dir);
      if (!fs.statSync(landingPath).isDirectory()) continue;

      // Load _common.yml for shared properties
      const commonPath = path.join(landingPath, "_common.yml");
      let commonData: Record<string, unknown> = {};
      if (fs.existsSync(commonPath)) {
        try {
          const commonContent = fs.readFileSync(commonPath, "utf-8");
          commonData = yaml.load(commonContent) as Record<string, unknown>;
        } catch (commonParseError) {
          console.error(`Error parsing landing common ${commonPath}:`, commonParseError);
        }
      }

      // Only process locale files (en.yml, es.yml) - skip _common.yml and variant files
      const files = fs.readdirSync(landingPath).filter(f => 
        f.endsWith(".yml") && 
        !f.startsWith("_") && 
        !f.includes(".v")
      );

      for (const file of files) {
        const locale = file.replace(".yml", "");
        const filePath = path.join(landingPath, file);

        try {
          const content = fs.readFileSync(filePath, "utf-8");
          const localeData = yaml.load(content) as Record<string, unknown>;

          // Deep merge common data with locale data (locale takes precedence)
          const merged = deepMerge(commonData, localeData) as {
            slug?: string;
            title?: string;
            meta?: ContentMeta;
          };

          // Use meta.page_title for the localized title, with fallback chain
          const meta = merged.meta || {};
          landings.push({
            slug: merged.slug || dir,
            locale,
            title: meta.page_title || merged.title || dir,
            meta,
          });
        } catch (parseError) {
          console.error(`Error parsing landing ${filePath}:`, parseError);
        }
      }
    }

    return landings;
  } catch (error) {
    console.error("Error scanning landings:", error);
    return [];
  }
}

function getAvailableLocations(): AvailableLocation[] {
  try {
    if (!fs.existsSync(LOCATIONS_CONTENT_PATH)) {
      return [];
    }

    const locations: AvailableLocation[] = [];
    const files = fs.readdirSync(LOCATIONS_CONTENT_PATH).filter(f => f.endsWith(".yml"));

    for (const file of files) {
      const filePath = path.join(LOCATIONS_CONTENT_PATH, file);
      const parts = file.replace(".yml", "").split(".");
      const locale = parts.pop() || "en";
      const slug = parts.join(".");

      try {
        const content = fs.readFileSync(filePath, "utf-8");
        const data = yaml.load(content) as {
          slug?: string;
          name?: string;
          visibility?: string;
          meta?: ContentMeta;
        };

        if (data.visibility === "listed") {
          // Use meta.page_title for the localized name, with fallback chain
          const meta = data.meta || {};
          locations.push({
            slug: data.slug || slug,
            locale,
            name: meta.page_title || data.name || slug,
            visibility: data.visibility || "listed",
            meta,
          });
        }
      } catch (parseError) {
        console.error(`Error parsing location ${filePath}:`, parseError);
      }
    }

    return locations;
  } catch (error) {
    console.error("Error scanning locations:", error);
    return [];
  }
}

function getAvailableTemplatePages(): AvailableTemplatePage[] {
  try {
    if (!fs.existsSync(PAGES_CONTENT_PATH)) {
      return [];
    }

    const pages: AvailableTemplatePage[] = [];
    const dirs = fs.readdirSync(PAGES_CONTENT_PATH);

    for (const dir of dirs) {
      const pagePath = path.join(PAGES_CONTENT_PATH, dir);
      if (!fs.statSync(pagePath).isDirectory()) continue;

      // Load _common.yml for shared properties
      const commonPath = path.join(pagePath, "_common.yml");
      let commonData: Record<string, unknown> = {};
      if (fs.existsSync(commonPath)) {
        try {
          const commonContent = fs.readFileSync(commonPath, "utf-8");
          commonData = yaml.load(commonContent) as Record<string, unknown>;
        } catch (commonParseError) {
          console.error(`Error parsing template page common ${commonPath}:`, commonParseError);
        }
      }

      // Only process locale files (en.yml, es.yml) - skip _common.yml and variant files
      const files = fs.readdirSync(pagePath).filter(f => 
        f.endsWith(".yml") && 
        !f.startsWith("_") && 
        !f.includes(".v")
      );

      for (const file of files) {
        const locale = file.replace(".yml", "");
        // Only process locale files (en.yml, es.yml)
        if (!["en", "es"].includes(locale)) continue;

        const filePath = path.join(pagePath, file);

        try {
          const content = fs.readFileSync(filePath, "utf-8");
          const localeData = yaml.load(content) as Record<string, unknown>;

          // Deep merge common data with locale data (locale takes precedence)
          const merged = deepMerge(commonData, localeData) as {
            slug?: string;
            template?: string;
            title?: string;
            meta?: ContentMeta;
          };

          // Use meta.page_title for the localized title, with fallback chain
          const meta = merged.meta || {};
          pages.push({
            slug: merged.slug || dir,
            locale,
            template: merged.template || dir.replace(/-/g, "_"),
            title: meta.page_title || merged.title || dir,
            meta,
          });
        } catch (parseError) {
          console.error(`Error parsing template page ${filePath}:`, parseError);
        }
      }
    }

    return pages;
  } catch (error) {
    console.error("Error scanning template pages:", error);
    return [];
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

function shouldIndex(robots?: string): boolean {
  if (!robots) return true;
  return !robots.toLowerCase().includes("noindex");
}

function getCurrentDate(): string {
  return new Date().toISOString().split("T")[0];
}

function resolveTemplatePageUrl(slug: string, locale: string): string {
  const routes = templatePageRoutes[slug];
  if (routes) {
    return `${getBaseUrl()}${routes[locale as "en" | "es"] || routes.en}`;
  }
  // Default routing pattern
  return locale === "es"
    ? `${getBaseUrl()}/es/${slug}`
    : `${getBaseUrl()}/en/${slug}`;
}

function formatLocaleLabel(locale: string): string {
  return locale === "es" ? "ES" : "EN";
}

// ============================================================================
// CANONICAL BUILDER - Single Source of Truth
// ============================================================================

function buildCanonicalSitemapEntries(): CanonicalSitemapEntry[] {
  const today = getCurrentDate();
  const entries: CanonicalSitemapEntry[] = [];

  // Static pages
  const staticPages: Array<{ path: string; label: string; changefreq: ChangeFreq; priority: number }> = [
    { path: "/", label: "Home", changefreq: "weekly", priority: 1.0 },
  ];

  for (const page of staticPages) {
    entries.push({
      loc: `${getBaseUrl()}${page.path}`,
      lastmod: today,
      changefreq: page.changefreq,
      priority: page.priority,
      label: page.label,
      type: "static",
    });
  }

  // Dynamic career program pages
  const programs = getAvailablePrograms();
  for (const program of programs) {
    if (!shouldIndex(program.meta.robots)) {
      console.log(`[Sitemap] Skipping noindex program: ${program.slug} (${program.locale})`);
      continue;
    }

    const url = program.locale === "es"
      ? `${getBaseUrl()}/es/programas-de-carrera/${program.slug}`
      : `${getBaseUrl()}/en/career-programs/${program.slug}`;

    entries.push({
      loc: url,
      lastmod: today,
      changefreq: program.meta.change_frequency || "weekly",
      priority: program.meta.priority || 0.8,
      label: `${program.title} (${formatLocaleLabel(program.locale)})`,
      type: "program",
      locale: program.locale,
    });
  }

  // Dynamic landing pages (deduplicated by slug)
  const landings = getAvailableLandings();
  const processedLandingSlugs = new Set<string>();

  for (const landing of landings) {
    if (processedLandingSlugs.has(landing.slug)) continue;
    if (!shouldIndex(landing.meta.robots)) {
      console.log(`[Sitemap] Skipping noindex landing: ${landing.slug}`);
      continue;
    }

    processedLandingSlugs.add(landing.slug);

    entries.push({
      loc: `${getBaseUrl()}/landing/${landing.slug}`,
      lastmod: today,
      changefreq: landing.meta.change_frequency || "weekly",
      priority: landing.meta.priority || 0.8,
      label: `Landing: ${landing.title}`,
      type: "landing",
    });
  }

  // Dynamic location pages
  const locations = getAvailableLocations();
  for (const location of locations) {
    if (!shouldIndex(location.meta.robots)) {
      console.log(`[Sitemap] Skipping noindex location: ${location.slug} (${location.locale})`);
      continue;
    }

    const url = location.locale === "es"
      ? `${getBaseUrl()}/es/ubicacion/${location.slug}`
      : `${getBaseUrl()}/en/location/${location.slug}`;

    entries.push({
      loc: url,
      lastmod: today,
      changefreq: location.meta.change_frequency || "monthly",
      priority: location.meta.priority || 0.8,
      label: `Location: ${location.name} (${formatLocaleLabel(location.locale)})`,
      type: "location",
      locale: location.locale,
    });
  }

  // Dynamic template pages
  const templatePages = getAvailableTemplatePages();
  for (const page of templatePages) {
    if (!shouldIndex(page.meta.robots)) {
      console.log(`[Sitemap] Skipping noindex template page: ${page.slug} (${page.locale})`);
      continue;
    }

    entries.push({
      loc: resolveTemplatePageUrl(page.slug, page.locale),
      lastmod: today,
      changefreq: page.meta.change_frequency || "weekly",
      priority: page.meta.priority || 0.8,
      label: `Page: ${page.title} (${formatLocaleLabel(page.locale)})`,
      type: "template_page",
      locale: page.locale,
    });
  }

  return entries;
}

// ============================================================================
// Output Transformers - Derive from Canonical Source
// ============================================================================

function entriesToXml(entries: CanonicalSitemapEntry[]): string {
  const urlEntries = entries
    .map(
      (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

function entriesToHumanReadable(entries: CanonicalSitemapEntry[]): Array<{ loc: string; label: string }> {
  return entries.map(entry => ({
    loc: entry.loc,
    label: entry.label,
  }));
}

// ============================================================================
// Cached Access - Both outputs derive from same canonical data
// ============================================================================

function getCanonicalEntries(): CanonicalSitemapEntry[] {
  const now = Date.now();

  // Check if cache exists and is still valid
  if (sitemapCache && (now - sitemapCache.generatedAt) < CACHE_TTL_MS) {
    console.log("[Sitemap] Serving from cache");
    return sitemapCache.entries;
  }

  // Generate fresh entries
  console.log("[Sitemap] Generating fresh sitemap entries");
  const entries = buildCanonicalSitemapEntries();

  sitemapCache = {
    entries,
    generatedAt: now,
  };

  return entries;
}

// ============================================================================
// Public API
// ============================================================================

export function getSitemap(): string {
  const entries = getCanonicalEntries();
  return entriesToXml(entries);
}

export function getSitemapUrls(): Array<{ loc: string; label: string }> {
  const entries = getCanonicalEntries();
  return entriesToHumanReadable(entries);
}

export function clearSitemapCache(): { success: boolean; message: string } {
  if (sitemapCache) {
    const age = Date.now() - sitemapCache.generatedAt;
    const ageMinutes = Math.round(age / 1000 / 60);
    sitemapCache = null;
    console.log("[Sitemap] Cache cleared");
    return {
      success: true,
      message: `Cache cleared. Previous cache was ${ageMinutes} minutes old.`,
    };
  }

  return {
    success: true,
    message: "No cache to clear.",
  };
}

export function getSitemapCacheStatus(): {
  cached: boolean;
  generatedAt: number | null;
  ageMinutes: number | null;
  expiresInMinutes: number | null;
  entryCount: number | null;
} {
  if (!sitemapCache) {
    return {
      cached: false,
      generatedAt: null,
      ageMinutes: null,
      expiresInMinutes: null,
      entryCount: null,
    };
  }

  const now = Date.now();
  const ageMs = now - sitemapCache.generatedAt;
  const expiresInMs = CACHE_TTL_MS - ageMs;

  return {
    cached: true,
    generatedAt: sitemapCache.generatedAt,
    ageMinutes: Math.round(ageMs / 1000 / 60),
    expiresInMinutes: Math.max(0, Math.round(expiresInMs / 1000 / 60)),
    entryCount: sitemapCache.entries.length,
  };
}
