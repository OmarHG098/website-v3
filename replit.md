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
- ✅ Feature sections with stats (20,000 students, 5000 hours, 85% placement)
- ✅ Icon feature grid
- ✅ Image-text sections
- ✅ Testimonials with ratings
- ✅ Dashboard with progress tracking
- ✅ Course catalog with search/filtering
- ✅ Responsive design
- ✅ Comprehensive SEO optimization (meta tags, schema.org, sitemap, robots.txt)
- ✅ Performance optimizations (lazy loading, font optimization)

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
- Testing: NEVER use playwright for testing - user prefers manual verification or alternative testing approaches
- Font system: Noto Color Emoji for consistent emoji rendering across all operating systems

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

### Performance Optimizations
- **Lazy Loading**: All images use native lazy loading (`loading="lazy"`) for improved initial page load
- **Font Optimization**: Google Fonts configured with `display=swap` to prevent FOUT (Flash of Unstyled Text)
- **Preconnect Headers**: DNS prefetching for Google Fonts to reduce latency
- **Image Alt Text**: Descriptive, SEO-optimized alt attributes on all images

### LLM & AI Discovery
The site is explicitly optimized for discovery by LLMs and AI assistants:
- Allows GPTBot, ClaudeBot, PerplexityBot, and other AI crawlers in robots.txt
- Rich structured data helps LLMs understand the educational content and organization
- Semantic HTML and descriptive text improve context extraction
- Meta descriptions provide concise summaries for AI-generated responses
