import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isUserAdmin } from "@/lib/admin";

/**
 * POST: Marque une récompense de concours comme réclamée
 * Utilisé par le staff en PDV pour valider les codes rewards
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Non authentifié" },
        { status: 401 }
      );
    }

    const isAdmin = await isUserAdmin(session.user.id);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Accès admin requis" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { rewardCode, staffName } = body;

    if (!rewardCode) {
      return NextResponse.json(
        { success: false, message: "Code reward requis" },
        { status: 400 }
      );
    }

    // Rechercher le reward
    const reward = await prisma.reward.findUnique({
      where: { code: rewardCode },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!reward) {
      return NextResponse.json(
        { success: false, message: "Code reward invalide" },
        { status: 404 }
      );
    }

    // Vérifier si déjà réclamé
    if (reward.isRedeemed) {
      return NextResponse.json(
        {
          success: false,
          message: `Ce reward a déjà été réclamé le ${reward.redeemedAt?.toLocaleDateString("fr-FR")}`,
        },
        { status: 400 }
      );
    }

    // Vérifier l'expiration
    if (reward.expiresAt < new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: "Ce reward a expiré",
        },
        { status: 400 }
      );
    }

    // Marquer comme réclamé
    const updatedReward = await prisma.reward.update({
      where: { code: rewardCode },
      data: {
        isRedeemed: true,
        redeemedAt: new Date(),
        redeemedBy: staffName || session.user.name || "Admin",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Reward réclamé avec succès",
      reward: {
        code: updatedReward.code,
        type: updatedReward.type,
        description: updatedReward.description,
        userName: reward.user.name,
        userEmail: reward.user.email,
        redeemedAt: updatedReward.redeemedAt,
        redeemedBy: updatedReward.redeemedBy,
      },
    });
  } catch (error) {
    console.error("Erreur API admin rewards redeem:", error);
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
 * GET: Vérifie un code reward sans le réclamer
 */
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Non authentifié" },
        { status: 401 }
      );
    }

    const isAdmin = await isUserAdmin(session.user.id);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Accès admin requis" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const rewardCode = searchParams.get("code");

    if (!rewardCode) {
      return NextResponse.json(
        { success: false, message: "Code reward requis" },
        { status: 400 }
      );
    }

    const reward = await prisma.reward.findUnique({
      where: { code: rewardCode },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!reward) {
      return NextResponse.json(
        { success: false, message: "Code reward invalide" },
        { status: 404 }
      );
    }

    const isExpired = reward.expiresAt < new Date();

    return NextResponse.json({
      success: true,
      reward: {
        code: reward.code,
        type: reward.type,
        description: reward.description,
        reason: reward.reason,
        userName: reward.user.name,
        userEmail: reward.user.email,
        isRedeemed: reward.isRedeemed,
        redeemedAt: reward.redeemedAt,
        redeemedBy: reward.redeemedBy,
        expiresAt: reward.expiresAt,
        isExpired,
        createdAt: reward.createdAt,
      },
    });
  } catch (error) {
    console.error("Erreur API admin rewards GET:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}
