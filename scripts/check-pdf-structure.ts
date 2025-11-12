/**
 * Script pour vérifier la structure des données PDF
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkPDFStructure() {
  console.log("📄 Vérification de la structure des données PDF...\n");

  try {
    // Récupérer tous les produits actifs avec leurs variants (comme dans l'API)
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

    const modifiers = await prisma.product.findMany({
      where: {
        isActive: true,
        isModifier: true,
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

    const allProducts = [...products, ...modifiers];

    // Transformer exactement comme dans l'API
    const pdfData = allProducts.map((product) => ({
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

    console.log(`✅ Total produits: ${pdfData.length}\n`);

    // Grouper par catégorie
    const productsByCategory = pdfData.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {} as Record<string, typeof pdfData>);

    // Afficher par catégorie
    Object.entries(productsByCategory)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([category, products]) => {
        console.log(`\n📁 ${category} (${products.length} produits):`);

        products.forEach((product) => {
          console.log(`\n   📦 ${product.name}`);

          if (product.variants.length > 0) {
            console.log(`      Variants: ${product.variants.length}`);
            product.variants.forEach((v) => {
              const optionText =
                (v.option1Value || "") +
                (v.option2Value ? ` - ${v.option2Value}` : "");
              console.log(`         - ${optionText || "(vide)"}: ${v.price} Dh`);
            });
          } else if (product.price !== null) {
            console.log(`      Prix simple: ${product.price} Dh`);
          } else {
            console.log(`      ⚠️  Pas de prix ni de variants!`);
          }
        });
      });

    // Statistiques
    console.log("\n\n📊 STATISTIQUES:");
    console.log(`   Total produits: ${pdfData.length}`);
    console.log(
      `   Produits avec variants: ${pdfData.filter((p) => p.variants.length > 0).length}`
    );
    console.log(
      `   Produits avec prix simple: ${pdfData.filter((p) => p.price !== null && p.variants.length === 0).length}`
    );
    console.log(
      `   Produits sans prix ni variants: ${pdfData.filter((p) => p.price === null && p.variants.length === 0).length}`
    );
    console.log(
      `   Total variants: ${pdfData.reduce((sum, p) => sum + p.variants.length, 0)}`
    );
  } catch (error) {
    console.error("❌ Erreur:", error);
    throw error;
  }
}

checkPDFStructure()
  .then(() => {
    console.log("\n✅ Vérification terminée!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Erreur lors de la vérification:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
