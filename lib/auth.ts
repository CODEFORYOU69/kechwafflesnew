import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./prisma";
import { ADMIN_EMAILS } from "./admin";

export const auth = betterAuth({
  plugins: [nextCookies()],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Mettre true pour production
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/google`,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 jours
    updateAge: 60 * 60 * 24, // Mise à jour quotidienne
  },
  trustedOrigins: [process.env.BETTER_AUTH_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
      },
    },
  },
});

/**
 * Helper function to promote admin users after creation
 * Call this after user creation in your app
 */
export async function checkAndPromoteAdmin(userId: string, email: string) {
  if (ADMIN_EMAILS.includes(email.toLowerCase())) {
    await prisma.user.update({
      where: { id: userId },
      data: { role: "ADMIN" },
    });
  }
}

export type Session = typeof auth.$Infer.Session;
