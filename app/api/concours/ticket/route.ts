import { NextRequest, NextResponse } from "next/server";
import {
  createButeurTicket,
  verifyTicket,
  redeemTicket,
  getUserTickets,
} from "@/lib/concours/buteur-ticket";
import { requireSession, requireAdmin } from "@/lib/auth-helpers";

/**
 * POST: Crée un ticket buteur (pour achat menu)
 */
export async function POST(request: NextRequest) {
  const { session, error } = await requireSession();
  if (error) return error;

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
  } catch (err) {
    console.error("Erreur API ticket POST:", err);
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
 * GET: Récupère les tickets de l'utilisateur connecté OU vérifie un ticket (admin)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ticketCode = searchParams.get("ticketCode");

    // Vérification d'un ticket spécifique (staff/admin - utilisé pour scan PDV)
    if (ticketCode) {
      const { error } = await requireAdmin();
      if (error) return error;
      const result = await verifyTicket(ticketCode);
      return NextResponse.json(result);
    }

    // Récupération des tickets de l'utilisateur connecté
    const { session, error } = await requireSession();
    if (error) return error;

    const tickets = await getUserTickets(session.user.id);
    return NextResponse.json({
      success: true,
      tickets,
    });
  } catch (err) {
    console.error("Erreur API ticket GET:", err);
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
  const { error } = await requireAdmin();
  if (error) return error;

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
  } catch (err) {
    console.error("Erreur API ticket PATCH:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}
