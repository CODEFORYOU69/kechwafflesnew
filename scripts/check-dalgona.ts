import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkDalgona() {
  try {
    const dalgona = await prisma.product.findFirst({
      where: {
        OR: [
          { handle: "ice-dalgona" },
          { sku: "ICE-DAL" },
          { name: { contains: "Dalgona", mode: "insensitive" } },
        ],
      },
      include: {
        variants: true,
      },
    });

    if (dalgona) {
      console.log("Produit Ice Dalgona trouvé:");
      console.log(JSON.stringify(dalgona, null, 2));
    } else {
      console.log("Aucun produit Ice Dalgona trouvé dans la base de données");
    }
  } catch (error) {
    console.error("Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDalgona();
