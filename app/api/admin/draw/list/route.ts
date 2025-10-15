import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { isAdmin } from "@/lib/admin-check";
import { getAllDraws } from "@/lib/concours/weekly-draw";

/**
 * GET: Récupère tous les tirages avec leurs gagnants
 */
export async function GET() {
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

    const draws = await getAllDraws();

    return NextResponse.json({
      success: true,
      draws,
    });
  } catch (error) {
    console.error("❌ Erreur récupération tirages:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
