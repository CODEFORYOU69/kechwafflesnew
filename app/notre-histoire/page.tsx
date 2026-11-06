import { MagneticButton } from "@/components/motion/MagneticButton";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { Reveal, RevealLines } from "@/components/motion/Reveal";
import { AI_CAFE, COFFEE, HERO, MENU_SECTION } from "@/lib/site-content";
import { clsx } from "clsx";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import styles from "./story.module.css";

/**
 * The story as four doors, each wider than the one before: a workshop that grew into a
 * counter. À VALIDER: only 2023 is dated, and the order of the chapters is a telling, not a known chronology.
 */
export default function NotreHistoirePage() {
  return (
    <>
      <StoryHero />
      <FourDoors />
      <Arcade />
      <Rules />
      <Coda />
    </>
  );
}

function StoryHero() {
  const photo = COFFEE.stationImages.back;

  return (
    <section className={styles.hero} aria-labelledby="story-title">
      <div className={clsx("kufic-grid", styles.heroGrid)} aria-hidden="true" />

      <div className={clsx("page-x", styles.heroStage)}>
        <div className={clsx("intro-fade", styles.heroMeta)} style={introDelay(0.1)}>
          <p className="text-eyebrow text-gold-400">{HERO_EYEBROW}</p>
          <p className="text-eyebrow text-cream-300">{HERO_SINCE}</p>
        </div>

        <h1 id="story-title" className={styles.heroTitle}>
          <span className={styles.heroBefore}>
            <span className="intro-line" style={lineStyle(0)}>
              <span>{HERO_BEFORE}</span>
            </span>
          </span>{" "}
          <span className={styles.heroAfter}>
            <span className="intro-line" style={lineStyle(1)}>
              <span className="serif-italic text-gold-400">{HERO_AFTER}</span>
            </span>
          </span>
        </h1>

        <p className={clsx("text-subhead intro-fade text-cream-200", styles.heroLead)} style={introDelay(0.5)}>
          {HERO_LEAD}
        </p>

        <div className={clsx("intro-fade", styles.heroDoor)} style={introDelay(0.25)}>
          <div className={clsx("frame-arch parallax-frame", styles.heroFrame)}>
            <ParallaxLayer strength={5}>
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                priority
                sizes="(min-width: 1024px) 28rem, 100vw"
                className="object-cover object-[center_22%]"
              />
            </ParallaxLayer>
          </div>
        </div>
      </div>
    </section>
  );
}

function FourDoors() {
  return (
    <section
      aria-labelledby="doors-title"
      className="section-rise section-pad bg-espresso-900 text-cream-50"
    >
      <div className="page-x">
        <Reveal>
          <p className="text-eyebrow text-gold-400">{DOORS_EYEBROW}</p>
        </Reveal>
        <RevealLines id="doors-title" lines={DOORS_LINES} className="text-section mt-6" />

        <ol className={styles.chapters}>
          {CHAPTERS.map((chapter, index) => (
            <li key={chapter.id} className={styles.chapter} data-chapter={index + 1}>
              <Reveal y={48} className={styles.chapterDoor}>
                <div className={clsx("frame-arch parallax-frame", styles.chapterFrame)}>
                  <ParallaxLayer strength={6}>
                    <Image
                      src={chapter.photo.src}
                      alt={chapter.photo.alt}
                      fill
                      sizes={chapter.sizes}
                      className="object-cover"
                      style={{ objectPosition: chapter.position }}
                    />
                  </ParallaxLayer>
                </div>
              </Reveal>

              <div className={styles.chapterCopy}>
                <Reveal>
                  <p className="text-eyebrow text-gold-400">
                    {String(index + 1).padStart(2, "0")} — {chapter.label}
                  </p>
                </Reveal>
                <Reveal delay={0.06}>
                  <h3 className={styles.chapterTitle}>{chapter.title}</h3>
                </Reveal>
                <Reveal delay={0.12}>
                  <p className="text-subhead mt-5 text-cream-200">{chapter.body}</p>
                </Reveal>
                {chapter.links ? (
                  <Reveal delay={0.18} className={styles.chapterLinks}>
                    {chapter.links.map((link) => (
                      <MagneticButton key={link.href}>
                        <Link href={link.href} className="cta cta--outline">
                          <span className="cta__label">{link.label}</span>
                        </Link>
                      </MagneticButton>
                    ))}
                  </Reveal>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** A row of identical arches, as in a riad's gallery: a swipe on the phone. */
function Arcade() {
  return (
    <section
      aria-labelledby="arcade-title"
      className="section-rise section-pad bg-cream-100 text-espresso-950 [&_:focus-visible]:outline-terracotta-700"
    >
      <div className={clsx("page-x", styles.arcadeHead)}>
        <Reveal>
          <p className="text-eyebrow text-terracotta-700">{ARCADE_EYEBROW}</p>
        </Reveal>
        <RevealLines id="arcade-title" lines={ARCADE_LINES} className="text-section" />
      </div>

      <Reveal y={40}>
        <ul className={clsx("no-scrollbar", styles.arcade)} tabIndex={0} aria-label={ARCADE_LABEL}>
          {ARCADE_ITEMS.map((item) => (
            <li key={item.src} className={styles.arch}>
              <figure>
                <div className={clsx("frame-arch", styles.archFrame)}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1440px) 320px, (min-width: 1024px) 23vw, (min-width: 640px) 57vw, 93vw"
                    className={clsx("object-cover", item.className)}
                    style={{ objectPosition: item.position }}
                  />
                </div>
                <figcaption className={clsx("text-eyebrow", styles.archCaption)}>{item.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

function Rules() {
  return (
    <section
      aria-labelledby="rules-title"
      className="section-rise section-pad bg-terracotta-700 text-cream-50"
    >
      <div className="page-x">
        <Reveal>
          <p className="text-eyebrow text-gold-200">{RULES_EYEBROW}</p>
        </Reveal>
        <RevealLines id="rules-title" lines={RULES_LINES} className="text-section mt-6" />

        <ol className={styles.rules}>
          {RULES.map((rule, index) => (
            <li key={rule.title} className={styles.rule}>
              <span className={clsx("text-eyebrow text-gold-200", styles.ruleIndex)} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <Reveal className={styles.ruleTitleSlot}>
                <h3 className="text-headline">{rule.title}</h3>
              </Reveal>
              <Reveal delay={0.08} className={styles.ruleBodySlot}>
                <p className="text-subhead">{rule.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Coda() {
  return (
    <section
      aria-labelledby="coda-title"
      className="section-rise section-pad bg-espresso-800 text-cream-50"
    >
      <div className={clsx("page-x", styles.coda)}>
        <RevealLines id="coda-title" lines={CODA_LINES} className={clsx("text-hero", styles.codaTitle)} />

        <div className={styles.codaCopy}>
          <Reveal>
            <p className="text-subhead text-cream-200">{MENU_SECTION.waffleNote}</p>
          </Reveal>
          <Reveal delay={0.1} className={styles.codaActions}>
            <MagneticButton>
              <Link href="/prestations" className="cta">
                <span className="cta__label">{MENU_SECTION.waffleCta}</span>
                <ArrowUpRight className="cta__arrow size-4" aria-hidden="true" />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link href="/menu" className="cta cta--outline">
                <span className="cta__label">{MENU_SECTION.menuCta}</span>
              </Link>
            </MagneticButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function introDelay(seconds: number) {
  return { "--intro-delay": `${seconds}s` } as CSSProperties;
}

function lineStyle(index: number) {
  return { "--line": index, "--intro-delay": "0.1s" } as CSSProperties;
}

function croffle(id: string) {
  const entry = MENU_SECTION.croffles.find((item) => item.id === id);
  if (!entry) throw new Error(`Unknown croffle: ${id}`);
  return entry;
}

const HERO_EYEBROW = "Notre histoire";
const HERO_SINCE = "Depuis 2023 · Marrakech";
const HERO_BEFORE = "Un atelier,";
const HERO_AFTER = "devenu comptoir.";
const HERO_LEAD =
  "Une conviction simple\u00A0: faire les choses bien prend du temps. Elle a commencé devant un fer. Elle continue derrière une machine à café.";

const DOORS_EYEBROW = "Quatre portes";
const DOORS_LINES = ["Quatre portes,", "une après l’autre."];

const CHAPTERS: Chapter[] = [
  {
    id: "atelier",
    label: "L’atelier",
    title: "Un atelier dédié à la gaufre, et rien d’autre.",
    body: "La pâte pétrie chaque matin, les ingrédients choisis un par un. Depuis 2023, à Marrakech, tout commence là.",
    photo: croffle("nature"),
    position: "68% 50%",
    sizes: "(min-width: 1440px) 500px, (min-width: 1024px) 35vw, 85vw",
  },
  {
    id: "fer",
    label: "Le fer",
    title: "Puis un croissant passe au fer.",
    body: "Des croissants passés au fer, feuilletés dedans et croustillants dehors\u00A0: les croffles, le croisement inattendu de la gaufre.",
    photo: croffle("caramel"),
    position: "60% 50%",
    sizes: "(min-width: 1440px) 500px, (min-width: 1024px) 35vw, 81vw",
  },
  {
    id: "comptoir",
    label: "Le comptoir",
    title: "Puis le café, pris au sérieux.",
    body: COFFEE.intro,
    photo: COFFEE.stationImages.side,
    position: "50% 72%",
    sizes: "(min-width: 1440px) 760px, (min-width: 1024px) 53vw, 100vw",
  },
  {
    id: "tables",
    label: "Les tables",
    title: HERO.finalTitle,
    body: "Les mardis et jeudis, le café est entièrement réservé aux filles\u00A0: Girls Only. Et le Café IA offre un cadre pour travailler, coder et échanger autour de l’IA, avec un service informatique pour les étudiants.",
    photo: COFFEE.stationImages.front,
    position: "50% 62%",
    sizes: "(min-width: 1440px) 1500px, (min-width: 1024px) 104vw, 196vw",
    links: [
      { href: "/girls-only", label: "Girls Only" },
      { href: "/cafe-ia", label: AI_CAFE.pageCta },
    ],
  },
];

const ARCADE_EYEBROW = "Aujourd’hui";
const ARCADE_LINES = ["Ce qu’on sert,", "en vrai."];
const ARCADE_LABEL = "Six photos de la carte et du comptoir, à faire défiler";

const ARCADE_ITEMS: ArcadeItem[] = [
  {
    src: croffle("trois-chocolats").src,
    alt: croffle("trois-chocolats").alt,
    caption: croffle("trois-chocolats").name,
    position: "50% 70%",
  },
  {
    src: "/images/site/latte-tray.jpg",
    alt: "Un latte et un espresso en verres double paroi, sur un plateau en bambou posé sur le comptoir noir",
    caption: "Latte et espresso",
    position: "50% 32%",
  },
  {
    src: croffle("coco").src,
    alt: croffle("coco").alt,
    caption: croffle("coco").name,
    position: "50% 40%",
  },
  {
    src: croffle("speculoos").src,
    alt: croffle("speculoos").alt,
    caption: croffle("speculoos").name,
    position: "50% 62%",
  },
  {
    src: croffle("oreo").src,
    alt: croffle("oreo").alt,
    caption: croffle("oreo").name,
    position: "42% 40%",
  },
  {
    src: croffle("fraise").src,
    alt: croffle("fraise").alt,
    caption: croffle("fraise").name,
    position: "50% 78%",
    // A cable runs along the top of this photo. In so narrow a frame `object-position`
    // cannot lose it: the image fills the height, so it is enlarged from the bottom.
    className: "origin-bottom scale-[1.32]",
  },
];

const RULES_EYEBROW = "Ce qui n’a pas bougé";
const RULES_LINES = ["L’atelier", "n’est jamais parti."];

const RULES = [
  {
    title: "Le fait maison",
    body: "Pâte, sauces, crèmes\u00A0: tout est préparé sur place. Aucun mix industriel, aucun additif superflu.",
  },
  {
    title: "L’ingrédient choisi",
    body: "Callebaut, mascarpone, pistache sélectionnée. On ne transige pas.",
  },
  {
    title: "La minute",
    body: "Les croffles à la minute, la tasse réglée jusqu’à ce qu’elle soit juste. Rien n’attend.",
  },
];

const CODA_LINES = ["Et les", "gaufres\u00A0?"];

type Chapter = {
  id: string;
  label: string;
  title: string;
  body: string;
  photo: { src: string; alt: string };
  position: string;
  sizes: string;
  links?: { href: string; label: string }[];
};

type ArcadeItem = {
  src: string;
  alt: string;
  caption: string;
  position: string;
  className?: string;
};
