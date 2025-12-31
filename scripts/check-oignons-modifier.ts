import { prisma } from "@/lib/prisma";

async function checkOignonsModifier() {
  try {
    const oignons = await prisma.product.findUnique({
      where: { sku: "EXT-OIG" },
      select: {
        name: true,
        category: true,
        isModifier: true,
        sku: true,
      }
    });

    console.log("Oignons Caramélisés:");
    console.log(JSON.stringify(oignons, null, 2));
  } catch (error) {
    console.error("Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOignonsModifier();
