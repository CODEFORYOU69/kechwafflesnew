import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isUserAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * GET /api/admin/competition
 * Récupère le statut de la compétition
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const isAdmin = await isUserAdmin(session.user.id);
    if (!isAdmin) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const competition = await prisma.competition.findFirst();

    return NextResponse.json({ isActive: competition?.isActive ?? false });
  } catch (error) {
    console.error("Error fetching competition:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/competition
 * Active/désactive la compétition (Concours CAN)
 */
export async function PATCH(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const isAdmin = await isUserAdmin(session.user.id);
    if (!isAdmin) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const { isActive } = await request.json();

    if (typeof isActive !== "boolean") {
      return NextResponse.json({ error: "isActive doit être un booléen" }, { status: 400 });
    }

    const competition = await prisma.competition.findFirst();

    let updated;
    if (competition) {
      updated = await prisma.competition.update({
        where: { id: competition.id },
        data: { isActive },
      });
    } else {
      updated = await prisma.competition.create({
        data: {
          name: "CAN 2025",
          isActive,
          startDate: new Date(),
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          finalPronosticsDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        },
      });
    }

    return NextResponse.json({ isActive: updated.isActive });
  } catch (error) {
    console.error("Error toggling competition:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
