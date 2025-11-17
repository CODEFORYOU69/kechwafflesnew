import { prisma } from "@/lib/prisma";

async function updateColdBrewCategory() {
  try {
    console.log("🔄 Mise à jour de la catégorie du Cold Brew...");

    const result = await prisma.product.updateMany({
      where: {
        sku: "COL-001",
      },
      data: {
        category: "Boissons - Cafés",
      },
    });

    console.log(`✅ ${result.count} produit(s) mis à jour`);

    // Vérifier le changement
    const coldBrew = await prisma.product.findUnique({
      where: { sku: "COL-001" },
      select: { name: true, category: true },
    });

    if (coldBrew) {
      console.log(`✅ Cold Brew maintenant dans : ${coldBrew.category}`);
    }
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateColdBrewCategory();
