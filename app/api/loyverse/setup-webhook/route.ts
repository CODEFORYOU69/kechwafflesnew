import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Enregistre le webhook auprès de Loyverse
 * À appeler une seule fois après avoir connecté OAuth
 *
 * URL: /api/loyverse/setup-webhook
 */
export async function POST() {
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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BETTER_AUTH_URL || "https://www.kechwaffles.com";
    const webhookUrl = `${baseUrl}/api/loyverse/webhook`;

    console.log("📡 Configuration webhook avec URL:", webhookUrl);

    // Enregistrer le webhook pour receipts.update (couvre création ET modification)
    const response = await fetch("https://api.loyverse.com/v1.0/webhooks", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: webhookUrl,
        type: "receipts.update",
        status: "ENABLED",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erreur enregistrement webhook:", errorText);
      return NextResponse.json(
        {
          success: false,
          error: `Erreur Loyverse API (${response.status}): ${errorText}`,
          webhookUrl,
          hint: "Vérifiez que l'URL du webhook est accessible publiquement et que Loyverse peut l'atteindre."
        },
        { status: response.status }
      );
    }

    const webhookData = await response.json();
    console.log("✅ Webhook receipts.update enregistré:", webhookData);

    // Enregistrer aussi pour receipts.delete (remboursements)
    const response2 = await fetch("https://api.loyverse.com/v1.0/webhooks", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: webhookUrl,
        type: "receipts.delete",
        status: "ENABLED",
      }),
    });

    let webhook2Data = null;
    if (response2.ok) {
      webhook2Data = await response2.json();
      console.log("✅ Webhook receipts.delete enregistré:", webhook2Data);
    }

    return NextResponse.json({
      success: true,
      message: "Webhooks Loyverse configurés avec succès",
      webhooks: {
        receipts_update: webhookData,
        receipts_delete: webhook2Data,
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
export async function GET() {
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
