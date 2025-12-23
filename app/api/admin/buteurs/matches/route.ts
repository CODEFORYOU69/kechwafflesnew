import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { isUserAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * GET /api/admin/buteurs/matches
 * Récupère les matchs pour sélection des buteurs
 * ?finished=true : matchs terminés (pour enregistrer les buteurs)
 * ?finished=false ou pas de param : matchs non terminés
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

    // Récupérer le paramètre finished
    const { searchParams } = new URL(request.url);
    const finishedParam = searchParams.get("finished");
    const isFinished = finishedParam === "true";

    // Récupérer les matchs selon le filtre
    const matches = await prisma.match.findMany({
      where: {
        isFinished,
      },
      include: {
        homeTeam: {
          select: {
            id: true,
            name: true,
            nameFr: true,
            code: true,
            flag: true,
          },
        },
        awayTeam: {
          select: {
            id: true,
            name: true,
            nameFr: true,
            code: true,
            flag: true,
          },
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });

    return NextResponse.json({ matches });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
