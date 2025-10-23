import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isUserAdmin } from "@/lib/admin";
import { updateLoyverseItem, updateLoyverseVariantPrice } from "@/lib/loyalty/loyverse";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * GET: Récupère un produit spécifique
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Erreur récupération produit:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * PUT: Met à jour un produit
 * Synchronise automatiquement avec Loyverse si le produit y est lié
 */
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
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

    const { id } = await context.params;
    const body = await request.json();

    // Récupérer le produit existant
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      );
    }

    const {
      name,
      description,
      image,
      price,
      category,
      isActive,
      displayOrder,
      variants,
    } = body;

    // Mettre à jour le produit
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: name || existingProduct.name,
        description: description !== undefined ? description : existingProduct.description,
        image: image !== undefined ? image : existingProduct.image,
        price: price !== undefined ? price : existingProduct.price,
        category: category || existingProduct.category,
        isActive: isActive !== undefined ? isActive : existingProduct.isActive,
        displayOrder: displayOrder !== undefined ? displayOrder : existingProduct.displayOrder,
      },
    });

    // Synchroniser avec Loyverse si lié
    if (existingProduct.loyverseItemId) {
      try {
        // Mettre à jour le nom dans Loyverse si modifié
        if (name && name !== existingProduct.name) {
          await updateLoyverseItem(existingProduct.loyverseItemId, {
            name,
          });
        }
      } catch (error) {
        console.error("⚠️ Erreur sync Loyverse (non bloquant):", error);
      }
    }

    // Gérer les variants si fournis
    if (variants && Array.isArray(variants)) {
      // Supprimer les anciens variants
      await prisma.productVariant.deleteMany({
        where: { productId: id },
      });

      // Créer les nouveaux variants
      for (const variant of variants) {
        const createdVariant = await prisma.productVariant.create({
          data: {
            productId: id,
            option1Name: variant.option1Name || null,
            option1Value: variant.option1Value || null,
            option2Name: variant.option2Name || null,
            option2Value: variant.option2Value || null,
            price: variant.price,
            variantSku: variant.variantSku || null,
            loyverseVariantId: variant.loyverseVariantId || null,
            isActive: variant.isActive !== false,
          },
        });

        // Synchroniser le prix avec Loyverse si lié
        if (variant.loyverseVariantId) {
          try {
            await updateLoyverseVariantPrice(
              variant.loyverseVariantId,
              variant.price
            );
          } catch (error) {
            console.error("⚠️ Erreur sync prix Loyverse (non bloquant):", error);
          }
        }
      }
    }

    // Récupérer le produit mis à jour avec ses variants
    const finalProduct = await prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    });

    return NextResponse.json({
      success: true,
      product: finalProduct,
    });
  } catch (error) {
    console.error("Erreur mise à jour produit:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la mise à jour",
        message: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Supprime un produit
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
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

    const { id } = await context.params;

    // Supprimer le produit (les variants seront supprimés en cascade)
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Produit supprimé",
    });
  } catch (error) {
    console.error("Erreur suppression produit:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la suppression",
        message: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
