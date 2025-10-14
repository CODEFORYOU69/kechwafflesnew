import { NextResponse } from "next/server";
import { getTodayQRCode } from "@/lib/concours/daily-qr";

export async function GET() {
  try {
    const qrCode = await getTodayQRCode();

    return NextResponse.json({
      success: true,
      qrCode,
    });
  } catch (error) {
    console.error("Erreur API admin/qr-code/current:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}
