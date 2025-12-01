import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as yaml from "js-yaml";
import * as fs from "fs";
import * as path from "path";
import { careerProgramSchema, type CareerProgram } from "@shared/schema";
import {
  getSitemap,
  clearSitemapCache,
  getSitemapCacheStatus,
  getSitemapUrls,
} from "./sitemap";

const BREATHECODE_HOST =
  process.env.VITE_BREATHECODE_HOST || "https://breathecode.herokuapp.com";

const MARKETING_CONTENT_PATH = path.join(
  process.cwd(),
  "marketing-content",
  "programs",
);

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
      console.error(
        `Invalid YAML structure for ${slug}/${locale}:`,
        result.error,
      );
      return null;
    }

    return result.data;
  } catch (error) {
    console.error(`Error loading career program ${slug}/${locale}:`, error);
    return null;
  }
}

function listCareerPrograms(
  locale: string,
): Array<{ slug: string; title: string }> {
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

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/debug/validate-token", async (req, res) => {
    try {
      const { token } = req.body;

      console.log("[validate-token] Request received");
      console.log("[validate-token] Token present:", !!token);

      if (!token) {
        console.log("[validate-token] No token provided");
        res.status(400).json({ valid: false, error: "Token required" });
        return;
      }

      const url = "https://breathecode.herokuapp.com/v1/auth/user/me/capability/webmaster";
      console.log("[validate-token] Calling Breathecode API:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          Academy: "4",
        },
      });

      console.log("[validate-token] Breathecode response status:", response.status);

      const responseText = await response.text();
      console.log("[validate-token] Breathecode response body:", responseText);

      if (response.status === 200) {
        console.log("[validate-token] Token is VALID");
        res.json({ valid: true });
      } else {
        console.log("[validate-token] Token is INVALID");
        res.json({ valid: false });
      }
    } catch (error) {
      console.error("[validate-token] Error:", error);
      res.json({ valid: false });
    }
  });

  app.get("/api/career-programs", (req, res) => {
    const locale = (req.query.locale as string) || "en";
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

  const httpServer = createServer(app);

  return httpServer;
}
