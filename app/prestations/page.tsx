import { MagneticButton } from "@/components/motion/MagneticButton";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { Reveal, RevealLines } from "@/components/motion/Reveal";
import { EVENTS_SECTION, whatsappUrl } from "@/lib/site-content";
import { clsx } from "clsx";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, type CSSProperties } from "react";
import styles from "./prestations.module.css";

/**
 * The only home of the traditional waffles. The waffle iron's grid runs through the
 * page: each format is measured in its cells, and the page ends on a golden waffle.
 */
export default function PrestationsPage() {
  return (
    <>
      <PrestationsHero />
      <Principle />
      <Included />
      <Formats />
      <Steps />
      <FinalCall />
    </>
  );
}

function PrestationsHero() {
  const photo = EVENTS_SECTION.images.main;

  return (
    <section className={styles.hero} aria-labelledby="prestations-title">
      <div className={styles.heroWaffle} aria-hidden="true" />

      <div className={clsx("page-x", styles.heroStage)}>
        <div className={styles.heroCopy}>
          <p className="text-eyebrow intro-fade text-gold-400" style={introDelay(0.1)}>
            {EVENTS_SECTION.eyebrow} · {HERO_TAG}
          </p>

          <h1 id="prestations-title" className={clsx("text-hero text-cream-50", styles.heroTitle)}>
            {EVENTS_SECTION.titleLines.map((line, index) => (
              <Fragment key={line}>
                <span className="intro-line" style={lineStyle(index)}>
                  <span>{line}</span>
                </span>{" "}
              </Fragment>
            ))}
          </h1>

          <div className={clsx("intro-fade", styles.heroFoot)} style={introDelay(0.5)}>
            <p className="text-subhead max-w-[32rem] text-cream-200">{EVENTS_SECTION.intro}</p>
            <div className={styles.actions}>
              <MagneticButton>
                <a
                  href={whatsappUrl(EVENTS_SECTION.quoteMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta"
                >
                  <span className="cta__label">{EVENTS_SECTION.secondaryCta}</span>
                  <ArrowUpRight className="cta__arrow size-4" aria-hidden="true" />
                </a>
              </MagneticButton>
              <MagneticButton>
                <a href="#formats" className="cta cta--outline">
                  <span className="cta__label">{FORMATS_LINK}</span>
                </a>
              </MagneticButton>
            </div>
          </div>
        </div>

        <div className={clsx("intro-fade", styles.heroDoor)} style={introDelay(0.25)}>
          <div className={clsx("frame-arch parallax-frame", styles.heroFrame)}>
            <ParallaxLayer strength={5}>
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                priority
                sizes="(min-width: 1440px) 620px, (min-width: 1024px) 43vw, 115vw"
                className="object-cover object-[center_56%]"
              />
            </ParallaxLayer>
          </div>
        </div>
      </div>
    </section>
  );
}

function Principle() {
  const photo = EVENTS_SECTION.images.side;

  return (
    <section
      aria-labelledby="principle-title"
      className="section-rise section-pad bg-cream-100 text-espresso-950"
    >
      <div className={clsx("page-x", styles.principle)}>
        <Reveal className={styles.principleEyebrow}>
          <p className="text-eyebrow text-terracotta-700">{PRINCIPLE_EYEBROW}</p>
        </Reveal>

        <RevealLines
          id="principle-title"
          className={clsx("text-section", styles.principleTitle)}
          lines={[
            <span key="cold" className="text-espresso-600">
              {PRINCIPLE_COLD}
            </span>,
            <span key="hot" className="serif-italic text-terracotta-700">
              {PRINCIPLE_HOT}
            </span>,
          ]}
        />

        <Reveal y={48} className={styles.principleDoor}>
          <div className={clsx("frame-arch parallax-frame", styles.principleFrame)}>
            <ParallaxLayer strength={6}>
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1440px) 1090px, (min-width: 1024px) 76vw, 141vw"
                className="object-cover object-[78%_50%]"
              />
            </ParallaxLayer>
          </div>
        </Reveal>

        <div className={styles.principleCopy}>
          {PRINCIPLE_PARAGRAPHS.map((paragraph, index) => (
            <Reveal key={paragraph} delay={index * 0.08}>
              <p className="text-subhead">{paragraph}</p>
            </Reveal>
          ))}

          <Reveal delay={0.16}>
            <dl className={styles.highlights}>
              {EVENTS_SECTION.highlights.map((highlight) => (
                <div key={highlight.label} className={styles.highlight}>
                  <dt className="text-eyebrow text-terracotta-700">{highlight.label}</dt>
                  <dd className={styles.highlightValue}>{highlight.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Included() {
  return (
    <section
      aria-labelledby="included-title"
      className="section-rise section-pad bg-espresso-900 text-cream-50"
    >
      <div className={clsx("page-x", styles.included)}>
        <div className={styles.includedHead}>
          <Reveal>
            <p className="text-eyebrow text-gold-400">{INCLUDED_EYEBROW}</p>
          </Reveal>
          <RevealLines id="included-title" lines={INCLUDED_LINES} className="text-section mt-6" />
        </div>

        <ol className={styles.includedList}>
          {INCLUSIONS.map((item, index) => (
            <li key={item.title} className={styles.includedItem}>
              <Reveal>
                <span className="text-eyebrow text-gold-400" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-headline mt-3">{item.title}</h3>
                <p className="mt-3 max-w-[38rem] leading-relaxed text-cream-200">{item.note}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Formats() {
  return (
    <section
      id="formats"
      aria-labelledby="formats-title"
      className="section-rise section-pad bg-espresso-800 text-cream-50"
    >
      <div className="page-x">
        <div className={styles.formatsHead}>
          <div>
            <Reveal>
              <p className="text-eyebrow text-gold-400">{FORMATS_EYEBROW}</p>
            </Reveal>
            <RevealLines
              id="formats-title"
              className="text-section mt-6"
              lines={[
                FORMATS_LINES[0],
                <span key="same" className="serif-italic text-gold-400">
                  {FORMATS_LINES[1]}
                </span>,
              ]}
            />
          </div>
          <Reveal delay={0.1} className={styles.formatsNote}>
            <p className="leading-relaxed text-cream-200">{FORMATS_NOTE}</p>
            <p className={clsx("text-eyebrow mt-4 text-gold-400", styles.legend)}>
              <span className={styles.legendCell} aria-hidden="true" />
              {FORMATS_LEGEND}
            </p>
          </Reveal>
        </div>

        <ol className={styles.formats}>
          {FORMATS.map((format) => (
            <li key={format.name} className={styles.format}>
              <Reveal className={styles.formatName}>
                <h3 className="text-section">{format.name}</h3>
                <p className="text-eyebrow mt-3 text-gold-400">{format.size}</p>
              </Reveal>

              <Reveal delay={0.06} className={styles.formatChart}>
                <WaffleChart minGuests={format.minGuests} maxGuests={format.maxGuests} />
              </Reveal>

              <Reveal delay={0.12} className={styles.formatLines}>
                <ul>
                  {format.lines.map((line) => (
                    <li key={line} className={styles.formatLine}>
                      {line}
                    </li>
                  ))}
                </ul>
                <p className="text-eyebrow mt-4 text-cream-300">{QUOTE_ONLY}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/**
 * A waffle chart, literally: the plate of an iron where one square is ten guests. Solid
 * up to the format's minimum, tinted up to its maximum. The text beside it says the same.
 */
function WaffleChart({ minGuests, maxGuests }: { minGuests: number; maxGuests: number | null }) {
  const solid = minGuests / GUESTS_PER_CELL;
  const reach = maxGuests === null ? CHART_CELLS : maxGuests / GUESTS_PER_CELL;

  return (
    <div className={styles.chart} aria-hidden="true">
      {Array.from({ length: CHART_CELLS }, (_, index) => (
        <span
          key={index}
          className={styles.chartCell}
          data-level={index < solid ? "solid" : index < reach ? "reach" : "empty"}
          style={{ "--order": index } as CSSProperties}
        />
      ))}
    </div>
  );
}

function Steps() {
  return (
    <section
      aria-labelledby="steps-title"
      className="section-rise section-pad bg-cream-50 text-espresso-950"
    >
      <div className="page-x">
        <Reveal>
          <p className="text-eyebrow text-terracotta-700">{STEPS_EYEBROW}</p>
        </Reveal>
        <RevealLines
          id="steps-title"
          className="text-section mt-6"
          lines={[
            STEPS_LINES[0],
            <span key="first" className="serif-italic text-terracotta-700">
              {STEPS_LINES[1]}
            </span>,
          ]}
        />

        <ol className={styles.steps}>
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className={styles.step}
              style={{ "--step": index } as CSSProperties}
            >
              <Reveal delay={index * 0.06}>
                <span className={styles.stepNumber} aria-hidden="true">
                  {index + 1}
                </span>
                <h3 className="text-headline mt-4">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-espresso-700">{step.note}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FinalCall() {
  return (
    <section
      aria-labelledby="final-title"
      className={clsx(
        "section-rise section-pad [&_:focus-visible]:outline-espresso-950",
        styles.final,
      )}
    >
      <div className={styles.finalWaffle} aria-hidden="true" />

      <div className={clsx("page-x", styles.finalStage)}>
        <Reveal>
          <p className="text-eyebrow text-espresso-950">{FINAL_EYEBROW}</p>
        </Reveal>
        <RevealLines id="final-title" lines={FINAL_LINES} className={clsx("text-hero", styles.finalTitle)} />
        <Reveal delay={0.1} className={styles.finalFoot}>
          <p className="text-subhead max-w-[28rem] text-espresso-950">{FINAL_NOTE}</p>
          <div className={styles.actions}>
            <MagneticButton>
              <a
                href={whatsappUrl(EVENTS_SECTION.quoteMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="cta cta--ink"
              >
                <span className="cta__label">{EVENTS_SECTION.secondaryCta}</span>
                <ArrowUpRight className="cta__arrow size-4" aria-hidden="true" />
              </a>
            </MagneticButton>
            <MagneticButton>
              <Link href="/menu" className="cta cta--ink-outline">
                <span className="cta__label">{FINAL_MENU_CTA}</span>
              </Link>
            </MagneticButton>
          </div>
        </Reveal>
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

const HERO_TAG = "Corner live";
const FORMATS_LINK = "Voir les formats";

const PRINCIPLE_EYEBROW = "01 — Le principe";
const PRINCIPLE_COLD = "Un buffet froid, ça se subit.";
const PRINCIPLE_HOT = "Une gaufre cuite à la minute, ça se regarde.";
const PRINCIPLE_PARAGRAPHS = [
  "Notre stand à nos couleurs, les fers en fonte, la pâte pétrie le matin même dans notre laboratoire, et deux personnes en tenue qui travaillent sous les yeux de vos invités.",
  "Personne ne mange une gaufre tiède sortie d’un bac. Chacun choisit sa garniture, attend deux minutes devant le fer, et repart avec une gaufre encore caramélisée. C’est l’animation autant que le dessert.",
];

const INCLUDED_EYEBROW = "02 — Ce qui est inclus";
const INCLUDED_LINES = ["Vous n’avez rien", "à prévoir."];

const INCLUSIONS = [
  {
    title: "Le stand",
    note: "Notre installation à nos couleurs, montée sur place. Emprise réduite, elle se pose dans un coin de salle.",
  },
  {
    title: "Les fers en fonte",
    note: "Gaufriers professionnels Liège et Bruxelles, plaque bubble waffle. Autonomie complète, un simple accès électrique.",
  },
  {
    title: "Deux personnes en tenue",
    note: "On vient à deux, quel que soit le format\u00A0: une aux fers, une au dressage et au service.",
  },
  {
    title: "La barre à toppings",
    note: "Chocolat Callebaut, crème pistache, spéculoos, mascarpone, fruits frais découpés sur place.",
  },
  {
    title: "Le service complet",
    note: "Vaisselle, serviettes, consommables. Installation avant l’arrivée des invités, démontage et nettoyage après.",
  },
];

const FORMATS_EYEBROW = "03 — Les formats";
const FORMATS_LINES = ["Trois formats,", "une seule exigence."];
const FORMATS_NOTE =
  "Chaque prestation est chiffrée sur devis, selon le nombre d’invités, la durée et le lieu.";
const FORMATS_LEGEND = "Un carré, dix invités";
const QUOTE_ONLY = "Sur devis";

const GUESTS_PER_CELL = 10;
const CHART_CELLS = 20;

const FORMATS: Format[] = [
  {
    name: "Essentiel",
    size: "30 à 60 invités",
    minGuests: 30,
    maxGuests: 60,
    lines: [
      "2 personnes, 2 fers en fonte",
      "Gaufre de Liège et de Bruxelles",
      "6 toppings au choix",
      "2 heures de service",
    ],
  },
  {
    name: "Signature",
    size: "60 à 150 invités",
    minGuests: 60,
    maxGuests: 150,
    lines: [
      "2 personnes, 3 fers en fonte",
      "Liège, Bruxelles, Bubble Waffle",
      "Barre à toppings complète",
      "Tiramisu Waffle en pièce signature",
      "3 heures de service",
    ],
  },
  {
    name: "Sur-mesure",
    size: "150 invités et plus",
    minGuests: 150,
    maxGuests: null,
    lines: [
      "Matériel dimensionné avec vous",
      "Habillage à vos couleurs",
      "Création de recette exclusive",
      "Version salée\u00A0: Pizza Waffle, brioches farcies",
      "Durée libre",
    ],
  },
];

const STEPS_EYEBROW = "04 — Le déroulé";
const STEPS_LINES = ["De votre message", "à la première gaufre."];

const STEPS = [
  {
    title: "Le brief",
    note: "Un message WhatsApp suffit\u00A0: date, lieu, nombre d’invités. On vous rappelle dans la journée.",
  },
  {
    title: "Le devis",
    note: "Proposition chiffrée sous 48\u00A0h, avec le format recommandé et la sélection de recettes.",
  },
  {
    title: "Le repérage",
    note: "Pour les grands formats, on passe voir le lieu\u00A0: où installer le stand, l’accès, le point électrique.",
  },
  {
    title: "Le jour J",
    note: "Installation deux heures avant. Service. Démontage. Vous ne touchez à rien.",
  },
];

const FINAL_EYEBROW = "Parlons de votre date";
const FINAL_LINES = ["Dites-nous", "quand."];
const FINAL_NOTE = "Réservation conseillée trois semaines à l’avance. Marrakech et sa région.";
const FINAL_MENU_CTA = "Voir la carte";

type Format = {
  name: string;
  size: string;
  minGuests: number;
  /** `null` when the format has no upper limit. */
  maxGuests: number | null;
  lines: string[];
};
