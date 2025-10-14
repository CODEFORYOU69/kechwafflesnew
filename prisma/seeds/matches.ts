/**
 * Seed des matchs de la phase de poules CAN 2025
 * 36 matchs (6 groupes × 6 matchs par groupe)
 * Du 21 décembre 2025 au 2 janvier 2026
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const groupStageMatches = [
  // ========== GROUPE A ==========
  // Journée 1
  {
    matchNumber: 1,
    phase: "GROUP_STAGE",
    homeTeamCode: "MAR",
    awayTeamCode: "COM",
    scheduledAt: new Date("2025-12-21T17:00:00Z"),
    venue: "Stade Mohammed V",
    city: "Casablanca",
  },
  {
    matchNumber: 2,
    phase: "GROUP_STAGE",
    homeTeamCode: "MLI",
    awayTeamCode: "ZAM",
    scheduledAt: new Date("2025-12-21T20:00:00Z"),
    venue: "Stade Mohammed V",
    city: "Casablanca",
  },
  // Journée 2
  {
    matchNumber: 7,
    phase: "GROUP_STAGE",
    homeTeamCode: "MAR",
    awayTeamCode: "ZAM",
    scheduledAt: new Date("2025-12-25T17:00:00Z"),
    venue: "Stade Mohammed V",
    city: "Casablanca",
  },
  {
    matchNumber: 8,
    phase: "GROUP_STAGE",
    homeTeamCode: "COM",
    awayTeamCode: "MLI",
    scheduledAt: new Date("2025-12-25T17:00:00Z"),
    venue: "Stade Prince Moulay Abdellah",
    city: "Rabat",
  },
  // Journée 3
  {
    matchNumber: 13,
    phase: "GROUP_STAGE",
    homeTeamCode: "ZAM",
    awayTeamCode: "COM",
    scheduledAt: new Date("2025-12-29T20:00:00Z"),
    venue: "Stade Prince Moulay Abdellah",
    city: "Rabat",
  },
  {
    matchNumber: 14,
    phase: "GROUP_STAGE",
    homeTeamCode: "MLI",
    awayTeamCode: "MAR",
    scheduledAt: new Date("2025-12-29T20:00:00Z"),
    venue: "Stade Mohammed V",
    city: "Casablanca",
  },

  // ========== GROUPE B ==========
  // Journée 1
  {
    matchNumber: 3,
    phase: "GROUP_STAGE",
    homeTeamCode: "EGY",
    awayTeamCode: "ZIM",
    scheduledAt: new Date("2025-12-22T17:00:00Z"),
    venue: "Stade d'Agadir",
    city: "Agadir",
  },
  {
    matchNumber: 4,
    phase: "GROUP_STAGE",
    homeTeamCode: "RSA",
    awayTeamCode: "ANG",
    scheduledAt: new Date("2025-12-22T20:00:00Z"),
    venue: "Stade d'Agadir",
    city: "Agadir",
  },
  // Journée 2
  {
    matchNumber: 9,
    phase: "GROUP_STAGE",
    homeTeamCode: "EGY",
    awayTeamCode: "ANG",
    scheduledAt: new Date("2025-12-26T17:00:00Z"),
    venue: "Stade d'Agadir",
    city: "Agadir",
  },
  {
    matchNumber: 10,
    phase: "GROUP_STAGE",
    homeTeamCode: "ZIM",
    awayTeamCode: "RSA",
    scheduledAt: new Date("2025-12-26T17:00:00Z"),
    venue: "Grand Stade de Marrakech",
    city: "Marrakech",
  },
  // Journée 3
  {
    matchNumber: 15,
    phase: "GROUP_STAGE",
    homeTeamCode: "ANG",
    awayTeamCode: "ZIM",
    scheduledAt: new Date("2025-12-30T20:00:00Z"),
    venue: "Grand Stade de Marrakech",
    city: "Marrakech",
  },
  {
    matchNumber: 16,
    phase: "GROUP_STAGE",
    homeTeamCode: "RSA",
    awayTeamCode: "EGY",
    scheduledAt: new Date("2025-12-30T20:00:00Z"),
    venue: "Stade d'Agadir",
    city: "Agadir",
  },

  // ========== GROUPE C ==========
  // Journée 1
  {
    matchNumber: 5,
    phase: "GROUP_STAGE",
    homeTeamCode: "SEN",
    awayTeamCode: "TAN",
    scheduledAt: new Date("2025-12-23T17:00:00Z"),
    venue: "Stade de Fès",
    city: "Fès",
  },
  {
    matchNumber: 6,
    phase: "GROUP_STAGE",
    homeTeamCode: "CMR",
    awayTeamCode: "COD",
    scheduledAt: new Date("2025-12-23T20:00:00Z"),
    venue: "Stade de Fès",
    city: "Fès",
  },
  // Journée 2
  {
    matchNumber: 11,
    phase: "GROUP_STAGE",
    homeTeamCode: "SEN",
    awayTeamCode: "COD",
    scheduledAt: new Date("2025-12-27T17:00:00Z"),
    venue: "Stade de Fès",
    city: "Fès",
  },
  {
    matchNumber: 12,
    phase: "GROUP_STAGE",
    homeTeamCode: "TAN",
    awayTeamCode: "CMR",
    scheduledAt: new Date("2025-12-27T17:00:00Z"),
    venue: "Complexe Sportif Moulay Abdellah",
    city: "Rabat",
  },
  // Journée 3
  {
    matchNumber: 17,
    phase: "GROUP_STAGE",
    homeTeamCode: "COD",
    awayTeamCode: "TAN",
    scheduledAt: new Date("2025-12-31T20:00:00Z"),
    venue: "Complexe Sportif Moulay Abdellah",
    city: "Rabat",
  },
  {
    matchNumber: 18,
    phase: "GROUP_STAGE",
    homeTeamCode: "CMR",
    awayTeamCode: "SEN",
    scheduledAt: new Date("2025-12-31T20:00:00Z"),
    venue: "Stade de Fès",
    city: "Fès",
  },

  // ========== GROUPE D ==========
  // Journée 1
  {
    matchNumber: 19,
    phase: "GROUP_STAGE",
    homeTeamCode: "ALG",
    awayTeamCode: "SUD",
    scheduledAt: new Date("2025-12-24T17:00:00Z"),
    venue: "Stade Municipal de Berkane",
    city: "Berkane",
  },
  {
    matchNumber: 20,
    phase: "GROUP_STAGE",
    homeTeamCode: "NGA",
    awayTeamCode: "TUN",
    scheduledAt: new Date("2025-12-24T20:00:00Z"),
    venue: "Stade Municipal de Berkane",
    city: "Berkane",
  },
  // Journée 2
  {
    matchNumber: 21,
    phase: "GROUP_STAGE",
    homeTeamCode: "ALG",
    awayTeamCode: "TUN",
    scheduledAt: new Date("2025-12-28T17:00:00Z"),
    venue: "Stade Municipal de Berkane",
    city: "Berkane",
  },
  {
    matchNumber: 22,
    phase: "GROUP_STAGE",
    homeTeamCode: "SUD",
    awayTeamCode: "NGA",
    scheduledAt: new Date("2025-12-28T17:00:00Z"),
    venue: "Stade d'Oujda",
    city: "Oujda",
  },
  // Journée 3
  {
    matchNumber: 23,
    phase: "GROUP_STAGE",
    homeTeamCode: "TUN",
    awayTeamCode: "SUD",
    scheduledAt: new Date("2026-01-01T20:00:00Z"),
    venue: "Stade d'Oujda",
    city: "Oujda",
  },
  {
    matchNumber: 24,
    phase: "GROUP_STAGE",
    homeTeamCode: "NGA",
    awayTeamCode: "ALG",
    scheduledAt: new Date("2026-01-01T20:00:00Z"),
    venue: "Stade Municipal de Berkane",
    city: "Berkane",
  },

  // ========== GROUPE E ==========
  // Journée 1
  {
    matchNumber: 25,
    phase: "GROUP_STAGE",
    homeTeamCode: "CIV",
    awayTeamCode: "BEN",
    scheduledAt: new Date("2025-12-24T17:00:00Z"),
    venue: "Stade Ibn Batouta",
    city: "Tanger",
  },
  {
    matchNumber: 26,
    phase: "GROUP_STAGE",
    homeTeamCode: "GHA",
    awayTeamCode: "MOZ",
    scheduledAt: new Date("2025-12-24T20:00:00Z"),
    venue: "Stade Ibn Batouta",
    city: "Tanger",
  },
  // Journée 2
  {
    matchNumber: 27,
    phase: "GROUP_STAGE",
    homeTeamCode: "CIV",
    awayTeamCode: "MOZ",
    scheduledAt: new Date("2025-12-28T17:00:00Z"),
    venue: "Stade Ibn Batouta",
    city: "Tanger",
  },
  {
    matchNumber: 28,
    phase: "GROUP_STAGE",
    homeTeamCode: "BEN",
    awayTeamCode: "GHA",
    scheduledAt: new Date("2025-12-28T17:00:00Z"),
    venue: "Stade de Tétouan",
    city: "Tétouan",
  },
  // Journée 3
  {
    matchNumber: 29,
    phase: "GROUP_STAGE",
    homeTeamCode: "MOZ",
    awayTeamCode: "BEN",
    scheduledAt: new Date("2026-01-01T20:00:00Z"),
    venue: "Stade de Tétouan",
    city: "Tétouan",
  },
  {
    matchNumber: 30,
    phase: "GROUP_STAGE",
    homeTeamCode: "GHA",
    awayTeamCode: "CIV",
    scheduledAt: new Date("2026-01-01T20:00:00Z"),
    venue: "Stade Ibn Batouta",
    city: "Tanger",
  },

  // ========== GROUPE F ==========
  // Journée 1
  {
    matchNumber: 31,
    phase: "GROUP_STAGE",
    homeTeamCode: "BFA",
    awayTeamCode: "BOT",
    scheduledAt: new Date("2025-12-25T17:00:00Z"),
    venue: "Grand Stade de Marrakech",
    city: "Marrakech",
  },
  {
    matchNumber: 32,
    phase: "GROUP_STAGE",
    homeTeamCode: "GAB",
    awayTeamCode: "UGA",
    scheduledAt: new Date("2025-12-25T20:00:00Z"),
    venue: "Grand Stade de Marrakech",
    city: "Marrakech",
  },
  // Journée 2
  {
    matchNumber: 33,
    phase: "GROUP_STAGE",
    homeTeamCode: "BFA",
    awayTeamCode: "UGA",
    scheduledAt: new Date("2025-12-29T17:00:00Z"),
    venue: "Grand Stade de Marrakech",
    city: "Marrakech",
  },
  {
    matchNumber: 34,
    phase: "GROUP_STAGE",
    homeTeamCode: "BOT",
    awayTeamCode: "GAB",
    scheduledAt: new Date("2025-12-29T17:00:00Z"),
    venue: "Stade d'Agadir",
    city: "Agadir",
  },
  // Journée 3
  {
    matchNumber: 35,
    phase: "GROUP_STAGE",
    homeTeamCode: "UGA",
    awayTeamCode: "BOT",
    scheduledAt: new Date("2026-01-02T20:00:00Z"),
    venue: "Stade d'Agadir",
    city: "Agadir",
  },
  {
    matchNumber: 36,
    phase: "GROUP_STAGE",
    homeTeamCode: "GAB",
    awayTeamCode: "BFA",
    scheduledAt: new Date("2026-01-02T20:00:00Z"),
    venue: "Grand Stade de Marrakech",
    city: "Marrakech",
  },
];

export async function seedGroupStageMatches() {
  console.log("⚽ Seeding group stage matches...");

  for (const matchData of groupStageMatches) {
    // Find team IDs
    const homeTeam = await prisma.team.findUnique({
      where: { code: matchData.homeTeamCode },
    });
    const awayTeam = await prisma.team.findUnique({
      where: { code: matchData.awayTeamCode },
    });

    if (!homeTeam || !awayTeam) {
      console.error(
        `❌ Teams not found: ${matchData.homeTeamCode} vs ${matchData.awayTeamCode}`
      );
      continue;
    }

    await prisma.match.upsert({
      where: { matchNumber: matchData.matchNumber },
      update: {
        phase: matchData.phase as "GROUP_STAGE",
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        scheduledAt: matchData.scheduledAt,
        venue: matchData.venue,
        city: matchData.city,
        lockPronostics: false,
        isFinished: false,
      },
      create: {
        matchNumber: matchData.matchNumber,
        phase: matchData.phase as "GROUP_STAGE",
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        scheduledAt: matchData.scheduledAt,
        venue: matchData.venue,
        city: matchData.city,
        lockPronostics: false,
        isFinished: false,
      },
    });
  }

  console.log(`✅ ${groupStageMatches.length} group stage matches seeded!`);
}

// Execute if run directly
if (require.main === module) {
  seedGroupStageMatches()
    .then(() => {
      console.log("✅ Matches seed completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Error seeding matches:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
