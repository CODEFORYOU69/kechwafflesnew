import { NextRequest, NextResponse } from "next/server";
import { getUserStats } from "@/lib/concours/pronostic";

/**
 * GET: Récupère les statistiques d'un utilisateur
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

    const stats = await getUserStats(userId);

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Erreur API stats GET:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}
