/**
 * Script de migration: Régénère les QR codes pour qu'ils contiennent
 * uniquement le numéro de carte au lieu de l'URL complète
 */

import { prisma } from "../lib/prisma";
import QRCode from "qrcode";

async function migrateQRCodes() {
  console.log("🔄 Début de la migration des QR codes...\n");

  // Récupérer toutes les cartes membres
  const cards = await prisma.memberCard.findMany({
    select: {
      id: true,
      cardNumber: true,
      qrCode: true,
    },
  });

  console.log(`📊 ${cards.length} carte(s) trouvée(s)\n`);

  let updatedCount = 0;
  let skippedCount = 0;

  for (const card of cards) {
    // Vérifier si le QR code contient une URL (ancien format)
    // Les QR codes sont en data URL base64, donc on ne peut pas lire directement
    // On va régénérer tous les QR codes avec le nouveau format

    try {
      console.log(`🔧 Traitement de la carte ${card.cardNumber}...`);

      // Générer le nouveau QR code avec juste le numéro
      const newQrCode = await QRCode.toDataURL(card.cardNumber, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      // Mettre à jour la carte
      await prisma.memberCard.update({
        where: { id: card.id },
        data: { qrCode: newQrCode },
      });

      console.log(`✅ Carte ${card.cardNumber} mise à jour\n`);
      updatedCount++;
    } catch (error) {
      console.error(`❌ Erreur pour la carte ${card.cardNumber}:`, error);
      skippedCount++;
    }
  }

  console.log("\n📈 Résultats de la migration:");
  console.log(`✅ Cartes mises à jour: ${updatedCount}`);
  console.log(`⏭️  Cartes ignorées: ${skippedCount}`);
  console.log(`📊 Total: ${cards.length}`);
}

// Exécuter le script
migrateQRCodes()
  .then(() => {
    console.log("\n✅ Migration terminée avec succès!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Erreur lors de la migration:", error);
    process.exit(1);
  });
