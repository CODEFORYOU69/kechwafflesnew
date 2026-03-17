import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-helpers";

/**
 * GET: Récupère les rewards de l'utilisateur connecté
 */
export async function GET(request: NextRequest) {
  const authResult = await requireSession(request);
  if (authResult instanceof NextResponse) return authResult;
  const { session } = authResult;

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
  } catch (error) {
    console.error("Erreur API rewards GET:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}
