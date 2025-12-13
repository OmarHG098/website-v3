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
-   **Session Management System**: A hybrid client-side system provides IP-based geolocation, nearest campus calculation, UTM parameter tracking, and language detection. It uses a Web Worker for heavy processing, `SessionContext` for React hooks, and caches data in localStorage.
-   **A/B Testing Experiment System**: A performant, cookie-based system for content variants, managed by `ExperimentManager.ts`. It supports various targeting variables, debug endpoints, zero-latency design, and a comprehensive `Experiment Editor` for managing tests with live preview. It includes a `Visitor Tracking System` for unique visitor counting and experiment auto-stopping.
-   **UniversalVideo Component**: A mandatory component (`client/src/components/UniversalVideo.tsx`) for all video content, handling local videos natively and lazy-loading `react-player` for external sources. Configurable via YAML with schema validation.
-   **UniversalImage Component**: A mandatory component (`client/src/components/UniversalImage.tsx`) for all image content, referencing an `image-registry.json` for metadata and supporting presets and lazy loading.
-   **Inline Editing System**: A capability-based system for human editors and AI agents, enabling content modification directly on the site. It includes an `EditModeContext`, `EditableSection` wrappers, a `SectionEditorPanel` with YAML editor, and server-side content manipulation via API endpoints.

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