"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

type ParallaxProps = {
  children: ReactNode;
  /** 0 = static, 1 = scrolls with page. Typical 0.5-0.9 for background, 1.1-1.3 for foreground. */
  speed?: number;
  className?: string;
};

/**
 * Subtle vertical parallax via scroll progress.
 * Uses will-change/transform only; no layout thrash.
 */
export function Parallax({ children, speed = 0.85, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Translate range scales with speed delta
  const delta = (1 - speed) * 100;
  const y = useTransform(scrollYProgress, [0, 1], [`${-delta}%`, `${delta}%`]);

  return (
    <div ref={ref} className={className} style={{ overflow: "hidden" }}>
      <motion.div style={{ y, willChange: "transform" }}>{children}</motion.div>
    </div>
  );
}

/** Fade + rise on scroll-into-view. */
export function Reveal({
  children,
  delay = 0,
  y = 32,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
