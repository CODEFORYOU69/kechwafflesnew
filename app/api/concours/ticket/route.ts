import { NextRequest, NextResponse } from "next/server";
import {
  createButeurTicket,
  verifyTicket,
  redeemTicket,
  getUserTickets,
} from "@/lib/concours/buteur-ticket";

/**
 * POST: Crée un ticket buteur (pour achat menu)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { matchId, userId } = body;

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
      userId,
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
 * GET: Récupère les tickets d'un utilisateur OU vérifie un ticket
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const ticketCode = searchParams.get("ticketCode");

    // Vérification d'un ticket spécifique
    if (ticketCode) {
      const result = await verifyTicket(ticketCode);
      return NextResponse.json(result);
    }

    // Récupération des tickets d'un utilisateur
    if (userId) {
      const tickets = await getUserTickets(userId);
      return NextResponse.json({
        success: true,
        tickets,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "userId ou ticketCode requis",
      },
      { status: 400 }
    );
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
 * PATCH: Marque un ticket comme réclamé
 */
export async function PATCH(request: NextRequest) {
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
