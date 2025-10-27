import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkPizzaWaffles() {
  try {
    console.log("🍕 PIZZA WAFFLES\n");
    console.log("=".repeat(80));

    const pizzas = await prisma.product.findMany({
      where: {
        category: "Pizza Waffles",
      },
      include: {
        variants: true,
      },
      orderBy: {
        price: "asc",
      },
    });

    console.log(`\n📊 ${pizzas.length} Pizza Waffles trouvées:\n`);

    pizzas.forEach((pizza) => {
      const price = pizza.variants[0]?.price || pizza.price || 0;
      console.log(`✅ ${pizza.name} - ${price} MAD`);
      console.log(`   SKU: ${pizza.sku} | Image: ${pizza.image || "❌ manquante"}`);
      console.log(`   ${pizza.description}`);
      console.log("");
    });

    console.log("=".repeat(80));
    console.log("\n🧀 SAUCE GRUYÈRE\n");
    console.log("=".repeat(80));

    const sauceGruyere = await prisma.product.findFirst({
      where: {
        sku: "SAU-GRU",
      },
      include: {
        variants: true,
      },
    });

    if (sauceGruyere) {
      console.log(`\n✅ ${sauceGruyere.name}`);
      console.log(`   Catégorie: ${sauceGruyere.category}`);
      console.log(`   Modificateur: ${sauceGruyere.isModifier ? "Oui" : "Non"}`);
      console.log("\n   Tailles disponibles:");
      sauceGruyere.variants.forEach((variant) => {
        console.log(`   - ${variant.option1Value}: ${variant.price} MAD`);
      });
    } else {
      console.log("❌ Sauce Gruyère non trouvée");
    }

    console.log("\n" + "=".repeat(80));
    console.log("\n📋 SUPPLÉMENTS PIZZA\n");
    console.log("=".repeat(80));

    const supplements = await prisma.product.findMany({
      where: {
        category: "Modificateurs",
        sku: {
          in: [
            "EXT-MOZ",
            "EXT-STO",
            "EXT-LEG",
            "EXT-CHA",
            "EXT-OLI",
            "EXT-POU",
            "EXT-VHA",
            "EXT-PEP",
            "EXT-JAM",
            "EXT-THO",
          ],
        },
      },
      include: {
        variants: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    console.log(`\n${supplements.length} suppléments trouvés:\n`);

    supplements.forEach((supplement) => {
      const price = supplement.variants[0]?.price || supplement.price || 0;
      console.log(`✅ ${supplement.name} - ${price} MAD`);
    });

    console.log("\n" + "=".repeat(80));
    console.log("\n✅ BRIODOGS SUPPRIMÉS?\n");
    console.log("=".repeat(80));

    const briodogs = await prisma.product.count({
      where: {
        OR: [
          { category: "Briodogs Salés" },
          { category: "Briodogs Sucrés" },
        ],
      },
    });

    if (briodogs === 0) {
      console.log("\n✅ Tous les Briodogs ont été supprimés");
    } else {
      console.log(`\n⚠️  Il reste ${briodogs} Briodogs dans la base de données`);
    }

    console.log("\n" + "=".repeat(80));
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPizzaWaffles();
