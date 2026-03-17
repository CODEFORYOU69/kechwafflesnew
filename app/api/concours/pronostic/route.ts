import { NextRequest, NextResponse } from "next/server";
import { createOrUpdatePronostic, getUserPronostics } from "@/lib/concours/pronostic";
import { requireSession } from "@/lib/api-helpers";

/**
 * POST: Crée ou met à jour un pronostic
 */
export async function POST(request: NextRequest) {
  const authResult = await requireSession(request);
  if (authResult instanceof NextResponse) return authResult;
  const { session } = authResult;

  try {
    const body = await request.json();
    const { matchId, homeScore, awayScore } = body;

    if (!matchId || homeScore === undefined || awayScore === undefined) {
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
      userId: session.user.id,
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
  const authResult = await requireSession(request);
  if (authResult instanceof NextResponse) return authResult;
  const { session } = authResult;

  try {
    const pronostics = await getUserPronostics(session.user.id);

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
