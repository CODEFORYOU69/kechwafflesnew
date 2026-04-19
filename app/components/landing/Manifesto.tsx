"use client";

import { Reveal, Parallax } from "../Parallax";
import Image from "next/image";

export function Manifesto() {
  return (
    <section className="relative overflow-hidden bg-[hsl(var(--bg))] py-32 md:py-48">
      <div className="mx-auto grid w-full max-w-[1440px] gap-16 px-6 md:grid-cols-12 md:px-10">
        {/* Copy column */}
        <div className="md:col-span-7 md:col-start-1">
          <Reveal>
            <p className="text-eyebrow mb-8 text-[hsl(var(--accent))]">
              — Le manifeste
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="text-section text-balance text-[hsl(var(--text))]">
              Nous refusons <span className="serif-italic text-[hsl(var(--accent))]">le raccourci</span>.
              Chaque gaufre est un geste, pas un produit.
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="hairline mt-16" />
          </Reveal>

          <div className="mt-16 grid gap-12 md:grid-cols-2">
            <Reveal delay={0.15}>
              <p className="text-subhead text-[hsl(var(--text-muted))]">
                Pâtes pétries chaque matin dans notre laboratoire. Chocolat
                Callebaut professionnel. Crème pistache d&apos;exception.
                Mascarpone pour le tiramisu. Jamais de mix industriel.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <p className="text-subhead text-[hsl(var(--text-muted))]">
                Une cuisson à la minute, dans nos fers en fonte. Un fini
                caramélisé qui ne s&apos;improvise pas. La seule règle : servir
                la gaufre comme si c&apos;était la nôtre.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Image column with parallax */}
        <div className="md:col-span-5 md:col-start-8">
          <Parallax speed={0.85} className="relative aspect-[3/4] w-full">
            <Image
              src="/images/story/quality.jpg"
              alt="Atelier Kech Waffles"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
          </Parallax>
          <Reveal delay={0.3}>
            <div className="mt-6 flex items-baseline gap-4 text-[hsl(var(--text-subtle))]">
              <span className="text-eyebrow">01 / Le geste</span>
              <span className="h-px flex-1 bg-white/10" />
              <span className="font-display text-sm italic">
                Marrakech, Al Badii
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
