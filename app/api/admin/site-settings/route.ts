import { isUserAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { validateSiteSettings } from "@/lib/site-settings";
import { readSiteSettingsFresh, saveSiteSettings } from "@/lib/site-settings.server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

/** GET /api/admin/site-settings: the home sections, the hours and the closure, as stored. */
export async function GET() {
  const denied = await denyUnlessAdmin();
  if (denied) return denied;

  try {
    return NextResponse.json({ settings: await readSiteSettingsFresh() });
  } catch (error) {
    console.error("Lecture des réglages du site:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

/** PUT /api/admin/site-settings: saves them all, then refreshes every page that shows them. */
export async function PUT(request: Request) {
  const denied = await denyUnlessAdmin();
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  const result = validateSiteSettings(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.errors.join(" ") }, { status: 400 });
  }

  try {
    await saveSiteSettings(result.settings);
    return NextResponse.json({ settings: result.settings });
  } catch (error) {
    console.error("Enregistrement des réglages du site:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

/** The same check as the other admin routes: a session, then the ADMIN role. */
async function denyUnlessAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  if (!(await isUserAdmin(session.user.id))) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  return null;
}
