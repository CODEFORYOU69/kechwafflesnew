import { NextRequest, NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/concours/pronostic";

/**
 * GET: Récupère le classement général
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam) : 50;

    if (limit < 1 || limit > 200) {
      return NextResponse.json(
        {
          success: false,
          message: "Limit doit être entre 1 et 200",
        },
        { status: 400 }
      );
    }

    const leaderboard = await getLeaderboard(limit);

    return NextResponse.json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    console.error("Erreur API leaderboard GET:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}
