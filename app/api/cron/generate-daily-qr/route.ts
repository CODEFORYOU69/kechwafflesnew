/**
 * Cron Job: Génère le QR code du jour
 * À exécuter tous les jours à minuit (00:00)
 *
 * Configuration Vercel Cron (vercel.json):
 * {
 *   "crons": [{
 *     "path": "/api/cron/generate-daily-qr",
 *     "schedule": "0 0 * * *"
 *   }]
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { createDailyQRCode } from "@/lib/concours/daily-qr";

export async function GET(request: NextRequest) {
  try {
    // Vérification du token de sécurité (Vercel Cron Secret)
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Génère le QR code du jour
    const qrCode = await createDailyQRCode();

    return NextResponse.json({
      success: true,
      message: "QR code du jour généré",
      data: {
        id: qrCode.id,
        qrCode: qrCode.qrCode,
        validDate: qrCode.validDate,
      },
    });
  } catch (error) {
    console.error("Erreur cron generate-daily-qr:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de la génération du QR code",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// Alternative pour développement local sans cron
export async function POST(request: NextRequest) {
  return GET(request);
}
