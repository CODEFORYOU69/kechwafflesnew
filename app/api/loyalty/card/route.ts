import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createMemberCard } from "@/lib/loyalty/member-card";
import { requireSession } from "@/lib/api-helpers";

/**
 * GET: Récupère la carte membre de l'utilisateur connecté (ou la crée si elle n'existe pas)
 */
export async function GET(request: NextRequest) {
  const authResult = await requireSession(request);
  if (authResult instanceof NextResponse) return authResult;
  const { session } = authResult;

  try {
    // Cherche la carte membre existante, ou la crée (avec protection contre les races)
    let card = await prisma.memberCard.findUnique({
      where: { userId: session.user.id },
    });

    if (!card) {
      try {
        card = await createMemberCard(session.user.id);
      } catch {
        // Concurrent creation: retry the lookup
        card = await prisma.memberCard.findUnique({
          where: { userId: session.user.id },
        });
      }
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
