import { NextResponse } from "next/server";
import { getMenuProducts } from "@/lib/menu-products";

/**
 * GET: Récupère tous les produits actifs (API publique)
 * Pour affichage sur le menu public
 */
export async function GET() {
  try {
    const products = await getMenuProducts();

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Erreur récupération produits:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
