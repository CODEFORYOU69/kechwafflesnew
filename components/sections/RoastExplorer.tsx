"use client";

import { prefersReducedMotion } from "@/components/motion/routes";
import { COFFEE } from "@/lib/site-content";
import { cn } from "@/lib/utils";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type PointerEvent,
} from "react";
import styles from "./CoffeeSection.module.css";

/**
 * A native range with three notches drives the whole panel through one CSS variable.
 * At rest it steps notch by notch, so keyboards and screen readers stay native. While a
 * pointer holds it the step is lifted: the thumb follows the hand, then settles on the
 * nearest notch. `--roast` is written directly, React only renders when a notch changes.
 */
export function RoastExplorer() {
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const frameRef = useRef(0);
  const hasInteractedRef = useRef(false);
  const landingRef = useRef<Landing | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const show = useCallback((position: number) => {
    rootRef.current?.style.setProperty("--roast", String(position));
    setActiveIndex(Math.round(position));
  }, []);

  const lock = useCallback(
    (notch: number) => {
      const input = inputRef.current;
      if (!input) return;
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
      input.value = String(notch);
      input.step = "1";
      rootRef.current?.removeAttribute("data-free");
      show(notch);
    },
    [show],
  );

  const loosen = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
    if (inputRef.current) inputRef.current.step = "any";
    rootRef.current?.setAttribute("data-free", "");
  }, []);

  const play = useCallback(
    (duration: number, positionAt: (time: number) => number) => {
      const input = inputRef.current;
      if (!input) return;
      loosen();
      const startedAt = performance.now();

      const tick = (now: number) => {
        const time = Math.min(1, (now - startedAt) / duration);
        const position = positionAt(time);
        if (time === 1) {
          lock(Math.round(position));
          return;
        }
        input.value = String(position);
        show(position);
        frameRef.current = requestAnimationFrame(tick);
      };

      frameRef.current = requestAnimationFrame(tick);
    },
    [lock, loosen, show],
  );

  function glideTo(notch: number, duration: number) {
    const from = Number(inputRef.current?.value ?? notch);
    if (from === notch || prefersReducedMotion()) {
      lock(notch);
      return;
    }
    play(duration, (time) => from + (notch - from) * easeOutCubic(time));
  }

  function handlePointerDown(event: PointerEvent<HTMLInputElement>) {
    hasInteractedRef.current = true;
    const startNotch = Math.round(Number(event.currentTarget.value));
    landingRef.current = {
      startNotch,
      landedAt: null,
      awaitsFirstValue: event.pointerType === "touch",
    };
    loosen();

    // Listened to on the window: the pointer can be released far from the input.
    const release = (releaseEvent: Event) => {
      RELEASE_EVENTS.forEach((type) => window.removeEventListener(type, release));
      const landing = landingRef.current;
      landingRef.current = null;
      // A cancel means the browser took the gesture over: that finger was scrolling the page.
      const notch =
        releaseEvent.type === "pointercancel"
          ? startNotch
          : Math.round(landing?.landedAt ?? Number(inputRef.current?.value ?? startNotch));
      glideTo(notch, SETTLE_MS);
    };
    RELEASE_EVENTS.forEach((type) => window.addEventListener(type, release));
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const position = Number(input.value);
    const landing = landingRef.current;

    // Chrome moves the thumb on touchstart, before it knows if this finger slides or scrolls.
    // Hold that first value back, so scrolling past the slider does not flash another profile.
    if (landing?.awaitsFirstValue) {
      landing.awaitsFirstValue = false;
      landing.landedAt = position;
      input.value = String(landing.startNotch);
      return;
    }

    if (landing) landing.landedAt = null;
    show(position);
  }

  function handleKeyDown() {
    hasInteractedRef.current = true;
    // A running glide holds the step open: lock first, so the key moves a full notch.
    if (frameRef.current) lock(Math.round(Number(inputRef.current?.value ?? 0)));
  }

  function handleNotchClick(notch: number) {
    hasInteractedRef.current = true;
    inputRef.current?.focus({ preventScroll: true });
    glideTo(notch, GLIDE_MS);
  }

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    // A value restored by the browser, or a drag that happened before hydration.
    show(Number(input.value));
    if (prefersReducedMotion()) return;

    // First time on screen, the thumb leans forward and back and the panel answers:
    // it reads as a control before anyone has touched it.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        if (hasInteractedRef.current || Number(input.value) !== 0) return;
        play(NUDGE_MS, (time) => NUDGE_REACH * Math.sin(Math.PI * time) ** 2);
      },
      { threshold: 1, rootMargin: "0px 0px -18% 0px" },
    );
    observer.observe(input);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameRef.current);
    };
  }, [play, show]);

  return (
    <div ref={rootRef} className={styles.roast}>
      <div className={cn(styles.tint, styles.tintDark)} aria-hidden="true" />
      <div className={cn(styles.tint, styles.tintMedium)} aria-hidden="true" />
      <div className={cn(styles.tint, styles.tintLight)} aria-hidden="true" />
      <div className={cn("kufic-grid", styles.tintGrid)} aria-hidden="true" />

      <div className="page-x">
        <div className={styles.roastHead}>
          <div className={styles.roastTitle}>
            <h3 className="text-eyebrow text-gold-200">
              <label htmlFor={RANGE_ID}>{COFFEE.roastLabel}</label>
            </h3>
            <p className="text-eyebrow" aria-hidden="true">
              {formatCount(activeIndex + 1)}/{formatCount(COFFEE.roasts.length)}
            </p>
          </div>
          <p id={HINT_ID} className={cn("text-eyebrow", styles.roastHint)}>
            {COFFEE.roastHint}
          </p>
        </div>

        <div className={styles.wordRail}>
          {COFFEE.roasts.map((roast, index) => (
            <p
              key={roast.id}
              className={cn("text-hero", styles.word)}
              data-active={index === activeIndex ? "" : undefined}
            >
              {roast.label}
            </p>
          ))}
        </div>

        <div className={styles.dial}>
          <input
            ref={inputRef}
            id={RANGE_ID}
            type="range"
            min={0}
            max={COFFEE.roasts.length - 1}
            step={1}
            defaultValue={0}
            className={styles.range}
            aria-describedby={HINT_ID}
            aria-valuetext={describeRoast(COFFEE.roasts[activeIndex])}
            onPointerDown={handlePointerDown}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
          />
          <div className={styles.ruler} aria-hidden="true" />
          {/* iOS only moves a range from its thumb, so tapping a name has to work too. */}
          <div className={styles.notches} aria-hidden="true">
            {COFFEE.roasts.map((roast, index) => (
              <button
                key={roast.id}
                type="button"
                tabIndex={-1}
                className={cn("text-eyebrow", styles.notch)}
                data-active={index === activeIndex ? "" : undefined}
                onClick={() => handleNotchClick(index)}
              >
                {roast.label}
              </button>
            ))}
          </div>
        </div>

        {/* All three stay laid out, stacked: the panel keeps its height whichever notch is on. */}
        <div className={styles.readouts}>
          {COFFEE.roasts.map((roast, index) => (
            <Readout key={roast.id} roast={roast} isActive={index === activeIndex} />
          ))}
        </div>

        <p className={styles.roastNote}>{COFFEE.roastNote}</p>
      </div>
    </div>
  );
}

function Readout({ roast, isActive }: { roast: Roast; isActive: boolean }) {
  return (
    <dl className={styles.readout} data-active={isActive ? "" : undefined}>
      <div className={styles.readoutItem}>
        <dt className="text-eyebrow text-gold-200">{READOUT_LABELS.origin}</dt>
        <dd className="text-headline mt-3">{roast.origin}</dd>
      </div>
      <div className={styles.readoutItem}>
        <dt className="text-eyebrow text-gold-200">{READOUT_LABELS.notes}</dt>
        <dd className="mt-3">
          <ul className="space-y-1 font-medium">
            {roast.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </dd>
      </div>
      <div className={styles.readoutItem}>
        <dt className="text-eyebrow text-gold-200">{READOUT_LABELS.body}</dt>
        <dd className="text-subhead mt-3 text-balance text-cream-200">{roast.body}</dd>
      </div>
      <div className={styles.readoutItem}>
        <dt className="text-eyebrow text-gold-200">{READOUT_LABELS.drinks}</dt>
        <dd className="mt-3">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.8125rem] leading-snug lg:block lg:space-y-1">
            {roast.drinks.map((drink) => (
              <li key={drink}>{drink}</li>
            ))}
          </ul>
        </dd>
      </div>
    </dl>
  );
}

function describeRoast(roast: Roast) {
  return `${roast.label}. ${READOUT_LABELS.origin} : ${roast.origin}. ${READOUT_LABELS.notes} : ${roast.notes.join(", ")}.`;
}

function formatCount(count: number) {
  return String(count).padStart(2, "0");
}

function easeOutCubic(time: number) {
  return 1 - (1 - time) ** 3;
}

const RANGE_ID = "roast-range";
const HINT_ID = "roast-hint";
const RELEASE_EVENTS = ["pointerup", "pointercancel", "touchend"] as const;
const SETTLE_MS = 340;
const GLIDE_MS = 760;
const NUDGE_MS = 1500;
const NUDGE_REACH = 0.4;

/** Not in `COFFEE` yet: these belong in `lib/site-content.ts`. */
const READOUT_LABELS = {
  origin: "Origine en guide",
  notes: "Notes",
  body: "Corps",
  drinks: "Boissons suggérées",
};

type Roast = (typeof COFFEE.roasts)[number];

type Landing = {
  startNotch: number;
  /** The value held back from the touch-down, until the finger proves it is sliding. */
  landedAt: number | null;
  awaitsFirstValue: boolean;
};
