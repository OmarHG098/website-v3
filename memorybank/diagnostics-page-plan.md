# Diagnostics Page — Implementation Plan

> **Goal:** A private, self-service diagnostics page that scans all marketing content pages and reports SEO health, Schema.org correctness, content quality, and infrastructure integrity — eliminating the need for third-party audit tools.

---

## 1. Existing Infrastructure (What We Build On)

### 1.1 Validation Framework (`scripts/validation/`)

A modular validation system with CLI and API support, built around a `ValidationService` singleton.

**Architecture:**
```
scripts/validation/
├── index.ts              # Re-exports all public APIs
├── service.ts            # ValidationService: context building, validator execution, result aggregation
├── cli.ts                # CLI entry point for batch scanning
├── shared/
│   ├── types.ts          # Core interfaces: ValidationIssue, ValidatorResult, ValidationContext, ContentFile
│   ├── contentLoader.ts  # Loads all YAML content files into ContentFile[]
│   ├── canonicalUrls.ts  # URL normalization and canonical URL generation
│   └── schemaRegistry.ts # Available Schema.org keys from schema-org.yml
└── validators/
    ├── index.ts           # Registry of all validators + discovery utilities
    ├── meta.ts            # SEO meta: page_title, description, priority, change_frequency, robots
    ├── schema.ts          # Schema.org reference validation (checks refs exist in schema-org.yml)
    ├── redirects.ts       # Redirect conflicts, loops, self-redirects, content overwrites
    ├── sitemap.ts         # Sitemap-to-content coverage, orphaned entries, duplicates
    ├── components.ts      # Component registry: schema files, examples, versions
    ├── backgrounds.ts     # Theme compliance: background colors match theme.json
    └── faqs.ts            # FAQ freshness: last_updated within 6 months
```

**Key Types:**
```typescript
interface ValidationIssue {
  type: "error" | "warning";
  code: string;
  message: string;
  file?: string;
  line?: number;
  suggestion?: string;
}

interface ValidatorResult {
  name: string;
  description: string;
  status: "passed" | "failed" | "warning";
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  duration: number;
  artifacts?: Record<string, unknown>;
}

interface Validator extends ValidatorMetadata {
  run(context: ValidationContext): Promise<ValidatorResult>;
}
```

**Validator Categories:**
| Category | Purpose |
|-----------|---------|
| `seo` | Search engine optimization checks |
| `integrity` | Data consistency and structural correctness |
| `content` | Content quality and compliance |
| `components` | Component registry integrity |

### 1.2 Existing API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/validation/validators` | List available validators with metadata |
| `POST` | `/api/validation/run` | Run all or specific validators |
| `POST` | `/api/validation/run/:name` | Run a single validator |
| `GET` | `/api/validation/context` | Get validation context info |
| `POST` | `/api/validation/clear-cache` | Clear validation cache |

### 1.3 Schema.org Infrastructure

- **`server/schema-org.ts`**: Loads `marketing-content/schema-org.yml`, resolves locale-specific schemas, merges overrides
- **`server/ssr-schema.ts`**: Server-side JSON-LD injection into HTML responses
  - Parses routes to resolve content type, slug, locale
  - Loads raw YAML (merging `_common.yml` + locale file)
  - Generates JSON-LD `<script>` tags for Schema.org includes and auto-detected FAQ sections
  - `generateSsrSchemaHtml(url)` → returns full JSON-LD HTML string

### 1.4 Content Index Singleton (`server/content-index.ts`)

- Indexes all `marketing-content/` YAML on startup
- Tracks image usage via `imageUsage` Map (by image_id and src)
- `getImageUsage(imageId, imageSrc)` → O(1) lookup returning files that use the image
- Auto-refreshes on file changes

---

## 2. New Validators to Add

### 2.1 SEO Depth Validator (`seo-depth`)

Goes beyond the existing `meta` validator with quantitative analysis.

**Checks:**
| Code | Severity | Rule |
|------|----------|------|
| `TITLE_TOO_SHORT` | warning | page_title < 30 chars |
| `TITLE_TOO_LONG` | warning | page_title > 60 chars |
| `DESCRIPTION_TOO_SHORT` | warning | description < 70 chars |
| `DESCRIPTION_TOO_LONG` | warning | description > 160 chars |
| `MISSING_OG_IMAGE` | warning | No og_image in meta |
| `MISSING_CANONICAL` | warning | No canonical_url in meta |
| `DUPLICATE_TITLE` | error | Same page_title used by multiple pages |
| `DUPLICATE_DESCRIPTION` | error | Same description used by multiple pages |

**Artifacts:**
- `pagesWithOptimalTitles`: count of titles in 50-60 char range
- `pagesWithOptimalDescriptions`: count of descriptions in 120-160 char range
- `titleLengthDistribution`: histogram of title lengths
- `duplicateTitles`: list of duplicated title values

**Implementation notes:**
- Operates on the same `ValidationContext.contentFiles` as the existing `meta` validator
- Complementary to `meta` (which checks existence), this checks quality/optimization
- Category: `seo`

### 2.2 Schema.org Completeness Validator (`schema-completeness`)

Actually renders the JSON-LD per page and validates output quality.

**Checks:**
| Code | Severity | Rule |
|------|----------|------|
| `PAGE_NO_SCHEMA` | warning | Page has no schema.include configured |
| `SCHEMA_RENDER_ERROR` | error | generateSsrSchemaHtml() throws for this page |
| `SCHEMA_EMPTY_OUTPUT` | warning | Schema configured but renders to empty string |
| `SCHEMA_MISSING_NAME` | warning | JSON-LD object missing `name` field |
| `SCHEMA_MISSING_DESCRIPTION` | warning | JSON-LD object missing `description` field |
| `SCHEMA_MISSING_URL` | warning | JSON-LD object missing `url` field |
| `SCHEMA_PLACEHOLDER_VALUE` | error | JSON-LD contains "TODO" or placeholder text |
| `FAQ_SECTION_NO_SCHEMA` | warning | Page has FAQ section but no FAQPage schema generated |
| `INVALID_SCHEMA_TYPE` | error | `@type` value is not a recognized Schema.org type |

**Implementation notes:**
- Uses `generateSsrSchemaHtml()` from `server/ssr-schema.ts` to render actual JSON-LD
- Needs to construct URLs for each content file (using canonical URL generation)
- Parses rendered JSON-LD to validate field presence
- Category: `seo`

### 2.3 Image Integrity Validator (`images`)

Validates image references across the entire content system.

**Checks:**
| Code | Severity | Rule |
|------|----------|------|
| `IMAGE_ID_NOT_IN_REGISTRY` | error | YAML uses image_id that doesn't exist in image-registry.json |
| `IMAGE_SRC_FILE_MISSING` | error | Registry entry points to file that doesn't exist on disk |
| `IMAGE_ALT_MISSING` | error | Registry entry has no alt text |
| `IMAGE_ALT_PLACEHOLDER` | warning | Alt text contains "TODO" or is auto-generated placeholder |
| `ORPHANED_REGISTRY_ENTRY` | warning | Image in registry but not referenced by any YAML content |
| `IMAGE_UNREFERENCED_FILE` | info | Image file exists on disk but is not in the registry |

**Implementation notes:**
- Uses `contentIndex.getImageUsage()` for usage lookups
- Loads `image-registry.json` directly for registry validation
- Scans disk for file existence checks
- Category: `content`

### 2.4 Content Quality Validator (`content-quality`)

Validates content completeness and cross-locale consistency.

**Checks:**
| Code | Severity | Rule |
|------|----------|------|
| `EMPTY_SECTIONS` | error | Page has empty or missing sections array |
| `SECTION_MISSING_TYPE` | error | A section in the array has no `type` field |
| `MISSING_TRANSLATION` | warning | EN page exists but ES counterpart missing (or vice versa) |
| `EMPTY_FIELD_VALUE` | warning | Critical field (title, heading, description) is empty string |
| `BROKEN_INTERNAL_LINK` | error | Link to `/en/...` or `/es/...` resolves to no content |

**Implementation notes:**
- Loads raw YAML to check section structure (not just meta)
- Uses `validUrls` set from ValidationContext for link checking
- Compares EN/ES folder pairs for translation coverage
- Category: `content`

---

## 3. Per-Page Diagnostics API

### 3.1 Endpoint: `GET /api/diagnostics/page?url=/en/some-page`

Returns a comprehensive diagnostic report for a single page.

**Response shape:**
```typescript
interface PageDiagnosticResult {
  url: string;
  contentType: "programs" | "pages" | "locations" | "landings";
  slug: string;
  locale: string;
  filePath: string;

  meta: {
    page_title: string | null;
    titleLength: number;
    description: string | null;
    descriptionLength: number;
    og_image: string | null;
    canonical_url: string | null;
    robots: string | null;
    hasMeta: boolean;
  };

  schema: {
    configured: boolean;
    includes: string[];
    renderedJsonLd: object[];  // parsed JSON-LD objects
    htmlPreview: string;       // raw <script> tags
    issues: ValidationIssue[];
  };

  sections: {
    count: number;
    types: string[];            // list of section types used
    hasFaq: boolean;
    issues: ValidationIssue[];
  };

  images: {
    referencedIds: string[];
    referencedSrcs: string[];
    missingFromRegistry: string[];
    missingFromDisk: string[];
    issues: ValidationIssue[];
  };

  translations: {
    hasEnglish: boolean;
    hasSpanish: boolean;
    counterpartUrl: string | null;
  };

  redirects: {
    incomingRedirects: string[];   // URLs that redirect to this page
  };

  score: {
    total: number;      // 0-100
    seo: number;        // 0-100
    schema: number;     // 0-100
    content: number;    // 0-100
    breakdown: {
      category: string;
      score: number;
      maxScore: number;
      checks: { name: string; passed: boolean; weight: number }[];
    }[];
  };
}
```

### 3.2 Scoring System

Each check has a weight. Score = (sum of passed weights) / (sum of all weights) * 100.

**SEO Score (max 100):**
| Check | Weight | Criteria |
|-------|--------|----------|
| Has page_title | 20 | Present and non-empty |
| Title length optimal | 10 | 30-60 chars |
| Has description | 20 | Present and non-empty |
| Description length optimal | 10 | 70-160 chars |
| Has og_image | 10 | Present |
| Has canonical_url | 10 | Present |
| No duplicate title | 10 | Unique across all pages |
| No duplicate description | 10 | Unique across all pages |

**Schema Score (max 100):**
| Check | Weight | Criteria |
|-------|--------|----------|
| Schema configured | 30 | Has schema.include |
| Renders successfully | 20 | No render errors |
| Has name field | 15 | JSON-LD includes name |
| Has description field | 15 | JSON-LD includes description |
| No placeholders | 10 | No TODO values |
| FAQ schema if needed | 10 | FAQ section → FAQPage schema |

**Content Score (max 100):**
| Check | Weight | Criteria |
|-------|--------|----------|
| Has sections | 25 | Non-empty sections array |
| All sections typed | 20 | Every section has type |
| Has translation | 20 | Both EN and ES exist |
| No empty fields | 15 | No empty critical values |
| Images valid | 20 | All image refs resolve |

### 3.3 Endpoint: `GET /api/diagnostics/pages`

Returns a summary list of all pages with their scores for the dashboard view.

**Response:**
```typescript
interface PageSummary {
  url: string;
  title: string;
  locale: string;
  contentType: string;
  scores: { seo: number; schema: number; content: number; total: number };
  errorCount: number;
  warningCount: number;
}
```

---

## 4. Frontend: Diagnostics Page

### 4.1 Page Structure

**Route:** `/diagnostics` (private, accessible from debug bubble)

**Two-tab layout:**

#### Tab 1: Global Dashboard
- **Health Summary Bar**: Total pages, overall health score, counts of errors/warnings/passes
- **Validator Cards Grid**: One card per validator (all 11 validators)
  - Status badge (green checkmark / yellow warning / red X)
  - Error count, warning count
  - Duration
  - Expandable: shows individual issues with file path, code, message, suggestion
  - Individual "Run" button per card
- **"Run All Diagnostics"** button at top
- **Filter bar**: Filter issues by severity (error/warning), category (seo/integrity/content/components), search by code or message
- **Export button**: Download results as JSON

#### Tab 2: Per-Page Deep Dive
- **Page selector**: Searchable dropdown of all pages (grouped by content type)
- **Score dashboard**: Three circular progress indicators (SEO / Schema / Content) + overall score
- **Meta section**: Table showing all meta fields with values and length indicators (green/yellow/red bars)
- **Schema section**: 
  - List of configured schemas
  - Rendered JSON-LD preview (syntax-highlighted JSON)
  - Issue list
- **Sections section**: 
  - Section count and type list
  - Issues for empty/untyped sections
- **Images section**:
  - Referenced image IDs with resolution status
  - Missing references highlighted
- **Translation status**: EN/ES availability with link to counterpart
- **Incoming redirects**: List of URLs that redirect to this page

### 4.2 Component Hierarchy

```
DiagnosticsPage
├── DiagnosticsHeader (title, run all button, export button)
├── Tabs
│   ├── Tab: "Global Health"
│   │   ├── HealthSummaryBar (total pages, scores, issue counts)
│   │   ├── FilterBar (severity, category, search)
│   │   └── ValidatorCardGrid
│   │       └── ValidatorCard (per validator)
│   │           ├── StatusBadge
│   │           ├── IssueCount
│   │           └── IssueList (expandable)
│   │               └── IssueRow (code, message, file, suggestion)
│   └── Tab: "Page Analysis"
│       ├── PageSelector (searchable dropdown)
│       ├── ScoreDashboard (three score circles + overall)
│       ├── MetaAnalysis (table of meta fields)
│       ├── SchemaPreview (JSON-LD preview)
│       ├── SectionsOverview (types, counts)
│       ├── ImageReferences (IDs + status)
│       └── TranslationStatus (EN/ES)
```

### 4.3 State Management

- Use TanStack Query for all API calls
- `queryKey: ['/api/validation/run']` for global diagnostics
- `queryKey: ['/api/diagnostics/page', url]` for per-page
- `queryKey: ['/api/diagnostics/pages']` for page list with scores
- Results cached in-memory, invalidated on "Run" or page navigation

### 4.4 UI Design Notes

- Uses existing shadcn components: Card, Badge, Tabs, Button, ScrollArea, Accordion
- Status colors via semantic tokens only (no hardcoded colors)
- Score circles: use CSS `conic-gradient` with semantic color variables
- JSON preview: `<pre>` with `bg-muted` and `text-foreground`, `overflow-x-auto`
- Responsive: cards stack on mobile, 2-3 columns on desktop
- Icons from `@tabler/icons-react` only

---

## 5. Debug Bubble Integration

Add a "Diagnostics" link to the debug bubble's navigation menu, alongside existing items like the component registry and media gallery links.

---

## 6. Implementation Order

| Step | Task | Dependencies |
|------|------|-------------|
| 1 | Add 4 new validators (seo-depth, schema-completeness, images, content-quality) | Existing validator framework |
| 2 | Register new validators in `scripts/validation/validators/index.ts` | Step 1 |
| 3 | Create per-page diagnostics API (`/api/diagnostics/page`, `/api/diagnostics/pages`) | Steps 1-2, existing SSR schema |
| 4 | Build Global Dashboard tab (frontend) | Step 2 (uses existing `/api/validation/run`) |
| 5 | Build Per-Page Analysis tab (frontend) | Step 3 |
| 6 | Add debug bubble link | Step 4 |

---

## 7. Files to Create/Modify

**New files:**
- `memorybank/diagnostics-page-plan.md` — this document
- `scripts/validation/validators/seo-depth.ts` — SEO depth validator
- `scripts/validation/validators/schema-completeness.ts` — Schema.org completeness validator
- `scripts/validation/validators/images.ts` — Image integrity validator
- `scripts/validation/validators/content-quality.ts` — Content quality validator
- `client/src/pages/DiagnosticsPage.tsx` — Diagnostics page component

**Modified files:**
- `scripts/validation/validators/index.ts` — Register 4 new validators
- `server/routes.ts` — Add per-page diagnostics API endpoints
- `client/src/App.tsx` — Add `/diagnostics` route
- `client/src/components/DebugBubble.tsx` — Add diagnostics link

---

## 8. Non-Goals (Explicitly Out of Scope)

- Lighthouse-style performance auditing (requires headless browser)
- Accessibility (a11y) scanning (would need DOM rendering)
- External link checking (would need HTTP requests, too slow)
- Historical trend tracking (no database needed for MVP)
- Automated fix application (show suggestions only, let users fix manually)
