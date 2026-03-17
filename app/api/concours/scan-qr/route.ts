import { NextRequest, NextResponse } from "next/server";
import { validateQRCode, recordQRScan } from "@/lib/concours/daily-qr";
import { requireSession } from "@/lib/auth-helpers";

export async function POST(request: NextRequest) {
  const { session, error } = await requireSession();
  if (error) return error;

  try {
    const body = await request.json();
    const { qrCode } = body;

    if (!qrCode) {
      return NextResponse.json(
        {
          success: false,
          message: "QR code requis",
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
    const result = await recordQRScan(session.user.id, validation.qrCodeId!);

    return NextResponse.json({
      success: result.success,
      message: result.message,
      isFirstScan: result.isFirstScan,
    });
  } catch (err) {
    console.error("Erreur API scan-qr:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}
