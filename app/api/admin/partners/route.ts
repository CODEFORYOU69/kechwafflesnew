import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * GET: Liste tous les partenaires (Admin uniquement)
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Non autorisé" },
        { status: 401 }
      );
    }

    const partners = await prisma.partner.findMany({
      orderBy: [
        { tier: "asc" },
        { displayOrder: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({
      success: true,
      partners,
    });
  } catch (error) {
    console.error("Erreur GET partners:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * POST: Crée un nouveau partenaire (Admin uniquement)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Non autorisé" },
        { status: 401 }
      );
    }

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

    // Validation
    if (!name || !description || !prizeTitle) {
      return NextResponse.json(
        {
          success: false,
          message: "Nom, description et titre du cadeau sont requis",
        },
        { status: 400 }
      );
    }

    const partner = await prisma.partner.create({
      data: {
        name,
        description,
        logo,
        address,
        phone,
        email,
        website,
        tier: tier || "BRONZE",
        prizeTitle,
        prizeDescription,
        prizeValue: prizeValue ? parseFloat(prizeValue) : null,
        prizeImage,
        prizeQuantity: prizeQuantity || 1,
        isActive: isActive !== undefined ? isActive : true,
        isVisible: isVisible !== undefined ? isVisible : true,
        displayOrder: displayOrder || 0,
      },
    });

    return NextResponse.json({
      success: true,
      partner,
      message: "Partenaire créé avec succès",
    });
  } catch (error) {
    console.error("Erreur POST partner:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
