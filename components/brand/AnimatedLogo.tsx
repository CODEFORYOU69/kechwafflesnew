"use client";

import { prefersReducedMotion } from "@/components/motion/routes";
import {
  m,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, type CSSProperties } from "react";
import { LOGO_GOLD_STOPS, logoPart, type LogoPart } from "./logo-data";

/**
 * The real logo, one GPU layer per part, filling a box its parent sizes.
 * The entrance runs in CSS so it never waits for hydration. Scrolling and the
 * pointer only drive `transform` and `opacity`.
 */
export function AnimatedLogo({
  progress,
  archZoom,
  archX,
  archY,
}: {
  progress: MotionValue<number>;
  /** How far the camera has zoomed through the arch: 1 at rest. */
  archZoom: MotionValue<number>;
  /** Keeps the arch centred on the door while the door travels, in pixels. */
  archX: MotionValue<number>;
  archY: MotionValue<number>;
}) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateY = useSpring(
    useTransform(pointerX, [-1, 1], [-MAX_TILT, MAX_TILT]),
    TILT_SPRING,
  );
  const rotateX = useSpring(
    useTransform(pointerY, [-1, 1], [MAX_TILT * 0.8, -MAX_TILT * 0.8]),
    TILT_SPRING,
  );

  useEffect(() => {
    const isMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isMouse || prefersReducedMotion()) return;

    function onPointerMove(event: PointerEvent) {
      if (progress.get() > 0.3) return;
      pointerX.set((event.clientX / window.innerWidth) * 2 - 1);
      pointerY.set((event.clientY / window.innerHeight) * 2 - 1);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [pointerX, pointerY, progress]);

  // Cutlery and wordmark clear the way, then the camera goes through the arch.
  const spoonX = useTransform(progress, [0.03, 0.24], ["0%", "-420%"]);
  const spoonRotate = useTransform(progress, [0.03, 0.24], [0, -18]);
  const forkX = useTransform(progress, [0.03, 0.24], ["0%", "700%"]);
  const forkRotate = useTransform(progress, [0.03, 0.24], [0, 18]);
  const cutleryOpacity = useTransform(progress, [0.06, 0.22], [1, 0]);

  const starsY = useTransform(progress, [0.02, 0.14], ["0%", "70%"]);
  const starsOpacity = useTransform(progress, [0.02, 0.12], [1, 0]);
  const linesLeftX = useTransform(progress, [0.02, 0.16], ["0%", "-16%"]);
  const linesRightX = useTransform(progress, [0.02, 0.16], ["0%", "16%"]);
  const linesOpacity = useTransform(progress, [0.02, 0.14], [1, 0]);
  const wordmarkY = useTransform(progress, [0.03, 0.18], ["0%", "26%"]);
  const wordmarkOpacity = useTransform(progress, [0.03, 0.17], [1, 0]);

  const emblemScale = useTransform(archZoom, (zoom) => zoom / EMBLEM_OVERSCAN);
  const emblemOpacity = useTransform(archZoom, [4.5, ARCH_ZOOM_END], [1, 0]);
  const flameOpacity = useTransform(progress, [0.015, 0.07], [1, 0]);

  return (
    <m.div
      className="logo-tilt"
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
    >
      <div className="logo-levitate">
        <m.div
          className="logo-part"
          style={{ ...partBox(SPOON), x: spoonX, rotate: spoonRotate, opacity: cutleryOpacity, z: 60 }}
        >
          <LogoArt part={SPOON} className="logo-pop" style={delay(1.05)} />
        </m.div>
        <m.div
          className="logo-part"
          style={{ ...partBox(FORK), x: forkX, rotate: forkRotate, opacity: cutleryOpacity, z: 60 }}
        >
          <LogoArt part={FORK} className="logo-pop" style={delay(1.15)} />
        </m.div>
        <m.div
          className="logo-part"
          style={{ ...partBox(WORDMARK), y: wordmarkY, opacity: wordmarkOpacity, z: 12 }}
        >
          <LogoArt
            part={WORDMARK}
            className="logo-draw"
            style={{ ...delay(0.55), "--draw-duration": "1.5s" } as CSSProperties}
            strokeWidth={3}
          />
        </m.div>
        <m.div
          className="logo-part"
          style={{ ...partBox(LINES_LEFT), x: linesLeftX, opacity: linesOpacity, z: 20 }}
        >
          <LogoArt part={LINES_LEFT} className="logo-pop" style={delay(1.3)} />
        </m.div>
        <m.div
          className="logo-part"
          style={{ ...partBox(LINES_RIGHT), x: linesRightX, opacity: linesOpacity, z: 20 }}
        >
          <LogoArt part={LINES_RIGHT} className="logo-pop" style={delay(1.3)} />
        </m.div>
        <m.div
          className="logo-part"
          style={{ ...partBox(STARS), y: starsY, opacity: starsOpacity, z: 40 }}
        >
          <LogoArt part={STARS} className="logo-pop" style={delay(1.45)} />
        </m.div>

        {/* Laid out large then scaled down, so it stays sharp while the camera moves in. */}
        <m.div
          className="logo-part"
          style={{ ...EMBLEM_BOX, x: archX, y: archY, scale: emblemScale, opacity: emblemOpacity, z: 30 }}
        >
          <LogoArt
            part={EMBLEM}
            className="logo-draw"
            style={{ ...delay(0.1), "--draw-duration": "1.7s" } as CSSProperties}
            strokeWidth={2.4}
          />
          <m.div className="logo-part" style={{ ...FLAME_BOX, opacity: flameOpacity }}>
            <div className="logo-flame-glow logo-pop" style={delay(1.2)} />
            <div className="logo-pop h-full w-full" style={delay(1.2)}>
              <LogoArt part={FLAME} className="logo-flame" />
            </div>
          </m.div>
        </m.div>
      </div>
    </m.div>
  );
}

function LogoArt({
  part,
  className,
  style,
  strokeWidth,
}: {
  part: LogoPart;
  className?: string;
  style?: CSSProperties;
  /** Set on parts that draw their outline before filling. */
  strokeWidth?: number;
}) {
  const gradientId = `logo-gold-${part.id}`;
  const paint = part.fill === "gold" ? `url(#${gradientId})` : WORDMARK_COLOR;
  const isDrawn = strokeWidth !== undefined;

  return (
    <svg
      viewBox={part.viewBox}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      {part.fill === "gold" ? (
        <defs>
          <linearGradient id={gradientId} x1="1" y1="0" x2="0" y2="1">
            {LOGO_GOLD_STOPS.map((stop) => (
              <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
            ))}
          </linearGradient>
        </defs>
      ) : null}
      <path
        d={part.d}
        fill={paint}
        fillRule={part.evenodd ? "evenodd" : "nonzero"}
        stroke={isDrawn ? paint : undefined}
        strokeWidth={strokeWidth}
        pathLength={isDrawn ? part.drawLength : undefined}
      />
    </svg>
  );
}

function partBox(part: LogoPart) {
  return {
    left: `${part.left}%`,
    top: `${part.top}%`,
    width: `${part.width}%`,
    height: `${part.height}%`,
  };
}

function delay(seconds: number) {
  return { "--draw-delay": `${seconds}s` } as CSSProperties;
}

const EMBLEM = logoPart("emblem");
const FLAME = logoPart("flame");
const SPOON = logoPart("spoon");
const FORK = logoPart("fork");
const STARS = logoPart("stars");
const LINES_LEFT = logoPart("linesLeft");
const LINES_RIGHT = logoPart("linesRight");
const WORDMARK = logoPart("wordmark");

const WORDMARK_COLOR = "#FBF6EC";
const MAX_TILT = 7;
const TILT_SPRING = { stiffness: 60, damping: 18, mass: 0.7 };
const EMBLEM_OVERSCAN = 3.2;

/** Past this zoom the arch has passed the camera. */
export const ARCH_ZOOM_END = 7;

/** Centre of the clear space inside the arch, measured on the emblem. Share of the full logo. */
export const LOGO_DOOR_ANCHOR = { x: 0.513, y: 0.2102 };

/** Size of that clear space, measured the same way. */
export const LOGO_ARCH_OPENING = { width: 0.1084, height: 0.1607 };

const ANCHOR_IN_EMBLEM = {
  x: (LOGO_DOOR_ANCHOR.x * 100 - EMBLEM.left) / EMBLEM.width,
  y: (LOGO_DOOR_ANCHOR.y * 100 - EMBLEM.top) / EMBLEM.height,
};

// Scaling about the arch keeps the emblem concentric with the door behind it.
const EMBLEM_BOX = {
  left: `${EMBLEM.left - (EMBLEM_OVERSCAN - 1) * ANCHOR_IN_EMBLEM.x * EMBLEM.width}%`,
  top: `${EMBLEM.top - (EMBLEM_OVERSCAN - 1) * ANCHOR_IN_EMBLEM.y * EMBLEM.height}%`,
  width: `${EMBLEM.width * EMBLEM_OVERSCAN}%`,
  height: `${EMBLEM.height * EMBLEM_OVERSCAN}%`,
  transformOrigin: `${ANCHOR_IN_EMBLEM.x * 100}% ${ANCHOR_IN_EMBLEM.y * 100}%`,
};

const FLAME_BOX = {
  left: `${((FLAME.left - EMBLEM.left) / EMBLEM.width) * 100}%`,
  top: `${((FLAME.top - EMBLEM.top) / EMBLEM.height) * 100}%`,
  width: `${(FLAME.width / EMBLEM.width) * 100}%`,
  height: `${(FLAME.height / EMBLEM.height) * 100}%`,
};
