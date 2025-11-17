import { prisma } from "@/lib/prisma";

async function updateCraffleImage() {
  try {
    console.log("🔄 Mise à jour de l'image du Craffle Tiramisu...");

    const result = await prisma.product.updateMany({
      where: {
        sku: "CRA-TIR",
      },
      data: {
        image: "croffle.jpg",
      },
    });

    console.log(`✅ ${result.count} produit(s) mis à jour`);

    // Vérifier le changement
    const craffle = await prisma.product.findUnique({
      where: { sku: "CRA-TIR" },
      select: { name: true, image: true },
    });

    if (craffle) {
      console.log(`✅ ${craffle.name}`);
      console.log(`   Nouvelle image : ${craffle.image}`);
    }
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateCraffleImage();
