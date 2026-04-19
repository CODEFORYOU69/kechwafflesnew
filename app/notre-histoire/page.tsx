"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Parallax, Reveal } from "../components/Parallax";

export default function NotreHistoire() {
  return (
    <>
      <StoryHero />
      <Intro />
      <Pillars />
      <Craft />
      <Gallery />
    </>
  );
}

function StoryHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[90vh] w-full flex-col justify-end overflow-hidden bg-[hsl(var(--ink-950))] px-6 pb-24 pt-40 md:px-10"
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10">
        <Image
          src="/images/story/hero-background.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[hsl(var(--ink-950))]/60 via-transparent to-[hsl(var(--ink-950))]" />

      <motion.div
        style={{ y: titleY }}
        className="mx-auto w-full max-w-[1440px]"
      >
        <Reveal>
          <p className="text-eyebrow mb-8 text-[hsl(var(--accent))]">
            — Chapitre I
          </p>
        </Reveal>
        <h1 className="text-hero max-w-5xl text-balance text-[hsl(var(--text))]">
          L&apos;histoire d&apos;un
          <br />
          <span className="serif-italic text-[hsl(var(--accent))]">
            atelier obstiné.
          </span>
        </h1>
      </motion.div>
    </section>
  );
}

function Intro() {
  return (
    <section className="relative bg-[hsl(var(--bg))] py-32 md:py-48">
      <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-6 md:grid-cols-12 md:px-10">
        <div className="md:col-span-3">
          <Reveal>
            <p className="text-eyebrow text-[hsl(var(--text-subtle))]">
              Depuis 2023 · Marrakech
            </p>
          </Reveal>
        </div>
        <div className="md:col-span-9">
          <Reveal delay={0.1}>
            <p className="text-section font-light text-balance text-[hsl(var(--text))]">
              Un atelier dédié à la gaufre — rien d&apos;autre. Pâte pétrie
              chaque matin. Ingrédients choisis un par un. Une conviction simple
              :{" "}
              <span className="serif-italic text-[hsl(var(--accent))]">
                faire les choses bien prend du temps.
              </span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Pillars() {
  const pillars = [
    {
      n: "I",
      title: "Le fait maison",
      body: "Pâte, sauces, crèmes : tout est préparé sur place. Aucun mix industriel. Aucun additif superflu.",
      image: "/images/story/origin.jpg",
    },
    {
      n: "II",
      title: "L'ingrédient noble",
      body: "Callebaut, mascarpone, pistache sélectionnée, mascarpone d'Italie. On ne transige pas.",
      image: "/images/story/quality.jpg",
    },
    {
      n: "III",
      title: "La cuisson minute",
      body: "Fer en fonte, température précise. Chaque gaufre cuit à la commande. Aucune attente en vitrine.",
      image: "/images/story/innovation.jpg",
    },
  ];

  return (
    <section className="bg-[hsl(var(--ink-900))] py-32 md:py-40">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10">
        <Reveal>
          <p className="text-eyebrow mb-12 text-[hsl(var(--accent))]">
            — Les trois règles
          </p>
        </Reveal>
        <div className="space-y-24 md:space-y-40">
          {pillars.map((p, i) => (
            <PillarRow key={p.n} pillar={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PillarRow({
  pillar,
  index,
}: {
  pillar: { n: string; title: string; body: string; image: string };
  index: number;
}) {
  const reverse = index % 2 === 1;
  return (
    <div
      className={[
        "grid items-center gap-10 md:grid-cols-12 md:gap-16",
      ].join(" ")}
    >
      <div className={reverse ? "md:order-2 md:col-span-6" : "md:col-span-6"}>
        <Parallax speed={0.9} className="relative aspect-[4/5] w-full">
          <Image
            src={pillar.image}
            alt={pillar.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </Parallax>
      </div>
      <div className={reverse ? "md:order-1 md:col-span-5" : "md:col-span-5 md:col-start-8"}>
        <Reveal>
          <p className="font-display text-6xl italic text-[hsl(var(--accent))]">
            {pillar.n}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h3 className="text-section mt-8 text-[hsl(var(--text))]">
            {pillar.title}
          </h3>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 text-subhead text-[hsl(var(--text-muted))]">
            {pillar.body}
          </p>
        </Reveal>
      </div>
    </div>
  );
}

function Craft() {
  const creations = [
    { name: "Pizza Waffle", desc: "Gaufre salée, base tomate ou crème, gratinée." },
    { name: "Potato Waffle", desc: "Pommes de terre, fromage fondant. Concept unique." },
    { name: "Bubble Waffle", desc: "La gaufre bulle revisitée, Hong Kong à Marrakech." },
    { name: "Tiramisu Waffle", desc: "Mascarpone, café, cacao Van Houten." },
    { name: "TiCanMisu", desc: "Tiramisu en canette, format nomade." },
    { name: "Crauffles & Croffles", desc: "Le croisement inattendu de la gaufre." },
  ];

  return (
    <section className="bg-[hsl(var(--bg))] py-32 md:py-48">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10">
        <div className="mb-16 max-w-4xl">
          <Reveal>
            <p className="text-eyebrow mb-6 text-[hsl(var(--accent))]">
              — Le répertoire
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-section text-balance text-[hsl(var(--text))]">
              Six créations pour dire
              <br />
              <span className="serif-italic text-[hsl(var(--text-muted))]">
                qui nous sommes.
              </span>
            </h2>
          </Reveal>
        </div>

        <ul className="divide-y divide-white/5 border-y border-white/5">
          {creations.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.05}>
              <li className="grid grid-cols-12 items-baseline gap-4 py-6 md:py-8">
                <span className="col-span-2 text-eyebrow text-[hsl(var(--text-subtle))]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="col-span-10 font-display text-3xl text-[hsl(var(--text))] md:col-span-5">
                  {c.name}
                </h3>
                <p className="col-span-12 text-sm font-light text-[hsl(var(--text-muted))] md:col-span-5 md:col-start-8">
                  {c.desc}
                </p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Gallery() {
  const images = [
    "/images/story/gallery-1.jpg",
    "/images/story/gallery-2.jpg",
    "/images/story/gallery-3.jpg",
    "/images/story/gallery-4.jpg",
    "/images/story/gallery-5.jpg",
    "/images/story/gallery-6.jpg",
  ];
  return (
    <section className="bg-[hsl(var(--ink-900))] py-32 md:py-40">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10">
        <Reveal>
          <p className="text-eyebrow mb-6 text-[hsl(var(--accent))]">
            — L&apos;atelier en images
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-section mb-16 text-[hsl(var(--text))]">
            Notre univers.
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {images.map((src, i) => (
            <GalleryTile key={src} src={src} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryTile({ src, index }: { src: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const aspect = index % 3 === 1 ? "aspect-[3/4]" : "aspect-[4/5]";
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden ${aspect}`}
    >
      <motion.div style={{ y }} className="absolute inset-0 scale-110">
        <Image
          src={src}
          alt=""
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover"
        />
      </motion.div>
    </motion.div>
  );
}
