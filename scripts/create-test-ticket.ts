import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createTestTicket() {
  // 1. Trouver un match à venir
  const match = await prisma.match.findFirst({
    where: { isFinished: false },
    include: {
      homeTeam: { include: { players: true } },
      awayTeam: { include: { players: true } },
    },
    orderBy: { scheduledAt: "asc" },
  });

  if (!match) {
    console.log("❌ Aucun match disponible");
    return;
  }

  // 2. Combiner les joueurs des deux équipes et en sélectionner un au hasard
  const allPlayers = [...match.homeTeam.players, ...match.awayTeam.players];
  if (allPlayers.length === 0) {
    console.log("❌ Aucun joueur trouvé");
    return;
  }

  const randomPlayer = allPlayers[Math.floor(Math.random() * allPlayers.length)];

  // 3. Trouver un utilisateur (optionnel)
  const user = await prisma.user.findFirst();

  // 4. Générer un code unique
  const ticketCode = "BUT-" + Math.random().toString(36).substring(2, 8).toUpperCase();

  // 5. Créer le ticket
  const ticket = await prisma.buteurTicket.create({
    data: {
      ticketCode,
      matchId: match.id,
      playerId: randomPlayer.id,
      userId: user?.id || null,
      hasWon: false,
      isChecked: false,
      isRedeemed: false,
    },
    include: {
      player: { include: { team: true } },
      match: { include: { homeTeam: true, awayTeam: true } },
    },
  });

  console.log("\n✅ Ticket créé avec succès !\n");
  console.log("╔════════════════════════════════════════╗");
  console.log("║        ⚽ TICKET BUTEUR ⚽              ║");
  console.log("╠════════════════════════════════════════╣");
  console.log(`║  Code: ${ticket.ticketCode.padEnd(28)}  ║`);
  console.log("║                                        ║");
  console.log(`║  ${ticket.match.homeTeam.nameFr} vs ${ticket.match.awayTeam.nameFr}`.padEnd(41) + "║");
  console.log(`║  ${new Date(ticket.match.scheduledAt).toLocaleDateString("fr-FR")}`.padEnd(41) + "║");
  console.log("║                                        ║");
  console.log("║  VOTRE BUTEUR:                         ║");
  console.log(`║  #${ticket.player.number || "?"} ${ticket.player.nameFr}`.padEnd(41) + "║");
  console.log(`║  ${ticket.player.team.nameFr}`.padEnd(41) + "║");
  console.log("║                                        ║");
  console.log("╚════════════════════════════════════════╝");
  console.log("\n🔗 Voir sur: https://www.kechwaffles.com/concours/mes-tickets\n");
}

createTestTicket()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
