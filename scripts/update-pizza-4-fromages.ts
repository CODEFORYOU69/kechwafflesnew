import { prisma } from "@/lib/prisma";

async function updatePizza4Fromages() {
  try {
    console.log("🔄 Mise à jour de la recette Pizza Waffle 4 Fromages...");

    const result = await prisma.product.updateMany({
      where: {
        sku: "PW-4FR",
      },
      data: {
        description: "Mozzarella, bleu, chèvre, parmesan",
      },
    });

    console.log(`✅ ${result.count} produit(s) mis à jour`);

    // Vérifier le changement
    const pizza = await prisma.product.findUnique({
      where: { sku: "PW-4FR" },
      select: { name: true, description: true },
    });

    if (pizza) {
      console.log(`✅ ${pizza.name}`);
      console.log(`   Nouvelle recette : ${pizza.description}`);
    }
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePizza4Fromages();
