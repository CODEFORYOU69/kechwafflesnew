/**
 * Script pour tester la génération du PDF localement
 */

import { PrismaClient } from "@prisma/client";
import { renderToFile } from "@react-pdf/renderer";
import { MenuPDF } from "../lib/pdf/menu-pdf";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function testPDFGeneration() {
  console.log("📄 Test de génération du PDF...\n");

  try {
    // Récupérer les produits actifs
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
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

    console.log(`✅ ${products.length} produits trouvés\n`);

    // Transformer les données
    const pdfData = products.map((product) => ({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      variants: product.variants.map((v) => ({
        option1Name: v.option1Name,
        option1Value: v.option1Value,
        option2Name: v.option2Name,
        option2Value: v.option2Value,
        price: v.price,
      })),
    }));

    console.log("🔄 Génération du PDF...\n");

    // Générer le PDF
    const pdfDocument = MenuPDF({
      products: pdfData,
      generatedAt: new Date().toISOString(),
    });

    // Créer le fichier de test
    const outputPath = path.join(process.cwd(), "test-menu.pdf");

    await renderToFile(pdfDocument, outputPath);

    console.log(`✅ PDF généré avec succès!`);
    console.log(`📂 Fichier: ${outputPath}\n`);

    // Vérifier la taille du fichier
    const stats = fs.statSync(outputPath);
    console.log(`📊 Taille: ${(stats.size / 1024).toFixed(2)} KB`);

    if (stats.size < 1000) {
      console.warn("⚠️  ATTENTION: Le fichier est très petit, il pourrait être corrompu!");
    }

  } catch (error) {
    console.error("❌ Erreur:", error);
    throw error;
  }
}

testPDFGeneration()
  .then(() => {
    console.log("\n✅ Test terminé!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Erreur lors du test:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
