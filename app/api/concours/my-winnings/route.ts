import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserDrawWinnings } from "@/lib/concours/weekly-draw";

/**
 * GET: Récupère les gains de l'utilisateur connecté
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Non authentifié" },
        { status: 401 }
      );
    }

    const winnings = await getUserDrawWinnings(session.user.id);

    return NextResponse.json({
      success: true,
      winnings,
    });
  } catch (error) {
    console.error("❌ Erreur récupération gains:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
