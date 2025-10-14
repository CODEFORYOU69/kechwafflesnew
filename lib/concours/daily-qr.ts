/**
 * Système de QR Code Journalier - Concours 2
 *
 * Génère un QR code unique chaque jour qui doit être scanné en PDV
 * pour accéder aux pronostics du concours CAN 2025
 */

import { nanoid } from "nanoid";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";

/**
 * Génère un QR code unique pour une date donnée
 * Format du code: KWCAN-YYYYMMDD-RANDOM
 */
export async function generateDailyQRCode(date: Date): Promise<{
  qrCode: string;
  qrCodeUrl: string;
}> {
  // Format de la date: YYYYMMDD
  const dateStr = date.toISOString().split("T")[0].replace(/-/g, "");

  // Génère un code unique
  const randomPart = nanoid(8).toUpperCase();
  const qrCode = `KWCAN-${dateStr}-${randomPart}`;

  // Génère l'URL de scan (redirige vers la page de pronostics)
  const scanUrl = `${process.env.NEXT_PUBLIC_APP_URL}/concours/scan?code=${qrCode}`;

  // Génère le QR code en Data URL
  const qrCodeUrl = await QRCode.toDataURL(scanUrl, {
    width: 600,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  });

  return { qrCode, qrCodeUrl };
}

/**
 * Crée un nouveau QR code journalier dans la base de données
 * Devrait être appelé par un cron job à minuit chaque jour
 */
export async function createDailyQRCode(date: Date = new Date()): Promise<{
  id: string;
  qrCode: string;
  qrCodeUrl: string;
  validDate: Date;
}> {
  // Normalise la date à minuit UTC
  const validDate = new Date(date);
  validDate.setUTCHours(0, 0, 0, 0);

  // Vérifie si un QR existe déjà pour cette date
  const existing = await prisma.dailyQRCode.findFirst({
    where: {
      validDate,
    },
  });

  if (existing) {
    return existing;
  }

  // Génère un nouveau QR code
  const { qrCode, qrCodeUrl } = await generateDailyQRCode(validDate);

  // Désactive les QR codes précédents
  await prisma.dailyQRCode.updateMany({
    where: {
      isActive: true,
    },
    data: {
      isActive: false,
    },
  });

  // Crée le nouveau QR code
  const dailyQR = await prisma.dailyQRCode.create({
    data: {
      qrCode,
      qrCodeUrl,
      validDate,
      isActive: true,
      scanCount: 0,
    },
  });

  return dailyQR;
}

/**
 * Récupère le QR code actif du jour
 */
export async function getTodayQRCode(): Promise<{
  id: string;
  qrCode: string;
  qrCodeUrl: string;
  validDate: Date;
  scanCount: number;
} | null> {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const qrCode = await prisma.dailyQRCode.findFirst({
    where: {
      validDate: today,
      isActive: true,
    },
  });

  return qrCode;
}

/**
 * Vérifie si un QR code est valide
 */
export async function validateQRCode(code: string): Promise<{
  valid: boolean;
  qrCodeId?: string;
  message: string;
}> {
  const qrCode = await prisma.dailyQRCode.findUnique({
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

  // Vérifie que le QR code est valide aujourd'hui
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const validDate = new Date(qrCode.validDate);
  validDate.setUTCHours(0, 0, 0, 0);

  if (validDate.getTime() !== today.getTime()) {
    return {
      valid: false,
      message: "Ce QR code n'est valide que le " + validDate.toLocaleDateString("fr-FR"),
    };
  }

  return {
    valid: true,
    qrCodeId: qrCode.id,
    message: "QR code valide",
  };
}

/**
 * Enregistre un scan de QR code par un utilisateur
 * Retourne true si c'est le premier scan du jour, false sinon
 */
export async function recordQRScan(
  userId: string,
  qrCodeId: string
): Promise<{
  success: boolean;
  message: string;
  isFirstScan: boolean;
}> {
  try {
    // Vérifie si l'utilisateur a déjà scanné ce QR aujourd'hui
    const existingScan = await prisma.qRScan.findUnique({
      where: {
        userId_qrCodeId: {
          userId,
          qrCodeId,
        },
      },
    });

    if (existingScan) {
      return {
        success: true,
        message: "Vous avez déjà scanné le QR code d'aujourd'hui",
        isFirstScan: false,
      };
    }

    // Enregistre le scan
    await prisma.$transaction([
      // Crée le scan
      prisma.qRScan.create({
        data: {
          userId,
          qrCodeId,
          hasAccess: true,
        },
      }),
      // Incrémente le compteur de scans
      prisma.dailyQRCode.update({
        where: {
          id: qrCodeId,
        },
        data: {
          scanCount: {
            increment: 1,
          },
        },
      }),
    ]);

    return {
      success: true,
      message: "QR code scanné avec succès ! Vous pouvez maintenant faire vos pronostics.",
      isFirstScan: true,
    };
  } catch (error) {
    console.error("Erreur enregistrement scan:", error);
    return {
      success: false,
      message: "Erreur lors de l'enregistrement du scan",
      isFirstScan: false,
    };
  }
}

/**
 * Vérifie si un utilisateur a scanné le QR du jour
 * Nécessaire pour autoriser l'accès aux pronostics
 */
export async function hasScannedToday(userId: string): Promise<boolean> {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const todayQR = await getTodayQRCode();
  if (!todayQR) return false;

  const scan = await prisma.qRScan.findUnique({
    where: {
      userId_qrCodeId: {
        userId,
        qrCodeId: todayQR.id,
      },
    },
  });

  return !!scan;
}

/**
 * Récupère l'historique des scans d'un utilisateur
 */
export async function getUserScanHistory(userId: string) {
  const scans = await prisma.qRScan.findMany({
    where: {
      userId,
    },
    include: {
      dailyQRCode: {
        select: {
          validDate: true,
          scanCount: true,
        },
      },
    },
    orderBy: {
      scannedAt: "desc",
    },
  });

  return scans;
}

/**
 * Statistiques des scans pour l'admin
 */
export async function getQRCodeStats() {
  const allQRCodes = await prisma.dailyQRCode.findMany({
    orderBy: {
      validDate: "desc",
    },
    include: {
      _count: {
        select: {
          scans: true,
        },
      },
    },
  });

  const totalScans = await prisma.qRScan.count();
  const uniqueUsers = await prisma.qRScan.groupBy({
    by: ["userId"],
  });

  return {
    allQRCodes,
    totalScans,
    uniqueUsersCount: uniqueUsers.length,
  };
}
