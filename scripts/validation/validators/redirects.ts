/**
 * Redirect Validator
 * 
 * Validates redirect configurations:
 * - Detects conflicts (same URL claimed by multiple pages)
 * - Checks for self-redirects
 * - Detects redirect loops
 * - Validates redirects don't conflict with existing content URLs
 */

import type { Validator, ValidatorResult, ValidationContext, ValidationIssue, RedirectEntry } from "../shared/types";
import { normalizeUrl, getCanonicalUrl } from "../shared/canonicalUrls";

export const redirectValidator: Validator = {
  name: "redirects",
  description: "Validates redirect configurations for conflicts, loops, and self-redirects",
  apiExposed: true,
  estimatedDuration: "fast",
  category: "integrity",

  async run(context: ValidationContext): Promise<ValidatorResult> {
    const startTime = Date.now();
    const errors: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];
    const redirectMap = new Map<string, RedirectEntry>();

    for (const file of context.contentFiles) {
      const redirects = file.meta?.redirects || [];
      const targetUrl = getCanonicalUrl(file);

      for (const redirect of redirects) {
        const normalizedRedirect = normalizeUrl(redirect);

        if (normalizedRedirect === targetUrl) {
          errors.push({
            type: "error",
            code: "SELF_REDIRECT",
            message: `Self-redirect detected: "${normalizedRedirect}" redirects to itself`,
            file: file.filePath,
            suggestion: "Remove this redirect or change the target URL",
          });
          continue;
        }

        if (redirectMap.has(normalizedRedirect)) {
          const existing = redirectMap.get(normalizedRedirect)!;
          errors.push({
            type: "error",
            code: "REDIRECT_CONFLICT",
            message: `Redirect conflict: "${normalizedRedirect}" is claimed by both "${file.filePath}" and "${existing.source.filePath}"`,
            file: file.filePath,
            suggestion: "Remove one of the conflicting redirects",
          });
          continue;
        }

        if (context.validUrls.has(normalizedRedirect)) {
          errors.push({
            type: "error",
            code: "REDIRECT_OVERWRITES_CONTENT",
            message: `Redirect "${normalizedRedirect}" conflicts with an existing content URL`,
            file: file.filePath,
            suggestion: "Choose a different redirect source URL",
          });
          continue;
        }

        redirectMap.set(normalizedRedirect, {
          from: normalizedRedirect,
          to: targetUrl,
          source: file,
        });
      }
    }

    for (const [redirectUrl, { to: target }] of redirectMap) {
      const visited = new Set<string>([redirectUrl]);
      let current = target;

      while (redirectMap.has(current)) {
        if (visited.has(current)) {
          errors.push({
            type: "error",
            code: "REDIRECT_LOOP",
            message: `Redirect loop detected: ${Array.from(visited).join(" -> ")} -> ${current}`,
            suggestion: "Break the redirect chain by removing one of the redirects",
          });
          break;
        }
        visited.add(current);
        current = redirectMap.get(current)!.to;
      }
    }

    context.redirectMap = redirectMap;

    const duration = Date.now() - startTime;
    return {
      name: this.name,
      description: this.description,
      status: errors.length > 0 ? "failed" : warnings.length > 0 ? "warning" : "passed",
      errors,
      warnings,
      duration,
      artifacts: {
        totalRedirects: redirectMap.size,
        redirectMap: Object.fromEntries(
          Array.from(redirectMap.entries()).map(([k, v]) => [k, v.to])
        ),
      },
    };
  },
};
