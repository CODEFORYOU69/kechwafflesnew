# 🏆 Setup Concours CAN 2025 + Fidélité Kech Waffles

## 📋 Prérequis

- Node.js 18+
- pnpm (ou npm/yarn)
- Compte Supabase Pro
- Compte Google Cloud (pour OAuth)
- Compte Loyverse (optionnel)

## 🚀 Installation

### 1. Cloner le projet et installer les dépendances

```bash
cd kech-waffles-new
pnpm install
```

### 2. Configuration Supabase

#### a. Créer le projet Supabase
1. Allez sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Créez un nouveau projet (ou utilisez votre projet existant)
3. Notez les informations de connexion :
   - **Project URL** : `https://[PROJECT-REF].supabase.co`
   - **Anon Key** : Dans Settings → API
   - **Database Password** : Celui que vous avez défini

#### b. Récupérer les URLs de connexion
Dans **Settings → Database → Connection string** :

- **Connection pooling (pgBouncer)** : Pour `DATABASE_URL`
  ```
  postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
  ```

- **Direct connection** : Pour `DIRECT_URL`
  ```
  postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
  ```

### 3. Configuration Google OAuth

#### a. Créer les credentials OAuth
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet (ou sélectionnez un existant)
3. Activez **Google+ API** :
   - APIs & Services → Library → Rechercher "Google+ API" → Enable

4. Créez des credentials OAuth 2.0 :
   - APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
   - Type : **Web application**
   - Name : `Kech Waffles - Concours CAN`

   **Authorized JavaScript origins** :
   ```
   http://localhost:3000
   https://votre-domaine.com
   ```

   **Authorized redirect URIs** :
   ```
   http://localhost:3000/api/auth/callback/google
   https://votre-domaine.com/api/auth/callback/google
   ```

5. Copiez le **Client ID** et **Client Secret**

### 4. Configuration des variables d'environnement

Créez un fichier `.env` à la racine du projet :

```bash
cp .env.example .env
```

Remplissez avec vos valeurs :

```env
# Supabase
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

# Better Auth - Générez un secret aléatoire de 32+ caractères
BETTER_AUTH_SECRET="votre-secret-aleatoire-32-caracteres-minimum"
BETTER_AUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="123456789-abcdefgh.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abc123def456"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Générer un BETTER_AUTH_SECRET** :
```bash
openssl rand -base64 32
```

### 5. Initialiser la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Créer les tables
npx prisma db push

# (Optionnel) Seed les données de test
npx prisma db seed
```

### 6. Lancer le serveur de développement

```bash
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

## 📊 Structure de la Base de Données

### Tables Principales

#### **Authentification**
- `User` : Utilisateurs
- `Account` : Comptes (email/password + OAuth)
- `Session` : Sessions actives
- `VerificationToken` : Tokens de vérification email

#### **Fidélité**
- `MemberCard` : Cartes membres avec numéro unique (KW-XXXXXX)
- `LoyaltyTransaction` : Historique des transactions de points
- `LoyaltyReward` : Catalogue de récompenses

#### **Concours CAN**
- `Team` : Équipes participantes (24 équipes CAN 2025)
- `Match` : Matchs de la compétition
- `Pronostic` : Pronostics des utilisateurs par match
- `FinalPronostic` : Pronostic final (vainqueur + podium)
- `Reward` : Lots gagnés (café, gaufre, tirage)
- `Competition` : Configuration du concours

## 🎮 Tester l'Application

### 1. Créer un compte test

1. Allez sur `/concours/auth`
2. Inscrivez-vous avec email/mot de passe ou Google
3. Une carte membre est automatiquement créée

### 2. Voir votre carte membre

1. Allez sur `/loyalty/card` (à créer)
2. Vous verrez :
   - Numéro de carte (KW-XXXXXX)
   - QR code
   - Points de fidélité
   - Tier (Bronze/Silver/Gold/Platinum)

### 3. Faire un pronostic

1. Allez sur `/concours/pronostics`
2. Sélectionnez un match
3. Entrez votre pronostic de score
4. Validez (modifiable jusqu'à 1h avant le match)

## 🔧 Configuration Loyverse (Optionnel)

Voir le guide complet : [`docs/LOYVERSE_INTEGRATION.md`](./LOYVERSE_INTEGRATION.md)

### Quick Start

1. Obtenez votre token API :
   - [Loyverse BackOffice](https://backoffice.loyverse.com/) → Settings → API Access

2. Ajoutez dans `.env` :
```env
LOYVERSE_API_TOKEN="your-token"
LOYVERSE_STORE_ID="your-store-id"
```

3. Les cartes membres sont automatiquement créées dans Loyverse avec le numéro `KW-XXXXXX` comme `customer_code`

## 📱 Fonctionnalités

### ✅ Authentification
- [x] Inscription/Connexion email + password
- [x] Connexion Google OAuth
- [x] Session persistante (7 jours)
- [x] Protection des routes

### ✅ Fidélité
- [x] Génération automatique de carte membre (KW-XXXXXX)
- [x] QR code unique
- [x] Système de points (1 point = 10 MAD)
- [x] 4 tiers (Bronze → Platinum)
- [x] Avantages par tier
- [ ] Intégration Loyverse (optionnel)

### 🏗️ Concours CAN (À développer)
- [ ] Liste des matchs
- [ ] Faire des pronostics
- [ ] Pronostic final (vainqueur + podium)
- [ ] Calcul automatique des points
- [ ] Attribution des lots (café, gaufre)
- [ ] Classement en temps réel
- [ ] Tirage au sort grand prix

## 🎨 Pages à Créer

### Priorité 1 (MVP)
1. `/concours/auth` - Inscription/Connexion ✅
2. `/loyalty/card` - Carte membre digitale
3. `/concours/pronostics` - Liste des matchs + pronostics
4. `/concours/pronostics/[matchId]` - Formulaire pronostic
5. `/concours/pronostics/final` - Pronostic final + podium
6. `/concours/classement` - Classement général
7. `/concours/mes-pronostics` - Historique utilisateur
8. `/concours/mes-lots` - Lots gagnés

### Priorité 2 (Admin)
1. `/admin/matches` - Entrer les résultats
2. `/admin/rewards` - Valider les lots
3. `/admin/stats` - Statistiques

## 🐛 Troubleshooting

### Erreur : "Prisma Client is not configured"
```bash
npx prisma generate
```

### Erreur : "Table doesn't exist"
```bash
npx prisma db push
```

### Erreur Google OAuth : "redirect_uri_mismatch"
Vérifiez que l'URI de callback est correctement configurée dans Google Cloud Console :
```
http://localhost:3000/api/auth/callback/google
```

### Erreur Supabase : "Connection timeout"
Vérifiez que vous utilisez bien le **Connection pooling** URL dans `DATABASE_URL`

## 📚 Documentation

- [Better Auth Docs](https://www.better-auth.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Loyverse API](https://help.loyverse.com/help/loyverse-api)

## 🆘 Support

Pour toute question :
1. Vérifiez les logs : `pnpm dev`
2. Vérifiez Prisma Studio : `npx prisma studio`
3. Vérifiez les variables d'environnement : `.env`

## 🚀 Déploiement (Production)

### Vercel

1. Connectez votre repo GitHub
2. Configurez les variables d'environnement dans Vercel
3. Changez `BETTER_AUTH_URL` et `NEXT_PUBLIC_APP_URL` pour votre domaine
4. Ajoutez le domaine dans Google OAuth redirect URIs
5. Deploy !

**Important** : N'oubliez pas de mettre `requireEmailVerification: true` dans `lib/auth.ts` pour la production.
