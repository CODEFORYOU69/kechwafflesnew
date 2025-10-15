import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { isAdmin } from "@/lib/admin-check";

/**
 * PUT: Met à jour un partenaire (Admin uniquement)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !(await isAdmin(session.user.id))) {
      return NextResponse.json(
        { success: false, message: "Non autorisé" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const {
      name,
      description,
      logo,
      address,
      phone,
      email,
      website,
      tier,
      prizeTitle,
      prizeDescription,
      prizeValue,
      prizeImage,
      prizeQuantity,
      isActive,
      isVisible,
      displayOrder,
    } = body;

    const partner = await prisma.partner.update({
      where: { id },
      data: {
        name,
        description,
        logo,
        address,
        phone,
        email,
        website,
        tier,
        prizeTitle,
        prizeDescription,
        prizeValue: prizeValue ? parseFloat(prizeValue) : null,
        prizeImage,
        prizeQuantity,
        isActive,
        isVisible,
        displayOrder,
      },
    });

    return NextResponse.json({
      success: true,
      partner,
      message: "Partenaire mis à jour avec succès",
    });
  } catch (error) {
    console.error("Erreur PUT partner:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Supprime un partenaire (Admin uniquement)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !(await isAdmin(session.user.id))) {
      return NextResponse.json(
        { success: false, message: "Non autorisé" },
        { status: 401 }
      );
    }

    const { id } = await params;

    await prisma.partner.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Partenaire supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur DELETE partner:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
