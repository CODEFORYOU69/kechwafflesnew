import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { createMemberCard } from "@/lib/loyalty/member-card";
import { isAdmin } from "@/lib/admin-check";

/**
 * POST: Créer des cartes membres pour tous les utilisateurs qui n'en ont pas
 */
export async function POST() {
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

    // Trouver tous les utilisateurs sans carte membre
    const usersWithoutCard = await prisma.user.findMany({
      where: {
        memberCard: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    console.log(`🔄 ${usersWithoutCard.length} utilisateurs sans carte membre trouvés`);

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Créer les cartes membres
    for (const user of usersWithoutCard) {
      try {
        await createMemberCard(user.id);
        results.success++;
        console.log(`✅ Carte créée pour ${user.name} (${user.email})`);
      } catch (error) {
        results.failed++;
        const errorMsg = `❌ Erreur pour ${user.name}: ${error instanceof Error ? error.message : "Unknown error"}`;
        results.errors.push(errorMsg);
        console.error(errorMsg);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Cartes membres créées avec succès`,
      stats: {
        total: usersWithoutCard.length,
        created: results.success,
        failed: results.failed,
      },
      errors: results.errors,
    });
  } catch (error) {
    console.error("❌ Erreur sync cartes membres:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
