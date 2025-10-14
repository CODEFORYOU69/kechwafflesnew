/**
 * Utilitaires pour la gestion des admins
 */

import { prisma } from "./prisma";

/**
 * Vérifie si un utilisateur est admin
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  return user?.role === "ADMIN";
}

/**
 * Vérifie si un utilisateur est admin par email
 */
export async function isEmailAdmin(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { role: true },
  });

  return user?.role === "ADMIN";
}

/**
 * Promouvoir un utilisateur en admin
 */
export async function promoteToAdmin(email: string): Promise<boolean> {
  try {
    await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });
    return true;
  } catch (error) {
    console.error("Erreur promotion admin:", error);
    return false;
  }
}

/**
 * Liste des emails admin par défaut
 * Ces utilisateurs sont automatiquement admin à la création
 */
export const ADMIN_EMAILS = [
  "y.ouasmi@gmail.com",
  "admin@kech-waffles.com",
];

/**
 * Vérifie si un email est dans la liste des admins
 */
export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
