/**
 * Générateur de tickets buteur (Concours 3)
 * Génère des tickets avec des joueurs aléatoires pour chaque utilisateur
 */

import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

/**
 * Génère un code de ticket unique
 * Format: BUT-XXXXXX (6 caractères alphanumériques)
 */
function generateTicketCode(): string {
  return `BUT-${nanoid(6).toUpperCase()}`;
}

/**
 * Génère un ticket buteur pour un utilisateur pour un match spécifique
 * Le joueur est choisi aléatoirement parmi ceux sélectionnés par l'admin
 *
 * @param userId - ID de l'utilisateur (null pour ticket anonyme)
 * @param matchId - ID du match
 * @param selectedPlayerIds - Liste des IDs des joueurs sélectionnés par l'admin
 * @returns Le ticket créé
 */
type ButeurTicket = {
  id: string;
  ticketCode: string;
  userId: string | null;
  matchId: string;
  playerId: string;
  hasWon: boolean;
  isChecked: boolean;
  isRedeemed: boolean;
  prizeType: string | null;
  prizeValue: number | null;
  player: {
    id: string;
    name: string;
    nameFr: string;
    team: {
      id: string;
      name: string;
      nameFr: string;
      code: string;
      flag: string;
    };
  };
  match: {
    id: string;
    matchNumber: number;
    homeTeam: {
      id: string;
      name: string;
      nameFr: string;
      code: string;
    };
    awayTeam: {
      id: string;
      name: string;
      nameFr: string;
      code: string;
    };
  };
};

export async function generateButeurTicket(
  userId: string | null,
  matchId: string,
  selectedPlayerIds: string[]
): Promise<ButeurTicket> {
  if (selectedPlayerIds.length === 0) {
    throw new Error("Aucun buteur potentiel sélectionné pour ce match");
  }

  // Choisir un joueur aléatoire
  const randomIndex = Math.floor(Math.random() * selectedPlayerIds.length);
  const playerId = selectedPlayerIds[randomIndex];

  // Générer un code unique
  let ticketCode = generateTicketCode();

  // Vérifier l'unicité (très peu probable de collision avec nanoid)
  let attempts = 0;
  while (attempts < 5) {
    const existing = await prisma.buteurTicket.findUnique({
      where: { ticketCode },
    });

    if (!existing) break;

    ticketCode = generateTicketCode();
    attempts++;
  }

  // Créer le ticket
  const ticket = await prisma.buteurTicket.create({
    data: {
      ticketCode,
      userId,
      matchId,
      playerId,
      hasWon: false,
      isChecked: false,
      isRedeemed: false,
    },
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

  return ticket;
}

/**
 * Génère plusieurs tickets pour un utilisateur
 * Utile lors d'un scan QR ou d'un achat donnant droit à plusieurs tickets
 *
 * @param userId - ID de l'utilisateur
 * @param matchId - ID du match
 * @param selectedPlayerIds - Liste des IDs des joueurs sélectionnés
 * @param count - Nombre de tickets à générer
 */
export async function generateMultipleTickets(
  userId: string,
  matchId: string,
  selectedPlayerIds: string[],
  count: number = 1
): Promise<ButeurTicket[]> {
  const tickets = [];

  for (let i = 0; i < count; i++) {
    const ticket = await generateButeurTicket(userId, matchId, selectedPlayerIds);
    tickets.push(ticket);
  }

  return tickets;
}

/**
 * Vérifie et met à jour les tickets gagnants après un match
 * Compare le joueur du ticket avec les buteurs réels du match
 *
 * @param matchId - ID du match terminé
 * @param scorerPlayerIds - IDs des joueurs qui ont marqué
 */
export async function checkWinningTickets(
  matchId: string,
  scorerPlayerIds: string[]
): Promise<{ totalChecked: number; winnersCount: number }> {
  // Récupérer tous les tickets pour ce match
  const tickets = await prisma.buteurTicket.findMany({
    where: {
      matchId,
      isChecked: false,
    },
  });

  let winnersCount = 0;

  for (const ticket of tickets) {
    const hasWon = scorerPlayerIds.includes(ticket.playerId);

    await prisma.buteurTicket.update({
      where: { id: ticket.id },
      data: {
        hasWon,
        isChecked: true,
        // Attribuer un lot si gagnant
        prizeType: hasWon ? determinePrizeType() : null,
        prizeValue: hasWon ? determinePrizeValue() : null,
      },
    });

    if (hasWon) winnersCount++;
  }

  return {
    totalChecked: tickets.length,
    winnersCount,
  };
}

/**
 * Détermine le type de lot (aléatoire avec probabilités)
 * - 50% : SMOOTHIE
 * - 30% : GAUFRE
 * - 20% : BON_PARTENAIRE
 */
function determinePrizeType(): string {
  const rand = Math.random();

  if (rand < 0.5) {
    return "SMOOTHIE";
  } else if (rand < 0.8) {
    return "GAUFRE";
  } else {
    return "BON_PARTENAIRE";
  }
}

/**
 * Détermine la valeur du lot en fonction du type
 */
function determinePrizeValue(): number {
  const rand = Math.random();

  if (rand < 0.5) {
    return 35; // Smoothie
  } else if (rand < 0.8) {
    return 45; // Gaufre
  } else {
    return 50; // Bon partenaire
  }
}

/**
 * Récupère les tickets d'un utilisateur
 */
export async function getUserTickets(userId: string) {
  return await prisma.buteurTicket.findMany({
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
}

/**
 * Récupère un ticket par son code
 */
export async function getTicketByCode(ticketCode: string) {
  return await prisma.buteurTicket.findUnique({
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
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

/**
 * Récupère les tickets gagnants d'un utilisateur (non réclamés)
 */
export async function getUserWinningTickets(userId: string) {
  return await prisma.buteurTicket.findMany({
    where: {
      userId,
      hasWon: true,
      isRedeemed: false,
    },
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
}

/**
 * Marque un ticket comme réclamé
 */
type RedeemedTicket = {
  id: string;
  ticketCode: string;
  userId: string | null;
  matchId: string;
  playerId: string;
  hasWon: boolean;
  isChecked: boolean;
  isRedeemed: boolean;
  redeemedAt: Date | null;
  prizeType: string | null;
  prizeValue: number | null;
  player: {
    id: string;
    name: string;
    nameFr: string;
    team: {
      id: string;
      name: string;
      nameFr: string;
      code: string;
      flag: string;
    };
  };
  match: {
    id: string;
    matchNumber: number;
    homeScore: number | null;
    awayScore: number | null;
    phase: string;
    homeTeamId: string;
    awayTeamId: string;
    scheduledAt: Date;
    venue: string | null;
    city: string | null;
    isFinished: boolean;
    finishedAt: Date | null;
    lockPronostics: boolean;
  };
  user: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
};

export async function redeemTicket(ticketCode: string): Promise<RedeemedTicket> {
  const ticket = await prisma.buteurTicket.findUnique({
    where: { ticketCode },
  });

  if (!ticket) {
    throw new Error("Ticket non trouvé");
  }

  if (!ticket.hasWon) {
    throw new Error("Ce ticket n'est pas gagnant");
  }

  if (ticket.isRedeemed) {
    throw new Error("Ce ticket a déjà été réclamé");
  }

  return await prisma.buteurTicket.update({
    where: { ticketCode },
    data: {
      isRedeemed: true,
      redeemedAt: new Date(),
    },
    include: {
      player: {
        include: {
          team: true,
        },
      },
      match: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

/**
 * Statistiques des tickets pour un match
 */
export async function getMatchTicketStats(matchId: string) {
  const total = await prisma.buteurTicket.count({
    where: { matchId },
  });

  const winners = await prisma.buteurTicket.count({
    where: {
      matchId,
      hasWon: true,
    },
  });

  const redeemed = await prisma.buteurTicket.count({
    where: {
      matchId,
      hasWon: true,
      isRedeemed: true,
    },
  });

  return {
    total,
    winners,
    redeemed,
    pendingRedemption: winners - redeemed,
  };
}
