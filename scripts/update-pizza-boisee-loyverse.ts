/**
 * Script pour mettre à jour la Pizza Waffle Boisée dans Loyverse
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const LOYVERSE_API_URL = "https://api.loyverse.com/v1.0";
const LOYVERSE_ACCESS_TOKEN = process.env.LOYVERSE_ACCESS_TOKEN;

async function updatePizzaBoiseeInLoyverse() {
  console.log("🍕 Mise à jour de la Pizza Waffle Boisée dans Loyverse...\n");

  if (!LOYVERSE_ACCESS_TOKEN) {
    throw new Error("LOYVERSE_ACCESS_TOKEN not found in environment variables");
  }

  try {
    // Récupérer le produit de la BDD pour obtenir l'ID Loyverse
    const product = await prisma.product.findUnique({
      where: { sku: "PW-BOI" },
    });

    if (!product || !product.loyverseItemId) {
      throw new Error("Pizza Boisée not found in database or no Loyverse ID");
    }

    console.log(`📋 Produit trouvé: ${product.name}`);
    console.log(`   Loyverse ID: ${product.loyverseItemId}`);

    // Mettre à jour dans Loyverse
    const response = await fetch(
      `${LOYVERSE_API_URL}/items/${product.loyverseItemId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${LOYVERSE_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: "Poulet, mozzarella, poivron, pomme de terre + sauce gruyère généreuse",
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Loyverse API error: ${response.status} - ${errorText}`);
    }

    const updatedItem = await response.json();
    console.log(`✅ Mis à jour dans Loyverse: ${updatedItem.item_name}`);
    console.log(`   Nouvelle description: ${updatedItem.description}`);

    console.log("\n🎉 Mise à jour Loyverse terminée avec succès!");
  } catch (error) {
    console.error("❌ Erreur:", error);
    throw error;
  }
}

updatePizzaBoiseeInLoyverse()
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
