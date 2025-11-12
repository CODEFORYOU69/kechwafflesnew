/**
 * Script pour ajouter le Topping Daim à Loyverse et la BDD
 * Usage: pnpm tsx scripts/add-topping-daim.ts
 */

import { createLoyverseItem } from "@/lib/loyalty/loyverse";
import { PrismaClient } from "@prisma/client";
import sharp from "sharp";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function addToppingDaim() {
  console.log("🍫 Ajout du Topping Daim...\n");

  try {
    // 1. Optimiser l'image
    const imagePath = path.join(process.cwd(), "public/images/menu-items/daim.png");

    if (fs.existsSync(imagePath)) {
      console.log("🖼️  Optimisation de l'image daim.png...");
      const originalStats = fs.statSync(imagePath);
      console.log(`   Taille originale: ${(originalStats.size / 1024 / 1024).toFixed(2)} MB`);

      // Backup
      const backupPath = imagePath.replace(".png", "-backup.png");
      fs.copyFileSync(imagePath, backupPath);

      // Optimiser
      await sharp(imagePath)
        .resize(400, 400, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .png({ quality: 70, compressionLevel: 9 })
        .toFile(imagePath + ".tmp");

      fs.unlinkSync(imagePath);
      fs.renameSync(imagePath + ".tmp", imagePath);

      const optimizedStats = fs.statSync(imagePath);
      const reduction = (
        ((originalStats.size - optimizedStats.size) / originalStats.size) * 100
      ).toFixed(1);

      console.log(`   ✅ Optimisée: ${(optimizedStats.size / 1024 / 1024).toFixed(2)} MB (-${reduction}%)\n`);
    }

    // 2. Créer le produit dans Loyverse
    console.log("📤 Création dans Loyverse...");
    const item = await createLoyverseItem({
      name: "Topping Daim",
      sku: "TOP-DAI",
      price: 10,
    });

    console.log("✅ Produit créé dans Loyverse avec succès !");
    console.log(`   ID Loyverse: ${item.id}`);
    console.log(`   Nom: ${item.item_name}`);
    console.log(`   Prix: ${item.variants[0].default_price} Dh`);

    // 3. Créer le produit dans la BDD
    console.log("\n📝 Création dans la base de données...");

    const product = await prisma.product.create({
      data: {
        handle: "topping-daim",
        sku: "TOP-DAI",
        name: "Topping Daim",
        category: "Modificateurs",
        description: "Morceaux de Daim",
        image: "daim.png",
        price: null,
        isActive: true,
        isModifier: true,
        displayOrder: 0,
        loyverseItemId: item.id,
        variants: {
          create: [
            {
              variantSku: "TOP-DAI",
              option1Name: null,
              option1Value: null,
              option2Name: null,
              option2Value: null,
              price: 10,
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

    console.log("\n🎉 Topping Daim ajouté avec succès!");
  } catch (error) {
    console.error("❌ Erreur:", error);
    if (error instanceof Error) {
      console.error("   Message:", error.message);
    }
    throw error;
  }
}

addToppingDaim()
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
