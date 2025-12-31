import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Corrections d'horaires (heure locale Maroc)
const timeCorrections: Record<number, string> = {
  // 24 décembre
  25: "16:00", // Algérie vs Soudan
  26: "13:30", // Burkina Faso vs Guinée Équatoriale
  31: "18:30", // Côte d'Ivoire vs Mozambique
  // 26 décembre
  7: "18:00",  // Maroc vs Mali (déjà correct)
  8: "18:30",  // Zambie vs Comores
  9: "16:00",  // Égypte vs Afrique du Sud
  10: "13:30", // Angola vs Zimbabwe
  // 27 décembre
  11: "18:00", // Nigeria vs Tunisie (déjà correct)
  12: "18:30", // Ouganda vs Tanzanie
  21: "16:00", // RD Congo vs Sénégal
  22: "13:30", // Bénin vs Botswana
  // 28 décembre
  27: "18:30", // Algérie vs Burkina Faso
  28: "16:00", // Guinée Équatoriale vs Soudan
  33: "18:00", // Cameroun vs Côte d'Ivoire (déjà correct)
  34: "13:30", // Gabon vs Mozambique
  // 29 décembre
  13: "20:00", // Maroc vs Zambie
  14: "20:00", // Comores vs Mali
  15: "17:00", // Égypte vs Angola
  16: "17:00", // Zimbabwe vs Afrique du Sud
  // 30 décembre
  17: "17:00", // Nigeria vs Ouganda
  18: "17:00", // Tanzanie vs Tunisie
  23: "20:00", // Botswana vs RD Congo
  24: "20:00", // Bénin vs Sénégal
  // 31 décembre
  29: "17:00", // Guinée Équatoriale vs Algérie
  30: "17:00", // Burkina Faso vs Soudan
  35: "20:00", // Cameroun vs Mozambique
  36: "20:00", // Côte d'Ivoire vs Gabon
};

async function main() {
  console.log("🕐 Correction des horaires des matchs CAN 2025...\n");

  for (const [matchNumberStr, newTime] of Object.entries(timeCorrections)) {
    const matchNumber = parseInt(matchNumberStr);

    const match = await prisma.match.findUnique({
      where: { matchNumber },
      include: { homeTeam: true, awayTeam: true },
    });

    if (!match) {
      console.log(`❌ Match #${matchNumber} non trouvé`);
      continue;
    }

    // Récupérer la date actuelle du match
    const currentDate = new Date(match.scheduledAt);

    // Extraire l'heure et les minutes de la nouvelle heure
    const [hours, minutes] = newTime.split(":").map(Number);

    // Créer la nouvelle date avec la nouvelle heure
    // Maroc est en UTC+1 depuis 2018 (fin du changement d'heure)
    // Donc pour avoir 13:30 heure locale, on doit mettre 12:30 UTC
    const newDate = new Date(currentDate);
    newDate.setUTCHours(hours - 1, minutes, 0, 0);

    const oldTime = currentDate.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC"
    });

    // Mettre à jour le match
    await prisma.match.update({
      where: { matchNumber },
      data: { scheduledAt: newDate },
    });

    console.log(`✅ Match #${matchNumber}: ${match.homeTeam.nameFr} vs ${match.awayTeam.nameFr}`);
    console.log(`   ${oldTime} → ${newTime}`);
  }

  console.log("\n✅ Tous les horaires ont été corrigés !");
}

main()
  .catch((e) => {
    console.error("Erreur:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
