import { MagneticButton } from "@/components/motion/MagneticButton";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { Reveal, RevealLines } from "@/components/motion/Reveal";
import { CONTACT, VISIT, whatsappUrl, GIRLS_ONLY } from "@/lib/site-content";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { OpenStatus, OpeningHoursTable } from "./OpenStatus";
import styles from "./VisitSection.module.css";

/**
 * A street plate, with its screws, and its house number right above the door it belongs
 * to. Everything that depends on the clock lives in `OpenStatus`, after mount.
 */
export function VisitSection() {
  const [houseLabel, houseNumber] = CONTACT.addressLine.split(",")[0].split(" ");

  return (
    <section
      id="visite"
      aria-labelledby="visite-title"
      className={cn("section-rise section-pad bg-cream-50 text-espresso-950", styles.section)}
    >
      <div className={cn("page-x", styles.stage)}>
        <p className={`text-eyebrow text-terracotta-700 ${styles.eyebrow}`}>
          {SECTION_INDEX} — {VISIT.eyebrow}
        </p>

        <div className={styles.plate}>
          {SCREW_ANGLES.map((angle, index) => (
            <span
              key={angle}
              className={styles.screw}
              data-corner={index}
              style={{ rotate: `${angle}deg` }}
              aria-hidden="true"
            />
          ))}

          <RevealLines
            id="visite-title"
            lines={VISIT.titleLines}
            className={cn("text-hero", styles.plateTitle)}
          />

          <p className={styles.houseNumber} aria-hidden="true">
            <span className="text-eyebrow">{houseLabel}</span>
            <span className={styles.houseDigits}>{houseNumber}</span>
          </p>

          <p className={styles.coordinates} aria-hidden="true">
            <span>{formatLatitude(CONTACT.geo.latitude)}</span>{" "}
            <span>{formatLongitude(CONTACT.geo.longitude)}</span>
          </p>
        </div>

        <Reveal className={styles.address}>
          <h3 className="text-eyebrow text-terracotta-700">{VISIT.addressTitle}</h3>
          <address className={cn("text-headline not-italic", styles.addressLines)}>
            <span>{CONTACT.addressLine}</span>{" "}
            <span>
              {CONTACT.city}, {CONTACT.country}
            </span>
          </address>
          <p className={styles.intro}>{VISIT.intro}</p>
        </Reveal>

        <Reveal delay={0.08} className={styles.actions}>
          <div className={styles.buttons}>
            <MagneticButton>
              <a
                href={CONTACT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta cta--ink"
              >
                <span className="cta__label">{VISIT.directionsCta}</span>
                <ArrowUpRight className="cta__arrow size-4" aria-hidden="true" />
              </a>
            </MagneticButton>
            <MagneticButton>
              <a
                href={CONTACT.glovoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta cta--ink-outline"
              >
                <span className="cta__label">{VISIT.deliveryCta}</span>
              </a>
            </MagneticButton>
          </div>

          <ul className={styles.links}>
            <li>
              <Link href="/location" className={styles.link}>
                {VISIT.locationCta}
              </Link>
            </li>
            <li>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                {VISIT.whatsappCta}
              </a>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.12} className={styles.hours}>
          <div className={styles.hoursHead}>
            <h3 id="visite-horaires" className="text-eyebrow text-terracotta-700">
              {VISIT.hoursTitle}
            </h3>
            <OpenStatus className="justify-end" />
          </div>
          <OpeningHoursTable labelledBy="visite-horaires" />
          <p className="mt-4 font-medium text-terracotta-700">{GIRLS_ONLY.closedNote}</p>
        </Reveal>

        <Reveal y={48} className={styles.photoSlot}>
          <div className={cn("frame-arch parallax-frame", styles.photoFrame)}>
            <ParallaxLayer strength={PHOTO_DRIFT}>
              <Image
                src={PHOTO.src}
                alt={PHOTO.alt}
                fill
                sizes={PHOTO_SIZES}
                className="object-cover object-center"
              />
            </ParallaxLayer>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function formatLatitude(latitude: number) {
  return `${Math.abs(latitude).toFixed(4)}° ${latitude >= 0 ? "N" : "S"}`;
}

function formatLongitude(longitude: number) {
  return `${Math.abs(longitude).toFixed(4)}° ${longitude >= 0 ? "E" : "O"}`;
}

/** Not in `VISIT`: follows on from the numbered labels of the sections before. */
const SECTION_INDEX = "06";

/** Not in `VISIT`: the photo and its description, to move to the content file. */
const PHOTO = {
  src: "/images/site/barista-counter-2.jpg",
  alt: "Un latte en verre double paroi sur le comptoir, devant le mur à lattes dorées portant le logo Kech Waffles",
};

const PHOTO_DRIFT = 5;

// Rendered widths: where the arch is narrower than the photo, it is drawn from its height.
const PHOTO_SIZES = "(min-width: 1024px) 360px, (min-width: 768px) 32vw, 50vw";

// A plate is never screwed on straight.
const SCREW_ANGLES = [24, -38, 71, 112];
