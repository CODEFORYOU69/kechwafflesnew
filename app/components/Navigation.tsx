"use client";

import { MagneticButton } from "@/components/motion/MagneticButton";
import { isAppRoute } from "@/components/motion/routes";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CONTACT, HERO, whatsappUrl } from "@/lib/site-content";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import styles from "./Navigation.module.css";

const NavAccount = dynamic(
  () => import("./NavAccount").then((mod) => mod.NavAccount),
  { ssr: false },
);

export function Navigation() {
  const pathname = usePathname() ?? "";
  const isDesktop = useIsDesktop();
  const { isPastTop, isHeadingDown } = useScrollState();
  const [isIdle, setIsIdle] = useState(false);
  const [concoursActive, setConcoursActive] = useState(false);
  const [hasKeyboardFocus, setHasKeyboardFocus] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closedByLink = useRef(false);

  useEffect(
    () =>
      whenIdle(() => {
        setIsIdle(true);
        fetch("/api/competition/status")
          .then((r) => r.json())
          .then((d) => setConcoursActive(!!d.isActive))
          .catch(() => {});
      }),
    [],
  );

  // The back gesture must not change the page behind an open menu without closing it.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // A rotated tablet can cross `lg` with the Sheet open: its trigger is gone from there.
  useEffect(() => {
    if (isDesktop) setMobileOpen(false);
  }, [isDesktop]);

  function closeFromLink() {
    closedByLink.current = true;
    setMobileOpen(false);
  }

  const links = concoursActive ? [...NAV_LINKS, CONCOURS_LINK] : NAV_LINKS;

  return (
    <header
      // The back-office pages start on a light background: cream text needs the bar there.
      data-scrolled={isPastTop || isAppRoute(pathname)}
      data-hidden={isHeadingDown && !hasKeyboardFocus && !mobileOpen}
      onFocusCapture={(event) => {
        // A mouse click also leaves focus here, and must not pin the bar for the next page.
        setHasKeyboardFocus(event.target.matches(":focus-visible"));
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setHasKeyboardFocus(false);
        }
      }}
      className="group/nav fixed inset-x-0 top-0 z-50 h-[var(--nav-h)] transition-transform duration-500 ease-soft data-[hidden=true]:-translate-y-full print:hidden"
    >
      {/* Its own layer, so the bar fades in with opacity instead of repainting a background. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-espresso-950/90 opacity-0 transition-opacity duration-300 fine:backdrop-blur-md group-data-[scrolled=true]/nav:opacity-100"
      >
        <div className="hairline absolute inset-x-0 bottom-0" />
      </div>

      <div className="page-x intro-fade relative flex h-full items-center justify-between gap-4 lg:justify-start lg:gap-[clamp(1.25rem,3.4vw,3.5rem)]">
        <Link
          href="/"
          aria-label={HOME_LABEL}
          className="inline-flex min-h-11 min-w-11 flex-none items-center"
        >
          <Emblem />
        </Link>

        <nav aria-label={NAV_LABEL} className="hidden lg:block">
          <ul className="flex items-center">
            {links.map((link) => (
              <li key={link.href}>
                <BarLink link={link} isCurrent={isCurrentPage(link.href, pathname)} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3 lg:ml-auto">
          <div className="hidden items-center lg:flex">
            {isDesktop && isIdle ? <NavAccount variant="bar" /> : null}
            <MagneticButton className="peer-[.nav-account]:hidden">
              <Link href="/menu" className="cta min-h-11 gap-2 px-5 py-2 text-sm">
                <span className="cta__label">{MENU_CTA}</span>
                <ArrowUpRight className="cta__arrow size-4" aria-hidden="true" />
              </Link>
            </MagneticButton>
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              aria-label={OPEN_LABEL}
              className="-mr-2 inline-flex min-h-11 min-w-11 items-center justify-center px-2 font-display text-lg leading-none text-cream-50 lg:hidden"
            >
              {TRIGGER_LABEL}
            </SheetTrigger>
            <SheetContent
              ref={labelCloseButton}
              side="right"
              data-lenis-prevent
              onCloseAutoFocus={(event) => {
                // `PageTransition` already moved focus to where the link led: keep it there.
                if (closedByLink.current) event.preventDefault();
                closedByLink.current = false;
              }}
              className={cn(
                styles.sheet,
                "h-dvh w-full overflow-y-auto overscroll-contain border-l-0 bg-espresso-950 p-0 shadow-none sm:max-w-none",
              )}
            >
              <MobileMenu links={links} pathname={pathname} onNavigate={closeFromLink} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function Emblem() {
  return (
    <Image
      src="/brand/emblem.svg"
      alt=""
      width={436}
      height={652}
      sizes="32px"
      loading="eager"
      className="h-10 w-auto md:h-12"
    />
  );
}

function BarLink({ link, isCurrent }: { link: NavLink; isCurrent: boolean }) {
  return (
    <Link
      href={link.href}
      aria-current={isCurrent ? "page" : undefined}
      className={cn(
        "group inline-flex min-h-11 items-center whitespace-nowrap px-2.5 text-sm",
        isCurrent ? "text-cream-50" : "text-cream-200 fine:hover:text-cream-50",
      )}
    >
      <span className="relative">
        {link.label}
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-gold-400 transition-transform duration-500 ease-soft",
            isCurrent
              ? "scale-x-100"
              : "group-focus-visible:scale-x-100 fine:group-hover:scale-x-100",
          )}
        />
      </span>
    </Link>
  );
}

function MobileMenu({
  links,
  pathname,
  onNavigate,
}: {
  links: NavLink[];
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <>
      <SheetTitle className="sr-only">{SHEET_TITLE}</SheetTitle>
      <SheetDescription className="sr-only">{SHEET_DESCRIPTION}</SheetDescription>

      <div
        aria-hidden="true"
        className="kufic-grid mask-b-fade pointer-events-none absolute inset-0 text-gold-400 opacity-[0.04]"
      />

      <div className="relative flex min-h-full flex-col">
        <div className="flex h-[var(--nav-h)] flex-none items-center px-[var(--gutter)]">
          <Link
            href="/"
            aria-label={HOME_LABEL}
            onClick={onNavigate}
            className="inline-flex min-h-11 min-w-11 items-center"
          >
            <Emblem />
          </Link>
        </div>

        <div className={styles.body}>
          <nav aria-label={NAV_LABEL} className={styles.nav}>
            <ul className={styles.list}>
              {links.map((link, index) => {
                const isCurrent = isCurrentPage(link.href, pathname);
                return (
                  <li
                    key={link.href}
                    className="sheet-link border-b border-cream-50/10"
                    style={{ "--i": index } as CSSProperties}
                  >
                    <Link
                      href={link.href}
                      onClick={onNavigate}
                      aria-current={isCurrent ? "page" : undefined}
                      className={cn(styles.link, isCurrent ? "text-gold-400" : "text-cream-50")}
                    >
                      <span className="text-eyebrow w-5 flex-none text-gold-400" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className={cn("text-section", styles.label)}>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div
            aria-hidden="true"
            className={cn("frame-arch sheet-link", styles.door)}
            style={{ "--i": 2 } as CSSProperties}
          >
            <Image
              src="/images/site/facade-night.jpg"
              alt=""
              fill
              sizes="38vw"
              className="object-cover object-[center_38%]"
            />
          </div>
        </div>

        <div
          className="sheet-link flex-none px-[var(--gutter)] pb-[max(1rem,env(safe-area-inset-bottom))]"
          style={{ "--i": links.length } as CSSProperties}
        >
          <div className="grid grid-cols-2 gap-4 pt-1 text-sm leading-snug">
            <p className="text-cream-50">
              {CONTACT.addressLine}
              <br />
              <span className="text-cream-300">{CONTACT.city}</span>
            </p>
            <p className="text-cream-300">{HERO.finalNote}</p>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-5">
            <SheetExternalLink href={CONTACT.instagramUrl} label="Instagram" />
            <SheetExternalLink href={whatsappUrl()} label="WhatsApp" />
            <NavAccount variant="sheet" onNavigate={onNavigate} />
            <Link
              href="/concours/auth"
              onClick={onNavigate}
              className="ml-auto inline-flex min-h-11 items-center text-sm font-medium text-gold-400 peer-[.nav-account]:hidden"
            >
              {SIGN_IN_LABEL}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function SheetExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center gap-1 text-sm text-cream-50"
    >
      {label}
      <ArrowUpRight className="size-3.5 text-gold-400" aria-hidden="true" />
      <span className="sr-only">{NEW_TAB_LABEL}</span>
    </a>
  );
}

/**
 * Listens to native scroll, which Lenis also goes through. `isHeadingDown` flips only
 * once the page has travelled `SCROLL_JITTER` from the last turning point, so a slow
 * or trembling scroll cannot make the bar flicker.
 */
function useScrollState() {
  const [isPastTop, setIsPastTop] = useState(false);
  const [isHeadingDown, setIsHeadingDown] = useState(false);

  useEffect(() => {
    let frame = 0;
    let turningPoint = readScrollY();

    function update() {
      frame = 0;
      const y = readScrollY();
      setIsPastTop(y > SCROLLED_FROM);

      if (y <= NEVER_HIDDEN_WITHIN) {
        setIsHeadingDown(false);
        turningPoint = y;
        return;
      }

      const travelled = y - turningPoint;
      if (Math.abs(travelled) < SCROLL_JITTER) return;
      setIsHeadingDown(travelled > 0);
      turningPoint = y;
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return { isPastTop, isHeadingDown };
}

/** Clamped: iOS rubber-banding past either end would otherwise read as a change of direction. */
function readScrollY() {
  const lastY = document.documentElement.scrollHeight - window.innerHeight;
  return Math.min(Math.max(window.scrollY, 0), Math.max(lastY, 0));
}

/** Below `lg` the account lives in the Sheet: phones skip the auth client until it opens. */
function useIsDesktop() {
  return useSyncExternalStore(subscribeToDesktop, readIsDesktop, () => false);
}

function subscribeToDesktop(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function readIsDesktop() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

/** Safari has no `requestIdleCallback`. */
function whenIdle(task: () => void) {
  if (typeof window.requestIdleCallback === "function") {
    const handle = window.requestIdleCallback(task, { timeout: IDLE_TIMEOUT_MS });
    return () => window.cancelIdleCallback(handle);
  }
  const handle = setTimeout(task, IDLE_FALLBACK_MS);
  return () => clearTimeout(handle);
}

/** An anchor points inside the home page: it is never the current page. */
function isCurrentPage(href: string, pathname: string) {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** `components/ui/sheet.tsx` hardcodes an English label on its built-in close button. */
function labelCloseButton(content: HTMLDivElement | null) {
  content?.querySelector(":scope > button")?.setAttribute("aria-label", CLOSE_LABEL);
}

const NAV_LINKS: NavLink[] = [
  { label: "Café", href: "/#cafe" },
  { label: "Carte", href: "/menu" },
  { label: "Girls Only", href: "/girls-only" },
  { label: "Café IA", href: "/cafe-ia" },
  { label: "Prestations", href: "/prestations" },
  { label: "Histoire", href: "/notre-histoire" },
  { label: "Nous trouver", href: "/location" },
];

const CONCOURS_LINK: NavLink = { label: "Concours", href: "/concours" };

const HOME_LABEL = "Kech Waffles, accueil";
const NAV_LABEL = "Navigation principale";
const MENU_CTA = "Voir la carte";
const TRIGGER_LABEL = "Menu";
const OPEN_LABEL = "Ouvrir le menu de navigation";
const CLOSE_LABEL = "Fermer le menu de navigation";
const SHEET_TITLE = "Menu de navigation";
const SHEET_DESCRIPTION = "Les pages du site, notre adresse, nos horaires et nos réseaux.";
const SIGN_IN_LABEL = "Connexion";
const NEW_TAB_LABEL = "(nouvel onglet)";

const SCROLLED_FROM = 24;
const NEVER_HIDDEN_WITHIN = 80;
const SCROLL_JITTER = 8;

const DESKTOP_QUERY = "(min-width: 1024px)";
const IDLE_TIMEOUT_MS = 2000;
const IDLE_FALLBACK_MS = 1200;

type NavLink = { label: string; href: string };
