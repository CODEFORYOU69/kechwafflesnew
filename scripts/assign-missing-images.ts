/**
 * Script pour assigner des images existantes aux produits sans images
 * Usage: pnpm tsx scripts/assign-missing-images.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mapping des produits sans images vers des images existantes
const imageMapping: Record<string, string> = {
  // Cafés
  "CAP-SM": "cappuccino.png",
  "LAT-SM": "latte.png",

  // Laits chauds
  "CHA-H": "chailatté.png",
  "CHB-H": "chocolat blanc.png",
  "LCA-SM": "laitaromtisé.png",
  "LCH-SM": "laitchaud.png",
  "MAT-H": "matchahot.png",

  // Eaux & Soft
  "GLASS-COL": "bubbles.jpg",
  "GLASS-POM": "bubbles.jpg",
  "GLASS-TRO": "bubbles.jpg",
  "OULM-25V": "oulmes33.png",
  "SIDI-33": "sidiali33.png",

  // Modificateurs
  "EXT-SOJ": "laitvegetal.png",
  "OPT-FRA": "topfraises.png",
  "SIR-VAN": "sirops.png",
};

async function assignMissingImages() {
  console.log("🖼️  Assignation des images manquantes...\n");

  let updated = 0;

  for (const [sku, image] of Object.entries(imageMapping)) {
    try {
      const product = await prisma.product.findUnique({
        where: { sku },
      });

      if (!product) {
        console.log(`⚠️  Produit ${sku} non trouvé`);
        continue;
      }

      if (product.image) {
        console.log(`ℹ️  ${sku} a déjà une image: ${product.image}`);
        continue;
      }

      await prisma.product.update({
        where: { sku },
        data: { image },
      });

      console.log(`✅ ${sku} (${product.name}) → ${image}`);
      updated++;
    } catch (error) {
      console.error(`❌ Erreur pour ${sku}:`, error);
    }
  }

  console.log(`\n🎉 ${updated} images assignées !`);
}

assignMissingImages()
  .then(() => {
    console.log("\n✅ Terminé !");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Erreur:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
