import { NextRequest, NextResponse } from "next/server";
import { getAvailableMatches } from "@/lib/concours/pronostic";
import { auth } from "@/lib/auth";

/**
 * GET: Récupère les matchs disponibles pour pronostiquer
 */
export async function GET(request: NextRequest) {
  try {
    // userId optionnel - dérivé de la session si l'utilisateur est connecté
    const session = await auth.api.getSession({ headers: request.headers }).catch(() => null);
    const userId = session?.user?.id || undefined;

    const matches = await getAvailableMatches(userId);

    return NextResponse.json({
      success: true,
      matches,
    });
  } catch (error) {
    console.error("Erreur API matches GET:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}
