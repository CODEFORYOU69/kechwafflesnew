import { MagneticButton } from "@/components/motion/MagneticButton";
import { Reveal, RevealLines } from "@/components/motion/Reveal";
import { MENU_SECTION } from "@/lib/site-content";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { CroffleRail } from "./CroffleRail";
import styles from "./MenuGrid.module.css";

/**
 * The great light breath after the dark of the café. One idea: a street of doors. The
 * croffles stand on a single floor line, each behind its own arch, and the giant title
 * shares that floor with them. The rail scrolls sideways on a pinned stage, or natively.
 */
export function MenuGrid() {
  const { crofflesTitle, croffles } = MENU_SECTION;

  return (
    <section
      id="carte"
      aria-labelledby="carte-title"
      className={cn("section-rise section-pad bg-cream-100 text-espresso-950", styles.section)}
    >
      <MenuHeader />

      <CroffleRail intro={<CroffleIntro />} label={`${crofflesTitle}${RAIL_LABEL_SUFFIX}`}>
        <ul className={styles.cards}>
          {croffles.map((croffle, index) => (
            <CroffleCard key={croffle.id} croffle={croffle} index={index} total={croffles.length} />
          ))}
        </ul>
      </CroffleRail>

      <FreshBoard />
      <MenuFoot />
    </section>
  );
}

function MenuHeader() {
  const { eyebrow, titleLines, intro } = MENU_SECTION;

  return (
    <header className={cn("page-x", styles.header)}>
      <Reveal className={styles.headerEyebrow}>
        <p className="text-eyebrow text-terracotta-700">{eyebrow}</p>
      </Reveal>
      <RevealLines
        id="carte-title"
        className={cn("text-section", styles.headerTitle)}
        lines={[
          titleLines[0],
          <span key={titleLines[1]} className="serif-italic text-terracotta-700">
            {titleLines[1]}
          </span>,
        ]}
      />
      <Reveal delay={0.15} className={styles.headerIntro}>
        <p className="text-subhead text-espresso-700">{intro}</p>
      </Reveal>
    </header>
  );
}

function CroffleIntro() {
  const { crofflesTitle, crofflesNote } = MENU_SECTION;
  const [article, ...word] = crofflesTitle.split(" ");

  return (
    <>
      <RevealLines
        as="h3"
        className={styles.introTitle}
        lines={[
          <span key={article} className={cn("serif-italic", styles.introArticle)}>
            {article}
          </span>,
          word.join(" "),
        ]}
      />
      <p className={styles.introNote}>{crofflesNote}</p>
      <p className={cn("text-eyebrow", styles.introHint)} aria-hidden="true">
        <span className={styles.hintNative}>
          <span className="hidden coarse:inline">{HINT_NATIVE}</span>
          <span className="coarse:hidden">{HINT_NATIVE_MOUSE}</span>
        </span>
        <span className={styles.hintPinned}>{HINT_PINNED}</span>
        <span className={styles.hintArrow} />
      </p>
    </>
  );
}

function CroffleCard({
  croffle,
  index,
  total,
}: {
  croffle: (typeof MENU_SECTION.croffles)[number];
  index: number;
  total: number;
}) {
  const shape = CARD_SHAPES[croffle.id] ?? DEFAULT_SHAPE;

  return (
    <li
      className={cn(styles.card, shape.lift !== undefined && styles.cardLifted)}
      style={cardStyle(shape)}
    >
      <Reveal y={56} delay={0.05} className={styles.rise}>
        <figure className={styles.figure}>
          <div
            className={cn(
              styles.photo,
              shape.isSquare ? styles.photoSquare : "frame-arch",
            )}
          >
            <div className={styles.photoInner} data-rail-photo="">
              <Image
                src={croffle.src}
                alt={croffle.alt}
                fill
                sizes={cardSizes(shape)}
                loading="lazy"
                className="object-cover"
                style={{ objectPosition: croffle.position }}
              />
            </div>
          </div>
          <figcaption className={styles.caption}>
            <span className={cn("text-eyebrow", styles.captionIndex)}>
              {formatIndex(index + 1)}/{formatIndex(total)}
            </span>
            <span className={styles.captionName}>{croffle.name}</span>
          </figcaption>
        </figure>
      </Reveal>
    </li>
  );
}

function FreshBoard() {
  const { freshTitle, freshNote, fresh } = MENU_SECTION;

  return (
    <div className={cn("page-x", styles.fresh)}>
      <div className={styles.freshHead}>
        <Reveal>
          <h3 className={styles.freshTitle}>{freshTitle}</h3>
        </Reveal>
        <Reveal delay={0.1}>
          <p className={cn("text-eyebrow", styles.freshNote)}>{freshNote}</p>
        </Reveal>
      </div>

      {fresh.map((item, index) => (
        <Reveal key={item.id} delay={index * 0.06} className={cn(styles.tile, TILE_CLASSES[item.id])}>
          <TileDecor id={item.id} />
          <div className={cn(styles.tilePhoto, item.id !== "cookies" && "frame-arch")}>
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes={TILE_SIZES[item.id]}
              loading="lazy"
              className="object-cover"
            />
          </div>
          <span className={cn("text-eyebrow", styles.tileIndex)}>{formatIndex(index + 1)}</span>
          <div className={styles.tileBody}>
            <h4 className={styles.tileName}>{item.name}</h4>
            <p className={styles.tileDetail}>{item.detail}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/** The dark tile carries the kufic grid, the terracotta door the concentric arches of the logo. */
function TileDecor({ id }: { id: string }) {
  if (id === "cookies") {
    return <span className={cn("kufic-grid", styles.tileGrid)} aria-hidden="true" />;
  }
  if (id === "brownies") {
    return (
      <span className={styles.doorArches} aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    );
  }
  return null;
}

function MenuFoot() {
  const { waffleNote, waffleCta, menuCta } = MENU_SECTION;

  return (
    <div className={cn("page-x", styles.foot)}>
      <div className={styles.footInner}>
        <Reveal className={styles.footNote}>
          <p className="text-headline text-balance">{waffleNote}</p>
        </Reveal>
        <Reveal delay={0.1} className={styles.footActions}>
          <MagneticButton>
            <Link href="/prestations" className="cta cta--ink-outline">
              <span className="cta__label">{waffleCta}</span>
            </Link>
          </MagneticButton>
          <MagneticButton>
            <Link href="/menu" className="cta cta--ink">
              <span className="cta__label">{menuCta}</span>
              <ArrowUpRight className="cta__arrow size-4" aria-hidden="true" />
            </Link>
          </MagneticButton>
        </Reveal>
      </div>
    </div>
  );
}

function formatIndex(value: number) {
  return String(value).padStart(2, "0");
}

function cardStyle(shape: CardShape) {
  return {
    "--w": shape.width,
    "--h": shape.height,
    "--lift": shape.lift ?? 0,
    "--native-w": shape.nativeWidth,
    "--native-h": shape.nativeHeight,
    "--native-lift": shape.nativeLift ?? 0,
    "--shift": `${shape.photoShift ?? 0}%`,
  } as CSSProperties;
}

/** Matches the unit of the CSS module, with the overscan the drifting photo needs on desktop. */
function cardSizes(shape: CardShape) {
  return `(min-width: 1024px) ${Math.round(shape.width * 0.92)}vh, ${shape.nativeWidth}vw`;
}

const RAIL_LABEL_SUFFIX = ", galerie de photos à faire défiler";
const TILE_SIZES: Record<string, string> = {
  cookies: "(min-width: 1440px) 800px, (min-width: 1024px) 56vw, 100vw",
  brownies: "(min-width: 1440px) 560px, (min-width: 1024px) 40vw, 100vw",
  brioches: "(min-width: 1440px) 400px, (min-width: 1024px) 28vw, 50vw",
  gateaux: "(min-width: 1440px) 400px, (min-width: 1024px) 28vw, 50vw",
};

const HINT_NATIVE = "Faites glisser";
const HINT_NATIVE_MOUSE = "Faites défiler";
const HINT_PINNED = "Continuez à défiler";

/**
 * Sizes in hundredths of the stage's height on desktop, in hundredths of the screen's
 * width elsewhere. `fraise` stays wide for its height: the crop keeps the cable out.
 */
const CARD_SHAPES: Record<string, CardShape> = {
  caramel: { width: 38, height: 80, nativeWidth: 62, nativeHeight: 104, photoShift: -6 },
  fraise: { width: 56, height: 63, lift: 18, nativeWidth: 74, nativeHeight: 74, nativeLift: 6 },
  "trois-chocolats": { width: 44, height: 58, nativeWidth: 60, nativeHeight: 78, photoShift: -6 },
  coco: { width: 62, height: 96, nativeWidth: 74, nativeHeight: 104 },
  oreo: {
    width: 50,
    height: 50,
    lift: 30,
    nativeWidth: 68,
    nativeHeight: 68,
    nativeLift: 8,
    photoShift: -3,
    isSquare: true,
  },
  speculoos: { width: 42, height: 72, nativeWidth: 60, nativeHeight: 92 },
  nature: { width: 58, height: 64, nativeWidth: 72, nativeHeight: 78 },
};

const DEFAULT_SHAPE: CardShape = { width: 44, height: 64, nativeWidth: 66, nativeHeight: 84 };

const TILE_CLASSES: Record<string, string | undefined> = {
  cookies: styles.tileCookies,
  brownies: styles.tileBrownies,
  brioches: styles.tileBrioches,
  gateaux: styles.tileGateaux,
};

type CardShape = {
  width: number;
  height: number;
  /** Set on an arch that floats above the floor, by this much on top of its caption. */
  lift?: number;
  nativeWidth: number;
  nativeHeight: number;
  nativeLift?: number;
  /** Moves the photo inside its overscan on desktop, in % of the frame's width. */
  photoShift?: number;
  isSquare?: boolean;
};
