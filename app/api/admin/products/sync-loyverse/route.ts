import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isUserAdmin } from "@/lib/admin";
import { getLoyverseItems } from "@/lib/loyalty/loyverse";
import { menuProducts } from "@/lib/menu-data";

/**
 * POST: Synchronise les produits depuis Loyverse vers la base de données
 * Enrichit avec les données locales (images, descriptions) depuis menu-data.ts
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

    // Récupérer tous les items depuis Loyverse
    console.log("📥 Récupération des items depuis Loyverse...");
    const loyverseItems = await getLoyverseItems();

    console.log(`✅ ${loyverseItems.length} items récupérés depuis Loyverse`);

    const stats = {
      total: loyverseItems.length,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [] as string[],
    };

    // Mapper les produits par SKU depuis menu-data.ts pour enrichissement
    const menuDataMap = new Map(
      menuProducts.map((p) => [p.sku, p])
    );

    // Traiter chaque item Loyverse en batch
    for (const loyverseItem of loyverseItems) {
      try {
        const sku = loyverseItem.reference_id || loyverseItem.variants[0]?.sku;

        if (!sku) {
          console.warn(`⚠️ Item sans SKU: ${loyverseItem.item_name}`);
          stats.skipped++;
          continue;
        }

        // Récupérer les données d'enrichissement depuis menu-data.ts
        const menuData = menuDataMap.get(sku);

        const productData = {
          handle: menuData?.handle || sku.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          sku,
          name: loyverseItem.item_name,
          category: menuData?.category || "Autres",
          description: menuData?.description || null,
          image: menuData?.image || null,
          isModifier: menuData?.isModifier || false,
          hasTax: menuData?.hasTax !== false,
          isActive: true,
          loyverseItemId: loyverseItem.id,
          lastSyncAt: new Date(),
          syncSource: "LOYVERSE" as const,
          price: null as number | null,
        };

        // Déterminer le prix
        if (loyverseItem.variants && loyverseItem.variants.length > 0) {
          if (loyverseItem.variants.length === 1 && !loyverseItem.option1_name) {
            // Un seul variant sans options = produit simple
            productData.price = parseFloat(loyverseItem.variants[0].default_price);
          }
        }

        // Upsert du produit (create or update) en une seule requête
        const product = await prisma.product.upsert({
          where: { sku },
          create: productData,
          update: productData,
        });

        // Supprimer les anciens variants et créer les nouveaux en une transaction
        await prisma.$transaction([
          prisma.productVariant.deleteMany({
            where: { productId: product.id },
          }),
          ...loyverseItem.variants.map((loyverseVariant) =>
            prisma.productVariant.create({
              data: {
                productId: product.id,
                option1Name: loyverseItem.option1_name || null,
                option1Value: loyverseVariant.option1_value || null,
                option2Name: loyverseItem.option2_name || null,
                option2Value: loyverseVariant.option2_value || null,
                price: parseFloat(loyverseVariant.default_price),
                variantSku: loyverseVariant.sku || null,
                loyverseVariantId: loyverseVariant.variant_id,
                isActive: true,
              },
            })
          ),
        ]);

        stats.created++;
        if (stats.created % 10 === 0) {
          console.log(`✅ Synchronisé ${stats.created}/${loyverseItems.length} produits...`);
        }
      } catch (error) {
        console.error(`❌ Erreur pour ${loyverseItem.item_name}:`, error);
        stats.errors.push(
          `${loyverseItem.item_name}: ${error instanceof Error ? error.message : "Erreur inconnue"}`
        );
      }
    }

    console.log("🎉 Synchronisation terminée", stats);

    return NextResponse.json({
      success: true,
      message: "Synchronisation avec Loyverse terminée",
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
