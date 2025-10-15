import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-check";
import { checkTicketsAfterMatch } from "@/lib/concours/buteur-ticket";

/**
 * POST: Enregistre les buteurs d'un match et vérifie les tickets gagnants
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !(await isAdmin(session.user.id))) {
      return NextResponse.json(
        { success: false, message: "Non autorisé" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { matchId, scorers } = body;

    if (!matchId || !Array.isArray(scorers)) {
      return NextResponse.json(
        { success: false, message: "matchId et scorers requis" },
        { status: 400 }
      );
    }

    // Vérifier que le match existe et est terminé
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      return NextResponse.json(
        { success: false, message: "Match introuvable" },
        { status: 404 }
      );
    }

    if (!match.isFinished) {
      return NextResponse.json(
        { success: false, message: "Le match n'est pas encore terminé" },
        { status: 400 }
      );
    }

    // Mettre à jour les buts des joueurs
    for (const scorer of scorers) {
      await prisma.player.update({
        where: { id: scorer.playerId },
        data: { goals: scorer.goals },
      });
    }

    console.log(`✅ ${scorers.length} buteur(s) enregistré(s) pour le match ${matchId}`);

    // Vérifier les tickets gagnants
    const ticketResults = await checkTicketsAfterMatch(matchId);

    console.log(
      `✅ Tickets vérifiés: ${ticketResults.totalTickets}, gagnants: ${ticketResults.winnersCount}`
    );

    return NextResponse.json({
      success: true,
      message: "Buteurs enregistrés et tickets vérifiés",
      scorers: scorers.length,
      totalTickets: ticketResults.totalTickets,
      winnersCount: ticketResults.winnersCount,
      winners: ticketResults.winners,
    });
  } catch (error) {
    console.error("❌ Erreur enregistrement buteurs:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
