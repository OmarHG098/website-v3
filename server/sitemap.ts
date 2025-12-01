import * as fs from "fs";
import * as path from "path";

const MARKETING_CONTENT_PATH = path.join(process.cwd(), "marketing-content", "programs");
const BASE_URL = "https://ai-reskilling-platform.replit.app";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface SitemapCache {
  xml: string;
  generatedAt: number;
}

let sitemapCache: SitemapCache | null = null;

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
}

function getAvailablePrograms(): Array<{ slug: string; locales: string[] }> {
  try {
    if (!fs.existsSync(MARKETING_CONTENT_PATH)) {
      return [];
    }

    const programs: Array<{ slug: string; locales: string[] }> = [];
    const dirs = fs.readdirSync(MARKETING_CONTENT_PATH);

    for (const dir of dirs) {
      const programPath = path.join(MARKETING_CONTENT_PATH, dir);
      if (fs.statSync(programPath).isDirectory()) {
        const files = fs.readdirSync(programPath);
        const locales = files
          .filter(f => f.endsWith(".yml"))
          .map(f => f.replace(".yml", ""));
        
        if (locales.length > 0) {
          programs.push({ slug: dir, locales });
        }
      }
    }

    return programs;
  } catch (error) {
    console.error("Error scanning programs:", error);
    return [];
  }
}

function getCurrentDate(): string {
  return new Date().toISOString().split("T")[0];
}

function buildSitemapXml(): string {
  const today = getCurrentDate();
  const urls: SitemapUrl[] = [];

  // Static pages
  urls.push({
    loc: `${BASE_URL}/`,
    lastmod: today,
    changefreq: "weekly",
    priority: 1.0,
  });

  urls.push({
    loc: `${BASE_URL}/learning-paths`,
    lastmod: today,
    changefreq: "weekly",
    priority: 0.9,
  });

  urls.push({
    loc: `${BASE_URL}/career-paths`,
    lastmod: today,
    changefreq: "weekly",
    priority: 0.9,
  });

  urls.push({
    loc: `${BASE_URL}/skill-boosters`,
    lastmod: today,
    changefreq: "weekly",
    priority: 0.9,
  });

  urls.push({
    loc: `${BASE_URL}/tool-mastery`,
    lastmod: today,
    changefreq: "weekly",
    priority: 0.9,
  });

  urls.push({
    loc: `${BASE_URL}/career-programs`,
    lastmod: today,
    changefreq: "weekly",
    priority: 0.9,
  });

  urls.push({
    loc: `${BASE_URL}/dashboard`,
    lastmod: today,
    changefreq: "daily",
    priority: 0.8,
  });

  // Dynamic career program pages from YAML
  const programs = getAvailablePrograms();
  for (const program of programs) {
    // English version
    if (program.locales.includes("en")) {
      urls.push({
        loc: `${BASE_URL}/us/career-programs/${program.slug}`,
        lastmod: today,
        changefreq: "weekly",
        priority: 0.8,
      });
    }

    // Spanish version
    if (program.locales.includes("es")) {
      urls.push({
        loc: `${BASE_URL}/es/programas-de-carrera/${program.slug}`,
        lastmod: today,
        changefreq: "weekly",
        priority: 0.8,
      });
    }
  }

  // Build XML
  const urlEntries = urls
    .map(
      (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

export function getSitemap(): string {
  const now = Date.now();

  // Check if cache exists and is still valid
  if (sitemapCache && (now - sitemapCache.generatedAt) < CACHE_TTL_MS) {
    console.log("[Sitemap] Serving from cache");
    return sitemapCache.xml;
  }

  // Generate fresh sitemap
  console.log("[Sitemap] Generating fresh sitemap");
  const xml = buildSitemapXml();
  
  sitemapCache = {
    xml,
    generatedAt: now,
  };

  return xml;
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
} {
  if (!sitemapCache) {
    return {
      cached: false,
      generatedAt: null,
      ageMinutes: null,
      expiresInMinutes: null,
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
  };
}

export function getSitemapUrls(): Array<{ loc: string; label: string }> {
  const urls: Array<{ loc: string; label: string }> = [];

  // Static pages
  urls.push({ loc: `${BASE_URL}/`, label: "Home" });
  urls.push({ loc: `${BASE_URL}/learning-paths`, label: "Learning Paths" });
  urls.push({ loc: `${BASE_URL}/career-paths`, label: "Career Paths" });
  urls.push({ loc: `${BASE_URL}/skill-boosters`, label: "Skill Boosters" });
  urls.push({ loc: `${BASE_URL}/tool-mastery`, label: "Tool Mastery" });
  urls.push({ loc: `${BASE_URL}/career-programs`, label: "Career Programs" });
  urls.push({ loc: `${BASE_URL}/dashboard`, label: "Dashboard" });

  // Dynamic career program pages from YAML
  const programs = getAvailablePrograms();
  for (const program of programs) {
    if (program.locales.includes("en")) {
      urls.push({
        loc: `${BASE_URL}/us/career-programs/${program.slug}`,
        label: `${program.slug} (EN)`,
      });
    }
    if (program.locales.includes("es")) {
      urls.push({
        loc: `${BASE_URL}/es/programas-de-carrera/${program.slug}`,
        label: `${program.slug} (ES)`,
      });
    }
  }

  return urls;
}
