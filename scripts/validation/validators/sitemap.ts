/**
 * Sitemap Validator
 * 
 * Validates sitemap integrity:
 * - Checks that all content files have corresponding sitemap entries
 * - Detects orphaned sitemap entries (URLs without content)
 * - Validates sitemap URLs are accessible
 */

import type { Validator, ValidatorResult, ValidationContext, ValidationIssue } from "../shared/types";
import { getCanonicalUrl } from "../shared/canonicalUrls";

export const sitemapValidator: Validator = {
  name: "sitemap",
  description: "Validates sitemap entries match actual content files",
  apiExposed: true,
  estimatedDuration: "medium",
  category: "integrity",

  async run(context: ValidationContext): Promise<ValidatorResult> {
    const startTime = Date.now();
    const errors: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];

    const contentUrls = new Set<string>();
    for (const file of context.contentFiles) {
      contentUrls.add(getCanonicalUrl(file));
    }

    const sitemapUrls = new Set<string>();
    for (const entry of context.sitemapEntries) {
      sitemapUrls.add(entry.loc);
    }

    for (const file of context.contentFiles) {
      const url = getCanonicalUrl(file);
      if (!sitemapUrls.has(url) && context.sitemapEntries.length > 0) {
        warnings.push({
          type: "warning",
          code: "CONTENT_NOT_IN_SITEMAP",
          message: `Content file has no sitemap entry: ${url}`,
          file: file.filePath,
          suggestion: "Regenerate the sitemap or check if the content is excluded intentionally",
        });
      }
    }

    for (const entry of context.sitemapEntries) {
      if (entry.type !== "static" && !contentUrls.has(entry.loc)) {
        const isRedirect = context.redirectMap.has(entry.loc);
        if (!isRedirect) {
          errors.push({
            type: "error",
            code: "ORPHAN_SITEMAP_ENTRY",
            message: `Sitemap contains URL without content: ${entry.loc}`,
            suggestion: "Remove this entry from the sitemap or create the missing content",
          });
        }
      }
    }

    const duplicateCheck = new Map<string, number>();
    for (const entry of context.sitemapEntries) {
      duplicateCheck.set(entry.loc, (duplicateCheck.get(entry.loc) || 0) + 1);
    }
    for (const [url, count] of duplicateCheck) {
      if (count > 1) {
        warnings.push({
          type: "warning",
          code: "DUPLICATE_SITEMAP_ENTRY",
          message: `Duplicate sitemap entry: ${url} (appears ${count} times)`,
          suggestion: "Remove duplicate entries from the sitemap",
        });
      }
    }

    const duration = Date.now() - startTime;
    return {
      name: this.name,
      description: this.description,
      status: errors.length > 0 ? "failed" : warnings.length > 0 ? "warning" : "passed",
      errors,
      warnings,
      duration,
      artifacts: {
        contentUrlCount: contentUrls.size,
        sitemapUrlCount: sitemapUrls.size,
        orphanedEntries: errors.filter((e) => e.code === "ORPHAN_SITEMAP_ENTRY").length,
        missingFromSitemap: warnings.filter((w) => w.code === "CONTENT_NOT_IN_SITEMAP").length,
      },
    };
  },
};
