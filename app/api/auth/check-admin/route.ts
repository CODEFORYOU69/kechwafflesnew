import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { checkAndPromoteAdmin } from "@/lib/auth";

/**
 * POST /api/auth/check-admin
 * Vérifie et promouvoir l'utilisateur en admin si son email est dans la liste
 */
export async function POST() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Vérifier et promouvoir si nécessaire
    if (session.user.email) {
      await checkAndPromoteAdmin(session.user.id, session.user.email);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error checking admin:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
