/**
 * Script pour uploader l'image de Ice Dalgona dans Loyverse
 * Usage: pnpm tsx scripts/upload-dalgona-image.ts
 */

import { uploadLoyverseItemImage } from "@/lib/loyalty/loyverse";
import fs from "fs";
import path from "path";

async function uploadDalgonaImage() {
  console.log("📸 Upload de l'image Ice Dalgona dans Loyverse...\n");

  // ID du produit créé précédemment
  const itemId = "c30585a0-1271-4cc2-b0fb-5448cf7162c6";

  try {
    const imagePath = path.join(process.cwd(), "public/images/menu-items/DALGONA.png");

    if (!fs.existsSync(imagePath)) {
      console.error("❌ Image DALGONA.png introuvable");
      process.exit(1);
    }

    console.log("📂 Lecture du fichier DALGONA.png...");
    const imageBuffer = fs.readFileSync(imagePath);
    console.log(`   Taille: ${(imageBuffer.length / 1024).toFixed(2)} KB`);

    console.log("\n⬆️  Upload vers Loyverse...");
    await uploadLoyverseItemImage(itemId, imageBuffer, "DALGONA.png");

    console.log("✅ Image uploadée avec succès !");
  } catch (error) {
    console.error("❌ Erreur:", error);
    if (error instanceof Error) {
      console.error("   Message:", error.message);
    }
    process.exit(1);
  }
}

uploadDalgonaImage()
  .then(() => {
    console.log("\n🎉 Upload terminé !");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Erreur:", error);
    process.exit(1);
  });
