import { NextResponse } from "next/server";
import { getUserStats } from "@/lib/concours/pronostic";
import { requireSession } from "@/lib/auth-helpers";

/**
 * GET: Récupère les statistiques de l'utilisateur connecté
 */
export async function GET() {
  const { session, error } = await requireSession();
  if (error) return error;

  try {
    const stats = await getUserStats(session.user.id);

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (err) {
    console.error("Erreur API stats GET:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}
