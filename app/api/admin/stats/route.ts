import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isUserAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * GET /api/admin/stats
 * Récupère les statistiques globales pour le dashboard admin
 */
export async function GET() {
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

    // Calculer les statistiques
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Statistiques des matchs
    const [totalMatches, finishedMatches, upcomingMatches, todayMatches] = await Promise.all([
      prisma.match.count(),
      prisma.match.count({ where: { isFinished: true } }),
      prisma.match.count({ where: { isFinished: false } }),
      prisma.match.count({
        where: {
          scheduledAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
    ]);

    // Statistiques des utilisateurs
    const [totalUsers, usersWithPronostics, usersWithTickets] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          pronostics: {
            some: {},
          },
        },
      }),
      prisma.user.count({
        where: {
          buteurTickets: {
            some: {},
          },
        },
      }),
    ]);

    // Statistiques des pronostics
    const [totalPronostics, exactScores, correctWinners] = await Promise.all([
      prisma.pronostic.count(),
      prisma.pronostic.count({ where: { isExactScore: true } }),
      prisma.pronostic.count({ where: { isCorrectWinner: true } }),
    ]);

    // Statistiques des tickets buteur
    const [totalTickets, winningTickets, redeemedTickets] = await Promise.all([
      prisma.buteurTicket.count(),
      prisma.buteurTicket.count({ where: { hasWon: true } }),
      prisma.buteurTicket.count({
        where: {
          hasWon: true,
          isRedeemed: true,
        },
      }),
    ]);

    const stats = {
      matches: {
        total: totalMatches,
        finished: finishedMatches,
        upcoming: upcomingMatches,
        today: todayMatches,
      },
      users: {
        total: totalUsers,
        withPronostics: usersWithPronostics,
        withTickets: usersWithTickets,
      },
      pronostics: {
        total: totalPronostics,
        exactScores: exactScores,
        correctWinners: correctWinners,
      },
      tickets: {
        total: totalTickets,
        winners: winningTickets,
        redeemed: redeemedTickets,
        pending: winningTickets - redeemedTickets,
      },
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
