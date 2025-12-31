import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/print-ticket?code=BUT-XXXXXX
 * Récupère les données d'un ticket pour impression
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Code ticket requis" },
        { status: 400 }
      );
    }

    const ticket = await prisma.buteurTicket.findUnique({
      where: { ticketCode: code },
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
    });

    if (!ticket) {
      return NextResponse.json(
        { success: false, message: "Ticket non trouvé" },
        { status: 404 }
      );
    }

    // Marquer comme imprimé
    await prisma.buteurTicket.update({
      where: { id: ticket.id },
      data: { isPrinted: true },
    });

    return NextResponse.json({
      success: true,
      ticket: {
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
      },
    });
  } catch (error) {
    console.error("Error fetching ticket for print:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
