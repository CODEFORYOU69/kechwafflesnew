import { NextRequest, NextResponse } from "next/server";
import {
  createButeurTicket,
  verifyTicket,
  redeemTicket,
  getUserTickets,
} from "@/lib/concours/buteur-ticket";
import { requireSession, requireAdmin } from "@/lib/api-helpers";

/**
 * POST: Crée un ticket buteur (pour achat menu)
 */
export async function POST(request: NextRequest) {
  const authResult = await requireSession(request);
  if (authResult instanceof NextResponse) return authResult;
  const { session } = authResult;

  try {
    const body = await request.json();
    const { matchId } = body;

    if (!matchId) {
      return NextResponse.json(
        {
          success: false,
          message: "matchId requis",
        },
        { status: 400 }
      );
    }

    const result = await createButeurTicket({
      matchId,
      userId: session.user.id,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur API ticket POST:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}

/**
 * GET: Récupère les tickets de l'utilisateur connecté OU vérifie un ticket par code
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ticketCode = searchParams.get("ticketCode");

    // Vérification d'un ticket spécifique (staff/admin - utilisé pour scan PDV)
    if (ticketCode) {
      const adminResult = await requireAdmin(request);
      if (adminResult instanceof NextResponse) return adminResult;
      const result = await verifyTicket(ticketCode);
      return NextResponse.json(result);
    }

    // Récupération des tickets de l'utilisateur connecté
    const authResult = await requireSession(request);
    if (authResult instanceof NextResponse) return authResult;
    const { session } = authResult;

    const tickets = await getUserTickets(session.user.id);
    return NextResponse.json({
      success: true,
      tickets,
    });
  } catch (error) {
    console.error("Erreur API ticket GET:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH: Marque un ticket comme réclamé (action staff/admin uniquement)
 */
export async function PATCH(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const { ticketCode } = body;

    if (!ticketCode) {
      return NextResponse.json(
        {
          success: false,
          message: "ticketCode requis",
        },
        { status: 400 }
      );
    }

    const result = await redeemTicket(ticketCode);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur API ticket PATCH:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}
