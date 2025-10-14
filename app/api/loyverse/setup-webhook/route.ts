import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Enregistre le webhook auprès de Loyverse
 * À appeler une seule fois après avoir connecté OAuth
 *
 * URL: /api/loyverse/setup-webhook
 */
export async function POST(request: NextRequest) {
  try {
    // Récupérer le token OAuth depuis la BDD
    const config = await prisma.loyverseConfig.findUnique({
      where: { id: "singleton" },
    });

    if (!config) {
      return NextResponse.json(
        { success: false, message: "Loyverse non connecté. Connectez-vous d'abord via /api/loyverse/connect" },
        { status: 400 }
      );
    }

    // Vérifier que le token n'est pas expiré
    if (config.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, message: "Token Loyverse expiré. Reconnectez-vous." },
        { status: 401 }
      );
    }

    // URL du webhook (votre endpoint)
    const webhookUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/loyverse/webhook`;

    // Enregistrer le webhook pour l'événement "receipt.created"
    const response = await fetch("https://api.loyverse.com/v1.0/webhooks", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_type: "receipt.created",
        target_url: webhookUrl,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erreur enregistrement webhook:", errorText);
      return NextResponse.json(
        {
          success: false,
          message: `Erreur Loyverse API (${response.status}): ${errorText}`
        },
        { status: response.status }
      );
    }

    const webhookData = await response.json();
    console.log("✅ Webhook enregistré:", webhookData);

    // Enregistrer aussi pour "receipt.updated"
    const response2 = await fetch("https://api.loyverse.com/v1.0/webhooks", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_type: "receipt.updated",
        target_url: webhookUrl,
      }),
    });

    let webhook2Data = null;
    if (response2.ok) {
      webhook2Data = await response2.json();
      console.log("✅ Webhook receipt.updated enregistré:", webhook2Data);
    }

    // Enregistrer aussi pour "receipt.deleted" (remboursements)
    const response3 = await fetch("https://api.loyverse.com/v1.0/webhooks", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_type: "receipt.deleted",
        target_url: webhookUrl,
      }),
    });

    let webhook3Data = null;
    if (response3.ok) {
      webhook3Data = await response3.json();
      console.log("✅ Webhook receipt.deleted enregistré:", webhook3Data);
    }

    return NextResponse.json({
      success: true,
      message: "Webhooks Loyverse configurés avec succès",
      webhooks: {
        receipt_created: webhookData,
        receipt_updated: webhook2Data,
        receipt_deleted: webhook3Data,
      },
      webhook_url: webhookUrl,
    });
  } catch (error) {
    console.error("❌ Erreur configuration webhook:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur lors de la configuration du webhook" },
      { status: 500 }
    );
  }
}

/**
 * Liste les webhooks enregistrés
 */
export async function GET(request: NextRequest) {
  try {
    // Récupérer le token OAuth depuis la BDD
    const config = await prisma.loyverseConfig.findUnique({
      where: { id: "singleton" },
    });

    if (!config) {
      return NextResponse.json(
        { success: false, message: "Loyverse non connecté" },
        { status: 400 }
      );
    }

    // Récupérer la liste des webhooks
    const response = await fetch("https://api.loyverse.com/v1.0/webhooks", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${config.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { success: false, message: `Erreur Loyverse API: ${errorText}` },
        { status: response.status }
      );
    }

    const webhooks = await response.json();

    return NextResponse.json({
      success: true,
      webhooks,
    });
  } catch (error) {
    console.error("❌ Erreur récupération webhooks:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
