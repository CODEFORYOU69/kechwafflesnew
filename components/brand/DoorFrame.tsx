"use client";

import { m, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import {
  drawDoorFrame,
  frameSilhouette,
  type DoorFrameDrawing,
  type FrameLayer,
} from "./door-frame-geometry";
import { LOGO_GOLD_STOPS } from "./logo-data";

/**
 * The gold frame of the hero's door: the logo's calligraphy, laid around the arch.
 * It lives inside the door, so the camera carries it. It is drawn in an idle moment,
 * once per size; scrolling then only changes opacities and one transform.
 * Its box and its depth come from CSS (`.hero__frame`, `--frame-t`).
 */
export function DoorFrame({
  progress,
  isWanted,
}: {
  progress: MotionValue<number>;
  /** False until the first idle moment or the first scroll: nothing to draw before. */
  isWanted: boolean;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const depthRef = useRef<HTMLSpanElement>(null);
  const [drawing, setDrawing] = useState<DoorFrameDrawing | null>(null);

  useEffect(() => {
    const box = boxRef.current;
    const probe = depthRef.current;
    if (!isWanted || !box || !probe) return;

    let drawn: DoorFrameDrawing | null = null;
    let cancel = () => {};

    function draw() {
      if (!box || !probe) return;
      // Layout sizes, untouched by the camera's transforms.
      const boxStyle = getComputedStyle(box);
      const width = parseFloat(boxStyle.width);
      const height = parseFloat(boxStyle.height);
      const depth = parseFloat(getComputedStyle(probe).width);
      if (drawn && isSameSize(drawn, width, height, depth)) return;
      drawn = drawDoorFrame(width, height, depth);
      setDrawing(drawn);
    }

    // The gold shows from progress 0.38: an idle moment comes long before. During a
    // resize drag, at most one drawing per idle moment.
    function schedule() {
      cancel();
      cancel = whenIdle(draw);
    }

    const observer = new ResizeObserver(schedule);
    observer.observe(box);
    return () => {
      observer.disconnect();
      cancel();
    };
  }, [isWanted]);

  return (
    <div ref={boxRef} className="hero__frame" aria-hidden="true">
      <span ref={depthRef} className="hero__frame-depth" />
      {drawing ? <FrameArt drawing={drawing} progress={progress} /> : null}
    </div>
  );
}

function FrameArt({
  drawing,
  progress,
}: {
  drawing: DoorFrameDrawing;
  progress: MotionValue<number>;
}) {
  const gradientId = `door-gold-${useId().replace(/[^\w-]/g, "")}`;
  const reveal = useTransform(progress, REVEAL_RANGE, [0, 1]);
  const lightX = useTransform(progress, LIGHT_RANGE, ["-100%", "560%"]);
  const fill = `url(#${gradientId})`;

  // The light's mask is only built once the scene nears it. Reduced motion pins
  // progress at 0, so it never is there.
  const [isLightWanted, setIsLightWanted] = useState(() => progress.get() > LIGHT_READY);
  useMotionValueEvent(progress, "change", (value) => {
    if (value > LIGHT_READY && !isLightWanted) setIsLightWanted(true);
  });
  const silhouetteUrl = useSilhouetteUrl(drawing, isLightWanted);

  return (
    <>
      <svg className="hero__frame-defs" width="0" height="0" focusable="false">
        <defs>
          <linearGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            x1={drawing.width}
            y1={0}
            x2={0}
            y2={drawing.height}
          >
            {LOGO_GOLD_STOPS.map((stop) => (
              <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
            ))}
          </linearGradient>
        </defs>
      </svg>

      {drawing.layers.map((layer, index) => (
        <FramePiece key={index} layer={layer} reveal={reveal} fill={fill} />
      ))}

      {/* A band of light crosses the gold once, masked by the frame's silhouette. */}
      {silhouetteUrl ? (
        <div
          className="hero__frame-light"
          style={{
            WebkitMaskImage: `url(${silhouetteUrl})`,
            maskImage: `url(${silhouetteUrl})`,
          }}
        >
          <div className="hero__frame-light-track">
            <m.div className="hero__frame-light-band" style={{ x: lightX }} />
          </div>
        </div>
      ) : null}
    </>
  );
}

function FramePiece({
  layer,
  reveal,
  fill,
}: {
  layer: FrameLayer;
  reveal: MotionValue<number>;
  fill: string;
}) {
  // The keystone first, where the logo's last arch was, then down the jambs.
  const opacity = useTransform(reveal, (value) =>
    clamp01((value * (1 + REVEAL_SOFTNESS) - (1 - layer.rise)) / REVEAL_SOFTNESS),
  );

  return (
    <m.div
      className="hero__frame-piece"
      style={{
        left: `${layer.x}px`,
        top: `${layer.y}px`,
        width: `${layer.width}px`,
        height: `${layer.height}px`,
        opacity,
      }}
    >
      <svg viewBox={`${layer.x} ${layer.y} ${layer.width} ${layer.height}`} focusable="false">
        <path className="hero__frame-under" d={layer.under} />
        <path d={layer.d} fill={fill} />
      </svg>
    </m.div>
  );
}

/** The silhouette as an object URL, for `mask-image`. Released with the drawing. */
function useSilhouetteUrl(drawing: DoorFrameDrawing, isEnabled: boolean) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    // Forced colours hide the light: no mask to build.
    if (!isEnabled || window.matchMedia("(forced-colors: active)").matches) return;
    const blob = new Blob([frameSilhouette(drawing)], { type: "image/svg+xml" });
    const next = URL.createObjectURL(blob);
    setUrl(next);
    return () => {
      URL.revokeObjectURL(next);
      setUrl(null);
    };
  }, [drawing, isEnabled]);

  return url;
}

/** Runs `task` when the main thread is free, or after `timeout` at the latest. Returns a cancel. */
function whenIdle(task: () => void) {
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(task, { timeout: IDLE_TIMEOUT });
    return () => window.cancelIdleCallback(id);
  }
  // Safari has no requestIdleCallback.
  const id = setTimeout(task, 120);
  return () => clearTimeout(id);
}

function isSameSize(drawing: DoorFrameDrawing, width: number, height: number, depth: number) {
  return (
    Math.abs(drawing.width - width) < 0.5 &&
    Math.abs(drawing.height - height) < 0.5 &&
    Math.abs(drawing.depth - depth) < 0.5
  );
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

/** The gold appears as the logo's arches pass the camera, done before the final text. */
const REVEAL_RANGE = [0.38, 0.72];
const REVEAL_SOFTNESS = 0.3;
/** Then the light, once the camera has stopped. Its mask is built a little before. */
const LIGHT_RANGE = [0.8, 1];
const LIGHT_READY = 0.6;
const IDLE_TIMEOUT = 300;
