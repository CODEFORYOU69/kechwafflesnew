import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isUserAdmin } from "@/lib/admin";
import { updateLoyverseVariantPrice } from "@/lib/loyalty/loyverse";

/**
 * POST: Synchronise les prix depuis l'app vers Loyverse
 * Pousse les prix modifiés dans l'app vers Loyverse
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const isAdmin = await isUserAdmin(session.user.id);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Accès admin requis" },
        { status: 403 }
      );
    }

    console.log("📤 Démarrage de la synchronisation App → Loyverse...");

    // Récupérer tous les produits qui ont un loyverseItemId
    const products = await prisma.product.findMany({
      where: {
        loyverseItemId: {
          not: null,
        },
      },
      include: {
        variants: {
          where: {
            loyverseVariantId: {
              not: null,
            },
          },
        },
      },
    });

    console.log(`📦 ${products.length} produits à synchroniser`);

    const stats = {
      total: 0,
      updated: 0,
      skipped: 0,
      errors: [] as string[],
    };

    // Synchroniser chaque variant avec Loyverse
    for (const product of products) {
      for (const variant of product.variants) {
        stats.total++;

        if (!variant.loyverseVariantId) {
          stats.skipped++;
          continue;
        }

        try {
          // Mettre à jour le prix dans Loyverse
          await updateLoyverseVariantPrice(
            variant.loyverseVariantId,
            variant.price
          );

          // Mettre à jour la date de dernière sync
          await prisma.product.update({
            where: { id: product.id },
            data: {
              lastSyncAt: new Date(),
              syncSource: "APP",
            },
          });

          stats.updated++;

          if (stats.updated % 10 === 0) {
            console.log(`✅ Synchronisé ${stats.updated}/${stats.total} variants...`);
          }
        } catch (error) {
          console.error(
            `❌ Erreur pour ${product.name} - ${variant.option1Value || "default"}:`,
            error
          );
          stats.errors.push(
            `${product.name} (${variant.option1Value || "default"}): ${
              error instanceof Error ? error.message : "Erreur inconnue"
            }`
          );
        }
      }
    }

    console.log("🎉 Synchronisation App → Loyverse terminée", stats);

    return NextResponse.json({
      success: true,
      message: "Synchronisation vers Loyverse terminée",
      stats,
      errors: stats.errors,
    });
  } catch (error) {
    console.error("❌ Erreur lors de la synchronisation:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la synchronisation",
        message: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
