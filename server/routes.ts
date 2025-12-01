import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as yaml from "js-yaml";
import * as fs from "fs";
import * as path from "path";
import { careerProgramSchema, type CareerProgram } from "@shared/schema";

const BREATHECODE_HOST = process.env.VITE_BREATHECODE_HOST || "https://breathecode.herokuapp.com";

const MARKETING_CONTENT_PATH = path.join(process.cwd(), "marketing-content", "programs");

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

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/debug/validate-token", async (req, res) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        res.status(400).json({ valid: false, error: "Token required" });
        return;
      }

      const response = await fetch(`${BREATHECODE_HOST}/v1/auth/user/me/capability/webmaster`, {
        method: "GET",
        headers: {
          "Authorization": `Token ${token}`,
          "Academy": "4",
        },
      });

      if (response.status === 200) {
        res.json({ valid: true });
      } else {
        res.json({ valid: false });
      }
    } catch (error) {
      console.error("Token validation error:", error);
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

  const httpServer = createServer(app);

  return httpServer;
}
