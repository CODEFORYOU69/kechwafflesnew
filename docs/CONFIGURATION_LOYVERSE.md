# 🔌 Configuration Loyverse - Guide Complet

## 📋 Vue d'ensemble

Ce guide explique comment configurer l'intégration Loyverse pour synchroniser automatiquement les achats avec le système de fidélité Kech Waffles.

---

## 🎯 Objectifs de l'intégration

1. **Attribution automatique de points** : 1 point = 10 MAD dépensés
2. **Mise à jour tier fidélité** : Calcul automatique BRONZE → PLATINUM
3. **Synchronisation clients** : Création automatique dans Loyverse avec numéro carte
4. **Historique transactions** : Traçabilité complète achats → points

---

## 📦 Prérequis

Vous devez avoir obtenu de Loyverse :
- ✅ **Client ID** : Identifiant OAuth de votre application
- ✅ **Client Secret** : Clé secrète OAuth
- ✅ **API Token** (alternative) : Token d'accès direct sans OAuth
- ✅ **Store ID** : ID de votre magasin Loyverse

---

## 🔐 Méthode 1 : API Token (Recommandé pour démarrage rapide)

### Étape 1 : Obtenir l'API Token

1. Connectez-vous à [Loyverse BackOffice](https://r.loyverse.com/)
2. Allez dans **Settings → Integrations**
3. Cliquez sur **Create New Token**
4. Nommez le token : `Kech Waffles Integration`
5. Copiez le token (visible une seule fois !)

### Étape 2 : Obtenir votre Store ID

1. Dans Loyverse BackOffice, allez dans **Settings → Stores**
2. Cliquez sur votre magasin
3. Copiez l'ID dans l'URL : `https://r.loyverse.com/stores/{STORE_ID}/edit`

### Étape 3 : Configurer les variables d'environnement

Éditez votre fichier `.env` :

```env
# Loyverse API Configuration
LOYVERSE_API_TOKEN="votre_api_token_ici"
LOYVERSE_STORE_ID="votre_store_id_ici"

# Webhook Secret (générez une chaîne aléatoire)
LOYVERSE_WEBHOOK_SECRET="un_secret_aleatoire_32_caracteres_minimum"
```

**Générer un secret aléatoire** :
```bash
# Méthode 1 : OpenSSL
openssl rand -base64 32

# Méthode 2 : Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Étape 4 : Tester la connexion

Créez un fichier de test `test-loyverse.ts` :

```typescript
import { getLoyverseStore } from './lib/loyalty/loyverse';

async function testConnection() {
  try {
    const store = await getLoyverseStore();
    console.log('✅ Connexion réussie !');
    console.log('Store:', store.name);
    console.log('ID:', store.id);
  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
  }
}

testConnection();
```

Exécutez :
```bash
pnpm tsx test-loyverse.ts
```

---

## 🔐 Méthode 2 : OAuth (Production recommandée)

### Avantages OAuth
- ✅ Tokens révocables par l'utilisateur
- ✅ Refresh automatique
- ✅ Permissions granulaires
- ✅ Multi-stores supporté

### Étape 1 : Créer l'application OAuth

1. Allez sur [Loyverse Developer Portal](https://developer.loyverse.com/)
2. Créez une nouvelle application
3. Configurez les **Redirect URIs** :
   ```
   https://votre-domaine.com/api/loyverse/callback
   http://localhost:3000/api/loyverse/callback  (dev)
   ```
4. Copiez **Client ID** et **Client Secret**

### Étape 2 : Configurer les variables d'environnement

```env
# Loyverse OAuth Configuration
LOYVERSE_CLIENT_ID="votre_client_id"
LOYVERSE_CLIENT_SECRET="votre_client_secret"

# Alternative : API Token pour tests
# LOYVERSE_API_TOKEN="..."

LOYVERSE_STORE_ID="votre_store_id"
LOYVERSE_WEBHOOK_SECRET="votre_webhook_secret"

# URL de l'application
NEXT_PUBLIC_APP_URL="https://votre-domaine.com"
```

### Étape 3 : Flux de connexion OAuth

#### A. Interface Admin pour se connecter

Créez la page `/app/admin/loyverse/page.tsx` :

```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLoyversePage() {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    // Redirige vers OAuth
    window.location.href = "/api/loyverse/connect";
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Connexion Loyverse</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleConnect} disabled={loading}>
            {loading ? "Connexion..." : "Connecter Loyverse"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

#### B. L'utilisateur clique → Redirection OAuth

Route `/api/loyverse/connect/route.ts` (déjà implémentée) :
```typescript
// Construit l'URL d'autorisation Loyverse
const authUrl = `https://r.loyverse.com/oauth/authorize?` +
  `client_id=${CLIENT_ID}` +
  `&redirect_uri=${REDIRECT_URI}` +
  `&response_type=code` +
  `&scope=STORES_READ STORES_WRITE RECEIPTS_READ CUSTOMERS_READ CUSTOMERS_WRITE`;

// Redirige l'utilisateur
return NextResponse.redirect(authUrl);
```

#### C. Callback après autorisation

Route `/api/loyverse/callback/route.ts` (déjà implémentée) :
```typescript
// Échange le code contre un access token
const tokenResponse = await fetch('https://r.loyverse.com/oauth/token', {
  method: 'POST',
  body: JSON.stringify({
    grant_type: 'authorization_code',
    code: authCode,
    client_id: LOYVERSE_CLIENT_ID,
    client_secret: LOYVERSE_CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
  }),
});

const { access_token, refresh_token, expires_in } = await tokenResponse.json();

// Sauvegarde dans LoyverseConfig
await prisma.loyverseConfig.upsert({
  where: { id: 'singleton' },
  update: {
    accessToken: access_token,
    refreshToken: refresh_token,
    expiresAt: new Date(Date.now() + expires_in * 1000),
  },
  create: {
    id: 'singleton',
    accessToken: access_token,
    refreshToken: refresh_token,
    expiresAt: new Date(Date.now() + expires_in * 1000),
  },
});
```

### Étape 4 : Refresh Token Automatique

Ajoutez dans `lib/loyalty/loyverse.ts` :

```typescript
async function refreshAccessToken() {
  const config = await prisma.loyverseConfig.findUnique({
    where: { id: 'singleton' },
  });

  if (!config?.refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch('https://r.loyverse.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: config.refreshToken,
      client_id: process.env.LOYVERSE_CLIENT_ID,
      client_secret: process.env.LOYVERSE_CLIENT_SECRET,
    }),
  });

  const { access_token, refresh_token, expires_in } = await response.json();

  // Mise à jour DB
  await prisma.loyverseConfig.update({
    where: { id: 'singleton' },
    data: {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: new Date(Date.now() + expires_in * 1000),
    },
  });

  return access_token;
}

// Fonction helper avec auto-refresh
async function getValidAccessToken(): Promise<string> {
  const config = await prisma.loyverseConfig.findUnique({
    where: { id: 'singleton' },
  });

  if (!config) {
    throw new Error('Loyverse not connected');
  }

  // Token expiré ? Refresh
  if (config.expiresAt < new Date()) {
    console.log('Token expired, refreshing...');
    return await refreshAccessToken();
  }

  return config.accessToken;
}
```

---

## 🔔 Configuration des Webhooks

### Étape 1 : Exposer votre endpoint

Votre application doit être **accessible publiquement** pour recevoir les webhooks.

**Options** :

#### A. Production (Vercel)
```
https://votre-domaine.com/api/loyverse/webhook
```

#### B. Développement local (ngrok)
```bash
# Installer ngrok
brew install ngrok  # macOS
# ou télécharger sur ngrok.com

# Exposer le port 3000
ngrok http 3000

# Copier l'URL publique
# https://abc123.ngrok.io/api/loyverse/webhook
```

### Étape 2 : Configurer dans Loyverse BackOffice

1. Allez dans **Settings → Integrations → Webhooks**
2. Cliquez sur **Create Webhook**
3. Configurez :

**URL** :
```
https://votre-domaine.com/api/loyverse/webhook
```

**Events** (cochez) :
- ✅ `receipt.created` : Nouveau ticket de caisse
- ✅ `receipt.deleted` : Ticket annulé/remboursé

**Secret** :
```
Votre LOYVERSE_WEBHOOK_SECRET (même que .env)
```

4. Cliquez sur **Save**

### Étape 3 : Méthode Automatique (Setup Webhook via API)

Utilisez la route `/api/loyverse/setup-webhook/route.ts` (déjà implémentée) :

```bash
# Via curl
curl -X POST https://votre-domaine.com/api/loyverse/setup-webhook \
  -H "Authorization: Bearer YOUR_ADMIN_SESSION_TOKEN"

# Via interface admin (à créer)
# Bouton "Setup Webhook" dans /admin/loyverse
```

Code de la route :
```typescript
const response = await fetch('https://api.loyverse.com/v1.0/webhooks', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: `${process.env.NEXT_PUBLIC_APP_URL}/api/loyverse/webhook`,
    events: ['receipt.created', 'receipt.deleted'],
    secret: process.env.LOYVERSE_WEBHOOK_SECRET,
  }),
});
```

### Étape 4 : Tester le Webhook

#### A. Test avec payload factice

Créez `test-webhook.ts` :

```typescript
import crypto from 'crypto';

const payload = {
  event_type: 'receipt.created',
  receipt_id: 'test-receipt-123',
  store_id: 'votre-store-id',
  total_money: 150.00,
  customer: {
    id: 'customer-123',
    customer_code: 'KW-ABC123',
  },
};

const secret = process.env.LOYVERSE_WEBHOOK_SECRET!;
const signature = crypto
  .createHmac('sha256', secret)
  .update(JSON.stringify(payload))
  .digest('hex');

fetch('http://localhost:3000/api/loyverse/webhook', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Loyverse-Signature': signature,
  },
  body: JSON.stringify(payload),
})
  .then(res => res.json())
  .then(data => console.log('✅ Webhook test:', data))
  .catch(err => console.error('❌ Erreur:', err));
```

Exécutez :
```bash
pnpm tsx test-webhook.ts
```

#### B. Test avec achat réel

1. Faites un achat test dans Loyverse POS
2. Associez le client avec son numéro carte (KW-XXXXXX)
3. Vérifiez les logs du webhook :

```bash
# Dans Vercel (production)
vercel logs

# En local (terminal)
# Les logs apparaissent dans la console du serveur Next.js
```

4. Vérifiez dans la base de données :

```sql
-- Points ajoutés ?
SELECT * FROM "LoyaltyTransaction" WHERE "userId" = 'user_id';

-- Tier mis à jour ?
SELECT * FROM "MemberCard" WHERE "cardNumber" = 'KW-ABC123';
```

---

## 🔄 Flux Complet : Achat → Points

### 1. Client achète un menu (150 MAD)

**Loyverse POS** :
- Caissier scanne le QR code carte fidélité (KW-ABC123)
- Enregistre la vente
- Total : 150 MAD

### 2. Webhook envoyé

Loyverse envoie à `https://votre-domaine.com/api/loyverse/webhook` :

```json
{
  "event_type": "receipt.created",
  "receipt": {
    "id": "receipt-456",
    "store_id": "store-123",
    "total_money": 150.00,
    "customer": {
      "id": "loyverse-customer-789",
      "customer_code": "KW-ABC123"
    }
  }
}
```

### 3. Vérification signature

```typescript
const signature = request.headers.get('X-Loyverse-Signature');
const body = await request.text();

const expectedSignature = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(body)
  .digest('hex');

if (signature !== expectedSignature) {
  return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
}
```

### 4. Traitement webhook

```typescript
// Parse event
const event = JSON.parse(body);

if (event.event_type === 'receipt.created') {
  const receipt = event.receipt;
  const customerCode = receipt.customer?.customer_code;

  // Trouver le client par numéro carte
  const memberCard = await prisma.memberCard.findUnique({
    where: { cardNumber: customerCode },
    include: { user: true },
  });

  if (memberCard) {
    // Calculer points : 1 point = 10 MAD
    const amount = receipt.total_money;
    const points = Math.floor(amount / 10);

    // Ajouter transaction
    await prisma.loyaltyTransaction.create({
      data: {
        userId: memberCard.userId,
        type: 'PURCHASE',
        points: points,
        amount: amount,
        description: `Achat en magasin - ${amount} MAD`,
        orderId: receipt.id,
      },
    });

    // Mettre à jour carte
    await prisma.memberCard.update({
      where: { id: memberCard.id },
      data: {
        totalPoints: { increment: points },
        currentPoints: { increment: points },
        totalSpent: { increment: amount },
        visitCount: { increment: 1 },
      },
    });

    // Calculer nouveau tier
    const newTotalSpent = memberCard.totalSpent + amount;
    const newTier =
      newTotalSpent >= 2000 ? 'PLATINUM' :
      newTotalSpent >= 1000 ? 'GOLD' :
      newTotalSpent >= 500 ? 'SILVER' : 'BRONZE';

    if (newTier !== memberCard.tier) {
      await prisma.memberCard.update({
        where: { id: memberCard.id },
        data: { tier: newTier },
      });
      console.log(`🎉 ${customerCode} upgraded to ${newTier}!`);
    }
  }
}
```

### 5. Résultat

✅ Client gagne **15 points** (150 MAD / 10)
✅ Total dépensé mis à jour
✅ Tier recalculé automatiquement
✅ Transaction enregistrée dans l'historique

---

## 🧪 Tests et Validation

### Checklist Tests

- [ ] **Connexion API** : `getLoyverseStore()` retourne le magasin
- [ ] **Création client** : `createLoyverseCustomer()` crée un client avec customer_code = numéro carte
- [ ] **Webhook signature** : Test avec signature valide → 200 OK
- [ ] **Webhook signature invalide** : Test avec mauvaise signature → 401 Unauthorized
- [ ] **Attribution points** : Achat 100 MAD → +10 points
- [ ] **Mise à jour tier** : Client passe de 450 MAD à 550 MAD → Upgrade BRONZE → SILVER
- [ ] **Annulation** : `receipt.deleted` → Points retirés

### Script de Test Complet

Créez `test-integration-complete.ts` :

```typescript
import { prisma } from './lib/prisma';
import { createLoyverseCustomer, syncCustomerToLoyverse } from './lib/loyalty/loyverse';

async function testIntegrationComplete() {
  console.log('🧪 Test intégration Loyverse complète\n');

  // 1. Créer un utilisateur test
  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@example.com',
      emailVerified: true,
    },
  });
  console.log('✅ User créé:', user.id);

  // 2. Créer une carte fidélité
  const cardNumber = `KW-TEST${Date.now()}`;
  const memberCard = await prisma.memberCard.create({
    data: {
      userId: user.id,
      cardNumber,
      qrCode: 'test-qr',
      totalPoints: 0,
      currentPoints: 0,
      tier: 'BRONZE',
    },
  });
  console.log('✅ Carte créée:', cardNumber);

  // 3. Synchroniser avec Loyverse
  try {
    const loyverseCustomer = await syncCustomerToLoyverse(memberCard.id);
    console.log('✅ Client Loyverse créé:', loyverseCustomer.id);
  } catch (error) {
    console.error('❌ Erreur sync Loyverse:', error);
  }

  // 4. Simuler webhook achat
  const mockWebhook = {
    event_type: 'receipt.created',
    receipt: {
      id: 'test-receipt-' + Date.now(),
      store_id: process.env.LOYVERSE_STORE_ID,
      total_money: 150.00,
      customer: {
        customer_code: cardNumber,
      },
    },
  };

  // Appeler handleWebhook (extrait de /api/loyverse/webhook/route.ts)
  // ... logique de traitement ...

  console.log('\n✅ Test complet terminé !');
  console.log('Vérifiez dans Prisma Studio les changements.');
}

testIntegrationComplete().catch(console.error);
```

---

## 🚨 Troubleshooting

### Problème : Webhook non reçu

**Causes possibles** :
1. URL webhook incorrecte dans Loyverse
2. Application non accessible publiquement
3. Firewall bloque Loyverse

**Solutions** :
```bash
# Vérifier l'URL est accessible
curl https://votre-domaine.com/api/loyverse/webhook

# Tester avec ngrok en local
ngrok http 3000
# Mettre à jour l'URL dans Loyverse avec l'URL ngrok
```

### Problème : Signature invalide

**Causes** :
- `LOYVERSE_WEBHOOK_SECRET` différent entre .env et Loyverse
- Body modifié avant vérification (parsing JSON)

**Solution** :
```typescript
// TOUJOURS vérifier signature AVANT de parser JSON
const body = await request.text();  // Raw text
const signature = request.headers.get('X-Loyverse-Signature');

// Vérifier signature
const isValid = verifySignature(body, signature, WEBHOOK_SECRET);

// Puis parser JSON
const event = JSON.parse(body);
```

### Problème : Client non trouvé

**Causes** :
- Numéro carte mal scanné dans POS
- Carte non créée dans notre système
- Champ `customer_code` vide dans Loyverse

**Solution** :
```typescript
// Ajouter logs détaillés
console.log('Customer code reçu:', receipt.customer?.customer_code);

const memberCard = await prisma.memberCard.findUnique({
  where: { cardNumber: receipt.customer?.customer_code },
});

if (!memberCard) {
  console.error('Carte non trouvée:', receipt.customer?.customer_code);
  // Créer automatiquement ? Ou ignorer ?
}
```

### Problème : Token expiré (OAuth)

**Erreur** : `401 Unauthorized` lors des appels API

**Solution** : Implémenter refresh automatique (voir Méthode 2, Étape 4)

---

## 📊 Monitoring

### Logs à surveiller

**En production (Vercel)** :
```bash
vercel logs --follow
```

**Logs importants** :
- ✅ `Webhook received: receipt.created`
- ✅ `Points added: +15 for user_id`
- ✅ `Tier upgraded: BRONZE → SILVER`
- ❌ `Invalid signature`
- ❌ `Customer not found: KW-ABC123`

### Dashboard Loyverse

Vérifiez régulièrement :
1. **Webhooks → Delivery History**
   - Statut des webhooks (200 OK vs erreurs)
   - Payload envoyés
2. **Customers**
   - Vérifier `customer_code` est bien renseigné
3. **Receipts**
   - Vérifier association client correct

---

## 🎯 Checklist Finale Configuration

### Variables d'Environnement

```env
# ✅ Méthode API Token (Simple)
LOYVERSE_API_TOKEN="..."
LOYVERSE_STORE_ID="..."
LOYVERSE_WEBHOOK_SECRET="..."

# OU

# ✅ Méthode OAuth (Production)
LOYVERSE_CLIENT_ID="..."
LOYVERSE_CLIENT_SECRET="..."
LOYVERSE_STORE_ID="..."
LOYVERSE_WEBHOOK_SECRET="..."
NEXT_PUBLIC_APP_URL="https://votre-domaine.com"
```

### Webhooks Loyverse

- [ ] URL webhook configurée : `https://votre-domaine.com/api/loyverse/webhook`
- [ ] Events `receipt.created` et `receipt.deleted` activés
- [ ] Secret configuré (même que .env)
- [ ] Test envoi réussi (200 OK)

### Tests

- [ ] Connexion API testée (`getLoyverseStore()`)
- [ ] Création client testée
- [ ] Webhook test avec signature valide
- [ ] Achat test → Points ajoutés
- [ ] Tier upgrade testé (passage seuil)
- [ ] Remboursement testé (points retirés)

### Production

- [ ] Application déployée publiquement (Vercel)
- [ ] HTTPS activé
- [ ] Webhook URL mise à jour avec domaine prod
- [ ] Logs monitoring activés
- [ ] Tests avec vraie caisse Loyverse

---

## 📞 Support

### Documentation Loyverse

- **API Docs** : https://developer.loyverse.com/docs
- **Webhook Guide** : https://developer.loyverse.com/docs/webhooks
- **Support** : support@loyverse.com

### Debug

Si problème persistant, fournir :
1. Logs complets (webhook reçu, erreur)
2. Payload webhook (anonymisé)
3. Configuration webhook dans Loyverse (screenshot)
4. Version de votre application

---

**Date de rédaction** : 14 Octobre 2025
**Version** : 1.0
**Auteur** : Documentation Kech Waffles

✅ Configuration terminée ? Passez aux tests !
