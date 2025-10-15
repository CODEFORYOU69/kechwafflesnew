import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-check";

/**
 * POST: Déconnecte Loyverse et supprime la configuration
 */
export async function POST() {
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

    // Supprimer la configuration Loyverse
    await prisma.loyverseConfig.deleteMany({});

    console.log("✅ Loyverse déconnecté");

    return NextResponse.json({
      success: true,
      message: "Loyverse déconnecté avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur déconnexion Loyverse:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
