import { PrismaClient } from "@prisma/client";
import {
  createLoyverseItem,
  updateLoyverseItem,
} from "../lib/loyalty/loyverse";

const prisma = new PrismaClient();

/**
 * Script pour synchroniser les Pizza Waffles et suppléments vers Loyverse
 * Usage: pnpm tsx scripts/sync-pizza-waffles-to-loyverse.ts
 */

async function syncToLoyverse() {
  console.log("🍕 Synchronisation des Pizza Waffles vers Loyverse...\n");

  try {
    // Récupérer tous les produits Pizza Waffles et suppléments depuis la DB
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { category: "Pizza Waffles" },
          {
            AND: [
              { category: "Modificateurs" },
              {
                sku: {
                  in: [
                    "SAU-GRU", // Sauce Gruyère
                    "EXT-MOZ",
                    "EXT-STO",
                    "EXT-LEG",
                    "EXT-CHA",
                    "EXT-OLI",
                    "EXT-POU",
                    "EXT-VHA",
                    "EXT-PEP",
                    "EXT-JAM",
                    "EXT-THO",
                  ],
                },
              },
            ],
          },
        ],
      },
      include: {
        variants: {
          where: { isActive: true },
        },
      },
    });

    console.log(`📦 ${products.length} produits à synchroniser\n`);

    const stats = {
      created: 0,
      updated: 0,
      skipped: 0,
      errors: 0,
    };

    for (const product of products) {
      try {
        console.log(`\n🔄 Traitement: ${product.name} (${product.sku})`);

        // Vérifier si le produit existe déjà dans Loyverse
        if (product.loyverseItemId) {
          console.log(`   ℹ️  Existe déjà dans Loyverse (ID: ${product.loyverseItemId})`);

          // Mettre à jour l'item existant
          await updateLoyverseItem(product.loyverseItemId, {
            name: product.name,
            sku: product.sku,
            category_id: undefined, // À adapter selon vos catégories Loyverse
          });

          console.log(`   ✅ Mis à jour dans Loyverse`);
          stats.updated++;
        } else {
          // Créer un nouvel item dans Loyverse
          console.log(`   📝 Création dans Loyverse...`);

          // Préparer les variantes
          const variantData = product.variants.map((variant) => ({
            sku: variant.variantSku || product.sku,
            price: variant.price,
            option1_value: variant.option1Value || undefined,
            option2_value: variant.option2Value || undefined,
          }));

          const loyverseItem = await createLoyverseItem({
            name: product.name,
            sku: product.sku,
            price: product.variants[0]?.price || 0,
            option1_name: product.variants[0]?.option1Name || undefined,
            option2_name: product.variants[0]?.option2Name || undefined,
            variants: variantData.length > 0 ? variantData : undefined,
          });

          // Mettre à jour la DB avec l'ID Loyverse
          await prisma.product.update({
            where: { id: product.id },
            data: {
              loyverseItemId: loyverseItem.id,
              lastSyncAt: new Date(),
              syncSource: "MANUAL",
            },
          });

          // Mettre à jour les variantes
          if (loyverseItem.variants && loyverseItem.variants.length > 0) {
            for (let i = 0; i < product.variants.length; i++) {
              const dbVariant = product.variants[i];
              const loyverseVariant = loyverseItem.variants[i];

              if (loyverseVariant) {
                await prisma.productVariant.update({
                  where: { id: dbVariant.id },
                  data: {
                    loyverseVariantId: loyverseVariant.variant_id,
                  },
                });
              }
            }
          }

          console.log(`   ✅ Créé dans Loyverse (ID: ${loyverseItem.id})`);
          stats.created++;
        }
      } catch (error: any) {
        console.error(`   ❌ Erreur pour ${product.name}:`, error.message);
        stats.errors++;
      }
    }

    console.log("\n" + "=".repeat(80));
    console.log("📊 RÉSUMÉ DE LA SYNCHRONISATION");
    console.log("=".repeat(80));
    console.log(`✅ Créés:     ${stats.created}`);
    console.log(`🔄 Mis à jour: ${stats.updated}`);
    console.log(`⏭️  Ignorés:   ${stats.skipped}`);
    console.log(`❌ Erreurs:   ${stats.errors}`);
    console.log("=".repeat(80));

    if (stats.errors === 0) {
      console.log("\n✨ Synchronisation terminée avec succès !");
    } else {
      console.log("\n⚠️  Synchronisation terminée avec des erreurs");
    }
  } catch (error) {
    console.error("❌ Erreur fatale:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Demander confirmation avant de lancer
console.log("⚠️  ATTENTION ⚠️");
console.log("Ce script va créer/mettre à jour les produits suivants dans Loyverse:");
console.log("- 9 Pizza Waffles");
console.log("- 1 Sauce Gruyère (avec 4 variantes)");
console.log("- 10 Suppléments pizza");
console.log("\nAppuyez sur Ctrl+C pour annuler, ou attendez 3 secondes pour continuer...\n");

setTimeout(() => {
  syncToLoyverse();
}, 3000);
