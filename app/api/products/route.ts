import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET: Récupère tous les produits actifs (API publique)
 * Pour affichage sur le menu public
 */
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      include: {
        variants: {
          where: { isActive: true },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: [
        { category: "asc" },
        { displayOrder: "asc" },
        { name: "asc" },
      ],
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Erreur récupération produits:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
