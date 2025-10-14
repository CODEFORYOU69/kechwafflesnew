/**
 * Générateur de matchs à élimination directe pour la CAN 2025
 * Génère automatiquement les matchs de 16èmes, quarts, demi-finales et finale
 */

import { prisma } from "@/lib/prisma";

interface GroupStanding {
  teamId: string;
  teamCode: string;
  teamName: string;
  group: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

/**
 * Calcule le classement d'un groupe
 */
async function calculateGroupStandings(group: string): Promise<GroupStanding[]> {
  // Récupérer toutes les équipes du groupe
  const teams = await prisma.team.findMany({
    where: { group },
  });

  // Récupérer tous les matchs terminés du groupe
  const matches = await prisma.match.findMany({
    where: {
      phase: "GROUP_STAGE",
      isFinished: true,
      OR: [
        { homeTeam: { group } },
        { awayTeam: { group } },
      ],
    },
    include: {
      homeTeam: true,
      awayTeam: true,
    },
  });

  // Calculer les stats pour chaque équipe
  const standings: GroupStanding[] = teams.map((team) => {
    let played = 0;
    let won = 0;
    let drawn = 0;
    let lost = 0;
    let goalsFor = 0;
    let goalsAgainst = 0;

    matches.forEach((match) => {
      if (match.homeTeamId === team.id) {
        played++;
        goalsFor += match.homeScore ?? 0;
        goalsAgainst += match.awayScore ?? 0;

        if ((match.homeScore ?? 0) > (match.awayScore ?? 0)) {
          won++;
        } else if ((match.homeScore ?? 0) === (match.awayScore ?? 0)) {
          drawn++;
        } else {
          lost++;
        }
      } else if (match.awayTeamId === team.id) {
        played++;
        goalsFor += match.awayScore ?? 0;
        goalsAgainst += match.homeScore ?? 0;

        if ((match.awayScore ?? 0) > (match.homeScore ?? 0)) {
          won++;
        } else if ((match.awayScore ?? 0) === (match.homeScore ?? 0)) {
          drawn++;
        } else {
          lost++;
        }
      }
    });

    return {
      teamId: team.id,
      teamCode: team.code,
      teamName: team.name,
      group: team.group!,
      played,
      won,
      drawn,
      lost,
      goalsFor,
      goalsAgainst,
      goalDifference: goalsFor - goalsAgainst,
      points: won * 3 + drawn,
    };
  });

  // Trier selon les règles de la CAN
  // 1. Points, 2. Différence de buts, 3. Buts marqués, 4. Confrontation directe (non implémenté ici)
  standings.sort((a, b) => {
    if (a.points !== b.points) return b.points - a.points;
    if (a.goalDifference !== b.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  return standings;
}

/**
 * Récupère les 4 meilleurs 3èmes
 */
async function getBestThirdPlaces(): Promise<GroupStanding[]> {
  const allThirds: GroupStanding[] = [];

  // Récupérer le 3ème de chaque groupe
  for (const group of ["A", "B", "C", "D", "E", "F"]) {
    const standings = await calculateGroupStandings(group);
    if (standings.length >= 3) {
      allThirds.push(standings[2]); // Index 2 = 3ème place
    }
  }

  // Trier les 3èmes entre eux
  allThirds.sort((a, b) => {
    if (a.points !== b.points) return b.points - a.points;
    if (a.goalDifference !== b.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  // Retourner les 4 meilleurs
  return allThirds.slice(0, 4);
}

/**
 * Génère les matchs de 8èmes de finale (Round of 16)
 * Format CAN : 16 équipes (6 premiers de groupe + 6 seconds + 4 meilleurs 3èmes)
 */
export async function generateRoundOf16Matches(): Promise<void> {
  console.log("🏆 Generating Round of 16 matches...");

  // Vérifier que tous les matchs de poules sont terminés
  const unfinishedGroupMatches = await prisma.match.count({
    where: {
      phase: "GROUP_STAGE",
      isFinished: false,
    },
  });

  if (unfinishedGroupMatches > 0) {
    throw new Error(
      `Cannot generate Round of 16: ${unfinishedGroupMatches} group stage matches are not finished yet`
    );
  }

  // Récupérer les classements de tous les groupes
  const qualified: { teamId: string; position: number; group: string }[] = [];

  for (const group of ["A", "B", "C", "D", "E", "F"]) {
    const standings = await calculateGroupStandings(group);

    // 1er et 2ème de chaque groupe
    if (standings.length >= 2) {
      qualified.push({
        teamId: standings[0].teamId,
        position: 1,
        group,
      });
      qualified.push({
        teamId: standings[1].teamId,
        position: 2,
        group,
      });
    }
  }

  // Ajouter les 4 meilleurs 3èmes
  const bestThirds = await getBestThirdPlaces();
  bestThirds.forEach((third) => {
    qualified.push({
      teamId: third.teamId,
      position: 3,
      group: third.group,
    });
  });

  if (qualified.length !== 16) {
    throw new Error(`Expected 16 qualified teams, got ${qualified.length}`);
  }

  // Tableau des matchs selon le format CAN
  // Ces appariements sont définis par le règlement de la compétition
  const roundOf16Matchups = [
    { matchNumber: 37, home: "1A", away: "3C/D/E/F", scheduledAt: new Date("2026-01-05T17:00:00Z"), venue: "Stade Mohammed V", city: "Casablanca" },
    { matchNumber: 38, home: "2A", away: "2B", scheduledAt: new Date("2026-01-05T20:00:00Z"), venue: "Stade d'Agadir", city: "Agadir" },
    { matchNumber: 39, home: "1B", away: "3A/C/D/E", scheduledAt: new Date("2026-01-06T17:00:00Z"), venue: "Grand Stade de Marrakech", city: "Marrakech" },
    { matchNumber: 40, home: "1C", away: "3A/B/E/F", scheduledAt: new Date("2026-01-06T20:00:00Z"), venue: "Stade de Fès", city: "Fès" },
    { matchNumber: 41, home: "2C", away: "2D", scheduledAt: new Date("2026-01-07T17:00:00Z"), venue: "Stade Ibn Batouta", city: "Tanger" },
    { matchNumber: 42, home: "1D", away: "3A/B/C/F", scheduledAt: new Date("2026-01-07T20:00:00Z"), venue: "Stade Municipal de Berkane", city: "Berkane" },
    { matchNumber: 43, home: "1E", away: "2F", scheduledAt: new Date("2026-01-08T17:00:00Z"), venue: "Stade Prince Moulay Abdellah", city: "Rabat" },
    { matchNumber: 44, home: "1F", away: "2E", scheduledAt: new Date("2026-01-08T20:00:00Z"), venue: "Stade d'Oujda", city: "Oujda" },
  ];

  // Créer un mapping des positions qualifiées
  const positionMap: { [key: string]: string } = {};
  qualified.forEach((q) => {
    const key = `${q.position}${q.group}`;
    positionMap[key] = q.teamId;
  });

  // Pour les meilleurs 3èmes, on les assigne dans l'ordre (simplifié)
  const thirdPlaceTeams = bestThirds.map((t) => t.teamId);

  console.log(`   Found ${qualified.length} qualified teams`);
  console.log(`   Creating ${roundOf16Matchups.length} Round of 16 matches...`);

  // NOTE: L'appariement exact des meilleurs 3èmes dépend de leurs groupes d'origine
  // Pour simplifier, on attribue les équipes dans l'ordre
  // Dans une implémentation complète, il faudrait suivre le tableau officiel CAF

  for (const matchup of roundOf16Matchups) {
    let homeTeamId: string | undefined;
    let awayTeamId: string | undefined;

    // Résoudre l'équipe à domicile
    if (matchup.home.includes("/")) {
      // C'est un meilleur 3ème - assigner le prochain disponible
      homeTeamId = thirdPlaceTeams.shift();
    } else {
      homeTeamId = positionMap[matchup.home];
    }

    // Résoudre l'équipe à l'extérieur
    if (matchup.away.includes("/")) {
      // C'est un meilleur 3ème - assigner le prochain disponible
      awayTeamId = thirdPlaceTeams.shift();
    } else {
      awayTeamId = positionMap[matchup.away];
    }

    if (!homeTeamId || !awayTeamId) {
      console.error(`⚠️  Could not resolve teams for match ${matchup.matchNumber}: ${matchup.home} vs ${matchup.away}`);
      continue;
    }

    await prisma.match.upsert({
      where: { matchNumber: matchup.matchNumber },
      update: {
        phase: "ROUND_OF_16",
        homeTeamId,
        awayTeamId,
        scheduledAt: matchup.scheduledAt,
        venue: matchup.venue,
        city: matchup.city,
        lockPronostics: false,
        isFinished: false,
      },
      create: {
        matchNumber: matchup.matchNumber,
        phase: "ROUND_OF_16",
        homeTeamId,
        awayTeamId,
        scheduledAt: matchup.scheduledAt,
        venue: matchup.venue,
        city: matchup.city,
        lockPronostics: false,
        isFinished: false,
      },
    });
  }

  console.log(`✅ Round of 16 matches generated!`);
}

/**
 * Génère les quarts de finale à partir des vainqueurs des 8èmes
 */
export async function generateQuarterFinalMatches(): Promise<void> {
  console.log("🏆 Generating Quarter Final matches...");

  // Vérifier que tous les matchs de 8èmes sont terminés
  const unfinishedRound16 = await prisma.match.count({
    where: {
      phase: "ROUND_OF_16",
      isFinished: false,
    },
  });

  if (unfinishedRound16 > 0) {
    throw new Error(
      `Cannot generate Quarter Finals: ${unfinishedRound16} Round of 16 matches are not finished yet`
    );
  }

  // Récupérer les vainqueurs des 8èmes
  const round16Matches = await prisma.match.findMany({
    where: { phase: "ROUND_OF_16" },
    orderBy: { matchNumber: "asc" },
  });

  const winners = round16Matches.map((match) => {
    if (!match.isFinished || match.homeScore === null || match.awayScore === null) {
      throw new Error(`Match ${match.matchNumber} is not finished`);
    }
    return match.homeScore > match.awayScore ? match.homeTeamId : match.awayTeamId;
  });

  // Quarts de finale
  const quarterFinalMatchups = [
    { matchNumber: 45, homeWinnerOf: 37, awayWinnerOf: 38, scheduledAt: new Date("2026-01-11T17:00:00Z"), venue: "Stade Mohammed V", city: "Casablanca" },
    { matchNumber: 46, homeWinnerOf: 39, awayWinnerOf: 40, scheduledAt: new Date("2026-01-11T20:00:00Z"), venue: "Grand Stade de Marrakech", city: "Marrakech" },
    { matchNumber: 47, homeWinnerOf: 41, awayWinnerOf: 42, scheduledAt: new Date("2026-01-12T17:00:00Z"), venue: "Stade d'Agadir", city: "Agadir" },
    { matchNumber: 48, homeWinnerOf: 43, awayWinnerOf: 44, scheduledAt: new Date("2026-01-12T20:00:00Z"), venue: "Stade de Fès", city: "Fès" },
  ];

  console.log(`   Creating ${quarterFinalMatchups.length} Quarter Final matches...`);

  for (const matchup of quarterFinalMatchups) {
    const homeTeamId = winners[matchup.homeWinnerOf - 37];
    const awayTeamId = winners[matchup.awayWinnerOf - 37];

    await prisma.match.upsert({
      where: { matchNumber: matchup.matchNumber },
      update: {
        phase: "QUARTER_FINAL",
        homeTeamId,
        awayTeamId,
        scheduledAt: matchup.scheduledAt,
        venue: matchup.venue,
        city: matchup.city,
        lockPronostics: false,
        isFinished: false,
      },
      create: {
        matchNumber: matchup.matchNumber,
        phase: "QUARTER_FINAL",
        homeTeamId,
        awayTeamId,
        scheduledAt: matchup.scheduledAt,
        venue: matchup.venue,
        city: matchup.city,
        lockPronostics: false,
        isFinished: false,
      },
    });
  }

  console.log(`✅ Quarter Final matches generated!`);
}

/**
 * Génère les demi-finales à partir des vainqueurs des quarts
 */
export async function generateSemiFinalMatches(): Promise<void> {
  console.log("🏆 Generating Semi Final matches...");

  // Vérifier que tous les quarts sont terminés
  const unfinishedQuarters = await prisma.match.count({
    where: {
      phase: "QUARTER_FINAL",
      isFinished: false,
    },
  });

  if (unfinishedQuarters > 0) {
    throw new Error(
      `Cannot generate Semi Finals: ${unfinishedQuarters} Quarter Final matches are not finished yet`
    );
  }

  // Récupérer les vainqueurs des quarts
  const quarterMatches = await prisma.match.findMany({
    where: { phase: "QUARTER_FINAL" },
    orderBy: { matchNumber: "asc" },
  });

  const winners = quarterMatches.map((match) => {
    if (!match.isFinished || match.homeScore === null || match.awayScore === null) {
      throw new Error(`Match ${match.matchNumber} is not finished`);
    }
    return match.homeScore > match.awayScore ? match.homeTeamId : match.awayTeamId;
  });

  // Demi-finales
  const semiFinalMatchups = [
    { matchNumber: 49, homeWinnerOf: 45, awayWinnerOf: 46, scheduledAt: new Date("2026-01-15T20:00:00Z"), venue: "Stade Mohammed V", city: "Casablanca" },
    { matchNumber: 50, homeWinnerOf: 47, awayWinnerOf: 48, scheduledAt: new Date("2026-01-16T20:00:00Z"), venue: "Grand Stade de Marrakech", city: "Marrakech" },
  ];

  console.log(`   Creating ${semiFinalMatchups.length} Semi Final matches...`);

  for (const matchup of semiFinalMatchups) {
    const homeTeamId = winners[matchup.homeWinnerOf - 45];
    const awayTeamId = winners[matchup.awayWinnerOf - 45];

    await prisma.match.upsert({
      where: { matchNumber: matchup.matchNumber },
      update: {
        phase: "SEMI_FINAL",
        homeTeamId,
        awayTeamId,
        scheduledAt: matchup.scheduledAt,
        venue: matchup.venue,
        city: matchup.city,
        lockPronostics: false,
        isFinished: false,
      },
      create: {
        matchNumber: matchup.matchNumber,
        phase: "SEMI_FINAL",
        homeTeamId,
        awayTeamId,
        scheduledAt: matchup.scheduledAt,
        venue: matchup.venue,
        city: matchup.city,
        lockPronostics: false,
        isFinished: false,
      },
    });
  }

  console.log(`✅ Semi Final matches generated!`);
}

/**
 * Génère le match pour la 3ème place et la finale
 */
export async function generateFinalMatches(): Promise<void> {
  console.log("🏆 Generating Third Place and Final matches...");

  // Vérifier que les demi-finales sont terminées
  const unfinishedSemis = await prisma.match.count({
    where: {
      phase: "SEMI_FINAL",
      isFinished: false,
    },
  });

  if (unfinishedSemis > 0) {
    throw new Error(
      `Cannot generate Finals: ${unfinishedSemis} Semi Final matches are not finished yet`
    );
  }

  // Récupérer les résultats des demi-finales
  const semiMatches = await prisma.match.findMany({
    where: { phase: "SEMI_FINAL" },
    orderBy: { matchNumber: "asc" },
  });

  if (semiMatches.length !== 2) {
    throw new Error(`Expected 2 semi finals, got ${semiMatches.length}`);
  }

  const semi1 = semiMatches[0];
  const semi2 = semiMatches[1];

  // Vainqueurs et perdants
  const winner1 = (semi1.homeScore ?? 0) > (semi1.awayScore ?? 0) ? semi1.homeTeamId : semi1.awayTeamId;
  const loser1 = (semi1.homeScore ?? 0) > (semi1.awayScore ?? 0) ? semi1.awayTeamId : semi1.homeTeamId;

  const winner2 = (semi2.homeScore ?? 0) > (semi2.awayScore ?? 0) ? semi2.homeTeamId : semi2.awayTeamId;
  const loser2 = (semi2.homeScore ?? 0) > (semi2.awayScore ?? 0) ? semi2.awayTeamId : semi2.homeTeamId;

  // Match pour la 3ème place (perdants des demi-finales)
  console.log("   Creating Third Place match...");
  await prisma.match.upsert({
    where: { matchNumber: 51 },
    update: {
      phase: "THIRD_PLACE",
      homeTeamId: loser1,
      awayTeamId: loser2,
      scheduledAt: new Date("2026-01-19T17:00:00Z"),
      venue: "Stade d'Agadir",
      city: "Agadir",
      lockPronostics: false,
      isFinished: false,
    },
    create: {
      matchNumber: 51,
      phase: "THIRD_PLACE",
      homeTeamId: loser1,
      awayTeamId: loser2,
      scheduledAt: new Date("2026-01-19T17:00:00Z"),
      venue: "Stade d'Agadir",
      city: "Agadir",
      lockPronostics: false,
      isFinished: false,
    },
  });

  // Finale (vainqueurs des demi-finales)
  console.log("   Creating Final match...");
  await prisma.match.upsert({
    where: { matchNumber: 52 },
    update: {
      phase: "FINAL",
      homeTeamId: winner1,
      awayTeamId: winner2,
      scheduledAt: new Date("2026-01-19T20:00:00Z"),
      venue: "Stade Mohammed V",
      city: "Casablanca",
      lockPronostics: false,
      isFinished: false,
    },
    create: {
      matchNumber: 52,
      phase: "FINAL",
      homeTeamId: winner1,
      awayTeamId: winner2,
      scheduledAt: new Date("2026-01-19T20:00:00Z"),
      venue: "Stade Mohammed V",
      city: "Casablanca",
      lockPronostics: false,
      isFinished: false,
    },
  });

  console.log(`✅ Third Place and Final matches generated!`);
}

/**
 * Génère tous les matchs à élimination directe d'un coup
 * À utiliser uniquement pour les tests avec des données fictives
 */
export async function generateAllKnockoutMatches(): Promise<void> {
  await generateRoundOf16Matches();
  await generateQuarterFinalMatches();
  await generateSemiFinalMatches();
  await generateFinalMatches();
}
