import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createMemberCard } from "@/lib/loyalty/member-card";
import { requireSession } from "@/lib/auth-helpers";

/**
 * GET: Récupère la carte membre de l'utilisateur connecté (ou la crée si elle n'existe pas)
 */
export async function GET() {
  const { session, error } = await requireSession();
  if (error) return error;

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
  } catch (err) {
    console.error("Erreur API loyalty/card GET:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}
