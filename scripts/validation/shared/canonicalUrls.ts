/**
 * Canonical URL Helpers
 * 
 * Utilities for generating and validating canonical URLs for content.
 */

import type { ContentFile } from "./types";

export function getCanonicalUrl(file: ContentFile): string {
  switch (file.type) {
    case "program":
      return file.locale === "es"
        ? `/es/programas-de-carrera/${file.slug}`
        : `/en/career-programs/${file.slug}`;
    
    case "landing":
      return file.locale === "es"
        ? `/es/${file.slug}`
        : `/us/${file.slug}`;
    
    case "location":
      return file.locale === "es"
        ? `/es/ubicaciones/${file.slug}`
        : `/en/locations/${file.slug}`;
    
    case "page":
      return file.locale === "es"
        ? `/es/${file.slug}`
        : `/us/${file.slug}`;
    
    default:
      return `/${file.slug}`;
  }
}

export function normalizeUrl(url: string): string {
  let normalized = url.startsWith("/") ? url : `/${url}`;
  normalized = normalized.toLowerCase();
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

export const STATIC_ROUTES = [
  "/",
  "/us",
  "/es",
  "/en/career-programs",
  "/es/programas-de-carrera",
  "/en/locations",
  "/es/ubicaciones",
  "/dashboard",
  "/component-showcase",
];

export function buildValidUrlSet(contentFiles: ContentFile[]): Set<string> {
  const validUrls = new Set<string>();
  
  for (const file of contentFiles) {
    validUrls.add(getCanonicalUrl(file));
  }
  
  STATIC_ROUTES.forEach((route) => validUrls.add(route));
  
  return validUrls;
}
