/**
 * Système d'inscription au Concours 1 (Pronostics)
 *
 * Les utilisateurs doivent scanner UN QR code UNE SEULE FOIS
 * pour avoir accès aux pronostics pendant toute la durée de la CAN
 */

import { nanoid } from "nanoid";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";

/**
 * Génère le QR code d'inscription au concours 1
 */
export async function generateRegistrationQRCode(): Promise<{
  qrCode: string;
  qrCodeUrl: string;
}> {
  // Génère un code unique
  const randomPart = nanoid(12).toUpperCase();
  const qrCode = `KWCAN-REGISTER-${randomPart}`;

  // URL de scan pour l'inscription
  const scanUrl = `${process.env.NEXT_PUBLIC_APP_URL}/concours/register?code=${qrCode}`;

  // Génère le QR code en Data URL
  const qrCodeUrl = await QRCode.toDataURL(scanUrl, {
    width: 800,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  });

  return { qrCode, qrCodeUrl };
}

/**
 * Crée le QR code d'inscription dans la DB
 * Appelé par l'admin une seule fois au début de la CAN
 */
export async function createRegistrationQRCode(): Promise<{
  id: string;
  qrCode: string;
  qrCodeUrl: string;
}> {
  // Désactive les anciens QR codes
  await prisma.concoursRegistrationQR.updateMany({
    where: {
      isActive: true,
    },
    data: {
      isActive: false,
    },
  });

  // Génère un nouveau QR code
  const { qrCode, qrCodeUrl } = await generateRegistrationQRCode();

  // Crée le nouveau QR code
  const registrationQR = await prisma.concoursRegistrationQR.create({
    data: {
      qrCode,
      qrCodeUrl,
      isActive: true,
      scanCount: 0,
    },
  });

  return registrationQR;
}

/**
 * Récupère le QR code d'inscription actif
 */
export async function getActiveRegistrationQRCode(): Promise<{
  id: string;
  qrCode: string;
  qrCodeUrl: string;
  scanCount: number;
} | null> {
  const qrCode = await prisma.concoursRegistrationQR.findFirst({
    where: {
      isActive: true,
    },
  });

  return qrCode;
}

/**
 * Valide un QR code d'inscription
 */
export async function validateRegistrationQRCode(code: string): Promise<{
  valid: boolean;
  qrCodeId?: string;
  message: string;
}> {
  const qrCode = await prisma.concoursRegistrationQR.findUnique({
    where: {
      qrCode: code,
    },
  });

  if (!qrCode) {
    return {
      valid: false,
      message: "QR code invalide",
    };
  }

  if (!qrCode.isActive) {
    return {
      valid: false,
      message: "Ce QR code n'est plus actif",
    };
  }

  return {
    valid: true,
    qrCodeId: qrCode.id,
    message: "QR code valide",
  };
}

/**
 * Inscrit un utilisateur au concours 1 (Pronostics)
 */
export async function registerUserForPronostics(
  userId: string,
  qrCodeId: string
): Promise<{
  success: boolean;
  message: string;
  alreadyRegistered: boolean;
}> {
  try {
    // Vérifie si l'utilisateur est déjà inscrit
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { registeredForPronostics: true },
    });

    if (user?.registeredForPronostics) {
      return {
        success: true,
        message: "Vous êtes déjà inscrit au concours de pronostics",
        alreadyRegistered: true,
      };
    }

    // Inscrit l'utilisateur et incrémente le compteur
    await prisma.$transaction([
      // Marque l'utilisateur comme inscrit
      prisma.user.update({
        where: { id: userId },
        data: {
          registeredForPronostics: true,
          registeredAt: new Date(),
        },
      }),
      // Incrémente le compteur de scans
      prisma.concoursRegistrationQR.update({
        where: { id: qrCodeId },
        data: {
          scanCount: {
            increment: 1,
          },
        },
      }),
    ]);

    return {
      success: true,
      message:
        "Inscription réussie ! Vous pouvez maintenant faire vos pronostics pendant toute la durée de la CAN.",
      alreadyRegistered: false,
    };
  } catch (error) {
    console.error("Erreur inscription concours:", error);
    return {
      success: false,
      message: "Erreur lors de l'inscription",
      alreadyRegistered: false,
    };
  }
}

/**
 * Vérifie si un utilisateur est inscrit au concours 1
 */
export async function isUserRegisteredForPronostics(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { registeredForPronostics: true },
  });

  return user?.registeredForPronostics || false;
}

/**
 * Statistiques d'inscription pour l'admin
 */
export async function getRegistrationStats() {
  const qrCode = await getActiveRegistrationQRCode();

  const totalRegistered = await prisma.user.count({
    where: {
      registeredForPronostics: true,
    },
  });

  const registrationsByDay = await prisma.user.groupBy({
    by: ["registeredAt"],
    where: {
      registeredForPronostics: true,
      registeredAt: {
        not: null,
      },
    },
    _count: {
      id: true,
    },
    orderBy: {
      registeredAt: "desc",
    },
  });

  return {
    qrCode,
    totalRegistered,
    registrationsByDay,
  };
}
