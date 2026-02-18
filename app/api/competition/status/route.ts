import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/competition/status
 * Endpoint public pour vérifier si le concours CAN est actif
 */
export async function GET() {
  try {
    const competition = await prisma.competition.findFirst({
      select: { isActive: true },
    });

    return NextResponse.json({ isActive: competition?.isActive ?? false });
  } catch (error) {
    console.error("Error fetching competition status:", error);
    return NextResponse.json({ isActive: false });
  }
}
