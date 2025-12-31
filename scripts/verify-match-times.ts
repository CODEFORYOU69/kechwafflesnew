import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const matches = await prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true },
    orderBy: { scheduledAt: "asc" },
  });

  const now = new Date();
  console.log(
    "Heure actuelle Maroc:",
    now.toLocaleString("fr-FR", { timeZone: "Africa/Casablanca" })
  );
  console.log("");
  console.log("Matchs à venir (triés par date):");
  console.log("================================");

  const upcomingMatches = matches.filter((x) => x.isFinished === false);

  for (const m of upcomingMatches) {
    const date = new Date(m.scheduledAt);
    const time = date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Africa/Casablanca",
    });
    const dateStr = date.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      timeZone: "Africa/Casablanca",
    });
    console.log(
      `#${String(m.matchNumber).padStart(2)} | ${dateStr} ${time} | ${m.homeTeam.nameFr} vs ${m.awayTeam.nameFr}`
    );
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
