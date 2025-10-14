import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  createRegistrationQRCode,
  getRegistrationStats,
} from "@/lib/concours/registration";

/**
 * GET: Récupère le QR code d'inscription actif et les stats
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

    const stats = await getRegistrationStats();

    return NextResponse.json({
      success: true,
      ...stats,
    });
  } catch (error) {
    console.error("Erreur GET registration QR:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * POST: Génère un nouveau QR code d'inscription
 */
export async function POST() {
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

    const qrCode = await createRegistrationQRCode();

    return NextResponse.json({
      success: true,
      qrCode,
      message: "QR code d'inscription généré avec succès",
    });
  } catch (error) {
    console.error("Erreur POST registration QR:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
