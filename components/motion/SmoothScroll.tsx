"use client";

import { cancelFrame, frame } from "framer-motion";
import { ReactLenis, type LenisRef } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { isAppRoute } from "./routes";

/**
 * Wheel smoothing only, on mouse devices. Touch stays native on purpose: iOS and Android
 * momentum runs on the compositor and nothing written in JavaScript can match it. Lenis is
 * not even mounted there: its touch listeners are not passive and its clock never sleeps.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const hasMouse = useSyncExternalStore(subscribeToMouseQuery, matchesMouseQuery, hasNoMouse);
  return hasMouse && !isAppRoute(pathname) ? <LenisRoot /> : null;
}

function LenisRoot() {
  const lenisRef = useRef<LenisRef>(null);

  // One clock: Lenis ticks with Framer Motion so scroll-linked values never lag a frame.
  useEffect(() => {
    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp);
    }

    frame.update(update, true);
    return () => cancelFrame(update);
  }, []);

  // Radix marks <body> while a Sheet, Dialog or Select holds the page.
  useEffect(() => {
    const { body } = document;
    const observer = new MutationObserver(() => {
      const lenis = lenisRef.current?.lenis;
      if (!lenis) return;
      if (body.hasAttribute("data-scroll-locked")) lenis.stop();
      else lenis.start();
    });

    observer.observe(body, {
      attributes: true,
      attributeFilter: ["data-scroll-locked"],
    });
    return () => observer.disconnect();
  }, []);

  return <ReactLenis root ref={lenisRef} options={LENIS_OPTIONS} />;
}

/** Radix content is portalled outside the page and scrolls natively. */
function isNativeScrollArea(node: HTMLElement) {
  const role = node.getAttribute("role");
  return role === "dialog" || role === "listbox" || role === "menu";
}

function subscribeToMouseQuery(onChange: () => void) {
  const query = window.matchMedia(MOUSE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function matchesMouseQuery() {
  return window.matchMedia(MOUSE_QUERY).matches;
}

function hasNoMouse() {
  return false;
}

const MOUSE_QUERY = "(hover: hover) and (pointer: fine)";

// Module constant: ReactLenis rebuilds its instance whenever these options change.
const LENIS_OPTIONS = {
  autoRaf: false,
  syncTouch: false,
  prevent: isNativeScrollArea,
};
