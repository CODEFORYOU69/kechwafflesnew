/**
 * Script pour fusionner les deux shots
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function mergeShots() {
  console.log("🍋 Fusion des shots...\n");

  try {
    // 1. Mettre à jour Shot Citron Gingembre Menthe
    console.log("📝 Mise à jour du Shot Citron Gingembre Menthe...");

    const updatedShot = await prisma.product.update({
      where: {
        sku: "SHOT-CIT",
      },
      data: {
        name: "Shot Citron Gingembre Menthe Pomme",
        description: "Digestion & Immunité : citron gingembre menthe pomme miel",
        variants: {
          updateMany: {
            where: {
              productId: {
                not: undefined,
              },
            },
            data: {
              price: 25,
            },
          },
        },
      },
      include: {
        variants: true,
      },
    });

    console.log(`✅ Mis à jour: ${updatedShot.name}`);
    console.log(`   Nouveau prix: ${updatedShot.variants[0]?.price} Dh`);

    // 2. Désactiver Shot Gingembre Citron Pomme
    console.log("\n❌ Désactivation du Shot Gingembre Citron Pomme...");

    const deactivatedShot = await prisma.product.update({
      where: {
        sku: "SHOT-GIN",
      },
      data: {
        isActive: false,
        variants: {
          updateMany: {
            where: {
              productId: {
                not: undefined,
              },
            },
            data: {
              isActive: false,
            },
          },
        },
      },
    });

    console.log(`✅ Désactivé: ${deactivatedShot.name}`);

    console.log("\n🎉 Fusion terminée avec succès!");
  } catch (error) {
    console.error("❌ Erreur:", error);
    throw error;
  }
}

mergeShots()
  .then(() => {
    console.log("\n✅ Script terminé!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Erreur:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
