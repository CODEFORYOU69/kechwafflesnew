import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/print-ticket/pending
 * Récupère les tickets non imprimés (pour auto-impression)
 */
export async function GET() {
  try {
    const tickets = await prisma.buteurTicket.findMany({
      where: {
        isPrinted: false,
      },
      include: {
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
      take: 10, // Limiter à 10 tickets
    });

    return NextResponse.json({
      success: true,
      tickets: tickets.map((ticket) => ({
        ticketCode: ticket.ticketCode,
        playerName: ticket.player.nameFr,
        playerNumber: ticket.player.number,
        teamName: ticket.player.team.nameFr,
        teamFlag: ticket.player.team.flag,
        matchHome: ticket.match.homeTeam.nameFr,
        matchAway: ticket.match.awayTeam.nameFr,
        matchHomeFlag: ticket.match.homeTeam.flag,
        matchAwayFlag: ticket.match.awayTeam.flag,
        matchDate: ticket.match.scheduledAt.toISOString(),
        createdAt: ticket.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching pending tickets:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
