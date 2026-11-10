# Référencement : ta liste à toi

Mis à jour le 10 novembre 2026. Tout ce qui pouvait se faire sans tes comptes est fait. Ce qui reste demande **ta connexion** (Google, Bing, Apple, TripAdvisor) : environ 1h30 en tout, dans l’ordre ci-dessous.

## Pourquoi tu n’es pas en première page

Sur « café marrakech », Google affiche d’abord **la carte Google Maps**, puis des guides (TripAdvisor, Culture Trip, Barista Magazine…). Un site seul ne passe pas devant eux. On gagne par la **fiche Google et ses avis**, par les **citations ailleurs** (guides, annuaires, presse) et par les **recherches précises** (« croffle marrakech », « café girls only marrakech », « café ouvert tard marrakech »), où un petit site peut être premier.

Deux constats du 10 novembre : **Google Search Console n’a jamais été activée** pour le site, et **ta fiche Google Maps s’appelle « kech Waffles »**, avec un k minuscule.

## Déjà fait

- Site en production (commit `7c38c33`) : carte du menu lisible par Google et les IA, titres réécrits, FAQ sur `/location`, page anglaise `/en`, données structurées, `/llms.txt`, photos dans le sitemap.
- `kechwaffles.com` redirige maintenant vers `www` en permanent (308).
- Bing et les moteurs IndexNow ont reçu les 10 adresses du site. Bing alimente ChatGPT.
- Cartes « laisse un avis » prêtes à imprimer : `carte-avis-google.pdf` (page 1 : 4 cartes de table à découper, page 2 : affiche A4 du comptoir). Le QR code ouvre directement le formulaire d’avis de ta fiche.
- Un brouillon à Barista Magazine t’attend dans Gmail (rien n’est envoyé).

## À faire, dans l’ordre

### 1. Google Search Console (10 min)

1. Va sur <https://search.google.com/search-console>, « Ajouter une propriété », choisis **Domaine** et tape `kechwaffles.com`.
2. Google détecte Cloudflare : clique sur « Démarrer la vérification », connecte-toi à Cloudflare, accepte. C’est vérifié.
3. Menu « Sitemaps » : ajoute `https://www.kechwaffles.com/sitemap.xml`.
4. En haut, « Inspecter une URL » : colle tour à tour `https://www.kechwaffles.com/`, `/menu`, `/location`, `/en` et clique « Demander l’indexation » pour chacune.

### 2. Fiche Google Business Profile (20 min)

Sur <https://business.google.com> :

- **Nom** : corrige en « Kech Waffles » (K majuscule). Rien d’autre dans le nom : ajouter « café Marrakech » est interdit et fait suspendre les fiches.
- **Catégorie principale** : « Café ». Ajoute en secondaires ce que Google propose autour de coffee shop, pâtisserie, desserts.
- **Site web** : `https://www.kechwaffles.com/?utm_source=google&utm_medium=organic&utm_campaign=fiche`
- **Menu** : `https://www.kechwaffles.com/menu`
- **Commande en ligne** : ton lien Glovo.
- **Horaires** : lundi fermé ; mardi, mercredi, jeudi, samedi 11h à 2h ; vendredi 18h30 à 2h ; dimanche 18h à 2h.
- **Attributs** : coche seulement ce qui est vrai (Wi-Fi, places assises, à emporter, livraison…).
- **Description** (à coller, 641 caractères sur 750) :

> Kech Waffles est un café de spécialité à Marrakech, au MAG 33 d’Al Badii, à 15 minutes du Jardin Majorelle. Au comptoir : espresso, cortado, flat white, cappuccino, cold brew et boissons glacées signatures (Ice White Mocha, Ice Latte Caramel, Ice Matcha Latte). Notre produit phare : la croffle, un croissant passé au fer à gaufre, cuit à la minute, nature ou garni. Pâtisseries maison du jour. Tous les mardis et jeudis, le café est entièrement réservé aux filles (Girls Only). Le Café IA accueille ceux qui travaillent et codent, avec un service informatique pour les étudiants. Ouvert du mardi au dimanche jusqu’à 2h. Livraison sur Glovo.

- **Photos** : ajoute-en 3 à 5 vraies chaque semaine (façade, comptoir, croffles, latte, salle).
- **Posts** : un par semaine. Quatre prêts à publier :
  1. « Mardi, c’est Girls Only : tout le café est à vous, de 11h à 2h, équipe 100 % féminine. Pas de réservation, poussez la porte. »
  2. « La croffle : un croissant passé au fer à gaufre, feuilleté dedans, croustillant dehors. Caramel spéculoos, chocolat fraise, trois chocolats… cuite à la minute. »
  3. « Un code qui bloque, un CV à refaire, un projet d’études qui coince ? Le Café IA et son service informatique vous attendent, café en main. »
  4. « Ouvert jusqu’à 2h du mardi au dimanche. Un flat white à minuit, c’est possible à Al Badii. »

### 3. Les avis (5 min, puis tous les jours)

- Imprime `carte-avis-google.pdf` : les 4 cartes sur les tables, l’affiche au comptoir.
- Au moment de payer, une phrase suffit : « Si vous avez aimé, un avis Google nous aide beaucoup. »
- **Ne jamais récompenser un avis** (croffle offerte, points de fidélité) : Google l’interdit et supprime les avis concernés.
- Réponds à chaque avis dans les 48h, en reprenant ce que la personne a pris. Modèles :
  - Positif : « Merci [prénom] ! Ravis que la croffle caramel spéculoos vous ait plu. À très vite au comptoir, Kech Waffles »
  - Négatif : « Merci pour votre retour, [prénom]. Ce n’est pas l’expérience qu’on veut offrir. Écrivez-nous sur WhatsApp au +212 7 09 38 84 31 qu’on en parle. Kech Waffles »
  - In English : « Thank you [name]! So glad you enjoyed the coffee. See you soon at the counter, Kech Waffles »

### 4. Bing Places (5 min)

Sur <https://www.bingplaces.com>, connecte-toi et choisis **importer depuis Google Business Profile**. La fiche Bing est copiée d’un coup. C’est elle que ChatGPT lit quand on lui demande un café à Marrakech.

### 5. Bing Webmaster Tools (5 min)

Sur <https://www.bing.com/webmasters>, choisis **importer depuis Google Search Console** (après l’étape 1). Le sitemap suit tout seul.

### 6. Apple Business Connect (15 min)

Sur <https://businessconnect.apple.com> : revendique ou crée la fiche « Kech Waffles », même adresse, même téléphone, mêmes horaires. Tous les touristes sur iPhone passent par Apple Plans.

### 7. TripAdvisor (15 min)

Sur <https://www.tripadvisor.fr/Owners>, « Ajouter un établissement », type restaurant ou café. Description en anglais (les touristes lisent en anglais) :

> Specialty coffee shop in Marrakech (MAG 33, Al Badii), 15 minutes from the Jardin Majorelle. Espresso, flat white, cold brew and iced signatures, croffles made to order and homemade pastries. Girls Only on Tuesdays and Thursdays. Open Tuesday to Sunday until 2am.

Ajoute le lien `https://www.kechwaffles.com/en`.

### 8. Presse et guides (10 min)

- **Barista Magazine** : relis le brouillon dans Gmail (« PITCH: Specialty coffee until 2am in Marrakech… ») et envoie-le.
- **Presse marocaine** (Le360, TelQuel, Médias24, Hespress FR, L’ODJ) : leurs adresses ne sont pas publiques, passe par leur formulaire de contact avec ce texte :

> Bonjour, Kech Waffles est un café de spécialité à Al Badii, Marrakech, ouvert jusqu’à 2h. Deux initiatives pourraient intéresser vos lecteurs : le mardi et le jeudi, tout le café est réservé aux filles, équipe comprise ; et notre Café IA aide les étudiants en informatique (code, projets d’études, CV), avec des soirées à thème sur le code. Nous serions ravis de vous accueillir. Site : https://www.kechwaffles.com · Instagram : @kech_waffles · +212 7 09 38 84 31

- **Écoles et universités de Marrakech** : envoie le même message aux associations étudiantes et aux BDE (Instagram ou e-mail), en mettant le Café IA en avant. Un lien depuis leur page « bons plans » compte beaucoup.

## Les mots-clés, par ordre de difficulté

| Facile (quelques semaines) | Moyen (quelques mois) | Difficile (avis et carte Google) |
|---|---|---|
| kech waffles | café de spécialité marrakech | café marrakech |
| croffle marrakech | coffee shop marrakech | best coffee marrakech |
| café girls only marrakech | café pour travailler marrakech | |
| café ouvert tard marrakech | specialty coffee marrakech | |
| café al badii | corner gaufres mariage marrakech | |

## Chaque mois (10 min)

- Search Console, « Performances » : les requêtes qui contiennent « café », leurs impressions et leur position.
- Fiche Google, « Performances » : appels, itinéraires, clics vers le site.
- Nombre d’avis : objectif 100, puis un flux régulier.
- Demande à ChatGPT et Perplexity « où manger une croffle à Marrakech » et « café pour travailler à Marrakech » : ton café doit finir par sortir.

## Pendant la fermeture temporaire (depuis le 10 novembre 2026)

Le site l’annonce partout : bandeau en bas de chaque page, « Fermé temporairement » à la place de « Ouvert », question en tête de la FAQ, `llms.txt` et page anglaise. Tout dépend de `TEMPORARY_CLOSURE` dans `lib/site-content.ts`.

**Le jour où la date de réouverture est connue :**

1. Annonce-la sur Instagram et dans un post de la fiche Google.
2. Dis-le à Claude : il mettra la date dans le bandeau. Le jour J, il remet `TEMPORARY_CLOSURE` à `null`.
3. Le jour J, sur la fiche Google, onglet « Horaires » : repasse en « Ouvert avec horaires principaux ».
4. Imprime les cartes d’avis, envoie le brouillon Barista Magazine et les messages à la presse : c’est le bon moment, « réouverture » est un angle en soi.
