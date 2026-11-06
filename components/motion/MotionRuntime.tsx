"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "./routes";

/**
 * The only script behind `Reveal`, `ParallaxLayer` and `MagneticButton`.
 * Those stay plain markup, usable from Server Components: one observer and one
 * delegated listener here instead of one hydrated component per instance.
 */
export function MotionRuntime() {
  useEffect(() => {
    document.documentElement.setAttribute("data-reveal-ready", "");

    const stopReveals = startReveals();
    const stopParallax = startParallaxFallback();
    const stopMagnetic = startMagnetic();

    return () => {
      stopReveals();
      stopParallax();
      stopMagnetic();
    };
  }, []);

  return null;
}

function startReveals() {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-visible", "");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px" },
  );

  // Endless animations (the marquee, the terminal cursor) pause while out of sight.
  const pausable = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      entry.target.toggleAttribute("data-offscreen", !entry.isIntersecting);
    }
  });

  const observed = new WeakSet<Element>();

  function scan() {
    document
      .querySelectorAll("[data-reveal]:not([data-visible])")
      .forEach((element) => {
        if (observed.has(element)) return;
        observed.add(element);
        observer.observe(element);
      });

    document.querySelectorAll("[data-pause-offscreen]").forEach((element) => {
      if (observed.has(element)) return;
      observed.add(element);
      pausable.observe(element);
    });
  }

  scan();

  // Route changes and client-fetched lists (the /menu products) add nodes later.
  let scheduledFrame = 0;
  const mutations = new MutationObserver(() => {
    if (scheduledFrame) return;
    scheduledFrame = requestAnimationFrame(() => {
      scheduledFrame = 0;
      scan();
    });
  });
  mutations.observe(document.body, { childList: true, subtree: true });

  return () => {
    cancelAnimationFrame(scheduledFrame);
    mutations.disconnect();
    observer.disconnect();
    pausable.disconnect();
  };
}

/**
 * CSS scroll-driven animations do this work off the main thread wherever they
 * exist. Older desktop browsers get a script; older phones get a still image,
 * because a main-thread parallax visibly trembles under native touch scrolling.
 */
function startParallaxFallback() {
  const isNeeded =
    !CSS.supports("animation-timeline: view()") &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !prefersReducedMotion();
  if (!isNeeded) return noop;

  const visibleLayers = new Set<HTMLElement>();
  const intersection = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const layer = entry.target as HTMLElement;
        if (entry.isIntersecting) visibleLayers.add(layer);
        else visibleLayers.delete(layer);
      }
      requestTick();
    },
    { rootMargin: "15% 0px" },
  );

  const observed = new WeakSet<Element>();

  function scan() {
    document.querySelectorAll(".parallax-layer").forEach((layer) => {
      if (observed.has(layer)) return;
      observed.add(layer);
      intersection.observe(layer);
    });
  }

  let tickFrame = 0;

  function requestTick() {
    if (!tickFrame) tickFrame = requestAnimationFrame(tick);
  }

  function tick() {
    tickFrame = 0;
    const viewportHeight = window.innerHeight;

    visibleLayers.forEach((layer) => {
      const frameElement = layer.parentElement;
      if (!frameElement) return;

      const { top, height } = frameElement.getBoundingClientRect();
      const progress = clamp((viewportHeight - top) / (viewportHeight + height));
      const strength = parseFloat(layer.style.getPropertyValue("--parallax")) || 8;
      const scale = layer.style.getPropertyValue("--parallax-scale") || "1.17";
      const offset = (progress * 2 - 1) * strength;

      layer.style.transform = `translate3d(0, ${offset.toFixed(3)}%, 0) scale(${scale})`;
    });
  }

  scan();
  requestTick();

  const mutations = new MutationObserver(scan);
  mutations.observe(document.body, { childList: true, subtree: true });
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick, { passive: true });

  return () => {
    cancelAnimationFrame(tickFrame);
    mutations.disconnect();
    intersection.disconnect();
    window.removeEventListener("scroll", requestTick);
    window.removeEventListener("resize", requestTick);
  };
}

function startMagnetic() {
  const isEnabled =
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !prefersReducedMotion();
  if (!isEnabled) return noop;

  let activeElement: HTMLElement | null = null;
  let activeRect: DOMRect | null = null;
  let strength = DEFAULT_MAGNETIC_STRENGTH;

  function release() {
    if (!activeElement) return;
    activeElement.style.removeProperty("--mx");
    activeElement.style.removeProperty("--my");
    activeElement.removeAttribute("data-active");
    activeElement = null;
    activeRect = null;
  }

  function onPointerMove(event: PointerEvent) {
    if (event.pointerType !== "mouse") return;

    const target =
      event.target instanceof Element
        ? event.target.closest<HTMLElement>(".magnetic")
        : null;

    if (target !== activeElement) {
      release();
      if (!target) return;
      activeElement = target;
      strength = Number(target.dataset.magnetic) || DEFAULT_MAGNETIC_STRENGTH;
      target.setAttribute("data-active", "true");
    }
    if (!activeElement) return;

    // Measured once per hover, and again only if the page moved underneath.
    activeRect ??= activeElement.getBoundingClientRect();

    const x = (event.clientX - (activeRect.left + activeRect.width / 2)) * strength;
    const y = (event.clientY - (activeRect.top + activeRect.height / 2)) * strength;
    activeElement.style.setProperty("--mx", `${x.toFixed(2)}px`);
    activeElement.style.setProperty("--my", `${y.toFixed(2)}px`);
  }

  function onScroll() {
    activeRect = null;
  }

  const root = document.documentElement;
  document.addEventListener("pointermove", onPointerMove, { passive: true });
  root.addEventListener("pointerleave", release);
  window.addEventListener("scroll", onScroll, { passive: true });

  return () => {
    release();
    document.removeEventListener("pointermove", onPointerMove);
    root.removeEventListener("pointerleave", release);
    window.removeEventListener("scroll", onScroll);
  };
}

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function noop() {}

const DEFAULT_MAGNETIC_STRENGTH = 0.35;
