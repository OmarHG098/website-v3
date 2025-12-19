import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";
import {
  careerProgramSchema,
  landingPageSchema,
  locationPageSchema,
  templatePageSchema,
  experimentUpdateSchema,
  type CareerProgram,
  type LandingPage,
  type LocationPage,
  type TemplatePage,
} from "@shared/schema";
import {
  getSitemap,
  clearSitemapCache,
  getSitemapCacheStatus,
  getSitemapUrls,
} from "./sitemap";
import {
  redirectMiddleware,
  getRedirects,
  clearRedirectCache,
} from "./redirects";
import {
  getSchema,
  getMergedSchemas,
  getAvailableSchemaKeys,
  clearSchemaCache,
} from "./schema-org";
import {
  getRegistryOverview,
  getComponentInfo,
  listVersions,
  loadSchema,
  loadExamples,
  createNewVersion,
  getExampleFilePath,
  saveExample,
} from "./component-registry";
import { editContent, getContentForEdit } from "./content-editor";
import {
  getExperimentManager,
  getOrCreateSessionId,
  getExperimentCookie,
  setExperimentCookie,
  buildVisitorContext,
} from "./experiments";
import { loadImageRegistry } from "./image-registry";
import {
  loadContent,
  listContentSlugs,
  loadCommonData,
} from "./utils/contentLoader";
import { getValidationService } from "../scripts/validation/service";
import { z } from "zod";

const BREATHECODE_HOST =
  process.env.VITE_BREATHECODE_HOST || "https://breathecode.herokuapp.com";

// Schema for career-programs listing page (custom page type)
const careerProgramsListingSchema = z.object({
  slug: z.string(),
  template: z.string(),
  title: z.string(),
  meta: z.object({
    page_title: z.string(),
    description: z.string(),
    redirects: z.array(z.string()).optional(),
    robots: z.string().optional(),
    priority: z.number().optional(),
    change_frequency: z.string().optional(),
  }),
  page_content: z.object({
    hero_title: z.string(),
    hero_subtitle: z.string(),
    search_placeholder: z.string(),
    difficulty_label: z.string(),
    difficulty_all: z.string(),
    difficulty_beginner: z.string(),
    difficulty_intermediate: z.string(),
    difficulty_advanced: z.string(),
    no_results: z.string(),
  }),
  courses: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    duration: z.string(),
    difficulty: z.string(),
    lessons: z.number(),
    link: z.string().optional(),
  })),
});

function loadCareerProgramsListing(locale: string) {
  const result = loadContent({
    contentType: "pages",
    slug: "career-programs",
    schema: careerProgramsListingSchema,
    localeOrVariant: locale,
  });
  
  if (!result.success) {
    console.error(result.error);
    return null;
  }
  
  return result.data;
}

function loadCareerProgram(slug: string, locale: string): CareerProgram | null {
  const result = loadContent({
    contentType: "programs",
    slug,
    schema: careerProgramSchema,
    localeOrVariant: locale,
  });

  if (!result.success) {
    console.error(result.error);
    return null;
  }

  return result.data;
}

function listCareerPrograms(
  locale: string,
): Array<{ slug: string; title: string }> {
  const slugs = listContentSlugs("programs");
  const programs: Array<{ slug: string; title: string }> = [];

  for (const slug of slugs) {
    const program = loadCareerProgram(slug, locale);
    if (program) {
      programs.push({ slug: program.slug, title: program.title });
    }
  }

  return programs;
}

function loadLandingPage(slug: string): LandingPage | null {
  const result = loadContent({
    contentType: "landings",
    slug,
    schema: landingPageSchema,
    localeOrVariant: "promoted",
  });

  if (!result.success) {
    console.error(result.error);
    return null;
  }

  return result.data;
}

function listLandingPages(): Array<{
  slug: string;
  title: string;
  locale: string;
}> {
  const slugs = listContentSlugs("landings");
  const landings: Array<{ slug: string; title: string; locale: string }> = [];

  for (const slug of slugs) {
    const landing = loadLandingPage(slug);
    if (landing) {
      const commonData = loadCommonData("landings", slug);
      const locale = (commonData?.locale as string) || "en";
      landings.push({ slug: landing.slug, title: landing.title, locale });
    }
  }

  return landings;
}

function loadLocationPage(slug: string, locale: string): LocationPage | null {
  const result = loadContent({
    contentType: "locations",
    slug,
    schema: locationPageSchema,
    localeOrVariant: locale,
  });

  if (!result.success) {
    console.error(result.error);
    return null;
  }

  return result.data;
}

function listLocationPages(
  locale: string,
): Array<{
  slug: string;
  name: string;
  city: string;
  country: string;
  region: string;
}> {
  const slugs = listContentSlugs("locations");
  const locations: Array<{
    slug: string;
    name: string;
    city: string;
    country: string;
    region: string;
  }> = [];

  for (const slug of slugs) {
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

  return locations;
}

// Template Pages (marketing-content/pages/)
function loadTemplatePage(slug: string, locale: string): TemplatePage | null {
  const result = loadContent({
    contentType: "pages",
    slug,
    schema: templatePageSchema,
    localeOrVariant: locale,
  });

  if (!result.success) {
    console.error(result.error);
    return null;
  }

  return result.data;
}

function listTemplatePages(
  locale: string,
): Array<{ slug: string; template: string; title: string }> {
  const slugs = listContentSlugs("pages");
  const pages: Array<{ slug: string; template: string; title: string }> = [];

  for (const slug of slugs) {
    const page = loadTemplatePage(slug, locale);
    if (page) {
      pages.push({
        slug: page.slug,
        template: page.template,
        title: page.title,
      });
    }
  }

  return pages;
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
      const webmasterResponse = await fetch(
        "https://breathecode.herokuapp.com/v1/auth/user/me/capability/webmaster",
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            Academy: "4",
          },
        },
      );

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

  // Cloudflare Turnstile endpoints
  app.get("/api/turnstile/site-key", (_req, res) => {
    const siteKey = process.env.TURNSTILE_SITE_KEY;
    if (!siteKey) {
      res.status(500).json({ error: "Turnstile site key not configured" });
      return;
    }
    res.json({ siteKey });
  });

  app.post("/api/turnstile/verify", async (req, res) => {
    try {
      const { token } = req.body;
      const secretKey = process.env.TURNSTILE_SECRET_KEY;

      if (!token) {
        res.status(400).json({ success: false, error: "Token required" });
        return;
      }

      if (!secretKey) {
        res
          .status(500)
          .json({
            success: false,
            error: "Turnstile secret key not configured",
          });
        return;
      }

      const verifyResponse = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secret: secretKey,
            response: token,
          }),
        },
      );

      const result = (await verifyResponse.json()) as {
        success: boolean;
        "error-codes"?: string[];
      };

      if (result.success) {
        res.json({ success: true });
      } else {
        res.status(400).json({
          success: false,
          error: "Verification failed",
          codes: result["error-codes"],
        });
      }
    } catch (error) {
      console.error("Turnstile verification error:", error);
      res.status(500).json({ success: false, error: "Verification failed" });
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
    const forceVariant = req.query.force_variant as string | undefined;
    const forceVersion = req.query.force_version
      ? parseInt(req.query.force_version as string, 10)
      : undefined;

    let program: CareerProgram | null = null;
    let experimentInfo: {
      experiment: string;
      variant: string;
      version: number;
    } | null = null;

    // If force_variant is provided, load that variant directly (for preview)
    if (forceVariant && forceVersion !== undefined) {
      const experimentManager = getExperimentManager();
      const forcedContent = experimentManager.getVariantContent(
        slug,
        {
          experiment_slug: "preview",
          variant_slug: forceVariant,
          variant_version: forceVersion,
          assigned_at: Date.now(),
        },
        locale,
      );
      if (forcedContent) {
        program = forcedContent;
        experimentInfo = {
          experiment: "preview",
          variant: forceVariant,
          version: forceVersion,
        };
      }
    }

    // Normal experiment flow if not forcing a variant
    if (!program) {
      // Get or create session for experiment tracking
      const sessionId = getOrCreateSessionId(req, res);
      const experimentCookie = getExperimentCookie(req);
      const existingAssignments = experimentCookie?.assignments || [];

      // Check for active experiments
      const experimentManager = getExperimentManager();
      const visitorContext = buildVisitorContext(req, sessionId);
      const assignment = experimentManager.getAssignment(
        slug,
        visitorContext,
        existingAssignments,
      );

      if (assignment) {
        // Try to load variant content
        const variantContent = experimentManager.getVariantContent(
          slug,
          assignment,
          locale,
        );
        if (variantContent) {
          program = variantContent;
          experimentInfo = {
            experiment: assignment.experiment_slug,
            variant: assignment.variant_slug,
            version: assignment.variant_version,
          };

          // Update cookie with new assignment
          const updatedAssignments = [
            ...existingAssignments.filter(
              (a) => a.experiment_slug !== assignment.experiment_slug,
            ),
            assignment,
          ];
          setExperimentCookie(res, sessionId, updatedAssignments);
        }
      }
    }

    // Fall back to default content
    if (!program) {
      program = loadCareerProgram(slug, locale);
    }

    if (!program) {
      res.status(404).json({ error: "Career program not found" });
      return;
    }

    // Include experiment info in response for analytics
    res.json({
      ...program,
      _experiment: experimentInfo,
    });
  });

  // Landing pages API
  app.get("/api/landings", (_req, res) => {
    const landings = listLandingPages();
    res.json(landings);
  });

  app.get("/api/landings/:slug", (req, res) => {
    const { slug } = req.params;
    const forceVariant = req.query.force_variant as string | undefined;
    const forceVersion = req.query.force_version
      ? parseInt(req.query.force_version as string, 10)
      : undefined;

    // Get locale from _common.yml
    const commonData = loadCommonData("landings", slug);
    const locale = (commonData?.locale as string) || "en";

    let landing: LandingPage | null = null;
    let experimentInfo: {
      experiment: string;
      variant: string;
      version: number;
    } | null = null;

    // If force_variant is provided, load that variant directly (for preview)
    if (forceVariant && forceVersion !== undefined) {
      const experimentManager = getExperimentManager();
      const forcedContent = experimentManager.getVariantContent(
        slug,
        {
          experiment_slug: "preview",
          variant_slug: forceVariant,
          variant_version: forceVersion,
          assigned_at: Date.now(),
        },
        locale,
        "landings",
      );
      if (forcedContent) {
        landing = forcedContent as LandingPage;
        experimentInfo = {
          experiment: "preview",
          variant: forceVariant,
          version: forceVersion,
        };
      }
    }

    // Fall back to default content
    if (!landing) {
      landing = loadLandingPage(slug);
    }

    if (!landing) {
      res.status(404).json({ error: "Landing page not found" });
      return;
    }

    res.json({ ...landing, locale, _experiment: experimentInfo });
  });

  // Locations API
  app.get("/api/locations", (req, res) => {
    const locale = (req.query.locale as string) || "en";
    const region = req.query.region as string | undefined;
    let locations = listLocationPages(locale);

    if (region) {
      locations = locations.filter((loc) => loc.region === region);
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

  // Template Pages API
  app.get("/api/pages", (req, res) => {
    const locale = (req.query.locale as string) || "en";
    const pages = listTemplatePages(locale);
    res.json(pages);
  });

  // Special handler for career-programs listing page (custom page type)
  app.get("/api/pages/career-programs", (req, res) => {
    const locale = (req.query.locale as string) || "en";
    
    const page = loadCareerProgramsListing(locale);
    
    if (!page) {
      res.status(404).json({ error: "Career programs listing page not found" });
      return;
    }
    
    res.json(page);
  });

  // Special handler for apply page (includes programs and locations from _common.yml)
  app.get("/api/pages/apply", (req, res) => {
    const locale = (req.query.locale as string) || "en";
    
    const page = loadTemplatePage("apply", locale);
    
    if (!page) {
      res.status(404).json({ error: "Apply page not found" });
      return;
    }
    
    // Load common data for programs and locations
    const commonData = loadCommonData("pages", "apply");
    
    res.json({
      ...page,
      programs: commonData?.programs || [],
      locations: commonData?.locations || [],
    });
  });

  // Apply form submission endpoint
  app.post("/api/apply", (req, res) => {
    try {
      const { program, location, firstName, lastName, email, phone, consentMarketing, consentSms, locale } = req.body;
      
      // Validate required fields
      if (!program || !location || !firstName || !lastName || !email || !phone) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }
      
      // Log the application (in production, this would send to a CRM or database)
      console.log("New application received:", {
        program,
        location,
        firstName,
        lastName,
        email,
        phone,
        consentMarketing,
        consentSms,
        locale,
        timestamp: new Date().toISOString(),
      });
      
      // In the future, this could:
      // 1. Send to Breathecode API
      // 2. Add to a CRM
      // 3. Send confirmation email
      // 4. Store in database
      
      res.json({ success: true, message: "Application received" });
    } catch (error) {
      console.error("Error processing application:", error);
      res.status(500).json({ error: "Failed to process application" });
    }
  });

  app.get("/api/pages/:slug", (req, res) => {
    const { slug } = req.params;
    const locale = (req.query.locale as string) || "en";

    const page = loadTemplatePage(slug, locale);

    if (!page) {
      res.status(404).json({ error: "Template page not found" });
      return;
    }

    res.json(page);
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
        const response = await fetch(
          `${BREATHECODE_HOST}/v1/auth/user/me/capability/webmaster`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
              Academy: "4",
            },
          },
        );

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

  // Experiments API endpoints
  app.get("/api/debug/experiments", (req, res) => {
    const experimentManager = getExperimentManager();
    const extendedStats = experimentManager.getExtendedStats();
    res.json({
      stats: extendedStats.experiments,
      totalExperiments: Object.keys(extendedStats.experiments).length,
    });
  });

  app.post("/api/debug/clear-experiment-cache", (req, res) => {
    const experimentManager = getExperimentManager();
    experimentManager.clearCache();
    res.json({ success: true, message: "Experiment cache cleared" });
  });

  // Get available variants for a content type and slug
  app.get("/api/variants/:contentType/:slug", (req, res) => {
    const { contentType, slug } = req.params;

    const validTypes = ["programs", "pages", "landings", "locations"];
    if (!validTypes.includes(contentType)) {
      res.status(400).json({ error: "Invalid content type", validTypes });
      return;
    }

    const experimentManager = getExperimentManager();
    const result = experimentManager.getAvailableVariants(
      contentType as "programs" | "pages" | "landings" | "locations",
      slug,
    );

    if (!result) {
      res.status(404).json({ error: "Content folder not found" });
      return;
    }

    res.json(result);
  });

  // Get experiments for a specific content type and slug
  app.get("/api/experiments/:contentType/:slug", (req, res) => {
    const { contentType, slug } = req.params;

    // Validate content type
    const validTypes = ["programs", "pages", "landings", "locations"];
    if (!validTypes.includes(contentType)) {
      res.status(400).json({
        error: "Invalid content type",
        validTypes,
      });
      return;
    }

    const experimentManager = getExperimentManager();
    const experiments = experimentManager.getExperimentsForContent(
      contentType as "programs" | "pages" | "landings" | "locations",
      slug,
    );

    if (!experiments) {
      res.json({
        experiments: [],
        hasExperimentsFile: false,
        filePath: experimentManager.getExperimentsFilePath(
          contentType as "programs" | "pages" | "landings" | "locations",
          slug,
        ),
      });
      return;
    }

    // Get stats for each experiment (including unique visitors)
    const extendedStats = experimentManager.getExtendedStats();
    const experimentsWithStats = experiments.experiments.map((exp) => ({
      ...exp,
      stats: extendedStats.experiments[exp.slug]?.variant_counts || {},
      unique_visitors:
        extendedStats.experiments[exp.slug]?.unique_visitors || 0,
    }));

    res.json({
      experiments: experimentsWithStats,
      hasExperimentsFile: true,
      filePath: experimentManager.getExperimentsFilePath(
        contentType as "programs" | "pages" | "landings" | "locations",
        slug,
      ),
    });
  });

  // Get single experiment details
  app.get(
    "/api/experiments/:contentType/:contentSlug/:experimentSlug",
    (req, res) => {
      const { contentType, contentSlug, experimentSlug } = req.params;

      const validTypes = ["programs", "pages", "landings", "locations"];
      if (!validTypes.includes(contentType)) {
        res.status(400).json({ error: "Invalid content type", validTypes });
        return;
      }

      const experimentManager = getExperimentManager();
      const experiments = experimentManager.getExperimentsForContent(
        contentType as "programs" | "pages" | "landings" | "locations",
        contentSlug,
      );

      if (!experiments) {
        res.status(404).json({ error: "Experiments file not found" });
        return;
      }

      const experiment = experiments.experiments.find(
        (exp) => exp.slug === experimentSlug,
      );
      if (!experiment) {
        res.status(404).json({ error: "Experiment not found" });
        return;
      }

      const extendedStats = experimentManager.getExtendedStats();
      const expStats = extendedStats.experiments[experimentSlug];
      const experimentWithStats = {
        ...experiment,
        stats: expStats?.variant_counts || {},
        unique_visitors: expStats?.unique_visitors || 0,
      };

      res.json({
        experiment: experimentWithStats,
        contentType,
        contentSlug,
        filePath: experimentManager.getExperimentsFilePath(
          contentType as "programs" | "pages" | "landings" | "locations",
          contentSlug,
        ),
      });
    },
  );

  // Update experiment settings
  app.patch(
    "/api/experiments/:contentType/:contentSlug/:experimentSlug",
    (req, res) => {
      const { contentType, contentSlug, experimentSlug } = req.params;

      const validTypes = ["programs", "pages", "landings", "locations"];
      if (!validTypes.includes(contentType)) {
        res.status(400).json({ error: "Invalid content type", validTypes });
        return;
      }

      // Validate request body against schema
      const parseResult = experimentUpdateSchema.safeParse(req.body);
      if (!parseResult.success) {
        res.status(400).json({
          error: "Invalid update data",
          details: parseResult.error.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        });
        return;
      }

      const validatedUpdates = parseResult.data;

      const experimentManager = getExperimentManager();
      try {
        const result = experimentManager.updateExperiment(
          contentType as "programs" | "pages" | "landings" | "locations",
          contentSlug,
          experimentSlug,
          validatedUpdates,
        );
        res.json(result);
      } catch (error) {
        res.status(400).json({
          error:
            error instanceof Error
              ? error.message
              : "Failed to update experiment",
        });
      }
    },
  );

  // Create new experiment
  app.post("/api/experiments/:contentType/:slug/create", (req, res) => {
    const { contentType, slug } = req.params;

    const validTypes = ["programs", "pages", "landings", "locations"];
    if (!validTypes.includes(contentType)) {
      res.status(400).json({ error: "Invalid content type", validTypes });
      return;
    }

    const {
      experimentName,
      experimentSlug,
      variantA,
      variantB,
      newVariant,
      allocationA,
      maxVisitors,
      targeting,
    } = req.body;

    // Basic validation
    if (!experimentName || !experimentSlug || !variantA) {
      res.status(400).json({
        error:
          "Missing required fields: experimentName, experimentSlug, variantA",
      });
      return;
    }

    if (!variantB && !newVariant) {
      res.status(400).json({
        error: "Either variantB or newVariant must be provided",
      });
      return;
    }

    const experimentManager = getExperimentManager();
    try {
      const result = experimentManager.createExperiment(
        contentType as "programs" | "pages" | "landings" | "locations",
        slug,
        {
          experimentName,
          experimentSlug,
          variantA,
          variantB: variantB || null,
          newVariant: newVariant || null,
          allocationA: allocationA ?? 50,
          maxVisitors: maxVisitors ?? 1000,
          targeting: targeting || {},
        },
      );

      res.json({
        ...result,
        redirectPath: `/private/${contentType}/${slug}/experiment/${experimentSlug}`,
      });
    } catch (error) {
      res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to create experiment",
      });
    }
  });

  // Molecules Showcase API endpoint
  app.get("/api/molecules", (_req, res) => {
    const moleculesPath = path.join(
      process.cwd(),
      "marketing-content",
      "molecules.json",
    );
    try {
      const moleculesData = JSON.parse(fs.readFileSync(moleculesPath, "utf-8"));
      res.json(moleculesData);
    } catch (error) {
      res.status(500).json({
        error: "Failed to load molecules data",
        details: String(error),
      });
    }
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

  app.get("/api/component-registry/:componentType/validate", (req, res) => {
    const { componentType } = req.params;
    const version = req.query.version as string | undefined;

    // Dynamic import to avoid circular dependencies
    import("../scripts/utils/validateComponent")
      .then(({ validateComponent }) => {
        const result = validateComponent(componentType, version);
        res.json(result);
      })
      .catch((error) => {
        res
          .status(500)
          .json({
            error: "Failed to load validation module",
            details: String(error),
          });
      });
  });

  app.get("/api/component-registry/:componentType/versions", (req, res) => {
    const { componentType } = req.params;
    const versions = listVersions(componentType);
    res.json({ versions });
  });

  app.get(
    "/api/component-registry/:componentType/:version/schema",
    (req, res) => {
      const { componentType, version } = req.params;
      const schema = loadSchema(componentType, version);

      if (!schema) {
        res.status(404).json({ error: "Schema not found" });
        return;
      }

      res.json(schema);
    },
  );

  app.get(
    "/api/component-registry/:componentType/:version/examples",
    (req, res) => {
      const { componentType, version } = req.params;
      const examples = loadExamples(componentType, version);
      res.json({ examples });
    },
  );

  app.get(
    "/api/component-registry/:componentType/:version/example-path",
    (req, res) => {
      const { componentType, version } = req.params;
      const filePath = getExampleFilePath(componentType, version);
      res.json({ path: filePath });
    },
  );

  app.post(
    "/api/component-registry/:componentType/create-version",
    (req, res) => {
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
    },
  );

  app.post(
    "/api/component-registry/:componentType/:version/save-example",
    (req, res) => {
      const { componentType, version } = req.params;
      const { exampleName, yamlContent } = req.body;

      if (!exampleName || !yamlContent) {
        res.status(400).json({ error: "exampleName and yamlContent required" });
        return;
      }

      const result = saveExample(
        componentType,
        version,
        exampleName,
        yamlContent,
      );

      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }

      res.json({ success: true });
    },
  );

  // Content editing API
  app.post("/api/content/edit", async (req, res) => {
    try {
      // In development mode, allow without token (using X-Debug-Token or no auth)
      const isDevelopment = process.env.NODE_ENV !== "production";
      const authHeader = req.headers.authorization;
      const debugToken = req.headers["x-debug-token"] as string | undefined;

      // Get token from Authorization header or X-Debug-Token
      let token: string | null = null;
      if (authHeader?.startsWith("Token ")) {
        token = authHeader.slice(6);
      } else if (debugToken) {
        token = debugToken;
      }

      // In production, require valid token
      if (!isDevelopment) {
        if (!token) {
          res.status(401).json({ error: "Authorization required" });
          return;
        }

        // Verify token has edit capabilities
        const capResponse = await fetch(
          "https://breathecode.herokuapp.com/v1/auth/user/me/capability/webmaster",
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
              Academy: "4",
            },
          },
        );

        if (capResponse.status !== 200) {
          res.status(403).json({ error: "Insufficient permissions" });
          return;
        }
      }

      // Support both formats:
      // 1. Original: { contentType, slug, locale, operations: [...] }
      // 2. Simplified: { contentType, slug, locale, operation, sectionIndex, sectionData, variant, version }
      const {
        contentType,
        slug,
        locale,
        operations,
        operation,
        sectionIndex,
        sectionData,
        variant,
        version,
      } = req.body;

      if (!contentType || !slug || !locale) {
        res
          .status(400)
          .json({
            error: "Missing required fields: contentType, slug, locale",
          });
        return;
      }

      // Build operations array if using simplified format (only for update_section)
      let finalOperations = operations;
      if (!operations && operation === "update_section") {
        if (
          sectionIndex === undefined ||
          sectionData === undefined ||
          sectionData === null
        ) {
          res
            .status(400)
            .json({
              error: "update_section requires sectionIndex and sectionData",
            });
          return;
        }
        finalOperations = [
          {
            action: "update_section",
            index: sectionIndex,
            section: sectionData,
          },
        ];
      }

      if (
        !finalOperations ||
        !Array.isArray(finalOperations) ||
        finalOperations.length === 0
      ) {
        res.status(400).json({ error: "Missing operations" });
        return;
      }

      // Only pass variant/version if both are meaningful (not "default" or undefined)
      const effectiveVariant =
        variant && variant !== "default" ? variant : undefined;
      const effectiveVersion =
        effectiveVariant && version !== undefined ? version : undefined;

      const result = await editContent({
        contentType,
        slug,
        locale,
        operations: finalOperations,
        variant: effectiveVariant,
        version: effectiveVersion,
      });

      if (result.success) {
        // Clear relevant caches
        clearSitemapCache();
        clearRedirectCache();

        // Return success with updated sections for immediate UI update
        res.json({ success: true, updatedSections: result.updatedSections });
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

    const result = getContentForEdit(
      contentType as "program" | "landing" | "location",
      slug,
      locale,
    );

    if (result.content) {
      res.json(result.content);
    } else {
      res.status(404).json({ error: result.error });
    }
  });

  // Lead Form API endpoints

  // Get form options (programs and locations for dropdowns)
  app.get("/api/form-options", (req, res) => {
    const locale = (req.query.locale as string) || "en";

    // Get all programs for dropdown
    const programs = listCareerPrograms(locale).map((p) => ({
      slug: p.slug,
      title: p.title,
    }));

    // Get all visible locations grouped by region
    const locationsPath = path.join(
      process.cwd(),
      "marketing-content",
      "locations",
    );
    const locationsList: Array<{
      slug: string;
      name: string;
      city: string;
      country: string;
      region: string;
    }> = [];

    try {
      if (fs.existsSync(locationsPath)) {
        const dirs = fs.readdirSync(locationsPath);
        for (const dir of dirs) {
          const campusPath = path.join(locationsPath, dir, "campus.yml");
          if (fs.existsSync(campusPath)) {
            const campusData = yaml.load(
              fs.readFileSync(campusPath, "utf8"),
            ) as {
              slug: string;
              name: string;
              city: string;
              country: string;
              region?: string;
              visibility?: string;
            };
            if (campusData && campusData.visibility !== "unlisted") {
              locationsList.push({
                slug: campusData.slug,
                name: campusData.name,
                city: campusData.city,
                country: campusData.country,
                region: campusData.region || "other",
              });
            }
          }
        }
      }
    } catch (error) {
      console.error("Error loading locations:", error);
    }

    // Group locations by region
    const regions = [
      {
        slug: "usa-canada",
        label: locale === "es" ? "EE.UU. y Canadá" : "USA & Canada",
      },
      {
        slug: "latam",
        label: locale === "es" ? "Latinoamérica" : "Latin America",
      },
      { slug: "europe", label: locale === "es" ? "Europa" : "Europe" },
      { slug: "online", label: "Online" },
    ];

    res.json({
      programs,
      locations: locationsList,
      regions,
    });
  });

  // Submit lead form
  app.post("/api/leads", async (req, res) => {
    try {
      const leadData = req.body;

      // Validate required fields
      if (!leadData.email) {
        res.status(400).json({ error: "Email is required" });
        return;
      }

      // Build the payload for Breathecode API
      const payload = {
        first_name: leadData.first_name || null,
        last_name: leadData.last_name || null,
        phone: leadData.phone || null,
        email: leadData.email,
        location: leadData.location || null,
        course: leadData.program || null,
        consent: leadData.consent_whatsapp || false,
        sms_consent: leadData.sms_consent || false,
        consent_email: leadData.consent_email || false,
        comment: leadData.comment || null,
        // Session/tracking data
        utm_url: leadData.utm_url || null,
        utm_source: leadData.utm_source || null,
        utm_medium: leadData.utm_medium || null,
        utm_campaign: leadData.utm_campaign || null,
        utm_content: leadData.utm_content || null,
        utm_term: leadData.utm_term || null,
        utm_placement: leadData.utm_placement || null,
        utm_plan: leadData.utm_plan || null,
        // Ad platform click IDs
        gclid: leadData.gclid || null,
        fbclid: leadData.fbclid || null,
        msclkid: leadData.msclkid || null,
        ttclid: leadData.ttclid || null,
        // Referral
        referral: leadData.referral || leadData.ref || null,
        coupon: leadData.coupon || null,
        // Geo data
        latitude: leadData.latitude || null,
        longitude: leadData.longitude || null,
        city: leadData.city || null,
        country: leadData.country || null,
        // Language
        language: leadData.language || "en",
        utm_language: leadData.language || "en",
        browser_lang: leadData.browser_lang || null,
        // Tags and automation
        tags: leadData.tags || "website-lead",
        automations: leadData.automations || "strong",
        action: "submit",
        // Experiment tracking
        experiment_slug: leadData.experiment_slug || null,
        experiment_variant: leadData.experiment_variant || null,
        experiment_version: leadData.experiment_version || null,
        // Turnstile token for bot protection
        token: leadData.token || null,
      };

      // Remove null, undefined, and empty string values from payload
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, value]) => value !== null && value !== undefined && value !== "")
      );

      // Post to Breathecode API
      const response = await fetch(`${BREATHECODE_HOST}/v2/marketing/lead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Breathecode API error:", response.status, errorText);
        res.status(response.status).json({
          error: "Failed to submit lead",
          details: errorText,
        });
        return;
      }

      const result = await response.json();
      res.json({ success: true, data: result });
    } catch (error) {
      console.error("Lead submission error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Image Registry API endpoint
  app.get("/api/image-registry", (req, res) => {
    const registry = loadImageRegistry();
    if (!registry) {
      res.status(500).json({ error: "Failed to load image registry" });
      return;
    }
    res.json(registry);
  });

  // ============================================
  // Validation API Endpoints
  // ============================================

  // List available validators
  app.get("/api/validation/validators", (_req, res) => {
    const service = getValidationService();
    const validators = service.getAvailableValidators();
    res.json({
      validators,
      total: validators.length,
    });
  });

  // Run all or specific validators
  app.post("/api/validation/run", async (req, res) => {
    try {
      const { validators: validatorNames, includeArtifacts } = req.body;

      const service = getValidationService();

      // Clear previous context to get fresh data
      service.clearContext();
      await service.buildContext();

      const result = await service.runValidators({
        validators: validatorNames,
        includeArtifacts: includeArtifacts ?? false,
      });

      res.json(result);
    } catch (error) {
      console.error("Validation error:", error);
      res.status(500).json({
        error: "Validation failed",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Run a single validator
  app.post("/api/validation/run/:name", async (req, res) => {
    try {
      const { name } = req.params;
      const { includeArtifacts } = req.body;

      const service = getValidationService();

      // Clear previous context to get fresh data
      service.clearContext();
      await service.buildContext();

      const result = await service.runSingleValidator(
        name,
        includeArtifacts ?? false,
      );

      res.json(result);
    } catch (error) {
      console.error("Validation error:", error);
      res.status(500).json({
        error: "Validation failed",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Get validation context info (for debugging)
  app.get("/api/validation/context", async (_req, res) => {
    try {
      const service = getValidationService();
      let context = service.getContext();

      if (!context) {
        await service.buildContext();
        context = service.getContext();
      }

      if (!context) {
        res.status(500).json({ error: "Failed to build context" });
        return;
      }

      // contentFiles is a flat array - count by type
      const contentFiles = context.contentFiles;
      const typeCounts = {
        programs: contentFiles.filter((f) => f.type === "program").length,
        landings: contentFiles.filter((f) => f.type === "landing").length,
        locations: contentFiles.filter((f) => f.type === "location").length,
        pages: contentFiles.filter((f) => f.type === "page").length,
      };

      res.json({
        contentFiles: typeCounts,
        totalFiles: contentFiles.length,
        validUrls: context.validUrls.size,
        availableSchemas: context.availableSchemas.length,
        redirects: context.redirectMap.size,
      });
    } catch (error) {
      console.error("Context build error:", error);
      res.status(500).json({ error: "Failed to get context" });
    }
  });

  // Clear validation cache
  app.post("/api/validation/clear-cache", (_req, res) => {
    const service = getValidationService();
    service.clearContext();
    res.json({ success: true, message: "Validation cache cleared" });
  });

  // ============================================
  // AI Content Adaptation API
  // ============================================

  // Adapt content using AI with layered context
  app.post("/api/content/adapt-with-ai", async (req, res) => {
    try {
      const { getContentAdapter } = await import("./ai");

      const {
        contentType,
        contentSlug,
        targetComponent,
        targetVersion,
        targetVariant,
        sourceYaml,
        targetExampleYaml,
        targetStructure,
        userOverrides,
      } = req.body;

      // Validate required fields
      if (
        !contentType ||
        !contentSlug ||
        !targetComponent ||
        !targetVersion ||
        !sourceYaml
      ) {
        res.status(400).json({
          error: "Missing required fields",
          required: [
            "contentType",
            "contentSlug",
            "targetComponent",
            "targetVersion",
            "sourceYaml",
          ],
        });
        return;
      }

      // Validate content type
      const validTypes = ["programs", "pages", "landings", "locations"];
      if (!validTypes.includes(contentType)) {
        res.status(400).json({
          error: "Invalid content type",
          validTypes,
        });
        return;
      }

      const adapter = getContentAdapter();
      // Use structured output for schema-enforced AI responses
      const result = await adapter.adaptStructured({
        contentType,
        contentSlug,
        targetComponent,
        targetVersion,
        targetVariant,
        sourceYaml,
        targetExampleYaml,
        targetStructure,
        userOverrides,
      });

      res.json(result);
    } catch (error) {
      console.error("AI adaptation error:", error);
      res.status(500).json({
        error: "AI adaptation failed",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Clear AI context cache
  app.post("/api/content/clear-ai-cache", (_req, res) => {
    try {
      const { getContentAdapter } = require("./ai");
      const adapter = getContentAdapter();
      adapter.clearCache();
      res.json({ success: true, message: "AI context cache cleared" });
    } catch (error) {
      res.status(500).json({
        error: "Failed to clear cache",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
