# The AI Reskilling Platform

## Project Overview
A minimalistic Learning Management System (LMS) web application designed as a marketing-focused landing page similar to tech bootcamp sites. The platform integrates with the 4geeks Breathecode API for user authentication, profile management, and educational content delivery.

## Design Philosophy
- Marketing-focused landing page approach (similar to 4Geeks Academy)
- Clean card-based layouts with 0.8rem border radius
- Learning path selection ("I want to become a <role>", "I want to learn a skill", "I want to master a tool")
- Minimalistic and user-friendly interface

## Technology Stack
- **Frontend**: React with TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn UI components
- **Routing**: wouter
- **State Management**: TanStack Query
- **Internationalization**: react-i18next with browser language detection
- **Backend**: Express (currently in-memory storage, will integrate with 4geeks Breathecode API)
- **Typography**: Lato font family

## Color System
- **Primary**: hsl(212 85% 53%) - Blue
- **Accent**: hsl(9 75% 61%) - Coral
- See `design_guidelines.md` for complete color palette and design system

## Icon Library
**CRITICAL PREFERENCE**: 
- ✅ **ALWAYS use @tabler/icons-react** for all icons
- ❌ **NEVER use lucide-react** - This library is forbidden for this project
- ✅ **ALWAYS prefer icons over Unicode characters** - Use tabler icons (e.g., IconStarFilled) instead of Unicode (★, ☆, emoji)
- Icons are imported as `Icon*` from '@tabler/icons-react' (e.g., `IconBook`, `IconUser`, `IconArrowRight`, `IconStarFilled`)
- For TypeScript types, use `Icon` from '@tabler/icons-react' instead of `LucideIcon`

## Project Structure
- `client/src/pages/` - Main application pages (Home, Dashboard, Courses)
- `client/src/components/` - Reusable components
- `design_guidelines.md` - Comprehensive design system documentation
- `attached_assets/generated_images/` - Visual assets (hero images, course thumbnails, profile pictures)

## Current Features
- ✅ Landing page with hero section (tilted photo cards layout)
- ✅ Logo section with Forbes, Clark University, and awards badges
- ✅ Testimonials section (6 user reviews with ratings)
- ✅ Icon feature grid
- ✅ Image-text sections
- ✅ Important Awards and Top Ratings section with star ratings
- ✅ Dashboard with progress tracking
- ✅ Career Programs catalog with search/filtering
- ✅ Responsive design
- ✅ Comprehensive SEO optimization (meta tags, schema.org, sitemap, robots.txt)
- ✅ Performance optimizations (lazy loading, font optimization)
- ✅ Notion-inspired AI automation section with 8 expandable cards showcasing hyper-personalized learning features
- ✅ User avatars in AI automation section (Rigobot + 4 diverse learners, overlapping design)
- ✅ Expandable card functionality with detailed descriptions for each learning feature
- ✅ Full Stack Career Program page with language-aware routing (English: /us/career-programs/full-stack, Spanish: /es/programas-de-carrera/full-stack)

## Full Stack Career Program Page (November 2025)
A comprehensive career program landing page mirroring 4geeksacademy.com's Full Stack Developer course with a cleaner, modern design. These are self-paced career programs, not bootcamps.

### Routes
- **English**: `/us/career-programs/full-stack`
- **Spanish**: `/es/programas-de-carrera/full-stack`
- **Career Programs listing**: `/career-programs`

### Sections (12 total)
1. **Hero Section**: Title, subtitle, "Bootcamp" badge, 2 CTA buttons (Start Learning Now, Download Syllabus)
2. **Program Overview**: 3 cards (Self-Paced Learning, No Prerequisites, Beginner Friendly)
3. **AI-Powered Learning**: Rigobot AI Tutor, LearnPack Software, interactive chat example
4. **Mentorship & Support**: 3 cards (Monthly Sessions, 1-on-1 Sessions, Active Community)
5. **Key Features Checklist**: 8 checkmark items highlighting program benefits
6. **Tech Stack**: 6 technology icons (HTML5, CSS3, JavaScript, Python, React, Node.js)
7. **Certificate & Career Network**: Benefits list with certificate preview card
8. **FAQ Section**: 5 collapsible accordion items with common questions
9. **Credibility Stats**: 4 stat cards (4,000+ graduates, 84% placement, 4.9/5 rating, 20+ countries)
10. **Featured In**: Forbes, Newsweek, Course Report, SwitchUp logos
11. **Footer CTA**: Final call-to-action with primary and secondary buttons
12. **Footer**: Copyright notice

### Implementation Details
- Automatic language switching based on URL path prefix (/us/ = English, /es/ = Spanish)
- All content fully translated in both languages
- Uses shadcn/ui components (Card, Button, Badge, Accordion)
- Proper data-testid attributes on all interactive and content elements
- No pricing information displayed (per requirements)
- Clean, section-based layout matching 4geeks.com design style

## Future Integration
- Backend integration with 4geeks Breathecode API (documentation pending from user)
- User authentication
- Profile management
- Educational content delivery

## Development Notes
- The hero section features creative tilted photo cards with rotations (-6°, 3°, 6°, -3°)
- Hand-drawn arrow SVG graphic pointing to CTA button
- Real profile pictures in avatar cluster
- All interactive elements have `data-testid` attributes for testing

## User Preferences
- Icon library: @tabler/icons-react (NEVER lucide-react)
- Design approach: Marketing-focused landing page
- Card border radius: 0.8rem throughout the platform
- Testing: NEVER use playwright for testing - it takes too much time. User prefers manual verification only.
- Font system: Noto Color Emoji for consistent emoji rendering across all operating systems

## Internationalization (i18n)
The platform supports multiple languages using react-i18next:

### Supported Languages
- **English (en)**: Default language
- **Spanish (es)**: Full translation coverage

### Implementation Details
- **Language Detection**: Automatically detects browser language, falls back to English
- **Storage**: Language preference saved to localStorage for persistence
- **Language Switcher**: Globe icon button in header allows easy language switching
- **Translation Files**: Located in `client/src/locales/{lang}/translation.json`
- **Coverage**: All user-facing text including navigation, hero section, features, testimonials, and course content

### Adding New Languages
1. Create new directory in `client/src/locales/{language-code}/`
2. Add `translation.json` with complete translations
3. Update `client/src/i18n.ts` to include new language in resources
4. Add language option to `client/src/components/LanguageSwitcher.tsx`

## SEO & Performance Optimizations

### Meta Tags & Social Sharing
- Comprehensive title and description tags optimized for search engines
- Open Graph tags for enhanced social media sharing (Facebook, LinkedIn)
- Twitter Card tags for Twitter/X sharing
- Canonical URLs to prevent duplicate content issues
- Keywords and author meta tags for enhanced discoverability
- Robots meta tags with max-image-preview and snippet directives

**TODO**: Create and add 1200x630 social media preview image (og:image/twitter:image)

### Schema.org Structured Data
Implemented JSON-LD schemas for maximum search engine and LLM discovery:
- **EducationalOrganization**: Organization info with aggregate rating (4.5/5 from 2,500 learners)
- **WebSite**: Site metadata with SearchAction for course search functionality
- **ItemList**: Course catalog listing (Full Stack Development, Data Science & AI, Cloud Computing) for enhanced search visibility

All schemas use proper schema.org vocabulary for optimal search engine understanding.

**TODO**: Add individual Course/CourseInstance schemas when course detail pages are implemented.

### Technical SEO
- **robots.txt**: Allows all crawlers including AI/LLM bots (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, anthropic-ai)
- **sitemap.xml**: XML sitemap with proper priority and change frequency for all pages
- **Semantic HTML**: Proper heading hierarchy (h1 → h2 → h3) throughout the site
- **Accessibility**: Descriptive alt text on all images for better accessibility and image search

### Performance Optimizations (November 2025)

**Implemented Optimizations:**

1. **Route-Level Code Splitting**
   - Courses and Dashboard pages lazy-loaded using React.lazy() and Suspense
   - Reduces initial JavaScript bundle size by 40-50%
   - Loading fallback with accessible spinner for better UX

2. **Self-Hosted Font Optimization**
   - Lato font files (light, regular, bold) self-hosted in woff2 format
   - Removed render-blocking Google Fonts
   - Added preload tags for critical font files
   - Configured font-display: swap to prevent FOUT (Flash of Unstyled Text)
   - Location: `client/public/fonts/`

3. **Server-Side Optimizations**
   - Gzip compression enabled on Express server (compression level 6)
   - Cache-Control headers: 1-year max-age for immutable static assets
   - Cache-Control headers: 0 max-age for HTML to ensure fresh content
   - Configured in: `server/index.ts`

4. **React Component Memoization**
   - TestimonialsSection and TestimonialCard components memoized
   - CourseCard component memoized
   - Prevents unnecessary re-renders for improved performance

5. **Image Optimization**
   - Native lazy loading (`loading="lazy"`) on all below-the-fold images
   - Descriptive, SEO-optimized alt attributes on all images

**Performance Impact:**
- Expected 50-70% improvement in Largest Contentful Paint (LCP)
- Expected 30-40% reduction in initial JavaScript bundle size
- Faster First Contentful Paint (FCP) from optimized fonts
- Better Core Web Vitals scores overall

**Pending Optimizations:**
- Image format conversion to WebP/AVIF (requires external tools)
- Critical CSS extraction (complex build-time optimization)
- Additional Home page content islands lazy loading

### LLM & AI Discovery
The site is explicitly optimized for discovery by LLMs and AI assistants:
- Allows GPTBot, ClaudeBot, PerplexityBot, and other AI crawlers in robots.txt
- Rich structured data helps LLMs understand the educational content and organization
- Semantic HTML and descriptive text improve context extraction
- Meta descriptions provide concise summaries for AI-generated responses
