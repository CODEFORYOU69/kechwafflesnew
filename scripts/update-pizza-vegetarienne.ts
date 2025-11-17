import { prisma } from "@/lib/prisma";

async function updatePizzaVegetarienne() {
  try {
    console.log("🔄 Mise à jour de la recette Pizza Waffle Végétarienne...");

    const result = await prisma.product.updateMany({
      where: {
        sku: "PW-VEG",
      },
      data: {
        description: "Aubergines, poivrons, olives, parmesan",
      },
    });

    console.log(`✅ ${result.count} produit(s) mis à jour`);

    // Vérifier le changement
    const pizza = await prisma.product.findUnique({
      where: { sku: "PW-VEG" },
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

updatePizzaVegetarienne();
