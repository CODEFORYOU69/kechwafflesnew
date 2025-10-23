import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isUserAdmin } from "@/lib/admin";

/**
 * GET: Récupère tous les produits
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const isActive = searchParams.get("isActive");

    const where: {
      category?: string;
      isActive?: boolean;
    } = {};

    if (category) where.category = category;
    if (isActive !== null) where.isActive = isActive === "true";

    const products = await prisma.product.findMany({
      where,
      include: {
        variants: {
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

/**
 * POST: Crée un nouveau produit
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const isAdmin = await isUserAdmin(session.user.id);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Accès admin requis" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      handle,
      sku,
      name,
      category,
      description,
      image,
      price,
      isModifier,
      hasTax,
      variants,
    } = body;

    // Validation
    if (!handle || !sku || !name || !category) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    // Créer le produit
    const product = await prisma.product.create({
      data: {
        handle,
        sku,
        name,
        category,
        description: description || null,
        image: image || null,
        price: variants && variants.length > 0 ? null : price,
        isModifier: isModifier || false,
        hasTax: hasTax !== false,
        isActive: true,
        syncSource: "MANUAL",
      },
    });

    // Créer les variants si fournis
    if (variants && variants.length > 0) {
      for (const variant of variants) {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            option1Name: variant.option1Name || null,
            option1Value: variant.option1Value || null,
            option2Name: variant.option2Name || null,
            option2Value: variant.option2Value || null,
            price: variant.price,
            variantSku: variant.variantSku || null,
            isActive: true,
          },
        });
      }
    }

    // Récupérer le produit avec ses variants
    const createdProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: { variants: true },
    });

    return NextResponse.json({
      success: true,
      product: createdProduct,
    });
  } catch (error) {
    console.error("Erreur création produit:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la création du produit",
        message: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
