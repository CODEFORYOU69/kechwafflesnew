/**
 * Script pour synchroniser menu-data.ts avec les produits de la DB
 * Usage: pnpm tsx scripts/sync-menu-data-from-db.ts
 */

import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function syncMenuData() {
  console.log("🔄 Synchronisation de menu-data.ts avec la DB...\n");

  const dbProducts = await prisma.product.findMany({
    include: { variants: true },
    orderBy: [
      { category: "asc" },
      { displayOrder: "asc" },
      { name: "asc" },
    ],
  });

  console.log(`💾 ${dbProducts.length} produits en DB\n`);

  // Générer le nouveau contenu de menu-data.ts
  const output: string[] = [];

  output.push(`export type ProductVariant = {
  option1Name?: string;
  option1Value?: string;
  option2Name?: string;
  option2Value?: string;
  price: number;
};

export type Product = {
  handle: string;
  sku: string;
  name: string;
  category: string;
  description?: string;
  price?: number;
  variants?: ProductVariant[];
  isModifier?: boolean;
  hasTax?: boolean;
  image?: string; // Chemin de l'image dans /images/menu-items/
};

export const menuProducts: Product[] = [`);

  dbProducts.forEach((product, index) => {
    const isLast = index === dbProducts.length - 1;

    output.push(`  {`);
    output.push(`    handle: "${product.handle}",`);
    output.push(`    sku: "${product.sku}",`);
    output.push(`    name: "${product.name.replace(/"/g, '\\"')}",`);
    output.push(`    category: "${product.category}",`);

    if (product.description) {
      output.push(`    description: "${product.description.replace(/"/g, '\\"')}",`);
    }

    if (product.image) {
      output.push(`    image: "${product.image}",`);
    }

    if (product.variants.length > 1 || (product.variants.length === 1 && product.variants[0].option1Name)) {
      // Produit avec variants
      output.push(`    variants: [`);
      product.variants.forEach((variant, vIndex) => {
        const isLastVariant = vIndex === product.variants.length - 1;
        output.push(`      {`);
        if (variant.option1Name) output.push(`        option1Name: "${variant.option1Name}",`);
        if (variant.option1Value) output.push(`        option1Value: "${variant.option1Value}",`);
        if (variant.option2Name) output.push(`        option2Name: "${variant.option2Name}",`);
        if (variant.option2Value) output.push(`        option2Value: "${variant.option2Value}",`);
        output.push(`        price: ${variant.price},`);
        output.push(`      }${isLastVariant ? "" : ","}`);
      });
      output.push(`    ],`);
    } else if (product.variants.length === 1) {
      // Produit simple
      output.push(`    price: ${product.variants[0].price},`);
    } else if (product.price) {
      output.push(`    price: ${product.price},`);
    }

    if (product.isModifier) {
      output.push(`    isModifier: true,`);
    }

    if (!product.hasTax) {
      output.push(`    hasTax: false,`);
    }

    output.push(`  }${isLast ? "" : ","}`);
    output.push(``);
  });

  output.push(`];

// Fonction utilitaire pour obtenir les produits par catégorie
export const getProductsByCategory = (category: string): Product[] => {
  return menuProducts.filter((product) => product.category === category);
};

// Fonction utilitaire pour obtenir toutes les catégories uniques
export const getAllCategories = (): string[] => {
  return Array.from(new Set(menuProducts.map((product: Product) => product.category)));
};

// Fonction utilitaire pour obtenir les catégories principales
export const getMainCategories = (): string[] => {
  const categories = getAllCategories();
  return Array.from(
    new Set(categories.map((cat: string) => cat.split(" - ")[0]))
  ).filter((cat: string) => cat !== "Modificateurs");
};
`);

  const content = output.join("\n");

  // Sauvegarder
  const menuDataPath = path.join(process.cwd(), "lib", "menu-data.ts");

  // Backup de l'ancien fichier
  const backupPath = path.join(process.cwd(), "lib", "menu-data.ts.backup");
  if (fs.existsSync(menuDataPath)) {
    fs.copyFileSync(menuDataPath, backupPath);
    console.log(`📦 Backup créé: ${backupPath}`);
  }

  fs.writeFileSync(menuDataPath, content, "utf-8");
  console.log(`✅ menu-data.ts mis à jour avec ${dbProducts.length} produits !`);
}

syncMenuData()
  .then(() => {
    console.log("\n🎉 Synchronisation terminée !");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Erreur:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
