"use client";

import {
  LazyMotion,
  domMin,
  m,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from "react";
import styles from "./MenuGrid.module.css";

/**
 * The server sends a native scroll-snap rail, usable without JavaScript. On a desktop
 * with a mouse and motion allowed, the same DOM turns into a pinned scene: the scene
 * grows by what overflows the screen, and each pixel scrolled moves the rail one pixel.
 */
export function CroffleRail({
  intro,
  label,
  children,
}: {
  /** The title panel: lags behind the rail, so the first arches slide over it. */
  intro: ReactNode;
  label: string;
  children: ReactNode;
}) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const photosRef = useRef<RailPhoto[]>([]);
  const stageWidthRef = useRef(0);

  const isPinned = useSyncExternalStore(subscribeToPinQuery, matchesPinQuery, isNeverPinned);

  const progress = useMotionValue(0);
  const travel = useMotionValue(0);
  const x = useTransform<number, number>(
    [progress, travel],
    ([position, distance]) => -position * distance,
  );
  const introX = useTransform(x, (value) => value * -INTRO_LAG);

  useMotionValueEvent(x, "change", (railX) => {
    driftPhotos(photosRef.current, stageWidthRef.current, railX);
  });

  // Before paint: the height of the page must never be seen changing.
  useLayoutEffect(() => {
    const scene = sceneRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!scene || !stage || !track) return;

    // Here and not in the cleanup: `x` only listens again once the effects have rerun.
    if (!isPinned) {
      progress.set(0);
      travel.set(0);
      return;
    }

    const photos = Array.from(track.querySelectorAll<HTMLElement>("[data-rail-photo]"));

    const measure = () => {
      const distance = Math.max(0, track.offsetWidth - stage.clientWidth);
      const trackLeft = track.getBoundingClientRect().left;

      travel.set(distance);
      scene.style.height = `${distance + stage.offsetHeight}px`;

      stageWidthRef.current = stage.clientWidth;
      photosRef.current = photos.map((element) => {
        const box = (element.parentElement ?? element).getBoundingClientRect();
        return { element, center: box.left - trackLeft + box.width / 2 };
      });
      // The scene changed size under the reader: the rail follows without waiting for a scroll.
      if (distance > 0) {
        progress.set(Math.min(1, Math.max(0, -scene.getBoundingClientRect().top / distance)));
      }
      driftPhotos(photosRef.current, stage.clientWidth, x.get());
    };

    const wasPast = scene.getBoundingClientRect().bottom <= 0;
    const heightBefore = scene.offsetHeight;
    measure();
    // Safari has no scroll anchoring: a reader already past the scene must not be thrown back.
    if (wasPast && !CSS.supports("overflow-anchor: auto")) {
      window.scrollBy(0, scene.offsetHeight - heightBefore);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    observer.observe(track);

    return () => {
      observer.disconnect();
      scene.style.removeProperty("height");
      for (const element of photos) element.style.removeProperty("transform");
      photosRef.current = [];
    };
  }, [isPinned, progress, travel, x]);

  // A clipped image counts as off-screen: left lazy, each one would pop in during the pass.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        scene.querySelectorAll("img").forEach((image) => {
          image.loading = "eager";
        });
        observer.disconnect();
      },
      { rootMargin: "100% 0px" },
    );
    observer.observe(scene);
    return () => observer.disconnect();
  }, []);

  return (
    <LazyMotion features={domMin}>
      <div
        ref={sceneRef}
        className={styles.scene}
        data-mode={isPinned ? "pinned" : "native"}
        data-rail-scene=""
      >
        <div
          ref={stageRef}
          className={`${styles.stage} no-scrollbar`}
          role="region"
          aria-label={label}
          tabIndex={isPinned ? undefined : 0}
          data-lenis-prevent-horizontal={isPinned ? undefined : ""}
        >
          <m.div ref={trackRef} className={styles.track} style={{ x }}>
            <m.div className={styles.intro} style={{ x: introX }}>
              {intro}
            </m.div>
            {children}
          </m.div>

          {isPinned ? <SceneProgress sceneRef={sceneRef} progress={progress} /> : null}
        </div>
      </div>
    </LazyMotion>
  );
}

/**
 * Rendered only when pinned, so that the native rail runs no scroll script at all. Follows
 * the scroll, feeds the rail, and draws the line along the bottom of the stage.
 */
function SceneProgress({
  sceneRef,
  progress,
}: {
  sceneRef: RefObject<HTMLDivElement | null>;
  progress: MotionValue<number>;
}) {
  // Not in a layout effect: on a client navigation it would run before the parent's ref is set.
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"],
    layoutEffect: false,
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => progress.set(value));

  return <m.div className={styles.progress} style={{ scaleX: scrollYProgress }} aria-hidden="true" />;
}

/** Each photo lags inside its frame, by how far its frame is from the middle of the stage. */
function driftPhotos(photos: RailPhoto[], stageWidth: number, railX: number) {
  if (!stageWidth) return;
  for (const { element, center } of photos) {
    const fromMiddle = (center + railX - stageWidth / 2) / stageWidth;
    const drift = Math.max(-PHOTO_DRIFT, Math.min(PHOTO_DRIFT, -fromMiddle * PHOTO_DRIFT * 2));
    element.style.transform = `translate3d(${drift.toFixed(2)}%, 0, 0)`;
  }
}

function subscribeToPinQuery(onChange: () => void) {
  const query = window.matchMedia(PIN_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function matchesPinQuery() {
  return window.matchMedia(PIN_QUERY).matches;
}

function isNeverPinned() {
  return false;
}

const PIN_QUERY =
  "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/** Share of the rail's travel the title panel gives back. */
const INTRO_LAG = 0.3;

/** Peak drift of a photo inside its frame, in % of the photo's width. */
const PHOTO_DRIFT = 6;

type RailPhoto = {
  element: HTMLElement;
  /** Middle of the photo's frame, from the start of the track, in pixels. */
  center: number;
};
