/**
 * Script pour tester le rendu détaillé du PDF
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testPDFRendering() {
  console.log("📄 Test du rendu PDF...\n");

  try {
    // Récupérer tous les produits comme dans l'API
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

    // Transformer comme dans l'API
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

    // Grouper par catégorie (comme dans le PDF)
    const productsByCategory = pdfData.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {} as Record<string, typeof pdfData>);

    const categoryOrder = [
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

    const sortedCategories = Object.keys(productsByCategory).sort((a, b) => {
      const indexA = categoryOrder.indexOf(a);
      const indexB = categoryOrder.indexOf(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    // Diviser en sections (comme dans le PDF)
    const boissonsChaudesCategories = sortedCategories.filter(
      (cat) =>
        cat === "Boissons - Cafés" ||
        cat === "Boissons - Boissons Lactées" ||
        cat === "Boissons - Milkshakes"
    );
    const boissonsFroidesCategories = sortedCategories.filter(
      (cat) =>
        cat === "Boissons - Spécialisées" ||
        cat === "Boissons Ice Lactées" ||
        cat.includes("Eaux") ||
        cat.includes("Jus") ||
        cat.includes("Shots")
    );
    const dessertsCategories = sortedCategories.filter((cat) =>
      cat.startsWith("Desserts")
    );
    const wafflesCategories = sortedCategories.filter(
      (cat) => cat === "Pizza Waffles" || cat === "Potato Waffles"
    );
    const modificateursCategories = sortedCategories.filter(
      (cat) => cat.startsWith("Modificateurs") || cat === "Autres"
    );

    console.log("📄 STRUCTURE DU PDF:\n");
    console.log("=" .repeat(80));

    console.log("\n📄 PAGE 1: Nos Boissons Chaudes");
    console.log("-" .repeat(80));
    boissonsChaudesCategories.forEach((category) => {
      const categoryDisplay = category.split(" - ").pop() || category;
      console.log(`\n📁 ${categoryDisplay} (${productsByCategory[category].length} produits):`);
      productsByCategory[category].forEach((product) => {
        console.log(`   📦 ${product.name}`);
        if (product.variants.length > 0) {
          product.variants.forEach((v) => {
            const label =
              (v.option1Value || "") +
              (v.option2Value ? ` - ${v.option2Value}` : "");
            console.log(`      ${label || "[vide]"}: ${v.price} Dh`);
          });
        } else if (product.price !== null) {
          console.log(`      ${product.price} Dh`);
        }
      });
    });

    console.log("\n\n📄 PAGE 2: Nos Boissons Fraîches");
    console.log("-" .repeat(80));
    boissonsFroidesCategories.forEach((category) => {
      const categoryDisplay = category.split(" - ").pop() || category;
      console.log(`\n📁 ${categoryDisplay} (${productsByCategory[category].length} produits):`);
      productsByCategory[category].forEach((product) => {
        console.log(`   📦 ${product.name}`);
        if (product.variants.length > 0) {
          product.variants.forEach((v) => {
            const label =
              (v.option1Value || "") +
              (v.option2Value ? ` - ${v.option2Value}` : "");
            console.log(`      ${label || "[vide]"}: ${v.price} Dh`);
          });
        } else if (product.price !== null) {
          console.log(`      ${product.price} Dh`);
        }
      });
    });

    console.log("\n\n📄 PAGE 3: Nos Desserts");
    console.log("-" .repeat(80));
    dessertsCategories.forEach((category) => {
      const categoryDisplay = category.split(" - ").pop() || category;
      console.log(`\n📁 ${categoryDisplay} (${productsByCategory[category].length} produits):`);
      productsByCategory[category].forEach((product) => {
        console.log(`   📦 ${product.name}`);
        if (product.variants.length > 0) {
          product.variants.forEach((v) => {
            const label =
              (v.option1Value || "") +
              (v.option2Value ? ` - ${v.option2Value}` : "");
            console.log(`      ${label || "[vide]"}: ${v.price} Dh`);
          });
        } else if (product.price !== null) {
          console.log(`      ${product.price} Dh`);
        }
      });
    });

    console.log("\n\n📄 PAGE 4: Nos Waffles Salées");
    console.log("-" .repeat(80));
    wafflesCategories.forEach((category) => {
      const categoryDisplay = category.split(" - ").pop() || category;
      console.log(`\n📁 ${categoryDisplay} (${productsByCategory[category].length} produits):`);
      productsByCategory[category].forEach((product) => {
        console.log(`   📦 ${product.name}`);
        if (product.variants.length > 0) {
          product.variants.forEach((v) => {
            const label =
              (v.option1Value || "") +
              (v.option2Value ? ` - ${v.option2Value}` : "");
            console.log(`      ${label || "[vide]"}: ${v.price} Dh`);
          });
        } else if (product.price !== null) {
          console.log(`      ${product.price} Dh`);
        }
      });
    });

    console.log("\n\n📄 PAGE 5: Suppléments");
    console.log("-" .repeat(80));
    modificateursCategories.forEach((category) => {
      let categoryDisplay = category.split(" - ").pop() || category;
      if (categoryDisplay === "Modificateurs") {
        categoryDisplay = "Suppléments";
      }
      console.log(`\n📁 ${categoryDisplay} (${productsByCategory[category].length} produits):`);
      productsByCategory[category].forEach((product) => {
        console.log(`   📦 ${product.name}`);
        if (product.variants.length > 0) {
          product.variants.forEach((v) => {
            const label =
              (v.option1Value || "") +
              (v.option2Value ? ` - ${v.option2Value}` : "");
            console.log(`      ${label || "[vide]"}: ${v.price} Dh`);
          });
        } else if (product.price !== null) {
          console.log(`      ${product.price} Dh`);
        }
      });
    });

    console.log("\n\n📊 RÉSUMÉ:");
    console.log("=" .repeat(80));
    console.log(
      `Total produits dans le PDF: ${allProducts.length}`
    );
    console.log(
      `Total variants dans le PDF: ${pdfData.reduce((sum, p) => sum + p.variants.length, 0)}`
    );
    console.log(`\nCatégories par page:`);
    console.log(`  Page 1 (Boissons Chaudes): ${boissonsChaudesCategories.length} catégories`);
    console.log(`  Page 2 (Boissons Fraîches): ${boissonsFroidesCategories.length} catégories`);
    console.log(`  Page 3 (Desserts): ${dessertsCategories.length} catégories`);
    console.log(`  Page 4 (Waffles Salées): ${wafflesCategories.length} catégories`);
    console.log(`  Page 5 (Suppléments): ${modificateursCategories.length} catégories`);
  } catch (error) {
    console.error("❌ Erreur:", error);
    throw error;
  }
}

testPDFRendering()
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
