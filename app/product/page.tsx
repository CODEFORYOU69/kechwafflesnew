import { MagneticButton } from "@/components/motion/MagneticButton";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { Reveal, RevealLines } from "@/components/motion/Reveal";
import { COFFEE } from "@/lib/site-content";
import { clsx } from "clsx";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, type CSSProperties, type ReactNode } from "react";
import styles from "./product.module.css";

/**
 * Two side projects, shown as such: a compact opening, and no picture because the site's
 * photo set has none of them and the catalogue images are renders. Each product is drawn
 * in type instead, which is also what it is made of: a stack of layers, a grid of cells.
 * The page ends back at the counter.
 */
export default function ProductPage() {
  return (
    <>
      <ProductHero />
      <ProductSection
        product={TICANMISU}
        index={0}
        tile={<StrataTile />}
        className="bg-cream-100 text-espresso-950 [&_:focus-visible]:outline-terracotta-700"
        tone="light"
      />
      <ProductSection
        product={PIZZA_WAFFLE}
        index={1}
        tile={<GridTile />}
        className="bg-espresso-800 text-cream-50"
        tone="dark"
        isFlipped
      />
      <BackToCounter />
    </>
  );
}

function ProductHero() {
  return (
    <section className={styles.hero} aria-labelledby="product-title">
      <div className={clsx("page-x", styles.heroStage)}>
        <p className={clsx("text-eyebrow intro-fade text-gold-400", styles.heroEyebrow)} style={introDelay(0.1)}>
          {HERO_EYEBROW}
        </p>
        <h1 id="product-title" className={clsx("text-section text-cream-50", styles.heroTitle)}>
          {HERO_LINES.map((line, index) => (
            <Fragment key={line}>
              <span className="intro-line" style={lineStyle(index)}>
                <span>{line}</span>
              </span>{" "}
            </Fragment>
          ))}
        </h1>
        <p className={clsx("text-subhead intro-fade text-cream-200", styles.heroLead)} style={introDelay(0.45)}>
          {HERO_LEAD}
        </p>
      </div>
    </section>
  );
}

function ProductSection({
  product,
  index,
  tile,
  className,
  tone,
  isFlipped = false,
}: {
  product: Product;
  index: number;
  tile: ReactNode;
  className: string;
  tone: "light" | "dark";
  isFlipped?: boolean;
}) {
  const accent = tone === "light" ? "text-terracotta-700" : "text-gold-400";
  const muted = tone === "light" ? "text-espresso-700" : "text-cream-200";

  return (
    <section
      aria-labelledby={`${product.id}-title`}
      className={clsx("section-rise section-pad", className)}
    >
      <div className={clsx("page-x", styles.product)} data-flipped={isFlipped ? "" : undefined}>
        {/* The first tile is on the opening screen of a phone: it must not wait for the script. */}
        {index === 0 ? (
          <div className={styles.productTile}>{tile}</div>
        ) : (
          <Reveal y={48} className={styles.productTile}>
            {tile}
          </Reveal>
        )}

        <div className={styles.productCopy}>
          <Reveal>
            <p className={clsx("text-eyebrow", accent)}>
              {String(index + 1).padStart(2, "0")} / {String(PRODUCT_COUNT).padStart(2, "0")}
            </p>
          </Reveal>
          <RevealLines
            id={`${product.id}-title`}
            lines={[product.name]}
            className="text-section mt-5"
          />
          <Reveal delay={0.08}>
            <p className={clsx("serif-italic mt-3 text-[clamp(1.5rem,2.4vw,2.25rem)] leading-tight", accent)}>
              {product.tagline}
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-subhead mt-7">{product.description}</p>
            <p className={clsx("mt-4 leading-relaxed", muted)}>{product.story}</p>
          </Reveal>
          <Reveal delay={0.16}>
            <ul className={styles.details} data-tone={tone}>
              {product.details.map((detail, detailIndex) => (
                <li key={detail} className={styles.detail}>
                  <span className={clsx("text-eyebrow", accent)} aria-hidden="true">
                    {String(detailIndex + 1).padStart(2, "0")}
                  </span>
                  {detail}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.2} className="mt-8">
            <MagneticButton>
              <Link href={product.menuHref} className={clsx("cta", tone === "light" ? "cta--ink" : "cta--outline")}>
                <span className="cta__label">{PRODUCT_CTA}</span>
                <ArrowUpRight className="cta__arrow size-4" aria-hidden="true" />
              </Link>
            </MagneticButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** A can in cross-section: the layers of the tiramisu, stacked and named. */
function StrataTile() {
  return (
    <div className={clsx("frame-arch", styles.strata)} role="img" aria-label={TICANMISU.tileLabel}>
      {STRATA.map((layer, index) => (
        <div
          key={layer.id}
          className={styles.layer}
          data-tone={layer.tone}
          style={{ "--depth": index, "--weight": layer.weight } as CSSProperties}
        >
          <span className={layer.isSmall ? styles.layerNote : styles.layerName}>{layer.label}</span>
        </div>
      ))}
    </div>
  );
}

/** The iron's grid: the choices behind the Pizza Waffle, set in its cells. */
function GridTile() {
  return (
    <div className={clsx("frame-arch", styles.grid)} role="img" aria-label={PIZZA_WAFFLE.tileLabel}>
      {Array.from({ length: GRID_CELLS }, (_, index) => (
        <span key={index} className={styles.gridCell} />
      ))}
      {GRID_LABELS.map((label) => (
        <span key={label.text} className={styles.gridLabel} style={label.place} data-tone={label.tone}>
          {label.text}
        </span>
      ))}
    </div>
  );
}

function BackToCounter() {
  const photo = COFFEE.stationImages.side;

  return (
    <section
      aria-labelledby="counter-title"
      className="section-rise section-pad bg-espresso-950 text-cream-50"
    >
      <div className={clsx("page-x", styles.counter)}>
        <div className={styles.counterCopy}>
          <Reveal>
            <p className="text-eyebrow text-gold-400">{COUNTER_EYEBROW}</p>
          </Reveal>
          <RevealLines id="counter-title" lines={COUNTER_LINES} className="text-hero mt-6" />
          <Reveal delay={0.15} className={styles.counterActions}>
            <MagneticButton>
              <Link href="/menu" className="cta">
                <span className="cta__label">{COUNTER_PRIMARY}</span>
                <ArrowUpRight className="cta__arrow size-4" aria-hidden="true" />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link href="/location" className="cta cta--outline">
                <span className="cta__label">{COUNTER_SECONDARY}</span>
              </Link>
            </MagneticButton>
          </Reveal>
        </div>

        <Reveal y={48} className={styles.counterDoor}>
          <div className={clsx("frame-arch parallax-frame", styles.counterFrame)}>
            <ParallaxLayer strength={6}>
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1440px) 500px, (min-width: 1024px) 35vw, 80vw"
                className="object-cover object-[center_30%]"
              />
            </ParallaxLayer>
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

const HERO_EYEBROW = "Créations d’atelier";
const HERO_LINES = ["Deux créations,", "à côté du comptoir."];
const HERO_LEAD =
  "Le café et les croffles restent notre raison d’être. À côté, deux créations d’atelier, fabriquées sur place et servies fraîches.";

const PRODUCT_COUNT = 2;
const PRODUCT_CTA = "Voir sur la carte";

const TICANMISU: Product = {
  id: "ticanmisu",
  menuHref: "/menu?onglet=cans",
  name: "TiCanMisu",
  tagline: "Le tiramisu, en canette.",
  description:
    "Notre tiramisu signature, conditionné frais en canette hermétique. Mascarpone, café, biscuits imbibés, et plusieurs déclinaisons exclusives.",
  story:
    "Préparé à la main, chaque couche est assemblée avec précision. Oreo, Daim, Kinder Bueno, Nutella, Dubai, Amlou, Spéculoos\u00A0: chaque canette raconte une version différente de l’original.",
  details: ["Préparation quotidienne", "Mascarpone premium", "Plusieurs saveurs", "Format nomade"],
  tileLabel:
    "Une canette de tiramisu en coupe\u00A0: les couches de mascarpone, de café et de biscuits imbibés, empilées et nommées.",
};

const PIZZA_WAFFLE: Product = {
  id: "pizza-waffle",
  menuHref: "/menu?onglet=salees",
  name: "Pizza Waffle",
  tagline: "L’Italie rencontre la Belgique.",
  description:
    "Une gaufre salée maison, garnie comme une pizza et gratinée au four. Fromages fondus, herbes, base tomate ou crème, garnitures au choix.",
  story:
    "L’audace sucrée-salée réinventée. Une texture croustillante, un cœur filant, une générosité qui ne ressemble à rien d’autre.",
  details: ["Base tomate ou crème", "Garnitures au choix", "Gratinée minute", "Concept signature"],
  tileLabel:
    "La grille d’un fer à gaufres, dont les cases portent les choix de la Pizza Waffle\u00A0: base tomate ou crème, garnitures au choix, gratinée minute.",
};

const STRATA: Layer[] = [
  { id: "versions", label: "Oreo · Daim · Kinder Bueno · Nutella · Dubai · Amlou · Spéculoos", tone: "cocoa", weight: 3.2, isSmall: true },
  { id: "mascarpone", label: "Mascarpone", tone: "cream", weight: 2.2 },
  { id: "cafe", label: "Café", tone: "coffee", weight: 1.3 },
  { id: "biscuits", label: "Biscuits imbibés", tone: "biscuit", weight: 1.9 },
  { id: "mascarpone-2", label: "Mascarpone", tone: "creamDeep", weight: 1.5 },
  { id: "format", label: "Canette hermétique · Format nomade", tone: "base", weight: 0.9, isSmall: true },
];

const GRID_COLUMNS = 5;
const GRID_ROWS = 7;
const GRID_CELLS = GRID_COLUMNS * GRID_ROWS;

const GRID_LABELS: GridLabel[] = [
  { text: "Base tomate", tone: "cream", place: { gridColumn: "1 / span 3", gridRow: "3" } },
  { text: "ou crème", tone: "gold", place: { gridColumn: "3 / span 3", gridRow: "4" } },
  { text: "Garnitures au choix", tone: "ink", place: { gridColumn: "1 / span 4", gridRow: "5 / span 1" } },
  { text: "Gratinée minute", tone: "cream", place: { gridColumn: "2 / span 4", gridRow: "6" } },
];

const COUNTER_EYEBROW = "L’essentiel";
const COUNTER_LINES = ["Et pour commencer,", "un café."];
const COUNTER_PRIMARY = "Voir la carte";
const COUNTER_SECONDARY = "Nous trouver";

type Product = {
  id: string;
  /** Opens the menu on the tab that lists this product. */
  menuHref: string;
  name: string;
  tagline: string;
  description: string;
  story: string;
  details: string[];
  tileLabel: string;
};

type Layer = {
  id: string;
  label: string;
  tone: string;
  weight: number;
  isSmall?: boolean;
};

type GridLabel = {
  text: string;
  tone: string;
  place: CSSProperties;
};
