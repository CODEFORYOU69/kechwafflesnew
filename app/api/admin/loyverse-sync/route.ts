import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-check";
import { createLoyverseCustomer } from "@/lib/loyalty/loyverse";

/**
 * POST: Synchronise les cartes membres avec Loyverse
 * Crée des customers Loyverse pour toutes les cartes qui n'en ont pas
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

    // Vérifier que Loyverse est connecté
    const loyverseConfig = await prisma.loyverseConfig.findUnique({
      where: { id: "singleton" },
    });

    if (!loyverseConfig) {
      return NextResponse.json(
        {
          success: false,
          message: "Loyverse n'est pas connecté. Connectez-vous d'abord via /admin/loyverse",
        },
        { status: 400 }
      );
    }

    // Trouver toutes les cartes membres sans customer Loyverse
    const cardsWithoutCustomer = await prisma.memberCard.findMany({
      where: {
        loyverseCustomerId: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    console.log(
      `🔄 ${cardsWithoutCustomer.length} cartes membres sans customer Loyverse trouvées`
    );

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Créer les customers Loyverse
    for (const card of cardsWithoutCustomer) {
      try {
        const loyverseCustomerId = await createLoyverseCustomer({
          name: card.user.name,
          email: card.user.email,
          cardNumber: card.cardNumber,
        });

        // Mettre à jour la carte avec le customer ID
        await prisma.memberCard.update({
          where: { id: card.id },
          data: { loyverseCustomerId },
        });

        results.success++;
        console.log(
          `✅ Customer Loyverse créé pour ${card.user.name} (${card.cardNumber})`
        );
      } catch (error) {
        results.failed++;
        const errorMsg = `❌ Erreur pour ${card.user.name}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`;
        results.errors.push(errorMsg);
        console.error(errorMsg);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synchronisation Loyverse terminée`,
      stats: {
        total: cardsWithoutCustomer.length,
        created: results.success,
        failed: results.failed,
      },
      errors: results.errors,
    });
  } catch (error) {
    console.error("❌ Erreur sync Loyverse:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Erreur serveur",
      },
      { status: 500 }
    );
  }
}

/**
 * GET: Obtient le statut de synchronisation
 */
export async function GET() {
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

    const totalCards = await prisma.memberCard.count();
    const cardsWithCustomer = await prisma.memberCard.count({
      where: {
        loyverseCustomerId: { not: null },
      },
    });
    const cardsWithoutCustomer = totalCards - cardsWithCustomer;

    return NextResponse.json({
      success: true,
      stats: {
        totalCards,
        cardsWithCustomer,
        cardsWithoutCustomer,
      },
    });
  } catch (error) {
    console.error("❌ Erreur statut sync:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
