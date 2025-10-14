import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isUserAdmin } from "@/lib/admin";

/**
 * GET: Récupère le statut de la connexion Loyverse
 * Accessible uniquement aux admins
 */
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const isAdmin = await isUserAdmin(session.user.id);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Accès admin requis" },
        { status: 403 }
      );
    }

    // Récupérer la configuration Loyverse
    const config = await prisma.loyverseConfig.findUnique({
      where: { id: "singleton" },
    });

    if (!config || !config.accessToken) {
      return NextResponse.json({
        isConnected: false,
        storeId: null,
        expiresAt: null,
        lastSync: null,
        webhooksActive: false,
      });
    }

    // Vérifier si le token est expiré
    const isTokenExpired = config.expiresAt ? config.expiresAt < new Date() : true;

    // Vérifier si des webhooks sont configurés (on vérifie via l'API Loyverse)
    let webhooksActive = false;
    try {
      const webhooksResponse = await fetch(
        "https://api.loyverse.com/v1.0/webhooks",
        {
          headers: {
            Authorization: `Bearer ${config.accessToken}`,
          },
        }
      );

      if (webhooksResponse.ok) {
        const webhooksData = await webhooksResponse.json();
        webhooksActive = webhooksData.webhooks && webhooksData.webhooks.length > 0;
      }
    } catch (error) {
      console.error("Error checking webhooks:", error);
    }

    return NextResponse.json({
      isConnected: !isTokenExpired,
      storeId: config.storeId,
      expiresAt: config.expiresAt?.toISOString(),
      lastSync: config.updatedAt?.toISOString(),
      webhooksActive,
    });
  } catch (error) {
    console.error("Error fetching Loyverse status:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
