"use client";

import Image from "next/image";
import Link from "next/link";
import { Parallax, Reveal } from "../Parallax";

const highlights: { k: string; v: string }[] = [
  { k: "Cuisson", v: "À la minute, devant vos invités" },
  { k: "Format", v: "Dès 30 personnes" },
  { k: "Zone", v: "Marrakech et sa région" },
];

export function Prestations() {
  return (
    <section className="relative overflow-hidden bg-[hsl(var(--ink-900))] py-32 md:py-48">
      <div className="mx-auto grid w-full max-w-[1440px] gap-16 px-6 md:grid-cols-12 md:px-10">
        {/* Image column */}
        <div className="md:col-span-5 md:col-start-1">
          <Parallax speed={0.88} className="relative aspect-[3/4] w-full">
            <Image
              src="/images/menu-items/crafles3chocolats.jpg"
              alt="Corner Kech Waffles installé en événement"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
          </Parallax>
          <Reveal delay={0.3}>
            <div className="mt-6 flex items-baseline gap-4 text-[hsl(var(--text-subtle))]">
              <span className="text-eyebrow">Le corner en service</span>
            </div>
          </Reveal>
        </div>

        {/* Copy column */}
        <div className="md:col-span-6 md:col-start-7">
          <Reveal>
            <p className="text-eyebrow mb-8 text-[hsl(var(--accent))]">
              — Prestations
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="text-section text-balance text-[hsl(var(--text))]">
              Votre événement,{" "}
              <span className="serif-italic text-[hsl(var(--accent))]">
                notre corner live
              </span>
              .
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-10 max-w-lg text-subhead text-[hsl(var(--text-muted))]">
              On déplace l&apos;atelier chez vous. Fers en fonte, pâte pétrie le
              matin même, barre à toppings montée sur place. Vos invités
              regardent la gaufre naître et la mangent brûlante.
            </p>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="hairline mt-14" />
          </Reveal>

          <dl className="mt-10 space-y-6">
            {highlights.map((h, i) => (
              <Reveal key={h.k} delay={0.3 + i * 0.08}>
                <div className="flex items-baseline justify-between gap-8 border-b border-white/5 pb-5">
                  <dt className="text-eyebrow text-[hsl(var(--text-subtle))]">
                    {h.k}
                  </dt>
                  <dd className="text-right text-sm font-light text-[hsl(var(--text-muted))]">
                    {h.v}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>

          <Reveal delay={0.5}>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <Link
                href="/prestations"
                className="group inline-flex items-center gap-3 rounded-[var(--radius-full)] bg-[hsl(var(--accent))] px-7 py-3.5 text-sm font-medium text-[hsl(var(--ink-950))] transition hover:bg-[hsl(var(--accent-soft))]"
              >
                Découvrir la prestation
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <a
                href="https://wa.me/212709388431?text=Bonjour%20Kech%20Waffles%2C%20je%20souhaite%20un%20devis%20pour%20un%20corner%20gaufres."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-[var(--radius-full)] border border-white/15 px-7 py-3.5 text-sm font-light text-[hsl(var(--text))] transition hover:border-white/30 hover:bg-white/5"
              >
                Demander un devis
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
