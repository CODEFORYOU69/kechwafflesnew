/**
 * Système de Tirage au Sort Hebdomadaire - Concours 2
 *
 * Tire au sort des gagnants parmi les participants qui ont scanné
 * au moins 1 QR code pendant la semaine
 */

import { prisma } from "@/lib/prisma";

/**
 * Types de lots pour les tirages
 */
export const PRIZE_TYPES = {
  WEEKLY_1: {
    title: "Gaufre XXL",
    description: "Une gaufre XXL offerte chez Kech Waffles",
    value: 50,
  },
  WEEKLY_2: {
    title: "Ticanmisu",
    description: "Un ticanmisu offert chez Kech Waffles",
    value: 60,
  },
  WEEKLY_3: {
    title: "Menu complet",
    description: "Un menu complet chez Kech Waffles",
    value: 80,
  },
  GRAND_PRIZE: {
    title: "GRAND PRIX - Voyage à Marrakech",
    description: "Week-end pour 2 personnes à Marrakech",
    value: 5000,
  },
} as const;

/**
 * Récupère les dates de début et fin d'une semaine
 */
function getWeekDates(year: number, week: number): { startDate: Date; endDate: Date } {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart = simple;
  if (dow <= 4)
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());

  const startDate = new Date(ISOweekStart);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(ISOweekStart);
  endDate.setDate(endDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);

  return { startDate, endDate };
}

/**
 * Récupère ou crée un tirage pour une semaine donnée
 */
export async function getOrCreateWeeklyDraw(
  year: number,
  weekNumber: number
): Promise<{
  id: string;
  weekNumber: number;
  year: number;
  startDate: Date;
  endDate: Date;
  isCompleted: boolean;
  totalParticipants: number;
  winners: Array<{
    id: string;
    position: number;
    prizeTitle: string;
    user: {
      name: string;
      email: string;
    };
  }>;
}> {
  const { startDate, endDate } = getWeekDates(year, weekNumber);

  let draw = await prisma.weeklyDraw.findUnique({
    where: {
      year_weekNumber_drawType: {
        year,
        weekNumber,
        drawType: "WEEKLY",
      },
    },
    include: {
      winners: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!draw) {
    draw = await prisma.weeklyDraw.create({
      data: {
        year,
        weekNumber,
        startDate,
        endDate,
        drawType: "WEEKLY",
        totalParticipants: 0,
        totalScans: 0,
      },
      include: {
        winners: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });
  }

  return draw;
}

/**
 * Récupère les participants éligibles pour une période
 * (au moins 1 scan pendant la période)
 */
async function getEligibleParticipants(startDate: Date, endDate: Date) {
  const participants = await prisma.qRScan.groupBy({
    by: ["userId"],
    where: {
      scannedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    _count: {
      userId: true,
    },
  });

  return participants.map(p => ({
    userId: p.userId,
    scanCount: p._count.userId,
  }));
}

/**
 * Effectue le tirage au sort hebdomadaire
 */
export async function performWeeklyDraw(options: {
  year: number;
  weekNumber: number;
  numberOfWinners?: number;
  prizes?: Array<{
    position: number;
    prizeType: string;
    prizeTitle: string;
    prizeDescription?: string;
    prizeValue?: number;
    prizeImage?: string;
    partnerId?: string;
  }>;
}): Promise<{
  success: boolean;
  message: string;
  draw?: {
    id: string;
    totalParticipants: number;
    winners: Array<{
      position: number;
      prizeTitle: string;
      userName: string;
      scanCount: number;
    }>;
  };
}> {
  try {
    const { year, weekNumber, numberOfWinners = 3, prizes } = options;

    // Vérifie si le tirage existe déjà
    const existingDraw = await getOrCreateWeeklyDraw(year, weekNumber);

    if (existingDraw.isCompleted) {
      return {
        success: false,
        message: "Le tirage a déjà été effectué pour cette semaine",
      };
    }

    // Récupère les participants éligibles
    const { startDate, endDate } = getWeekDates(year, weekNumber);
    const eligibleParticipants = await getEligibleParticipants(startDate, endDate);

    if (eligibleParticipants.length === 0) {
      return {
        success: false,
        message: "Aucun participant éligible pour cette période",
      };
    }

    // Sélectionne les gagnants aléatoirement
    const shuffled = [...eligibleParticipants].sort(() => Math.random() - 0.5);
    const winners = shuffled.slice(0, Math.min(numberOfWinners, shuffled.length));

    // Lots par défaut
    const defaultPrizes = [
      {
        position: 1,
        prizeType: "WEEKLY_1",
        prizeTitle: PRIZE_TYPES.WEEKLY_1.title,
        prizeDescription: PRIZE_TYPES.WEEKLY_1.description,
        prizeValue: PRIZE_TYPES.WEEKLY_1.value,
      },
      {
        position: 2,
        prizeType: "WEEKLY_2",
        prizeTitle: PRIZE_TYPES.WEEKLY_2.title,
        prizeDescription: PRIZE_TYPES.WEEKLY_2.description,
        prizeValue: PRIZE_TYPES.WEEKLY_2.value,
      },
      {
        position: 3,
        prizeType: "WEEKLY_3",
        prizeTitle: PRIZE_TYPES.WEEKLY_3.title,
        prizeDescription: PRIZE_TYPES.WEEKLY_3.description,
        prizeValue: PRIZE_TYPES.WEEKLY_3.value,
      },
    ];

    const prizesData = prizes || defaultPrizes;

    // Enregistre les gagnants
    await prisma.$transaction([
      // Crée les entrées de gagnants
      ...winners.map((winner, index) => {
        const prize = prizesData[index] || prizesData[0];
        return prisma.drawWinner.create({
          data: {
            drawId: existingDraw.id,
            userId: winner.userId,
            position: prize.position,
            prizeType: prize.prizeType,
            prizeTitle: prize.prizeTitle,
            prizeDescription: prize.prizeDescription,
            prizeValue: prize.prizeValue,
            prizeImage: "prizeImage" in prize ? prize.prizeImage : undefined,
            partnerId: "partnerId" in prize ? prize.partnerId : undefined,
            scanCount: winner.scanCount,
          },
        });
      }),
      // Met à jour le tirage
      prisma.weeklyDraw.update({
        where: { id: existingDraw.id },
        data: {
          isCompleted: true,
          drawnAt: new Date(),
          totalParticipants: eligibleParticipants.length,
          totalScans: eligibleParticipants.reduce((sum, p) => sum + p.scanCount, 0),
        },
      }),
    ]);

    // Récupère les infos complètes des gagnants
    const winnersWithDetails = await prisma.drawWinner.findMany({
      where: {
        drawId: existingDraw.id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        position: "asc",
      },
    });

    return {
      success: true,
      message: `Tirage effectué avec succès ! ${winners.length} gagnant(s) sélectionné(s).`,
      draw: {
        id: existingDraw.id,
        totalParticipants: eligibleParticipants.length,
        winners: winnersWithDetails.map((w) => ({
          position: w.position,
          prizeTitle: w.prizeTitle,
          userName: w.user.name,
          scanCount: w.scanCount,
        })),
      },
    };
  } catch (error) {
    console.error("Erreur lors du tirage:", error);
    return {
      success: false,
      message: "Erreur lors du tirage au sort",
    };
  }
}

/**
 * Récupère tous les tirages avec leurs gagnants
 */
export async function getAllDraws() {
  const draws = await prisma.weeklyDraw.findMany({
    include: {
      winners: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          partner: {
            select: {
              name: true,
              logo: true,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
    orderBy: [
      { year: "desc" },
      { weekNumber: "desc" },
    ],
  });

  return draws;
}

/**
 * Récupère les gains d'un utilisateur
 */
export async function getUserDrawWinnings(userId: string) {
  const winnings = await prisma.drawWinner.findMany({
    where: {
      userId,
    },
    include: {
      draw: {
        select: {
          weekNumber: true,
          year: true,
          drawType: true,
          drawnAt: true,
        },
      },
      partner: {
        select: {
          name: true,
          logo: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return winnings;
}

/**
 * Marque un lot comme réclamé
 */
export async function claimPrize(winnerId: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const winner = await prisma.drawWinner.findUnique({
      where: { id: winnerId },
    });

    if (!winner) {
      return {
        success: false,
        message: "Gagnant introuvable",
      };
    }

    if (winner.isClaimed) {
      return {
        success: false,
        message: "Ce lot a déjà été réclamé",
      };
    }

    await prisma.drawWinner.update({
      where: { id: winnerId },
      data: {
        isClaimed: true,
        claimedAt: new Date(),
      },
    });

    return {
      success: true,
      message: "Lot réclamé avec succès",
    };
  } catch (error) {
    console.error("Erreur réclamation lot:", error);
    return {
      success: false,
      message: "Erreur lors de la réclamation",
    };
  }
}
