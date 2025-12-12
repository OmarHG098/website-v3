/**
 * Redirect Manager
 * 
 * Scans YAML content files and builds a redirect map for 301 redirects.
 * Used by Express middleware to serve redirects at runtime.
 */

import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";
import type { Request, Response, NextFunction } from "express";

const PROGRAMS_PATH = path.join(process.cwd(), "marketing-content", "programs");
const LANDINGS_PATH = path.join(process.cwd(), "marketing-content", "landings");

interface ContentMeta {
  redirects?: string[];
}

interface RedirectEntry {
  target: string;
  source: string;
  type: "program" | "landing";
}

let redirectMap: Map<string, RedirectEntry> | null = null;
let lastScanTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute cache

function getCanonicalUrl(type: "program" | "landing", slug: string, locale: string): string {
  if (type === "program") {
    return locale === "es"
      ? `/es/programas-de-carrera/${slug}`
      : `/en/career-programs/${slug}`;
  } else {
    return `/landing/${slug}`;
  }
}

function scanDirectory(dirPath: string, type: "program" | "landing"): Map<string, RedirectEntry> {
  const redirects = new Map<string, RedirectEntry>();

  if (!fs.existsSync(dirPath)) {
    return redirects;
  }

  const dirs = fs.readdirSync(dirPath);

  for (const dir of dirs) {
    const contentPath = path.join(dirPath, dir);
    if (!fs.statSync(contentPath).isDirectory()) continue;

    const yamlFiles = fs.readdirSync(contentPath).filter((f) => f.endsWith(".yml"));

    for (const yamlFile of yamlFiles) {
      const filePath = path.join(contentPath, yamlFile);
      const locale = yamlFile.replace(".yml", "");

      try {
        const content = fs.readFileSync(filePath, "utf-8");
        const data = yaml.load(content) as {
          slug?: string;
          meta?: ContentMeta;
        };

        const slug = data.slug || dir;
        const targetUrl = getCanonicalUrl(type, slug, locale);
        const sourceRedirects = data.meta?.redirects || [];

        for (const redirect of sourceRedirects) {
          let normalizedRedirect = redirect.startsWith("/") ? redirect : `/${redirect}`;
          normalizedRedirect = normalizedRedirect.toLowerCase();
          if (normalizedRedirect.length > 1 && normalizedRedirect.endsWith("/")) {
            normalizedRedirect = normalizedRedirect.slice(0, -1);
          }
          
          // Only add if not already claimed (first one wins - conflicts should be caught by validator)
          if (!redirects.has(normalizedRedirect)) {
            redirects.set(normalizedRedirect, {
              target: targetUrl,
              source: filePath,
              type,
            });
          }
        }
      } catch (err) {
        console.error(`[Redirects] Error parsing ${filePath}:`, err);
      }
    }
  }

  return redirects;
}

function buildRedirectMap(): Map<string, RedirectEntry> {
  const map = new Map<string, RedirectEntry>();

  const programRedirects = scanDirectory(PROGRAMS_PATH, "program");
  const landingRedirects = scanDirectory(LANDINGS_PATH, "landing");

  // Merge all redirects
  for (const [url, entry] of programRedirects) {
    map.set(url, entry);
  }
  for (const [url, entry] of landingRedirects) {
    if (!map.has(url)) {
      map.set(url, entry);
    }
  }

  console.log(`[Redirects] Loaded ${map.size} redirects`);
  return map;
}

function getRedirectMap(): Map<string, RedirectEntry> {
  const now = Date.now();

  if (!redirectMap || now - lastScanTime > CACHE_TTL_MS) {
    redirectMap = buildRedirectMap();
    lastScanTime = now;
  }

  return redirectMap;
}

function normalizePath(path: string): string {
  let normalized = path.toLowerCase();
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

export function redirectMiddleware(req: Request, res: Response, next: NextFunction): void {
  const map = getRedirectMap();
  const normalizedPath = normalizePath(req.path);
  const entry = map.get(normalizedPath);

  if (entry) {
    console.log(`[Redirects] 301: ${req.path} -> ${entry.target}`);
    res.redirect(301, entry.target);
    return;
  }

  next();
}

export function getRedirects(): Array<{ from: string; to: string; type: string }> {
  const map = getRedirectMap();
  const result: Array<{ from: string; to: string; type: string }> = [];

  for (const [from, entry] of map) {
    result.push({
      from,
      to: entry.target,
      type: entry.type,
    });
  }

  return result;
}

export function clearRedirectCache(): void {
  redirectMap = null;
  lastScanTime = 0;
  console.log("[Redirects] Cache cleared");
}
