import { PrismaClient } from "@prisma/client";
import { createLoyverseItem } from "../lib/loyalty/loyverse";

const prisma = new PrismaClient();

/**
 * Script pour synchroniser les Potato Waffles vers Loyverse
 * Usage: pnpm tsx scripts/sync-potato-waffles-to-loyverse.ts
 */

async function syncPotatoWafflesToLoyverse() {
  console.log("🥔 Synchronisation des Potato Waffles vers Loyverse...\n");

  try {
    // 1. Créer la catégorie "Potato Waffles" dans Loyverse
    console.log("📂 Création de la catégorie 'Potato Waffles' dans Loyverse...");
    const categoryId = await createPotatoWafflesCategory();
    console.log(`✅ Catégorie créée avec l'ID: ${categoryId}\n`);

    // 2. Récupérer tous les produits Potato Waffles depuis la DB
    const products = await prisma.product.findMany({
      where: {
        category: "Potato Waffles",
      },
      include: {
        variants: {
          where: { isActive: true },
        },
      },
    });

    console.log(`📦 ${products.length} Potato Waffles à synchroniser\n`);

    const stats = {
      created: 0,
      skipped: 0,
      errors: 0,
    };

    for (const product of products) {
      try {
        console.log(`\n🔄 Traitement: ${product.name} (${product.sku})`);

        // Vérifier si le produit existe déjà dans Loyverse
        if (product.loyverseItemId) {
          console.log(`   ⏭️  Déjà synchronisé (ID Loyverse: ${product.loyverseItemId})`);
          stats.skipped++;
          continue;
        }

        // Créer un nouvel item dans Loyverse
        console.log(`   📝 Création dans Loyverse...`);

        // Préparer les variantes (s'il y en a)
        const variantData = product.variants.map((variant) => ({
          sku: variant.variantSku || product.sku,
          price: variant.price,
          option1_value: variant.option1Value || undefined,
          option2_value: variant.option2Value || undefined,
        }));

        const loyverseItem = await createLoyverseItem({
          name: product.name,
          sku: product.sku,
          price: product.variants[0]?.price || product.price || 0,
          option1_name: product.variants[0]?.option1Name || undefined,
          option2_name: product.variants[0]?.option2Name || undefined,
          variants: variantData.length > 0 ? variantData : undefined,
          category_id: categoryId, // Associer à la catégorie Potato Waffles
        });

        // Sauvegarder l'ID Loyverse dans notre DB
        await prisma.product.update({
          where: { id: product.id },
          data: {
            loyverseItemId: loyverseItem.id,
            lastSyncAt: new Date(),
            syncSource: "LOYVERSE",
          },
        });

        // Sauvegarder les IDs des variants
        if (loyverseItem.variants && loyverseItem.variants.length > 0) {
          for (let i = 0; i < loyverseItem.variants.length; i++) {
            const loyverseVariant = loyverseItem.variants[i];
            const dbVariant = product.variants[i];

            if (dbVariant) {
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
      } catch (error) {
        console.error(`   ❌ Erreur:`, error);
        stats.errors++;
      }
    }

    console.log("\n📈 Résultats de la synchronisation:");
    console.log(`✅ Créés: ${stats.created}`);
    console.log(`⏭️  Ignorés (déjà synchronisés): ${stats.skipped}`);
    console.log(`❌ Erreurs: ${stats.errors}`);
    console.log(`📊 Total: ${products.length}`);
  } catch (error) {
    console.error("❌ Erreur fatale:", error);
    throw error;
  }
}

/**
 * Crée la catégorie "Potato Waffles" dans Loyverse
 * @returns L'ID de la catégorie créée
 */
async function createPotatoWafflesCategory(): Promise<string> {
  const config = await prisma.loyverseConfig.findUnique({
    where: { id: "singleton" },
  });

  if (!config) {
    throw new Error("Loyverse non connecté");
  }

  // Vérifier si la catégorie existe déjà
  const existingCategoriesResponse = await fetch(
    "https://api.loyverse.com/v1.0/categories",
    {
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (existingCategoriesResponse.ok) {
    const existingCategories = await existingCategoriesResponse.json();
    const potatoWaffleCategory = existingCategories.categories?.find(
      (cat: { name: string }) => cat.name === "Potato Waffles"
    );

    if (potatoWaffleCategory) {
      console.log(`ℹ️  La catégorie "Potato Waffles" existe déjà`);
      return potatoWaffleCategory.id;
    }
  }

  // Créer la catégorie
  const response = await fetch("https://api.loyverse.com/v1.0/categories", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Potato Waffles",
      color: "ORANGE",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Erreur création catégorie Loyverse (${response.status}): ${errorText}`
    );
  }

  const category = await response.json();
  return category.id;
}

syncPotatoWafflesToLoyverse()
  .then(() => {
    console.log("\n✅ Synchronisation terminée avec succès!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Erreur lors de la synchronisation:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
