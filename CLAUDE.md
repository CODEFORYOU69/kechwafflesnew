# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Read First

- `documents/design-system.md`: palette, contrasts, typography, motion rules (« La Porte »). Its rules are not negotiable.
- `lib/site-content.ts`: all the site's copy and business facts. Import from it; never invent a price, a schedule or a service.

## Development Commands

### Core Development
- `npm run dev` or `pnpm dev` - Start development server (Next.js)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Package Manager
This project uses **pnpm** as the primary package manager (evidenced by pnpm-lock.yaml).

## Architecture Overview

### Tech Stack
- **Next.js 15** with App Router (React 19)
- **TypeScript** throughout
- **Tailwind CSS** for styling
- **Shadcn/ui** component library with Radix UI primitives
- **Motion**: CSS and a single runtime (`components/motion/`), Lenis for wheel smoothing, Framer Motion (`LazyMotion` + `m.*`) only in islands where CSS is not enough
- **Fonts**: Bricolage Grotesque (display) and JetBrains Mono (labels) self-hosted and instanced in `app/fonts/`, Instrument Sans (body) and Instrument Serif (accent) from `next/font/google`

### Project Structure
```
app/
├── components/         # Navigation, StructuredData, WhatsApp button, marketing
├── cafe-ia/ girls-only/ location/ menu/ notre-histoire/ prestations/ product/
├── admin/ concours/ loyalty/ api/   # Application routes: no smooth scroll, no curtain
├── Footer.tsx
├── layout.tsx          # Root layout: fonts, Navigation, Footer, motion runtime
├── page.tsx            # Home: assembles components/sections
└── globals.css         # Design system classes and tokens

components/
├── sections/           # Home sections (Server Components) and their small islands
├── motion/             # Reveal, ParallaxLayer, MagneticButton, MotionRuntime, PageTransition
├── brand/              # Animated logo
└── ui/                 # Shadcn/ui components

lib/
├── site-content.ts     # Copy and facts, single source
├── casablanca-time.ts  # Café clock: call after mount only
└── utils.ts            # `cn`, with the design system's type scale declared to tailwind-merge
```

### Key Architecture Patterns
- **App Router**: Uses Next.js 15 App Router with file-based routing
- **RSC Strategy**: Sections and pages are Server Components, with one small client island per interaction
- **Component Organization**: Site sections in `components/sections/`, CSS specific to a section in a `*.module.css` beside it, reusable UI in `components/ui/`
- **Styling System**: Shadcn/ui with CSS variables for theming, mobile-first responsive design
- **Internationalization**: French language (lang="fr" in layout)

## Code Style & Conventions

### From .cursorules Configuration
- **TypeScript everywhere**: Prefer `type` over `interface`, avoid enums
- **Functional components**: No classes, use composition over inheritance
- **Naming**: lowercase with dashes for directories (e.g., `notre-histoire/`)
- **Exports**: Prefer named exports for components
- **Props**: Inline type definitions, avoid separate interfaces
- **Server Components**: Leverage React 19 RSC, minimize client components
- **Performance**: Wrap client components in Suspense, lazy load non-critical components

### File Organization Pattern
```tsx
// Exported Component
export function MyComponent(props: { prop1: string; prop2: number }) {
  return <div>{props.prop1}</div>;
}

// Subcomponents
// Helpers
// Static Content
// Types
```

### Commit Convention
Uses **Commitizen** style:
- `feat(ui): add dark mode`
- `fix(auth): fix login bug`
- `refactor(db): optimize queries`
- Keep commits ≤ 50 chars, describe what and why, not how

## UI Components & Styling

### Shadcn/ui Configuration
- Style: "new-york"
- RSC enabled: true
- Base color: neutral
- CSS variables: enabled
- Icons: Lucide React

### Path Aliases
- `@/components` → components/
- `@/lib` → lib/
- `@/components/ui` → components/ui/

### Theme System
Uses CSS custom properties in `globals.css` for consistent theming across light/dark modes with HSL color space.

## Business Context
**Kech Waffles** - Specialty coffee shop in Marrakech (MAG 33, Al Badii):
- Specialty coffee and croffles first, with daily house pastries
- Girls Only on Tuesdays and Thursdays, Café IA and IT help for students
- Traditional waffles are events only: they appear solely in Prestations
- QR code menu system for customers
- WhatsApp integration for orders/contact

## Performance Considerations
- Next.js Image optimization with proper `sizes` prop
- Priority loading for above-fold images only
- Animate `transform` and `opacity` only; scroll-driven effects in CSS, off the main thread
- CSS variables for efficient theme switching