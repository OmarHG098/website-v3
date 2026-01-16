/**
 * FAQ Loader Utility
 * 
 * Loads centralized FAQs from src/data/faqs/ YAML files.
 * Supports filtering by locale, location, related_features, and priority.
 */

import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";
import {
  centralizedFaqsSchema,
  type FaqItem,
  type RelatedFeature,
} from "../marketing-content/component-registry/faq/v1.0/schema";

const FAQ_DATA_PATH = path.join(process.cwd(), "src", "data", "faqs");

export interface LoadFaqsOptions {
  locale: string;
  location?: string;
  relatedFeatures?: RelatedFeature[];
  minPriority?: number;
  limit?: number;
}

export type LoadFaqsResult =
  | { success: true; faqs: FaqItem[] }
  | { success: false; error: string };

/**
 * Load FAQs from centralized YAML files with optional filtering.
 */
export function loadFaqs(options: LoadFaqsOptions): LoadFaqsResult {
  const { locale, location, relatedFeatures, minPriority, limit } = options;

  try {
    const faqFilePath = path.join(FAQ_DATA_PATH, `${locale}.yml`);

    if (!fs.existsSync(faqFilePath)) {
      return { success: false, error: `FAQ file not found for locale: ${locale}` };
    }

    const fileContent = fs.readFileSync(faqFilePath, "utf8");
    const rawData = yaml.load(fileContent);

    const parseResult = centralizedFaqsSchema.safeParse(rawData);
    if (!parseResult.success) {
      return {
        success: false,
        error: `Invalid FAQ data structure: ${parseResult.error.message}`,
      };
    }

    let faqs = parseResult.data.faqs;

    if (location) {
      faqs = faqs.filter((faq) => {
        const locations = faq.locations || ["all"];
        return locations.includes("all") || locations.includes(location);
      });
    }

    if (relatedFeatures && relatedFeatures.length > 0) {
      faqs = faqs.filter((faq) => {
        const faqFeatures = faq.related_features || [];
        return relatedFeatures.some((feature) => faqFeatures.includes(feature));
      });
    }

    if (minPriority !== undefined) {
      faqs = faqs.filter((faq) => (faq.priority ?? 0) >= minPriority);
    }

    faqs = faqs.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

    if (limit !== undefined && limit > 0) {
      faqs = faqs.slice(0, limit);
    }

    return { success: true, faqs };
  } catch (error) {
    return {
      success: false,
      error: `Error loading FAQs: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Get available FAQ locales.
 */
export function getAvailableFaqLocales(): string[] {
  if (!fs.existsSync(FAQ_DATA_PATH)) {
    return [];
  }

  try {
    const files = fs.readdirSync(FAQ_DATA_PATH);
    return files
      .filter((f) => f.endsWith(".yml"))
      .map((f) => f.replace(".yml", ""));
  } catch (error) {
    console.error("Error listing FAQ locales:", error);
    return [];
  }
}
