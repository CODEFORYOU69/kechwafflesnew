import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🖼️  Mise à jour de l'image Extra Pepperoni...");

  const result = await prisma.product.updateMany({
    where: { sku: "EXT-PEP" },
    data: { image: "extrapepperoni.png" },
  });

  console.log(`✅ ${result.count} produit(s) mis à jour`);
}

main()
  .then(() => {
    console.log("\n✅ Terminé!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erreur:", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
