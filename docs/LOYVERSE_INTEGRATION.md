# Intégration Loyverse API

## 📱 Vue d'ensemble

Loyverse propose une API REST qui permet de synchroniser les données clients et commandes avec notre système de fidélité.

## 🔑 Configuration

### 1. Obtenir le Token API

1. Connectez-vous à [Loyverse BackOffice](https://backoffice.loyverse.com/)
2. Allez dans **Paramètres** → **API Access**
3. Créez un nouveau token avec les permissions suivantes :
   - ✅ **Customers** : Read + Write
   - ✅ **Receipts** : Read
   - ✅ **Items** : Read (optionnel)

4. Copiez le token et ajoutez-le dans `.env` :
```env
LOYVERSE_API_TOKEN="your-token-here"
LOYVERSE_STORE_ID="your-store-id"
```

### 2. Endpoints API Loyverse

**Base URL** : `https://api.loyverse.com/v1.0`

## 🔄 Synchronisation Clients

### Créer un client dans Loyverse

```typescript
// lib/loyalty/loyverse.ts

const LOYVERSE_API_URL = "https://api.loyverse.com/v1.0";

export async function createLoyverseCustomer(memberCard: {
  cardNumber: string;
  user: {
    name: string;
    email: string;
  };
}) {
  const response = await fetch(`${LOYVERSE_API_URL}/customers`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.LOYVERSE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: memberCard.user.name,
      email: memberCard.user.email,
      customer_code: memberCard.cardNumber, // Numéro de carte comme code client
      total_points: 0,
      total_visits: 0,
      total_spent: "0",
    }),
  });

  if (!response.ok) {
    throw new Error(`Loyverse API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.id; // ID du client dans Loyverse
}
```

### Mettre à jour un client

```typescript
export async function updateLoyverseCustomer(
  loyverseCustomerId: string,
  data: {
    total_points?: number;
    total_visits?: number;
    total_spent?: string;
  }
) {
  const response = await fetch(
    `${LOYVERSE_API_URL}/customers/${loyverseCustomerId}`,
    {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${process.env.LOYVERSE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(`Loyverse API error: ${response.statusText}`);
  }

  return await response.json();
}
```

### Récupérer les commandes d'un client

```typescript
export async function getLoyverseReceipts(loyverseCustomerId: string) {
  const response = await fetch(
    `${LOYVERSE_API_URL}/receipts?customer_id=${loyverseCustomerId}&limit=100`,
    {
      headers: {
        "Authorization": `Bearer ${process.env.LOYVERSE_API_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Loyverse API error: ${response.statusText}`);
  }

  return await response.json();
}
```

## 🔗 Workflow d'Intégration

### 1. À l'inscription d'un nouveau membre

```typescript
// app/api/member-card/create/route.ts

import { createMemberCard } from "@/lib/loyalty/member-card";
import { createLoyverseCustomer } from "@/lib/loyalty/loyverse";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await req.json();

  // 1. Créer la carte membre dans notre DB
  const memberCard = await createMemberCard(userId);

  // 2. Créer le client dans Loyverse
  try {
    const loyverseCustomerId = await createLoyverseCustomer({
      cardNumber: memberCard.cardNumber,
      user: await prisma.user.findUnique({ where: { id: userId } }),
    });

    // 3. Mettre à jour notre DB avec l'ID Loyverse
    await prisma.memberCard.update({
      where: { id: memberCard.id },
      data: {
        loyverseCustomerId,
        lastSyncAt: new Date(),
      },
    });

    return Response.json({ success: true, memberCard });
  } catch (error) {
    console.error("Erreur synchronisation Loyverse:", error);
    // On continue même si Loyverse échoue
    return Response.json({ success: true, memberCard, loyverseError: true });
  }
}
```

### 2. Scan de carte en magasin

**Option A : Manuel (Recommandé pour MVP)**
1. Client présente sa carte (QR code ou numéro)
2. Staff scanne le QR code ou entre le numéro dans Loyverse
3. Loyverse recherche le client par `customer_code` (= cardNumber)
4. Transaction enregistrée normalement dans Loyverse

**Option B : Synchronisation automatique (Webhook)**
1. Configurer un webhook Loyverse pour les nouvelles commandes
2. Recevoir les notifications de commandes
3. Mettre à jour automatiquement les points dans notre DB

```typescript
// app/api/webhooks/loyverse/route.ts

export async function POST(req: Request) {
  const event = await req.json();

  if (event.type === "receipt.created") {
    const { customer_id, total_money } = event.data;

    // Récupérer le client depuis Loyverse ID
    const memberCard = await prisma.memberCard.findUnique({
      where: { loyverseCustomerId: customer_id },
    });

    if (memberCard) {
      // Ajouter les points
      await addLoyaltyPoints(
        memberCard.userId,
        parseFloat(total_money),
        event.data.receipt_number
      );
    }
  }

  return Response.json({ success: true });
}
```

### 3. Synchronisation périodique (Optionnel)

```typescript
// Cron job ou fonction manuelle pour synchroniser
export async function syncAllLoyverseCustomers() {
  const memberCards = await prisma.memberCard.findMany({
    where: {
      loyverseCustomerId: { not: null },
    },
    include: { user: true },
  });

  for (const card of memberCards) {
    try {
      // Mettre à jour les infos dans Loyverse
      await updateLoyverseCustomer(card.loyverseCustomerId!, {
        total_points: card.totalPoints,
        total_visits: card.visitCount,
        total_spent: card.totalSpent.toString(),
      });

      await prisma.memberCard.update({
        where: { id: card.id },
        data: { lastSyncAt: new Date() },
      });
    } catch (error) {
      console.error(`Erreur sync ${card.cardNumber}:`, error);
    }
  }
}
```

## 📊 Schéma de Données Loyverse

### Customer Object

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Mohamed Alami",
  "email": "mohamed@example.com",
  "customer_code": "KW-ABC123",
  "phone_number": "+212600000000",
  "address": "Marrakech, Maroc",
  "city": "Marrakech",
  "country": "MA",
  "total_points": 150,
  "total_visits": 12,
  "total_spent": "1250.00",
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-20T14:22:00Z"
}
```

### Receipt Object

```json
{
  "id": "receipt-id",
  "receipt_number": "R-001234",
  "customer_id": "customer-id",
  "total_money": "85.50",
  "receipt_date": "2025-01-20T14:20:00Z",
  "line_items": [
    {
      "name": "Gaufre Tiramisu",
      "price": "55.00",
      "quantity": 1
    },
    {
      "name": "Café Latte",
      "price": "30.50",
      "quantity": 1
    }
  ]
}
```

## 🎯 Recommandations

### Pour MVP (Phase 1)
✅ **Approche manuelle** :
1. Créer le client dans Loyverse avec le numéro de carte comme `customer_code`
2. Staff scanne/entre le numéro de carte lors de la commande
3. Synchronisation manuelle quotidienne pour mettre à jour les points

### Pour Production (Phase 2)
✅ **Approche automatique** :
1. Webhook Loyverse pour recevoir les commandes en temps réel
2. Mise à jour automatique des points
3. Notifications push aux clients

## 🔐 Sécurité

- ⚠️ **Ne jamais exposer le token API côté client**
- ✅ Toutes les requêtes Loyverse via API Routes Next.js (serveur)
- ✅ Valider les webhooks avec signature si disponible
- ✅ Rate limiting sur les endpoints API

## 📞 Support Loyverse

- Documentation : https://help.loyverse.com/help/loyverse-api
- Email : support@loyverse.com
- API Status : https://status.loyverse.com/

## 🧪 Test de l'API

```bash
# Test avec curl
curl -X GET "https://api.loyverse.com/v1.0/customers" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## ✅ Checklist d'Intégration

- [ ] Obtenir le token API Loyverse
- [ ] Configurer les variables d'environnement
- [ ] Créer les fonctions d'API dans `lib/loyalty/loyverse.ts`
- [ ] Tester la création de client
- [ ] Configurer le `customer_code` avec le numéro de carte
- [ ] Former le staff au scan des cartes
- [ ] (Optionnel) Configurer les webhooks
- [ ] Mettre en place la synchronisation périodique
