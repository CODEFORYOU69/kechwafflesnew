/**
 * Script de synchronisation manuelle des points de fidélité depuis Loyverse
 *
 * Ce script récupère tous les reçus Loyverse et synchronise les points
 * de fidélité pour tous les clients qui ont une carte membre.
 */

import { prisma } from "../lib/prisma";

const LOYVERSE_API_URL = "https://api.loyverse.com/v1.0";

type LoyverseReceipt = {
  receipt_number: string;
  customer_id?: string;
  total_money: string;
  receipt_type: string;
  receipt_date: string;
  created_at: string;
};

/**
 * Récupère le token Loyverse
 */
async function getLoyverseToken(): Promise<string> {
  const config = await prisma.loyverseConfig.findUnique({
    where: { id: "singleton" },
  });

  if (!config) {
    throw new Error("Loyverse non connecté");
  }

  return config.accessToken;
}

/**
 * Récupère tous les reçus Loyverse pour un client (31 derniers jours)
 */
async function getCustomerReceipts(customerId: string): Promise<LoyverseReceipt[]> {
  const token = await getLoyverseToken();
  const allReceipts: LoyverseReceipt[] = [];

  // Date de début : 31 jours avant aujourd'hui
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 31);
  const dateFrom = startDate.toISOString();

  let cursor: string | null = null;

  do {
    const url = cursor
      ? `${LOYVERSE_API_URL}/receipts?customer_id=${customerId}&created_at_min=${dateFrom}&limit=250&cursor=${cursor}`
      : `${LOYVERSE_API_URL}/receipts?customer_id=${customerId}&created_at_min=${dateFrom}&limit=250`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      // Si erreur 402 (limite d'historique), on ignore silencieusement
      if (response.status === 402) {
        console.log(`   ⚠️  Historique limité aux 31 derniers jours (abonnement Loyverse requis)`);
        return allReceipts;
      }

      throw new Error(`Erreur API Loyverse (${response.status}): ${response.statusText} - ${errorText}`);
    }

    const data: { receipts?: LoyverseReceipt[]; cursor?: string } = await response.json();
    const receipts = data.receipts || [];
    allReceipts.push(...receipts);

    cursor = data.cursor || null;
  } while (cursor);

  return allReceipts;
}

/**
 * Synchronise les points pour une carte membre
 */
async function syncMemberCard(memberCard: {
  id: string;
  userId: string;
  cardNumber: string;
  loyverseCustomerId: string | null;
  user: { name: string };
}) {
  if (!memberCard.loyverseCustomerId) {
    console.log(`⏭️  ${memberCard.cardNumber} (${memberCard.user.name}) : Pas de loyverseCustomerId`);
    return;
  }

  console.log(`\n🔄 Synchronisation de ${memberCard.cardNumber} (${memberCard.user.name})`);

  try {
    // Récupérer tous les reçus du client
    const receipts = await getCustomerReceipts(memberCard.loyverseCustomerId);
    console.log(`   📥 ${receipts.length} reçu(s) trouvé(s)`);

    if (receipts.length === 0) {
      console.log(`   ✓ Aucun reçu à synchroniser`);
      return;
    }

    let totalSpent = 0;
    let totalPoints = 0;
    let visitCount = 0;
    let newTransactions = 0;

    for (const receipt of receipts) {
      // Vérifier si ce reçu a déjà été traité
      const existing = await prisma.loyaltyTransaction.findFirst({
        where: {
          userId: memberCard.userId,
          orderId: receipt.receipt_number,
        },
      });

      if (existing) {
        // Déjà traité, on compte quand même pour le total
        const amount = parseFloat(receipt.total_money);
        totalSpent += amount;
        totalPoints += Math.floor(amount / 10);
        visitCount++;
        continue;
      }

      // Nouveau reçu : créer la transaction
      const amount = parseFloat(receipt.total_money);
      const points = Math.floor(amount / 10);

      await prisma.loyaltyTransaction.create({
        data: {
          userId: memberCard.userId,
          type: "PURCHASE",
          points,
          amount,
          description: `Achat en magasin - Receipt ${receipt.receipt_number}`,
          orderId: receipt.receipt_number,
        },
      });

      totalSpent += amount;
      totalPoints += points;
      visitCount++;
      newTransactions++;
    }

    // Calculer le tier
    let tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" = "BRONZE";
    if (totalSpent >= 2000) tier = "PLATINUM";
    else if (totalSpent >= 1000) tier = "GOLD";
    else if (totalSpent >= 500) tier = "SILVER";

    // Mettre à jour la carte membre
    await prisma.memberCard.update({
      where: { id: memberCard.id },
      data: {
        totalSpent,
        totalPoints,
        currentPoints: totalPoints, // Tous les points sont disponibles
        visitCount,
        tier,
        lastSyncAt: new Date(),
      },
    });

    console.log(`   ✅ Synchronisé :`);
    console.log(`      - ${newTransactions} nouvelle(s) transaction(s)`);
    console.log(`      - ${totalPoints} points au total`);
    console.log(`      - ${totalSpent.toFixed(2)} MAD dépensés`);
    console.log(`      - ${visitCount} visite(s)`);
    console.log(`      - Tier: ${tier}`);
  } catch (error) {
    console.error(`   ❌ Erreur : ${error}`);
  }
}

/**
 * Script principal
 */
async function main() {
  console.log("🚀 Synchronisation des points de fidélité depuis Loyverse\n");

  // Récupérer toutes les cartes membres
  const memberCards = await prisma.memberCard.findMany({
    include: { user: true },
  });

  console.log(`📊 ${memberCards.length} carte(s) membre(s) trouvée(s)\n`);

  for (const memberCard of memberCards) {
    await syncMemberCard(memberCard);
  }

  console.log("\n✅ Synchronisation terminée !");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur fatale:", error);
    process.exit(1);
  });
