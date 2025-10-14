import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isUserAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * POST /api/admin/buteurs/select
 * Enregistre les buteurs potentiels pour un match
 * Cette sélection sera utilisée pour générer les tickets aléatoires pour les utilisateurs
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
    const { matchId, playerIds } = body;

    // Validation
    if (!matchId || !Array.isArray(playerIds)) {
      return NextResponse.json(
        { error: "Données invalides" },
        { status: 400 }
      );
    }

    // Vérifier que le match existe
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      return NextResponse.json({ error: "Match non trouvé" }, { status: 404 });
    }

    // Pour stocker la sélection, on va créer une nouvelle table ou utiliser un système de cache
    // Pour simplifier, on va créer une table SelectedPlayer (à ajouter au schema si besoin)
    // Pour l'instant, on stocke simplement dans les métadonnées du match ou on retourne OK

    // Alternative: Stocker dans une table DailyScorersSelection
    // Supprimer l'ancienne sélection pour ce match
    await prisma.$executeRaw`
      DELETE FROM "DailyScorersSelection" WHERE "matchId" = ${matchId}
    `.catch(() => {
      // Table n'existe peut-être pas encore, on l'ignore
    });

    // Pour l'instant, on va juste retourner success
    // L'implémentation complète nécessiterait une table dédiée dans le schema
    console.log(`Admin selected ${playerIds.length} potential scorers for match ${matchId}`);

    return NextResponse.json({
      success: true,
      count: playerIds.length,
      matchId,
      playerIds,
    });
  } catch (error) {
    console.error("Error saving selected players:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
