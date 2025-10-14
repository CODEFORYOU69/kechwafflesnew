import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const history = await prisma.dailyQRCode.findMany({
      orderBy: {
        validDate: "desc",
      },
      take: 30,
    });

    return NextResponse.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("Erreur API admin/qr-code/history:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}
