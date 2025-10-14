/**
 * Système de Tickets Buteur - Concours 3
 *
 * À chaque menu acheté, le client reçoit un ticket avec un buteur aléatoire
 * Si ce buteur marque lors du match, le client gagne un lot
 */

import { customAlphabet } from "nanoid";
import { prisma } from "@/lib/prisma";

const generateTicketCode = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);

/**
 * Types de lots disponibles
 */
export const PRIZE_TYPES = {
  SMOOTHIE: {
    label: "Smoothie offert",
    value: 25, // MAD
    probability: 0.5, // 50%
  },
  GAUFRE: {
    label: "Gaufre offerte",
    value: 30, // MAD
    probability: 0.3, // 30%
  },
  BON_PARTENAIRE: {
    label: "Bon d'achat partenaire 50 MAD",
    value: 50, // MAD
    probability: 0.2, // 20%
  },
} as const;

/**
 * Génère un code de ticket unique
 */
async function generateUniqueTicketCode(): Promise<string> {
  let ticketCode: string;
  let exists = true;

  while (exists) {
    ticketCode = `BUT-${generateTicketCode()}`;
    const existing = await prisma.buteurTicket.findUnique({
      where: { ticketCode },
    });
    exists = !!existing;
  }

  return ticketCode!;
}

/**
 * Sélectionne un joueur aléatoire parmi les joueurs des 2 équipes du match
 */
async function selectRandomPlayer(matchId: string): Promise<string | null> {
  // Récupère le match et ses équipes
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      homeTeam: {
        include: {
          players: true,
        },
      },
      awayTeam: {
        include: {
          players: true,
        },
      },
    },
  });

  if (!match) return null;

  // Combine tous les joueurs des 2 équipes
  const allPlayers = [...match.homeTeam.players, ...match.awayTeam.players];

  if (allPlayers.length === 0) return null;

  // Sélectionne un joueur aléatoire
  const randomIndex = Math.floor(Math.random() * allPlayers.length);
  return allPlayers[randomIndex].id;
}

/**
 * Sélectionne un type de lot aléatoire selon les probabilités
 */
function selectRandomPrize(): {
  type: keyof typeof PRIZE_TYPES;
  label: string;
  value: number;
} {
  const rand = Math.random();
  let cumulative = 0;

  for (const [key, prize] of Object.entries(PRIZE_TYPES)) {
    cumulative += prize.probability;
    if (rand <= cumulative) {
      return {
        type: key as keyof typeof PRIZE_TYPES,
        label: prize.label,
        value: prize.value,
      };
    }
  }

  // Fallback (ne devrait jamais arriver)
  return {
    type: "SMOOTHIE",
    label: PRIZE_TYPES.SMOOTHIE.label,
    value: PRIZE_TYPES.SMOOTHIE.value,
  };
}

/**
 * Crée un ticket buteur pour un match
 * Appelé lors de l'achat d'un menu
 */
export async function createButeurTicket(data: {
  matchId: string;
  userId?: string; // Optionnel si achat anonyme
}): Promise<{
  success: boolean;
  ticket?: {
    ticketCode: string;
    playerId: string;
    playerName: string;
    teamName: string;
    matchInfo: string;
  };
  message: string;
}> {
  try {
    // Vérifie que le match existe et n'est pas encore commencé
    const match = await prisma.match.findUnique({
      where: { id: data.matchId },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    if (!match) {
      return {
        success: false,
        message: "Match introuvable",
      };
    }

    if (match.isFinished) {
      return {
        success: false,
        message: "Ce match est déjà terminé",
      };
    }

    // Sélectionne un joueur aléatoire
    const playerId = await selectRandomPlayer(data.matchId);

    if (!playerId) {
      return {
        success: false,
        message: "Aucun joueur disponible pour ce match",
      };
    }

    // Récupère les infos du joueur
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: {
        team: true,
      },
    });

    if (!player) {
      return {
        success: false,
        message: "Erreur lors de la sélection du joueur",
      };
    }

    // Génère le code du ticket
    const ticketCode = await generateUniqueTicketCode();

    // Crée le ticket
    const ticket = await prisma.buteurTicket.create({
      data: {
        ticketCode,
        userId: data.userId,
        matchId: data.matchId,
        playerId,
        hasWon: false,
        isChecked: false,
      },
    });

    return {
      success: true,
      ticket: {
        ticketCode: ticket.ticketCode,
        playerId: player.id,
        playerName: player.nameFr,
        teamName: player.team.nameFr,
        matchInfo: `${match.homeTeam.nameFr} vs ${match.awayTeam.nameFr}`,
      },
      message: "Ticket créé avec succès",
    };
  } catch (error) {
    console.error("Erreur création ticket:", error);
    return {
      success: false,
      message: "Erreur lors de la création du ticket",
    };
  }
}

/**
 * Vérifie les tickets après un match et attribue les lots
 * Appelé automatiquement après la fin d'un match
 */
export async function checkTicketsAfterMatch(matchId: string): Promise<{
  totalTickets: number;
  winnersCount: number;
  winners: Array<{
    ticketCode: string;
    userId?: string;
    playerName: string;
    prizeType: string;
    prizeValue: number;
  }>;
}> {
  try {
    // Récupère tous les tickets de ce match
    const tickets = await prisma.buteurTicket.findMany({
      where: {
        matchId,
        isChecked: false,
      },
      include: {
        player: {
          include: {
            team: true,
          },
        },
      },
    });

    const winners = [];

    // Vérifie chaque ticket
    for (const ticket of tickets) {
      // Vérifie si le joueur a marqué
      // Note: goals devrait être mis à jour par un script séparé qui récupère les stats du match
      const hasScored = ticket.player.goals > 0;

      if (hasScored) {
        // Sélectionne un lot aléatoire
        const prize = selectRandomPrize();

        // Met à jour le ticket
        await prisma.buteurTicket.update({
          where: { id: ticket.id },
          data: {
            hasWon: true,
            isChecked: true,
            prizeType: prize.type,
            prizeValue: prize.value,
          },
        });

        winners.push({
          ticketCode: ticket.ticketCode,
          userId: ticket.userId || undefined,
          playerName: ticket.player.nameFr,
          prizeType: prize.label,
          prizeValue: prize.value,
        });
      } else {
        // Marque le ticket comme vérifié mais perdant
        await prisma.buteurTicket.update({
          where: { id: ticket.id },
          data: {
            hasWon: false,
            isChecked: true,
          },
        });
      }
    }

    return {
      totalTickets: tickets.length,
      winnersCount: winners.length,
      winners,
    };
  } catch (error) {
    console.error("Erreur vérification tickets:", error);
    return {
      totalTickets: 0,
      winnersCount: 0,
      winners: [],
    };
  }
}

/**
 * Vérifie un ticket spécifique (pour le staff en PDV)
 */
export async function verifyTicket(ticketCode: string): Promise<{
  valid: boolean;
  ticket?: {
    ticketCode: string;
    playerName: string;
    teamName: string;
    matchInfo: string;
    hasWon: boolean;
    isChecked: boolean;
    prizeType?: string;
    prizeValue?: number;
    isRedeemed: boolean;
  };
  message: string;
}> {
  try {
    const ticket = await prisma.buteurTicket.findUnique({
      where: { ticketCode },
      include: {
        player: {
          include: {
            team: true,
          },
        },
        match: {
          include: {
            homeTeam: true,
            awayTeam: true,
          },
        },
      },
    });

    if (!ticket) {
      return {
        valid: false,
        message: "Ticket introuvable",
      };
    }

    if (!ticket.match.isFinished) {
      return {
        valid: false,
        message: "Le match n'est pas encore terminé",
      };
    }

    if (!ticket.isChecked) {
      return {
        valid: false,
        message: "Ce ticket n'a pas encore été vérifié",
      };
    }

    if (ticket.isRedeemed) {
      return {
        valid: false,
        message: "Ce lot a déjà été réclamé",
      };
    }

    if (!ticket.hasWon) {
      return {
        valid: false,
        message: "Ce ticket n'est pas gagnant",
      };
    }

    return {
      valid: true,
      ticket: {
        ticketCode: ticket.ticketCode,
        playerName: ticket.player.nameFr,
        teamName: ticket.player.team.nameFr,
        matchInfo: `${ticket.match.homeTeam.nameFr} vs ${ticket.match.awayTeam.nameFr}`,
        hasWon: ticket.hasWon,
        isChecked: ticket.isChecked,
        prizeType: ticket.prizeType || undefined,
        prizeValue: ticket.prizeValue || undefined,
        isRedeemed: ticket.isRedeemed,
      },
      message: "Ticket gagnant valide !",
    };
  } catch (error) {
    console.error("Erreur vérification ticket:", error);
    return {
      valid: false,
      message: "Erreur lors de la vérification",
    };
  }
}

/**
 * Marque un ticket comme réclamé (après remise du lot en PDV)
 */
export async function redeemTicket(ticketCode: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const ticket = await prisma.buteurTicket.findUnique({
      where: { ticketCode },
    });

    if (!ticket) {
      return {
        success: false,
        message: "Ticket introuvable",
      };
    }

    if (!ticket.hasWon) {
      return {
        success: false,
        message: "Ce ticket n'est pas gagnant",
      };
    }

    if (ticket.isRedeemed) {
      return {
        success: false,
        message: "Ce lot a déjà été réclamé",
      };
    }

    await prisma.buteurTicket.update({
      where: { ticketCode },
      data: {
        isRedeemed: true,
        redeemedAt: new Date(),
      },
    });

    return {
      success: true,
      message: "Lot réclamé avec succès",
    };
  } catch (error) {
    console.error("Erreur réclamation ticket:", error);
    return {
      success: false,
      message: "Erreur lors de la réclamation",
    };
  }
}

/**
 * Récupère les tickets d'un utilisateur
 */
export async function getUserTickets(userId: string) {
  const tickets = await prisma.buteurTicket.findMany({
    where: { userId },
    include: {
      player: {
        include: {
          team: true,
        },
      },
      match: {
        include: {
          homeTeam: true,
          awayTeam: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return tickets.map((ticket: typeof tickets[number]) => ({
    ticketCode: ticket.ticketCode,
    playerName: ticket.player.nameFr,
    playerNumber: ticket.player.number,
    teamName: ticket.player.team.nameFr,
    teamFlag: ticket.player.team.flag,
    matchInfo: `${ticket.match.homeTeam.nameFr} vs ${ticket.match.awayTeam.nameFr}`,
    matchDate: ticket.match.scheduledAt,
    isFinished: ticket.match.isFinished,
    hasWon: ticket.hasWon,
    isChecked: ticket.isChecked,
    prizeType: ticket.prizeType,
    prizeValue: ticket.prizeValue,
    isRedeemed: ticket.isRedeemed,
    redeemedAt: ticket.redeemedAt,
  }));
}

/**
 * Récupère le prochain match disponible pour générer un ticket
 * Retourne le match le plus proche dans le futur qui n'est pas encore commencé
 */
export async function getNextAvailableMatch(): Promise<string | null> {
  const now = new Date();

  const nextMatch = await prisma.match.findFirst({
    where: {
      isFinished: false,
      scheduledAt: {
        gt: now,
      },
    },
    orderBy: {
      scheduledAt: "asc",
    },
    select: {
      id: true,
    },
  });

  return nextMatch?.id || null;
}

/**
 * Statistiques des tickets pour l'admin
 */
export async function getTicketStats() {
  const totalTickets = await prisma.buteurTicket.count();
  const checkedTickets = await prisma.buteurTicket.count({
    where: { isChecked: true },
  });
  const winningTickets = await prisma.buteurTicket.count({
    where: { hasWon: true },
  });
  const redeemedTickets = await prisma.buteurTicket.count({
    where: { isRedeemed: true },
  });

  const prizeDistribution = await prisma.buteurTicket.groupBy({
    by: ["prizeType"],
    where: {
      hasWon: true,
    },
    _count: {
      prizeType: true,
    },
  });

  const totalPrizeValue = await prisma.buteurTicket.aggregate({
    where: {
      hasWon: true,
    },
    _sum: {
      prizeValue: true,
    },
  });

  return {
    totalTickets,
    checkedTickets,
    winningTickets,
    redeemedTickets,
    winRate: totalTickets > 0 ? (winningTickets / totalTickets) * 100 : 0,
    redemptionRate:
      winningTickets > 0 ? (redeemedTickets / winningTickets) * 100 : 0,
    prizeDistribution,
    totalPrizeValue: totalPrizeValue._sum.prizeValue || 0,
  };
}
