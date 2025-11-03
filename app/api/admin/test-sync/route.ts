import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const LOYVERSE_API_URL = "https://api.loyverse.com/v1.0";

/**
 * API de test pour synchroniser manuellement un reçu Loyverse
 *
 * Usage: GET /api/admin/test-sync?receipt_number=XXX
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const receiptNumber = searchParams.get("receipt_number");

    if (!receiptNumber) {
      // Lister tous les reçus récents
      const token = await getLoyverseToken();

      // Date d'hier
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const response = await fetch(
        `${LOYVERSE_API_URL}/receipts?created_at_min=${yesterday.toISOString()}&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json({
          success: false,
          message: `Erreur Loyverse API (${response.status})`,
          error: errorText,
        });
      }

      const data = await response.json();

      return NextResponse.json({
        success: true,
        receipts: data.receipts || [],
        count: data.receipts?.length || 0,
      });
    }

    // Récupérer un reçu spécifique
    const token = await getLoyverseToken();

    const response = await fetch(
      `${LOYVERSE_API_URL}/receipts/${receiptNumber}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({
        success: false,
        message: `Reçu ${receiptNumber} introuvable`,
        error: errorText,
      });
    }

    const receipt = await response.json();

    // Vérifier si le client a une carte membre
    if (!receipt.customer_id) {
      return NextResponse.json({
        success: false,
        message: "Ce reçu n'a pas de client associé",
        receipt,
      });
    }

    const memberCard = await prisma.memberCard.findUnique({
      where: { loyverseCustomerId: receipt.customer_id },
      include: { user: true },
    });

    if (!memberCard) {
      return NextResponse.json({
        success: false,
        message: `Aucune carte membre trouvée pour le client Loyverse ${receipt.customer_id}`,
        receipt,
      });
    }

    // Vérifier si déjà synchronisé
    const existingTransaction = await prisma.loyaltyTransaction.findFirst({
      where: {
        userId: memberCard.userId,
        orderId: receiptNumber,
      },
    });

    if (existingTransaction) {
      return NextResponse.json({
        success: false,
        message: "Ce reçu a déjà été synchronisé",
        receipt,
        memberCard: {
          cardNumber: memberCard.cardNumber,
          userName: memberCard.user.name,
        },
        existingTransaction,
      });
    }

    // Synchroniser
    const amount = parseFloat(receipt.total_money);
    const points = Math.floor(amount / 10);

    await prisma.loyaltyTransaction.create({
      data: {
        userId: memberCard.userId,
        type: "PURCHASE",
        points,
        amount,
        description: `Achat manuel - Receipt ${receiptNumber}`,
        orderId: receiptNumber,
      },
    });

    // Mettre à jour la carte
    const newTotalSpent = memberCard.totalSpent + amount;
    const newVisitCount = memberCard.visitCount + 1;
    const newTotalPoints = memberCard.totalPoints + points;
    const newCurrentPoints = memberCard.currentPoints + points;

    let newTier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" = "BRONZE";
    if (newTotalSpent >= 2000) newTier = "PLATINUM";
    else if (newTotalSpent >= 1000) newTier = "GOLD";
    else if (newTotalSpent >= 500) newTier = "SILVER";

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

    return NextResponse.json({
      success: true,
      message: "Synchronisation réussie",
      receipt,
      memberCard: {
        cardNumber: memberCard.cardNumber,
        userName: memberCard.user.name,
        pointsAdded: points,
        newTotalPoints,
        newTier,
      },
    });
  } catch (error) {
    console.error("Erreur test-sync:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

async function getLoyverseToken(): Promise<string> {
  const config = await prisma.loyverseConfig.findUnique({
    where: { id: "singleton" },
  });

  if (!config) {
    throw new Error("Loyverse non connecté");
  }

  return config.accessToken;
}
