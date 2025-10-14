import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET: Récupère les partenaires actifs et visibles (Public)
 */
export async function GET() {
  try {
    const partners = await prisma.partner.findMany({
      where: {
        isActive: true,
        isVisible: true,
      },
      orderBy: [
        { tier: "asc" }, // PREMIUM d'abord, puis GOLD, SILVER, BRONZE
        { displayOrder: "asc" },
        { createdAt: "desc" },
      ],
      select: {
        id: true,
        name: true,
        description: true,
        logo: true,
        address: true,
        phone: true,
        website: true,
        tier: true,
        prizeTitle: true,
        prizeDescription: true,
        prizeValue: true,
        prizeImage: true,
        prizeQuantity: true,
      },
    });

    return NextResponse.json({
      success: true,
      partners,
    });
  } catch (error) {
    console.error("Erreur GET partners (public):", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
