import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { isAdmin } from "@/lib/admin-check";
import { performWeeklyDraw } from "@/lib/concours/weekly-draw";

/**
 * POST: Effectue un tirage au sort hebdomadaire
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !(await isAdmin(session.user.id))) {
      return NextResponse.json(
        { success: false, message: "Non autorisé" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { year, weekNumber, numberOfWinners, prizes } = body;

    if (!year || !weekNumber) {
      return NextResponse.json(
        { success: false, message: "year et weekNumber requis" },
        { status: 400 }
      );
    }

    const result = await performWeeklyDraw({
      year,
      weekNumber,
      numberOfWinners,
      prizes,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Erreur tirage:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
