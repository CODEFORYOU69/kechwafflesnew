/**
 * Script pour optimiser les images du menu
 */

import sharp from "sharp";
import * as fs from "fs";
import * as path from "path";

const IMAGE_DIR = path.join(process.cwd(), "public/images/menu-items");
const OPTIMIZED_DIR = path.join(
  process.cwd(),
  "public/images/menu-items-optimized"
);

// Qualité de compression
const QUALITY = 70; // 70% de qualité
const MAX_WIDTH = 400; // Largeur max en pixels
const MAX_HEIGHT = 400; // Hauteur max en pixels

async function optimizeImages() {
  console.log("🖼️  Optimisation des images du menu...\n");

  try {
    // Créer le dossier optimisé s'il n'existe pas
    if (!fs.existsSync(OPTIMIZED_DIR)) {
      fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
      console.log(`📁 Dossier créé: ${OPTIMIZED_DIR}\n`);
    }

    // Lire tous les fichiers du dossier
    const files = fs.readdirSync(IMAGE_DIR);
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png)$/i.test(file)
    );

    console.log(`📊 ${imageFiles.length} images trouvées\n`);

    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;
    let processedCount = 0;

    for (const file of imageFiles) {
      const inputPath = path.join(IMAGE_DIR, file);
      const outputPath = path.join(OPTIMIZED_DIR, file);

      // Taille originale
      const originalStats = fs.statSync(inputPath);
      totalOriginalSize += originalStats.size;

      try {
        // Optimiser l'image
        await sharp(inputPath)
          .resize(MAX_WIDTH, MAX_HEIGHT, {
            fit: "inside",
            withoutEnlargement: true,
          })
          .jpeg({ quality: QUALITY, mozjpeg: true })
          .png({ quality: QUALITY, compressionLevel: 9 })
          .toFile(outputPath);

        // Taille optimisée
        const optimizedStats = fs.statSync(outputPath);
        totalOptimizedSize += optimizedStats.size;

        const reduction = (
          ((originalStats.size - optimizedStats.size) / originalStats.size) *
          100
        ).toFixed(1);

        console.log(
          `✅ ${file}: ${(originalStats.size / 1024 / 1024).toFixed(2)} MB → ${(optimizedStats.size / 1024 / 1024).toFixed(2)} MB (-${reduction}%)`
        );

        processedCount++;
      } catch (error) {
        console.error(`❌ Erreur avec ${file}:`, error);
      }
    }

    console.log("\n" + "=".repeat(80));
    console.log("📊 RÉSUMÉ:");
    console.log(
      `   Images traitées: ${processedCount}/${imageFiles.length}`
    );
    console.log(
      `   Taille originale totale: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`
    );
    console.log(
      `   Taille optimisée totale: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`
    );
    console.log(
      `   Réduction totale: ${(((totalOriginalSize - totalOptimizedSize) / totalOriginalSize) * 100).toFixed(1)}%`
    );
    console.log("=".repeat(80));

    console.log(
      "\n⚠️  Pour utiliser les images optimisées, renommez ou remplacez le dossier:"
    );
    console.log(`   1. Backup: mv ${IMAGE_DIR} ${IMAGE_DIR}-backup`);
    console.log(`   2. Utiliser: mv ${OPTIMIZED_DIR} ${IMAGE_DIR}`);
  } catch (error) {
    console.error("❌ Erreur:", error);
    throw error;
  }
}

optimizeImages()
  .then(() => {
    console.log("\n✅ Optimisation terminée!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Erreur lors de l'optimisation:", error);
    process.exit(1);
  });
