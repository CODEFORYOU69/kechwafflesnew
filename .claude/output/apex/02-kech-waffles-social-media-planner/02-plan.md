# Step 02: Plan

**Task:** Kech Waffles — Social Media Content Planner + Remotion Visuals
**Started:** 2026-03-30T01:10:16Z

---

## Planning Progress

## Architecture Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Gemini SDK | `@google/genai` (new) | `@google/generative-ai` deprecated |
| Gemini model | `gemini-2.5-flash` | Best free-tier option |
| Remotion bundling | Module-level cache, NOT in API routes | webpack-in-webpack conflict |
| Background render | `after()` from `next/server` | Non-blocking, Next.js 15 native |
| Polling | `useEffect + setInterval` | No React Query installed |
| Toast | `sonner` | No toast lib installed |
| Admin route | `app/admin/marketing/` | Follows existing `/admin/` pattern |
| Remotion entry | `remotion/src/index.ts` (local in project) | Co-located with Next.js |

## Files Plan

### Phase 0 — Foundation (Task #1)
- `pnpm add @google/genai remotion @remotion/renderer @remotion/bundler sonner`
- `next.config.ts` — add `serverExternalPackages: ['@remotion/renderer', '@remotion/bundler']`
- `prisma/schema.prisma` — add MonthPlan + SocialPost models
- `public/renders/.gitkeep` — render output directory

### Phase 1 — Remotion Compositions (Tasks #3-7)
- `remotion/src/index.ts` — registerRoot entry
- `remotion/src/Root.tsx` — 4 compositions, 1080×1080, 30fps
- `remotion/src/compositions/ProductShowcase.tsx`
- `remotion/src/compositions/BehindScenes.tsx`
- `remotion/src/compositions/MoroccanTouch.tsx`
- `remotion/src/compositions/Promotion.tsx`

### Phase 2 — Library (Tasks #8-9)
- `lib/marketing/gemini-planner.ts` — @google/genai, gemini-2.5-flash
- `lib/marketing/remotion-renderer.ts` — pre-bundle cache + renderPostVisual

### Phase 3 — API Routes (Tasks #11-15)
- `app/api/marketing/generate-plan/route.ts` (maxDuration=60)
- `app/api/marketing/generate-visual/route.ts` (uses after())
- `app/api/marketing/visual-status/[postId]/route.ts`
- `app/api/marketing/plans/route.ts` + `plans/[planId]/route.ts`
- `app/api/marketing/posts/[postId]/route.ts`

### Phase 4 — UI (Tasks #10, #16-20)
- `app/layout.tsx` — add Toaster
- `app/components/marketing/GeneratePlanButton.tsx`
- `app/components/marketing/PostsTable.tsx`
- `app/components/marketing/PostDrawer.tsx`
- `app/components/marketing/ExportButtons.tsx`
- `app/admin/marketing/page.tsx`

## Task Dependencies

```
1 ──▶ 2 ──▶ 8 ──▶ 11 ──▶ 16
         ├──▶ 13                       ╮
         ├──▶ 14              17 ◀── 12, 13
         └──▶ 15 ──▶ 18        18, 19
1 ──▶ 3 ──▶ 4,5,6,7 ──▶ 9 ──▶ 12
20 ◀── 16, 17, 18, 19
```

## 20 Tasks Created ✓
