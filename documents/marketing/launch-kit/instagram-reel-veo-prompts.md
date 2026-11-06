# Instagram — Prompts Veo 3.1 pour le Reel de relance (30 s)

Génère le scénario `instagram.md` § 2 « Le Reel de relance » avec Veo 3.1.
Mêmes réglages que `tiktok-veo-prompts.md` : **9:16 · 8 s · 1080p · Ingredients to video**.

---

## ⚠️ À lire avant de générer : deux plans du scénario posent problème

Le Reel prévoit **La Tiramisu** (3-8 s) et **La Dubai** (8-14 s). Or ton README le dit noir sur blanc : *« pas encore de photos de ces recettes »*. Sans photo de référence, Veo va **inventer** ces deux gaufres — tu montrerais un produit qui ne ressemble pas à ce que le client reçoit. C'est exactement le genre d'écart que ton kit s'interdit sur les avis et les chiffres.

**Deux sorties possibles :**

- **A. Tu photographies La Tiramisu et La Dubai** (10 min, lumière de jour, fond sombre), tu les charges en référence, et tu gardes le scénario tel quel. C'est la bonne option.
- **B. Tu remplaces ces deux beats** par des produits dont tu as déjà les photos — liégeoise, croffle, La Boisée. Les prompts 2bis et 3bis en bas du fichier sont écrits pour ça.

Les prompts 2 et 3 ci-dessous supposent l'option A (avec tes photos en référence).

---

## Le découpage : 5 clips de 8 s → 30 s au montage

Génère chaque clip en **8 s** (obligatoire pour le 1080p et les images de référence), puis **coupe à 5-6 s dans CapCut**. Tu génères large, tu montes serré — c'est ce qui donne le rythme rapide que demande le scénario.

| Clip | Beat du kit | Durée finale |
|---|---|---|
| 1 | Porte / lumière du matin sur le comptoir | 0-5 s |
| 2 | La Tiramisu nappée en direct | 5-11 s |
| 3 | La Dubai coupée au couteau | 11-17 s |
| 4 | Kunefe, cheese pull | 17-23 s |
| 5 | Espresso + latte art | 23-30 s |

**Le clip 4 existe déjà** : reprends CLIP 2 de `tiktok-veo-prompts.md`, ne le régénère pas.

---

## CLIP 1 — L'ouverture (0-5 s)

```
Vertical 9:16 cinematic interior shot. A café door swings open and warm morning
sunlight floods across a clean waffle counter — a cast-iron waffle iron, glass
jars of toppings, a stack of plates — dust motes drifting in the light beam.
The camera glides forward through the doorway on a smooth gimbal move and
settles on the counter. Warm golden hour light from the left, soft shadows,
shallow depth of field. Photoreal, calm and inviting, no people, no on-screen
text.

Audio: a door handle turning, quiet morning room tone, distant street sound,
no music.
```

## CLIP 2 — La Tiramisu nappée (5-11 s)

> Charge ta photo de **La Tiramisu** en référence.

```
Vertical 9:16 macro food cinematography. A golden Liège waffle rests on a dark
ceramic plate. A stream of glossy mascarpone-tiramisu cream pours slowly from
above, spreading and settling across the waffle's ridges, followed by a light
dusting of cocoa powder falling through the light. Shallow depth of field,
warm side lighting against a dark background, gentle steam. The camera holds
still, then pushes in 10cm. Photoreal, cream and deep brown palette, one hand
visible, no on-screen text.

Audio: the soft sound of pouring cream, faint room tone, no music.
```

## CLIP 3 — La Dubai coupée au couteau (11-17 s)

> Charge ta photo de **La Dubai** en référence.

```
Vertical 9:16 macro food cinematography. A knife cuts cleanly through a waffle
topped with pistachio cream and crisp golden kadayif strands; the crust
shatters audibly and the blade lifts away revealing the layers inside. Slow
motion, extreme close-up, shallow depth of field, warm tungsten key light,
dark stone surface. The camera tracks the knife downward then holds on the cut
section. Photoreal, bright green pistachio against deep gold, no on-screen text.

Audio: amplified crunch of the kadayif under the blade, no music.
```

## CLIP 4 — Le cheese pull

**Ne pas régénérer.** Reprends CLIP 2 de `tiktok-veo-prompts.md` et coupe-le à 6 s.

## CLIP 5 — Le café (23-30 s)

```
Vertical 9:16 cinematic close-up. An espresso machine portafilter releases a
thick dark stream of espresso into a white cup, crema forming on top. Cut to a
hand pouring steamed milk in a slow circular motion, forming a clean rosetta
latte art pattern. Warm café lighting, brushed steel and white ceramic, soft
bokeh of the counter in the background. The camera stays close and steady,
then pulls back slightly. Photoreal, no on-screen text.

Audio: the hiss of the steam wand, espresso pouring, quiet café ambience.
```

---

## Le negative prompt (identique au fichier TikTok)

```
on-screen text, subtitles, watermark, logo, distorted hands, extra fingers,
plastic-looking food, cartoon, CGI render, oversaturated colors, fast camera
shake, zoom transitions
```

---

## Ce que tu fais toi-même

**Le plan 6 (25-30 s) : la devanture.** Le scénario demande ta devanture avec « MAG 33 Al Badii · jusqu'à 2h tous les soirs ». Veo ne peut pas inventer ton local — filme-le au téléphone un soir, 15 secondes suffisent. C'est le plan qui transforme un joli Reel en adresse qu'on retrouve.

**La voix off FR.** Les 6 phrases du kit, enregistrées en voice memo. Elle passe par-dessus tous les clips. Le scénario le dit : *« la voix est indexée, le son fait la portée »* — donc voix off en clair + son tendance calme en fond, pas l'inverse.

**Le texte incrusté final.** Dans CapCut, en Poppins Bold, jamais généré par Veo.

---

## Le montage

1. Les 5 clips dans l'ordre, chacun coupé à 5-6 s → 30 s pile.
2. Voix off par-dessus, sauf pendant le cheese pull (clip 4) : laisse le son réel.
3. Son tendance calme en fond (lo-fi / oriental chill), volume bas sous la voix.
4. Légende :
   ```
   Tout ce qu'il faut savoir sur Kech Waffles, en 30 secondes 🧇

   📍 MAG 33 Al Badii, Marrakech · jusqu'à 2h tous les soirs · Glovo : https://glovoapp.com/en/ma/marrakech/stores/kech-waffles-mar
   ```
5. Hashtags : `#kechwaffles #marrakech #marrakechfood #reelfood #gaufres`
6. Lieu « Kech Waffles » tagué, couverture choisie sur le cheese pull.

---

## Option B — si tu ne photographies pas La Tiramisu et La Dubai

### CLIP 2bis — La liégeoise (remplace La Tiramisu)

```
Vertical 9:16 macro food cinematography. A Liège waffle sits in a cast-iron
waffle iron; the lid lifts and steam escapes, revealing a deep golden waffle
with caramelized pearl sugar crackling and glistening on its surface. Gloved
tongs lift it out and set it on a dark plate. Shallow depth of field, warm
tungsten light, dark kitchen background. The camera follows the waffle upward.
Photoreal, amber and caramel palette, no on-screen text.

Audio: the sizzle of caramelizing sugar, the metallic click of the iron
opening, no music.
```

### CLIP 3bis — La Boisée, le salé (remplace La Dubai)

```
Vertical 9:16 macro food cinematography. A savory waffle on a dark slate plate
is topped with sautéed mushrooms, melted cheese and fresh herbs; a hand cracks
black pepper over it from a mill. A fork lifts one corner, cheese stretching
slightly. Shallow depth of field, warm side light, earthy green and brown
palette against dark stone. The camera orbits slowly 20 degrees. Photoreal,
no on-screen text.

Audio: pepper mill grinding, faint sizzle, quiet kitchen room tone.
```
