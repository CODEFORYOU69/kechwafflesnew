/**
 * Script pour mettre à jour la Pizza Waffle Boisée
 * Remplacer champignons par pomme de terre
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updatePizzaBoisee() {
  console.log("🍕 Mise à jour de la Pizza Waffle Boisée...\n");

  try {
    const updatedProduct = await prisma.product.update({
      where: {
        sku: "PW-BOI",
      },
      data: {
        description: "Poulet, mozzarella, poivron, pomme de terre + sauce gruyère généreuse",
      },
    });

    console.log(`✅ Mis à jour: ${updatedProduct.name}`);
    console.log(`   Nouvelle description: ${updatedProduct.description}`);

    console.log("\n🎉 Mise à jour terminée avec succès!");
  } catch (error) {
    console.error("❌ Erreur:", error);
    throw error;
  }
}

updatePizzaBoisee()
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
