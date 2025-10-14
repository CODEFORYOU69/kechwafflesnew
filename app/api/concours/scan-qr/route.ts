import { NextRequest, NextResponse } from "next/server";
import { validateQRCode, recordQRScan } from "@/lib/concours/daily-qr";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { qrCode, userId } = body;

    if (!qrCode || !userId) {
      return NextResponse.json(
        {
          success: false,
          message: "QR code et userId requis",
        },
        { status: 400 }
      );
    }

    // Valide le QR code
    const validation = await validateQRCode(qrCode);

    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: validation.message,
        },
        { status: 400 }
      );
    }

    // Enregistre le scan
    const result = await recordQRScan(userId, validation.qrCodeId!);

    return NextResponse.json({
      success: result.success,
      message: result.message,
      isFirstScan: result.isFirstScan,
    });
  } catch (error) {
    console.error("Erreur API scan-qr:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}
