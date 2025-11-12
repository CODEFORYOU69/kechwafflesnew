/**
 * Script pour optimiser l'image du thé à la menthe
 */

import sharp from "sharp";
import * as fs from "fs";
import * as path from "path";

const IMAGE_PATH = path.join(
  process.cwd(),
  "public/images/menu-items/thémenthe.png"
);
const QUALITY = 70;
const MAX_WIDTH = 400;
const MAX_HEIGHT = 400;

async function optimizeTheMentheImage() {
  console.log("🖼️  Optimisation de l'image thémenthe.png...\n");

  try {
    // Taille originale
    const originalStats = fs.statSync(IMAGE_PATH);
    console.log(
      `📊 Taille originale: ${(originalStats.size / 1024 / 1024).toFixed(2)} MB`
    );

    // Créer une backup
    const backupPath = IMAGE_PATH.replace(".png", "-backup.png");
    fs.copyFileSync(IMAGE_PATH, backupPath);
    console.log(`💾 Backup créé: ${backupPath}\n`);

    // Optimiser
    console.log("⚙️  Compression en cours...");
    await sharp(IMAGE_PATH)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .png({ quality: QUALITY, compressionLevel: 9 })
      .toFile(IMAGE_PATH + ".tmp");

    // Remplacer l'original
    fs.unlinkSync(IMAGE_PATH);
    fs.renameSync(IMAGE_PATH + ".tmp", IMAGE_PATH);

    // Taille optimisée
    const optimizedStats = fs.statSync(IMAGE_PATH);
    const reduction = (
      ((originalStats.size - optimizedStats.size) / originalStats.size) *
      100
    ).toFixed(1);

    console.log(
      `✅ Optimisée: ${(optimizedStats.size / 1024 / 1024).toFixed(2)} MB (-${reduction}%)`
    );
  } catch (error) {
    console.error("❌ Erreur:", error);
    throw error;
  }
}

optimizeTheMentheImage()
  .then(() => {
    console.log("\n✅ Optimisation terminée!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Erreur:", error);
    process.exit(1);
  });
