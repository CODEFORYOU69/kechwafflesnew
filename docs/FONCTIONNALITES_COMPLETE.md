# 📋 Liste Complète des Fonctionnalités - Kech Waffles

## 🎯 Vue d'Ensemble du Projet

**Kech Waffles** est une application Next.js 15 complète intégrant :
- 🍽️ Site vitrine avec menu digital
- 💳 Système de fidélité avec cartes digitales
- 🏆 3 concours CAN 2025 interconnectés
- 👨‍💼 Administration complète
- 🔌 Intégration Loyverse (caisse)

**État Global** : 75% complété - Production-ready avec quelques ajouts nécessaires

---

## A. ✅ FONCTIONNALITÉS COMPLÈTES (Opérationnelles)

### 🌐 1. SITE VITRINE PUBLIC

#### Pages
- ✅ **Homepage** (`/`)
  - Hero avec animations Framer Motion
  - Sections menu (aperçu catégories)
  - Sparkles effects
  - Footer avec infos contact

- ✅ **Menu Complet** (`/menu`)
  - 159 produits réels avec images
  - 9 catégories (Gaufres sucrées/salées, Crêpes, Pancakes, Crauffles, Smoothies, Cafés, Jus, Autres)
  - Filtres par catégorie
  - Recherche en temps réel
  - Modal détails produit (nom, description, prix)

- ✅ **Localisation** (`/location`)
  - Adresse complète
  - Horaires d'ouverture
  - Map intégrée
  - Bouton WhatsApp

- ✅ **Notre Histoire** (`/notre-histoire`)
  - Histoire du restaurant
  - Vision et valeurs

#### Composants UI
- ✅ Navigation responsive (desktop + mobile burger menu)
- ✅ WhatsApp floating button
- ✅ Footer complet
- ✅ Backgrounds animés
- ✅ Design Shadcn/ui (25+ composants)

---

### 🔐 2. AUTHENTIFICATION

#### Système Better Auth
- ✅ **Inscription** (`/concours/auth`)
  - Email + Password
  - Validation email (configurable)
  - Création automatique carte fidélité

- ✅ **Connexion**
  - Email/Password
  - Google OAuth
  - Session 7 jours

- ✅ **Gestion session**
  - Cookie sécurisé `better-auth.session_token`
  - API `/api/auth/[...all]/route.ts`

#### Rôles
- ✅ **USER** (défaut) : Accès concours + fidélité
- ✅ **ADMIN** : Accès complet dashboard admin
- ✅ Liste emails admin configurable (`lib/admin.ts`)

#### Sécurité
- ✅ Middleware protection routes `/admin/*` et `/api/admin/*`
- ✅ Vérification rôle dans chaque API route admin
- ✅ Hash bcrypt pour passwords

---

### 💳 3. SYSTÈME DE FIDÉLITÉ

#### Carte Membre Digitale
- ✅ **Génération automatique**
  - Numéro unique : `KW-XXXXXX` (nanoid)
  - QR code unique (Data URL, base64)
  - Création à l'inscription

- ✅ **4 Tiers**
  - BRONZE : 0-499 MAD dépensés
  - SILVER : 500-999 MAD
  - GOLD : 1000-1999 MAD
  - PLATINUM : 2000+ MAD

- ✅ **Points**
  - 1 point = 10 MAD dépensés
  - Points cumulables
  - Échange contre récompenses

- ✅ **Page Carte** (`/loyalty/card`)
  - Affichage carte avec gradient par tier
  - QR code scannable
  - Statistiques (points, total dépensé, visites)
  - Barre de progression vers tier supérieur
  - Liste avantages par tier

#### API
- ✅ `GET /api/loyalty/card` : Récupère carte utilisateur
- ✅ Création automatique si inexistante

#### Logique (`lib/loyalty/member-card.ts`)
- ✅ `generateCardNumber()` : Génère KW-XXXXXX unique
- ✅ `generateQRCode()` : Génère QR code Data URL
- ✅ `createMemberCard()` : Création complète
- ✅ `getMemberCard()` : Récupération
- ✅ `calculateTier()` : Calcul tier basé sur totalSpent
- ✅ `addPoints()` : Ajout points + recalcul tier
- ✅ `removePoints()` : Retrait points (remboursement)

---

### 🔌 4. INTÉGRATION LOYVERSE

#### Connexion
- ✅ **OAuth Flow** (`/api/loyverse/connect` + `/api/loyverse/callback`)
  - Authorization code grant
  - Stockage access_token + refresh_token
  - Singleton `LoyverseConfig` dans DB

- ✅ **API Token** (alternative)
  - Token direct sans OAuth
  - Configuration via .env

#### Webhook
- ✅ **Endpoint** (`/api/loyverse/webhook`)
  - Reçoit `receipt.created` : Attribution points automatique
  - Reçoit `receipt.deleted` : Annulation points
  - Vérification signature HMAC SHA256
  - Mise à jour automatique tier

- ✅ **Logique** (`lib/loyalty/loyverse.ts`)
  - `handleReceiptCreated()` : Calcul points (1pt / 10 MAD)
  - `handleReceiptDeleted()` : Retrait points
  - `createLoyverseCustomer()` : Crée client avec customer_code = numéro carte
  - `getLoyverseCustomerByCode()` : Recherche client
  - `syncCustomerToLoyverse()` : Sync nos données → Loyverse
  - `syncFromLoyverse()` : Pull données Loyverse → notre DB

#### Setup
- ✅ `POST /api/loyverse/setup-webhook` : Configure webhook automatiquement via API

---

### 🏆 5. CONCOURS 1 : Score Exact → Gaufre Gratuite

#### Concept
- Client scanne QR du jour → Peut pronostiquer
- Score exact → Gagne gaufre gratuite (code unique)
- Bon vainqueur → 3 points pour classement

#### Frontend
- ✅ **Page Pronostics** (`/concours/pronostics`)
  - Liste matchs à venir
  - Filtres par phase (poules, 8èmes, etc.)
  - Drapeaux, date/heure, stade
  - Modal saisie score (0-20)
  - Modification possible jusqu'à 1h avant match
  - Statut "Pronostics fermés" si < 1h

- ✅ **Page Mes Pronostics** (`/concours/mes-pronostics`)
  - Historique pronostics utilisateur
  - Affichage : Match, Mon prono, Score réel, Points
  - Statut : En attente / Bon / Mauvais

- ✅ **Page Mes Lots** (`/concours/mes-lots`)
  - Liste récompenses gagnées
  - Code à présenter en magasin
  - Statut : Disponible / Réclamé / Expiré

#### Backend
- ✅ **API Pronostic**
  - `POST /api/concours/pronostic` : Créer/MAJ pronostic
  - `GET /api/concours/pronostic?userId=X` : Liste pronostics user
  - `GET /api/concours/matches?userId=X` : Matchs avec pronostic existant

- ✅ **Logique** (`lib/concours/pronostic.ts`)
  - `createOrUpdatePronostic()` : Enregistre pronostic
    - Vérifie match non verrouillé (lockPronostics)
    - Vérifie match non commencé
    - Vérifie scan QR du jour (lien Concours 2)
  - `calculatePronosticsAfterMatch()` : Calcul après match
    - Score exact → 5 points + GAUFRE-XXXXXX
    - Bon résultat → 3 points
    - Mise à jour `Pronostic.points`, `isExactScore`, `isCorrectWinner`
  - `generateWaffleReward()` : Crée `Reward` type GAUFRE_GRATUITE
    - Expire 7 jours après création
    - Code unique pour validation staff

#### Cron
- ✅ **Lock Matches** (`/api/cron/lock-matches`)
  - Exécute toutes les 5 minutes
  - Verrouille matchs < 1h
  - `Match.lockPronostics = true`

---

### 🔢 6. CONCOURS 2 : QR Code Journalier + Classement

#### Concept
- Admin génère QR unique chaque jour
- Client scanne QR → Accès pronostics
- 1 scan/jour/client max
- Classement général tous participants

#### QR Codes
- ✅ **Format** : `KWCAN-20251221-ABC12345`
  - Date + identifiant unique

- ✅ **Génération** (`lib/concours/daily-qr.ts`)
  - `generateDailyQRCode()` : Crée QR unique
  - `createDailyQRCode()` : Stocke dans DB + désactive anciens
  - `getTodayQRCode()` : Récupère QR actif
  - `validateQRCode()` : Vérifie validité (date + actif)
  - `recordQRScan()` : Enregistre scan (incrémente compteur)
  - `hasScannedToday()` : Vérifie accès pronostics
  - `getQRCodeStats()` : Stats admin

#### Frontend
- ✅ **Page Scan** (`/concours/scan?code=XXX`)
  - Paramètre `code` dans URL
  - Enregistre scan
  - Redirige vers `/concours/pronostics`

- ✅ **Page Admin QR** (`/admin/qr-code`)
  - Affichage QR actif avec stats
  - Boutons télécharger PNG / imprimer
  - Design print-friendly (A4)
  - Historique 9 derniers QR codes
  - Bouton "Générer nouveau QR"

#### API
- ✅ `POST /api/concours/scan-qr` : Enregistre scan user
- ✅ `GET /api/admin/qr-code/current` : QR actif du jour
- ✅ `POST /api/admin/qr-code/generate` : Génère manuellement
- ✅ `GET /api/admin/qr-code/history` : Historique

#### Cron
- ✅ **Generate Daily QR** (`/api/cron/generate-daily-qr`)
  - Exécute à minuit (0 0 * * *)
  - Génère automatiquement QR du jour
  - Désactive QR précédents

#### Classement
- ✅ **API** : `GET /api/concours/leaderboard`
  - Top 50 utilisateurs par points
  - Agrégation `SUM(Pronostic.points)`
  - Tri décroissant

- ⚠️ **Page** : `/concours/classement` (partiellement implémentée)

---

### ⚽ 7. CONCOURS 3 : Jeu du Buteur

#### Concept
- Client achète menu → Reçoit ticket buteur
- Ticket contient joueur aléatoire du match
- Si joueur marque → Lot aléatoire (Smoothie/Gaufre/Bon)

#### Tickets
- ✅ **Format** : `BUT-XXXXXX` (nanoid 6 chars)

- ✅ **Logique** (`lib/concours/buteur-ticket.ts`)
  - `createButeurTicket()` : Génère ticket
    - Sélectionne joueur aléatoire parmi 2 équipes du match
    - Vérifie match non terminé
    - Crée `ButeurTicket`
  - `checkTicketsAfterMatch()` : Vérifie après match
    - Compare `player.goals > 0`
    - Attribue lot aléatoire :
      - SMOOTHIE (25 MAD) : 50%
      - GAUFRE (30 MAD) : 30%
      - BON_PARTENAIRE (50 MAD) : 20%
    - Marque `hasWon = true`, `isChecked = true`
  - `verifyTicket()` : Vérification pour staff PDV
  - `redeemTicket()` : Marque ticket réclamé
  - `getUserTickets()` : Liste tickets user
  - `getTicketStats()` : Stats admin

#### Frontend
- ✅ **Page Mes Tickets** (`/concours/mes-tickets`)
  - Liste tickets utilisateur
  - Statut : En attente / Gagnant / Perdant
  - Affichage : Joueur, Match, Date
  - QR code ticket pour staff

#### API
- ✅ `POST /api/concours/ticket` : Créer ticket (achat menu)
- ✅ `GET /api/concours/ticket?userId=X` : Liste tickets user

#### Admin
- ✅ **Page Buteurs** (`/admin/buteurs`)
  - Sélection match du jour
  - Liste joueurs 2 équipes
  - Checkboxes pour sélectionner buteurs réels
  - Boutons "Tout" / "Aucun" par équipe

- ✅ **API Routes**
  - `GET /api/admin/buteurs/matches` : Matchs du jour
  - `GET /api/admin/buteurs/players?matchId=X` : Joueurs match
  - `GET /api/admin/buteurs/selected?matchId=X` : Buteurs sélectionnés
  - `POST /api/admin/buteurs/select` : Enregistrer buteurs

---

### 👨‍💼 8. ADMINISTRATION

#### Dashboard Principal
- ✅ **Page** : `/admin`
  - Stats temps réel :
    - **Matchs** : Total, terminés, à venir, aujourd'hui
    - **Participants** : Total, avec pronostics, avec tickets
    - **Pronostics** : Total, scores exacts, bons résultats, taux réussite
    - **Tickets** : Total, gagnants, réclamés, en attente
  - Cards cliquables vers sous-sections
  - Actions rapides (boutons)

#### Gestion Matchs
- ✅ **Page** : `/admin/matches`
  - Liste tous matchs par phase
  - Filtres : Toutes phases / Poules / 8èmes / etc.
  - Formulaire saisie résultat :
    - Scores (homeScore, awayScore)
    - Bouton "Enregistrer"
  - Statut visuel (À venir / En cours / Terminé)

- ✅ **API**
  - `GET /api/admin/matches` : Liste matchs
  - `POST /api/admin/matches/update-result` : Saisir résultat
    - Marque `isFinished = true`
    - Appelle `calculatePronosticsAfterMatch()`
    - ⚠️ TODO : Appeler `checkTicketsAfterMatch()` aussi

#### Stats Globales
- ✅ `GET /api/admin/stats` : Toutes stats dashboard
  - Agrégations Prisma optimisées
  - Calculs en temps réel

#### Middleware Protection
- ✅ **Fichier** : `middleware.ts`
  - Vérifie cookie session sur `/admin/*` et `/api/admin/*`
  - Redirige vers `/concours/auth` si non connecté
  - Chaque API route vérifie aussi `isUserAdmin(userId)`

---

### 📊 9. SEEDING COMPLET

#### Données Initiales
- ✅ **24 Équipes CAN 2025** (`prisma/seeds/teams.ts`)
  - 6 groupes (A-F)
  - Drapeaux (Flagcdn)
  - Noms FR + AR

- ✅ **501 Joueurs** (`prisma/seeds/players.ts`)
  - ~20-25 par équipe
  - Positions : GOALKEEPER, DEFENDER, MIDFIELDER, FORWARD
  - Numéros maillot
  - Noms réalistes

- ✅ **36 Matchs Phase Poules** (`prisma/seeds/matches.ts`)
  - 6 matchs par groupe
  - Dates : 21 déc 2025 → 2 jan 2026
  - Stades réels du Maroc
  - Horaires 17h et 20h

- ✅ **Admin User**
  - Email : `admin@kech-waffles.com`
  - Rôle : ADMIN
  - Créé automatiquement lors du seed

#### Commande
```bash
pnpm seed
```

---

### 🎨 10. DESIGN SYSTEM

#### Couleurs Marocaines
- ✅ **Vert** : `#16a34a` (from-green-600)
- ✅ **Doré** : `#d97706`, `#f59e0b` (amber-500/600)
- ✅ **Rouge** : `#dc2626` (to-red-600)

#### Effets Visuels
- ✅ Gradients : `bg-gradient-to-r from-green-600 via-amber-500 to-red-600`
- ✅ Glow effects : `shadow-[0_0_30px_rgba(217,119,6,0.4)]`
- ✅ Shine borders (MagicUI)
- ✅ Wallpaper : `public/images/elements/wallpaper.png`

#### Composants Shadcn/ui
- ✅ 25+ composants installés (Button, Card, Dialog, Input, Select, etc.)
- ✅ Thème "new-york"
- ✅ CSS variables pour theming
- ✅ Dark mode ready

---

## B. ⚠️ FONCTIONNALITÉS PARTIELLEMENT IMPLÉMENTÉES

### 1. Pronostic Final (Vainqueur CAN)
- ⚠️ **Modèle DB existe** (`FinalPronostic`)
- ❌ **Page frontend manquante** : `/concours/pronostics/final`
- ❌ **API manquante** :
  - `POST /api/concours/pronostic/final`
  - `GET /api/concours/pronostic/final?userId=X`
- ❌ **Logique calcul bonus** après compétition

### 2. Système Récompenses Fidélité
- ⚠️ **Modèle DB existe** (`LoyaltyReward`)
- ❌ **Catalogue vide** (pas de seed)
- ❌ **Page catalogue** : `/loyalty/rewards`
- ❌ **API échange points** : `POST /api/loyalty/redeem`
- ❌ **Interface admin** : `/admin/rewards`

### 3. Grand Prix Final
- ⚠️ **Champs DB existent** (`Competition.grandPrixWinnerId`)
- ❌ **Liste éligibles**
- ❌ **Algorithme tirage au sort**
- ❌ **Interface admin tirage**

### 4. OAuth Loyverse Refresh
- ⚠️ **Code TODO dans** `lib/loyalty/loyverse.ts`
- ❌ **Auto-refresh token expiré**

---

## C. ❌ FONCTIONNALITÉS MANQUANTES CRITIQUES

### 1. Pages Utilisateur

#### `/concours/mes-pronostics` (INCOMPLET)
- ❌ Filtres : Tous / En attente / Terminés
- ❌ Stats : Taux réussite, points totaux, classement position
- ❌ Design liste historique complet

#### `/concours/classement` (INCOMPLET)
- ❌ Top 50 avec pagination
- ❌ Position utilisateur connecté
- ❌ Filtres : Global / Semaine / Amis
- ❌ Podium visuel (top 3)

#### `/concours/mes-lots` (INCOMPLET)
- ❌ QR code pour chaque reward
- ❌ Filtres : Disponibles / Réclamés / Expirés
- ❌ Bouton "Réclamer" avec modal

### 2. Interface Staff PDV

#### `/staff/scan-reward` (INEXISTANT)
- ❌ Scanner QR code reward
- ❌ Vérifier validité
- ❌ Bouton "Valider"
- ❌ Historique scans du jour

#### `/staff/create-ticket` (INEXISTANT)
- ❌ Sélection menu acheté
- ❌ Sélection match
- ❌ Génération instantanée ticket
- ❌ Impression ticket PDF

### 3. API Routes Critiques

```typescript
// Rewards
POST /api/admin/rewards/redeem        // Valider reward staff
GET  /api/loyalty/rewards              // Catalogue récompenses
POST /api/loyalty/redeem               // Échanger points

// Tickets Buteur
POST /api/concours/ticket/verify       // Vérifier ticket
POST /api/concours/ticket/redeem       // Réclamer lot

// Pronostic Final
GET  /api/concours/final-pronostic     // Récupérer pronostic user
POST /api/concours/final-pronostic     // Enregistrer pronostic

// Grand Prix
POST /api/admin/grand-prix/draw        // Effectuer tirage
GET  /api/admin/grand-prix/eligible    // Liste éligibles
```

### 4. Seed Données Manquantes

- ❌ **Matchs phases éliminatoires** (1/8, 1/4, 1/2, finale, 3e place)
- ❌ **LoyaltyReward** (catalogue 5-10 récompenses)
- ❌ **Competition** (config dates CAN 2025)

### 5. Notifications

#### Email (Resend / SendGrid)
- ❌ Score exact → "Gaufre gagnée !"
- ❌ Ticket buteur gagnant → "Votre buteur a marqué !"
- ❌ Nouveau QR du jour (optionnel)
- ❌ Upgrade tier fidélité
- ❌ Bienvenue à l'inscription

#### SMS (Twilio) - Optionnel
- ❌ Lot gagné important
- ❌ Classement top 10

#### Push Notifications (PWA) - Optionnel
- ❌ Service worker
- ❌ Notifications browser

### 6. Tests

- ❌ **Tests unitaires** (Jest / Vitest)
- ❌ **Tests API** (routes pronostic, scan, tickets)
- ❌ **Tests E2E** (Playwright / Cypress)
- ❌ **Tests intégration** Loyverse

### 7. Documentation Utilisateur

- ❌ **Page Règlement** : `/reglement`
  - Règles 3 concours
  - Conditions participation
  - Modalités lots

- ❌ **Page FAQ** : `/faq`
  - Questions fréquentes
  - Catégories (Fidélité, Concours, Technique)

- ❌ **Page Aide** : `/aide`
  - Tutoriels (comment pronostiquer, scanner QR)
  - Vidéos ou GIFs explicatifs

### 8. Sécurité

#### Rate Limiting
- ❌ Sur `/api/concours/pronostic` (10 req/min)
- ❌ Sur `/api/concours/scan-qr` (5 req/min)
- ❌ Sur `/api/auth/*` (5 req/5min)

#### Variables d'Environnement
- ❌ `CRON_SECRET` non documentée
- ❌ `.env.example` incomplet

#### Monitoring
- ❌ Sentry pour error tracking
- ❌ Winston/Pino pour logs structurés
- ❌ Alertes si cron échoue

### 9. Performance

#### Cache
- ❌ Redis pour leaderboard (mise à jour 5 min)
- ❌ Cache API responses (Next.js)

#### Pagination
- ❌ Leaderboard (actuellement top 50 sans pagination)
- ❌ Historique pronostics
- ❌ Historique transactions fidélité

#### Images
- ⚠️ Images menu via Unsplash (dépendance externe)
- ❌ CDN configuré (Cloudflare / Vercel Edge)

### 10. Admin Manquant

#### `/admin/users` (INEXISTANT)
- ❌ Liste tous utilisateurs
- ❌ Filtres : Rôle, Tier, Avec pronostics
- ❌ Recherche par email/nom
- ❌ Actions : Promouvoir admin, Supprimer

#### `/admin/rewards` (INEXISTANT)
- ❌ Gérer catalogue `LoyaltyReward`
- ❌ CRUD récompenses
- ❌ Stats : Échanges, Stock restant

#### `/admin/competition` (INEXISTANT)
- ❌ Configurer dates CAN
- ❌ Lock pronostics finaux
- ❌ Saisir résultats réels (vainqueur, podium)

#### `/admin/logs` (INEXISTANT)
- ❌ Historique actions admin
- ❌ Logs webhook Loyverse
- ❌ Logs erreurs

---

## D. 🎯 TODO LIST PRIORISÉE

### 🔥 PRIORITÉ 1 : CRITIQUE (Bloquer Production)

#### 1.1 Sécurité Cron Jobs
```bash
# .env
CRON_SECRET="générer_32_chars_aléatoires"
```
- [ ] Ajouter vérification `CRON_SECRET` dans `/api/cron/*`
- [ ] Documenter dans `.env.example`
- [ ] Tester génération QR automatique (minuit)

#### 1.2 Compléter Seed
- [ ] Générer matchs éliminatoires (16 matchs)
  ```typescript
  // Utiliser lib/concours/knockout-generator.ts
  await generateRoundOf16Matches();
  await generateQuarterFinalMatches();
  await generateSemiFinalMatches();
  await generateFinalMatches();
  ```
- [ ] Vérifier exhaustivité joueurs (minimum 23 par équipe)
- [ ] Seed `LoyaltyReward` (5-10 récompenses)
  ```typescript
  const rewards = [
    { name: "Café gratuit", pointsCost: 50 },
    { name: "Gaufre 50% off", pointsCost: 100 },
    // ...
  ];
  ```
- [ ] Seed `Competition` (dates CAN 2025)

#### 1.3 API Routes Critiques
- [ ] `POST /api/admin/rewards/redeem`
  ```typescript
  // Input: { code: string, staffName: string }
  // Marque reward.isRedeemed = true
  ```
- [ ] `POST /api/concours/ticket/verify`
  ```typescript
  // Input: { ticketCode: string }
  // Retourne ticket + hasWon + prizeType
  ```
- [ ] `POST /api/concours/ticket/redeem`
  ```typescript
  // Input: { ticketCode: string }
  // Marque ticket.isRedeemed = true
  ```
- [ ] `GET /api/concours/final-pronostic`
- [ ] `POST /api/concours/final-pronostic`

#### 1.4 Trigger Auto Vérification Tickets
Dans `/api/admin/matches/update-result/route.ts`, après ligne 48 :
```typescript
// Calculer points pronostics
await calculatePronosticsAfterMatch(matchId, homeScore, awayScore);

// AJOUTER CETTE LIGNE :
await checkTicketsAfterMatch(matchId, scorerPlayerIds);
```

#### 1.5 Rate Limiting
```bash
pnpm add @upstash/ratelimit @upstash/redis
```
```typescript
// lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const pronosticLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 req/min
});

export const scanLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 req/min
});
```

---

### ⚡ PRIORITÉ 2 : HAUTE (Améliorer UX)

#### 2.1 Compléter Pages Utilisateur
- [ ] `/concours/mes-pronostics` : Historique complet
  - Filtres : Tous / En attente / Terminés
  - Stats : Taux réussite, points totaux

- [ ] `/concours/classement` : Leaderboard
  - Top 50 avec pagination
  - Position user mise en évidence
  - Filtres : Global / Semaine

- [ ] `/concours/mes-lots` : Rewards avec QR codes
  - QR code pour chaque lot
  - Bouton "Réclamer" avec modal
  - Filtres : Disponibles / Réclamés / Expirés

#### 2.2 Pronostic Final
- [ ] Page `/concours/pronostics/final`
  - Select vainqueur (24 équipes)
  - Select podium (3 équipes)
  - Score finale (optionnel)
  - Lock automatique avant début CAN

- [ ] API `POST /api/concours/pronostic/final`
  - Validation : 3 équipes différentes
  - Vérifier pas déjà locked

- [ ] API `GET /api/concours/pronostic/final?userId=X`

#### 2.3 Interface Staff PDV
- [ ] Page `/staff/scan-reward`
  - Input code ou scan QR
  - Affichage : Type lot, User, Validité
  - Bouton "Valider"
  - Historique scans du jour

- [ ] Page `/staff/create-ticket`
  - Select menu acheté
  - Select match
  - Génération ticket instantanée
  - Impression PDF

#### 2.4 Notifications Email
```bash
pnpm add resend
```
- [ ] Configurer Resend
  ```env
  RESEND_API_KEY="re_..."
  FROM_EMAIL="noreply@kech-waffles.com"
  ```
- [ ] Templates :
  - Score exact → Gaufre gagnée
  - Ticket buteur gagnant
  - Bienvenue inscription
  - Upgrade tier fidélité

- [ ] Fonction `lib/email/send.ts`
  ```typescript
  import { Resend } from 'resend';

  const resend = new Resend(process.env.RESEND_API_KEY);

  export async function sendWaffleWonEmail(user: User) {
    await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: user.email,
      subject: '🎉 Vous avez gagné une gaufre !',
      html: `<p>Félicitations ${user.name} !</p>...`,
    });
  }
  ```

#### 2.5 Documentation Utilisateur
- [ ] Page `/reglement`
  - Règlement 3 concours
  - Conditions participation
  - Modalités lots

- [ ] Page `/faq`
  - Questions fréquentes (10-15)
  - Catégories : Fidélité, Concours, Technique

- [ ] Page `/aide`
  - Tutoriels avec images/GIFs
  - Vidéo : Comment pronostiquer
  - Vidéo : Comment scanner QR

---

### 🚀 PRIORITÉ 3 : MOYENNE (Optimisations)

#### 3.1 Tests Automatisés
```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom
```
- [ ] Tests unitaires composants
- [ ] Tests API routes (pronostic, scan-qr, tickets)
- [ ] Tests E2E Playwright (flow complet user)

#### 3.2 Middleware Admin JWT
- [ ] Encoder `role` dans JWT Better Auth
- [ ] Décoder dans middleware sans DB query

#### 3.3 Cache & Performance
```bash
pnpm add ioredis
```
- [ ] Redis pour leaderboard (update 5 min)
- [ ] Pagination sur listes longues
- [ ] CDN pour images (Cloudflare)

#### 3.4 Monitoring & Logs
```bash
pnpm add @sentry/nextjs winston
```
- [ ] Sentry error tracking
- [ ] Winston logs structurés
- [ ] Vercel Analytics

#### 3.5 Admin Loyverse
- [ ] Page `/admin/loyverse`
  - Bouton "Connecter Loyverse" (OAuth flow)
  - Status connexion (access_token valide ?)
  - Bouton "Setup Webhook"
  - Test connexion

#### 3.6 Admin Pages Manquantes
- [ ] `/admin/users` : Liste + filtres
- [ ] `/admin/rewards` : CRUD catalogue récompenses
- [ ] `/admin/competition` : Config dates + résultats

---

### 🎨 PRIORITÉ 4 : BASSE (Nice-to-have)

#### 4.1 PWA
- [ ] `manifest.json`
- [ ] Service worker
- [ ] Push notifications

#### 4.2 Internationalisation
- [ ] Français (défaut)
- [ ] Arabe (darija)
- [ ] Anglais

#### 4.3 Gamification
- [ ] Badges (First Blood, Hat-trick, Oracle)
- [ ] Streak (jours consécutifs scans)
- [ ] Leaderboard hebdomadaire

#### 4.4 Social Features
- [ ] Partage pronostics réseaux sociaux
- [ ] Défis entre amis
- [ ] Groupes (famille, collègues)

#### 4.5 Analytics Admin
- [ ] Dashboard avec Chart.js
- [ ] Export CSV/Excel
- [ ] Rapports automatiques (hebdo, fin CAN)

---

## E. 📝 CHECKLIST DÉPLOIEMENT PRODUCTION

### Pré-déploiement
- [ ] Variables .env complètes (voir `CONFIGURATION_LOYVERSE.md`)
- [ ] `BETTER_AUTH_SECRET` généré (32+ chars)
- [ ] Google OAuth redirect URIs prod
- [ ] Seed complet exécuté
- [ ] Admin user créé et testé
- [ ] Tests manuels 3 concours end-to-end

### Sécurité
- [ ] Rate limiting implémenté
- [ ] CSRF protection (Better Auth)
- [ ] Headers sécurité (X-Frame-Options, CSP)
- [ ] HTTPS forcé (Vercel auto)
- [ ] Webhook Loyverse signature HMAC

### Performance
- [ ] Prisma Client généré
- [ ] Images optimisées (Next.js Image)
- [ ] Compression activée
- [ ] Database indexes vérifiés

### Monitoring
- [ ] Sentry configuré
- [ ] Logs structurés
- [ ] Vercel Analytics
- [ ] Uptime monitoring

### Cron Jobs
- [ ] Vercel Cron activé (Pro plan)
- [ ] `CRON_SECRET` vérifié
- [ ] Tests manuels crons

### Intégrations
- [ ] Loyverse OAuth testé prod
- [ ] Webhook configuré URL prod
- [ ] Test achat réel → points
- [ ] Emails testés (Resend)

### Documentation
- [ ] README.md à jour
- [ ] `.env.example` complet
- [ ] Docs admin (saisir résultats)
- [ ] Docs staff PDV

---

## F. 📊 RÉCAPITULATIF CHIFFRES

### Fonctionnalités
- ✅ **Complètes** : 75 fonctionnalités
- ⚠️ **Partielles** : 4 fonctionnalités
- ❌ **Manquantes** : 35 fonctionnalités
- **Total** : 114 fonctionnalités

### Code
- **Pages** : 25+ pages
- **API Routes** : 30+ routes
- **Composants** : 50+ composants
- **Fichiers logique** : 15+ fichiers `lib/`
- **Lignes de code** : ~15,000+

### Base de Données
- **Modèles** : 16 modèles Prisma
- **Relations** : 25+ relations
- **Enums** : 8 enums

### Tests
- **Unitaires** : 0 ❌
- **Intégration** : 0 ❌
- **E2E** : 0 ❌
- **Manuels** : Requis ✅

---

## G. ⏱️ ESTIMATION TEMPS

### MVP Production (Priorité 1+2)
- **Développeur expérimenté** : 5-7 jours
- **Développeur junior** : 10-15 jours

### Version Complète (Priorité 1+2+3)
- **Développeur expérimenté** : 15-20 jours
- **Développeur junior** : 30-40 jours

---

**Document créé le** : 14 Octobre 2025
**État du projet** : 75% complété
**Production-ready** : OUI (avec Priorité 1 complétée)
