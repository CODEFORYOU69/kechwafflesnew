import { prisma } from "@/lib/prisma";

async function checkOignons() {
  try {
    const oignons = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: "oignon", mode: "insensitive" } },
          { name: { contains: "Oignon", mode: "insensitive" } },
        ]
      },
      select: {
        name: true,
        category: true,
        sku: true,
      }
    });

    console.log("Produits avec 'oignon' dans le nom:");
    oignons.forEach(p => {
      console.log(`  ${p.name} (${p.sku}) - ${p.category}`);
      console.log(`  Nom en minuscules: "${p.name.toLowerCase()}"`);
    });
  } catch (error) {
    console.error("Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOignons();
