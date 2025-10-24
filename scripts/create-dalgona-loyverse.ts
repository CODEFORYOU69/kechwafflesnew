/**
 * Script pour créer Ice Dalgona dans Loyverse via API
 * Usage: pnpm tsx scripts/create-dalgona-loyverse.ts
 */

import { createLoyverseItem, uploadLoyverseItemImage } from "@/lib/loyalty/loyverse";
import fs from "fs";
import path from "path";

async function createDalgonaInLoyverse() {
  console.log("☕ Création de Ice Dalgona dans Loyverse...\n");

  try {
    // Créer le produit dans Loyverse
    const item = await createLoyverseItem({
      name: "Ice Dalgona",
      sku: "ICE-DAL",
      price: 25,
    });

    console.log("✅ Produit créé dans Loyverse avec succès !");
    console.log(`   ID Loyverse: ${item.id}`);
    console.log(`   Nom: ${item.item_name}`);
    console.log(`   SKU: ${item.reference_id}`);
    console.log(`   Prix: ${item.variants[0].default_price} Dh`);

    // Upload de l'image
    const imagePath = path.join(process.cwd(), "public/images/menu-items/DALGONA.png");

    if (fs.existsSync(imagePath)) {
      console.log("\n📸 Upload de l'image DALGONA.png...");
      const imageBuffer = fs.readFileSync(imagePath);

      await uploadLoyverseItemImage(item.id, imageBuffer, "DALGONA.png");
      console.log("✅ Image uploadée avec succès !");
    } else {
      console.log("\n⚠️  Image DALGONA.png introuvable");
    }

    console.log("\n🎯 Prochaine étape: Mettre à jour le produit dans la base de données");
    console.log("   avec loyverseId et loyverseVariantId");
    console.log(`   UPDATE Product SET loyverseId = '${item.id}' WHERE sku = 'ICE-DAL'`);
    console.log(`   UPDATE Variant SET loyverseVariantId = '${item.variants[0].variant_id}' ...`);
  } catch (error) {
    console.error("❌ Erreur:", error);
    if (error instanceof Error) {
      console.error("   Message:", error.message);
    }
    process.exit(1);
  }
}

createDalgonaInLoyverse()
  .then(() => {
    console.log("\n🎉 Script terminé !");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Erreur:", error);
    process.exit(1);
  });
