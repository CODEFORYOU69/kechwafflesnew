import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { createButeurTicket, getNextAvailableMatch } from "@/lib/concours/buteur-ticket";

/**
 * Webhook Loyverse - Reçoit les notifications d'achats
 * Documentation: https://developer.loyverse.com/docs/#webhooks
 *
 * Types d'événements :
 * - receipts.update : Nouvelle vente/commande OU commande modifiée
 * - receipts.delete : Commande supprimée
 */
export async function POST(request: NextRequest) {
  try {
    // Lire le corps de la requête
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);

    // Validation de la signature (sécurité)
    const webhookSecret = process.env.LOYVERSE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("❌ LOYVERSE_WEBHOOK_SECRET non configuré");
      return NextResponse.json(
        { success: false, message: "Webhook not configured" },
        { status: 500 }
      );
    }
    const signature = request.headers.get("X-Loyverse-Webhook-Signature");
    if (!signature) {
      console.error("❌ Signature webhook manquante");
      return NextResponse.json(
        { success: false, message: "Missing webhook signature" },
        { status: 401 }
      );
    }
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    const signatureValid =
      sigBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(sigBuffer, expectedBuffer);
    if (!signatureValid) {
      console.error("❌ Signature webhook invalide");
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 401 }
      );
    }

    console.log("📥 Loyverse webhook received:", body.event_type);

    // Vérifier le type d'événement
    if (body.event_type === "receipts.update") {
      const receipt = body.data;

      // Si le reçu a un customer_id, synchroniser les points
      if (receipt.customer_id) {
        await handleReceiptCreated(receipt);
      }
    } else if (body.event_type === "receipts.delete") {
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
  receipt_number: string;  // Identifiant principal du reçu
  customer_id?: string;    // Optionnel - seulement si client associé
  total_money: number;     // Montant total en nombre
  receipt_type: string;    // SALE, REFUND, etc.
  created_at: string;
  updated_at: string;
};

/**
 * Gère un nouveau reçu/achat
 */
async function handleReceiptCreated(receipt: LoyverseReceipt) {
  try {
    const loyverseCustomerId = receipt.customer_id;
    const totalMoney = receipt.total_money; // Déjà un nombre
    const receiptNumber = receipt.receipt_number;

    console.log(`💰 Processing receipt ${receiptNumber} for customer ${loyverseCustomerId}`);
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
        orderId: receiptNumber,
      },
    });

    if (existingTransaction) {
      console.log(`ℹ️  Transaction already processed: ${receiptNumber}`);
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
        description: `Achat en magasin - Receipt ${receiptNumber}`,
        orderId: receiptNumber,
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

    // 🎫 CONCOURS 3 : Générer un ticket buteur automatiquement
    try {
      const nextMatchId = await getNextAvailableMatch();

      if (nextMatchId) {
        const ticketResult = await createButeurTicket({
          matchId: nextMatchId,
          userId: memberCard.userId,
        });

        if (ticketResult.success && ticketResult.ticket) {
          console.log(`🎫 Ticket buteur généré : ${ticketResult.ticket.ticketCode}`);
          console.log(`   Joueur : ${ticketResult.ticket.playerName} (${ticketResult.ticket.teamName})`);
          console.log(`   Match : ${ticketResult.ticket.matchInfo}`);
        } else {
          console.log(`⚠️  Impossible de générer un ticket buteur : ${ticketResult.message}`);
        }
      } else {
        console.log(`ℹ️  Pas de match disponible pour générer un ticket buteur`);
      }
    } catch (ticketError) {
      // Ne pas bloquer le traitement du reçu si la génération du ticket échoue
      console.error("⚠️  Erreur génération ticket buteur:", ticketError);
    }
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
    const receiptNumber = receipt.receipt_number;

    console.log(`🔄 Processing receipt deletion ${receiptNumber} for customer ${loyverseCustomerId}`);

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
        orderId: receiptNumber,
        type: "PURCHASE", // Seulement les achats
      },
    });

    if (!existingTransaction) {
      console.log(`ℹ️  No transaction found for receipt: ${receiptNumber}`);
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
        description: `Remboursement - Annulation achat (Receipt ${receiptNumber})`,
        orderId: receiptNumber,
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
