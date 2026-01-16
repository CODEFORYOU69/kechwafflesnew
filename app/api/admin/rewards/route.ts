import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isUserAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * GET /api/admin/rewards
 * Récupère toutes les récompenses et gagnants
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const isAdmin = await isUserAdmin(session.user.id);
    if (!isAdmin) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // 1. Récupérer les rewards existants (gaufres offertes pour scores exacts)
    const rewards = await prisma.reward.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 2. Récupérer les pronostics avec scores exacts (même sans reward généré)
    const exactScorePronostics = await prisma.pronostic.findMany({
      where: {
        isExactScore: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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

    // 3. Récupérer les tickets buteur gagnants
    const winningTickets = await prisma.buteurTicket.findMany({
      where: {
        hasWon: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        player: {
          include: {
            team: true,
          },
        },
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

    // 4. Récupérer les top 10 du classement (pour tickets tirage)
    const leaderboard = await prisma.pronostic.groupBy({
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
      take: 10,
    });

    const leaderboardWithUsers = await Promise.all(
      leaderboard.map(async (entry, index) => {
        const user = await prisma.user.findUnique({
          where: { id: entry.userId },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });
        return {
          rank: index + 1,
          user,
          totalPoints: entry._sum.points || 0,
          totalPronostics: entry._count.id,
        };
      })
    );

    // Stats
    const stats = {
      totalRewards: rewards.length,
      redeemedRewards: rewards.filter((r) => r.isRedeemed).length,
      pendingRewards: rewards.filter((r) => !r.isRedeemed).length,
      exactScores: exactScorePronostics.length,
      exactScoresWithoutReward: exactScorePronostics.filter(
        (p) => !rewards.some((r) => r.matchId === p.matchId && r.userId === p.userId)
      ).length,
      winningTickets: winningTickets.length,
      redeemedTickets: winningTickets.filter((t) => t.isRedeemed).length,
      pendingTickets: winningTickets.filter((t) => !t.isRedeemed).length,
    };

    return NextResponse.json({
      success: true,
      rewards,
      exactScorePronostics,
      winningTickets,
      leaderboard: leaderboardWithUsers,
      stats,
    });
  } catch (error) {
    console.error("Error fetching rewards:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
