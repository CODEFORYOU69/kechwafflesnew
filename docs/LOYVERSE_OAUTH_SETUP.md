# 🔐 Configuration OAuth Loyverse

## 📋 Étapes de Configuration

### 1. Créer une Application Loyverse

1. Allez sur [Loyverse Developer Portal](https://developer.loyverse.com/)
2. Connectez-vous avec votre compte Loyverse
3. Créez une nouvelle application
4. Remplissez les informations :
   - **Nom** : Kech Waffles App
   - **Description** : Application pour gérer le menu et la fidélité
   - **Redirect URI** : Voir section ci-dessous

### 2. URLs de Callback (Redirect URI)

#### 🏠 En Développement Local
```
http://localhost:3000/api/loyverse/callback
```

#### 🌐 En Production (Vercel)
```
https://votre-domaine.vercel.app/api/loyverse/callback
```

**Important** : Ajoutez les DEUX URLs dans le dashboard Loyverse si vous voulez tester en local ET en production.

### 3. Récupérer vos Credentials

Après la création de l'application, récupérez :
- **Client ID** : `abc123...`
- **Client Secret** : `xyz789...`

### 4. Configuration .env

Mettez à jour votre fichier `.env` :

```bash
# Loyverse API OAuth
LOYVERSE_CLIENT_ID="votre-client-id"
LOYVERSE_CLIENT_SECRET="votre-client-secret"
LOYVERSE_STORE_ID="votre-store-id"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"  # ou votre URL de production
```

### 5. Tester la Connexion

1. Démarrez votre serveur :
   ```bash
   pnpm dev
   ```

2. Visitez : `http://localhost:3000/api/loyverse/connect`

3. Vous serez redirigé vers Loyverse pour autoriser l'accès

4. Après autorisation, vous serez redirigé vers `/admin?loyverse=connected`

## 🔄 Flux OAuth

```
1. User clique sur "Connecter Loyverse"
   ↓
2. Redirection vers /api/loyverse/connect
   ↓
3. Redirection vers api.loyverse.com/oauth/authorize
   ↓
4. User autorise l'application
   ↓
5. Loyverse redirige vers /api/loyverse/callback?code=...
   ↓
6. Échange du code contre un access_token
   ↓
7. Stockage du token (TODO: en base de données)
   ↓
8. Redirection vers /admin?loyverse=connected
```

## 🔧 Routes API Créées

### `/api/loyverse/connect` (GET)
Initie le flux OAuth en redirigeant vers Loyverse.

### `/api/loyverse/callback` (GET)
Reçoit le code d'autorisation et l'échange contre un access token.

**Query params:**
- `code` : Code d'autorisation (si succès)
- `error` : Message d'erreur (si refus)

## 🎯 Scopes Demandés

Les scopes configurés actuellement :
- `read:items` - Lire les produits
- `read:receipts` - Lire les reçus/commandes
- `read:customers` - Lire les clients

**Ajustez les scopes selon vos besoins** dans `/api/loyverse/connect/route.ts`.

Scopes disponibles :
- `read:items`, `write:items`
- `read:receipts`, `write:receipts`
- `read:customers`, `write:customers`
- `read:employees`, `write:employees`
- `read:categories`, `write:categories`

## 💾 TODO : Stockage du Token

Actuellement, le token est juste loggé. Vous devez :

1. **Créer une table en base de données** :
```prisma
model LoyverseConfig {
  id           String   @id @default(cuid())
  accessToken  String
  refreshToken String?
  expiresAt    DateTime
  storeId      String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

2. **Sauvegarder le token** dans `/api/loyverse/callback/route.ts` :
```typescript
await prisma.loyverseConfig.upsert({
  where: { id: "singleton" },
  create: {
    id: "singleton",
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
    storeId: process.env.LOYVERSE_STORE_ID!,
  },
  update: {
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
  },
});
```

3. **Créer une fonction helper** pour récupérer le token :
```typescript
export async function getLoyverseToken() {
  const config = await prisma.loyverseConfig.findUnique({
    where: { id: "singleton" },
  });

  if (!config) {
    throw new Error("Loyverse not connected");
  }

  // TODO: Vérifier si le token est expiré et le rafraîchir si nécessaire

  return config.accessToken;
}
```

## 🔒 Sécurité

- ✅ Le `client_secret` ne doit **jamais** être exposé au client
- ✅ Utilisez HTTPS en production
- ✅ Stockez les tokens de manière sécurisée en base de données
- ✅ Implémentez le refresh token pour renouveler l'accès automatiquement

## 📚 Documentation Officielle

- [Loyverse OAuth Documentation](https://developer.loyverse.com/docs/)
- [API Reference](https://developer.loyverse.com/api/)
