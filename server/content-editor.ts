import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import type { EditOperation } from "@shared/schema";

const CONTENT_BASE_PATH = path.join(process.cwd(), "marketing-content");

interface ContentEditRequest {
  contentType: "program" | "landing" | "location" | "page";
  slug: string;
  locale: string;
  operations: EditOperation[];
}

function getContentPath(contentType: string, slug: string, locale: string): string {
  switch (contentType) {
    case "program":
      return path.join(CONTENT_BASE_PATH, "programs", slug, `${locale}.yml`);
    case "landing":
      return path.join(CONTENT_BASE_PATH, "landings", slug, `${locale}.yml`);
    case "location":
      return path.join(CONTENT_BASE_PATH, "locations", slug, `${locale}.yml`);
    case "page":
      return path.join(CONTENT_BASE_PATH, "pages", slug, `${locale}.yml`);
    default:
      throw new Error(`Unknown content type: ${contentType}`);
  }
}

function getValueAtPath(obj: Record<string, unknown>, pathStr: string): unknown {
  const parts = pathStr.replace(/\[(\d+)\]/g, ".$1").split(".");
  let current: unknown = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    if (typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  
  return current;
}

function setValueAtPath(obj: Record<string, unknown>, pathStr: string, value: unknown): void {
  const parts = pathStr.replace(/\[(\d+)\]/g, ".$1").split(".");
  let current: Record<string, unknown> = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (current[part] === undefined) {
      // Create intermediate object or array
      const nextPart = parts[i + 1];
      current[part] = /^\d+$/.test(nextPart) ? [] : {};
    }
    current = current[part] as Record<string, unknown>;
  }
  
  const lastPart = parts[parts.length - 1];
  current[lastPart] = value;
}

function applyOperation(content: Record<string, unknown>, operation: EditOperation): void {
  switch (operation.action) {
    case "update_field": {
      setValueAtPath(content, operation.path, operation.value);
      break;
    }
    
    case "reorder_sections": {
      const sections = content.sections as unknown[];
      if (!Array.isArray(sections)) throw new Error("sections is not an array");
      if (operation.from < 0 || operation.from >= sections.length) throw new Error("Invalid from index");
      if (operation.to < 0 || operation.to >= sections.length) throw new Error("Invalid to index");
      
      const [moved] = sections.splice(operation.from, 1);
      sections.splice(operation.to, 0, moved);
      break;
    }
    
    case "add_item": {
      const arr = getValueAtPath(content, operation.path) as unknown[];
      if (!Array.isArray(arr)) throw new Error(`Path ${operation.path} is not an array`);
      
      if (operation.index !== undefined && operation.index >= 0 && operation.index <= arr.length) {
        arr.splice(operation.index, 0, operation.item);
      } else {
        arr.push(operation.item);
      }
      break;
    }
    
    case "remove_item": {
      const arr = getValueAtPath(content, operation.path) as unknown[];
      if (!Array.isArray(arr)) throw new Error(`Path ${operation.path} is not an array`);
      if (operation.index < 0 || operation.index >= arr.length) throw new Error("Invalid index");
      
      arr.splice(operation.index, 1);
      break;
    }
    
    case "update_section": {
      const sections = content.sections as unknown[];
      if (!Array.isArray(sections)) throw new Error("sections is not an array");
      if (operation.index < 0 || operation.index >= sections.length) throw new Error("Invalid section index");
      
      sections[operation.index] = operation.section;
      break;
    }
  }
}

export async function editContent(request: ContentEditRequest): Promise<{ success: boolean; error?: string }> {
  const { contentType, slug, locale, operations } = request;
  
  try {
    const filePath = getContentPath(contentType, slug, locale);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return { success: false, error: `Content file not found: ${filePath}` };
    }
    
    // Read current content
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const content = yaml.load(fileContent) as Record<string, unknown>;
    
    // Apply all operations
    for (const operation of operations) {
      applyOperation(content, operation);
    }
    
    // Write back to file
    const updatedYaml = yaml.dump(content, {
      lineWidth: -1, // Don't wrap lines
      noRefs: true,
      quotingType: '"',
      forceQuotes: false,
    });
    
    fs.writeFileSync(filePath, updatedYaml, "utf-8");
    
    return { success: true };
  } catch (error) {
    console.error("Content edit error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export function getContentForEdit(
  contentType: "program" | "landing" | "location",
  slug: string,
  locale: string
): { content: Record<string, unknown> | null; error?: string } {
  try {
    const filePath = getContentPath(contentType, slug, locale);
    
    if (!fs.existsSync(filePath)) {
      return { content: null, error: `Content file not found` };
    }
    
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const content = yaml.load(fileContent) as Record<string, unknown>;
    
    return { content };
  } catch (error) {
    console.error("Error reading content:", error);
    return { content: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
