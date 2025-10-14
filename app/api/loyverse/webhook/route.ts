import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

/**
 * Webhook Loyverse - Reçoit les notifications d'achats
 * Documentation: https://developer.loyverse.com/docs/#webhooks
 *
 * Types d'événements :
 * - receipt.created : Nouvelle vente/commande
 * - receipt.updated : Commande modifiée
 * - receipt.deleted : Commande supprimée
 */
export async function POST(request: NextRequest) {
  try {
    // Lire le corps de la requête
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);

    // Validation de la signature (sécurité)
    const signature = request.headers.get("X-Loyverse-Webhook-Signature");
    if (signature && process.env.LOYVERSE_WEBHOOK_SECRET) {
      const expectedSignature = crypto
        .createHmac("sha256", process.env.LOYVERSE_WEBHOOK_SECRET)
        .update(rawBody)
        .digest("hex");

      if (signature !== expectedSignature) {
        console.error("❌ Signature webhook invalide");
        return NextResponse.json(
          { success: false, message: "Invalid signature" },
          { status: 401 }
        );
      }
    }

    console.log("📥 Loyverse webhook received:", body.event_type);

    // Vérifier le type d'événement
    if (body.event_type === "receipt.created" || body.event_type === "receipt.updated") {
      const receipt = body.data;

      // Si le reçu a un customer_id, synchroniser les points
      if (receipt.customer_id) {
        await handleReceiptCreated(receipt);
      }
    } else if (body.event_type === "receipt.deleted") {
      const receipt = body.data;

      // Si le reçu a un customer_id, annuler les points
      if (receipt.customer_id) {
        await handleReceiptDeleted(receipt);
      }
    }

    return NextResponse.json({ success: true, message: "Webhook processed" });
  } catch (error) {
    console.error("❌ Erreur webhook Loyverse:", error);
    return NextResponse.json(
      { success: false, message: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

type LoyverseReceipt = {
  id: string;
  customer_id: string;
  total_money: string;
};

/**
 * Gère un nouveau reçu/achat
 */
async function handleReceiptCreated(receipt: LoyverseReceipt) {
  try {
    const loyverseCustomerId = receipt.customer_id;
    const totalMoney = parseFloat(receipt.total_money);
    const receiptId = receipt.id;

    console.log(`💰 Processing receipt ${receiptId} for customer ${loyverseCustomerId}`);
    console.log(`   Amount: ${totalMoney} MAD`);

    // Trouver la carte membre liée à ce client Loyverse
    const memberCard = await prisma.memberCard.findUnique({
      where: { loyverseCustomerId },
      include: { user: true },
    });

    if (!memberCard) {
      console.log(`⚠️  No member card found for Loyverse customer ${loyverseCustomerId}`);
      return;
    }

    // Vérifier si cette transaction a déjà été enregistrée
    const existingTransaction = await prisma.loyaltyTransaction.findFirst({
      where: {
        userId: memberCard.userId,
        orderId: receiptId,
      },
    });

    if (existingTransaction) {
      console.log(`ℹ️  Transaction already processed: ${receiptId}`);
      return;
    }

    // Calculer les points : 1 point par 10 MAD
    const pointsEarned = Math.floor(totalMoney / 10);

    // Créer la transaction de fidélité
    await prisma.loyaltyTransaction.create({
      data: {
        userId: memberCard.userId,
        type: "PURCHASE",
        points: pointsEarned,
        amount: totalMoney,
        description: `Achat en magasin`,
        orderId: receiptId,
      },
    });

    // Mettre à jour la carte membre
    const newTotalSpent = memberCard.totalSpent + totalMoney;
    const newVisitCount = memberCard.visitCount + 1;
    const newTotalPoints = memberCard.totalPoints + pointsEarned;
    const newCurrentPoints = memberCard.currentPoints + pointsEarned;

    // Calculer le nouveau tier
    let newTier = memberCard.tier;
    if (newTotalSpent >= 2000) {
      newTier = "PLATINUM";
    } else if (newTotalSpent >= 1000) {
      newTier = "GOLD";
    } else if (newTotalSpent >= 500) {
      newTier = "SILVER";
    } else {
      newTier = "BRONZE";
    }

    await prisma.memberCard.update({
      where: { id: memberCard.id },
      data: {
        totalSpent: newTotalSpent,
        visitCount: newVisitCount,
        totalPoints: newTotalPoints,
        currentPoints: newCurrentPoints,
        tier: newTier,
        lastSyncAt: new Date(),
      },
    });

    console.log(`✅ ${pointsEarned} points added to ${memberCard.user.name}`);
    console.log(`   New tier: ${newTier}, Total spent: ${newTotalSpent} MAD`);
  } catch (error) {
    console.error("❌ Error handling receipt:", error);
    throw error;
  }
}

/**
 * Gère la suppression d'un reçu (remboursement)
 */
async function handleReceiptDeleted(receipt: LoyverseReceipt) {
  try {
    const loyverseCustomerId = receipt.customer_id;
    const receiptId = receipt.id;

    console.log(`🔄 Processing receipt deletion ${receiptId} for customer ${loyverseCustomerId}`);

    // Trouver la carte membre liée à ce client Loyverse
    const memberCard = await prisma.memberCard.findUnique({
      where: { loyverseCustomerId },
      include: { user: true },
    });

    if (!memberCard) {
      console.log(`⚠️  No member card found for Loyverse customer ${loyverseCustomerId}`);
      return;
    }

    // Trouver la transaction de fidélité associée à ce reçu
    const existingTransaction = await prisma.loyaltyTransaction.findFirst({
      where: {
        userId: memberCard.userId,
        orderId: receiptId,
        type: "PURCHASE", // Seulement les achats
      },
    });

    if (!existingTransaction) {
      console.log(`ℹ️  No transaction found for receipt: ${receiptId}`);
      return;
    }

    // Récupérer les infos de la transaction
    const pointsToRemove = existingTransaction.points;
    const amountToRemove = existingTransaction.amount || 0;

    console.log(`   Removing ${pointsToRemove} points and ${amountToRemove} MAD`);

    // Créer une transaction d'annulation (REFUND)
    await prisma.loyaltyTransaction.create({
      data: {
        userId: memberCard.userId,
        type: "MANUAL_ADJUSTMENT", // Type pour les ajustements
        points: -pointsToRemove, // Points négatifs
        amount: -amountToRemove, // Montant négatif
        description: `Remboursement - Annulation achat (Receipt ${receiptId})`,
        orderId: receiptId,
      },
    });

    // Calculer les nouvelles valeurs
    const newTotalSpent = Math.max(0, memberCard.totalSpent - amountToRemove);
    const newVisitCount = Math.max(0, memberCard.visitCount - 1);
    const newTotalPoints = Math.max(0, memberCard.totalPoints - pointsToRemove);
    const newCurrentPoints = Math.max(0, memberCard.currentPoints - pointsToRemove);

    // Recalculer le tier basé sur le nouveau totalSpent
    let newTier = memberCard.tier;
    if (newTotalSpent >= 2000) {
      newTier = "PLATINUM";
    } else if (newTotalSpent >= 1000) {
      newTier = "GOLD";
    } else if (newTotalSpent >= 500) {
      newTier = "SILVER";
    } else {
      newTier = "BRONZE";
    }

    // Mettre à jour la carte membre
    await prisma.memberCard.update({
      where: { id: memberCard.id },
      data: {
        totalSpent: newTotalSpent,
        visitCount: newVisitCount,
        totalPoints: newTotalPoints,
        currentPoints: newCurrentPoints,
        tier: newTier,
        lastSyncAt: new Date(),
      },
    });

    console.log(`✅ ${pointsToRemove} points removed from ${memberCard.user.name}`);
    console.log(`   New tier: ${newTier}, Total spent: ${newTotalSpent} MAD`);

    // Notifier l'utilisateur du remboursement (optionnel - à implémenter plus tard)
    // await sendRefundNotification(memberCard.userId, pointsToRemove, amountToRemove);
  } catch (error) {
    console.error("❌ Error handling receipt deletion:", error);
    throw error;
  }
}
