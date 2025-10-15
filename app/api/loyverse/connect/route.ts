import { NextResponse } from "next/server";

/**
 * Route pour initier la connexion OAuth avec Loyverse
 * Redirige l'utilisateur vers la page d'autorisation Loyverse
 */
export async function GET() {
  const clientId = process.env.LOYVERSE_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/loyverse/callback`;

  if (!clientId) {
    return NextResponse.json(
      { error: "Loyverse client ID not configured" },
      { status: 500 }
    );
  }

  // Construire l'URL d'autorisation Loyverse
  const authUrl = new URL("https://api.loyverse.com/oauth/authorize");
  authUrl.searchParams.append("client_id", clientId);
  authUrl.searchParams.append("redirect_uri", redirectUri);
  authUrl.searchParams.append("response_type", "code");
  // Scopes Loyverse: lecture et écriture des customers, items, receipts, stores
  authUrl.searchParams.append("scope", "CUSTOMERS_READ CUSTOMERS_WRITE ITEMS_READ RECEIPTS_READ STORES_READ MERCHANT_READ");

  // Rediriger vers Loyverse
  return NextResponse.redirect(authUrl.toString());
}
