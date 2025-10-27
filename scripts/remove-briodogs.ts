import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function removeBriodogs() {
  console.log("🗑️  Suppression des Briodogs...\n");

  try {
    // Récupérer tous les produits Briodogs
    const briodogs = await prisma.product.findMany({
      where: {
        OR: [
          { category: "Briodogs Salés" },
          { category: "Briodogs Sucrés" },
        ],
      },
      include: {
        variants: true,
      },
    });

    console.log(`📋 ${briodogs.length} Briodogs trouvés\n`);

    if (briodogs.length === 0) {
      console.log("✅ Aucun Briodog à supprimer");
      return;
    }

    // Supprimer les variantes puis les produits
    for (const briodog of briodogs) {
      // Supprimer les variantes
      await prisma.productVariant.deleteMany({
        where: { productId: briodog.id },
      });

      // Supprimer le produit
      await prisma.product.delete({
        where: { id: briodog.id },
      });

      console.log(`✅ ${briodog.name} supprimé (${briodog.category})`);
    }

    console.log(`\n✨ ${briodogs.length} Briodogs supprimés avec succès!`);
  } catch (error) {
    console.error("❌ Erreur lors de la suppression des Briodogs:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

removeBriodogs();
