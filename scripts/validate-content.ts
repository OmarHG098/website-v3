#!/usr/bin/env tsx
/**
 * Content Validation Script
 * 
 * Validates all YAML content files before build:
 * - Detects redirect conflicts (same URL claimed by multiple pages)
 * - Validates redirect targets exist
 * - Checks for self-redirects and loops
 * - Validates meta properties
 * 
 * Run: npx tsx scripts/validate-content.ts
 * Exit code 1 on validation errors to fail CI/CD builds
 */

import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";

const PROGRAMS_PATH = path.join(process.cwd(), "marketing-content", "programs");
const LANDINGS_PATH = path.join(process.cwd(), "marketing-content", "landings");
const SCHEMA_ORG_PATH = path.join(process.cwd(), "marketing-content", "schema-org.yml");

interface SchemaRef {
  include?: string[];
  overrides?: Record<string, Record<string, unknown>>;
}

interface ContentMeta {
  page_title?: string;
  description?: string;
  robots?: string;
  og_image?: string;
  canonical_url?: string;
  priority?: number;
  change_frequency?: string;
  redirects?: string[];
}

interface ContentFile {
  slug: string;
  title: string;
  meta?: ContentMeta;
  schema?: SchemaRef;
  type: "program" | "landing";
  locale: string;
  filePath: string;
}

interface ValidationError {
  type: "error" | "warning";
  message: string;
  file?: string;
}

interface ValidationResult {
  errors: ValidationError[];
  warnings: ValidationError[];
  redirectMap: Map<string, { target: string; source: ContentFile }>;
  contentFiles: ContentFile[];
}

function loadYamlFiles(dirPath: string, type: "program" | "landing"): ContentFile[] {
  const files: ContentFile[] = [];

  if (!fs.existsSync(dirPath)) {
    return files;
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
          title?: string;
          meta?: ContentMeta;
          schema?: SchemaRef;
        };

        files.push({
          slug: data.slug || dir,
          title: data.title || dir,
          meta: data.meta,
          schema: data.schema,
          type,
          locale,
          filePath,
        });
      } catch (err) {
        console.error(`Failed to parse ${filePath}:`, err);
      }
    }
  }

  return files;
}

function getCanonicalUrl(file: ContentFile): string {
  if (file.type === "program") {
    return file.locale === "es"
      ? `/es/programas-de-carrera/${file.slug}`
      : `/en/career-programs/${file.slug}`;
  } else {
    return `/landing/${file.slug}`;
  }
}

function getAvailableSchemaKeys(): Set<string> {
  const keys = new Set<string>();
  
  if (!fs.existsSync(SCHEMA_ORG_PATH)) {
    console.warn("Warning: schema-org.yml not found");
    return keys;
  }
  
  try {
    const content = fs.readFileSync(SCHEMA_ORG_PATH, "utf-8");
    const data = yaml.load(content) as Record<string, unknown>;
    
    // Add top-level keys: organization, website
    for (const key of Object.keys(data)) {
      if (key === "courses" || key === "item_lists") {
        // For nested schemas, add with prefix: courses:full-stack, item_lists:career-programs
        const nested = data[key] as Record<string, unknown>;
        for (const nestedKey of Object.keys(nested)) {
          keys.add(`${key}:${nestedKey}`);
        }
      } else {
        keys.add(key);
      }
    }
  } catch (err) {
    console.error("Failed to parse schema-org.yml:", err);
  }
  
  return keys;
}

function validateContent(): ValidationResult {
  const result: ValidationResult = {
    errors: [],
    warnings: [],
    redirectMap: new Map(),
    contentFiles: [],
  };

  // Load all content files
  const programs = loadYamlFiles(PROGRAMS_PATH, "program");
  const landings = loadYamlFiles(LANDINGS_PATH, "landing");
  result.contentFiles = [...programs, ...landings];

  // Build set of all valid target URLs
  const validUrls = new Set<string>();
  for (const file of result.contentFiles) {
    validUrls.add(getCanonicalUrl(file));
  }

  // Also add static routes
  const staticRoutes = [
    "/",
    "/learning-paths",
    "/career-paths",
    "/skill-boosters",
    "/tool-mastery",
    "/career-programs",
    "/dashboard",
  ];
  staticRoutes.forEach((route) => validUrls.add(route));

  // Process redirects
  for (const file of result.contentFiles) {
    const redirects = file.meta?.redirects || [];
    const targetUrl = getCanonicalUrl(file);

    for (const redirect of redirects) {
      // Normalize redirect URL
      const normalizedRedirect = redirect.startsWith("/") ? redirect : `/${redirect}`;

      // Check for self-redirect
      if (normalizedRedirect === targetUrl) {
        result.errors.push({
          type: "error",
          message: `Self-redirect detected: "${normalizedRedirect}" redirects to itself`,
          file: file.filePath,
        });
        continue;
      }

      // Check for conflicts with existing redirects
      if (result.redirectMap.has(normalizedRedirect)) {
        const existing = result.redirectMap.get(normalizedRedirect)!;
        result.errors.push({
          type: "error",
          message: `Redirect conflict: "${normalizedRedirect}" is claimed by both "${file.filePath}" and "${existing.source.filePath}"`,
          file: file.filePath,
        });
        continue;
      }

      // Check if redirect URL conflicts with an existing content URL
      if (validUrls.has(normalizedRedirect)) {
        result.errors.push({
          type: "error",
          message: `Redirect "${normalizedRedirect}" conflicts with an existing content URL`,
          file: file.filePath,
        });
        continue;
      }

      // Register the redirect
      result.redirectMap.set(normalizedRedirect, {
        target: targetUrl,
        source: file,
      });
    }
  }

  // Check for redirect loops (A -> B -> A)
  for (const [redirectUrl, { target }] of result.redirectMap) {
    const visited = new Set<string>([redirectUrl]);
    let current = target;

    while (result.redirectMap.has(current)) {
      if (visited.has(current)) {
        result.errors.push({
          type: "error",
          message: `Redirect loop detected involving: ${Array.from(visited).join(" -> ")} -> ${current}`,
        });
        break;
      }
      visited.add(current);
      current = result.redirectMap.get(current)!.target;
    }
  }

  // Validate meta properties
  for (const file of result.contentFiles) {
    if (!file.meta?.page_title) {
      result.warnings.push({
        type: "warning",
        message: `Missing page_title in meta`,
        file: file.filePath,
      });
    }

    if (!file.meta?.description) {
      result.warnings.push({
        type: "warning",
        message: `Missing description in meta`,
        file: file.filePath,
      });
    }

    if (file.meta?.priority !== undefined) {
      if (file.meta.priority < 0 || file.meta.priority > 1) {
        result.errors.push({
          type: "error",
          message: `Invalid priority value: ${file.meta.priority}. Must be between 0 and 1`,
          file: file.filePath,
        });
      }
    }

    const validChangeFreqs = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"];
    if (file.meta?.change_frequency && !validChangeFreqs.includes(file.meta.change_frequency)) {
      result.errors.push({
        type: "error",
        message: `Invalid change_frequency: "${file.meta.change_frequency}". Must be one of: ${validChangeFreqs.join(", ")}`,
        file: file.filePath,
      });
    }
  }

  // Validate Schema.org references
  const availableSchemas = getAvailableSchemaKeys();
  for (const file of result.contentFiles) {
    if (file.schema?.include) {
      for (const schemaRef of file.schema.include) {
        if (!availableSchemas.has(schemaRef)) {
          result.errors.push({
            type: "error",
            message: `Invalid schema reference: "${schemaRef}". Available schemas: ${Array.from(availableSchemas).join(", ")}`,
            file: file.filePath,
          });
        }
      }
    }

    // Validate override keys reference valid schemas
    if (file.schema?.overrides) {
      for (const overrideKey of Object.keys(file.schema.overrides)) {
        if (!availableSchemas.has(overrideKey)) {
          result.errors.push({
            type: "error",
            message: `Invalid schema override key: "${overrideKey}". Available schemas: ${Array.from(availableSchemas).join(", ")}`,
            file: file.filePath,
          });
        }
      }
    }
  }

  return result;
}

function printResults(result: ValidationResult): boolean {
  console.log("\n=== Content Validation Results ===\n");
  console.log(`Total content files: ${result.contentFiles.length}`);
  console.log(`Total redirects: ${result.redirectMap.size}`);

  if (result.warnings.length > 0) {
    console.log(`\n⚠️  Warnings (${result.warnings.length}):`);
    for (const warning of result.warnings) {
      console.log(`  - ${warning.message}${warning.file ? ` (${warning.file})` : ""}`);
    }
  }

  if (result.errors.length > 0) {
    console.log(`\n❌ Errors (${result.errors.length}):`);
    for (const error of result.errors) {
      console.log(`  - ${error.message}${error.file ? ` (${error.file})` : ""}`);
    }
    console.log("\n❌ Validation FAILED\n");
    return false;
  }

  console.log("\n✅ Validation PASSED\n");
  return true;
}

function exportRedirectMap(result: ValidationResult): void {
  const redirects: Record<string, string> = {};
  for (const [from, { target }] of result.redirectMap) {
    redirects[from] = target;
  }

  const outputPath = path.join(process.cwd(), "dist", "redirects.json");
  
  // Ensure dist directory exists
  const distDir = path.dirname(outputPath);
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(redirects, null, 2));
  console.log(`Redirect map exported to: ${outputPath}`);
}

// Main execution
const result = validateContent();
const success = printResults(result);

if (success && result.redirectMap.size > 0) {
  exportRedirectMap(result);
}

process.exit(success ? 0 : 1);
