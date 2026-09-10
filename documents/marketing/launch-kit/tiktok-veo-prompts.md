# TikTok — Prompts Veo 3.1 pour la Vidéo 1 (cheese pull kunefe)

Génère le scénario `tiktok.md` § « Vidéo 1 » avec Veo 3.1 (Gemini app → mode Vidéo, ou labs.google/flow).

---

## Avant de lancer : les 4 réglages qui comptent

| Réglage | Valeur | Pourquoi |
|---|---|---|
| **Format** | `9:16` | Veo 3.1 génère nativement en vertical — ne jamais générer en 16:9 pour recadrer ensuite |
| **Durée** | `8 s` | C'est le maximum par clip, et 8 s est **obligatoire** pour débloquer le 1080p/4K et les images de référence |
| **Résolution** | `1080p` ou `4K` | Disponible uniquement sur les clips de 8 s |
| **Ingredients to video** | **tes vraies photos de kunefe** (jusqu'à 3) | ⚠️ Le point le plus important — voir ci-dessous |

### Le réglage qui change tout : « Ingredients to video »

Veo 3.1 accepte jusqu'à **3 images de référence** et conserve l'apparence du sujet. Charge tes propres photos de kunefe (le cuivre, la couleur exacte de ta pâte, ton assiette) et Veo animera **ton** produit au lieu d'inventer un kunefe générique. Sans ça, tu publies la photo d'un dessert que tu ne sers pas — et ton README dit « pas de faux avis, pas de chiffres inventés ». Même logique ici.

**Une vidéo de 28 s = 4 clips de 8 s** à assembler dans CapCut. Les 4 prompts ci-dessous sont dans l'ordre.

---

## CLIP 1 — Le hook et la croûte qui casse (0-8 s)

```
Vertical 9:16 macro food cinematography. A whole round kunefe — shredded kadayif
pastry baked to deep amber gold, glistening with sugar syrup — rests in a small
copper pan on a dark stone counter. A metal spoon enters from the right, hovers,
then presses down and breaks through the crisp crust; golden shards fracture
outward and molten white cheese wells up from beneath. Shallow depth of field,
warm tungsten key light from the left falling off into darkness, faint steam.
Camera pushes in slowly on a gimbal, then holds. Rich contrast, amber and deep
brown palette. Photoreal, no people visible except one hand, no on-screen text.

Audio: amplified crisp crackling as the crust breaks, faint kitchen room tone,
no music.
```

## CLIP 2 — Le cheese pull (8-16 s) — **le plan qui fait la vidéo**

```
Vertical 9:16 macro food cinematography, single unbroken take. A hand lifts a
spoonful of kunefe straight up from a copper pan; a thick continuous strand of
molten white cheese stretches upward between the spoon and the pan, thinning
slowly without ever breaking, glistening under warm light. The camera tilts up
smoothly to follow the pull, keeping the strand centered. Slow motion, shallow
depth of field, dark background, warm amber key light, subtle steam rising.
Photoreal food photography, no cuts, no on-screen text.

Audio: near silence — only a faint stretching sound and low room tone. No music.
```

## CLIP 3 — Pistache et sirop (16-24 s)

```
Vertical 9:16 macro food cinematography. A hand sprinkles finely ground bright
green pistachio over a hot kunefe in a copper pan, the powder catching the light
as it falls. Then a thin stream of golden sugar syrup pours slowly from a small
jug, pooling into the crevices of the pastry and running down the sides. Shallow
depth of field, warm tungsten light, dark stone counter, gentle steam. Camera
slowly orbits 20 degrees to the right. Photoreal, saturated green against deep
amber, no on-screen text.

Audio: soft pouring sound, faint sizzle, quiet room tone.
```

## CLIP 4 — Le plan de repos (24-32 s)

```
Vertical 9:16 food cinematography, wider shot. The finished kunefe sits in its
copper pan on a warm wooden café table at night, pistachio and syrup catching
the light, two small glasses of Moroccan mint tea slightly out of focus beside
it. Warm bokeh of café lights in the deep background. The camera pulls back
slowly and settles. Cozy late-night atmosphere, photoreal, no people, no
on-screen text.

Audio: quiet café ambience, distant murmur, faint clink of a glass.
```

---

## Le negative prompt (à coller dans le champ dédié)

```
on-screen text, subtitles, watermark, logo, distorted hands, extra fingers,
plastic-looking food, cartoon, CGI render, oversaturated colors, fast camera
shake, zoom transitions
```

---

## Ce que Veo ne fera PAS bien — à faire toi-même

**Le texte incrusté.** Veo déforme systématiquement les caractères, et l'arabe encore plus. Génère les clips sans aucun texte, ajoute le hook dans CapCut avec la font du kit (Poppins Bold), dans les zones sûres du 9:16 : hors des 12 % du haut, 22 % du bas et de la bande droite.

**La voix off en darija.** Ne la demande pas à Veo — le résultat sera méconnaissable. Enregistre-la au téléphone en voice memo, colle-la sur le montage, puis **active les sous-titres automatiques TikTok** : c'est ta transcription qui rend la darija indexable, comme dit dans `tiktok.md`.

**Ta devanture et ton équipe.** Le clip 4 te donne une ambiance générique, pas ton local d'Al Badii. Si tu as 30 secondes pour filmer la devanture au téléphone le soir, remplace-le — c'est le plan qui transforme une jolie vidéo en adresse identifiable.

---

## Le montage (CapCut, ~15 min)

1. Les 4 clips bout à bout dans l'ordre → ~32 s, coupe à 28 s en raccourcissant le clip 4.
2. Hook incrusté sur les 3 premières secondes : `هادي هي اللقطة اللي جات على قبلها الكاميرا.`
3. Voix off par-dessus les clips 1, 3 et 4 — **rien sur le clip 2** : le silence pendant le cheese pull, c'est ce qui retient le doigt.
4. Son réel amplifié, pas de musique (l'ASMR food surperforme — cf. § « Conseils son »).
5. Sous-titres auto activés, lieu « Kech Waffles » tagué.
6. Légende : `الكنافة ديالنا. حكم بنفسك 🧀 kunefe à Marrakech 📍 Al Badii`
7. Hashtags : `#kunefe #cheesepull #marrakech #foodtiktokmaroc #knafeh`

**Si un clip sort raté**, ne relance pas tout : Veo 3.1 permet d'étendre un clip existant de 7 s (jusqu'à 20 fois, en 720p) plutôt que de régénérer depuis zéro.
