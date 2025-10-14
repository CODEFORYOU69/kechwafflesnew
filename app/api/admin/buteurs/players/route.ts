import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isUserAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * GET /api/admin/buteurs/players?matchId=xxx
 * Récupère les joueurs des deux équipes d'un match
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

    // Récupérer le match avec les équipes
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    if (!match) {
      return NextResponse.json({ error: "Match non trouvé" }, { status: 404 });
    }

    // Récupérer tous les joueurs des deux équipes
    const players = await prisma.player.findMany({
      where: {
        OR: [
          { teamId: match.homeTeamId },
          { teamId: match.awayTeamId },
        ],
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            nameFr: true,
            code: true,
            flag: true,
          },
        },
      },
      orderBy: [
        { teamId: "asc" },
        { number: "asc" },
      ],
    });

    return NextResponse.json({ players });
  } catch (error) {
    console.error("Error fetching players:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
