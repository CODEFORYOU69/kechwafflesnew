/**
 * Système de Pronostics - Concours 1 & 2
 *
 * Concours 1: Score exact → Gaufre offerte
 * Concours 2: Pronostics multiples → Classement général
 */

import { customAlphabet } from "nanoid";
import { prisma } from "@/lib/prisma";

const generateRewardCode = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);

/**
 * Système de points
 */
export const POINTS = {
  EXACT_SCORE: 5, // Score exact
  CORRECT_WINNER: 3, // Bon résultat (victoire/nul correct)
  WINNER_FINAL: 50, // Vainqueur final correct
  PODIUM_EXACT: 30, // Podium exact (1er, 2e, 3e)
  PODIUM_PARTIAL: 10, // 1 ou 2 équipes du podium correctes
} as const;

/**
 * Crée ou met à jour un pronostic pour un match
 * Doit avoir scanné le QR du jour pour pouvoir pronostiquer
 */
export async function createOrUpdatePronostic(data: {
  userId: string;
  matchId: string;
  homeScore: number;
  awayScore: number;
}): Promise<{
  success: boolean;
  pronostic?: {
    id: string;
    homeScore: number;
    awayScore: number;
  };
  message: string;
}> {
  try {
    // Vérifie que le match existe
    const match = await prisma.match.findUnique({
      where: { id: data.matchId },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    if (!match) {
      return {
        success: false,
        message: "Match introuvable",
      };
    }

    // Vérifie que les pronostics ne sont pas verrouillés
    if (match.lockPronostics) {
      return {
        success: false,
        message: "Les pronostics sont verrouillés pour ce match (commence dans moins de 5 min)",
      };
    }

    // Vérifie que le match n'est pas déjà commencé/terminé
    if (match.isFinished || new Date() >= match.scheduledAt) {
      return {
        success: false,
        message: "Ce match est déjà commencé ou terminé",
      };
    }

    // Vérifie que l'utilisateur est inscrit au Concours 1 (scan unique)
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
      select: { registeredForPronostics: true },
    });

    if (!user?.registeredForPronostics) {
      return {
        success: false,
        message: "Vous devez vous inscrire au concours en scannant le QR code en magasin",
      };
    }

    // Vérifie si un pronostic existe déjà
    const existing = await prisma.pronostic.findUnique({
      where: {
        userId_matchId: {
          userId: data.userId,
          matchId: data.matchId,
        },
      },
    });

    if (existing) {
      // Met à jour le pronostic existant
      const updated = await prisma.pronostic.update({
        where: { id: existing.id },
        data: {
          homeScore: data.homeScore,
          awayScore: data.awayScore,
          updatedAt: new Date(),
        },
      });

      return {
        success: true,
        pronostic: {
          id: updated.id,
          homeScore: updated.homeScore,
          awayScore: updated.awayScore,
        },
        message: "Pronostic mis à jour avec succès",
      };
    }

    // Crée un nouveau pronostic
    const pronostic = await prisma.pronostic.create({
      data: {
        userId: data.userId,
        matchId: data.matchId,
        homeScore: data.homeScore,
        awayScore: data.awayScore,
        points: 0,
        isExactScore: false,
        isCorrectWinner: false,
      },
    });

    return {
      success: true,
      pronostic: {
        id: pronostic.id,
        homeScore: pronostic.homeScore,
        awayScore: pronostic.awayScore,
      },
      message: "Pronostic enregistré avec succès",
    };
  } catch (error) {
    console.error("Erreur création pronostic:", error);
    return {
      success: false,
      message: "Erreur lors de l'enregistrement du pronostic",
    };
  }
}

/**
 * Calcule les points et vérifie les pronostics après un match
 * Appelé automatiquement après la saisie du résultat final
 */
export async function calculatePronosticsAfterMatch(matchId: string): Promise<{
  totalPronostics: number;
  exactScores: number;
  correctWinners: number;
  rewardsGenerated: number;
}> {
  try {
    // Récupère le match avec le résultat
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match || !match.isFinished) {
      throw new Error("Le match n'est pas terminé");
    }

    if (match.homeScore === null || match.awayScore === null) {
      throw new Error("Le score final n'est pas renseigné");
    }

    // Récupère tous les pronostics pour ce match
    const pronostics = await prisma.pronostic.findMany({
      where: { matchId },
      include: {
        user: true,
      },
    });

    let exactScores = 0;
    let correctWinners = 0;
    const rewardPromises = [];

    for (const prono of pronostics) {
      let points = 0;
      let isExactScore = false;
      let isCorrectWinner = false;

      // Vérifie le score exact
      if (
        prono.homeScore === match.homeScore &&
        prono.awayScore === match.awayScore
      ) {
        points = POINTS.EXACT_SCORE;
        isExactScore = true;
        exactScores++;

        // CONCOURS 1: Génère une gaufre offerte pour score exact
        rewardPromises.push(
          generateWaffleReward(prono.userId, matchId)
        );
      } else {
        // Vérifie le résultat (victoire domicile, nul, victoire extérieur)
        const actualResult = getMatchResult(match.homeScore, match.awayScore);
        const pronoResult = getMatchResult(prono.homeScore, prono.awayScore);

        if (actualResult === pronoResult) {
          points = POINTS.CORRECT_WINNER;
          isCorrectWinner = true;
          correctWinners++;
        }
      }

      // Met à jour le pronostic avec les points
      await prisma.pronostic.update({
        where: { id: prono.id },
        data: {
          points,
          isExactScore,
          isCorrectWinner,
        },
      });
    }

    // Génère tous les rewards
    await Promise.all(rewardPromises);

    return {
      totalPronostics: pronostics.length,
      exactScores,
      correctWinners,
      rewardsGenerated: exactScores,
    };
  } catch (error) {
    console.error("Erreur calcul pronostics:", error);
    throw error;
  }
}

/**
 * Détermine le résultat d'un match (domicile, nul, extérieur)
 */
function getMatchResult(homeScore: number, awayScore: number): "HOME" | "DRAW" | "AWAY" {
  if (homeScore > awayScore) return "HOME";
  if (homeScore < awayScore) return "AWAY";
  return "DRAW";
}

/**
 * Génère un code reward pour une gaufre offerte (Concours 1)
 */
async function generateWaffleReward(
  userId: string,
  matchId: string
): Promise<void> {
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
      reason: "Score exact du match",
      expiresAt,
      isRedeemed: false,
    },
  });
}

/**
 * Récupère les pronostics d'un utilisateur avec les résultats
 */
export async function getUserPronostics(userId: string) {
  const pronostics = await prisma.pronostic.findMany({
    where: { userId },
    include: {
      match: {
        include: {
          homeTeam: true,
          awayTeam: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return pronostics.map((prono: typeof pronostics[number]) => ({
    id: prono.id,
    match: {
      id: prono.match.id,
      homeTeam: prono.match.homeTeam.nameFr,
      awayTeam: prono.match.awayTeam.nameFr,
      homeFlag: prono.match.homeTeam.flag,
      awayFlag: prono.match.awayTeam.flag,
      scheduledAt: prono.match.scheduledAt,
      isFinished: prono.match.isFinished,
      homeScore: prono.match.homeScore,
      awayScore: prono.match.awayScore,
    },
    pronostic: {
      homeScore: prono.homeScore,
      awayScore: prono.awayScore,
    },
    result: {
      points: prono.points,
      isExactScore: prono.isExactScore,
      isCorrectWinner: prono.isCorrectWinner,
    },
  }));
}

/**
 * Classement général pour le Concours 2
 */
export async function getLeaderboard(limit = 50) {
  // Calcule le total de points par utilisateur
  const rankings = await prisma.pronostic.groupBy({
    by: ["userId"],
    _sum: {
      points: true,
    },
    _count: {
      id: true,
    },
    orderBy: {
      _sum: {
        points: "desc",
      },
    },
    take: limit,
  });

  // Récupère les infos des utilisateurs
  const leaderboard = await Promise.all(
    rankings.map(async (ranking: typeof rankings[number], index: number) => {
      const user = await prisma.user.findUnique({
        where: { id: ranking.userId },
        select: {
          id: true,
          name: true,
          image: true,
        },
      });

      return {
        rank: index + 1,
        userId: ranking.userId,
        userName: user?.name || "Anonyme",
        userImage: user?.image,
        totalPoints: ranking._sum.points || 0,
        totalPronostics: ranking._count.id,
      };
    })
  );

  return leaderboard;
}

/**
 * Récupère les matchs disponibles pour pronostiquer
 */
export async function getAvailableMatches(userId?: string) {
  const now = new Date();

  const matches = await prisma.match.findMany({
    where: {
      isFinished: false,
      lockPronostics: false,
      scheduledAt: {
        gt: now,
      },
    },
    include: {
      homeTeam: true,
      awayTeam: true,
      pronostics: userId
        ? {
            where: {
              userId,
            },
          }
        : false,
    },
    orderBy: {
      scheduledAt: "asc",
    },
  });

  return matches.map((match: typeof matches[number]) => ({
    id: match.id,
    matchNumber: match.matchNumber,
    phase: match.phase,
    homeTeam: {
      name: match.homeTeam.nameFr,
      code: match.homeTeam.code,
      flag: match.homeTeam.flag,
    },
    awayTeam: {
      name: match.awayTeam.nameFr,
      code: match.awayTeam.code,
      flag: match.awayTeam.flag,
    },
    scheduledAt: match.scheduledAt,
    venue: match.venue,
    city: match.city,
    userPronostic: userId && match.pronostics ? match.pronostics[0] : null,
  }));
}

/**
 * Verrouille automatiquement les pronostics 5 minutes avant le match
 * À appeler via un cron job toutes les minutes
 */
export async function lockUpcomingMatches(): Promise<number> {
  const now = new Date();
  const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

  const result = await prisma.match.updateMany({
    where: {
      isFinished: false,
      lockPronostics: false,
      scheduledAt: {
        lte: fiveMinutesFromNow,
      },
    },
    data: {
      lockPronostics: true,
    },
  });

  return result.count;
}

/**
 * Récupère les statistiques d'un utilisateur
 */
export async function getUserStats(userId: string) {
  const totalPronostics = await prisma.pronostic.count({
    where: { userId },
  });

  const exactScores = await prisma.pronostic.count({
    where: {
      userId,
      isExactScore: true,
    },
  });

  const correctWinners = await prisma.pronostic.count({
    where: {
      userId,
      isCorrectWinner: true,
    },
  });

  const totalPoints = await prisma.pronostic.aggregate({
    where: { userId },
    _sum: {
      points: true,
    },
  });

  const rewards = await prisma.reward.count({
    where: {
      userId,
      isRedeemed: false,
    },
  });

  return {
    totalPronostics,
    exactScores,
    correctWinners,
    totalPoints: totalPoints._sum.points || 0,
    pendingRewards: rewards,
    accuracy: totalPronostics > 0 ? (exactScores / totalPronostics) * 100 : 0,
  };
}
