/**
 * Intégration API Loyverse avec OAuth
 * Documentation: https://help.loyverse.com/help/loyverse-api
 */

import { prisma } from "@/lib/prisma";

const LOYVERSE_API_URL = "https://api.loyverse.com/v1.0";

/**
 * Types Loyverse
 */
export type LoyverseCustomer = {
  id: string;
  name: string;
  email?: string;
  customer_code?: string;
  phone_number?: string;
  address?: string;
  city?: string;
  country?: string;
  total_points: number;
  total_visits: number;
  total_spent: string;
  created_at: string;
  updated_at: string;
};

export type LoyverseReceipt = {
  id: string;
  receipt_number: string;
  customer_id?: string;
  total_money: string;
  receipt_date: string;
  line_items: Array<{
    name: string;
    price: string;
    quantity: number;
  }>;
};

/**
 * Récupère le token OAuth depuis la base de données
 */
async function getLoyverseToken(): Promise<string> {
  const config = await prisma.loyverseConfig.findUnique({
    where: { id: "singleton" },
  });

  if (!config) {
    throw new Error("Loyverse not connected. Please connect via /api/loyverse/connect");
  }

  // Vérifier si le token est expiré
  const now = new Date();
  if (config.expiresAt < now) {
    // TODO: Implémenter le refresh token
    throw new Error("Loyverse token expired. Please reconnect.");
  }

  return config.accessToken;
}

/**
 * Headers pour les requêtes Loyverse
 */
async function getLoyverseHeaders() {
  const token = await getLoyverseToken();

  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

/**
 * Crée un client dans Loyverse
 */
export async function createLoyverseCustomer(data: {
  name: string;
  email: string;
  cardNumber: string;
  phone?: string;
}): Promise<string> {
  try {
    const headers = await getLoyverseHeaders();
    const response = await fetch(`${LOYVERSE_API_URL}/customers`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        customer_code: data.cardNumber, // Numéro de carte comme code client
        phone_number: data.phone,
        total_points: 0,
        // Note: total_visits et total_spent sont calculés automatiquement par Loyverse
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Loyverse API error (${response.status}): ${error}`);
    }

    const customer: LoyverseCustomer = await response.json();
    return customer.id;
  } catch (error) {
    console.error("Erreur création client Loyverse:", error);
    throw error;
  }
}

/**
 * Récupère un client par son customer_code (numéro de carte)
 */
export async function getLoyverseCustomerByCode(
  customerCode: string
): Promise<LoyverseCustomer | null> {
  try {
    const headers = await getLoyverseHeaders();
    const response = await fetch(
      `${LOYVERSE_API_URL}/customers?customer_code=${encodeURIComponent(customerCode)}`,
      {
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Loyverse API error: ${response.statusText}`);
    }

    const data = await response.json();
    const customers: LoyverseCustomer[] = data.customers || [];

    return customers.length > 0 ? customers[0] : null;
  } catch (error) {
    console.error("Erreur récupération client Loyverse:", error);
    return null;
  }
}

/**
 * Met à jour un client dans Loyverse
 */
export async function updateLoyverseCustomer(
  customerId: string,
  data: {
    name?: string;
    email?: string;
    phone_number?: string;
    total_points?: number;
    total_visits?: number;
    total_spent?: string;
  }
): Promise<LoyverseCustomer> {
  try {
    const headers = await getLoyverseHeaders();
    const response = await fetch(
      `${LOYVERSE_API_URL}/customers/${customerId}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Loyverse API error (${response.status}): ${error}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur mise à jour client Loyverse:", error);
    throw error;
  }
}

/**
 * Récupère les reçus/commandes d'un client
 */
export async function getLoyverseReceipts(
  customerId: string,
  limit = 100
): Promise<LoyverseReceipt[]> {
  try {
    const headers = await getLoyverseHeaders();
    const response = await fetch(
      `${LOYVERSE_API_URL}/receipts?customer_id=${customerId}&limit=${limit}`,
      {
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Loyverse API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.receipts || [];
  } catch (error) {
    console.error("Erreur récupération reçus Loyverse:", error);
    return [];
  }
}

/**
 * Synchronise un client : Met à jour Loyverse avec nos données
 */
export async function syncCustomerToLoyverse(
  loyverseCustomerId: string,
  memberCard: {
    totalPoints: number;
    visitCount: number;
    totalSpent: number;
  }
): Promise<void> {
  try {
    await updateLoyverseCustomer(loyverseCustomerId, {
      total_points: memberCard.totalPoints,
      total_visits: memberCard.visitCount,
      total_spent: memberCard.totalSpent.toFixed(2),
    });
  } catch (error) {
    console.error("Erreur synchronisation Loyverse:", error);
    throw error;
  }
}

/**
 * Synchronise depuis Loyverse : Récupère les achats et met à jour nos points
 */
export async function syncFromLoyverse(
  loyverseCustomerId: string
): Promise<{
  totalSpent: number;
  visitCount: number;
}> {
  try {
    // Récupérer le client
    const headers = await getLoyverseHeaders();
    const response = await fetch(
      `${LOYVERSE_API_URL}/customers/${loyverseCustomerId}`,
      {
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Loyverse API error: ${response.statusText}`);
    }

    const customer: LoyverseCustomer = await response.json();

    return {
      totalSpent: parseFloat(customer.total_spent),
      visitCount: customer.total_visits,
    };
  } catch (error) {
    console.error("Erreur synchronisation depuis Loyverse:", error);
    throw error;
  }
}

/**
 * Teste la connexion à l'API Loyverse
 */
export async function testLoyverseConnection(): Promise<boolean> {
  try {
    const headers = await getLoyverseHeaders();
    const response = await fetch(`${LOYVERSE_API_URL}/customers?limit=1`, {
      headers,
    });

    return response.ok;
  } catch (error) {
    console.error("Erreur connexion Loyverse:", error);
    return false;
  }
}
