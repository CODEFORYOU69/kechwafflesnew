# Système Admin des Concours CAN 2025 - Kech Waffles

## 📋 Vue d'ensemble

Système complet de gestion des concours CAN 2025 pour le restaurant Kech Waffles à Marrakech. Ce système permet de gérer 3 concours différents avec un panneau d'administration puissant.

---

## ✅ Fonctionnalités Complétées

### 1. 🗄️ Base de Données Seeding

#### **Teams (24 équipes)**
- Toutes les équipes qualifiées pour la CAN 2025
- Organisées en 6 groupes (A à F)
- Avec drapeaux, codes ISO et noms multilingues (FR/AR)
- **Fichier**: `prisma/seeds/teams.ts`

#### **Players (501 joueurs)**
- ~20-25 joueurs par équipe
- Positions (GOALKEEPER, DEFENDER, MIDFIELDER, FORWARD)
- Numéros de maillot
- Noms réalistes basés sur les vraies sélections
- **Fichier**: `prisma/seeds/players.ts`

#### **Matches (36 matchs de poules)**
- Calendrier complet du 21 décembre 2025 au 2 janvier 2026
- Tous les stades du Maroc (Casablanca, Marrakech, Agadir, Fès, etc.)
- Horaires réalistes (17h et 20h)
- **Fichier**: `prisma/seeds/matches.ts`

#### **Commande de seeding**
```bash
pnpm seed
```

---

### 2. 🏆 Générateur de Matchs à Élimination Directe

Génère automatiquement les matchs des phases finales basé sur les résultats de poules.

#### **Fonctions disponibles**
```typescript
// lib/concours/knockout-generator.ts

// Génère les 8èmes de finale (16 équipes)
generateRoundOf16Matches()

// Génère les quarts de finale (8 équipes)
generateQuarterFinalMatches()

// Génère les demi-finales (4 équipes)
generateSemiFinalMatches()

// Génère finale et match pour la 3ème place
generateFinalMatches()

// Génère tout d'un coup (pour tests)
generateAllKnockoutMatches()
```

#### **Algorithme de qualification**
- **1er et 2ème de chaque groupe** (12 équipes)
- **4 meilleurs 3èmes** (classement par points → diff de buts → buts marqués)
- **Total**: 16 équipes qualifiées pour les 8èmes

#### **Fichier**: `lib/concours/knockout-generator.ts`

---

### 3. 🎯 Interface Admin - Gestion des Matchs

Interface complète pour saisir les résultats des matchs.

#### **Fonctionnalités**
- ✅ Liste des matchs avec filtres par phase
- ✅ Cartes visuelles avec drapeaux des équipes
- ✅ Formulaire de saisie des scores
- ✅ Statut des matchs (À venir, En cours, Terminé)
- ✅ Informations du match (stade, ville, date)

#### **Calcul automatique des points**
Lorsqu'un résultat est saisi, le système calcule automatiquement les points de tous les pronostics :
- **5 points** : Score exact
- **3 points** : Bon vainqueur ou match nul
- **0 point** : Mauvais pronostic

#### **Fichiers**
- Interface : `app/admin/matches/page.tsx`
- API : `app/api/admin/matches/route.ts`
- API mise à jour : `app/api/admin/matches/update-result/route.ts`

#### **Routes**
- `GET /api/admin/matches` - Liste des matchs
- `POST /api/admin/matches/update-result` - Saisir résultat

---

### 4. ⚽ Interface Admin - Sélection des Buteurs

Interface pour sélectionner les buteurs potentiels (Concours 3 - Jeu du Buteur).

#### **Fonctionnalités**
- ✅ Sélection d'un match à venir
- ✅ Affichage des joueurs des deux équipes
- ✅ Sélection multiple avec checkboxes
- ✅ Boutons "Tout sélectionner" / "Aucun" par équipe
- ✅ Compteur de joueurs sélectionnés
- ✅ Sauvegarde de la sélection

#### **Processus**
1. Admin sélectionne un match à venir
2. Système affiche les joueurs des 2 équipes
3. Admin coche les joueurs susceptibles de marquer
4. Sélection sauvegardée pour génération des tickets

#### **Fichiers**
- Interface : `app/admin/buteurs/page.tsx`
- API matches : `app/api/admin/buteurs/matches/route.ts`
- API joueurs : `app/api/admin/buteurs/players/route.ts`
- API sélection : `app/api/admin/buteurs/select/route.ts`
- API selected : `app/api/admin/buteurs/selected/route.ts`

#### **Routes**
- `GET /api/admin/buteurs/matches` - Matchs à venir
- `GET /api/admin/buteurs/players?matchId=xxx` - Joueurs d'un match
- `GET /api/admin/buteurs/selected?matchId=xxx` - Joueurs déjà sélectionnés
- `POST /api/admin/buteurs/select` - Enregistrer sélection

---

### 5. 🎟️ Système de Génération de Tickets Buteur

Logique complète pour le Concours 3 (Jeu du Buteur).

#### **Fonctions principales**

```typescript
// lib/concours/ticket-generator.ts

// Génère un ticket pour un utilisateur
generateButeurTicket(userId, matchId, selectedPlayerIds)

// Génère plusieurs tickets d'un coup
generateMultipleTickets(userId, matchId, selectedPlayerIds, count)

// Vérifie les tickets gagnants après un match
checkWinningTickets(matchId, scorerPlayerIds)

// Récupère les tickets d'un utilisateur
getUserTickets(userId)

// Récupère un ticket par code
getTicketByCode(ticketCode)

// Récupère les tickets gagnants non réclamés
getUserWinningTickets(userId)

// Marque un ticket comme réclamé
redeemTicket(ticketCode)

// Stats des tickets d'un match
getMatchTicketStats(matchId)
```

#### **Format des tickets**
- Code unique : `BUT-XXXXXX` (6 caractères alphanumériques)
- Génération avec nanoid (très faible risque de collision)

#### **Types de lots (attribution aléatoire)**
- **50%** : SMOOTHIE (35 MAD)
- **30%** : GAUFRE (45 MAD)
- **20%** : BON_PARTENAIRE (50 MAD)

#### **Workflow**
1. Admin sélectionne buteurs potentiels
2. Utilisateur reçoit ticket(s) avec joueur aléatoire
3. Match terminé → Admin indique les buteurs réels
4. Système vérifie tickets → Attribution lots
5. Utilisateur réclame lot avec code ticket

#### **Fichier**: `lib/concours/ticket-generator.ts`

---

### 6. 🔒 Middleware de Protection Admin

Middleware Next.js pour sécuriser toutes les routes admin.

#### **Fonctionnalités**
- ✅ Vérification de session Better Auth
- ✅ Redirection vers login si non authentifié
- ✅ Protection des routes `/admin/*` et `/api/admin/*`
- ✅ Gestion des redirects avec paramètre `?redirect=`

#### **Configuration**
```typescript
// middleware.ts
export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
```

#### **Double vérification**
1. **Middleware** : Vérifie présence session
2. **API Routes** : Vérifie rôle ADMIN dans la base de données

#### **Fichiers**
- Middleware : `middleware.ts`
- Utils admin : `lib/admin.ts`

---

### 7. 📊 Dashboard Admin

Tableau de bord principal avec statistiques en temps réel.

#### **Statistiques affichées**

**Matchs**
- Total de matchs
- Matchs terminés
- Matchs à venir
- Matchs aujourd'hui

**Participants**
- Total utilisateurs
- Avec pronostics (Concours 1)
- Avec tickets (Concours 3)

**Pronostics (Concours 1)**
- Total de pronostics
- Scores exacts (5 pts)
- Bons vainqueurs (3 pts)
- Taux de réussite

**Tickets Buteur (Concours 3)**
- Total de tickets
- Tickets gagnants
- Tickets réclamés
- Tickets en attente

#### **Actions rapides**
- Boutons vers gestion matchs
- Boutons vers sélection buteurs
- Boutons vers gestion utilisateurs

#### **Fichiers**
- Interface : `app/admin/page.tsx`
- API : `app/api/admin/stats/route.ts`

#### **Routes**
- Dashboard : `/admin`
- API stats : `GET /api/admin/stats`

---

## 🎨 Design System

### **Couleurs Marocaines**
Le design utilise les couleurs du drapeau marocain avec effet doré :
- **Vert** : `from-green-600` / `#16a34a`
- **Doré** : `via-amber-500` / `#d97706` / `#f59e0b`
- **Rouge** : `to-red-600` / `#dc2626`

### **Effets visuels**
- Gradients : `bg-gradient-to-r from-green-600 via-amber-500 to-red-600`
- Glow effects : `shadow-[0_0_30px_rgba(217,119,6,0.4)]`
- Shine borders : Composant MagicUI
- Wallpaper : `public/images/elements/wallpaper.png`

---

## 📁 Structure des Fichiers

```
kech-waffles-new/
├── app/
│   ├── admin/
│   │   ├── page.tsx                    # Dashboard admin
│   │   ├── matches/
│   │   │   └── page.tsx                # Gestion matchs
│   │   └── buteurs/
│   │       └── page.tsx                # Sélection buteurs
│   └── api/
│       └── admin/
│           ├── matches/
│           │   ├── route.ts            # Liste matchs
│           │   └── update-result/
│           │       └── route.ts        # Saisir résultat
│           ├── buteurs/
│           │   ├── matches/
│           │   │   └── route.ts        # Matchs à venir
│           │   ├── players/
│           │   │   └── route.ts        # Joueurs du match
│           │   ├── selected/
│           │   │   └── route.ts        # Buteurs déjà sélectionnés
│           │   └── select/
│           │       └── route.ts        # Enregistrer sélection
│           └── stats/
│               └── route.ts            # Stats dashboard
├── lib/
│   ├── admin.ts                        # Utils admin
│   ├── prisma.ts                       # Client Prisma
│   └── concours/
│       ├── knockout-generator.ts       # Génération matchs éliminatoires
│       └── ticket-generator.ts         # Génération tickets buteur
├── prisma/
│   ├── schema.prisma                   # Schéma DB
│   ├── seed.ts                         # Seed principal
│   └── seeds/
│       ├── teams.ts                    # Seed 24 équipes
│       ├── players.ts                  # Seed 501 joueurs
│       └── matches.ts                  # Seed 36 matchs poules
└── middleware.ts                       # Protection routes admin
```

---

## 🚀 Utilisation

### **1. Seeding Initial**
```bash
# Créer et peupler la base de données
pnpm prisma db push
pnpm seed
```

### **2. Créer un Admin**
L'email `admin@kech-waffles.com` est automatiquement créé avec le rôle ADMIN lors du seed.

Pour ajouter d'autres admins, modifier `lib/admin.ts` :
```typescript
export const ADMIN_EMAILS = [
  "admin@kech-waffles.com",
  "votre-email@example.com",  // Ajouter ici
];
```

### **3. Accéder au Dashboard**
1. Se connecter avec un compte admin : `/concours/auth`
2. Accéder au dashboard : `/admin`
3. Ou directement :
   - Matchs : `/admin/matches`
   - Buteurs : `/admin/buteurs`

### **4. Workflow Typique**

#### **Avant un match :**
1. Aller sur `/admin/buteurs`
2. Sélectionner le match du jour
3. Cocher les joueurs susceptibles de marquer
4. Enregistrer la sélection

#### **Après un match :**
1. Aller sur `/admin/matches`
2. Cliquer sur le match terminé
3. Saisir les scores
4. Enregistrer → Points calculés automatiquement

#### **Après la phase de poules :**
```typescript
// Dans une route API ou script
import { generateRoundOf16Matches } from '@/lib/concours/knockout-generator';

await generateRoundOf16Matches();
```

#### **Vérifier les tickets gagnants :**
```typescript
// Après avoir identifié les buteurs du match
import { checkWinningTickets } from '@/lib/concours/ticket-generator';

const scorerIds = ["player_id_1", "player_id_2"];
await checkWinningTickets(matchId, scorerIds);
```

---

## 🔐 Sécurité

### **Authentification**
- Better Auth pour la gestion des sessions
- Cookie sécurisé : `better-auth.session_token`

### **Autorisation**
- Enum `UserRole` : `USER` | `ADMIN`
- Double vérification :
  1. Middleware vérifie session
  2. API routes vérifient rôle ADMIN

### **Protection des routes**
```typescript
// Toutes les routes /admin/* et /api/admin/*
// nécessitent authentification + rôle ADMIN
```

---

## 📊 Modèles de Données Principaux

### **Match**
```typescript
{
  matchNumber: number        // Numéro unique
  phase: MatchPhase          // GROUP_STAGE, ROUND_OF_16, etc.
  homeTeamId: string
  awayTeamId: string
  scheduledAt: DateTime
  venue: string              // Stade
  city: string               // Ville
  homeScore: number?
  awayScore: number?
  isFinished: boolean
  lockPronostics: boolean    // Verrouillage 1h avant
}
```

### **Pronostic**
```typescript
{
  userId: string
  matchId: string
  homeScore: number
  awayScore: number
  points: number             // 0, 3, ou 5
  isExactScore: boolean
  isCorrectWinner: boolean
}
```

### **ButeurTicket**
```typescript
{
  ticketCode: string         // BUT-XXXXXX
  userId: string?            // Peut être null (anonyme)
  matchId: string
  playerId: string           // Joueur attribué aléatoirement
  hasWon: boolean            // Si le joueur a marqué
  isChecked: boolean         // Si vérifié après match
  prizeType: string?         // SMOOTHIE, GAUFRE, BON_PARTENAIRE
  prizeValue: number?        // Valeur en MAD
  isRedeemed: boolean        // Si réclamé
  redeemedAt: DateTime?
}
```

### **Player**
```typescript
{
  name: string
  nameFr: string
  number: number             // Numéro de maillot
  position: string           // GOALKEEPER, DEFENDER, MIDFIELDER, FORWARD
  teamId: string
  goals: number              // Buts marqués dans la compétition
}
```

---

## 🎯 Points d'Extension Futurs

### **À améliorer**
1. **Table DailyScorersSelection** : Stocker persistance sélection buteurs
2. **Notifications** : Alertes temps réel pour nouveaux résultats
3. **Exports** : CSV des stats pour analyse
4. **Historique** : Log des actions admin
5. **QR Codes** : Génération automatique pour tickets
6. **Webhook Loyverse** : Intégration caisse
7. **Tests** : Tests unitaires et d'intégration

### **Nouvelles fonctionnalités**
- Dashboard utilisateur avec classement
- Page publique de leaderboard
- Système de badges et achievements
- Notifications push
- Partage sur réseaux sociaux

---

## 📞 Support

Pour toute question sur le système admin :
- Documentation technique : Ce fichier
- Documentation Prisma : `prisma/schema.prisma`
- Documentation API : Voir commentaires dans chaque route

---

## 🎉 Résumé

✅ **10/10 tâches complétées**
- Seeds complets (équipes, joueurs, matchs)
- Générateur de matchs éliminatoires
- Interface admin matchs
- Interface admin buteurs
- Calcul automatique points
- Génération tickets
- Middleware protection
- Dashboard admin
- API complètes
- Documentation

**Prêt pour la CAN 2025 ! 🏆⚽🇲🇦**
