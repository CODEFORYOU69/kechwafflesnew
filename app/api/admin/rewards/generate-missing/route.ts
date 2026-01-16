import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isUserAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { customAlphabet } from "nanoid";

const generateRewardCode = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);

/**
 * POST /api/admin/rewards/generate-missing
 * Génère les rewards manquants pour les scores exacts
 */
export async function POST() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const isAdmin = await isUserAdmin(session.user.id);
    if (!isAdmin) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // Récupérer tous les pronostics avec score exact
    const exactScorePronostics = await prisma.pronostic.findMany({
      where: {
        isExactScore: true,
      },
      include: {
        user: true,
        match: true,
      },
    });

    // Récupérer les rewards existants
    const existingRewards = await prisma.reward.findMany({
      where: {
        type: "GAUFRE_GRATUITE",
      },
    });

    // Identifier les pronostics sans reward
    const pronosticsWithoutReward = exactScorePronostics.filter(
      (prono) =>
        !existingRewards.some(
          (r) => r.matchId === prono.matchId && r.userId === prono.userId
        )
    );

    // Générer les rewards manquants
    let generatedCount = 0;
    for (const prono of pronosticsWithoutReward) {
      const code = `GAUFRE-${generateRewardCode()}`;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await prisma.reward.create({
        data: {
          userId: prono.userId,
          type: "GAUFRE_GRATUITE",
          description: "Gaufre offerte pour score exact",
          code,
          matchId: prono.matchId,
          reason: `Score exact du match ${prono.match.homeScore}-${prono.match.awayScore}`,
          expiresAt,
          isRedeemed: false,
        },
      });
      generatedCount++;
    }

    console.log(`✅ Generated ${generatedCount} missing rewards`);

    return NextResponse.json({
      success: true,
      generatedCount,
      message: `${generatedCount} rewards générés avec succès`,
    });
  } catch (error) {
    console.error("Error generating missing rewards:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
