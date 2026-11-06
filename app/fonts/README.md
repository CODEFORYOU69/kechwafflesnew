# Polices auto-hébergées

Deux polices sont instanciées et réduites pour peser moins lourd au premier affichage (`fontTools`, sous-ensemble latin : Latin-1, œ, ponctuation française, flèches, euro).

| Fichier | Source | Axes conservés | Poids |
|---|---|---|---|
| `bricolage-grotesque-opsz40.woff2` | Bricolage Grotesque (Google Fonts, licence OFL 1.1) | `opsz` figé à 40, `wght` 600–800, `wdth` 75–90 | 52 Ko au lieu de 128 Ko |
| `jetbrains-mono-400-500.woff2` | JetBrains Mono (Google Fonts, licence OFL 1.1) | `wght` 400–500, sans les ligatures de code | 12,5 Ko au lieu de 40 Ko |

Instrument Sans et Instrument Serif restent servies par `next/font/google`. Un graphisme hors de ces plages (un poids de 400 en display par exemple) ne sera pas rendu : régénérer l'instance dans ce cas.
