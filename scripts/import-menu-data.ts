/**
 * Script pour importer les données depuis menu-data.ts vers la base de données
 * Usage: pnpm tsx scripts/import-menu-data.ts
 */

import { PrismaClient } from "@prisma/client";
import { menuProducts } from "../lib/menu-data";

const prisma = new PrismaClient();

async function importMenuData() {
  console.log("🚀 Début de l'import des produits depuis menu-data.ts...");
  console.log(`📦 ${menuProducts.length} produits à importer\n`);

  const stats = {
    created: 0,
    updated: 0,
    errors: 0,
  };

  for (const product of menuProducts) {
    try {
      // Vérifier si le produit existe déjà
      const existing = await prisma.product.findUnique({
        where: { sku: product.sku },
        include: { variants: true },
      });

      const productData = {
        handle: product.handle,
        sku: product.sku,
        name: product.name,
        category: product.category,
        description: product.description || null,
        image: product.image || null,
        price: product.variants && product.variants.length > 0 ? null : product.price,
        isModifier: product.isModifier || false,
        hasTax: product.hasTax !== false,
        isActive: true,
        displayOrder: 0,
        syncSource: "MANUAL",
      };

      if (existing) {
        // Mise à jour
        await prisma.product.update({
          where: { id: existing.id },
          data: productData,
        });

        // Supprimer les anciens variants
        await prisma.productVariant.deleteMany({
          where: { productId: existing.id },
        });

        console.log(`♻️  Mis à jour: ${product.name}`);
        stats.updated++;
      } else {
        // Création
        await prisma.product.create({
          data: productData,
        });

        console.log(`✅ Créé: ${product.name}`);
        stats.created++;
      }

      // Récupérer le produit
      const dbProduct = await prisma.product.findUnique({
        where: { sku: product.sku },
      });

      if (!dbProduct) {
        throw new Error(`Produit non trouvé: ${product.sku}`);
      }

      // Créer les variants si présents
      if (product.variants && product.variants.length > 0) {
        for (const variant of product.variants) {
          await prisma.productVariant.create({
            data: {
              productId: dbProduct.id,
              option1Name: variant.option1Name || null,
              option1Value: variant.option1Value || null,
              option2Name: variant.option2Name || null,
              option2Value: variant.option2Value || null,
              price: variant.price,
              variantSku: null,
              isActive: true,
            },
          });
        }
      }
    } catch (error) {
      console.error(`❌ Erreur pour ${product.name}:`, error);
      stats.errors++;
    }
  }

  console.log("\n📊 Résultats de l'import:");
  console.log(`   ✅ Créés: ${stats.created}`);
  console.log(`   ♻️  Mis à jour: ${stats.updated}`);
  console.log(`   ❌ Erreurs: ${stats.errors}`);
  console.log(`   📦 Total: ${menuProducts.length}`);
}

importMenuData()
  .then(() => {
    console.log("\n🎉 Import terminé avec succès !");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Erreur fatale:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
