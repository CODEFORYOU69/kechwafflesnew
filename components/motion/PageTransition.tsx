"use client";

import { useLenis } from "lenis/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { isAppRoute, prefersReducedMotion } from "./routes";

type CurtainState = "idle" | "covering" | "covered" | "revealing";

/**
 * The door again: an arch rises, covers the page, the route swaps behind it, and
 * the arch leaves through the top.
 *
 * Clicks are intercepted once, in the capture phase, so no link needs wrapping.
 * `next/link` still runs its own `onClick` (a Sheet still closes) and then skips
 * its navigation because the event is already `defaultPrevented`.
 * Opt out on a link with `data-no-transition`.
 */
export function PageTransition() {
  const router = useRouter();
  const lenis = useLenis();
  const [curtain, setCurtain] = useState<CurtainState>("idle");
  const [isPending, startTransition] = useTransition();

  const lenisRef = useRef(lenis);
  const curtainRef = useRef(curtain);
  const hasNavigationStarted = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  lenisRef.current = lenis;
  curtainRef.current = curtain;

  function reveal() {
    hasNavigationStarted.current = false;
    timers.current.forEach(clearTimeout);
    lenisRef.current?.start();
    lenisRef.current?.resize();
    setCurtain("revealing");
    timers.current = [setTimeout(() => setCurtain("idle"), REVEAL_MS)];
  }

  function navigate(href: string) {
    router.prefetch(href);
    setCurtain("covering");

    timers.current = [
      setTimeout(() => {
        setCurtain("covered");
        // Removes a classic scrollbar: only once the page is fully hidden.
        lenisRef.current?.stop();
        hasNavigationStarted.current = true;
        startTransition(() => router.push(href));
        // A failed or very slow navigation must never leave the page covered.
        timers.current = [setTimeout(reveal, NAVIGATION_TIMEOUT_MS)];
      }, COVER_MS),
    ];
  }

  // Lift the curtain once the new route has committed and had a frame to paint.
  useEffect(() => {
    if (curtain !== "covered" || isPending || !hasNavigationStarted.current) {
      return;
    }

    let hasLifted = false;
    function lift() {
      if (hasLifted) return;
      hasLifted = true;
      focusNewPage();
      reveal();
    }

    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(lift);
    });
    // A hidden tab pauses requestAnimationFrame: never wait on it alone.
    const paintFallback = setTimeout(lift, PAINT_FALLBACK_MS);

    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      clearTimeout(paintFallback);
    };
  }, [curtain, isPending]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[href]")
          : null;
      if (!anchor) return;
      if (anchor.hasAttribute("download") || anchor.hasAttribute("data-no-transition")) {
        return;
      }

      const target = anchor.getAttribute("target");
      if (target && target !== "_self") return;

      // Also rules out mailto:, tel: and every other domain.
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (isAppRoute(window.location.pathname) || isAppRoute(url.pathname)) return;

      const isSamePage =
        url.pathname === window.location.pathname &&
        url.search === window.location.search;

      if (isSamePage) {
        event.preventDefault();
        scrollWithinPage(url, lenisRef.current);
        return;
      }

      if (prefersReducedMotion()) return;
      // A link hit while the door leaves navigates at once, without a second door.
      if (curtainRef.current === "revealing") return;

      event.preventDefault();
      if (curtainRef.current === "idle") {
        navigate(url.pathname + url.search + url.hash);
      }
    }

    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
    // `navigate` only touches refs, setters and the stable router.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The back gesture wins over a navigation that has not started yet.
  useEffect(() => {
    function onPopState() {
      if (curtainRef.current !== "covering") return;
      timers.current.forEach(clearTimeout);
      setCurtain("idle");
    }

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const pendingTimers = timers;
    return () => pendingTimers.current.forEach(clearTimeout);
  }, []);

  return (
    <div className="door-curtain" data-state={curtain} aria-hidden="true">
      <svg
        className="door-curtain__panel"
        viewBox="0 0 100 165"
        preserveAspectRatio="none"
      >
        <path d="M0 165V25C0 11 22 0 50 0S100 11 100 25V165Z" fill="currentColor" />
      </svg>
      <Image
        className="door-curtain__mark"
        src="/brand/emblem.svg"
        alt=""
        width={436}
        height={652}
        loading="eager"
      />
    </div>
  );
}

function scrollWithinPage(url: URL, lenis: ReturnType<typeof useLenis>) {
  const isReduced = prefersReducedMotion();
  const destination = url.hash
    ? document.getElementById(decodeURIComponent(url.hash.slice(1)))
    : null;

  if (url.hash && !destination) return;

  if (url.href !== window.location.href) {
    window.history.pushState(null, "", url.href);
  }

  whenPageUnlocked(() => {
    if (lenis) {
      lenis.scrollTo(destination ?? 0, { immediate: isReduced });
    } else if (destination) {
      destination.scrollIntoView({ behavior: isReduced ? "auto" : "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: isReduced ? "auto" : "smooth" });
    }

    // Keyboard users continue from where the link took them.
    if (destination) focusWithoutScrolling(destination);
  });
}

/** After a route change the link is gone or left behind: Tab restarts from the new content. */
function focusNewPage() {
  const { hash } = window.location;
  const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
  const fallback = document.getElementById("contenu");
  if (target ?? fallback) focusWithoutScrolling((target ?? fallback) as HTMLElement);
}

function focusWithoutScrolling(element: HTMLElement) {
  if (!element.hasAttribute("tabindex")) element.setAttribute("tabindex", "-1");
  element.focus({ preventScroll: true });
}

/**
 * Restarting Lenis cancels any running scroll, so a link in the mobile Sheet waits
 * for the Sheet to let go. `SmoothScroll` observes first, so Lenis is running by then.
 */
function whenPageUnlocked(run: () => void) {
  const { body } = document;
  if (!body.hasAttribute("data-scroll-locked")) {
    run();
    return;
  }

  const observer = new MutationObserver(() => {
    if (body.hasAttribute("data-scroll-locked")) return;
    observer.disconnect();
    run();
  });
  observer.observe(body, {
    attributes: true,
    attributeFilter: ["data-scroll-locked"],
  });
}

// Keep in step with `.door-curtain` in globals.css.
const COVER_MS = 600;
const REVEAL_MS = 750;
const PAINT_FALLBACK_MS = 150;
const NAVIGATION_TIMEOUT_MS = 8000;
