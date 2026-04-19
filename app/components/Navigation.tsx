"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSession, signOut } from "@/lib/auth-client";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { LogOut, Menu, Settings, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = { label: string; href: string };

const navItems: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Notre histoire", href: "/notre-histoire" },
  { label: "Produits", href: "/product" },
  { label: "Carte", href: "/menu" },
  { label: "Nous trouver", href: "/location" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [concoursActive, setConcoursActive] = useState(false);
  const { scrollY } = useScroll();
  const { data: session } = useSession();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

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

  useEffect(() => {
    fetch("/api/competition/status")
      .then((r) => r.json())
      .then((d) => setConcoursActive(!!d.isActive))
      .catch(() => {});
  }, []);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  const items: NavItem[] = concoursActive
    ? [...navItems, { label: "Concours", href: "/concours" }]
    : navItems;

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={[
          "fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 backdrop-blur-xl",
          scrolled
            ? "bg-[hsl(var(--ink-950)/0.85)] border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.35)]"
            : "bg-[hsl(var(--ink-950)/0.6)] border-white/5",
        ].join(" ")}
      >
        <div className="mx-auto flex h-[84px] w-full max-w-[1440px] items-center justify-between gap-6 px-6 md:h-[92px] md:px-10">
          {/* Left cluster: logo + nav adjacent */}
          <div className="flex items-center gap-8 md:gap-10 lg:gap-14">
            <Link
              href="/"
              className="group flex flex-shrink-0 items-center text-[hsl(var(--text))]"
              aria-label="Kech Waffles — Accueil"
            >
              <Image
                src="/images/menu-items/TransparentWhite.png"
                alt="Kech Waffles"
                width={240}
                height={96}
                priority
                className="h-14 w-auto object-contain md:h-16 lg:h-[72px]"
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 md:flex">
              {items.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "group relative px-3 py-2 text-[13px] font-normal tracking-wide transition-colors lg:px-4 lg:text-sm",
                      active
                        ? "text-[hsl(var(--text))]"
                        : "text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text))]",
                    ].join(" ")}
                  >
                    <span>{item.label}</span>
                    <span
                      className={[
                        "absolute left-3 right-3 -bottom-0.5 h-px origin-left scale-x-0 bg-[hsl(var(--accent))] transition-transform duration-500 lg:left-4 lg:right-4",
                        active ? "scale-x-100" : "group-hover:scale-x-100",
                      ].join(" ")}
                    />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right cluster */}
          <div className="hidden items-center gap-3 md:flex">
            {session ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[hsl(var(--text-muted))] transition hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    Admin
                  </Link>
                )}
                <Link
                  href="/loyalty/card"
                  className="inline-flex items-center gap-2 text-sm text-[hsl(var(--text-muted))] transition hover:text-[hsl(var(--text))]"
                >
                  <User className="h-4 w-4" />
                  {session.user?.name?.split(" ")[0] || "Compte"}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-[hsl(var(--text-subtle))] transition hover:text-[hsl(var(--text))]"
                  aria-label="Déconnexion"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <Link
                href="/menu"
                className="group inline-flex items-center gap-3 rounded-[var(--radius-full)] bg-[hsl(var(--accent))] px-5 py-2.5 text-sm font-medium text-[hsl(var(--ink-950))] transition hover:bg-[hsl(var(--accent-soft))]"
              >
                Voir la carte
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            )}
          </div>

          {/* Mobile trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                className="md:hidden -mr-2 p-2 text-[hsl(var(--text))]"
                aria-label="Ouvrir le menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full border-l-0 bg-[hsl(var(--ink-950))] p-0 sm:w-[420px]"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between px-8 pt-8">
                  <Image
                    src="/images/menu-items/TransparentWhite.png"
                    alt="Kech Waffles"
                    width={180}
                    height={60}
                    className="h-10 w-auto object-contain"
                  />
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 text-[hsl(var(--text-muted))]"
                    aria-label="Fermer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <nav className="flex flex-1 flex-col justify-center px-8">
                  {items.map((item, i) => {
                    const active =
                      item.href === "/"
                        ? pathname === "/"
                        : pathname?.startsWith(item.href);
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="group block border-b border-white/5 py-5"
                        >
                          <div className="flex items-baseline justify-between gap-4">
                            <span
                              className={[
                                "font-display text-3xl transition-colors",
                                active
                                  ? "text-[hsl(var(--accent))]"
                                  : "text-[hsl(var(--text))]",
                              ].join(" ")}
                            >
                              {item.label}
                            </span>
                            <span className="text-[hsl(var(--text-subtle))] transition-transform group-hover:translate-x-1">
                              →
                            </span>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
                <div className="space-y-3 border-t border-white/5 px-8 pb-10 pt-6">
                  {session ? (
                    <>
                      <p className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--text-subtle))]">
                        Connecté · {session.user?.name?.split(" ")[0]}
                      </p>
                      {isAdmin && (
                        <Button
                          variant="outline"
                          className="w-full border-white/10 text-[hsl(var(--text))]"
                          asChild
                        >
                          <Link href="/admin" onClick={() => setMobileOpen(false)}>
                            <Settings className="mr-2 h-4 w-4" />
                            Admin
                          </Link>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        className="w-full text-[hsl(var(--text-muted))]"
                        onClick={handleSignOut}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Déconnexion
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="w-full rounded-[var(--radius-full)] bg-[hsl(var(--accent))] text-[hsl(var(--ink-950))] hover:bg-[hsl(var(--accent-soft))]"
                      asChild
                    >
                      <Link href="/concours/auth" onClick={() => setMobileOpen(false)}>
                        Connexion
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.header>

      {/* Spacer-free page: sections handle their own top padding */}
      <AnimatePresence />
    </>
  );
}
