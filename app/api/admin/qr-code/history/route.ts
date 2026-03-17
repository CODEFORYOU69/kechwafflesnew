import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

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
