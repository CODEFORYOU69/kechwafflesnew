# Step 01: Analyze

**Task:** Kech Waffles — Social Media Content Planner + Remotion Visuals
**Started:** 2026-03-30T01:10:16Z

---

## Context Discovery

## Codebase Context

### Related Files Found
| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | 47 models (User, Session, Product, etc.) — no marketing models yet |
| `lib/prisma.ts` | Prisma singleton client |
| `lib/auth.ts` | Better Auth server config + auto-MemberCard creation hook |
| `lib/admin.ts` | `isUserAdmin(userId)`, `isAdmin(userId)` role check utilities |
| `middleware.ts` | Protects `/admin/*` and `/api/admin/*` via session cookie check |
| `app/admin/page.tsx` | Dashboard pattern: "use client", useState+useEffect, fetch from API |
| `app/api/admin/users/route.ts` | Admin API pattern: session → isUserAdmin → prisma → NextResponse |
| `app/api/cron/generate-daily-qr/route.ts` | Cron pattern: Bearer CRON_SECRET header validation |
| `next.config.ts` | Minimal config — only image remotePatterns for flagcdn.com |
| `package.json` | Next.js 15.1.9, React 19, Prisma 6.17.1, Better Auth 1.3.27 |
| `components/ui/` | 25 shadcn/ui components: badge, button, card, dialog, input, progress, select, separator, sheet, switch, table, tabs, textarea, tooltip |

### Patterns Observed
- **Admin page pattern**: `"use client"` + `useState`/`useEffect` + `fetch("/api/admin/...")` — NO React Query
- **API route pattern**: `try-catch` + `auth.api.getSession(await headers())` + `isUserAdmin()` + prisma + `NextResponse.json()`
- **Error responses**: `NextResponse.json({ error: "message" }, { status: 4xx })` or `{ success: false, message }`
- **Admin route guard**: middleware checks session cookie existence only; role check inside handler
- **Validation**: Manual inline checks — NO Zod installed
- **No toast library**: Admin pages use `alert()` / `console.error()` — must install sonner
- **No React Query**: Must install `@tanstack/react-query` for polling
- **Dynamic params**: Next.js 15 pattern `await context.params` used throughout
- **Path alias**: `@/*` → project root

### Available Utilities
- `lib/prisma.ts` — Prisma client (singleton with global dev cache)
- `lib/admin.ts` — `isUserAdmin(userId): Promise<boolean>`
- `lib/admin-check.ts` — `isAdmin(userId): Promise<boolean>`
- `lib/auth.ts` — `auth.api.getSession({ headers: await headers() })`

## Critical Technical Findings

### 1. Gemini SDK — Breaking Change
- **DEPRECATED**: `@google/generative-ai` (old package in skill spec)
- **USE INSTEAD**: `@google/genai` (new 2026 package)
- New API: `new GoogleGenAI({ apiKey })` → `ai.models.generateContent({ model, contents, config: { responseMimeType, responseJsonSchema } })`
- Recommended model: `gemini-2.5-flash` (not `gemini-2.0-flash`)
- `response.text` is guaranteed valid JSON when using `responseJsonSchema`

### 2. Remotion Server-Side — Critical Constraint
- **CANNOT** call `@remotion/bundler` inside Next.js API routes (webpack-in-webpack conflict)
- **SOLUTION**: Pre-bundle at app startup → store bundle path → API routes only call `selectComposition()` + `renderMedia()`
- `renderMedia()` is **blocking** — must run in background without blocking HTTP response
- **Background approach**: Use `after()` from `next/server` (Next.js 15) for fire-and-forget
- `next.config.ts` needs `serverExternalPackages: ['@remotion/renderer']` (NOT `serverComponentsExternalPackages`)
- Remotion entry point: `remotion/src/index.ts` calling `registerRoot()`

### 3. Next.js 15 Config Key
```ts
// next.config.ts — correct key for Next.js 15:
serverExternalPackages: ['@remotion/renderer', '@remotion/bundler']
// NOT: experimental.serverComponentsExternalPackages (old key)
```

### 4. Missing Dependencies to Install
```bash
pnpm add @google/genai
pnpm add remotion @remotion/renderer @remotion/bundler @remotion/shapes
pnpm add @tanstack/react-query
pnpm add sonner
```

## Inferred Acceptance Criteria

- [ ] AC1: `MonthPlan` + `SocialPost` Prisma models added and migrated to DB
- [ ] AC2: `generateMonthPlan(month, year)` calls Gemini, parses JSON, saves to DB
- [ ] AC3: 4 Remotion compositions render correctly (ProductShowcase, BehindScenes, MoroccanTouch, Promotion)
- [ ] AC4: `/api/marketing/generate-visual` fires background render, returns `{ status: "rendering" }` immediately
- [ ] AC5: Background render updates post status to "ready" + sets mediaUrl when done
- [ ] AC6: `/marketing` dashboard shows post table with theme badges, status badges, actions
- [ ] AC7: PostDrawer shows caption (copy), hashtags (copy), visual preview/download, status select
- [ ] AC8: Client polls `/api/marketing/visual-status/[postId]` every 3s while status="rendering"
- [ ] AC9: CSV + JSON export buttons work
- [ ] AC10: TypeScript strict mode — no errors
