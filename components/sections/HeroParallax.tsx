"use client";

import {
  ARCH_ZOOM_END,
  AnimatedLogo,
  LOGO_ARCH_OPENING,
  LOGO_DOOR_ANCHOR,
} from "@/components/brand/AnimatedLogo";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { HERO, PILLARS } from "@/lib/site-content";
import {
  LazyMotion,
  cubicBezier,
  domMin,
  m,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useLenis } from "lenis/react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * A pinned scene: the logo comes apart and the camera goes through its arch, onto
 * the café behind. Nothing moves relative to the scroll, so it stays fluid with
 * native touch scrolling. The title and logo entrance are CSS and never wait for
 * hydration.
 */
export function HeroParallax() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const doorRef = useRef<HTMLDivElement>(null);

  const lenis = useLenis();
  const isReduced = useReducedMotion();
  const isReducedRef = useRef(isReduced);
  isReducedRef.current = isReduced;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  // Reduced motion: the logo stays at rest instead of following the scroll.
  const progress = useTransform(scrollYProgress, (value) => (isReducedRef.current ? 0 : value));

  // The photo is hidden at rest: it waits for the first paint, or for the first scroll.
  const [isPhotoWanted, setIsPhotoWanted] = useState(false);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setIsPhotoWanted(true), { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(() => setIsPhotoWanted(true), 1200);
    return () => clearTimeout(id);
  }, []);


  // Where the door sits, folded, inside the arch of the logo: measured, in pixels.
  const restX = useMotionValue(0);
  const restY = useMotionValue(0);
  const restScale = useMotionValue(0.08);

  useEffect(() => {
    const stage = stageRef.current;
    const logo = logoRef.current;
    const door = doorRef.current;
    if (!stage || !logo || !door) return;

    function measure() {
      if (!logo || !door) return;
      const anchorX = logo.offsetLeft + logo.offsetWidth * LOGO_DOOR_ANCHOR.x;
      const anchorY = logo.offsetTop + logo.offsetHeight * LOGO_DOOR_ANCHOR.y;
      restX.set(anchorX - (door.offsetLeft + door.offsetWidth / 2));
      restY.set(anchorY - (door.offsetTop + door.offsetHeight / 2));
      restScale.set(
        Math.min(
          (logo.offsetWidth * LOGO_ARCH_OPENING.width) / door.offsetWidth,
          (logo.offsetHeight * LOGO_ARCH_OPENING.height) / door.offsetHeight,
        ),
      );
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [restX, restY, restScale]);

  // One camera for the door and the arch: the door stays inside the arch's opening
  // until the arch has passed the camera.
  const camera = useTransform(progress, [0.02, 0.76], [0, 1], { ease: CAMERA_EASE });
  const doorScale = useTransform<number, number>(
    [camera, restScale],
    ([position, rest]) => zoomedScale(position, rest),
  );
  const doorX = useTransform<number, number>(
    [camera, restScale, restX],
    ([position, rest, x]) => x * (1 - travel(position, rest)),
  );
  const doorY = useTransform<number, number>(
    [camera, restScale, restY],
    ([position, rest, y]) => y * (1 - travel(position, rest)),
  );
  const doorOpacity = useTransform(progress, [0.015, 0.07], [0, 1]);
  const photoScale = useTransform(camera, [0, 1], [1.45, 1]);

  const archZoom = useTransform<number, number>(
    [camera, restScale],
    ([position, rest]) => zoomedScale(position, rest) / rest,
  );
  const archX = useTransform<number, number>(
    [camera, restScale, restX],
    ([position, rest, x]) => -x * travel(position, rest),
  );
  const archY = useTransform<number, number>(
    [camera, restScale, restY],
    ([position, rest, y]) => -y * travel(position, rest),
  );

  const openingOpacity = useTransform(progress, [0.1, 0.34], [1, 0]);
  const openingY = useTransform(progress, [0.1, 0.34], [0, -48]);

  const finalOpacity = useTransform(progress, [0.7, 0.88], [0, 1]);
  const finalY = useTransform(progress, [0.7, 0.88], [28, 0]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setIsPhotoWanted(true);
    const stage = stageRef.current;
    if (!stage) return;
    stage.dataset.final = value > 0.68 ? "on" : "off";
    // Without the scene the title simply scrolls away: the contact button waits for that.
    if (isReducedRef.current) stage.dataset.fab = value > 0.2 ? "show" : "hide";
  });

  // Past this point the logo is fully gone: let it stop costing anything.
  useMotionValueEvent(archZoom, "change", (zoom) => {
    const stage = stageRef.current;
    if (!stage) return;
    const isGone = zoom > ARCH_ZOOM_END;
    stage.dataset.phase = isGone ? "door" : "logo";
    stage.dataset.fab = isGone ? "show" : "hide";
  });

  // Tabbing reaches these links before the scene shows them: go to where they are visible.
  function showFinalPanel() {
    const section = sectionRef.current;
    if (!section || isReducedRef.current || scrollYProgress.get() > 0.88) return;
    const end = section.offsetTop + section.offsetHeight - window.innerHeight;
    if (lenis) lenis.scrollTo(end, { immediate: true, force: true });
    else window.scrollTo(0, end);
  }

  return (
    <LazyMotion features={domMin}>
      <section ref={sectionRef} className="hero" aria-labelledby="hero-title">
        <div ref={stageRef} className="hero__stage" data-phase="logo" data-fab="hide" data-final="off">
          <div className="hero__ground" aria-hidden="true">
            <div className="kufic-grid hero__grid" />
          </div>

          <m.div
            ref={doorRef}
            className="hero__door"
            style={{ x: doorX, y: doorY, scale: doorScale, opacity: doorOpacity }}
          >
            <div className="hero__door-glow" aria-hidden="true" />
            <div className="frame-arch hero__door-frame">
              <m.div className="hero__door-photo" style={{ scale: photoScale }}>
                {isPhotoWanted ? (
                  <Image
                    src="/images/site/facade-night.jpg"
                    alt={HERO.doorAlt}
                    fill
                    sizes="(min-width: 1024px) 44vw, 100vw"
                    loading="eager"
                    className="object-cover object-[center_38%]"
                  />
                ) : null}
              </m.div>
            </div>
          </m.div>

          <div ref={logoRef} className="hero__logo" role="img" aria-label="Logo Kech Waffles">
            <AnimatedLogo progress={progress} archZoom={archZoom} archX={archX} archY={archY} />
          </div>

          <m.div className="hero__opening" style={{ opacity: openingOpacity, y: openingY }}>
            <div className="hero__intro">
              <p className="text-eyebrow intro-fade text-gold-400" style={introDelay(0.5)}>
                {HERO.eyebrow}
              </p>
              <div className="intro-fade max-w-[23rem]" style={introDelay(0.7)}>
                <p className="hero__lead">{HERO.lead}</p>
                <p className="hero__cue" aria-hidden="true">
                  <span>{HERO.scrollCue}</span>
                  <span className="hero__cue-line" />
                </p>
              </div>
            </div>
            <h1 id="hero-title" className="hero__title">
              {HERO.titleLines.map((line, index) => (
                <span key={line} className="intro-line" style={lineStyle(index)}>
                  <span>{line}</span>
                </span>
              ))}
              <span className="sr-only">{HERO.titleSuffix}</span>
            </h1>
          </m.div>

          <m.div className="hero__scrim" style={{ opacity: finalOpacity }} aria-hidden="true" />

          <m.div
            className="hero__final"
            style={{ opacity: finalOpacity, y: finalY }}
            onFocusCapture={showFinalPanel}
          >
            <div className="hero__final-text">
              <p className="text-eyebrow text-gold-400">{HERO.finalEyebrow}</p>
              <p className="text-headline mt-4 text-balance text-cream-50">{HERO.finalTitle}</p>
              <p className="mt-3 hidden text-cream-200 lg:block">{HERO.finalNote}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <MagneticButton>
                  <Link href="/menu" className="cta">
                    <span className="cta__label">Voir la carte</span>
                    <ArrowUpRight className="cta__arrow size-4" aria-hidden="true" />
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <Link href="/location" className="cta cta--outline">
                    <span className="cta__label">Nous trouver</span>
                  </Link>
                </MagneticButton>
              </div>
            </div>

            <nav className="hero__index" aria-label="Au programme">
              <ol>
                {PILLARS.map((pillar) => (
                  <li key={pillar.href}>
                    <Link href={pillar.href} className="hero__index-link group">
                      <span className="hero__index-number text-eyebrow text-gold-400">
                        {pillar.index}
                      </span>
                      <span className="hero__index-label hidden lg:inline">{pillar.label}</span>
                      <span className="hero__index-label lg:hidden">{pillar.short}</span>
                      <ArrowDownRight
                        className="hero__index-arrow size-4 text-gold-400 transition-transform duration-300 ease-soft group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
}

/** Scale of the door for a camera position: exponential, so it reads as a constant speed. */
function zoomedScale(position: number, restScale: number) {
  return Math.pow(restScale, 1 - position);
}

/** Share of its way the door has travelled: tied to its scale, so it lands as it reaches full size. */
function travel(position: number, restScale: number) {
  return (zoomedScale(position, restScale) - restScale) / (1 - restScale);
}

function introDelay(seconds: number) {
  return { "--intro-delay": `${seconds}s` } as CSSProperties;
}

function lineStyle(index: number) {
  return { "--line": index, "--intro-delay": "0.15s" } as CSSProperties;
}

const CAMERA_EASE = cubicBezier(0.5, 0, 0.3, 1);
