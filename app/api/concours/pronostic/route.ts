import { NextRequest, NextResponse } from "next/server";
import { createOrUpdatePronostic, getUserPronostics } from "@/lib/concours/pronostic";

/**
 * POST: Crée ou met à jour un pronostic
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, matchId, homeScore, awayScore } = body;

    if (!userId || !matchId || homeScore === undefined || awayScore === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "Paramètres manquants",
        },
        { status: 400 }
      );
    }

    // Valide les scores (doivent être des nombres positifs)
    if (homeScore < 0 || awayScore < 0 || !Number.isInteger(homeScore) || !Number.isInteger(awayScore)) {
      return NextResponse.json(
        {
          success: false,
          message: "Les scores doivent être des nombres entiers positifs",
        },
        { status: 400 }
      );
    }

    const result = await createOrUpdatePronostic({
      userId,
      matchId,
      homeScore,
      awayScore,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur API pronostic POST:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}

/**
 * GET: Récupère les pronostics d'un utilisateur
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

    const pronostics = await getUserPronostics(userId);

    return NextResponse.json({
      success: true,
      pronostics,
    });
  } catch (error) {
    console.error("Erreur API pronostic GET:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}
