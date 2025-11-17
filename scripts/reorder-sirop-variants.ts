import { prisma } from "@/lib/prisma";

async function reorderSiropVariants() {
  try {
    console.log("🔄 Réorganisation des variants de sirops...");

    // Trouver le produit Sirop
    const sirop = await prisma.product.findUnique({
      where: { sku: "SIR-VAN" },
      include: { variants: true },
    });

    if (!sirop) {
      console.log("❌ Produit Sirop non trouvé");
      return;
    }

    console.log(`📦 Trouvé: ${sirop.name} avec ${sirop.variants.length} variants`);

    // Ordre souhaité des variants
    const order = ["Caramel", "Noisette", "Vanille", "Autre"];

    // Trier les variants selon l'ordre
    const sortedVariants = sirop.variants.sort((a, b) => {
      const indexA = order.indexOf(a.option1Value || "");
      const indexB = order.indexOf(b.option1Value || "");
      return indexA - indexB;
    });

    // Mettre à jour l'ordre dans la base de données en recréant les variants
    console.log("🔄 Suppression et recréation des variants dans le bon ordre...");

    await prisma.$transaction([
      // Supprimer tous les variants
      prisma.productVariant.deleteMany({
        where: { productId: sirop.id },
      }),
      // Recréer dans le bon ordre
      ...sortedVariants.map((variant, index) =>
        prisma.productVariant.create({
          data: {
            productId: sirop.id,
            option1Name: variant.option1Name,
            option1Value: variant.option1Value,
            option2Name: variant.option2Name,
            option2Value: variant.option2Value,
            price: variant.price,
            variantSku: variant.variantSku,
            loyverseVariantId: variant.loyverseVariantId,
            isActive: variant.isActive,
          },
        })
      ),
    ]);

    console.log("✅ Variants réorganisés avec succès");
    console.log("Nouvel ordre:");
    sortedVariants.forEach((v, i) => {
      console.log(`  ${i + 1}. ${v.option1Value} - ${v.price} Dh`);
    });
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

reorderSiropVariants();
