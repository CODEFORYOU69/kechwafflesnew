/**
 * Script pour vérifier l'état des produits en DB vs menu-data.ts
 * Usage: pnpm tsx scripts/check-products.ts
 */

import { PrismaClient } from "@prisma/client";
import { menuProducts } from "../lib/menu-data";

const prisma = new PrismaClient();

async function checkProducts() {
  console.log("🔍 Vérification des produits...\n");

  // Récupérer tous les produits de la DB
  const dbProducts = await prisma.product.findMany({
    include: {
      variants: true,
    },
    orderBy: { sku: "asc" },
  });

  console.log(`📦 Produits dans menu-data.ts: ${menuProducts.length}`);
  console.log(`💾 Produits dans la DB: ${dbProducts.length}\n`);

  // Comparer
  const menuDataSKUs = new Set(menuProducts.map((p) => p.sku));
  const dbSKUs = new Set(dbProducts.map((p) => p.sku));

  // Produits manquants dans la DB
  const missingInDB = menuProducts.filter((p) => !dbSKUs.has(p.sku));

  // Produits en DB mais pas dans menu-data
  const extraInDB = dbProducts.filter((p) => !menuDataSKUs.has(p.sku));

  // Produits avec images manquantes
  const missingImages = dbProducts.filter((p) => !p.image);

  // Produits avec images
  const withImages = dbProducts.filter((p) => p.image);

  console.log("📊 STATISTIQUES:\n");
  console.log(`✅ Produits synchronisés: ${dbProducts.length - missingInDB.length - extraInDB.length}`);
  console.log(`❌ Manquants dans DB: ${missingInDB.length}`);
  console.log(`➕ En DB mais pas dans menu-data: ${extraInDB.length}`);
  console.log(`🖼️  Avec images: ${withImages.length}`);
  console.log(`⚠️  Sans images: ${missingImages.length}\n`);

  if (missingInDB.length > 0) {
    console.log("❌ PRODUITS MANQUANTS DANS LA DB:");
    missingInDB.forEach((p) => {
      console.log(`   - ${p.sku}: ${p.name}`);
    });
    console.log();
  }

  if (extraInDB.length > 0) {
    console.log("➕ PRODUITS UNIQUEMENT EN DB (pas dans menu-data):");
    extraInDB.forEach((p) => {
      console.log(`   - ${p.sku}: ${p.name}`);
    });
    console.log();
  }

  if (missingImages.length > 0) {
    console.log("⚠️  PRODUITS SANS IMAGES:");
    missingImages.slice(0, 20).forEach((p) => {
      const menuData = menuProducts.find((m) => m.sku === p.sku);
      if (menuData?.image) {
        console.log(`   - ${p.sku}: ${p.name} → devrait avoir: ${menuData.image}`);
      } else {
        console.log(`   - ${p.sku}: ${p.name} → pas d'image dans menu-data non plus`);
      }
    });
    if (missingImages.length > 20) {
      console.log(`   ... et ${missingImages.length - 20} autres`);
    }
    console.log();
  }

  // Vérifier la correspondance des catégories
  console.log("📂 CATÉGORIES EN DB:");
  const categories = [...new Set(dbProducts.map((p) => p.category))].sort();
  categories.forEach((cat) => {
    const count = dbProducts.filter((p) => p.category === cat).length;
    console.log(`   - ${cat}: ${count} produits`);
  });
  console.log();

  // Vérifier les variants
  const productsWithVariants = dbProducts.filter((p) => p.variants.length > 0);
  const productsWithoutVariants = dbProducts.filter((p) => p.variants.length === 0);
  console.log("🔀 VARIANTS:");
  console.log(`   - Produits avec variants: ${productsWithVariants.length}`);
  console.log(`   - Produits sans variants: ${productsWithoutVariants.length}`);

  if (productsWithoutVariants.length > 0) {
    console.log("\n   ⚠️  Produits sans variants (vérifier si normal):");
    productsWithoutVariants.slice(0, 10).forEach((p) => {
      console.log(`      - ${p.sku}: ${p.name} (prix: ${p.price} Dh)`);
    });
    if (productsWithoutVariants.length > 10) {
      console.log(`      ... et ${productsWithoutVariants.length - 10} autres`);
    }
  }
}

checkProducts()
  .then(() => {
    console.log("\n✅ Vérification terminée !");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Erreur:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
