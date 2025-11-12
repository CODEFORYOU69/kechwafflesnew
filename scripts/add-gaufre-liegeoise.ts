/**
 * Script pour ajouter la Gaufre Liégeoise à Loyverse et la BDD
 * Usage: pnpm tsx scripts/add-gaufre-liegeoise.ts
 */

import { createLoyverseItem, uploadLoyverseItemImage } from "@/lib/loyalty/loyverse";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function addGaufreLiegeoise() {
  console.log("🧇 Ajout de la Gaufre Liégeoise...\n");

  try {
    // 1. Créer le produit dans Loyverse
    console.log("📤 Création dans Loyverse...");
    const item = await createLoyverseItem({
      name: "Gaufre Liégeoise",
      sku: "GAU-LIE",
      price: 30,
    });

    console.log("✅ Produit créé dans Loyverse avec succès !");
    console.log(`   ID Loyverse: ${item.id}`);
    console.log(`   Nom: ${item.item_name}`);
    console.log(`   SKU: ${item.reference_id}`);
    console.log(`   Prix: ${item.variants[0].default_price} Dh`);

    // 2. Upload de l'image (optionnel)
    const imagePath = path.join(process.cwd(), "public/images/menu-items/waffles.png");

    if (fs.existsSync(imagePath)) {
      try {
        console.log("\n📸 Upload de l'image waffles.png...");
        const imageBuffer = fs.readFileSync(imagePath);

        await uploadLoyverseItemImage(item.id, imageBuffer, "waffles.png");
        console.log("✅ Image uploadée avec succès !");
      } catch (imageError) {
        console.log("⚠️  Erreur upload image (on continue quand même)");
      }
    } else {
      console.log("\n⚠️  Image waffles.png introuvable");
    }

    // 3. Créer le produit dans la BDD
    console.log("\n📝 Création dans la base de données...");

    const product = await prisma.product.create({
      data: {
        handle: "gaufre-liegeoise",
        sku: "GAU-LIE",
        name: "Gaufre Liégeoise",
        category: "Desserts",
        description: "Authentique gaufre liégeoise avec perles de sucre caramélisées",
        image: "waffles.png",
        price: null,
        isActive: true,
        isModifier: false,
        displayOrder: 0,
        loyverseItemId: item.id,
        variants: {
          create: [
            {
              variantSku: "GAU-LIE",
              option1Name: null,
              option1Value: null,
              option2Name: null,
              option2Value: null,
              price: 30,
              isActive: true,
              loyverseVariantId: item.variants[0].variant_id,
            },
          ],
        },
      },
      include: {
        variants: true,
      },
    });

    console.log(`✅ Créé dans la BDD: ${product.id}`);
    console.log(`   - Nom: ${product.name}`);
    console.log(`   - Prix: ${product.variants[0].price} Dh`);
    console.log(`   - Loyverse ID: ${product.loyverseItemId}`);

    console.log("\n🎉 Gaufre Liégeoise ajoutée avec succès!");
  } catch (error) {
    console.error("❌ Erreur:", error);
    if (error instanceof Error) {
      console.error("   Message:", error.message);
    }
    throw error;
  }
}

addGaufreLiegeoise()
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
