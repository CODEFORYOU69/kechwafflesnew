import { NextRequest, NextResponse } from "next/server";
import { createOrUpdatePronostic, getUserPronostics } from "@/lib/concours/pronostic";
import { requireSession } from "@/lib/auth-helpers";

/**
 * POST: Crée ou met à jour un pronostic
 */
export async function POST(request: NextRequest) {
  const { session, error } = await requireSession();
  if (error) return error;

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
  } catch (err) {
    console.error("Erreur API pronostic POST:", err);
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
 * GET: Récupère les pronostics de l'utilisateur connecté
 */
export async function GET() {
  const { session, error } = await requireSession();
  if (error) return error;

  try {
    const pronostics = await getUserPronostics(session.user.id);

    return NextResponse.json({
      success: true,
      pronostics,
    });
  } catch (err) {
    console.error("Erreur API pronostic GET:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}
