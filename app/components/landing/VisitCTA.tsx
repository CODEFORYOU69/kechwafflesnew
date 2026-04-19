"use client";

import Image from "next/image";
import Link from "next/link";
import { Parallax, Reveal } from "../Parallax";

export function VisitCTA() {
  return (
    <section className="relative isolate min-h-[90vh] overflow-hidden bg-[hsl(var(--ink-950))]">
      {/* BG */}
      <Parallax speed={0.8} className="absolute inset-0 -z-10">
        <div className="relative h-[130%] w-full">
          <Image
            src="/images/story/gallery-3.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-60"
          />
        </div>
      </Parallax>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[hsl(var(--ink-950))] via-[hsl(var(--ink-950))]/40 to-[hsl(var(--ink-950))]" />

      <div className="mx-auto flex min-h-[90vh] w-full max-w-[1440px] flex-col justify-between px-6 py-32 md:px-10">
        <Reveal>
          <p className="text-eyebrow text-[hsl(var(--accent))]">— Venir</p>
        </Reveal>

        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-8 md:col-start-1">
            <Reveal>
              <h2 className="text-hero text-balance text-[hsl(var(--text))]">
                Al Badii,
                <br />
                <span className="serif-italic text-[hsl(var(--accent))]">
                  Marrakech.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-10 max-w-md text-subhead text-[hsl(var(--text-muted))]">
                MAG 33 AL BADII. À 15 min de Jemaa el-Fna. Ouvert 7j/7, des
                petits-déjeuners aux dîners.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-12 flex flex-wrap items-center gap-4">
                <Link
                  href="/location"
                  className="group inline-flex items-center gap-3 rounded-[var(--radius-full)] bg-[hsl(var(--accent))] px-7 py-3.5 text-sm font-medium text-[hsl(var(--ink-950))] transition hover:bg-[hsl(var(--accent-soft))]"
                >
                  Itinéraire
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <a
                  href="https://wa.me/212000000000"
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-3 rounded-[var(--radius-full)] border border-white/15 px-7 py-3.5 text-sm font-light text-[hsl(var(--text))] transition hover:border-white/30 hover:bg-white/5"
                >
                  WhatsApp
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.3} className="md:col-span-4 md:col-start-9">
            <dl className="space-y-8 border-t border-white/10 pt-8">
              <Row term="Lun – Jeu" desc="10h – 22h" />
              <Row term="Ven" desc="17h – 02h" />
              <Row term="Sam" desc="10h – 02h" />
              <Row term="Dim" desc="11h – 22h" />
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Row({ term, desc }: { term: string; desc: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/5 pb-3">
      <dt className="text-eyebrow text-[hsl(var(--text-subtle))]">{term}</dt>
      <dd className="font-display text-lg text-[hsl(var(--text))]">{desc}</dd>
    </div>
  );
}
