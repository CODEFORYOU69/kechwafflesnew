import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isUserAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { checkTicketsAfterMatch } from "@/lib/concours/buteur-ticket";
import { customAlphabet } from "nanoid";

const generateRewardCode = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);

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
 * - Score exact: 5 points + Gaufre offerte
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

  let exactScoresCount = 0;

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
      exactScoresCount++;

      // Générer une gaufre offerte pour score exact
      await generateWaffleReward(prono.userId, matchId, homeScore, awayScore);
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
    `✅ Points calculated for ${pronostics.length} pronostics on match ${matchId} (${exactScoresCount} exact scores)`
  );
}

/**
 * Génère un code reward pour une gaufre offerte (Concours 1)
 */
async function generateWaffleReward(
  userId: string,
  matchId: string,
  homeScore: number,
  awayScore: number
): Promise<void> {
  // Vérifier si un reward existe déjà pour ce user/match
  const existingReward = await prisma.reward.findFirst({
    where: {
      userId,
      matchId,
      type: "GAUFRE_GRATUITE",
    },
  });

  if (existingReward) {
    console.log(`⚠️ Reward already exists for user ${userId} on match ${matchId}`);
    return;
  }

  const code = `GAUFRE-${generateRewardCode()}`;

  // Expire dans 7 jours
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.reward.create({
    data: {
      userId,
      type: "GAUFRE_GRATUITE",
      description: "Gaufre offerte pour score exact",
      code,
      matchId,
      reason: `Score exact du match ${homeScore}-${awayScore}`,
      expiresAt,
      isRedeemed: false,
    },
  });

  console.log(`🧇 Reward generated for user ${userId}: ${code}`);
}
