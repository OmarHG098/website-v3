import fs from "fs";
import path from "path";
import yaml from "js-yaml";

export interface ContentEntry {
  slug: string;
  contentType: "pages" | "programs" | "locations" | "landings";
  folder: string;
  files: string[];
  locales: string[];
  title?: string;
}

export interface FindOptions {
  contentType?: ContentEntry["contentType"];
}

class ContentIndex {
  private entries: ContentEntry[] = [];
  private bySlug: Map<string, ContentEntry[]> = new Map();
  private byPath: Map<string, ContentEntry> = new Map();
  private initialized = false;

  private static instance: ContentIndex;

  static getInstance(): ContentIndex {
    if (!ContentIndex.instance) {
      ContentIndex.instance = new ContentIndex();
    }
    return ContentIndex.instance;
  }

  private constructor() {}

  scan(): void {
    const baseDir = path.join(process.cwd(), "marketing-content");
    const contentTypes: ContentEntry["contentType"][] = ["pages", "programs", "locations", "landings"];

    this.entries = [];
    this.bySlug = new Map();
    this.byPath = new Map();

    for (const contentType of contentTypes) {
      const typeDir = path.join(baseDir, contentType);
      if (!fs.existsSync(typeDir)) continue;

      const folders = fs.readdirSync(typeDir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);

      for (const folderName of folders) {
        const folderPath = path.join(typeDir, folderName);
        const relFolder = `marketing-content/${contentType}/${folderName}`;
        const files = fs.readdirSync(folderPath)
          .filter(f => f.endsWith(".yml") || f.endsWith(".yaml"));

        if (files.length === 0) continue;

        const slug = this.extractSlug(folderPath, folderName, files);
        const locales = this.extractLocales(files, contentType);
        const title = this.extractTitle(folderPath, files, contentType);

        const entry: ContentEntry = {
          slug,
          contentType,
          folder: relFolder,
          files,
          locales,
          title,
        };

        this.entries.push(entry);

        const existing = this.bySlug.get(slug) || [];
        existing.push(entry);
        this.bySlug.set(slug, existing);

        this.byPath.set(relFolder, entry);
      }
    }

    this.initialized = true;
    console.log(`[ContentIndex] Scanned ${this.entries.length} content entries`);
  }

  private extractSlug(folderPath: string, folderName: string, files: string[]): string {
    const candidates = ["en.yml", "en.yaml", "_common.yml", "_common.yaml"];
    for (const candidate of candidates) {
      if (files.includes(candidate)) {
        try {
          const content = fs.readFileSync(path.join(folderPath, candidate), "utf-8");
          const parsed = yaml.load(content) as Record<string, unknown>;
          if (parsed?.slug && typeof parsed.slug === "string") {
            return parsed.slug;
          }
        } catch {}
      }
    }
    return folderName;
  }

  private extractTitle(folderPath: string, files: string[], contentType: string): string | undefined {
    const candidates = contentType === "landings"
      ? ["_common.yml", "_common.yaml"]
      : ["en.yml", "en.yaml"];
    for (const candidate of candidates) {
      if (files.includes(candidate)) {
        try {
          const content = fs.readFileSync(path.join(folderPath, candidate), "utf-8");
          const parsed = yaml.load(content) as Record<string, unknown>;
          if (parsed?.title && typeof parsed.title === "string") {
            return parsed.title;
          }
          if (parsed?.name && typeof parsed.name === "string") {
            return parsed.name;
          }
        } catch {}
      }
    }
    return undefined;
  }

  private extractLocales(files: string[], contentType: string): string[] {
    if (contentType === "landings") {
      return files
        .filter(f => f !== "_common.yml" && f !== "_common.yaml")
        .map(f => f.replace(/\.(yml|yaml)$/, ""));
    }
    return files
      .map(f => f.replace(/\.(yml|yaml)$/, ""))
      .filter(name => /^[a-z]{2}$/.test(name));
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      this.scan();
    }
  }

  findBySlug(slug: string, opts?: FindOptions): ContentEntry[] {
    this.ensureInitialized();
    const matches = this.bySlug.get(slug) || [];
    if (opts?.contentType) {
      return matches.filter(e => e.contentType === opts.contentType);
    }
    return matches;
  }

  findByPath(folderPath: string): ContentEntry | undefined {
    this.ensureInitialized();
    return this.byPath.get(folderPath);
  }

  findByType(contentType: ContentEntry["contentType"]): ContentEntry[] {
    this.ensureInitialized();
    return this.entries.filter(e => e.contentType === contentType);
  }

  listAll(): ContentEntry[] {
    this.ensureInitialized();
    return [...this.entries];
  }

  getFileContent(slug: string, locale: string, opts?: FindOptions): { content: string; filePath: string } | null {
    const matches = this.findBySlug(slug, opts);
    if (matches.length === 0) return null;

    for (const entry of matches) {
      const basePath = path.join(process.cwd(), entry.folder);
      const candidates = [
        `${locale}.yml`,
        `${locale}.yaml`,
      ];
      if (entry.contentType === "landings") {
        candidates.unshift("_common.yml", "_common.yaml");
      }
      for (const candidate of candidates) {
        const filePath = path.join(basePath, candidate);
        if (fs.existsSync(filePath)) {
          return {
            content: fs.readFileSync(filePath, "utf-8"),
            filePath: `${entry.folder}/${candidate}`,
          };
        }
      }
    }
    return null;
  }

  getAllFiles(slug: string, opts?: FindOptions): { filePath: string; content: string }[] {
    const matches = this.findBySlug(slug, opts);
    const results: { filePath: string; content: string }[] = [];

    for (const entry of matches) {
      const basePath = path.join(process.cwd(), entry.folder);
      for (const file of entry.files) {
        const fullPath = path.join(basePath, file);
        try {
          results.push({
            filePath: `${entry.folder}/${file}`,
            content: fs.readFileSync(fullPath, "utf-8"),
          });
        } catch {}
      }
    }
    return results;
  }

  refresh(): void {
    this.scan();
  }

  getStats(): { total: number; byType: Record<string, number> } {
    this.ensureInitialized();
    const byType: Record<string, number> = {};
    for (const entry of this.entries) {
      byType[entry.contentType] = (byType[entry.contentType] || 0) + 1;
    }
    return { total: this.entries.length, byType };
  }
}

export const contentIndex = ContentIndex.getInstance();
