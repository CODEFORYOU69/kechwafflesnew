"use client";

import { signOut, useSession } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * The only door to the auth client from the shared layout: `Navigation` loads this
 * file on demand, so a visitor who is not signed in never waits for it. Renders
 * nothing for guests; its root carries `peer nav-account` so that the guest link
 * next to it can hide itself in CSS without ever being remounted.
 */
export function NavAccount({
  variant,
  onNavigate,
}: {
  variant: "bar" | "sheet";
  /** Lets the Sheet close when one of its links is followed. */
  onNavigate?: () => void;
}) {
  const { data: session } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/auth/check-admin")
        .then((r) => r.json())
        .then((d) => setIsAdmin(!!d.isAdmin))
        .catch(() => {});
    } else {
      setIsAdmin(false);
    }
  }, [session]);

  if (!session) return null;

  const firstName = session.user?.name?.split(" ")[0] || "Compte";

  async function handleSignOut() {
    await signOut();
    window.location.href = "/";
  }

  if (variant === "sheet") {
    return (
      <div className="peer nav-account flex basis-full flex-wrap items-center gap-x-5">
        <Link
          href="/loyalty/card"
          onClick={onNavigate}
          aria-label={`${firstName}, ma carte de fidélité`}
          className="inline-flex min-h-11 items-center text-sm font-medium text-cream-50"
        >
          {firstName}
        </Link>
        {isAdmin ? (
          <Link
            href="/admin"
            onClick={onNavigate}
            className="inline-flex min-h-11 items-center text-sm text-cream-200"
          >
            Admin
          </Link>
        ) : null}
        <button
          type="button"
          onClick={handleSignOut}
          className="ml-auto inline-flex min-h-11 items-center text-sm text-cream-200"
        >
          Déconnexion
        </button>
      </div>
    );
  }

  return (
    <div className="peer nav-account flex items-center gap-1">
      {isAdmin ? (
        <Link
          href="/admin"
          className="text-eyebrow mr-2 inline-flex min-h-11 items-center rounded-full border border-cream-50/25 px-4 text-cream-200 fine:hover:border-gold-400 fine:hover:text-gold-400"
        >
          Admin
        </Link>
      ) : null}
      <Link
        href="/loyalty/card"
        aria-label={`${firstName}, ma carte de fidélité`}
        className="inline-flex min-h-11 max-w-32 items-center px-2 text-sm font-medium text-cream-50 fine:hover:text-gold-400"
      >
        <span className="truncate">{firstName}</span>
      </Link>
      <button
        type="button"
        onClick={handleSignOut}
        aria-label="Déconnexion"
        className="-mr-2.5 grid size-11 place-items-center text-cream-300 fine:hover:text-cream-50"
      >
        <LogOut className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
