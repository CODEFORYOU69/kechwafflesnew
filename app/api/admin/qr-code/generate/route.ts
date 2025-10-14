import { NextResponse } from "next/server";
import { createDailyQRCode } from "@/lib/concours/daily-qr";

export async function POST() {
  try {
    const qrCode = await createDailyQRCode();

    return NextResponse.json({
      success: true,
      message: "QR code généré avec succès",
      qrCode,
    });
  } catch (error) {
    console.error("Erreur API admin/qr-code/generate:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de la génération du QR code",
      },
      { status: 500 }
    );
  }
}
