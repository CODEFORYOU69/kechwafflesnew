import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/admin/matches/create
 * Crée un nouveau match (pour les phases finales)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      matchNumber,
      phase,
      homeTeamId,
      awayTeamId,
      scheduledAt,
      venue,
      city,
    } = body;

    // Validation
    if (!matchNumber || !phase || !homeTeamId || !awayTeamId || !scheduledAt) {
      return NextResponse.json(
        { success: false, error: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 }
      );
    }

    // Vérifier que le numéro de match n'existe pas déjà
    const existingMatch = await prisma.match.findUnique({
      where: { matchNumber: parseInt(matchNumber) },
    });

    if (existingMatch) {
      return NextResponse.json(
        { success: false, error: `Le match #${matchNumber} existe déjà` },
        { status: 400 }
      );
    }

    // Vérifier que les équipes existent
    const homeTeam = await prisma.team.findUnique({ where: { id: homeTeamId } });
    const awayTeam = await prisma.team.findUnique({ where: { id: awayTeamId } });

    if (!homeTeam || !awayTeam) {
      return NextResponse.json(
        { success: false, error: "Équipe non trouvée" },
        { status: 400 }
      );
    }

    // Créer le match
    const match = await prisma.match.create({
      data: {
        matchNumber: parseInt(matchNumber),
        phase,
        homeTeamId,
        awayTeamId,
        scheduledAt: new Date(scheduledAt),
        venue: venue || null,
        city: city || null,
        isFinished: false,
        lockPronostics: false,
      },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    return NextResponse.json({
      success: true,
      match: {
        id: match.id,
        matchNumber: match.matchNumber,
        phase: match.phase,
        homeTeam: match.homeTeam.nameFr,
        awayTeam: match.awayTeam.nameFr,
        scheduledAt: match.scheduledAt,
      },
    });
  } catch (error) {
    console.error("Error creating match:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la création du match" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/matches/create
 * Récupère la liste des équipes et le prochain numéro de match disponible
 */
export async function GET() {
  try {
    // Récupérer toutes les équipes
    const teams = await prisma.team.findMany({
      orderBy: { nameFr: "asc" },
      select: {
        id: true,
        name: true,
        nameFr: true,
        code: true,
        flag: true,
      },
    });

    // Récupérer le prochain numéro de match disponible
    const lastMatch = await prisma.match.findFirst({
      orderBy: { matchNumber: "desc" },
      select: { matchNumber: true },
    });

    const nextMatchNumber = (lastMatch?.matchNumber || 0) + 1;

    return NextResponse.json({
      success: true,
      teams,
      nextMatchNumber,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
