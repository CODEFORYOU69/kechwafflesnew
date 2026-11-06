import { MagneticButton } from "@/components/motion/MagneticButton";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { Reveal, RevealLines } from "@/components/motion/Reveal";
import { EVENTS_SECTION, whatsappUrl } from "@/lib/site-content";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, type CSSProperties } from "react";
import styles from "./EventsSection.module.css";

/**
 * The only home of the traditional waffles. The title runs across the crown of a tall
 * arch while a smaller arch climbs the other way: photo, door frame and small arch each
 * move on their own plane, in CSS, off the main thread.
 */
export function EventsSection() {
  const { eyebrow, titleLines, intro, highlights, images, primaryCta, secondaryCta, quoteMessage } =
    EVENTS_SECTION;

  return (
    <section
      id="prestations"
      aria-labelledby="prestations-title"
      className="section-rise section-pad bg-espresso-800 text-cream-50"
    >
      <div className={cn("page-x", styles.stage)}>
        <p className={`text-eyebrow text-gold-400 ${styles.eyebrow}`}>
          {SECTION_INDEX} — {eyebrow}
        </p>

        <RevealLines
          id="prestations-title"
          lines={titleLines.map(keepWordsWhole)}
          className={cn("text-hero", styles.title)}
        />

        <div className={styles.doors}>
          <ParallaxLayer strength={DOOR_FRAME_DRIFT} style={FLOATING} className={styles.doorFrame}>
            <span />
          </ParallaxLayer>

          <Reveal y={48}>
            <div className={cn("frame-arch parallax-frame", styles.mainFrame)}>
              <ParallaxLayer strength={MAIN_PHOTO_DRIFT}>
                <Image
                  src={images.main.src}
                  alt={images.main.alt}
                  fill
                  sizes={MAIN_PHOTO_SIZES}
                  className={styles.mainPhoto}
                />
              </ParallaxLayer>
            </div>
          </Reveal>

          <div className={styles.sideSlot}>
            <ParallaxLayer strength={SIDE_DOOR_DRIFT} style={FLOATING} className={styles.sideFloat}>
              <Reveal y={72} delay={0.15} className={styles.sideDoor}>
                <div className={cn("frame-arch parallax-frame", styles.sideFrame)}>
                  <ParallaxLayer strength={SIDE_PHOTO_DRIFT}>
                    <Image
                      src={images.side.src}
                      alt={images.side.alt}
                      fill
                      sizes={SIDE_PHOTO_SIZES}
                      className={styles.sidePhoto}
                    />
                  </ParallaxLayer>
                </div>
              </Reveal>
            </ParallaxLayer>
          </div>
        </div>

        <div className={styles.copy}>
          <Reveal>
            <p className="text-subhead text-cream-200">{intro}</p>
          </Reveal>

          <Reveal delay={0.08} className={styles.facts}>
            <dl className={styles.highlights}>
              {highlights.map((highlight) => (
                <div key={highlight.label} className={styles.highlight}>
                  <dt className="text-eyebrow text-gold-400">{highlight.label}</dt>
                  <dd className={styles.highlightValue}>{highlight.value}</dd>
                </div>
              ))}
            </dl>

            <div className={styles.actions}>
              <MagneticButton>
                <Link href="/prestations" className="cta">
                  <span className="cta__label">{primaryCta}</span>
                  <ArrowUpRight className="cta__arrow size-4" aria-hidden="true" />
                </Link>
              </MagneticButton>
              <MagneticButton>
                <a
                  href={whatsappUrl(quoteMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta cta--outline"
                >
                  <span className="cta__label">{secondaryCta}</span>
                </a>
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Lets a line wrap between words, and only there. */
function keepWordsWhole(line: string) {
  return line.split(" ").map((word, index) => (
    <Fragment key={word}>
      {index > 0 ? " " : null}
      <span className="whitespace-nowrap">{word}</span>
    </Fragment>
  ));
}

/** Not in `EVENTS_SECTION`: follows on from the numbered labels of the sections before. */
const SECTION_INDEX = "05";

const MAIN_PHOTO_DRIFT = 7;
const DOOR_FRAME_DRIFT = 3;
const SIDE_DOOR_DRIFT = -14;
const SIDE_PHOTO_DRIFT = -5;

// A layer that moves as a whole: without this, it would grow to cover a frame it does not have.
const FLOATING = { "--parallax-scale": 1 } as CSSProperties;

// Rendered widths, zoom and drift scale included. The side photo is landscape in a portrait
// frame: it is drawn from the frame's height, far wider than the frame itself.
const MAIN_PHOTO_SIZES = "(min-width: 1440px) 920px, (min-width: 1024px) 64vw, (min-width: 640px) 79vw, 138vw";
const SIDE_PHOTO_SIZES = "(min-width: 1440px) 580px, (min-width: 1024px) 40vw, (min-width: 640px) 47vw, 74vw";
