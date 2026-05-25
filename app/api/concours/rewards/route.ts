import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth-helpers";

/**
 * GET: Récupère les rewards de l'utilisateur connecté
 */
export async function GET() {
  const { session, error } = await requireSession();
  if (error) return error;

  try {
    const rewards = await prisma.reward.findMany({
      where: { userId: session.user.id },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      rewards,
    });
  } catch (err) {
    console.error("Erreur API rewards GET:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}
