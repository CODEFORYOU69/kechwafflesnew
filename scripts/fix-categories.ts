/**
 * Script pour corriger les catégories des produits
 * Usage: pnpm tsx scripts/fix-categories.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mapping des SKU vers leurs vraies catégories
const categoryFixes: Record<string, string> = {
  // Boissons Lactées
  "CAP-SM": "Boissons - Boissons Lactées",
  "CHA-H": "Boissons - Boissons Lactées",
  "CHB-H": "Boissons - Boissons Lactées",
  "LCA-SM": "Boissons - Boissons Lactées",
  "LCH-SM": "Boissons - Boissons Lactées",
  "LAT-SM": "Boissons - Boissons Lactées",
  "MAT-H": "Boissons - Boissons Lactées",

  // Eaux & Soft Drinks
  "OULM-25V": "Eaux & Soft Drinks",
  "SIDI-33": "Eaux & Soft Drinks",
  "GLASS-COL": "Eaux & Soft Drinks",
  "GLASS-POM": "Eaux & Soft Drinks",
  "GLASS-TRO": "Eaux & Soft Drinks",

  // Modificateurs (pour ceux qui sont mal catégorisés)
  "EXT-SOJ": "Modificateurs",
  "OPT-FRA": "Modificateurs",
  "SIR-VAN": "Modificateurs",
};

async function fixCategories() {
  console.log("🔧 Correction des catégories...\n");

  let updated = 0;

  for (const [sku, newCategory] of Object.entries(categoryFixes)) {
    try {
      const product = await prisma.product.findUnique({
        where: { sku },
      });

      if (!product) {
        console.log(`⚠️  Produit ${sku} non trouvé`);
        continue;
      }

      if (product.category === newCategory) {
        console.log(`ℹ️  ${sku} (${product.name}) - déjà dans ${newCategory}`);
        continue;
      }

      await prisma.product.update({
        where: { sku },
        data: { category: newCategory },
      });

      console.log(`✅ ${sku} (${product.name})`);
      console.log(`   ${product.category} → ${newCategory}`);
      updated++;
    } catch (error) {
      console.error(`❌ Erreur pour ${sku}:`, error);
    }
  }

  console.log(`\n🎉 ${updated} catégories corrigées !`);
}

fixCategories()
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
