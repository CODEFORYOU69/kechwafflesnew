/**
 * Seed des 24 équipes qualifiées pour la CAN 2025 au Maroc
 * Réparties en 6 groupes de 4 équipes
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const teams = [
  // GROUPE A
  {
    name: "Morocco",
    nameFr: "Maroc",
    nameAr: "المغرب",
    code: "MAR",
    flag: "https://flagcdn.com/w320/ma.png",
    group: "A",
  },
  {
    name: "Mali",
    nameFr: "Mali",
    nameAr: "مالي",
    code: "MLI",
    flag: "https://flagcdn.com/w320/ml.png",
    group: "A",
  },
  {
    name: "Zambia",
    nameFr: "Zambie",
    nameAr: "زامبيا",
    code: "ZAM",
    flag: "https://flagcdn.com/w320/zm.png",
    group: "A",
  },
  {
    name: "Comoros",
    nameFr: "Comores",
    nameAr: "جزر القمر",
    code: "COM",
    flag: "https://flagcdn.com/w320/km.png",
    group: "A",
  },

  // GROUPE B
  {
    name: "Egypt",
    nameFr: "Égypte",
    nameAr: "مصر",
    code: "EGY",
    flag: "https://flagcdn.com/w320/eg.png",
    group: "B",
  },
  {
    name: "Zimbabwe",
    nameFr: "Zimbabwe",
    nameAr: "زيمبابوي",
    code: "ZIM",
    flag: "https://flagcdn.com/w320/zw.png",
    group: "B",
  },
  {
    name: "South Africa",
    nameFr: "Afrique du Sud",
    nameAr: "جنوب أفريقيا",
    code: "RSA",
    flag: "https://flagcdn.com/w320/za.png",
    group: "B",
  },
  {
    name: "Angola",
    nameFr: "Angola",
    nameAr: "أنغولا",
    code: "ANG",
    flag: "https://flagcdn.com/w320/ao.png",
    group: "B",
  },

  // GROUPE C
  {
    name: "Nigeria",
    nameFr: "Nigeria",
    nameAr: "نيجيريا",
    code: "NGA",
    flag: "https://flagcdn.com/w320/ng.png",
    group: "C",
  },
  {
    name: "Tanzania",
    nameFr: "Tanzanie",
    nameAr: "تنزانيا",
    code: "TAN",
    flag: "https://flagcdn.com/w320/tz.png",
    group: "C",
  },
  {
    name: "Tunisia",
    nameFr: "Tunisie",
    nameAr: "تونس",
    code: "TUN",
    flag: "https://flagcdn.com/w320/tn.png",
    group: "C",
  },
  {
    name: "Uganda",
    nameFr: "Ouganda",
    nameAr: "أوغندا",
    code: "UGA",
    flag: "https://flagcdn.com/w320/ug.png",
    group: "C",
  },

  // GROUPE D
  {
    name: "Senegal",
    nameFr: "Sénégal",
    nameAr: "السنغال",
    code: "SEN",
    flag: "https://flagcdn.com/w320/sn.png",
    group: "D",
  },
  {
    name: "Botswana",
    nameFr: "Botswana",
    nameAr: "بوتسوانا",
    code: "BOT",
    flag: "https://flagcdn.com/w320/bw.png",
    group: "D",
  },
  {
    name: "DR Congo",
    nameFr: "RD Congo",
    nameAr: "الكونغو الديمقراطية",
    code: "COD",
    flag: "https://flagcdn.com/w320/cd.png",
    group: "D",
  },
  {
    name: "Benin",
    nameFr: "Bénin",
    nameAr: "بنين",
    code: "BEN",
    flag: "https://flagcdn.com/w320/bj.png",
    group: "D",
  },

  // GROUPE E
  {
    name: "Algeria",
    nameFr: "Algérie",
    nameAr: "الجزائر",
    code: "ALG",
    flag: "https://flagcdn.com/w320/dz.png",
    group: "E",
  },
  {
    name: "Sudan",
    nameFr: "Soudan",
    nameAr: "السودان",
    code: "SUD",
    flag: "https://flagcdn.com/w320/sd.png",
    group: "E",
  },
  {
    name: "Burkina Faso",
    nameFr: "Burkina Faso",
    nameAr: "بوركينا فاسو",
    code: "BFA",
    flag: "https://flagcdn.com/w320/bf.png",
    group: "E",
  },
  {
    name: "Equatorial Guinea",
    nameFr: "Guinée Équatoriale",
    nameAr: "غينيا الاستوائية",
    code: "GEQ",
    flag: "https://flagcdn.com/w320/gq.png",
    group: "E",
  },

  // GROUPE F
  {
    name: "Ivory Coast",
    nameFr: "Côte d'Ivoire",
    nameAr: "ساحل العاج",
    code: "CIV",
    flag: "https://flagcdn.com/w320/ci.png",
    group: "F",
  },
  {
    name: "Mozambique",
    nameFr: "Mozambique",
    nameAr: "موزمبيق",
    code: "MOZ",
    flag: "https://flagcdn.com/w320/mz.png",
    group: "F",
  },
  {
    name: "Cameroon",
    nameFr: "Cameroun",
    nameAr: "الكاميرون",
    code: "CMR",
    flag: "https://flagcdn.com/w320/cm.png",
    group: "F",
  },
  {
    name: "Gabon",
    nameFr: "Gabon",
    nameAr: "الغابون",
    code: "GAB",
    flag: "https://flagcdn.com/w320/ga.png",
    group: "F",
  },
];

export async function seedTeams() {
  console.log("🌍 Seeding teams...");

  for (const team of teams) {
    await prisma.team.upsert({
      where: { code: team.code },
      update: team,
      create: team,
    });
  }

  console.log(`✅ ${teams.length} teams seeded successfully!`);
}

// Execute if run directly
if (require.main === module) {
  seedTeams()
    .then(() => {
      console.log("✅ Teams seed completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Error seeding teams:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
