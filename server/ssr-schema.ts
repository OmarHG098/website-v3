import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";
import { getMergedSchemas } from "./schema-org";
import { getFolderFromSlug } from "../shared/slugMappings";
import { deepMerge } from "./utils/deepMerge";

const MARKETING_CONTENT_PATH = path.join(process.cwd(), "marketing-content");

interface FaqItem {
  question: string;
  answer: string;
  locations?: string[];
  related_features?: string[];
  priority?: number;
}

interface FaqSection {
  type: "faq";
  title?: string;
  items?: FaqItem[];
  related_features?: string[];
}

interface SchemaReference {
  include?: string[];
  overrides?: Record<string, Record<string, unknown>>;
}

interface ParsedRoute {
  contentType: "programs" | "pages" | "locations" | "landings";
  slug: string;
  locale: string;
}

let faqCache: Record<string, FaqItem[]> = {};

function loadCentralizedFaqs(locale: string): FaqItem[] {
  if (faqCache[locale]) return faqCache[locale];

  const faqPath = path.join(MARKETING_CONTENT_PATH, "faqs", `${locale}.yml`);
  if (!fs.existsSync(faqPath)) return [];

  try {
    const content = fs.readFileSync(faqPath, "utf-8");
    const data = yaml.load(content) as { faqs?: FaqItem[] };
    faqCache[locale] = data?.faqs || [];
    return faqCache[locale];
  } catch {
    return [];
  }
}

export function clearSsrSchemaCache(): void {
  faqCache = {};
}

function parseRoute(url: string): ParsedRoute | null {
  const cleanUrl = url.split("?")[0].split("#")[0];

  let match: RegExpMatchArray | null;

  match = cleanUrl.match(/^\/(en|es)\/career-programs\/(.+?)$/);
  if (!match) match = cleanUrl.match(/^\/(es)\/programas-de-carrera\/(.+?)$/);
  if (match) {
    return { contentType: "programs", slug: match[2], locale: match[1] };
  }

  match = cleanUrl.match(/^\/(en|es)\/location\/(.+?)$/);
  if (!match) match = cleanUrl.match(/^\/(es)\/ubicacion\/(.+?)$/);
  if (match) {
    return { contentType: "locations", slug: match[2], locale: match[1] };
  }

  match = cleanUrl.match(/^\/(en|es)\/landing\/(.+?)$/);
  if (match) {
    return { contentType: "landings", slug: match[2], locale: match[1] };
  }

  match = cleanUrl.match(/^\/(en|es)\/(.+?)$/);
  if (match) {
    const locale = match[1];
    const slug = match[2];
    const folder = getFolderFromSlug(slug, locale);
    return { contentType: "pages", slug: folder, locale };
  }

  if (cleanUrl === "/" || cleanUrl === "/en" || cleanUrl === "/en/" || cleanUrl === "/es" || cleanUrl === "/es/") {
    return null;
  }

  return null;
}

function loadRawYaml(contentType: string, slug: string, locale: string): Record<string, unknown> | null {
  const contentDir = path.join(MARKETING_CONTENT_PATH, contentType, slug);
  const commonPath = path.join(contentDir, "_common.yml");

  const localeOrVariant = contentType === "landings" ? "promoted" : locale;
  const contentPath = path.join(contentDir, `${localeOrVariant}.yml`);

  if (!fs.existsSync(contentPath)) return null;

  try {
    let commonData: Record<string, unknown> = {};
    if (fs.existsSync(commonPath)) {
      commonData = yaml.load(fs.readFileSync(commonPath, "utf-8")) as Record<string, unknown>;
    }

    const contentData = yaml.load(fs.readFileSync(contentPath, "utf-8")) as Record<string, unknown>;
    return deepMerge(commonData, contentData);
  } catch {
    return null;
  }
}

function buildFaqPageSchema(faqItems: Array<{ question: string; answer: string }>): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

function resolveFaqItems(section: FaqSection, locale: string): Array<{ question: string; answer: string }> {
  if (section.items && section.items.length > 0) {
    return section.items.map(({ question, answer }) => ({ question, answer }));
  }

  if (section.related_features && section.related_features.length > 0) {
    const allFaqs = loadCentralizedFaqs(locale);
    const relatedFeatures = section.related_features;

    const filtered = allFaqs
      .filter((faq) => {
        const faqFeatures = faq.related_features || [];
        return relatedFeatures.some((f) => faqFeatures.includes(f));
      })
      .sort((a, b) => {
        const aFeatures = a.related_features || [];
        const bFeatures = b.related_features || [];
        const aCount = relatedFeatures.filter((f) => aFeatures.includes(f)).length;
        const bCount = relatedFeatures.filter((f) => bFeatures.includes(f)).length;
        if (bCount !== aCount) return bCount - aCount;
        return (b.priority ?? 0) - (a.priority ?? 0);
      })
      .slice(0, 9);

    return filtered.map(({ question, answer }) => ({ question, answer }));
  }

  return [];
}

export function generateSsrSchemaHtml(url: string): string {
  try {
    const route = parseRoute(url);
    if (!route) return "";

    const pageData = loadRawYaml(route.contentType, route.slug, route.locale);
    if (!pageData) return "";

    const scripts: string[] = [];

    const schemaRef = pageData.schema as SchemaReference | undefined;
    if (schemaRef?.include && schemaRef.include.length > 0) {
      const schemas = getMergedSchemas(schemaRef, route.locale);
      for (const schema of schemas) {
        scripts.push(
          `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
        );
      }
    }

    const sections = pageData.sections as Array<Record<string, unknown>> | undefined;
    if (sections) {
      for (const section of sections) {
        if (section.type === "faq") {
          const faqItems = resolveFaqItems(section as unknown as FaqSection, route.locale);
          if (faqItems.length > 0) {
            scripts.push(
              `<script type="application/ld+json">${JSON.stringify(buildFaqPageSchema(faqItems))}</script>`
            );
          }
        }
      }
    }

    return scripts.join("\n");
  } catch (err) {
    console.error("[SSR-Schema] Error generating schema for", url, err);
    return "";
  }
}
