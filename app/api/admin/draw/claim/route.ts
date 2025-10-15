import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { isAdmin } from "@/lib/admin-check";
import { claimPrize } from "@/lib/concours/weekly-draw";

/**
 * POST: Marque un lot comme réclamé
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
    const { winnerId } = body;

    if (!winnerId) {
      return NextResponse.json(
        { success: false, message: "winnerId requis" },
        { status: 400 }
      );
    }

    const result = await claimPrize(winnerId);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Erreur réclamation lot:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
