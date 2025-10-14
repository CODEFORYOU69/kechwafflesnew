import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  validateRegistrationQRCode,
  registerUserForPronostics,
  isUserRegisteredForPronostics,
} from "@/lib/concours/registration";

/**
 * POST: Inscrit un utilisateur au Concours 1 (Pronostics)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Non authentifié" },
        { status: 401 }
      );
    }

    const { qrCode } = await request.json();

    if (!qrCode) {
      return NextResponse.json(
        { success: false, message: "QR code manquant" },
        { status: 400 }
      );
    }

    // Valide le QR code
    const validation = await validateRegistrationQRCode(qrCode);

    if (!validation.valid || !validation.qrCodeId) {
      return NextResponse.json(
        { success: false, message: validation.message },
        { status: 400 }
      );
    }

    // Inscrit l'utilisateur
    const result = await registerUserForPronostics(session.user.id, validation.qrCodeId);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur API register:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * GET: Vérifie si l'utilisateur est inscrit
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ registered: false });
    }

    const registered = await isUserRegisteredForPronostics(session.user.id);

    return NextResponse.json({ registered });
  } catch (error) {
    console.error("Erreur API register GET:", error);
    return NextResponse.json({ registered: false });
  }
}
