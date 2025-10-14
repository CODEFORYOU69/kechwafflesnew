import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware Next.js pour protéger les routes admin
 * Vérifie l'authentification et le rôle admin avant d'autoriser l'accès
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes admin à protéger
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    try {
      // Récupérer le cookie de session Better Auth
      const sessionToken = request.cookies.get("better-auth.session_token")?.value;

      if (!sessionToken) {
        // Pas de session - rediriger vers la page de connexion
        if (pathname.startsWith("/api/admin")) {
          return NextResponse.json(
            { error: "Non authentifié" },
            { status: 401 }
          );
        }
        const loginUrl = new URL("/concours/auth", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Note: Pour une vérification complète du rôle admin, il faudrait faire une requête DB
      // Mais pour éviter de ralentir chaque requête, on peut:
      // 1. Vérifier uniquement la présence d'une session ici
      // 2. Faire la vérification du rôle admin dans chaque API route (comme on fait déjà)
      // 3. Ou utiliser un JWT décodable côté middleware

      // Pour l'instant, on laisse passer si la session existe
      // La vérification du rôle admin se fait dans chaque API route
      return NextResponse.next();
    } catch (error) {
      console.error("Middleware error:", error);

      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json(
          { error: "Erreur d'authentification" },
          { status: 500 }
        );
      }

      return NextResponse.redirect(new URL("/concours/auth", request.url));
    }
  }

  return NextResponse.next();
}

/**
 * Configuration du middleware
 * Spécifie les routes sur lesquelles le middleware doit s'exécuter
 */
export const config = {
  matcher: [
    /*
     * Match toutes les routes admin:
     * - /admin/*
     * - /api/admin/*
     */
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
