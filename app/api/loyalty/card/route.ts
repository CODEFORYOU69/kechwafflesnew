import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createMemberCard } from "@/lib/loyalty/member-card";

/**
 * GET: Récupère la carte membre d'un utilisateur (ou la crée si elle n'existe pas)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "userId requis",
        },
        { status: 400 }
      );
    }

    // Cherche la carte membre existante
    let card = await prisma.memberCard.findUnique({
      where: { userId },
    });

    // Si pas de carte, la créer
    if (!card) {
      card = await createMemberCard(userId);
    }

    return NextResponse.json({
      success: true,
      card,
    });
  } catch (error) {
    console.error("Erreur API loyalty/card GET:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}
