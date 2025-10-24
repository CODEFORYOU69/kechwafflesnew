/**
 * Script pour ajouter le café Dalgona
 * Usage: pnpm tsx scripts/add-dalgona.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function addDalgona() {
  console.log("☕ Ajout du café Dalgona...\n");

  try {
    // Créer le produit
    const product = await prisma.product.create({
      data: {
        handle: "ice-dalgona",
        sku: "ICE-DAL",
        name: "Ice Dalgona",
        category: "Boissons Ice Lactées",
        description: "Café glacé fouetté style Dalgona",
        image: "DALGONA.png",
        price: null,
        isModifier: false,
        hasTax: true,
        isActive: true,
        syncSource: "MANUAL",
        // Créer un variant avec le prix
        variants: {
          create: {
            price: 25,
            isActive: true,
          },
        },
      },
      include: {
        variants: true,
      },
    });

    console.log("✅ Produit créé avec succès !");
    console.log(`   SKU: ${product.sku}`);
    console.log(`   Nom: ${product.name}`);
    console.log(`   Catégorie: ${product.category}`);
    console.log(`   Prix: ${product.variants[0].price} Dh`);
    console.log(`   Image: ${product.image}`);
  } catch (error) {
    console.error("❌ Erreur:", error);
    process.exit(1);
  }
}

addDalgona()
  .then(() => {
    console.log("\n🎉 Dalgona ajouté !");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Erreur:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
