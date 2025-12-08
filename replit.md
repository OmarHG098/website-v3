# The AI Reskilling Platform

### Overview
The AI Reskilling Platform is a minimalistic Learning Management System (LMS) web application designed as a marketing-focused landing page. It aims to offer a user-friendly interface for career path selection and skill acquisition, similar to leading tech bootcamps. The platform integrates with the 4geeks Breathecode API for authentication, profile management, and content delivery. Its business vision is to provide accessible, high-quality AI-focused education, targeting a global market with a scalable, content-driven architecture.

### User Preferences
- Icon library: @tabler/icons-react (NEVER lucide-react)
- Design approach: Marketing-focused landing page
- Card border radius: 0.8rem throughout the platform
- Testing: NEVER use playwright for testing - it takes too much time. User prefers manual verification only.
- Font system: Noto Color Emoji for consistent emoji rendering across all operating systems
- Colors: ONLY semantic tokens - NEVER use hardcoded colors like `bg-blue-500`, `text-red-600`, or arbitrary hex values. Only use semantic classes: `bg-primary`, `text-foreground`, `bg-muted`, etc.

### System Architecture
The platform is built with a modern web stack: React with TypeScript, Vite for the frontend, Tailwind CSS and shadcn UI for styling, wouter for routing, and TanStack Query for state management. The backend uses Express, currently with in-memory storage, slated for integration with the 4geeks Breathecode API.

**Key Architectural Decisions & Features:**
-   **Design System**: Employs a clean, card-based layout with a strict semantic color system using predefined Tailwind classes. Typography uses the Lato font family. All icons must be from `@tabler/icons-react`.
-   **Content Management System (CMS)**: A YAML-based system allows marketing teams to manage content for career programs, landing pages, and location pages without code changes. Content is stored in:
    - `marketing-content/programs/{program-slug}/{locale}.yml` for career programs
    - `marketing-content/landings/{landing-slug}/{locale}.yml` for landing pages
    - `marketing-content/locations/{slug}/` for location pages with:
      - `campus.yml` - Non-translated campus info (slug, name, city, country, coordinates, phone, address, available_programs, catalog with admission_advisors)
      - `en.yml` - English translated content (meta, schema, sections)
      - `es.yml` - Spanish translated content (meta, schema, sections)
    All content types share the same structure with `meta`, `schema`, and `sections` properties, dynamically rendered by a unified `SectionRenderer` component. Location-specific section types include `features_grid`, `programs_list`, and `cta_banner`.
-   **Internationalization (i18n)**: Supports English (default) and Spanish using `react-i18next`, with automatic browser language detection and a language switcher.
-   **SEO & Performance**: Comprehensive SEO includes meta tags, Open Graph, Twitter Cards, Schema.org JSON-LD, `robots.txt` allowing AI crawlers, and dynamic sitemaps. Performance optimizations include route-level code splitting, self-hosted WOFF2 fonts with `font-display: swap`, server-side Gzip compression, React component memoization, and native lazy loading for images.
-   **Schema.org System**: Centralized in `marketing-content/schema-org.yml` for managing structured data. Pages reference schemas via `schema.include: ["organization", "website", "courses:full-stack"]` and can override properties with `schema.overrides`. The `useSchemaOrg` React hook fetches and injects JSON-LD into page heads with proper cleanup between navigations. Nested schemas use prefix notation (e.g., `courses:full-stack`, `item_lists:career-programs`). **Location pages automatically include the organization schema as parentOrganization** - no need to define it in each location YAML file.
-   **URL Redirects System**: A robust system handles 301 redirects defined in YAML meta properties, with a validation script (`scripts/validate-content.ts`) to prevent conflicts and ensure target existence.
-   **Debug Mode**: A `DebugBubble` component provides development utilities like theme toggle, language switcher, sitemap viewer, and component showcase, visible in development or via a `?debug=true` URL parameter in production.
-   **Versioned Component Registry**: A filesystem-based registry at `marketing-content/component-registry/{component}/v{version}/` stores versioned component schemas and examples. Each version folder contains a `schema.yml` (defining props, descriptions, when-to-use guidance) and an `examples/` subfolder with individual YAML example files. The API at `/api/component-registry` enables listing components, loading schemas/examples by version, and creating new versions via folder cloning. The ComponentShowcase page (`/showcase`) consumes this API with version/example dropdowns, live YAML editing with preview, and guided modals for adding new examples. YAML content files reference component versions via `version: "1.0"` in each section.
-   **Session Management System**: A hybrid client-side session system provides IP-based geolocation, nearest campus calculation, UTM parameter tracking, and language detection. Key components:
    - `shared/session.ts`: Type definitions for Session, Location, UTMParams, GeoData
    - `client/src/workers/session.worker.ts`: Web worker for deferred heavy processing (IP lookup, haversine distance calculation)
    - `client/src/contexts/SessionContext.tsx`: React context with `useSession`, `useLocation`, `useLanguage`, `useUTM`, `useRegion` hooks
    - `client/src/lib/locations.ts`: Static campus data with coordinates for 33 locations across USA, Canada, LATAM, and Europe
    - `marketing-content/locations/{slug}/`: Location folders with campus.yml + locale files
    - Session data is cached in localStorage with versioning for cache invalidation (24-hour stale threshold)
    - Geolocation uses ip-api.com with 5-second timeout and graceful fallbacks
    - Nearest campus sorting uses the haversine (great-circle) distance formula
    - Location slugs follow pattern: `{city}-{country}` (e.g., `miami-usa`, `madrid-spain`, `bogota-colombia`)

### External Dependencies
-   **4geeks Breathecode API**: Used for user authentication, profile management, and educational content delivery (future integration).
-   **@tabler/icons-react**: Primary icon library.
-   **react-i18next**: For internationalization and localization.
-   **Vite**: Frontend build tool.
-   **Tailwind CSS**: Utility-first CSS framework.
-   **shadcn UI**: UI component library.
-   **wouter**: Small routing library.
-   **TanStack Query**: Data fetching and state management.
-   **Express**: Backend server framework.