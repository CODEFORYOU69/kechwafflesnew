import { NextRequest, NextResponse } from "next/server";
import { getUserStats } from "@/lib/concours/pronostic";
import { requireSession } from "@/lib/api-helpers";

/**
 * GET: Récupère les statistiques de l'utilisateur connecté
 */
export async function GET(request: NextRequest) {
  const authResult = await requireSession(request);
  if (authResult instanceof NextResponse) return authResult;
  const { session } = authResult;

  try {
    const stats = await getUserStats(session.user.id);

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
