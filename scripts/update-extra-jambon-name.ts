import { prisma } from "@/lib/prisma";

async function updateExtraJambonName() {
  try {
    console.log("🔄 Mise à jour du nom de Extra Jambon...");

    const result = await prisma.product.updateMany({
      where: {
        sku: "EXT-JAM",
      },
      data: {
        name: "Extra Jambon (halal)",
      },
    });

    console.log(`✅ ${result.count} produit(s) mis à jour`);

    // Vérifier le changement
    const extraJambon = await prisma.product.findUnique({
      where: { sku: "EXT-JAM" },
      select: { name: true, category: true },
    });

    if (extraJambon) {
      console.log(`✅ Nouveau nom : ${extraJambon.name}`);
    }
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateExtraJambonName();
