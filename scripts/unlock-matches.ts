import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Matchs à déverrouiller (verrouillés par erreur)
  const matchNumbers = [23, 24, 29, 30];

  console.log("🔓 Déverrouillage des matchs...\n");

  for (const matchNumber of matchNumbers) {
    const match = await prisma.match.findUnique({
      where: { matchNumber },
      include: { homeTeam: true, awayTeam: true },
    });

    if (!match) {
      console.log(`❌ Match #${matchNumber} non trouvé`);
      continue;
    }

    if (match.isFinished) {
      console.log(
        `⏭️  Match #${matchNumber} déjà terminé, pas besoin de déverrouiller`
      );
      continue;
    }

    await prisma.match.update({
      where: { matchNumber },
      data: { lockPronostics: false },
    });

    console.log(
      `✅ Match #${matchNumber}: ${match.homeTeam.nameFr} vs ${match.awayTeam.nameFr} - DÉVERROUILLÉ`
    );
  }

  console.log("\n✅ Terminé !");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
