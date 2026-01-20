# Vital Edge Insurance - Copilot Instructions

## Project Overview
Vital Edge Insurance is a Next.js 16 website for an insurance guidance business in Jacksonville, FL. It's a content-driven site with SEO focus, serving as a digital storefront for health insurance services (ACA, Medicare, small business coverage).

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with React 19 (App Router)
- **Styling**: Tailwind CSS 4 with PostCSS
- **Type Safety**: TypeScript 5 (strict mode)
- **Animations**: Framer Motion
- **Linting**: ESLint 9 with Next.js config

### Directory Structure
- `src/app/` - Next.js App Router pages and layout
- `src/components/` - Reusable React components (Container, Header, Footer)
- `src/lib/site.ts` - **Central configuration file** - contains all site metadata, navigation structure, contact info, and schema.org utilities
- `src/globals.css` - Global Tailwind styles
- `public/` - Static assets

## Key Patterns & Conventions

### Site Configuration
All site metadata lives in **[src/lib/site.ts](src/lib/site.ts)** as a single `site` constant object. This includes:
- Domain, URLs, contact info
- Navigation structure (`site.nav`)
- Service areas and business details
- Primary CTA (Call-to-Action)

Always reference `site.*` for configuration rather than hardcoding values. Example:
```tsx
import { site } from "@/lib/site";
<Link href={site.primaryCta.href}>{site.primaryCta.label}</Link>
```

### Schema.org & SEO
`site.ts` exports utility functions for JSON-LD structured data:
- `organizationJsonLd()` - Organization schema for Google Knowledge Graph
- `localBusinessJsonLd()` - Local Business schema for local search ranking
- `absoluteUrl()` - Converts relative paths to absolute URLs for metadata

These are embedded in [src/app/layout.tsx](src/app/layout.tsx) and should be used for all metadata generation.

### Component Patterns
1. **Container component** - Wraps content with consistent max-width (6xl) and padding. Use for all major sections.
2. **Header/Footer** - Use "use client" directive; Header has Framer Motion animations on CTA button
3. **Link usage** - Prefer Next.js Link component over HTML anchors for client-side navigation

### Styling
- Tailwind CSS for all styling (no CSS modules or emotion)
- Dark text (`text-black`) on light backgrounds, careful with opacity (`text-black/70`, `border-black/10`)
- Responsive design uses `sm:`, `md:` Tailwind breakpoints
- Component UI pattern: rounded corners (`rounded-xl`, `rounded-lg`), subtle borders (`border-black/10`), gradient accents

### Navigation & Routing
Navigation structure is centralized in `site.nav` array:
- `/services` - Main services page
- `/aca` - ACA Marketplace coverage
- `/ichra` - Small Business (ICHRA) offerings
- `/medicare` - Medicare education
- `/about` - Company info
- `/contact` - Contact form

Primary CTA always points to `/contact`.

## Development Workflow

### Essential Commands
```bash
npm run dev      # Start dev server (localhost:3000 with hot reload)
npm run build    # Production build
npm run start    # Run production server
npm run lint     # Run ESLint
```

### Key Files for Different Tasks
- **Adding a new page**: Create `.tsx` file in `src/app/`, export default component, add to `site.nav` if needed
- **Creating a component**: Add to `src/components/`, use TypeScript interfaces for props
- **Updating metadata/SEO**: Modify `site.ts` config and sync with layout.tsx metadata
- **Styling changes**: Use Tailwind classes; stay within project's black/white + opacity color scheme
- **Adding animations**: Use Framer Motion (already configured in Header component)

## Important Conventions

### Type Safety
- All components must have typed props using TypeScript interfaces or inline types
- Use `type { ReactNode }` for children prop, `type { NextConfig }` for config
- Strict mode enabled in tsconfig.json

### URL Handling
- Use `absoluteUrl()` from site.ts for generating full URLs in metadata
- Use relative paths with Next.js Link component for navigation
- Environment variable: `NEXT_PUBLIC_SITE_URL` (falls back to `http://localhost:3000`)

### Metadata & Compliance
- Every page should export metadata in `layout.tsx` or per-page with `generateMetadata()`
- Include Medicare disclaimer where relevant: "Not connected with or endorsed by the U.S. government or the federal Medicare program."
- Service areas: Duval County, FL and St. Johns County, FL

### Component Organization
- Use "use client" only where interactivity is required (Header, interactive forms)
- Prefer Server Components for static content and data fetching
- Keep page components light; extract reusable logic to lib functions

## Integration Points

### External Dependencies
- **Framer Motion**: Animation library for interactive elements (Header CTA hover effects)
- **Next.js Fonts**: Using Inter font from Google Fonts with swap display strategy
- **Tailwind CSS 4**: PostCSS-based, ensure postcss.config.mjs is not modified without reason

### Build & Deployment
- Deployment target: Vercel (see next.config.ts placeholder)
- Next.js caching strategies apply (ISR, SSG patterns available if needed)
- Post-CSS processing for Tailwind is configured and working

## Notes for Agents
- The site is business-focused; maintain professional, approachable tone
- Geographic specificity is important (Jacksonville, Duval/St. Johns County references)
- SEO is critical; always include metadata for new pages
- JSON-LD structured data should be added to any new pages for search visibility
