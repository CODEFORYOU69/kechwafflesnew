/**
 * Script pour mettre à jour les images des produits dans la base de données
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateProductImages() {
  console.log("🖼️  Mise à jour des images des produits...\n");

  try {
    // 1. Mettre à jour toutes les Pizza Waffles avec wafflepizza.png
    console.log("📦 Mise à jour des Pizza Waffles...");
    const pizzaWafflesUpdated = await prisma.product.updateMany({
      where: {
        category: "Pizza Waffles",
      },
      data: {
        image: "wafflepizza.png",
      },
    });
    console.log(`✅ ${pizzaWafflesUpdated.count} Pizza Waffles mises à jour\n`);

    // 2. Mettre à jour les modificateurs (extras)
    console.log("📦 Mise à jour des modificateurs...");

    const modificateursUpdates = [
      { sku: "EXT-CHA", image: "extrachampignon.png" },
      { sku: "EXT-JAM", image: "extrajambon.png" },
      { sku: "EXT-LEG", image: "extralegumegrille.png" },
      { sku: "EXT-MOZ", image: "extramozza.png" },
      { sku: "EXT-OLI", image: "extraolive.png" },
      { sku: "EXT-POU", image: "extrapoulet.png" },
      { sku: "EXT-THO", image: "extrathon.png" },
      { sku: "EXT-VHA", image: "extraviandehachée.png" },
      { sku: "SAU-GRU", image: "saucegruyere.png" },
    ];

    let modificateursCount = 0;
    for (const update of modificateursUpdates) {
      const result = await prisma.product.updateMany({
        where: { sku: update.sku },
        data: { image: update.image },
      });
      modificateursCount += result.count;
      if (result.count > 0) {
        console.log(`  ✅ ${update.sku}: ${update.image}`);
      }
    }
    console.log(`\n✅ ${modificateursCount} modificateurs mis à jour\n`);

    console.log("📊 Résumé:");
    console.log(`  - Pizza Waffles: ${pizzaWafflesUpdated.count}`);
    console.log(`  - Modificateurs: ${modificateursCount}`);
    console.log(`  - Total: ${pizzaWafflesUpdated.count + modificateursCount}`);
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour:", error);
    throw error;
  }
}

updateProductImages()
  .then(() => {
    console.log("\n✅ Mise à jour terminée avec succès!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Erreur:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
