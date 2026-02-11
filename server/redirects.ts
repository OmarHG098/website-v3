import type { Request, Response, NextFunction } from "express";
import { contentIndex, type RedirectEntry } from "./content-index";

let redirectMap: Map<string, RedirectEntry> | null = null;

function buildRedirectMap(): Map<string, RedirectEntry> {
  const entries = contentIndex.getRedirects();
  const map = new Map<string, RedirectEntry>();

  for (const entry of entries) {
    if (!map.has(entry.from)) {
      map.set(entry.from, entry);
    }
  }

  console.log(`[Redirects] Loaded ${map.size} redirects`);
  return map;
}

function getRedirectMap(): Map<string, RedirectEntry> {
  if (!redirectMap) {
    redirectMap = buildRedirectMap();
  }
  return redirectMap;
}

function normalizePath(urlPath: string): string {
  let normalized = urlPath.toLowerCase();
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
    const status = entry.status || 301;
    console.log(`[Redirects] ${status}: ${req.path} -> ${entry.to}`);
    res.redirect(status, entry.to);
    return;
  }

  next();
}

export function getRedirects(): Array<{ from: string; to: string; type: string; status: number; source: string }> {
  const map = getRedirectMap();
  const result: Array<{ from: string; to: string; type: string; status: number; source: string }> = [];

  for (const [from, entry] of map) {
    result.push({
      from,
      to: entry.to,
      type: entry.type,
      status: entry.status || 301,
      source: entry.source,
    });
  }

  return result;
}

export function clearRedirectCache(): void {
  redirectMap = null;
  console.log("[Redirects] Cache cleared");
}
