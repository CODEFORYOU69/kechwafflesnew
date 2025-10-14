import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isUserAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * GET /api/admin/buteurs/selected?matchId=xxx
 * Récupère les joueurs déjà sélectionnés comme buteurs potentiels pour un match
 */
export async function GET(request: NextRequest) {
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

    // Récupérer le matchId
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get("matchId");

    if (!matchId) {
      return NextResponse.json({ error: "matchId manquant" }, { status: 400 });
    }

    // Pour l'instant, on va stocker la sélection dans une table temporaire
    // ou utiliser les tickets existants pour déterminer quels joueurs sont sélectionnés
    // Simplifié: retourner les IDs des joueurs qui ont déjà des tickets pour ce match
    const existingTickets = await prisma.buteurTicket.findMany({
      where: { matchId },
      select: { playerId: true },
      distinct: ["playerId"],
    });

    const playerIds = existingTickets.map((t: { playerId: string }) => t.playerId);

    return NextResponse.json({ playerIds });
  } catch (error) {
    console.error("Error fetching selected players:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
