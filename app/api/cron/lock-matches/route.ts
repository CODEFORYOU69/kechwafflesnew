/**
 * Cron Job: Verrouille les pronostics des matchs 1h avant le coup d'envoi
 * À exécuter toutes les 5 minutes
 *
 * Configuration Vercel Cron (vercel.json):
 * {
 *   "crons": [{
 *     "path": "/api/cron/lock-matches",
 *     "schedule": "*/5 * * * *"
 *   }]
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { lockUpcomingMatches } from "@/lib/concours/pronostic";

export async function GET(request: NextRequest) {
  try {
    // Vérification du token de sécurité (Vercel Cron Secret)
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verrouille les matchs qui commencent dans moins d'1h
    const lockedCount = await lockUpcomingMatches();

    return NextResponse.json({
      success: true,
      message: `${lockedCount} match(s) verrouillé(s)`,
      lockedCount,
    });
  } catch (error) {
    console.error("Erreur cron lock-matches:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors du verrouillage des matchs",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// Alternative pour développement local sans cron
export async function POST(request: NextRequest) {
  return GET(request);
}
