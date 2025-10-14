# Intégration Loyverse - Documentation Complète

Cette documentation explique l'intégration complète entre Kech Waffles et Loyverse POS pour le système de fidélité.

## 📖 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Configuration initiale](#configuration-initiale)
4. [Flux de synchronisation](#flux-de-synchronisation)
5. [API Endpoints](#api-endpoints)
6. [Base de données](#base-de-données)
7. [Déploiement](#déploiement)
8. [Tests](#tests)
9. [Dépannage](#dépannage)

## 🎯 Vue d'ensemble

### Objectif

Synchroniser automatiquement les achats effectués en magasin (via Loyverse POS) avec le système de fidélité en ligne de Kech Waffles.

### Fonctionnalités

✅ **Authentification OAuth 2.0** avec Loyverse
✅ **Création automatique de clients** dans Loyverse lors de l'inscription
✅ **Synchronisation bidirectionnelle** des données de fidélité
✅ **Webhooks en temps réel** pour les nouveaux achats
✅ **Calcul automatique des points** (1 point = 10 MAD)
✅ **Gestion automatique des tiers** (Bronze → Silver → Gold → Platinum)
✅ **Validation des signatures** pour la sécurité des webhooks

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         LOYVERSE POS                            │
│  (Magasin physique - Caisse enregistreuse)                     │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ OAuth 2.0
                     │ Webhooks
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      LOYVERSE API                               │
│  • Gestion des clients                                          │
│  • Enregistrement des ventes (receipts)                         │
│  • Envoi de webhooks                                            │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ HTTPS
                     │ JSON
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                   KECH WAFFLES API                              │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  /api/loyverse/connect       → Initie OAuth             │ │
│  │  /api/loyverse/callback      → Stocke token OAuth       │ │
│  │  /api/loyverse/setup-webhook → Enregistre webhooks      │ │
│  │  /api/loyverse/webhook       → Reçoit événements        │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  lib/loyalty/loyverse.ts     → Client API Loyverse      │ │
│  │  lib/loyalty/member-card.ts  → Gestion cartes membres   │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ Prisma ORM
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL (Supabase)                        │
│                                                                 │
│  • User                    → Utilisateurs                       │
│  • MemberCard              → Cartes de fidélité                 │
│  • LoyaltyTransaction      → Historique des points             │
│  • LoyverseConfig          → Configuration OAuth               │
└─────────────────────────────────────────────────────────────────┘
```

## ⚙️ Configuration Initiale

### 1. Créer une Application OAuth Loyverse

1. Aller sur [Loyverse Developer Portal](https://developer.loyverse.com/)
2. Créer une nouvelle application OAuth
3. Configurer le **Redirect URI**: `https://kechwaffles.com/api/loyverse/callback`
4. Noter le **Client ID** et **Client Secret**

### 2. Variables d'Environnement

Ajouter dans `.env` et dans les variables d'environnement Vercel:

```bash
# OAuth Loyverse
LOYVERSE_CLIENT_ID="JBiSwItgivbz5MNbM65K"
LOYVERSE_CLIENT_SECRET="IBfRrgZoKj3aZFqMnD8v0YYJfOm2v7t6mB80u7-oImonDxJ9u6nRqw=="

# URL de l'application (production)
NEXT_PUBLIC_BASE_URL="https://kechwaffles.com"

# Secret webhook (optionnel mais recommandé)
LOYVERSE_WEBHOOK_SECRET="kFO4qO+jAbQ6ujZ6YSYcrwLnDjg0U3reCL9fZ1f7nrw="
```

### 3. Migration de la Base de Données

```bash
# Appliquer les migrations Prisma
npx prisma migrate deploy

# Vérifier que la table LoyverseConfig existe
npx prisma studio
```

### 4. Connexion OAuth (Une seule fois)

Visiter (en tant qu'admin):

```
https://kechwaffles.com/api/loyverse/connect
```

Cela va:
1. Rediriger vers Loyverse pour autoriser l'application
2. Récupérer le token OAuth
3. Le stocker en base de données
4. Récupérer automatiquement le Store ID

### 5. Enregistrement des Webhooks (Une seule fois)

Envoyer une requête POST:

```bash
curl -X POST https://kechwaffles.com/api/loyverse/setup-webhook
```

Ou créer un bouton admin dans l'interface pour appeler cet endpoint.

## 🔄 Flux de Synchronisation

### Flux 1: Création d'un Nouvel Utilisateur

```
1. Utilisateur s'inscrit sur kechwaffles.com
   └─> User créé dans PostgreSQL

2. Utilisateur demande une carte de fidélité
   └─> createMemberCard(userId) appelé

3. Génération de la carte
   ├─> Numéro unique: KW-ABC123
   ├─> QR Code généré
   └─> Client créé dans Loyverse
       ├─> customer_code = KW-ABC123
       ├─> name = nom utilisateur
       └─> email = email utilisateur

4. Carte membre créée
   └─> loyverseCustomerId stocké dans MemberCard
```

### Flux 2: Achat en Magasin (POS)

```
1. Client présente sa carte (KW-ABC123) à la caisse

2. Caissier scanne/entre le numéro de carte
   └─> Loyverse trouve le client via customer_code

3. Caissier enregistre la vente dans Loyverse POS
   └─> Receipt créé avec customer_id

4. Loyverse envoie un webhook
   └─> POST https://kechwaffles.com/api/loyverse/webhook
       {
         "event_type": "receipt.created",
         "data": {
           "id": "receipt_xyz",
           "customer_id": "loyverse_customer_id",
           "total_money": "150.00"
         }
       }

5. Webhook traité par Kech Waffles
   ├─> Trouve MemberCard via loyverseCustomerId
   ├─> Calcule points: 150 MAD → 15 points
   ├─> Crée LoyaltyTransaction
   ├─> Met à jour MemberCard
   │   ├─> totalPoints += 15
   │   ├─> currentPoints += 15
   │   ├─> totalSpent += 150
   │   ├─> visitCount += 1
   │   └─> tier recalculé (si nécessaire)
   └─> Renvoie 200 OK à Loyverse

6. Utilisateur voit ses points à jour sur kechwaffles.com
```

### Flux 3: Achat en Ligne

```
1. Client commande sur kechwaffles.com

2. Paiement validé
   └─> addLoyaltyPoints(userId, amount) appelé

3. Points ajoutés en local
   ├─> LoyaltyTransaction créée
   ├─> MemberCard mis à jour
   └─> Tier recalculé

4. Synchronisation avec Loyverse
   └─> syncCustomerToLoyverse(loyverseCustomerId, {
         totalPoints,
         visitCount,
         totalSpent
       })

5. Client Loyverse mis à jour
   └─> Les totaux sont synchronisés
```

## 🛠️ API Endpoints

### `GET /api/loyverse/connect`

**Description:** Initie le flux OAuth 2.0 avec Loyverse.

**Usage:**
```bash
# Ouvrir dans le navigateur (admin seulement)
https://kechwaffles.com/api/loyverse/connect
```

**Flux:**
1. Redirige vers Loyverse pour autorisation
2. Utilisateur accepte
3. Redirige vers `/api/loyverse/callback` avec le code

---

### `GET /api/loyverse/callback`

**Description:** Reçoit le code OAuth et l'échange contre un token.

**Paramètres:**
- `code` (query): Code d'autorisation
- `error` (query, optionnel): Si l'utilisateur refuse

**Actions:**
1. Échange le code contre un access_token
2. Stocke le token dans `LoyverseConfig`
3. Récupère le Store ID
4. Redirige vers `/admin?loyverse=connected`

---

### `POST /api/loyverse/setup-webhook`

**Description:** Enregistre les webhooks auprès de Loyverse.

**Body:** Aucun

**Réponse:**
```json
{
  "success": true,
  "message": "Webhooks Loyverse configurés avec succès",
  "webhooks": {
    "receipt_created": { "id": "webhook_1", ... },
    "receipt_updated": { "id": "webhook_2", ... }
  },
  "webhook_url": "https://kechwaffles.com/api/loyverse/webhook"
}
```

---

### `GET /api/loyverse/setup-webhook`

**Description:** Liste les webhooks enregistrés.

**Réponse:**
```json
{
  "success": true,
  "webhooks": [
    {
      "id": "webhook_abc",
      "event_type": "receipt.created",
      "target_url": "https://kechwaffles.com/api/loyverse/webhook"
    }
  ]
}
```

---

### `POST /api/loyverse/webhook`

**Description:** Reçoit les événements webhook de Loyverse.

**Headers:**
- `X-Loyverse-Webhook-Signature`: Signature HMAC SHA-256 du body

**Body:**
```json
{
  "event_type": "receipt.created",
  "data": {
    "id": "receipt_123",
    "receipt_number": "000456",
    "customer_id": "loyverse_customer_xyz",
    "total_money": "250.00",
    "receipt_date": "2025-01-15T14:30:00Z",
    "line_items": [...]
  }
}
```

**Traitement:**
1. Valide la signature webhook
2. Vérifie l'event_type
3. Trouve la carte membre via `loyverseCustomerId`
4. Vérifie que la transaction n'est pas déjà enregistrée
5. Calcule les points
6. Crée `LoyaltyTransaction`
7. Met à jour `MemberCard` (points, tier, etc.)
8. Renvoie `200 OK`

## 💾 Base de Données

### Table `LoyverseConfig`

Stocke la configuration OAuth (singleton).

```prisma
model LoyverseConfig {
  id           String   @id @default("singleton")
  accessToken  String
  refreshToken String?
  expiresAt    DateTime
  storeId      String?

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### Table `MemberCard`

Lien entre utilisateurs et clients Loyverse.

```prisma
model MemberCard {
  id                 String    @id @default(cuid())
  userId             String    @unique
  cardNumber         String    @unique // KW-ABC123
  qrCode             String    @unique

  // Fidélité
  totalPoints        Int       @default(0)
  currentPoints      Int       @default(0)
  totalSpent         Float     @default(0)
  visitCount         Int       @default(0)
  tier               MemberTier @default(BRONZE)

  // Lien Loyverse
  loyverseCustomerId String?   @unique
  lastSyncAt         DateTime?

  user               User      @relation(...)
}
```

### Table `LoyaltyTransaction`

Historique des points.

```prisma
model LoyaltyTransaction {
  id          String   @id @default(cuid())
  userId      String
  type        LoyaltyTransactionType
  points      Int
  amount      Float?
  description String
  orderId     String?  // Receipt ID Loyverse

  createdAt   DateTime @default(now())

  user        User     @relation(...)
}
```

## 🚀 Déploiement

### Étapes de Déploiement

1. **Pousser le code sur GitHub**
   ```bash
   git add .
   git commit -m "feat(loyalty): integrate Loyverse with loyalty system"
   git push origin main
   ```

2. **Configurer les variables d'environnement sur Vercel**
   - Aller dans Settings → Environment Variables
   - Ajouter toutes les variables `.env` (sauf DATABASE_URL qui existe déjà)

3. **Migrer la base de données**
   ```bash
   npx prisma migrate deploy
   ```

4. **Tester la connexion OAuth**
   - Visiter `https://kechwaffles.com/api/loyverse/connect`
   - Vérifier que le token est stocké en BDD

5. **Enregistrer les webhooks**
   ```bash
   curl -X POST https://kechwaffles.com/api/loyverse/setup-webhook
   ```

6. **Test en production**
   - Créer un utilisateur test
   - Faire une vente test dans Loyverse
   - Vérifier que les points sont ajoutés

## 🧪 Tests

### Test de Création de Carte Membre

```typescript
// Test que la carte crée bien un client Loyverse
const card = await createMemberCard(userId);
expect(card.loyverseCustomerId).toBeDefined();
```

### Test du Webhook

```bash
# Test avec cURL
curl -X POST https://kechwaffles.com/api/loyverse/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "receipt.created",
    "data": {
      "id": "test_receipt",
      "customer_id": "loyverse_customer_id",
      "total_money": "100.00"
    }
  }'
```

### Test de Synchronisation

```typescript
// Test que les points se synchronisent vers Loyverse
await addLoyaltyPoints(userId, 250);
const loyverseCustomer = await getLoyverseCustomer(loyverseCustomerId);
expect(loyverseCustomer.total_points).toBe(25); // 250/10
```

## 🚨 Dépannage

Voir [LOYVERSE_WEBHOOK_SETUP.md](./LOYVERSE_WEBHOOK_SETUP.md#-dépannage) pour le dépannage détaillé.

## 📚 Documentation Complémentaire

- [Configuration OAuth](./LOYVERSE_OAUTH_SETUP.md)
- [Configuration Webhooks](./LOYVERSE_WEBHOOK_SETUP.md)
- [API Loyverse](https://developer.loyverse.com/docs/)

## ✅ Checklist de Production

- [ ] OAuth connecté
- [ ] Token stocké en BDD
- [ ] Webhooks enregistrés
- [ ] Variables d'environnement configurées sur Vercel
- [ ] Secret webhook généré et configuré
- [ ] Test de création de carte membre OK
- [ ] Test de webhook OK
- [ ] Test de synchronisation OK
- [ ] Monitoring des logs activé
- [ ] Documentation partagée avec l'équipe

---

**Dernière mise à jour:** 15 janvier 2025
**Version:** 1.0
