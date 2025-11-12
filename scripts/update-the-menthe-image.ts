/**
 * Script pour mettre à jour l'image du Thé à la Menthe dans la BDD
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateTheMentheImage() {
  console.log("🍵 Mise à jour de l'image du Thé à la Menthe...\n");

  try {
    const product = await prisma.product.update({
      where: {
        sku: "THE-MEN",
      },
      data: {
        image: "thémenthe.png",
      },
    });

    console.log(`✅ Image mise à jour: ${product.image}`);
    console.log(`   Produit: ${product.name}`);
  } catch (error) {
    console.error("❌ Erreur:", error);
    throw error;
  }
}

updateTheMentheImage()
  .then(() => {
    console.log("\n✅ Script terminé!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Erreur:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
