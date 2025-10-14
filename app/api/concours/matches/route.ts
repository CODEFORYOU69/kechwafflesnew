import { NextRequest, NextResponse } from "next/server";
import { getAvailableMatches } from "@/lib/concours/pronostic";

/**
 * GET: Récupère les matchs disponibles pour pronostiquer
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const matches = await getAvailableMatches(userId || undefined);

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
