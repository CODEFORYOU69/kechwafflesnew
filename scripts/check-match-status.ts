import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("=== État de tous les matchs ===\n");

  const matches = await prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true },
    orderBy: { matchNumber: "asc" },
  });

  for (const m of matches) {
    const date = new Date(m.scheduledAt);
    const dateStr = date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      timeZone: "Africa/Casablanca",
    });
    const time = date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Africa/Casablanca",
    });

    let status = "";
    if (m.isFinished) {
      status = `✅ TERMINÉ (${m.homeScore}-${m.awayScore})`;
    } else if (m.lockPronostics) {
      status = "🔒 VERROUILLÉ";
    } else {
      status = "🟢 OUVERT";
    }

    console.log(
      `#${String(m.matchNumber).padStart(2)} | ${dateStr} ${time} | ${m.homeTeam.nameFr.padEnd(20)} vs ${m.awayTeam.nameFr.padEnd(20)} | ${status}`
    );
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
