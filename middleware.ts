import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Middleware Next.js pour protéger les routes admin
 * Vérifie l'authentification avant d'autoriser l'accès
 * Note: La validation complète du rôle admin se fait dans les pages/API
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes admin à protéger
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    try {
      // Vérifier l'existence d'un cookie de session Better Auth
      const sessionCookie = getSessionCookie(request);

      if (!sessionCookie) {
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

      // Le cookie existe - laisser passer
      // La validation complète du rôle admin se fait dans chaque page/API route
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
