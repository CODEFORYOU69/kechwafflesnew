/**
 * Script pour ajouter les Potato Waffles à la base de données
 */

import { PrismaClient } from "@prisma/client";
import { menuProducts } from "../lib/menu-data";

const prisma = new PrismaClient();

async function syncPotatoWafflesToDB() {
  console.log("🥔 Synchronisation des Potato Waffles vers la base de données...\n");

  // Filtrer uniquement les Potato Waffles
  const potatoWaffles = menuProducts.filter(
    (p) => p.category === "Potato Waffles"
  );

  console.log(`📊 ${potatoWaffles.length} Potato Waffle(s) trouvé(s) dans menu-data.ts\n`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const product of potatoWaffles) {
    try {
      // Vérifier si le produit existe déjà
      const existing = await prisma.product.findUnique({
        where: { sku: product.sku },
      });

      if (existing) {
        console.log(`⏭️  ${product.name} existe déjà (SKU: ${product.sku})`);
        skipped++;
        continue;
      }

      // Créer le produit
      await prisma.product.create({
        data: {
          handle: product.handle,
          sku: product.sku,
          name: product.name,
          category: product.category,
          description: product.description || null,
          image: product.image || null,
          price: product.price || null,
          isModifier: product.isModifier || false,
          hasTax: product.hasTax !== false,
          isActive: true,
          outOfStock: false,
          displayOrder: 0,
          syncSource: "MANUAL",
          // Créer un variant par défaut si prix sans variants
          variants: product.price
            ? {
                create: [
                  {
                    price: product.price,
                    isActive: true,
                  },
                ],
              }
            : undefined,
        },
      });

      console.log(`✅ ${product.name} créé (SKU: ${product.sku})`);
      created++;
    } catch (error) {
      console.error(`❌ Erreur pour ${product.name}:`, error);
      errors++;
    }
  }

  console.log("\n📈 Résultats de la synchronisation:");
  console.log(`✅ Créés: ${created}`);
  console.log(`⏭️  Ignorés (déjà existants): ${skipped}`);
  console.log(`❌ Erreurs: ${errors}`);
  console.log(`📊 Total: ${potatoWaffles.length}`);
}

syncPotatoWafflesToDB()
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
