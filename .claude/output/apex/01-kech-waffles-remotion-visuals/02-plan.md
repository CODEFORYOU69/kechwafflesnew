# Step 02: Plan

**Task:** Créer vidéos TikTok virales + visuels Instagram/Snapchat pour Kech Waffles avec Remotion - highlight tiramisus
**Started:** 2026-03-30T00:01:42Z

---

## Planning Progress

## Implementation Plan: Viral TikTok + Instagram/Snapchat Visuals — Kech Waffles Tiramisus

### Overview
Create 2 new Remotion compositions for tiramisu-focused social media content (viral TikTok/Reels/Snapchat + Instagram feed), copy 23 new high-res photos and 6 videos to the Remotion project, and register everything in Root.tsx.

### Prerequisites
- [x] Remotion project at `~/documents/dev/remotion` — confirmed
- [x] 23 new JPG photos + 6 MP4 clips in `Photos-3-001 2` — confirmed
- [x] Existing premium design system (PREMIUM, TYPO, GRADIENTS) — confirmed
- [x] BrandIntro, SPRINGS, LOGO_PATH reusable — confirmed

---

### File Changes

#### `public/kech-waffles/new-photos/` (NEW DIRECTORY — copy task)
- Create directory and copy all 23 JPG files from `Photos-3-001 2`
- Keep original filenames (PXL_YYYYMMDD_*.jpg)

#### `public/videokech/` (UPDATE — copy)
- Copy 6 new MP4 video clips from `Photos-3-001 2`
- Keep original PXL_*.mp4 filenames

#### `src/remotion/KechWaffles/premium/tiramisu-assets.ts` (NEW)
- `TIRAMISU_PHOTOS[]` — list of all new photo filenames prefixed with `new-photos/`
- `TIRAMISU_VIDEOS[]` — new video clip filenames
- Product configs: `TIRAMISU_PRODUCT`, `PANCAKES_TIRAMISU_PRODUCT`
- `DEFAULT_TIRAMISU_TIKTOK_PROPS` — default props for TiramisuTikTok composition
- `DEFAULT_TIRAMISU_INSTAGRAM_PROPS` — default props for TiramisuInstagram composition

#### `src/remotion/KechWaffles/premium/TiramisuTikTok.tsx` (NEW FILE)
- Format: 1080x1920 @ 30fps, 660 frames (22s)
- `PhotoKenBurns` subcomponent: uses `<Img>` + objectFit: cover (no video dependency)
- `CacaoDust` subcomponent: 12 floating brown particles for atmosphere
- `TiramisuPrice` subcomponent: terracotta pill badge
- `ImpactText` inline: copied from TikTokPromo pattern
- Timeline: Hook (0-60) → Photo1 (60-240) → Flash → Photo2 (240-420) → Flash → Offer (420-510) → CTA (510-660)
- Schema: `tiramisuTikTokSchema` (photos, productImage, hookText, productName, price, audioClip)
- Exports: `TiramisuTikTok`, `tiramisuTikTokSchema`, `TIRAMISU_TIKTOK_DURATION`

#### `src/remotion/KechWaffles/premium/TiramisuInstagram.tsx` (NEW FILE)
- Format: 1080x1080 @ 30fps, 150 frames (5s)
- Split layout: photo top-60% + info panel bottom-40%
- Ken Burns slow zoom on photo
- Logo badge top-left
- Product name slam → price bounce → description fade → footer typewriter
- `CacaoDust` reused (8 particles, subtle)
- Schema: `tiramisuInstagramSchema` (photo, productName, price, description, slogan)
- Exports: `TiramisuInstagram`, `tiramisuInstagramSchema`, `TIRAMISU_INSTAGRAM_DURATION`

#### `src/remotion/KechWaffles/premium/index.ts` (MODIFY)
- Append exports for `TiramisuTikTok`, `tiramisuTikTokSchema`, `TIRAMISU_TIKTOK_DURATION`
- Append exports for `TiramisuInstagram`, `tiramisuInstagramSchema`, `TIRAMISU_INSTAGRAM_DURATION`

#### `src/remotion/Root.tsx` (MODIFY)
- Add imports for new compositions and tiramisu-assets
- Inside `<Folder name="Kech-Waffles-Premium">`, after TikTokPromo `<Composition>`:
  - Register `TiramisuTikTok` (1080x1920, 660 frames, schema + defaultProps)
  - Register `TiramisuInstagram` (1080x1080, 150 frames, schema + defaultProps)

---

### Acceptance Criteria Mapping
- [ ] AC1: 23 new photos + 6 videos accessible in Remotion studio → Task #1
- [ ] AC2: TiramisuTikTok renders at 1080x1920, 22s, viral hooks + new photos → Task #3
- [ ] AC3: TiramisuInstagram renders at 1080x1080, 5s, premium layout → Task #4
- [ ] AC4: Both compositions appear in Remotion Studio under Kech-Waffles-Premium → Task #6
- [ ] AC5: objectFit: cover handles image cropping for all aspect ratios → Task #3/#4

### Key Decisions
- Images cropped via CSS objectFit: cover in Remotion (no preprocessing script needed)
- TikTok, Instagram Reels, and Snapchat all use same 1080x1920 TiramisuTikTok composition
- New tiramisu color accent: coffee brown tones added as CSS constants (no DesignSystem change)
- CacaoDust particles defined inline (not added to DesignSystem to keep scope tight)

### Task Dependencies
1 → 2 → 3, 4 → 5 → 6

### Risks & Considerations
- New photos are large (2.5-5.5MB RAW) — Remotion handles this natively
- Video clips (15-105MB) — large but Remotion's OffthreadVideo handles this
- Photos are timestamped filenames — arrays in tiramisu-assets.ts will list them explicitly
