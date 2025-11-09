/**
 * Script pour générer un dossier catalogue pour l'imprimeur
 * Crée un dossier par catégorie avec images et infos produits
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

const OUTPUT_DIR = "./catalog-imprimeur";
const IMAGES_SOURCE = "./public/images/menu-items";

async function generatePrintCatalog() {
  console.log("📂 Génération du catalogue pour l'imprimeur...\n");

  try {
    // Supprimer l'ancien dossier s'il existe
    if (fs.existsSync(OUTPUT_DIR)) {
      fs.rmSync(OUTPUT_DIR, { recursive: true });
      console.log("🗑️  Ancien catalogue supprimé\n");
    }

    // Créer le dossier principal
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    // Récupérer tous les produits actifs (sauf modificateurs pour l'instant)
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isModifier: false,
      },
      include: {
        variants: {
          where: { isActive: true },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: [
        { category: "asc" },
        { displayOrder: "asc" },
        { name: "asc" },
      ],
    });

    console.log(`📦 ${products.length} produits actifs trouvés\n`);

    // Grouper par catégorie
    const productsByCategory: Record<string, typeof products> = {};
    for (const product of products) {
      if (!productsByCategory[product.category]) {
        productsByCategory[product.category] = [];
      }
      productsByCategory[product.category].push(product);
    }

    let totalFiles = 0;

    // Créer un dossier par catégorie
    for (const [category, categoryProducts] of Object.entries(productsByCategory)) {
      // Nettoyer le nom de catégorie pour le système de fichiers
      const safeCategoryName = category
        .replace(/[\/\\:*?"<>|]/g, "-")
        .replace(/\s+/g, "_");

      const categoryDir = path.join(OUTPUT_DIR, safeCategoryName);
      fs.mkdirSync(categoryDir, { recursive: true });

      console.log(`\n📁 ${category} (${categoryProducts.length} produits)`);

      // Créer un fichier récapitulatif pour la catégorie
      let categoryInfo = `═══════════════════════════════════════════════════════════\n`;
      categoryInfo += `  ${category.toUpperCase()}\n`;
      categoryInfo += `═══════════════════════════════════════════════════════════\n\n`;

      for (const product of categoryProducts) {
        categoryInfo += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        categoryInfo += `${product.name}\n`;
        categoryInfo += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

        if (product.description) {
          categoryInfo += `📝 Description:\n${product.description}\n\n`;
        }

        // Prix et variants
        if (product.variants && product.variants.length > 0) {
          categoryInfo += `💰 Prix:\n`;
          for (const variant of product.variants) {
            const variantName = [
              variant.option1Value,
              variant.option2Value,
            ]
              .filter(Boolean)
              .join(" - ");
            categoryInfo += `   • ${variantName}: ${variant.price} Dh\n`;
          }
        } else if (product.price) {
          categoryInfo += `💰 Prix: ${product.price} Dh\n`;
        }

        categoryInfo += `\n📦 SKU: ${product.sku}\n`;

        // Copier l'image si elle existe
        if (product.image) {
          const sourceImage = path.join(IMAGES_SOURCE, product.image);
          if (fs.existsSync(sourceImage)) {
            const ext = path.extname(product.image);
            const safeProductName = product.name
              .replace(/[\/\\:*?"<>|]/g, "-")
              .replace(/\s+/g, "_");
            const destImage = path.join(
              categoryDir,
              `${safeProductName}${ext}`
            );
            fs.copyFileSync(sourceImage, destImage);
            categoryInfo += `🖼️  Image: ${safeProductName}${ext}\n`;
            totalFiles++;
          } else {
            categoryInfo += `⚠️  Image manquante: ${product.image}\n`;
          }
        } else {
          categoryInfo += `ℹ️  Pas d'image\n`;
        }

        categoryInfo += `\n`;
      }

      // Sauvegarder le fichier récapitulatif
      const infoFile = path.join(categoryDir, "_INFOS_PRODUITS.txt");
      fs.writeFileSync(infoFile, categoryInfo, "utf8");
      totalFiles++;

      console.log(`   ✅ ${categoryProducts.length} produits exportés`);
    }

    // Créer un fichier README dans le dossier principal
    const readme = `CATALOGUE KECH WAFFLES - POUR IMPRESSION
${"=".repeat(50)}

Date de génération: ${new Date().toLocaleDateString("fr-FR")}

Ce dossier contient le catalogue complet des produits actifs.

STRUCTURE:
- Un dossier par catégorie de produits
- Dans chaque dossier:
  * _INFOS_PRODUITS.txt : Informations détaillées (nom, description, prix)
  * Images des produits avec le nom du produit

TOTAL: ${Object.keys(productsByCategory).length} catégories, ${products.length} produits

CATÉGORIES:
${Object.entries(productsByCategory)
  .map(([cat, prods]) => `  • ${cat} (${prods.length} produits)`)
  .join("\n")}

${"=".repeat(50)}
`;

    fs.writeFileSync(path.join(OUTPUT_DIR, "README.txt"), readme, "utf8");

    console.log(`\n\n${"═".repeat(60)}`);
    console.log("📊 RÉSUMÉ");
    console.log(`${"═".repeat(60)}`);
    console.log(`✅ Catégories: ${Object.keys(productsByCategory).length}`);
    console.log(`✅ Produits: ${products.length}`);
    console.log(`✅ Fichiers générés: ${totalFiles}`);
    console.log(`📂 Dossier: ${path.resolve(OUTPUT_DIR)}`);
    console.log(`${"═".repeat(60)}\n`);
  } catch (error) {
    console.error("❌ Erreur lors de la génération:", error);
    throw error;
  }
}

generatePrintCatalog()
  .then(() => {
    console.log("✅ Catalogue généré avec succès!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Erreur:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
