import { isUserAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import type { SiteSettings } from "@/lib/site-settings";
import { readSiteSettingsFresh } from "@/lib/site-settings.server";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteSettingsForm } from "./SiteSettingsForm";

export const metadata: Metadata = {
  title: "Site vitrine : sections et horaires",
  robots: { index: false, follow: false },
};

/** The public site's settings: home sections, opening hours, temporary closure. */
export default async function SiteSettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect(`/concours/auth?redirect=${encodeURIComponent(PAGE_PATH)}`);
  if (!(await isUserAdmin(session.user.id))) return <Notice text={FORBIDDEN} />;

  const settings = await readSettings();
  if (!settings) return <Notice text={UNAVAILABLE} />;

  return (
    <div className="min-h-screen bg-espresso-950 px-4 pb-32 pt-[calc(var(--nav-h)+2rem)] text-cream-50 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <Link
            href="/admin"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm text-gold-400 hover:underline"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Dashboard admin
          </Link>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl font-bold">Site vitrine</h1>
              <p className="mt-2 text-cream-300">
                Les sections de l’accueil, les horaires et la fermeture temporaire.
              </p>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1 text-sm text-gold-400 hover:underline"
            >
              Voir le site
              <span className="sr-only"> (nouvel onglet)</span>
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </header>

        <SiteSettingsForm initialSettings={settings} />
      </div>
    </div>
  );
}

function Notice({ text }: { text: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-espresso-950 p-6 text-cream-50">
      <div className="max-w-md text-center">
        <p>{text}</p>
        <Link href="/admin" className="mt-4 inline-block text-gold-400 hover:underline">
          Retour au dashboard
        </Link>
      </div>
    </div>
  );
}

async function readSettings(): Promise<SiteSettings | null> {
  try {
    return await readSiteSettingsFresh();
  } catch (error) {
    console.error("Réglages du site illisibles dans l’admin:", error);
    return null;
  }
}

const PAGE_PATH = "/admin/site";
const FORBIDDEN = "Cette page est réservée aux administrateurs.";
const UNAVAILABLE =
  "Les réglages du site sont indisponibles : la base de données ne répond pas. Réessayez dans un instant.";
