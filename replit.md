# The AI Reskilling Platform

### Overview
The AI Reskilling Platform is a minimalistic Learning Management System (LMS) web application functioning as a marketing-focused landing page. Its primary goal is to offer a user-friendly interface for career path selection and skill acquisition, targeting AI-focused education. The platform aims to provide accessible, high-quality education to a global market through a scalable, content-driven architecture, eventually integrating with the 4geeks Breathecode API for authentication, profile management, and content delivery.

### User Preferences
- Icon library: @tabler/icons-react (NEVER lucide-react)
- Design approach: Marketing-focused landing page
- Card border radius: 0.8rem throughout the platform
- Testing: NEVER use playwright for testing - it takes too much time. User prefers manual verification only.
- Font system: Noto Color Emoji for consistent emoji rendering across all operating systems
- Colors: ONLY semantic tokens - NEVER use hardcoded colors like `bg-blue-500`, `text-red-600`, or arbitrary hex values. Only use semantic classes: `bg-primary`, `text-foreground`, `bg-muted`, etc.
- Video: ALWAYS use the `UniversalVideo` component (`client/src/components/UniversalVideo.tsx`) for ALL video content. NEVER use raw `<video>` tags, `<iframe>` embeds, or other video libraries directly.
- Images: ALWAYS use the `UniversalImage` component (`client/src/components/UniversalImage.tsx`) for ALL image content. Reference images by ID from the centralized registry (`marketing-content/image-registry.json`). NEVER use hardcoded image paths in components.

### System Architecture
The platform utilizes a modern web stack: React with TypeScript, Vite, Tailwind CSS, shadcn UI, wouter, and TanStack Query. The backend is built with Express, designed for integration with the 4geeks Breathecode API.

**Key Architectural Decisions & Features:**
-   **Design System**: Features a clean, card-based layout with a semantic color system, Lato typography, and `@tabler/icons-react` for all icons.
-   **Content Management System (CMS)**: A YAML-based system enables marketing teams to manage content for career programs, landing pages, location pages, and template pages. Content is stored in a structured directory `marketing-content/` with specific YAML files for different content types, all dynamically rendered by a unified `SectionRenderer` component.
-   **Template Pages System**: A single generic page template (`client/src/pages/page.tsx`) renders all YAML-based pages, supporting `/us/:slug` and `/es/:slug` routes. An API endpoint (`GET /api/pages/:slug?locale=en|es`) fetches content, with sitemap generation automatically including template pages.
-   **Internationalization (i18n)**: Supports English and Spanish using `react-i18next`, with browser language detection and a language switcher.
-   **SEO & Performance**: Includes comprehensive meta tags, Open Graph, Twitter Cards, Schema.org JSON-LD, `robots.txt`, dynamic sitemaps, route-level code splitting, self-hosted WOFF2 fonts, server-side Gzip compression, React component memoization, and native lazy loading.
-   **Schema.org System**: Centralized in `marketing-content/schema-org.yml` for structured data, allowing pages to reference and override schemas. The `useSchemaOrg` hook injects JSON-LD.
-   **URL Redirects System**: Handles 301 redirects defined in YAML meta properties, with a validation script to prevent conflicts.
-   **Debug Mode**: A `DebugBubble` component offers development utilities and is accessible in development or via a `?debug=true` URL parameter.
-   **Versioned Component Registry**: A filesystem-based registry at `marketing-content/component-registry/` stores versioned component schemas and examples. An API at `/api/component-registry` allows listing, loading, and creating new versions, consumed by a `ComponentShowcase` page.
    -   **IMPORTANT: Component Registry Integration Requirements**: When adding a new component from the registry to landing pages, three steps are required:
        1. **Import the schema**: Add the component's schema to `shared/schema.ts` imports and include it in the `sectionSchema` union.
        2. **Add SectionRenderer case**: Ensure `client/src/components/SectionRenderer.tsx` has a `case` statement mapping the section type to the React component.
        3. **Match YAML to schema**: The YAML content must match the schema exactly (field names, required properties). Check the component's `examples/` folder for correct YAML format.
    -   **Schema-Component Alignment**: Always verify that the component registry schema (`schema.ts`) matches the actual React component's props interface. If they differ, the schema is the source of truth for validation but the component props determine runtime behavior.
    -   **Field Editors System**: Each component can define a `field-editors.ts` file in its version folder to configure special editors (icon picker, color picker, etc.) for specific YAML fields. The server auto-discovers these files via `GET /api/component-registry/field-editors`. Example:
        ```typescript
        // marketing-content/component-registry/pricing/v1.0/field-editors.ts
        export type EditorType = "icon-picker" | "color-picker" | "image-picker" | "link-picker";
        export const fieldEditors: Record<string, EditorType> = {
          "features[].icon": "icon-picker",
        };
        ```
-   **Session Management System**: A hybrid client-side system provides IP-based geolocation, nearest campus calculation, UTM parameter tracking, and language detection. It uses a Web Worker for heavy processing, `SessionContext` for React hooks, and caches data in localStorage.
-   **A/B Testing Experiment System**: A performant, cookie-based system for content variants, managed by `ExperimentManager.ts`. It supports various targeting variables, debug endpoints, zero-latency design, and a comprehensive `Experiment Editor` for managing tests with live preview. It includes a `Visitor Tracking System` for unique visitor counting and experiment auto-stopping.
-   **UniversalVideo Component**: A mandatory component (`client/src/components/UniversalVideo.tsx`) for all video content, handling local videos natively and lazy-loading `react-player` for external sources. Configurable via YAML with schema validation.
-   **UniversalImage Component**: A mandatory component (`client/src/components/UniversalImage.tsx`) for all image content, referencing an `image-registry.json` for metadata and supporting presets and lazy loading.
-   **Inline Editing System**: A capability-based system for human editors and AI agents, enabling content modification directly on the site. It includes an `EditModeContext`, `EditableSection` wrappers, a `SectionEditorPanel` with YAML editor, and server-side content manipulation via API endpoints.
-   **Theme Configuration System**: A centralized `marketing-content/theme.json` file defines allowed colors for backgrounds, accents, and text. The editor fetches this as a reference when choosing colors, but saves the resolved CSS value (e.g., `hsl(var(--background))`) directly to YAML—no runtime lookups needed.

### Validation System
The platform includes a modular validation framework at `scripts/validation/` that can be used both **preventively** (API calls during editing) and **reactively** (CLI batch scanning).

**Directory Structure:**
```
scripts/validation/
├── index.ts           # Main exports
├── service.ts         # ValidationService orchestrator
├── reporting.ts       # Output formatting utilities
├── shared/
│   └── types.ts       # Core interfaces (Validator, ValidationIssue, etc.)
└── validators/
    ├── index.ts       # Validator registry and discovery
    ├── redirects.ts   # Redirect conflict detection
    ├── meta.ts        # SEO meta validation
    ├── schema.ts      # Schema.org reference validation
    ├── sitemap.ts     # Sitemap integrity checks
    ├── components.ts  # Component registry validation
    └── backgrounds.ts # Background color theme compliance
```

**Creating a New Validator:**
1. Create a new file in `scripts/validation/validators/` (e.g., `myvalidator.ts`)
2. Export a `Validator` object with the required interface:
```typescript
import type { Validator, ValidationContext, ValidatorResult, ValidationIssue } from "../shared/types";

export const myValidator: Validator = {
  name: "my-validator",
  description: "Validates something specific",
  apiExposed: true,  // Set true to allow UI/API calls
  estimatedDuration: "fast",  // "fast" | "medium" | "slow"
  category: "content",  // "content" | "seo" | "integrity" | "components"

  async run(context: ValidationContext): Promise<ValidatorResult> {
    const startTime = Date.now();
    const errors: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];

    // Validation logic here...
    // Use context.contentFiles to access all YAML content

    return {
      name: this.name,
      description: this.description,
      status: errors.length > 0 ? "failed" : warnings.length > 0 ? "warning" : "passed",
      errors,
      warnings,
      duration: Date.now() - startTime,
    };
  },
};
```
3. Add the validator to `scripts/validation/validators/index.ts`:
   - Import: `import { myValidator } from "./myvalidator";`
   - Add to `validators` array
   - Add to exports

**Key Interfaces:**
- `ValidationIssue`: `{ type, code, message, file?, line?, suggestion? }`
- `ValidatorResult`: `{ name, description, status, errors, warnings, duration, artifacts? }`
- `ValidationContext`: Contains `contentFiles`, `redirectMap`, `validUrls`, `availableSchemas`, `sitemapEntries`

**Usage:**
- **Reactive (CLI)**: Run all validators via `ValidationService.runValidators()`
- **Preventive (API)**: Call single validator via `ValidationService.runSingleValidator(name)` with `apiExposed: true`

### GitHub Content Sync
Content edits made through the inline editor can be automatically committed back to the GitHub repository. This ensures development stays in sync with production content changes.

**Required Environment Variables:**
- `GITHUB_SYNC_ENABLED`: Set to `"true"` to enable GitHub sync (defaults to `"false"`)
- `GITHUB_TOKEN`: Personal access token with `repo` write permissions
- `GITHUB_REPO_URL`: Full GitHub repository URL (e.g., `https://github.com/owner/repo`)
- `GITHUB_BRANCH`: Target branch (defaults to `main`)

**Behavior:**
- When `GITHUB_SYNC_ENABLED=false` (default): GitHub sync is skipped silently
- When `GITHUB_SYNC_ENABLED=true` without config: Editors see a warning that GitHub sync failed
- When `GITHUB_SYNC_ENABLED=true` with config: Changes are committed directly to the configured branch

**Sync Status Indicator:**
- The DebugBubble shows GitHub sync status (in-sync, behind, ahead, diverged, not-configured)
- A warning banner appears when local is behind remote, alerting editors to pull before publishing

**Implementation:**
- `server/github.ts`: GitHub Contents API utility for committing files
- `server/content-editor.ts`: Integrates GitHub commit after YAML file saves
- Commit messages follow format: `[Content] Update {type}/{slug} - {sections} ({date})`

### Conversion Tracking System
A centralized tracking module (`client/src/lib/tracking.ts`) provides type-safe analytics and conversion tracking via Google Tag Manager.

**Pre-defined Conversion Names:**
- `student_application` - Main application form submissions
- `request_more_info` - Syllabus/info requests
- `financing_guide_download` - Guide downloads
- `partner_application` - Hiring partner applications
- `job_application` - Job applications
- `newsletter_signup` - Newsletter signups
- `contact_us` - Contact form submissions
- `outcomes_report` - Outcomes report requests

**Usage in LeadForm YAML:**
```yaml
form:
  conversion_name: student_application  # Required for tracking
  fields:
    email:
      visible: true
      required: true
```

**Key Functions:**
- `trackFormSubmission(conversionName, formData, experimentAssignment)` - Tracks form conversions with hashed email and experiment data
- `track(eventName, payload)` - General event tracking
- `setVisitorContext(context)` - Sets session-level visitor data

**GTM Setup:**
1. Replace `GTM-XXXXXXX` in `client/index.html` with your container ID
2. Uncomment the GTM scripts in the `<head>` and `<body>` sections
3. Configure triggers in GTM for the conversion events

**Privacy:**
- Email addresses are SHA-256 hashed before sending to dataLayer
- Only the first 16 characters of the hash are transmitted

### External Dependencies
-   **4geeks Breathecode API**: Intended for user authentication, profile management, and educational content delivery.
-   **@tabler/icons-react**: Icon library.
-   **react-i18next**: Internationalization library.
-   **Vite**: Frontend build tool.
-   **Tailwind CSS**: CSS framework.
-   **shadcn UI**: UI component library.
-   **wouter**: Routing library.
-   **TanStack Query**: Data fetching and state management.
-   **Express**: Backend server framework.