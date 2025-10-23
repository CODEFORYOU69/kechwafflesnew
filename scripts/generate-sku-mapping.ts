/**
 * Script pour générer le mapping des SKU à corriger
 * Usage: pnpm tsx scripts/generate-sku-mapping.ts
 */

import { PrismaClient } from "@prisma/client";
import { menuProducts } from "../lib/menu-data";

const prisma = new PrismaClient();

async function generateMapping() {
  console.log("🔍 Génération du mapping SKU...\n");

  const dbProducts = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { name: "asc" },
  });

  console.log("📝 CORRECTIONS À FAIRE DANS menu-data.ts:\n");

  // Produits manquants : ceux dans menu-data mais pas en DB
  const menuDataSKUs = new Set(menuProducts.map((p) => p.sku));
  const dbSKUs = new Set(dbProducts.map((p) => p.sku));

  const missingInDB = menuProducts.filter((p) => !dbSKUs.has(p.sku));

  // Essayer de trouver les correspondances par nom
  const corrections: Array<{
    oldSKU: string;
    newSKU: string;
    name: string;
    hasVariants: boolean;
  }> = [];

  for (const menuProduct of missingInDB) {
    // Chercher par nom similaire
    const dbMatch = dbProducts.find((db) => {
      const menuName = menuProduct.name.toLowerCase().trim();
      const dbName = db.name.toLowerCase().trim();
      return menuName === dbName ||
             menuName.includes(dbName) ||
             dbName.includes(menuName);
    });

    if (dbMatch) {
      corrections.push({
        oldSKU: menuProduct.sku,
        newSKU: dbMatch.sku,
        name: menuProduct.name,
        hasVariants: (menuProduct.variants?.length || 0) > 0,
      });
    }
  }

  console.log(`✏️  ${corrections.length} SKU à corriger:\n`);

  corrections.forEach((c) => {
    console.log(`   ${c.oldSKU} → ${c.newSKU}`);
    console.log(`      Nom: ${c.name}`);
    console.log(`      Variants: ${c.hasVariants ? "Oui" : "Non"}`);
    console.log();
  });

  // Produits Loyverse sans correspondance
  const extraInDB = dbProducts.filter((p) => !menuDataSKUs.has(p.sku));

  console.log(`\n➕ ${extraInDB.length} produits en Loyverse sans correspondance dans menu-data:\n`);

  extraInDB.forEach((p) => {
    console.log(`   ${p.sku}: ${p.name} (catégorie: ${p.category})`);
  });

  return corrections;
}

generateMapping()
  .then((corrections) => {
    console.log(`\n✅ ${corrections.length} corrections identifiées !`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Erreur:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
