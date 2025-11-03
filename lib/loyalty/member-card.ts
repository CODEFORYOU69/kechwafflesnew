import { customAlphabet } from "nanoid";
import QRCode from "qrcode";
import { prisma } from "../prisma";
import { createLoyverseCustomer, syncCustomerToLoyverse } from "./loyverse";

// Générateur de numéro de carte unique (format: KW-XXXXXX)
const generateCardNumber = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 6);

/**
 * Génère un numéro de carte membre unique
 */
export async function generateUniqueCardNumber(): Promise<string> {
  let cardNumber: string;
  let exists = true;

  // Boucle jusqu'à trouver un numéro unique
  while (exists) {
    cardNumber = `KW-${generateCardNumber()}`;
    const existing = await prisma.memberCard.findUnique({
      where: { cardNumber },
    });
    exists = !!existing;
  }

  return cardNumber!;
}

/**
 * Génère un QR code unique pour la carte
 */
export async function generateUniqueQRCode(cardNumber: string): Promise<string> {
  // Le QR code contient uniquement le numéro de carte
  const qrData = cardNumber;

  try {
    // Générer le QR code en Data URL
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    return qrCodeDataUrl;
  } catch (error) {
    console.error("Erreur génération QR code:", error);
    throw new Error("Impossible de générer le QR code");
  }
}

/**
 * Crée une carte membre pour un utilisateur
 */
export async function createMemberCard(userId: string) {
  // Vérifier si l'utilisateur a déjà une carte
  const existing = await prisma.memberCard.findUnique({
    where: { userId },
  });

  if (existing) {
    throw new Error("L'utilisateur possède déjà une carte membre");
  }

  // Récupérer les infos utilisateur
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("Utilisateur introuvable");
  }

  // Générer le numéro de carte unique
  const cardNumber = await generateUniqueCardNumber();

  // Générer le QR code
  const qrCode = await generateUniqueQRCode(cardNumber);

  // Tenter de créer le client dans Loyverse (non-bloquant)
  let loyverseCustomerId: string | null = null;
  try {
    loyverseCustomerId = await createLoyverseCustomer({
      name: user.name,
      email: user.email,
      cardNumber,
      phone: undefined, // Optionnel - peut être ajouté plus tard
    });
    console.log(`✅ Client Loyverse créé: ${loyverseCustomerId}`);
  } catch (error) {
    console.error("⚠️  Impossible de créer le client Loyverse:", error);
    // On continue quand même - la sync peut être faite plus tard
  }

  // Créer la carte en base avec le lien Loyverse
  const memberCard = await prisma.memberCard.create({
    data: {
      userId,
      cardNumber,
      qrCode,
      tier: "BRONZE",
      totalPoints: 0,
      currentPoints: 0,
      totalSpent: 0,
      visitCount: 0,
      loyverseCustomerId, // Lien vers le client Loyverse
    },
  });

  return memberCard;
}

/**
 * Calcule le tier basé sur le montant total dépensé
 */
export function calculateTier(totalSpent: number): "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" {
  if (totalSpent >= 2000) return "PLATINUM";
  if (totalSpent >= 1000) return "GOLD";
  if (totalSpent >= 500) return "SILVER";
  return "BRONZE";
}

/**
 * Ajoute des points de fidélité (1 point = 10 MAD dépensés)
 */
export async function addLoyaltyPoints(
  userId: string,
  amount: number,
  orderId?: string
) {
  const points = Math.floor(amount / 10); // 1 point par 10 MAD

  // Récupérer la carte membre actuelle
  const currentCard = await prisma.memberCard.findUnique({
    where: { userId },
  });

  if (!currentCard) {
    throw new Error("Carte membre introuvable");
  }

  // Calculer les nouvelles valeurs
  const newTotalSpent = currentCard.totalSpent + amount;
  const newTier = calculateTier(newTotalSpent);

  // Mettre à jour la carte membre
  const memberCard = await prisma.memberCard.update({
    where: { userId },
    data: {
      totalPoints: { increment: points },
      currentPoints: { increment: points },
      totalSpent: { increment: amount },
      visitCount: { increment: 1 },
      tier: newTier,
      lastSyncAt: new Date(),
    },
  });

  // Enregistrer la transaction
  await prisma.loyaltyTransaction.create({
    data: {
      userId,
      type: "PURCHASE",
      points,
      amount,
      description: `Achat de ${amount} MAD - ${points} points gagnés`,
      orderId,
    },
  });

  // Synchroniser avec Loyverse si le client est lié
  if (memberCard.loyverseCustomerId) {
    try {
      await syncCustomerToLoyverse(memberCard.loyverseCustomerId, {
        totalPoints: memberCard.totalPoints,
        visitCount: memberCard.visitCount,
        totalSpent: memberCard.totalSpent,
      });
      console.log(`✅ Client Loyverse synchronisé: ${memberCard.loyverseCustomerId}`);
    } catch (error) {
      console.error("⚠️  Erreur synchronisation Loyverse:", error);
      // Non-bloquant - la sync sera réessayée plus tard
    }
  }

  return memberCard;
}

/**
 * Récupère les avantages par tier
 */
export function getTierBenefits(tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM") {
  const benefits = {
    BRONZE: {
      name: "Bronze",
      color: "#CD7F32",
      benefits: [
        "1 point par 10 MAD dépensés",
        "Accès aux concours",
      ],
      discount: 0,
    },
    SILVER: {
      name: "Silver",
      color: "#C0C0C0",
      benefits: [
        "1 point par 10 MAD dépensés",
        "5% de réduction permanente",
        "Café offert pour votre anniversaire",
        "Accès prioritaire aux concours",
      ],
      discount: 5,
    },
    GOLD: {
      name: "Gold",
      color: "#FFD700",
      benefits: [
        "1.5 points par 10 MAD dépensés",
        "10% de réduction permanente",
        "Café + Gaufre offerts pour votre anniversaire",
        "Invitations aux événements exclusifs",
      ],
      discount: 10,
    },
    PLATINUM: {
      name: "Platinum",
      color: "#E5E4E2",
      benefits: [
        "2 points par 10 MAD dépensés",
        "15% de réduction permanente",
        "Menu complet offert pour votre anniversaire",
        "Accès VIP aux événements",
        "Produits en avant-première",
      ],
      discount: 15,
    },
  };

  return benefits[tier];
}
