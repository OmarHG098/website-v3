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
- **Typography**: Poppins font family

## Color System
- **Primary**: hsl(212 85% 53%) - Blue
- **Accent**: hsl(9 75% 61%) - Coral
- See `design_guidelines.md` for complete color palette and design system

## Icon Library
**CRITICAL PREFERENCE**: 
- ✅ **ALWAYS use @tabler/icons-react** for all icons
- ❌ **NEVER use lucide-react** - This library is forbidden for this project
- Icons are imported as `Icon*` from '@tabler/icons-react' (e.g., `IconBook`, `IconUser`, `IconArrowRight`)
- For TypeScript types, use `Icon` from '@tabler/icons-react' instead of `LucideIcon`

## Project Structure
- `client/src/pages/` - Main application pages (Home, Dashboard, Courses)
- `client/src/components/` - Reusable components
- `design_guidelines.md` - Comprehensive design system documentation
- `attached_assets/generated_images/` - Visual assets (hero images, course thumbnails, profile pictures)

## Current Features
- ✅ Landing page with hero section (tilted photo cards layout)
- ✅ Logo section
- ✅ Feature sections with stats (20,000 students, 5000 hours, 85% placement)
- ✅ Icon feature grid
- ✅ Image-text sections
- ✅ Testimonials with ratings
- ✅ Dashboard with progress tracking
- ✅ Course catalog with search/filtering
- ✅ Responsive design

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
