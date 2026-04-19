"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Parallax, Reveal } from "../components/Parallax";

type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  story: string;
  details: string[];
  image: string;
};

const products: Product[] = [
  {
    id: "ticanmisu",
    name: "TiCanMisu",
    tagline: "Le tiramisu, en canette.",
    description:
      "Notre tiramisu signature, conditionné frais en canette hermétique. Mascarpone, café, biscuits imbibés — et plusieurs déclinaisons exclusives.",
    story:
      "Préparé à la main, chaque couche est assemblée avec précision. Dubai Chocolate, Amlou, Spéculoos — chaque canette raconte une version différente de l'original.",
    details: [
      "Préparation quotidienne",
      "Mascarpone premium",
      "Plusieurs saveurs",
      "Format nomade",
    ],
    image: "/images/menu-items/ticandaim.png",
  },
  {
    id: "pizza-waffle",
    name: "Pizza Waffle",
    tagline: "L'Italie rencontre la Belgique.",
    description:
      "Une gaufre salée maison — fromages fondus, herbes, lardons — garnie comme une pizza et gratinée au four. Base tomate ou crème, garnitures au choix.",
    story:
      "L'audace sucrée-salée réinventée. Une texture croustillante, un cœur filant, une générosité qui ne ressemble à rien d'autre.",
    details: [
      "Base tomate ou crème",
      "Garnitures au choix",
      "Gratinée minute",
      "Concept signature",
    ],
    image: "/images/menu-items/wafflepizza.png",
  },
];

export default function ProductPage() {
  return (
    <>
      <ProductHero />
      <div className="bg-[hsl(var(--bg))]">
        {products.map((p, i) => (
          <ProductShowcase key={p.id} product={p} index={i} />
        ))}
      </div>
      <ProductCTA />
    </>
  );
}

function ProductHero() {
  return (
    <section className="relative flex min-h-[70vh] items-end bg-[hsl(var(--ink-950))] px-6 pb-20 pt-40 md:px-10">
      <div className="mx-auto w-full max-w-[1440px]">
        <Reveal>
          <p className="text-eyebrow mb-8 text-[hsl(var(--accent))]">
            — Collection signature
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="text-hero text-balance text-[hsl(var(--text))]">
            Produits d&apos;atelier,
            <br />
            <span className="serif-italic text-[hsl(var(--accent))]">
              éditions limitées.
            </span>
          </h1>
        </Reveal>
        <Reveal delay={0.25}>
          <p className="mt-10 max-w-2xl text-subhead text-[hsl(var(--text-muted))]">
            Deux créations exclusives. Fabriquées sur place, servies fraîches,
            pensées pour rester en tête.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function ProductShowcase({ product, index }: { product: Product; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 1.05]);

  const reverse = index % 2 === 1;

  return (
    <section
      ref={ref}
      className="relative border-t border-white/5 py-32 md:py-48"
    >
      <div className="mx-auto grid w-full max-w-[1440px] items-center gap-12 px-6 md:grid-cols-12 md:gap-16 md:px-10">
        {/* Image */}
        <div className={reverse ? "md:order-2 md:col-span-7" : "md:col-span-7"}>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-lg)] bg-[hsl(var(--ink-900))] md:aspect-[5/4]">
            <motion.div
              style={{ y: imgY, scale: imgScale }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-contain p-8 md:p-16"
              />
            </motion.div>
            {/* ambient glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--accent)/0.12),transparent_70%)]" />
          </div>
        </div>

        {/* Copy */}
        <div className={reverse ? "md:order-1 md:col-span-5" : "md:col-span-5 md:col-start-8"}>
          <Reveal>
            <p className="text-eyebrow text-[hsl(var(--text-subtle))]">
              {String(index + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-section mt-6 text-[hsl(var(--text))]">
              {product.name}
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="serif-italic mt-4 text-2xl text-[hsl(var(--accent))]">
              {product.tagline}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 text-subhead text-[hsl(var(--text-muted))]">
              {product.description}
            </p>
          </Reveal>
          <Reveal delay={0.28}>
            <p className="mt-4 text-[15px] font-light leading-relaxed text-[hsl(var(--text-subtle))]">
              {product.story}
            </p>
          </Reveal>

          <Reveal delay={0.35}>
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/5 pt-8">
              {product.details.map((d, i) => (
                <div key={d} className="flex items-baseline gap-2">
                  <span className="text-eyebrow text-[hsl(var(--text-subtle))]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-light text-[hsl(var(--text-muted))]">
                    {d}
                  </span>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.42}>
            <Link
              href="/menu"
              className="group mt-10 inline-flex items-center gap-3 rounded-[var(--radius-full)] border border-white/15 px-6 py-3 text-sm text-[hsl(var(--text))] transition hover:border-[hsl(var(--accent))] hover:bg-[hsl(var(--accent)/0.08)] hover:text-[hsl(var(--accent))]"
            >
              Voir sur la carte
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ProductCTA() {
  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-[hsl(var(--ink-900))] py-32 md:py-40">
      <Parallax speed={0.7} className="pointer-events-none absolute inset-0 -z-10">
        <div className="relative h-full w-full opacity-40">
          <Image
            src="/images/story/gallery-5.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </Parallax>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[hsl(var(--ink-900))]/60 via-[hsl(var(--ink-900))]/80 to-[hsl(var(--ink-900))]" />

      <div className="mx-auto w-full max-w-[1440px] px-6 text-center md:px-10">
        <Reveal>
          <p className="text-eyebrow mb-6 text-[hsl(var(--accent))]">
            — L&apos;essentiel
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-hero text-balance text-[hsl(var(--text))]">
            À tester,
            <br />
            <span className="serif-italic text-[hsl(var(--accent))]">
              à partager.
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <Link
            href="/menu"
            className="group mt-12 inline-flex items-center gap-3 rounded-[var(--radius-full)] bg-[hsl(var(--accent))] px-8 py-4 text-sm font-medium text-[hsl(var(--ink-950))] transition hover:bg-[hsl(var(--accent-soft))]"
          >
            Explorer la carte complète
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
