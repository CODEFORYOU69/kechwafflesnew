/**
 * Script pour vérifier les données du PDF
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkPDFData() {
  console.log("📊 Vérification des données pour le PDF...\n");

  try {
    // Récupérer tous les produits actifs
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

    // Récupérer les modificateurs
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

    console.log(`✅ Total produits actifs: ${allProducts.length}`);
    console.log(`   - Produits normaux: ${products.length}`);
    console.log(`   - Modificateurs: ${modifiers.length}\n`);

    // Grouper par catégorie
    const categoriesMap = new Map<string, number>();
    const categoriesWithVariants = new Map<string, number>();

    allProducts.forEach((product) => {
      const count = categoriesMap.get(product.category) || 0;
      categoriesMap.set(product.category, count + 1);

      const variantCount = categoriesWithVariants.get(product.category) || 0;
      categoriesWithVariants.set(
        product.category,
        variantCount + product.variants.length
      );
    });

    console.log("📁 Catégories trouvées:\n");
    Array.from(categoriesMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([category, count]) => {
        const variantCount = categoriesWithVariants.get(category) || 0;
        console.log(`   ${category}:`);
        console.log(`      - ${count} produits`);
        console.log(`      - ${variantCount} variants`);
      });

    // Vérifier les catégories définies dans le PDF
    const pdfCategories = [
      "Boissons - Cafés",
      "Boissons - Boissons Lactées",
      "Boissons - Milkshakes",
      "Boissons - Spécialisées",
      "Boissons Ice Lactées",
      "Eaux & Soft Drinks",
      "Jus Frais Pressés",
      "Shots Vitaminés",
      "Desserts",
      "Desserts - Cans",
      "Pizza Waffles",
      "Potato Waffles",
      "Modificateurs",
    ];

    console.log("\n⚠️  Catégories dans la BDD mais PAS dans le PDF:");
    const dbCategories = Array.from(categoriesMap.keys());
    const missingInPdf = dbCategories.filter(
      (cat) => !pdfCategories.includes(cat)
    );
    if (missingInPdf.length > 0) {
      missingInPdf.forEach((cat) => {
        console.log(`   ❌ ${cat} (${categoriesMap.get(cat)} produits)`);
      });
    } else {
      console.log("   ✅ Aucune");
    }

    console.log("\n⚠️  Catégories dans le PDF mais PAS dans la BDD:");
    const missingInDb = pdfCategories.filter(
      (cat) => !dbCategories.includes(cat)
    );
    if (missingInDb.length > 0) {
      missingInDb.forEach((cat) => {
        console.log(`   ⚠️  ${cat}`);
      });
    } else {
      console.log("   ✅ Aucune");
    }

    // Afficher les produits avec variants
    console.log("\n📊 Produits avec variants (boissons avec tailles):\n");
    allProducts
      .filter((p) => p.variants.length > 0)
      .slice(0, 10) // Afficher les 10 premiers
      .forEach((product) => {
        console.log(`   ${product.name} (${product.category}):`);
        product.variants.forEach((v) => {
          console.log(
            `      - ${v.option1Value || ""}${v.option2Value ? " - " + v.option2Value : ""}: ${v.price} Dh`
          );
        });
      });

    if (allProducts.filter((p) => p.variants.length > 0).length > 10) {
      console.log(
        `   ... et ${allProducts.filter((p) => p.variants.length > 0).length - 10} autres produits avec variants`
      );
    }
  } catch (error) {
    console.error("❌ Erreur:", error);
    throw error;
  }
}

checkPDFData()
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
