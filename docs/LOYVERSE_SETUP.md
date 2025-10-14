# Configuration Loyverse - Guide Rapide

## 🚀 Interface Admin Disponible

Vous disposez maintenant d'une interface visuelle pour gérer la connexion Loyverse :

```
https://votre-domaine.com/admin/loyverse
```

Cette interface vous permet de :
- ✅ Voir le statut de la connexion en temps réel
- ✅ Se connecter à Loyverse en un clic
- ✅ Configurer les webhooks automatiquement
- ✅ Vérifier l'expiration du token
- ✅ Voir le Store ID connecté

---

## 📋 Étapes de Configuration

### 1️⃣ Créer une Application OAuth sur Loyverse

1. **Aller sur** : https://developer.loyverse.com/
2. **Créer une nouvelle application** :
   - Name : `Kech Waffles CAN 2025`
   - Description : `Système de fidélité et concours CAN 2025`

3. **Configurer la Redirect URI** :
   ```
   https://votre-domaine.com/api/loyverse/callback
   ```

4. **Scopes requis** :
   - `read:items` - Lire les produits
   - `read:receipts` - Lire les reçus
   - `read:customers` - Lire les clients

5. **Récupérer les credentials** :
   - Client ID
   - Client Secret

---

### 2️⃣ Configurer les Variables d'Environnement

Dans **Vercel** (ou votre `.env` local) :

```env
# Loyverse OAuth
LOYVERSE_CLIENT_ID="votre-client-id-ici"
LOYVERSE_CLIENT_SECRET="votre-client-secret-ici"

# Base URL (production)
NEXT_PUBLIC_BASE_URL="https://votre-domaine.com"
```

---

### 3️⃣ Première Connexion (Une seule fois)

Après déploiement, **vous** (en tant qu'admin) :

1. **Se connecter en admin** :
   ```
   https://votre-domaine.com/concours/auth
   ```
   Utilisez votre email : `y.ouasmi@gmail.com`

2. **Aller sur la page Loyverse** :
   ```
   https://votre-domaine.com/admin/loyverse
   ```

3. **Cliquer sur "Connecter à Loyverse"** :
   - Vous serez redirigé vers Loyverse
   - Autorisez l'application
   - Vous serez automatiquement redirigé vers le dashboard
   - ✅ Le token sera sauvegardé en base de données

4. **Configurer les webhooks** :
   - Cliquer sur "Configurer les webhooks"
   - ✅ 3 webhooks seront créés automatiquement :
     - `receipt.created` - Nouvel achat
     - `receipt.updated` - Achat modifié
     - `receipt.deleted` - Achat annulé

---

## 🔄 Flux Automatique

Une fois configuré, voici ce qui se passe automatiquement :

### Lors d'un achat en caisse :

```
1. Client achète en caisse Loyverse
         ↓
2. Loyverse envoie webhook → /api/loyverse/webhook
         ↓
3. Système vérifie la signature HMAC
         ↓
4. Transaction enregistrée en DB
         ↓
5. Points de fidélité attribués
         ↓
6. Si menu acheté → Ticket buteur créé automatiquement
```

---

## 🔐 Sécurité

### Vérification des Webhooks

Les webhooks Loyverse utilisent la signature HMAC SHA256 pour garantir l'authenticité :

```typescript
// Déjà implémenté dans /api/loyverse/webhook/route.ts
const signature = crypto
  .createHmac("sha256", process.env.LOYVERSE_WEBHOOK_SECRET!)
  .update(body)
  .digest("hex");

if (signature !== receivedSignature) {
  // Webhook rejeté
}
```

### Variables de Sécurité

```env
# Générer un secret aléatoire de 32 caractères
LOYVERSE_WEBHOOK_SECRET="votre-secret-webhook-32-chars"
```

---

## 📊 Endpoints API Créés

### Admin (Authentification requise)

```
GET  /api/loyverse/status          # Statut connexion
GET  /api/loyverse/connect         # Initier OAuth
GET  /api/loyverse/callback        # OAuth callback
POST /api/loyverse/setup-webhook   # Configurer webhooks
GET  /api/loyverse/setup-webhook   # Lister webhooks
```

### Webhooks (Appelés par Loyverse)

```
POST /api/loyverse/webhook         # Recevoir les événements
```

---

## 🧪 Tests en Local

### 1. Installer ngrok

```bash
npm install -g ngrok
```

### 2. Démarrer le serveur local

```bash
pnpm dev
```

### 3. Exposer le port 3000

```bash
ngrok http 3000
```

### 4. Utiliser l'URL ngrok

```
https://xxxxx.ngrok.io/api/loyverse/callback
```

Mettre cette URL dans :
- Loyverse Developer Console (Redirect URI)
- Variable `NEXT_PUBLIC_BASE_URL`

---

## ❓ Troubleshooting

### Token expiré ?

Le token OAuth expire après un certain temps. Si le statut affiche "Non connecté" :
1. Retournez sur `/admin/loyverse`
2. Cliquez à nouveau sur "Connecter à Loyverse"
3. Le token sera renouvelé automatiquement

### Webhooks ne fonctionnent pas ?

1. Vérifier que `NEXT_PUBLIC_BASE_URL` est correct
2. Vérifier que `LOYVERSE_WEBHOOK_SECRET` est défini
3. Voir les logs dans `/api/loyverse/webhook` pour les erreurs de signature
4. Tester avec ngrok en local d'abord

### Store ID non récupéré ?

Le système tente de récupérer automatiquement le Store ID lors de la connexion.
Si absent :
1. Aller sur https://backoffice.loyverse.com/
2. Settings → Stores
3. Copier le Store ID
4. L'ajouter manuellement dans la DB (table `LoyverseConfig`)

---

## 📱 Interface Admin

L'interface `/admin/loyverse` affiche :

- **Statut** : Connecté / Non connecté
- **Store ID** : ID du magasin
- **Token expire le** : Date d'expiration
- **Dernière sync** : Dernière mise à jour
- **Webhooks actifs** : Oui / Non

Avec actions :
- **Bouton "Connecter à Loyverse"** : Lance le flux OAuth
- **Bouton "Configurer les webhooks"** : Crée les 3 webhooks
- **Bouton "Rafraîchir"** : Met à jour le statut

---

## ✅ Checklist Déploiement

- [ ] Créer app OAuth sur https://developer.loyverse.com/
- [ ] Noter Client ID et Client Secret
- [ ] Ajouter variables dans Vercel :
  - [ ] `LOYVERSE_CLIENT_ID`
  - [ ] `LOYVERSE_CLIENT_SECRET`
  - [ ] `LOYVERSE_WEBHOOK_SECRET` (générer un secret)
  - [ ] `NEXT_PUBLIC_BASE_URL`
- [ ] Déployer sur Vercel
- [ ] Se connecter en admin : `/concours/auth`
- [ ] Aller sur `/admin/loyverse`
- [ ] Cliquer "Connecter à Loyverse"
- [ ] Autoriser l'application
- [ ] Cliquer "Configurer les webhooks"
- [ ] ✅ Tout est prêt !

---

## 🎯 Résumé

**Avant** : Configuration complexe en ligne de commande
**Après** : Interface visuelle en 2 clics

1. **Clic 1** : Connecter à Loyverse → Token sauvegardé
2. **Clic 2** : Configurer webhooks → Webhooks actifs

🎉 **C'est tout !**
