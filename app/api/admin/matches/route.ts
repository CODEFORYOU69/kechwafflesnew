import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isUserAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * GET /api/admin/matches
 * Récupère tous les matchs pour l'admin
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

    // Récupérer tous les matchs avec les équipes
    const matches = await prisma.match.findMany({
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
        matchNumber: "asc",
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
