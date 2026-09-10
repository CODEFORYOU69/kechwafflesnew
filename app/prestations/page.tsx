"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Parallax, Reveal } from "../components/Parallax";

const WHATSAPP =
  "https://wa.me/212709388431?text=Bonjour%20Kech%20Waffles%2C%20je%20souhaite%20un%20devis%20pour%20un%20corner%20gaufres.";

export default function Prestations() {
  return (
    <>
      <PrestationHero />
      <Principe />
      <Inclus />
      <Formats />
      <Deroule />
      <FinalCTA />
    </>
  );
}

function PrestationHero() {
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
          src="/images/story/innovation.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-60"
        />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[hsl(var(--ink-950))]/70 via-[hsl(var(--ink-950))]/30 to-[hsl(var(--ink-950))]" />

      <motion.div style={{ y: titleY }} className="mx-auto w-full max-w-[1440px]">
        <Reveal>
          <p className="text-eyebrow mb-8 text-[hsl(var(--accent))]">
            — Prestations · Corner live
          </p>
        </Reveal>
        <h1 className="text-hero max-w-5xl text-balance text-[hsl(var(--text))]">
          Le corner gaufres,
          <br />
          <span className="serif-italic text-[hsl(var(--accent))]">
            chez vous.
          </span>
        </h1>
        <Reveal delay={0.2}>
          <p className="mt-10 max-w-xl text-subhead text-[hsl(var(--text-muted))]">
            Mariages, anniversaires, soirées privées, ouvertures de boutique.
            On installe l&apos;atelier, on cuit devant vos invités, on repart
            sans laisser une trace.
          </p>
        </Reveal>
      </motion.div>
    </section>
  );
}

function Principe() {
  return (
    <section className="relative bg-[hsl(var(--bg))] py-32 md:py-48">
      <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-6 md:grid-cols-12 md:px-10">
        <div className="md:col-span-4">
          <Reveal>
            <p className="text-eyebrow text-[hsl(var(--accent))]">
              — Le principe
            </p>
          </Reveal>
        </div>
        <div className="md:col-span-8">
          <Reveal delay={0.1}>
            <h2 className="text-headline text-balance text-[hsl(var(--text))]">
              Un buffet froid, ça se subit. Une gaufre cuite à la minute, ça se
              regarde.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            <Reveal delay={0.15}>
              <p className="text-subhead text-[hsl(var(--text-muted))]">
                Notre stand à nos couleurs, les fers en fonte, la pâte pétrie
                le matin même dans notre laboratoire, et deux personnes en tenue
                qui travaillent sous les yeux de vos invités.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <p className="text-subhead text-[hsl(var(--text-muted))]">
                Personne ne mange une gaufre tiède sortie d&apos;un bac. Chacun
                choisit sa garniture, attend deux minutes devant le fer, et
                repart avec une gaufre encore caramélisée. C&apos;est
                l&apos;animation autant que le dessert.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

const inclusions: { n: string; title: string; note: string }[] = [
  {
    n: "01",
    title: "Le stand",
    note: "Notre installation à nos couleurs, montée sur place. Emprise réduite, elle se pose dans un coin de salle.",
  },
  {
    n: "02",
    title: "Les fers en fonte",
    note: "Gaufriers professionnels Liège et Bruxelles, plaque bubble waffle. Autonomie complète, un simple accès électrique.",
  },
  {
    n: "03",
    title: "Deux personnes en tenue",
    note: "On vient à deux, quel que soit le format : une aux fers, une au dressage et au service.",
  },
  {
    n: "04",
    title: "La barre à toppings",
    note: "Chocolat Callebaut, crème pistache de Sicile, spéculoos, mascarpone, fruits frais découpés sur place.",
  },
  {
    n: "05",
    title: "Le service complet",
    note: "Vaisselle, serviettes, consommables. Installation avant l'arrivée des invités, démontage et nettoyage après.",
  },
];

function Inclus() {
  return (
    <section className="relative overflow-hidden bg-[hsl(var(--ink-900))] py-32 md:py-40">
      <Parallax
        speed={0.7}
        className="pointer-events-none absolute -left-24 top-32 hidden h-[460px] w-[460px] md:block"
      >
        <Image
          src="/images/elements/wallpaper.png"
          alt=""
          fill
          className="object-contain opacity-[0.06]"
        />
      </Parallax>

      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10">
        <div className="mb-16 max-w-3xl md:mb-24">
          <Reveal>
            <p className="text-eyebrow mb-6 text-[hsl(var(--accent))]">
              — Ce qui est inclus
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-section text-balance text-[hsl(var(--text))]">
              Vous n&apos;avez rien à prévoir.
            </h2>
          </Reveal>
        </div>

        <div className="grid gap-x-16 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {inclusions.map((item, i) => (
            <Reveal key={item.n} delay={i * 0.08}>
              <div className="border-t border-white/10 pt-6">
                <span className="text-eyebrow text-[hsl(var(--accent))]">
                  {item.n}
                </span>
                <h3 className="text-headline mt-4 text-[hsl(var(--text))]">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm font-light leading-relaxed text-[hsl(var(--text-muted))]">
                  {item.note}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const formats: {
  name: string;
  size: string;
  lines: string[];
  image: string;
  featured?: boolean;
}[] = [
  {
    name: "Essentiel",
    size: "30 à 60 invités",
    lines: [
      "2 personnes, 2 fers en fonte",
      "Gaufre de Liège et de Bruxelles",
      "6 toppings au choix",
      "2 heures de service",
    ],
    image: "/images/menu-items/gauffresliegeoise.jpg",
  },
  {
    name: "Signature",
    size: "60 à 150 invités",
    lines: [
      "2 personnes, 3 fers en fonte",
      "Liège, Bruxelles, Bubble Waffle",
      "Barre à toppings complète",
      "Tiramisu Waffle en pièce signature",
      "3 heures de service",
    ],
    image: "/images/menu-items/bubbles.jpg",
    featured: true,
  },
  {
    name: "Sur-mesure",
    size: "150 invités et plus",
    lines: [
      "Matériel dimensionné avec vous",
      "Habillage à vos couleurs",
      "Création de recette exclusive",
      "Version salée : Pizza Waffle, brioches farcies",
      "Durée libre",
    ],
    image: "/images/story/gallery-8.jpg",
  },
];

function Formats() {
  return (
    <section className="relative bg-[hsl(var(--bg))] py-32 md:py-40">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10">
        <div className="mb-16 flex flex-col justify-between gap-8 md:mb-24 md:flex-row md:items-end">
          <div>
            <Reveal>
              <p className="text-eyebrow mb-6 text-[hsl(var(--accent))]">
                — Les formats
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-section text-balance text-[hsl(var(--text))]">
                Trois formats,
                <br />
                <span className="serif-italic text-[hsl(var(--accent))]">
                  une seule exigence.
                </span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <p className="max-w-xs text-sm font-light leading-relaxed text-[hsl(var(--text-subtle))]">
              Chaque prestation est chiffrée sur devis, selon le nombre
              d&apos;invités, la durée et le lieu.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {formats.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.1}>
              <article
                className={[
                  "group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border transition",
                  f.featured
                    ? "border-[hsl(var(--accent))]/40 bg-[hsl(var(--ink-900))]"
                    : "border-white/10 bg-[hsl(var(--ink-900))]/50 hover:border-white/20",
                ].join(" ")}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={f.image}
                    alt={`Format ${f.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--ink-950))]/80 to-transparent" />
                  {f.featured && (
                    <span className="absolute right-4 top-4 rounded-[var(--radius-full)] bg-[hsl(var(--accent))] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--ink-950))]">
                      Le plus demandé
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-8">
                  <h3 className="text-headline text-[hsl(var(--text))]">
                    {f.name}
                  </h3>
                  <p className="text-eyebrow mt-3 text-[hsl(var(--accent))]">
                    {f.size}
                  </p>
                  <ul className="mt-8 flex-1 space-y-3">
                    {f.lines.map((line) => (
                      <li
                        key={line}
                        className="flex items-start gap-3 text-sm font-light leading-relaxed text-[hsl(var(--text-muted))]"
                      >
                        <span className="mt-2 h-px w-4 flex-shrink-0 bg-[hsl(var(--accent))]" />
                        {line}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-8 text-eyebrow text-[hsl(var(--text-subtle))]">
                    Sur devis
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

const etapes: { n: string; title: string; note: string }[] = [
  {
    n: "01",
    title: "Le brief",
    note: "Un message WhatsApp suffit : date, lieu, nombre d'invités. On vous rappelle dans la journée.",
  },
  {
    n: "02",
    title: "Le devis",
    note: "Proposition chiffrée sous 48 h, avec le format recommandé et la sélection de recettes.",
  },
  {
    n: "03",
    title: "Le repérage",
    note: "Pour les grands formats, on passe voir le lieu : où installer le stand, l'accès, le point électrique.",
  },
  {
    n: "04",
    title: "Le jour J",
    note: "Installation deux heures avant. Service. Démontage. Vous ne touchez à rien.",
  },
];

function Deroule() {
  return (
    <section className="relative bg-[hsl(var(--ink-900))] py-32 md:py-40">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <div className="mb-16 max-w-3xl md:mb-24">
          <Reveal>
            <p className="text-eyebrow mb-6 text-[hsl(var(--accent))]">
              — Le déroulé
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-section text-balance text-[hsl(var(--text))]">
              De votre message
              <br />
              <span className="serif-italic text-[hsl(var(--accent))]">
                à la première gaufre.
              </span>
            </h2>
          </Reveal>
        </div>

        <div>
          {etapes.map((e, i) => (
            <Reveal key={e.n} delay={i * 0.08}>
              <div className="grid gap-6 border-t border-white/10 py-10 md:grid-cols-12 md:gap-12">
                <span className="text-eyebrow text-[hsl(var(--accent))] md:col-span-2">
                  {e.n}
                </span>
                <h3 className="text-headline text-[hsl(var(--text))] md:col-span-4">
                  {e.title}
                </h3>
                <p className="text-sm font-light leading-relaxed text-[hsl(var(--text-muted))] md:col-span-6">
                  {e.note}
                </p>
              </div>
            </Reveal>
          ))}
          <div className="border-t border-white/10" />
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative isolate min-h-[80vh] overflow-hidden bg-[hsl(var(--ink-950))]">
      <Parallax speed={0.8} className="absolute inset-0 -z-10">
        <div className="relative h-[130%] w-full">
          <Image
            src="/images/menu-items/crafles3chocolats.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-40"
          />
        </div>
      </Parallax>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[hsl(var(--ink-950))] via-[hsl(var(--ink-950))]/50 to-[hsl(var(--ink-950))]" />

      <div className="mx-auto flex min-h-[80vh] w-full max-w-[1440px] flex-col justify-center px-6 py-32 md:px-10">
        <Reveal>
          <p className="text-eyebrow mb-8 text-[hsl(var(--accent))]">
            — Parlons de votre date
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-hero max-w-4xl text-balance text-[hsl(var(--text))]">
            Dites-nous quand
            <span className="serif-italic text-[hsl(var(--accent))]">.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-10 max-w-md text-subhead text-[hsl(var(--text-muted))]">
            Réservation conseillée trois semaines à l&apos;avance. Marrakech et
            sa région, 7j/7.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-[var(--radius-full)] bg-[hsl(var(--accent))] px-7 py-3.5 text-sm font-medium text-[hsl(var(--ink-950))] transition hover:bg-[hsl(var(--accent-soft))]"
            >
              Demander un devis
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
            <Link
              href="/menu"
              className="inline-flex items-center gap-3 rounded-[var(--radius-full)] border border-white/15 px-7 py-3.5 text-sm font-light text-[hsl(var(--text))] transition hover:border-white/30 hover:bg-white/5"
            >
              Voir la carte
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
