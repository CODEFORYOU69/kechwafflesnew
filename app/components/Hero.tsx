"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax layers
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const overlay = useTransform(scrollYProgress, [0, 1], [0.45, 0.8]);

  return (
    <section
      ref={ref}
      className="relative isolate min-h-[110vh] w-full overflow-hidden bg-[hsl(var(--ink-950))]"
    >
      {/* Background image with parallax */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 -z-10"
      >
        <Image
          src="/images/story/hero-background.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Gradient veil */}
      <motion.div
        style={{ opacity: overlay }}
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[hsl(var(--ink-950))]/50 via-[hsl(var(--ink-950))]/40 to-[hsl(var(--ink-950))]"
      />

      {/* Content */}
      <div className="relative flex min-h-screen flex-col justify-between px-6 pb-10 pt-32 md:px-10 md:pt-36">
        {/* Top meta row with logo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex w-full max-w-[1440px] items-center justify-between"
        >
          <span className="text-eyebrow text-[hsl(var(--text-subtle))]">
            Marrakech · Est. 2023
          </span>
          <span className="hidden text-eyebrow text-[hsl(var(--text-subtle))] md:inline">
            Atelier nº 001
          </span>
        </motion.div>

        {/* Main title block */}
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="mx-auto w-full max-w-[1440px]"
        >
          <div className="max-w-[1200px]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mb-10 md:mb-14"
            >
              <Image
                src="/images/menu-items/TransparentWhite.png"
                alt="Kech Waffles"
                width={520}
                height={180}
                priority
                className="h-20 w-auto object-contain md:h-28 lg:h-32"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-eyebrow mb-8 text-[hsl(var(--accent))]"
            >
              — L&apos;atelier des gaufres artisanales
            </motion.p>

            <h1 className="text-hero text-balance text-[hsl(var(--text))]">
              <MaskedLine text="Une gaufre" delay={0.4} />
              <br />
              <MaskedLine
                text="comme il se doit."
                delay={0.6}
                italic
                accent
              />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 max-w-xl text-subhead text-[hsl(var(--text-muted))]"
            >
              Pâtes pétries chaque matin. Chocolat Callebaut, pistache premium,
              mascarpone maison. Cuisson minute, saveurs sans compromis.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/menu"
                className="group inline-flex items-center gap-3 rounded-[var(--radius-full)] bg-[hsl(var(--accent))] px-7 py-3.5 text-sm font-medium text-[hsl(var(--ink-950))] transition hover:bg-[hsl(var(--accent-soft))]"
              >
                Découvrir la carte
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <Link
                href="/notre-histoire"
                className="group inline-flex items-center gap-3 rounded-[var(--radius-full)] border border-white/15 px-7 py-3.5 text-sm font-light text-[hsl(var(--text))] transition hover:border-white/30 hover:bg-white/5"
              >
                Notre histoire
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mx-auto mt-16 flex w-full max-w-[1440px] items-end justify-between"
        >
          <div className="hidden max-w-xs text-sm font-light text-[hsl(var(--text-subtle))] md:block">
            Dans le cœur d&apos;Al Badii, un atelier dédié à la gaufre — sucrée,
            salée, signature.
          </div>
          <div className="flex items-center gap-3 text-eyebrow text-[hsl(var(--text-subtle))]">
            <span>Défiler</span>
            <motion.span
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="block h-5 w-px bg-[hsl(var(--text-subtle))]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MaskedLine({
  text,
  delay = 0,
  italic = false,
  accent = false,
}: {
  text: string;
  delay?: number;
  italic?: boolean;
  accent?: boolean;
}) {
  return (
    <span
      className={[
        "relative inline-block overflow-hidden align-top",
        italic ? "serif-italic" : "font-display",
        accent ? "text-[hsl(var(--accent))]" : "",
      ].join(" ")}
    >
      <motion.span
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
        className="inline-block"
      >
        {text}
      </motion.span>
    </span>
  );
}
