# 🛠️ Guide d'Implémentation Technique - Système Complet des Concours CAN 2025

## 📋 État Actuel

### ✅ Complété

#### Infrastructure Backend
- ✅ Schema Prisma complet avec tous les modèles (User, MemberCard, DailyQRCode, QRScan, Player, ButeurTicket, Pronostic, Match, Team, Reward, etc.)
- ✅ Better Auth configuré (email/password + Google OAuth)
- ✅ Connexion Supabase PostgreSQL
- ✅ Client Prisma configuré

#### Système de Fidélité
- ✅ `lib/loyalty/member-card.ts` - Génération cartes KW-XXXXXX avec QR codes
- ✅ `lib/loyalty/loyverse.ts` - Intégration API Loyverse
- ✅ Système de points (1 point = 10 MAD)
- ✅ 4 tiers (Bronze → Platinum)

#### Concours 1 : Score Exact → Gaufre
- ✅ `lib/concours/pronostic.ts` - Système complet de pronostics
- ✅ Calcul automatique des points après match
- ✅ Génération automatique de gaufres pour scores exacts
- ✅ Système de rewards avec codes uniques

#### Concours 2 : Pronostics CAN Complète
- ✅ `lib/concours/daily-qr.ts` - Système QR code journalier
- ✅ Validation et scan QR codes
- ✅ Vérification accès pronostics
- ✅ Classement général (leaderboard)

#### Concours 3 : Jeu du Buteur
- ✅ `lib/concours/buteur-ticket.ts` - Génération tickets avec buteurs aléatoires
- ✅ Vérification automatique après match
- ✅ Attribution lots selon probabilités
- ✅ Système de réclamation en PDV

#### API Routes
- ✅ `/api/concours/scan-qr` - Scan QR code
- ✅ `/api/concours/pronostic` - Créer/récupérer pronostics
- ✅ `/api/concours/matches` - Liste des matchs
- ✅ `/api/concours/ticket` - Créer/vérifier tickets buteur
- ✅ `/api/concours/leaderboard` - Classement général

#### Cron Jobs (Automatisation)
- ✅ `/api/cron/generate-daily-qr` - Génère QR quotidien à minuit
- ✅ `/api/cron/lock-matches` - Verrouille pronostics 1h avant match
- ✅ `vercel.json` configuré pour Vercel Cron

#### Pages
- ✅ `/app/concours/scan/page.tsx` - Page de scan QR

---

## 🚧 À Compléter

### 1. Initialisation Base de Données

**Attente**: Base Supabase doit être prête (user a dit "elle n'est pas encore dispo")

**Actions à faire dès que la DB est prête**:

```bash
# 1. Générer le client Prisma
npx prisma generate

# 2. Créer les tables
npx prisma db push

# 3. Vérifier dans Prisma Studio
npx prisma studio
```

### 2. Seed Data (Équipes + Matchs CAN 2025)

**Créer**: `prisma/seed.ts`

**Contenu nécessaire**:
- 24 équipes de la CAN 2025 avec drapeaux
- 56 matchs (40 poules + 16 élimination directe)
- Joueurs pour chaque équipe (au moins 23 joueurs par équipe)
- Rewards de base dans le catalogue

**Exemple structure**:

```typescript
// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Créer les équipes
  const morocco = await prisma.team.create({
    data: {
      name: "Morocco",
      nameFr: "Maroc",
      nameAr: "المغرب",
      code: "MAR",
      flag: "https://flagcdn.com/w320/ma.png",
      group: "A",
    },
  });

  // Répéter pour les 24 équipes...

  // 2. Créer les joueurs
  await prisma.player.createMany({
    data: [
      {
        name: "Achraf Hakimi",
        nameFr: "Achraf Hakimi",
        number: 2,
        position: "DEF",
        teamId: morocco.id,
      },
      // ... autres joueurs
    ],
  });

  // 3. Créer les matchs
  await prisma.match.create({
    data: {
      matchNumber: 1,
      phase: "GROUP_STAGE",
      homeTeamId: morocco.id,
      awayTeamId: /* autre équipe */,
      scheduledAt: new Date("2025-12-21T18:00:00Z"),
      venue: "Stade Mohammed V",
      city: "Casablanca",
    },
  });

  // 4. Créer la compétition
  await prisma.competition.create({
    data: {
      name: "CAN 2025",
      startDate: new Date("2025-12-21"),
      endDate: new Date("2026-01-18"),
      isActive: true,
      finalPronosticsDeadline: new Date("2025-12-20T23:59:59Z"),
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
```

**Configurer dans `package.json`**:

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

### 3. Pages UI à Créer

#### A. Page d'Authentification
**Path**: `/app/concours/auth/page.tsx`

**Fonctionnalités**:
- Formulaire inscription/connexion email + mot de passe
- Bouton Google OAuth
- Création automatique de MemberCard après inscription
- Redirection vers `/concours/pronostics` après connexion

#### B. Page Pronostics
**Path**: `/app/concours/pronostics/page.tsx`

**Fonctionnalités**:
- Vérifie si l'utilisateur a scanné le QR du jour
- Liste des matchs disponibles
- Formulaire de pronostic (score domicile/extérieur)
- Affiche les pronostics déjà faits
- Compte à rebours avant verrouillage

#### C. Page Historique Pronostics
**Path**: `/app/concours/mes-pronostics/page.tsx`

**Fonctionnalités**:
- Liste tous les pronostics de l'utilisateur
- Affiche les résultats réels
- Points gagnés par pronostic
- Statistiques (exactitudes, taux de réussite)

#### D. Page Classement
**Path**: `/app/concours/classement/page.tsx`

**Fonctionnalités**:
- Top 50 joueurs avec points
- Position de l'utilisateur actuel
- Filtres (tous / amis / top 10)
- Mise à jour en temps réel

#### E. Page Mes Tickets Buteur
**Path**: `/app/concours/mes-tickets/page.tsx`

**Fonctionnalités**:
- Liste de tous les tickets de l'utilisateur
- État (en attente / gagnant / perdant)
- Détails du lot si gagnant
- QR code ou code à présenter en PDV

#### F. Page Mes Lots
**Path**: `/app/concours/mes-lots/page.tsx`

**Fonctionnalités**:
- Tous les lots gagnés (gaufres, cafés)
- QR codes à scanner en magasin
- État (disponible / expiré / réclamé)
- Date d'expiration

#### G. Page Carte Membre
**Path**: `/app/loyalty/card/page.tsx`

**Fonctionnalités**:
- Affiche le numéro de carte KW-XXXXXX
- QR code scannable
- Points de fidélité actuels
- Tier actuel (Bronze/Silver/Gold/Platinum)
- Historique des transactions

### 4. Pages Admin

#### A. Admin - Générer QR Quotidien
**Path**: `/app/admin/qr-code/page.tsx`

**Fonctionnalités**:
- Bouton "Générer QR du jour"
- Affichage QR code en grand format
- Télécharger en PNG/PDF pour impression
- Historique des QR codes générés
- Statistiques de scans

#### B. Admin - Saisir Résultats Matchs
**Path**: `/app/admin/matches/page.tsx`

**Fonctionnalités**:
- Liste des matchs du jour
- Formulaire de saisie score (domicile/extérieur)
- Bouton "Valider résultat"
- Déclenche automatiquement :
  - Calcul des pronostics
  - Attribution des gaufres
  - Vérification des tickets buteur

#### C. Admin - Vérifier Tickets Buteur
**Path**: `/app/admin/verify-ticket/page.tsx`

**Fonctionnalités**:
- Scanner de code ticket (BUT-XXXXXX)
- Affiche infos : joueur, match, lot
- Bouton "Remettre le lot"
- Marque le ticket comme réclamé

#### D. Admin - Stats Générales
**Path**: `/app/admin/stats/page.tsx`

**Fonctionnalités**:
- Nombre total de participants
- Scans QR par jour
- Tickets distribués / gagnants
- Lots réclamés / en attente
- Budget dépensé vs ROI

### 5. Cron Jobs Additionnels

#### A. Vérification Automatique Tickets après Match
**Path**: `/app/api/cron/check-tickets/route.ts`

**Déclencheur**: Après chaque match (webhook ou cron toutes les 15 min pendant la CAN)

**Actions**:
1. Récupère les matchs terminés dans les dernières 24h
2. Pour chaque match :
   - Appelle `checkTicketsAfterMatch(matchId)`
   - Vérifie si les buteurs ont marqué
   - Attribue les lots

#### B. Calcul Automatique Pronostics après Match
**Path**: `/app/api/cron/calculate-pronostics/route.ts`

**Déclencheur**: Après chaque match

**Actions**:
1. Récupère les matchs terminés dans les dernières 24h
2. Pour chaque match :
   - Appelle `calculatePronosticsAfterMatch(matchId)`
   - Calcule les points
   - Génère les rewards (gaufres)

### 6. Webhooks Loyverse (Optionnel)

Si Loyverse supporte les webhooks, créer :

**Path**: `/app/api/webhooks/loyverse/receipt/route.ts`

**Actions**:
1. Reçoit notification d'achat
2. Si menu acheté → génère ticket buteur automatiquement
3. Ajoute points de fidélité au client

### 7. Tests et Sécurité

#### A. Middleware d'authentification
**Path**: `/middleware.ts`

**Actions**:
- Protège les routes `/concours/*` (nécessite connexion)
- Protège les routes `/admin/*` (nécessite rôle admin)
- Redirige vers `/concours/auth` si non connecté

#### B. Tests API
Créer tests pour :
- Création pronostics
- Validation QR codes
- Génération tickets
- Vérification rewards

### 8. Documentation Utilisateur

#### A. Guide Client
**Path**: `/app/concours/how-to-play/page.tsx`

**Contenu**:
- Comment scanner le QR en magasin
- Comment faire des pronostics
- Comment récupérer ses gaufres
- FAQ

#### B. Guide Staff PDV
**Document PDF ou page dédiée**

**Contenu**:
- Comment afficher le QR du jour
- Comment vérifier un ticket gagnant
- Comment scanner une carte membre
- Procédure de remise des lots

---

## 🔧 Configuration Production

### Variables d'environnement Vercel

Ajouter dans Vercel Dashboard :

```env
# Database
DATABASE_URL="..."
DIRECT_URL="..."

# Auth
BETTER_AUTH_SECRET="..."
BETTER_AUTH_URL="https://votre-domaine.com"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."

# Loyverse
LOYVERSE_API_TOKEN="..."
LOYVERSE_STORE_ID="..."

# Cron
CRON_SECRET="..." # Générer un secret sécurisé

# App
NEXT_PUBLIC_APP_URL="https://votre-domaine.com"
NODE_ENV="production"
```

### Google OAuth Redirect URIs

Ajouter dans Google Cloud Console :

```
https://votre-domaine.com/api/auth/callback/google
```

### Vercel Cron

Les cron jobs dans `vercel.json` seront automatiquement configurés après déploiement.

---

## 📊 Checklist de Lancement

### Avant la CAN (2 semaines avant)

- [ ] Base de données initialisée avec toutes les équipes
- [ ] Tous les matchs créés avec dates exactes
- [ ] Tous les joueurs ajoutés (23 par équipe minimum)
- [ ] QR code du jour généré pour le jour 1
- [ ] Tests complets de tous les flux
- [ ] Formation du staff PDV
- [ ] Impression des affiches avec QR code

### Jour 1 de la CAN

- [ ] QR code du jour affiché en vitrine
- [ ] Système de pronostics accessible
- [ ] Staff formé pour vérifier tickets
- [ ] Communication réseaux sociaux lancée

### Pendant la CAN

- [ ] Vérifier quotidiennement que le QR est généré
- [ ] Saisir résultats des matchs dès la fin
- [ ] Vérifier que les lots sont bien attribués
- [ ] Répondre aux questions clients

### Après la CAN

- [ ] Tirage au sort grand prix
- [ ] Statistiques finales
- [ ] Retour d'expérience
- [ ] Analyse ROI

---

## 🆘 Troubleshooting

### QR code ne fonctionne pas
1. Vérifier que le cron s'est exécuté (`/api/cron/generate-daily-qr`)
2. Vérifier que le QR est bien actif dans la DB
3. Tester manuellement avec Postman

### Pronostics ne se verrouillent pas
1. Vérifier le cron `/api/cron/lock-matches`
2. Vérifier les fuseaux horaires (UTC vs local)
3. Vérifier que `scheduledAt` est correct

### Tickets buteur non vérifiés
1. Lancer manuellement `/api/cron/check-tickets`
2. Vérifier que `goals` des joueurs est à jour
3. Vérifier les logs

### Lots non générés
1. Vérifier que le match est bien marqué `isFinished: true`
2. Vérifier les scores `homeScore` et `awayScore` non null
3. Relancer `/api/cron/calculate-pronostics`

---

## 📞 Support Développeur

Si problème technique :
1. Vérifier les logs Vercel
2. Vérifier Prisma Studio
3. Tester les API routes dans Postman
4. Vérifier les cron jobs dans Vercel Dashboard

---

**Prochaine étape recommandée** : Attendre que la base Supabase soit prête, puis lancer :

```bash
npx prisma generate
npx prisma db push
# Créer le fichier seed.ts avec les données CAN
pnpm prisma db seed
```
