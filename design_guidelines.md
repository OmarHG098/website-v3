# Design Guidelines: The AI Reskilling Platform

## Design Approach

**Reference-Based Approach**: Drawing inspiration from Coursera and Khan Academy's clean, content-focused educational interfaces. The platform prioritizes learning flow, content hierarchy, and minimal distractions while maintaining visual appeal through strategic use of cards, spacing, and accent colors.

**Core Principles**:
- Content-first hierarchy with clear learning paths
- Card-based modular design for scalability
- Minimal but purposeful use of color (blue primary, coral accents)
- Clean, spacious layouts that reduce cognitive load
- Progress visualization as a motivational element

## Typography System

**Font Family**: Lato (via Google Fonts CDN)

**Hierarchy**:
- **Page Titles**: 2.5rem (40px), font-weight 700, letter-spacing -0.02em
- **Section Headers**: 2rem (32px), font-weight 600
- **Card Titles/Course Names**: 1.25rem (20px), font-weight 600
- **Subheadings**: 1.125rem (18px), font-weight 500
- **Body Text**: 1rem (16px), font-weight 400, line-height 1.6
- **Small Text/Metadata**: 0.875rem (14px), font-weight 400
- **Labels/Badges**: 0.75rem (12px), font-weight 500, uppercase tracking

## Layout System

**Spacing Scale**: Use 0.25rem (4px) increments: 0.5rem, 1rem, 1.5rem, 2rem, 3rem, 4rem

**Common Spacing Patterns**:
- Card padding: 1.5rem (24px)
- Section spacing: 3rem to 4rem vertical
- Grid gaps: 1.5rem between cards
- Element margins: 0.5rem to 1rem

**Container Widths**:
- Main content: max-width 1200px, centered
- Dashboard layouts: max-width 1400px for multi-column views
- Text content: max-width 800px for readability

**Responsive Grid**:
- Mobile (base): Single column
- Tablet (md): 2 columns for course cards
- Desktop (lg): 3 columns for course cards, 2 columns for dashboard widgets

## Component Library

### Navigation
**Top Navigation Bar**:
- Fixed header with white background, subtle bottom border
- Logo left, primary navigation center, user profile/avatar right
- Height: 4rem (64px)
- Navigation links: 1rem font-size, 0.75rem spacing between items
- Active state: coral underline (3px thick)

### Cards
**Course Cards**:
- White background, 0.8rem border radius
- Subtle shadow: 0 2px 8px rgba(0, 0, 0, 0.08)
- Hover: subtle lift with increased shadow
- Structure: Course thumbnail (16:9 ratio), title, brief description, progress bar, duration/difficulty badges
- Padding: 1.5rem
- Thumbnail height: 180px

**Learning Path Selection Cards**:
- Larger cards (min-height: 200px)
- Icon or illustration at top
- Clear heading and description
- Prominent CTA button
- Hover: slight scale (1.02) and shadow increase

**Dashboard Widgets**:
- Consistent card styling
- Headers with icon + title
- Content area with metrics or lists
- Minimum height: 250px to maintain visual balance

### Progress Indicators
**Progress Bars**:
- Height: 0.5rem (8px)
- Background: light grey (hsl(0deg 0% 81.18%))
- Fill: blue gradient for completed, coral for current section
- Fully rounded ends (border-radius: 9999px)

**Completion Badges**:
- Circular badges (48px diameter)
- Green checkmark for completed
- Blue outline for in-progress
- Grey for not started

### Buttons
**Primary Button**:
- Blue background, white text
- Padding: 0.75rem 2rem
- Border-radius: 0.8rem
- Font-weight: 600
- Hover: slightly darker blue

**Secondary Button**:
- White background, blue border (2px), blue text
- Same padding and border-radius as primary

**Accent/CTA Button**:
- Coral background for high-priority actions
- White text, same styling as primary

### Forms & Inputs
**Input Fields**:
- Border: 2px solid light grey
- Border-radius: 0.8rem
- Padding: 0.75rem 1rem
- Focus: blue border, subtle shadow
- Error state: red border with error message below

**Dropdowns/Selects**:
- Consistent styling with input fields
- Custom dropdown arrow in blue

### Dashboard Elements
**Stats Display**:
- Large number (2.5rem) in blue
- Label below in grey (0.875rem)
- Icon next to number
- Arranged in grid (3-4 columns on desktop)

**Recent Activity Feed**:
- List of items with timestamps
- Course icon/thumbnail on left
- Activity description and time on right
- Divider lines between items

## Images

**Hero Section** (Homepage/Landing):
- Large hero image (height: 400-500px) showing diverse students learning/collaborating
- Overlay with semi-transparent blue gradient (left to right)
- Centered text overlay with platform tagline and primary CTA
- CTA button with blurred background

**Course Thumbnails**:
- 16:9 ratio placeholder images for each course
- Consistent illustration style or photos related to course topic
- Subtle overlay on hover

**Learning Path Icons**:
- Custom illustrated icons for each path type (role, skill, tool)
- Colorful, modern line-art style
- Approximately 80px size within selection cards

**Empty States**:
- Friendly illustrations for "no courses yet", "no progress", etc.
- Centered, with supportive copy below

## Visual Enhancements

**Shadows**: Use sparingly - cards only (0 2px 8px rgba(0,0,0,0.08)), slightly increased on hover
**Borders**: Minimal use - primarily for input fields and card separators
**Animations**: Subtle hover transitions (200ms ease), no scroll-based animations
**Iconography**: Use Heroicons (outline style) via CDN for consistency - education, chart, user, check, clock icons throughout