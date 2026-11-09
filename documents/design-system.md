# Design system Kech Waffles : « La Porte »

L'arche du logo est une porte qu'on franchit au défilement. Le kufique carré de l'emblème fait le pont entre l'artisanal (zellige, arche) et la tech (circuit imprimé, grille de pixels) : modules, lignes et angles droits en dérivent, les images se cadrent en arche.

Référence d'exécution : `components/sections/HeroParallax.tsx` fixe le niveau attendu.

## Récit chromatique au défilement

| Section | Fond | Texte | Accent |
|---|---|---|---|
| Hero | `espresso-950` + lueur | `cream-50` | `gold-400` |
| Café | `espresso-900` | `cream-50`, `cream-200` | `gold-400` |
| Carte | `cream-100` (éditorial suisse, section claire) | `espresso-950`, `espresso-700` | `terracotta-700` |
| Girls Only | `terracotta-700` plein cadre (la couleur du vrai mur intérieur) | `cream-50` | `gold-200` |
| Café IA | `espresso-950` | `cream-50`, `cream-300` | `zellige-400`, mono |
| Prestations | `espresso-800` | `cream-50` | `gold-400` |
| Visite | `cream-50` | `espresso-950` | `terracotta-700` |
| Footer | `espresso-950` | `cream-50` | `gold-400` |

Chaque section monte sur la précédente avec un grand arrondi supérieur en arche : `.section-rise` (avec `.section-pad` pour le rythme, qui réserve `--arch` en pied pour la section suivante).

## Couleurs

Toutes les variables sont des triplets HSL : `hsl(var(--gold-400))`, `hsl(var(--gold-400) / 0.4)`. En Tailwind : `bg-espresso-900`, `text-gold-400`, `border-cream-50/20`.

| Famille | Nuances |
|---|---|
| `espresso` | 950 `#0F0B08`, 900 `#17110C`, 800 `#211810`, 700 `#2E2217`, 600 `#3D2E20` |
| `terracotta` | 700 `#8F3F24`, 600 `#B0512F`, 500 `#C4623A`, 400 `#D97B52`, 300 `#E89B78` |
| `gold` | 700 `#9A683A`, 500 `#C7954F`, 400 `#DFB264`, 300 `#F0D288`, 200 `#F9E095` |
| `cream` | 50 `#FBF6EC`, 100 `#F4ECDC`, 200 `#E9DCC5`, 300 `#CDBDA3`, 400 `#A89880` |
| `zellige` | 600 `#2F6F73`, 400 `#5FB3AE` (réservé au Café IA) |

### Contrastes calculés, à respecter

- Sur `espresso-950` : `cream-50` 18,19 · `cream-200` 14,47 · `cream-300` 10,64 · `cream-400` 6,97 · `gold-400` 9,97 · `gold-500` 7,32 · `terracotta-400` 6,44 · `zellige-400` 7,97.
- Sur `cream-50` : `espresso-950` 18,19 · `espresso-700` 14,36 · `terracotta-700` 6,71 · `terracotta-600` 4,8 · **`gold-700` 4,42 : interdit en petit texte**.
- Sur `cream-100` : `espresso-600` 11,1.
- Sur `terracotta-700` : `cream-50` 6,71 · `gold-200` 5,55 · `cream-200` 5,34.
- Sur `terracotta-600` : `cream-50` 4,8 · **`cream-100` 4,4 : interdit en petit texte**.
- Texte `espresso-950` : sur `terracotta-500` 4,81 · sur `gold-400` 9,97.

## Typographie

| Rôle | Police | Classe |
|---|---|---|
| Display | Bricolage Grotesque, instance `opsz` 40, `wght` 600–800, `wdth` 75–90 (`app/fonts/`) | `.text-mega`, `.text-hero`, `.text-section`, `.text-headline`, `.font-display` |
| Corps | Instrument Sans (400 à 700, pas de 300) | par défaut, `.text-subhead` |
| Labels, index, données | JetBrains Mono | `.text-eyebrow`, `font-mono` |
| Accent éditorial | Instrument Serif italique | `.serif-italic` |

L'axe optique est figé dans le fichier : la chasse en em ne change pas avec la taille, une ligne se cale donc sur sa colonne avec un simple rapport (`calc(100cqw / 6.09)`). Sous 600 de graisse ou au-delà de 90 % de largeur, la police ne suit plus.

Labels numérotés en mono : « 01 — Café de spécialité ». Très grande typo, hairlines (`.hairline`), grille de 12 colonnes (`grid-cols-12`) dans `.page-x`, composition asymétrique. Sources en français avec l'apostrophe typographique `’`.

## Mouvement

Un seul petit runtime client (`MotionRuntime`, monté dans le layout) : `Reveal`, `RevealLines`, `ParallaxLayer` et `MagneticButton` restent du balisage simple, utilisable depuis un Server Component.

- `Reveal` et `RevealLines` (`components/motion/Reveal.tsx`) : apparition au défilement, `delay` en secondes.
- `ParallaxLayer` (`components/motion/ParallaxLayer.tsx`) : à poser dans un cadre `.parallax-frame` positionné et dimensionné, ou `.frame-arch` + `.parallax-frame`. CSS scroll-driven, repli JS sur souris seulement. Plusieurs couches possibles, force négative permise.
- `MagneticButton` (`components/motion/MagneticButton.tsx`) enveloppe un CTA : `<MagneticButton><a className="cta"><span className="cta__label">…</span><ArrowUpRight className="cta__arrow size-4" /></a></MagneticButton>`.
- Ancres : `<a href="#id">` et `/#id` défilent via Lenis, aucun code à écrire. `data-no-transition` exclut un lien du rideau.
- `IntroLines` et `IntroFade` (`components/motion/Reveal.tsx`) : mêmes effets en CSS pur, sans attendre le script. **À utiliser sur le premier écran d'une page** : un `Reveal` à cet endroit retarde le LCP jusqu'à l'hydratation.
- Îlots Framer : `LazyMotion` local avec `features={domMin}` et `m.*`, jamais `motion.*`, comme dans `HeroParallax.tsx`. Uniquement là où le CSS ne suffit pas. Pas de `features` asynchrones sur une scène liée au scroll : quand elles arrivent, les valeurs reviennent à leur rendu initial sans repeindre, et une page chargée déjà défilée reste figée.
- Lenis n'est monté que sur souris et trackpad : au tactile, ses écouteurs ne sont pas passifs et son horloge ne dort jamais.
- Un `[data-pause-offscreen]` met en pause les animations infinies quand il sort de l'écran.

### Règles qui ne se négocient pas

- Sections en Server Components, un îlot client par interaction, petit et dans son propre fichier.
- Animer seulement `transform` et `opacity`. Seule exception : le tracé du circuit du Café IA (`stroke-dashoffset`), borné à sa plage de défilement. Pas de `backdrop-filter` sur `pointer: coarse` (variante `fine:`), pas de `mix-blend-mode`.
- Aucun `overflow-hidden` sur un ancêtre d'une `.parallax-layer` : utiliser `overflow-clip` (`hidden` crée un conteneur de défilement et fige `view()`).
- Une animation CSS en `forwards` ou `both` l'emporte sur un `transform` inline de Framer : les poser sur deux éléments distincts.
- Pas d'autoprefixer : écrire les préfixes `-webkit-` à la main (`-webkit-mask-image`).
- `prefers-reduced-motion` : tout reste lisible et utilisable, sans scène épinglée. Tester avec l'émulation.
- Le tactile garde le défilement natif : aucune scène qui déplace le contenu relativement au scroll sur mobile, utiliser `scroll-snap`.
- Une view timeline destinée à des éléments internes d'un SVG se déclare sur un conteneur HTML (`view-timeline`) : `view()` posé sur un `<path>` mesure un point de hauteur nulle.
- Le CSS global vit dans `app/globals.css`. Le CSS propre à une section va dans un `*.module.css` à côté du composant.

## La porte du hero

- La façade se tient dans une arche bordée d'un contour doré (`components/brand/DoorFrame.tsx`, géométrie dans `door-frame-geometry.ts`) : la calligraphie du bas de l'emblème, rangées 11 à 21 de sa grille de 15 modules, reprise telle quelle et répétée en frise entre deux filets d'or. Ne jamais redessiner ni inventer une lettre : c'est le logo.
- Profondeur `--frame-t` : quinze modules (filet, vide, onze rangées, vide, filet). Desktop : le contour se tient hors de la photo, la porte lui laisse sa place sous la barre. Mobile : il se pose sur le bord de la photo, l'arche garde toute la largeur et l'enseigne reste entière.
- Au défilement, l'or naît à la clé quand les arcs du logo passent la caméra, descend les montants, puis une lumière le traverse une fois. Seules bougent l'opacité des couches et la position de la lumière. Mouvement réduit : contour entier, sans lumière.

## Images

- Vraies photos en priorité, dérivés optimisés dans `public/images/site/`. Pour ce qui n'a pas encore de photo, images IA très réalistes, à la demande de l'équipe : fichiers préfixés `ai-`, générés à partir de vraies photos du café (assiette, comptoir), à remplacer dès qu'une vraie photo existe. Jamais de render.
- `next/image` avec un vrai `sizes`. Pas de `priority` sous la ligne de flottaison.
- `croffle-fraise.jpg` montre un câble en haut : cadrer en bas (`object-position`).

## Contenu

Les textes de l'accueil et les faits (contact, horaires) vivent dans `lib/site-content.ts`. Les pages secondaires gardent leurs textes en constantes en bas de fichier, à lire avant d'écrire : elles importent les faits, jamais de numéro ni d'horaire en dur. Les entrées marquées `À VALIDER` sont des propositions éditoriales à confirmer par l'équipe. Ne jamais inventer un fait : prix, tarifs, Wi-Fi, prises, horaires du service info, origines réelles en stock.

Les horaires et la date du jour se calculent après montage, en fuseau `Africa/Casablanca` (`lib/casablanca-time.ts`), pour éviter tout écart d'hydratation.

Les gaufres traditionnelles n'apparaissent que dans Prestations. Écrire « croffles » au pluriel, pour éviter de trancher le genre.
