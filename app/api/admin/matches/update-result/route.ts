import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isUserAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { checkTicketsAfterMatch } from "@/lib/concours/buteur-ticket";

/**
 * POST /api/admin/matches/update-result
 * Met à jour le résultat d'un match et calcule automatiquement les points des pronostics
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Vérifier le rôle admin
    const isAdmin = await isUserAdmin(session.user.id);
    if (!isAdmin) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const body = await request.json();
    const { matchId, homeScore, awayScore, isFinished } = body;

    // Validation
    if (!matchId || homeScore === undefined || awayScore === undefined) {
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400 }
      );
    }

    if (homeScore < 0 || awayScore < 0) {
      return NextResponse.json(
        { error: "Les scores doivent être positifs" },
        { status: 400 }
      );
    }

    // Mettre à jour le match
    const match = await prisma.match.update({
      where: { id: matchId },
      data: {
        homeScore,
        awayScore,
        isFinished: isFinished ?? true,
        finishedAt: isFinished ? new Date() : null,
      },
    });

    // Si le match est terminé, calculer les points des pronostics
    if (isFinished) {
      await calculatePronosticsPoints(matchId, homeScore, awayScore);

      // Vérifier automatiquement les tickets buteur
      const ticketResults = await checkTicketsAfterMatch(matchId);
      console.log(`🎟️ Tickets vérifiés: ${ticketResults.totalTickets} total, ${ticketResults.winnersCount} gagnants`);
    }

    return NextResponse.json({
      success: true,
      match,
    });
  } catch (error) {
    console.error("Error updating match result:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * Calcule les points pour tous les pronostics d'un match
 * Règles:
 * - Score exact: 5 points
 * - Bon vainqueur (ou match nul): 3 points
 * - Sinon: 0 point
 */
async function calculatePronosticsPoints(
  matchId: string,
  homeScore: number,
  awayScore: number
) {
  // Récupérer tous les pronostics pour ce match
  const pronostics = await prisma.pronostic.findMany({
    where: { matchId },
  });

  // Calculer les points pour chaque pronostic
  for (const prono of pronostics) {
    let points = 0;
    let isExactScore = false;
    let isCorrectWinner = false;

    // Score exact
    if (prono.homeScore === homeScore && prono.awayScore === awayScore) {
      points = 5;
      isExactScore = true;
      isCorrectWinner = true;
    }
    // Bon vainqueur ou match nul
    else {
      const actualResult =
        homeScore > awayScore ? "HOME" : homeScore < awayScore ? "AWAY" : "DRAW";
      const pronoResult =
        prono.homeScore > prono.awayScore
          ? "HOME"
          : prono.homeScore < prono.awayScore
          ? "AWAY"
          : "DRAW";

      if (actualResult === pronoResult) {
        points = 3;
        isCorrectWinner = true;
      }
    }

    // Mettre à jour le pronostic
    await prisma.pronostic.update({
      where: { id: prono.id },
      data: {
        points,
        isExactScore,
        isCorrectWinner,
      },
    });
  }

  console.log(
    `✅ Points calculated for ${pronostics.length} pronostics on match ${matchId}`
  );
}
