/**
 * Script pour ajouter la Gaufre Liégeoise à la BDD
 * (Le produit existe déjà dans Loyverse)
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function addGaufreLiegeoiseDB() {
  console.log("🧇 Ajout de la Gaufre Liégeoise à la BDD...\n");

  try {
    // IDs Loyverse existants
    const loyverseItemId = "816085ca-7f4d-4161-aeab-7147a9b01cdf";
    const loyverseVariantId = "0fd2ee56-f7a4-4988-a1ce-5038b2896445";

    const product = await prisma.product.create({
      data: {
        handle: "gaufre-liegeoise",
        sku: "GAU-LIE",
        name: "Gaufre Liégeoise",
        category: "Desserts",
        description: "Authentique gaufre liégeoise avec perles de sucre caramélisées",
        image: "waffles.png",
        price: null,
        isActive: true,
        isModifier: false,
        displayOrder: 0,
        loyverseItemId: loyverseItemId,
        variants: {
          create: [
            {
              variantSku: "GAU-LIE",
              option1Name: null,
              option1Value: null,
              option2Name: null,
              option2Value: null,
              price: 30,
              isActive: true,
              loyverseVariantId: loyverseVariantId,
            },
          ],
        },
      },
      include: {
        variants: true,
      },
    });

    console.log(`✅ Créé dans la BDD: ${product.id}`);
    console.log(`   - Nom: ${product.name}`);
    console.log(`   - Prix: ${product.variants[0].price} Dh`);
    console.log(`   - Loyverse ID: ${product.loyverseItemId}`);

    console.log("\n🎉 Gaufre Liégeoise ajoutée avec succès!");
  } catch (error) {
    console.error("❌ Erreur:", error);
    throw error;
  }
}

addGaufreLiegeoiseDB()
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
