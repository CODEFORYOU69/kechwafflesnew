"use client";

import Image from "next/image";
import { Reveal, Parallax } from "../Parallax";

type Ingredient = {
  origin: string;
  name: string;
  note: string;
  image: string;
};

const items: Ingredient[] = [
  {
    origin: "Belgique",
    name: "Chocolat Callebaut",
    note: "Le chocolat des grandes maisons. Sauces noir, lait, blanc préparées quotidiennement.",
    image: "/images/elements/chocolate.png",
  },
  {
    origin: "Sicile",
    name: "Pistache",
    note: "Crème pistache au goût franc, sélectionnée pour sa densité aromatique.",
    image: "/images/elements/pistachio.png",
  },
  {
    origin: "Italie",
    name: "Mascarpone",
    note: "Texture soyeuse, goût authentique. La base de notre tiramisu signature.",
    image: "/images/elements/almond.png",
  },
  {
    origin: "Belgique",
    name: "Spéculoos",
    note: "Le biscuit caramélisé incontournable. Crème lotus, éclats, inserts.",
    image: "/images/elements/speculoos.png",
  },
];

export function Ingredients() {
  return (
    <section className="relative overflow-hidden bg-[hsl(var(--bg))] py-32 md:py-48">
      {/* Floating decorative image */}
      <Parallax
        speed={0.7}
        className="pointer-events-none absolute -right-20 top-20 hidden h-[500px] w-[500px] md:block"
      >
        <Image
          src="/images/elements/wallpaper.png"
          alt=""
          fill
          className="object-contain opacity-[0.06]"
        />
      </Parallax>

      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10">
        <div className="mb-20 max-w-3xl">
          <Reveal>
            <p className="text-eyebrow mb-6 text-[hsl(var(--accent))]">
              — Provenances
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-section text-balance text-[hsl(var(--text))]">
              Des ingrédients
              <br />
              <span className="serif-italic text-[hsl(var(--text-muted))]">
                qui n&apos;ont pas de raccourci.
              </span>
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/5 md:grid-cols-2 md:gap-px lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={it.name} delay={i * 0.08}>
              <article className="group flex h-full flex-col gap-8 bg-[hsl(var(--bg))] p-8 md:p-10 transition-colors hover:bg-[hsl(var(--ink-900))]">
                <div className="relative h-32 w-full md:h-40">
                  <Image
                    src={it.image}
                    alt={it.name}
                    fill
                    className="object-contain transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-3">
                  <p className="text-eyebrow text-[hsl(var(--text-subtle))]">
                    {it.origin}
                  </p>
                  <h3 className="font-display text-2xl text-[hsl(var(--text))]">
                    {it.name}
                  </h3>
                  <p className="text-sm font-light leading-relaxed text-[hsl(var(--text-muted))]">
                    {it.note}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
