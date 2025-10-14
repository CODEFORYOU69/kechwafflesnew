import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * OAuth callback pour Loyverse
 * Gère l'échange du code d'autorisation contre un access token
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  // Si l'utilisateur refuse l'accès
  if (error) {
    console.error("Loyverse OAuth error:", error);
    return NextResponse.redirect(new URL("/admin?error=oauth_denied", request.url));
  }

  // Si pas de code, erreur
  if (!code) {
    return NextResponse.redirect(new URL("/admin?error=missing_code", request.url));
  }

  try {
    // Échanger le code contre un access token
    const tokenResponse = await fetch("https://api.loyverse.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        client_id: process.env.LOYVERSE_CLIENT_ID!,
        client_secret: process.env.LOYVERSE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/loyverse/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const tokenData = await tokenResponse.json();

    // Calculer l'expiration du token
    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

    // Sauvegarder le token en base de données
    await prisma.loyverseConfig.upsert({
      where: { id: "singleton" },
      create: {
        id: "singleton",
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || null,
        expiresAt,
        storeId: null, // Sera récupéré plus tard
      },
      update: {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || null,
        expiresAt,
      },
    });

    console.log("✅ Loyverse token saved to database");

    // Récupérer le Store ID via l'API Loyverse
    try {
      const storesResponse = await fetch("https://api.loyverse.com/v1.0/stores", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      if (storesResponse.ok) {
        const storesData = await storesResponse.json();
        const stores = storesData.stores || [];

        if (stores.length > 0) {
          const firstStore = stores[0];

          // Mettre à jour avec le Store ID
          await prisma.loyverseConfig.update({
            where: { id: "singleton" },
            data: { storeId: firstStore.id },
          });

          console.log("✅ Store ID saved:", firstStore.id);
        }
      }
    } catch (error) {
      console.error("⚠️  Could not fetch store ID:", error);
      // Ce n'est pas critique, on continue
    }

    // Rediriger vers la page admin avec succès
    return NextResponse.redirect(
      new URL("/admin?loyverse=connected", request.url)
    );
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    return NextResponse.redirect(
      new URL("/admin?error=token_exchange_failed", request.url)
    );
  }
}
