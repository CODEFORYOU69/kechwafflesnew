import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isUserAdmin } from "@/lib/admin";

type Session = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

export type SessionResult =
  | { session: Session; error: null }
  | { session: null; error: NextResponse };

export type AdminResult =
  | { userId: string; error: null }
  | { userId: null; error: NextResponse };

/**
 * Vérifie qu'une session valide existe.
 * À utiliser dans les routes nécessitant une authentification.
 */
export async function requireSession(): Promise<SessionResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return {
      session: null,
      error: NextResponse.json({ error: "Non authentifié" }, { status: 401 }),
    };
  }

  return { session, error: null };
}

/**
 * Vérifie qu'une session valide existe ET que l'utilisateur est admin.
 * À utiliser dans les routes d'administration.
 */
export async function requireAdmin(): Promise<AdminResult> {
  const { session, error } = await requireSession();

  if (error) return { userId: null, error };

  const isAdmin = await isUserAdmin(session.user.id);
  if (!isAdmin) {
    return {
      userId: null,
      error: NextResponse.json(
        { error: "Accès admin requis" },
        { status: 403 }
      ),
    };
  }

  return { userId: session.user.id, error: null };
}
