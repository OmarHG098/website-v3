import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";

const MARKETING_CONTENT_PATH = path.join(process.cwd(), "marketing-content", "programs");
const LANDINGS_CONTENT_PATH = path.join(process.cwd(), "marketing-content", "landings");
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

interface LandingMeta {
  robots?: string;
  priority?: number;
  change_frequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
}

interface AvailableLanding {
  slug: string;
  locale: string;
  title: string;
  meta: LandingMeta;
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
      if (fs.statSync(landingPath).isDirectory()) {
        const files = fs.readdirSync(landingPath).filter(f => f.endsWith(".yml"));
        
        for (const file of files) {
          const locale = file.replace(".yml", "");
          const filePath = path.join(landingPath, file);
          
          try {
            const content = fs.readFileSync(filePath, "utf-8");
            const data = yaml.load(content) as { 
              slug: string; 
              title: string; 
              meta?: LandingMeta 
            };
            
            landings.push({
              slug: data.slug || dir,
              locale,
              title: data.title || dir,
              meta: data.meta || {},
            });
          } catch (parseError) {
            console.error(`Error parsing landing ${filePath}:`, parseError);
          }
        }
      }
    }

    return landings;
  } catch (error) {
    console.error("Error scanning landings:", error);
    return [];
  }
}

function shouldIndex(robots?: string): boolean {
  if (!robots) return true;
  return !robots.toLowerCase().includes("noindex");
}

function getCurrentDate(): string {
  return new Date().toISOString().split("T")[0];
}

function buildSitemapXml(): string {
  const today = getCurrentDate();
  const urls: SitemapUrl[] = [];

  // Static pages
  urls.push({
    loc: `${getBaseUrl()}/`,
    lastmod: today,
    changefreq: "weekly",
    priority: 1.0,
  });

  urls.push({
    loc: `${getBaseUrl()}/learning-paths`,
    lastmod: today,
    changefreq: "weekly",
    priority: 0.9,
  });

  urls.push({
    loc: `${getBaseUrl()}/career-paths`,
    lastmod: today,
    changefreq: "weekly",
    priority: 0.9,
  });

  urls.push({
    loc: `${getBaseUrl()}/skill-boosters`,
    lastmod: today,
    changefreq: "weekly",
    priority: 0.9,
  });

  urls.push({
    loc: `${getBaseUrl()}/tool-mastery`,
    lastmod: today,
    changefreq: "weekly",
    priority: 0.9,
  });

  urls.push({
    loc: `${getBaseUrl()}/career-programs`,
    lastmod: today,
    changefreq: "weekly",
    priority: 0.9,
  });

  urls.push({
    loc: `${getBaseUrl()}/dashboard`,
    lastmod: today,
    changefreq: "daily",
    priority: 0.8,
  });

  urls.push({
    loc: `${getBaseUrl()}/job-guarantee`,
    lastmod: today,
    changefreq: "weekly",
    priority: 0.9,
  });

  urls.push({
    loc: `${getBaseUrl()}/geekforce-career-support`,
    lastmod: today,
    changefreq: "weekly",
    priority: 0.9,
  });

  // Dynamic career program pages from YAML
  const programs = getAvailablePrograms();
  for (const program of programs) {
    // English version
    if (program.locales.includes("en")) {
      urls.push({
        loc: `${getBaseUrl()}/us/career-programs/${program.slug}`,
        lastmod: today,
        changefreq: "weekly",
        priority: 0.8,
      });
    }

    // Spanish version
    if (program.locales.includes("es")) {
      urls.push({
        loc: `${getBaseUrl()}/es/programas-de-carrera/${program.slug}`,
        lastmod: today,
        changefreq: "weekly",
        priority: 0.8,
      });
    }
  }

  // Dynamic landing pages from YAML (only include indexable pages)
  const landings = getAvailableLandings();
  const processedLandingSlugs = new Set<string>();
  
  for (const landing of landings) {
    // Skip if already processed (avoid duplicates for multi-locale landings)
    if (processedLandingSlugs.has(landing.slug)) continue;
    
    // Skip pages marked as noindex
    if (!shouldIndex(landing.meta.robots)) {
      console.log(`[Sitemap] Skipping noindex landing: ${landing.slug}`);
      continue;
    }
    
    processedLandingSlugs.add(landing.slug);
    
    urls.push({
      loc: `${getBaseUrl()}/landing/${landing.slug}`,
      lastmod: today,
      changefreq: landing.meta.change_frequency || "weekly",
      priority: landing.meta.priority || 0.8,
    });
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
  urls.push({ loc: `${getBaseUrl()}/`, label: "Home" });
  urls.push({ loc: `${getBaseUrl()}/learning-paths`, label: "Learning Paths" });
  urls.push({ loc: `${getBaseUrl()}/career-paths`, label: "Career Paths" });
  urls.push({ loc: `${getBaseUrl()}/skill-boosters`, label: "Skill Boosters" });
  urls.push({ loc: `${getBaseUrl()}/tool-mastery`, label: "Tool Mastery" });
  urls.push({ loc: `${getBaseUrl()}/career-programs`, label: "Career Programs" });
  urls.push({ loc: `${getBaseUrl()}/dashboard`, label: "Dashboard" });
  urls.push({ loc: `${getBaseUrl()}/job-guarantee`, label: "Job Guarantee" });
  urls.push({ loc: `${getBaseUrl()}/geekforce-career-support`, label: "GeekForce Career Support" });

  // Dynamic career program pages from YAML
  const programs = getAvailablePrograms();
  for (const program of programs) {
    if (program.locales.includes("en")) {
      urls.push({
        loc: `${getBaseUrl()}/us/career-programs/${program.slug}`,
        label: `${program.slug} (EN)`,
      });
    }
    if (program.locales.includes("es")) {
      urls.push({
        loc: `${getBaseUrl()}/es/programas-de-carrera/${program.slug}`,
        label: `${program.slug} (ES)`,
      });
    }
  }

  // Dynamic landing pages from YAML (only indexable)
  const landings = getAvailableLandings();
  const processedLandingSlugs = new Set<string>();
  
  for (const landing of landings) {
    if (processedLandingSlugs.has(landing.slug)) continue;
    if (!shouldIndex(landing.meta.robots)) continue;
    
    processedLandingSlugs.add(landing.slug);
    urls.push({
      loc: `${getBaseUrl()}/landing/${landing.slug}`,
      label: `Landing: ${landing.title}`,
    });
  }

  return urls;
}
