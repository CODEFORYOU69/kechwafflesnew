# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
- **Framer Motion** for animations
- **Poppins** font from Google Fonts

### Project Structure
```
app/
├── components/           # App-specific components (Hero, Navigation, etc.)
├── location/            # Location page route
├── menu/               # Menu page route
├── notre-histoire/     # History page route
├── product/            # Product page route
├── layout.tsx          # Root layout with Navigation & WhatsApp button
├── page.tsx            # Home page (client component)
└── globals.css         # Global styles with Tailwind

components/
├── ui/                 # Shadcn/ui components (button, card, etc.)
└── magicui/           # Magic UI components

lib/
└── utils.ts           # Utility functions (likely cn function for Tailwind)
```

### Key Architecture Patterns
- **App Router**: Uses Next.js 15 App Router with file-based routing
- **RSC Strategy**: Mix of Server and Client Components (main page is client-side for Framer Motion)
- **Component Organization**: App components in `app/components/`, reusable UI in `components/ui/`
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
**Kech Waffles** - Restaurant in Marrakech specializing in:
- Sweet delicacies (Tiramisu-style waffles, pancakes, crauffles)
- Savory stuffed brioches (cheddar, Indian goat cheese, traditional Savoyard)
- QR code menu system for customers
- WhatsApp integration for orders/contact

## Performance Considerations
- Next.js Image optimization with proper `sizes` prop
- Priority loading for above-fold images
- Framer Motion animations with `whileInView` for performance
- CSS variables for efficient theme switching