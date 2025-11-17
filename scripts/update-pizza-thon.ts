import { prisma } from "@/lib/prisma";

async function updatePizzaThon() {
  try {
    console.log("🔄 Mise à jour de la recette Pizza Waffle Thon & Olives...");

    const result = await prisma.product.updateMany({
      where: {
        sku: "PW-THO",
      },
      data: {
        description: "Thon, mozzarella, olives noires, oignon, tomates",
      },
    });

    console.log(`✅ ${result.count} produit(s) mis à jour`);

    // Vérifier le changement
    const pizza = await prisma.product.findUnique({
      where: { sku: "PW-THO" },
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

updatePizzaThon();
