import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";

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

interface ContentMeta {
  robots?: string;
  priority?: number;
  change_frequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  redirects?: string[];
}

interface AvailableProgram {
  slug: string;
  locale: string;
  title: string;
  meta: ContentMeta;
}

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

      const files = fs.readdirSync(programPath).filter(f => f.endsWith(".yml"));

      for (const file of files) {
        const locale = file.replace(".yml", "");
        const filePath = path.join(programPath, file);


        try {
          const content = fs.readFileSync(filePath, "utf-8");
          const data = yaml.load(content) as {
            slug?: string;
            title?: string;
            meta?: ContentMeta;
          };

          programs.push({
            slug: data.slug || dir,
            locale,
            title: data.title || dir,
            meta: data.meta || {},
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

interface LocationMeta {
  robots?: string;
  priority?: number;
  change_frequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
}

interface AvailableLocation {
  slug: string;
  locale: string;
  name: string;
  visibility: string;
  meta: LocationMeta;
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
          meta?: LocationMeta;
        };

        if (data.visibility === "listed") {
          locations.push({
            slug: data.slug || slug,
            locale,
            name: data.name || slug,
            visibility: data.visibility || "listed",
            meta: data.meta || {},
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

// Template pages interface
interface TemplateMeta {
  robots?: string;
  priority?: number;
  change_frequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
}

interface AvailableTemplatePage {
  slug: string;
  locale: string;
  template: string;
  title: string;
  meta: TemplateMeta;
}

// Template pages URL routing (slug to URL path mapping)
const templatePageRoutes: Record<string, { en: string; es: string }> = {
  "job-guarantee": {
    en: "/us/job-guarantee",
    es: "/es/garantia-empleo",
  },
};

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

      const files = fs.readdirSync(pagePath).filter(f => 
        f.endsWith(".yml") && !f.includes(".v") // Exclude variant files
      );

      for (const file of files) {
        const locale = file.replace(".yml", "");
        // Only process locale files (en.yml, es.yml)
        if (!["en", "es"].includes(locale)) continue;

        const filePath = path.join(pagePath, file);

        try {
          const content = fs.readFileSync(filePath, "utf-8");
          const data = yaml.load(content) as {
            slug?: string;
            template?: string;
            title?: string;
            meta?: TemplateMeta;
          };

          pages.push({
            slug: data.slug || dir,
            locale,
            template: data.template || dir.replace(/-/g, "_"),
            title: data.title || dir,
            meta: data.meta || {},
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

  // Dynamic career program pages from YAML (only include indexable pages)
  const programs = getAvailablePrograms();
  for (const program of programs) {
    // Skip pages marked as noindex
    if (!shouldIndex(program.meta.robots)) {
      console.log(`[Sitemap] Skipping noindex program: ${program.slug} (${program.locale})`);
      continue;
    }

    const url = program.locale === "es"
      ? `${getBaseUrl()}/es/programas-de-carrera/${program.slug}`
      : `${getBaseUrl()}/us/career-programs/${program.slug}`;

    urls.push({
      loc: url,
      lastmod: today,
      changefreq: program.meta.change_frequency || "weekly",
      priority: program.meta.priority || 0.8,
    });
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

  // Dynamic location pages from YAML (only include indexable pages)
  const locations = getAvailableLocations();
  for (const location of locations) {
    // Skip pages marked as noindex
    if (!shouldIndex(location.meta.robots)) {
      console.log(`[Sitemap] Skipping noindex location: ${location.slug} (${location.locale})`);
      continue;
    }

    const url = location.locale === "es"
      ? `${getBaseUrl()}/es/ubicacion/${location.slug}`
      : `${getBaseUrl()}/us/location/${location.slug}`;

    urls.push({
      loc: url,
      lastmod: today,
      changefreq: location.meta.change_frequency || "monthly",
      priority: location.meta.priority || 0.8,
    });
  }

  // Dynamic template pages from YAML (marketing-content/pages/)
  const templatePages = getAvailableTemplatePages();
  for (const page of templatePages) {
    // Skip pages marked as noindex
    if (!shouldIndex(page.meta.robots)) {
      console.log(`[Sitemap] Skipping noindex template page: ${page.slug} (${page.locale})`);
      continue;
    }

    // Get URL from routing map, or generate default
    const routes = templatePageRoutes[page.slug];
    let url: string;
    if (routes) {
      url = `${getBaseUrl()}${routes[page.locale as "en" | "es"] || routes.en}`;
    } else {
      // Default routing pattern
      url = page.locale === "es"
        ? `${getBaseUrl()}/es/${page.slug}`
        : `${getBaseUrl()}/us/${page.slug}`;
    }

    urls.push({
      loc: url,
      lastmod: today,
      changefreq: page.meta.change_frequency || "weekly",
      priority: page.meta.priority || 0.8,
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

  // Dynamic career program pages from YAML (only indexable)
  const programs = getAvailablePrograms();
  for (const program of programs) {
    if (!shouldIndex(program.meta.robots)) continue;

    const url = program.locale === "es"
      ? `${getBaseUrl()}/es/programas-de-carrera/${program.slug}`
      : `${getBaseUrl()}/us/career-programs/${program.slug}`;
    const localeLabel = program.locale === "es" ? "ES" : "EN";

    urls.push({
      loc: url,
      label: `${program.title} (${localeLabel})`,
    });
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
