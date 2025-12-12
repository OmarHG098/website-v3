import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as yaml from "js-yaml";
import * as fs from "fs";
import * as path from "path";
import { careerProgramSchema, landingPageSchema, locationPageSchema, type CareerProgram, type LandingPage, type LocationPage } from "@shared/schema";
import { getSitemap, clearSitemapCache, getSitemapCacheStatus, getSitemapUrls } from "./sitemap";
import { redirectMiddleware, getRedirects, clearRedirectCache } from "./redirects";
import { getSchema, getMergedSchemas, getAvailableSchemaKeys, clearSchemaCache } from "./schema-org";
import { 
  getRegistryOverview, 
  getComponentInfo, 
  listVersions, 
  loadSchema, 
  loadExamples, 
  createNewVersion,
  getExampleFilePath 
} from "./component-registry";
import { editContent, getContentForEdit } from "./content-editor";

const BREATHECODE_HOST = process.env.VITE_BREATHECODE_HOST || "https://breathecode.herokuapp.com";

const MARKETING_CONTENT_PATH = path.join(process.cwd(), "marketing-content", "programs");
const LANDINGS_CONTENT_PATH = path.join(process.cwd(), "marketing-content", "landings");
const LOCATIONS_CONTENT_PATH = path.join(process.cwd(), "marketing-content", "locations");

function loadCareerProgram(slug: string, locale: string): CareerProgram | null {
  try {
    const filePath = path.join(MARKETING_CONTENT_PATH, slug, `${locale}.yml`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = yaml.load(fileContent);

    const result = careerProgramSchema.safeParse(data);
    if (!result.success) {
      console.error(`Invalid YAML structure for ${slug}/${locale}:`, result.error);
      return null;
    }

    return result.data;
  } catch (error) {
    console.error(`Error loading career program ${slug}/${locale}:`, error);
    return null;
  }
}

function listCareerPrograms(locale: string): Array<{ slug: string; title: string }> {
  try {
    if (!fs.existsSync(MARKETING_CONTENT_PATH)) {
      return [];
    }

    const programs: Array<{ slug: string; title: string }> = [];
    const dirs = fs.readdirSync(MARKETING_CONTENT_PATH);

    for (const dir of dirs) {
      const programPath = path.join(MARKETING_CONTENT_PATH, dir);
      if (fs.statSync(programPath).isDirectory()) {
        const program = loadCareerProgram(dir, locale);
        if (program) {
          programs.push({ slug: program.slug, title: program.title });
        }
      }
    }

    return programs;
  } catch (error) {
    console.error("Error listing career programs:", error);
    return [];
  }
}

function loadLandingPage(slug: string, locale: string): LandingPage | null {
  try {
    const filePath = path.join(LANDINGS_CONTENT_PATH, slug, `${locale}.yml`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = yaml.load(fileContent);

    const result = landingPageSchema.safeParse(data);
    if (!result.success) {
      console.error(`Invalid YAML structure for landing ${slug}/${locale}:`, result.error);
      return null;
    }

    return result.data;
  } catch (error) {
    console.error(`Error loading landing page ${slug}/${locale}:`, error);
    return null;
  }
}

function listLandingPages(locale: string): Array<{ slug: string; title: string }> {
  try {
    if (!fs.existsSync(LANDINGS_CONTENT_PATH)) {
      return [];
    }

    const landings: Array<{ slug: string; title: string }> = [];
    const dirs = fs.readdirSync(LANDINGS_CONTENT_PATH);

    for (const dir of dirs) {
      const landingPath = path.join(LANDINGS_CONTENT_PATH, dir);
      if (fs.statSync(landingPath).isDirectory()) {
        const landing = loadLandingPage(dir, locale);
        if (landing) {
          landings.push({ slug: landing.slug, title: landing.title });
        }
      }
    }

    return landings;
  } catch (error) {
    console.error("Error listing landing pages:", error);
    return [];
  }
}

function loadLocationPage(slug: string, locale: string): LocationPage | null {
  try {
    const locationDir = path.join(LOCATIONS_CONTENT_PATH, slug);
    const campusPath = path.join(locationDir, "campus.yml");
    const localePath = path.join(locationDir, `${locale}.yml`);

    if (!fs.existsSync(campusPath) || !fs.existsSync(localePath)) {
      return null;
    }

    const campusContent = fs.readFileSync(campusPath, "utf8");
    const localeContent = fs.readFileSync(localePath, "utf8");
    
    const campusData = yaml.load(campusContent) as Record<string, unknown>;
    const localeData = yaml.load(localeContent) as Record<string, unknown>;

    const mergedData = { ...campusData, ...localeData };

    const result = locationPageSchema.safeParse(mergedData);
    if (!result.success) {
      console.error(`Invalid YAML structure for location ${slug}/${locale}:`, result.error);
      return null;
    }

    // Automatically inject organization schema as parentOrganization for all locations
    const locationData = result.data;
    if (!locationData.schema) {
      locationData.schema = { include: ["organization"] };
    } else if (!locationData.schema.include) {
      locationData.schema.include = ["organization"];
    } else if (!locationData.schema.include.includes("organization")) {
      locationData.schema.include = ["organization", ...locationData.schema.include];
    }

    return locationData;
  } catch (error) {
    console.error(`Error loading location page ${slug}/${locale}:`, error);
    return null;
  }
}

function listLocationPages(locale: string): Array<{ slug: string; name: string; city: string; country: string; region: string }> {
  try {
    if (!fs.existsSync(LOCATIONS_CONTENT_PATH)) {
      return [];
    }

    const locations: Array<{ slug: string; name: string; city: string; country: string; region: string }> = [];
    const entries = fs.readdirSync(LOCATIONS_CONTENT_PATH, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const slug = entry.name;
        const location = loadLocationPage(slug, locale);
        if (location && location.visibility === "listed") {
          locations.push({
            slug: location.slug,
            name: location.name,
            city: location.city,
            country: location.country,
            region: location.region,
          });
        }
      }
    }

    return locations;
  } catch (error) {
    console.error("Error listing location pages:", error);
    return [];
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply redirect middleware for 301 redirects from YAML content
  app.use(redirectMiddleware);

  app.post("/api/debug/validate-token", async (req, res) => {
    try {
      const { token } = req.body;

      if (!token) {
        res.status(400).json({ valid: false, error: "Token required" });
        return;
      }

      // Check webmaster capability
      const webmasterResponse = await fetch("https://breathecode.herokuapp.com/v1/auth/user/me/capability/webmaster", {
        method: "GET",
        headers: {
          "Authorization": `Token ${token}`,
          "Academy": "4",
        },
      });

      const hasWebmaster = webmasterResponse.status === 200;

      // If has webmaster, they get all capabilities
      // In future, we could check for more granular capabilities from the API
      const capabilities = {
        webmaster: hasWebmaster,
        content_read: hasWebmaster,
        content_edit_text: hasWebmaster,
        content_edit_structure: hasWebmaster,
        content_edit_media: hasWebmaster,
        content_publish: hasWebmaster,
      };

      if (hasWebmaster) {
        res.json({ valid: true, capabilities });
      } else {
        res.json({ valid: false, capabilities });
      }
    } catch (error) {
      console.error("Token validation error:", error);
      res.json({ valid: false, capabilities: {} });
    }
  });

  app.get("/api/career-programs", (req, res) => {
    const locale = (req.query.locale as string) || "en";
    const _location = req.query.location as string | undefined;
    const programs = listCareerPrograms(locale);
    res.json(programs);
  });

  app.get("/api/career-programs/:slug", (req, res) => {
    const { slug } = req.params;
    const locale = (req.query.locale as string) || "en";

    const program = loadCareerProgram(slug, locale);

    if (!program) {
      res.status(404).json({ error: "Career program not found" });
      return;
    }

    res.json(program);
  });

  // Landing pages API
  app.get("/api/landings", (req, res) => {
    const locale = (req.query.locale as string) || "en";
    const landings = listLandingPages(locale);
    res.json(landings);
  });

  app.get("/api/landings/:slug", (req, res) => {
    const { slug } = req.params;
    const locale = (req.query.locale as string) || "en";

    const landing = loadLandingPage(slug, locale);

    if (!landing) {
      res.status(404).json({ error: "Landing page not found" });
      return;
    }

    res.json(landing);
  });

  // Locations API
  app.get("/api/locations", (req, res) => {
    const locale = (req.query.locale as string) || "en";
    const region = req.query.region as string | undefined;
    let locations = listLocationPages(locale);
    
    if (region) {
      locations = locations.filter(loc => loc.region === region);
    }
    
    res.json(locations);
  });

  app.get("/api/locations/:slug", (req, res) => {
    const { slug } = req.params;
    const locale = (req.query.locale as string) || "en";

    const location = loadLocationPage(slug, locale);

    if (!location) {
      res.status(404).json({ error: "Location not found" });
      return;
    }

    res.json(location);
  });

  // Dynamic sitemap with caching
  app.get("/sitemap.xml", (req, res) => {
    const xml = getSitemap();
    res.set("Content-Type", "application/xml");
    res.set("Cache-Control", "public, max-age=3600"); // Browser cache for 1 hour
    res.send(xml);
  });

  // Sitemap cache status (for debug tools)
  app.get("/api/debug/sitemap-cache-status", (req, res) => {
    const status = getSitemapCacheStatus();
    res.json(status);
  });

  // Sitemap URLs as JSON (for debug tools)
  app.get("/api/debug/sitemap-urls", (req, res) => {
    const urls = getSitemapUrls();
    res.json(urls);
  });

  // Clear sitemap cache (requires token validation)
  app.post("/api/debug/clear-sitemap-cache", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.replace("Token ", "");

      // In development mode, allow without token
      const isDevelopment = process.env.NODE_ENV !== "production";

      if (!isDevelopment && !token) {
        res.status(401).json({ error: "Authorization required" });
        return;
      }

      // Validate token in production
      if (!isDevelopment && token) {
        const response = await fetch(`${BREATHECODE_HOST}/v1/auth/user/me/capability/webmaster`, {
          method: "GET",
          headers: {
            "Authorization": `Token ${token}`,
            "Academy": "4",
          },
        });

        if (response.status !== 200) {
          res.status(403).json({ error: "Invalid or unauthorized token" });
          return;
        }
      }

      const result = clearSitemapCache();
      res.json(result);
    } catch (error) {
      console.error("Error clearing sitemap cache:", error);
      res.status(500).json({ error: "Failed to clear cache" });
    }
  });

  // Get active redirects (for debug tools)
  app.get("/api/debug/redirects", (req, res) => {
    const redirects = getRedirects();
    res.json({
      count: redirects.length,
      redirects,
    });
  });

  // Clear redirect cache (for debug tools)
  app.post("/api/debug/clear-redirect-cache", (req, res) => {
    clearRedirectCache();
    res.json({ success: true, message: "Redirect cache cleared" });
  });

  // Schema.org API endpoints
  app.get("/api/schema", (req, res) => {
    const keys = getAvailableSchemaKeys();
    res.json({ available: keys });
  });

  app.get("/api/schema/:key", (req, res) => {
    const { key } = req.params;
    const locale = (req.query.locale as string) || "en";
    
    const schema = getSchema(key, locale);
    
    if (!schema) {
      res.status(404).json({ error: "Schema not found" });
      return;
    }
    
    res.json(schema);
  });

  app.post("/api/schema/merge", (req, res) => {
    const { include, overrides } = req.body;
    const locale = (req.query.locale as string) || "en";
    
    if (!include || !Array.isArray(include)) {
      res.status(400).json({ error: "include array required" });
      return;
    }
    
    const schemas = getMergedSchemas({ include, overrides }, locale);
    res.json({ schemas });
  });

  app.post("/api/debug/clear-schema-cache", (req, res) => {
    clearSchemaCache();
    res.json({ success: true, message: "Schema cache cleared" });
  });

  // Component Registry API endpoints
  app.get("/api/component-registry", (req, res) => {
    const overview = getRegistryOverview();
    res.json(overview);
  });

  app.get("/api/component-registry/:componentType", (req, res) => {
    const { componentType } = req.params;
    const info = getComponentInfo(componentType);
    
    if (!info) {
      res.status(404).json({ error: "Component not found" });
      return;
    }
    
    res.json(info);
  });

  app.get("/api/component-registry/:componentType/versions", (req, res) => {
    const { componentType } = req.params;
    const versions = listVersions(componentType);
    res.json({ versions });
  });

  app.get("/api/component-registry/:componentType/:version/schema", (req, res) => {
    const { componentType, version } = req.params;
    const schema = loadSchema(componentType, version);
    
    if (!schema) {
      res.status(404).json({ error: "Schema not found" });
      return;
    }
    
    res.json(schema);
  });

  app.get("/api/component-registry/:componentType/:version/examples", (req, res) => {
    const { componentType, version } = req.params;
    const examples = loadExamples(componentType, version);
    res.json({ examples });
  });

  app.get("/api/component-registry/:componentType/:version/example-path", (req, res) => {
    const { componentType, version } = req.params;
    const filePath = getExampleFilePath(componentType, version);
    res.json({ path: filePath });
  });

  app.post("/api/component-registry/:componentType/create-version", (req, res) => {
    const { componentType } = req.params;
    const { baseVersion } = req.body;
    
    if (!baseVersion) {
      res.status(400).json({ error: "baseVersion required" });
      return;
    }
    
    const result = createNewVersion(componentType, baseVersion);
    
    if (!result.success) {
      res.status(400).json({ error: result.error });
      return;
    }
    
    res.json({ success: true, newVersion: result.newVersion });
  });

  // Content editing API
  app.post("/api/content/edit", async (req, res) => {
    try {
      // Validate token and capabilities
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Token ")) {
        res.status(401).json({ error: "Authorization required" });
        return;
      }
      
      const token = authHeader.slice(6);
      
      // Verify token has edit capabilities
      const capResponse = await fetch("https://breathecode.herokuapp.com/v1/auth/user/me/capability/webmaster", {
        method: "GET",
        headers: {
          "Authorization": `Token ${token}`,
          "Academy": "4",
        },
      });
      
      if (capResponse.status !== 200) {
        res.status(403).json({ error: "Insufficient permissions" });
        return;
      }
      
      const { contentType, slug, locale, operations } = req.body;
      
      if (!contentType || !slug || !locale || !operations) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }
      
      const result = await editContent({ contentType, slug, locale, operations });
      
      if (result.success) {
        // Clear relevant caches
        clearSitemapCache();
        clearRedirectCache();
        
        res.json({ success: true });
      } else {
        res.status(400).json({ error: result.error });
      }
    } catch (error) {
      console.error("Content edit error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/content/:contentType/:slug", (req, res) => {
    const { contentType, slug } = req.params;
    const locale = (req.query.locale as string) || "en";
    
    if (!["program", "landing", "location"].includes(contentType)) {
      res.status(400).json({ error: "Invalid content type" });
      return;
    }
    
    const result = getContentForEdit(contentType as "program" | "landing" | "location", slug, locale);
    
    if (result.content) {
      res.json(result.content);
    } else {
      res.status(404).json({ error: result.error });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
