import { MagneticButton } from "@/components/motion/MagneticButton";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { Reveal, RevealLines } from "@/components/motion/Reveal";
import { OpenStatus } from "@/components/sections/OpenStatus";
import { CONTACT, HERO, VISIT, whatsappUrl } from "@/lib/site-content";
import { clsx } from "clsx";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Fragment, type CSSProperties } from "react";
import { HoursBoard } from "./HoursBoard";
import styles from "./location.module.css";

/**
 * A page about finding one door: its number, its coordinates, the hours it stays open,
 * and the three ways of reaching it.
 */
export default function LocationPage() {
  return (
    <>
      <LocationHero />
      <HoursSection />
      <AccessSection />
    </>
  );
}

function LocationHero() {
  return (
    <section className={styles.hero} aria-labelledby="location-title">
      <div className={clsx("kufic-grid", styles.heroGrid)} aria-hidden="true" />

      <div className={clsx("page-x", styles.heroStage)}>
        <div className={styles.heroCopy}>
          <div className={clsx("intro-fade", styles.heroMeta)} style={introDelay(0.1)}>
            <p className="text-eyebrow text-gold-400">{VISIT.eyebrow}</p>
            <p className="text-eyebrow text-cream-300">{coordinates()}</p>
          </div>

          <h1 id="location-title" className={styles.heroTitle}>
            <span className={styles.plate}>
              <span className={clsx("text-eyebrow", styles.plateLabel)}>{DOOR_LABEL}</span>{" "}
              <span className={clsx("intro-line", styles.plateNumber)} style={lineStyle(0)}>
                <span>{DOOR_NUMBER}</span>
              </span>
            </span>{" "}
            {VISIT.titleLines.map((line, index) => (
              <Fragment key={line}>
                <span
                  className={clsx("intro-line text-section", styles.heroStreet)}
                  style={lineStyle(index + 1)}
                >
                  <span>{line}</span>
                </span>{" "}
              </Fragment>
            ))}
          </h1>

          <div className={clsx("intro-fade", styles.heroFoot)} style={introDelay(0.55)}>
            <p className="text-subhead max-w-[30rem] text-cream-200">{VISIT.intro}</p>
            <OpenStatus tone="dark" />
            <div className={styles.actions}>
              <MagneticButton>
                <a href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer" className="cta">
                  <span className="cta__label">{VISIT.directionsCta}</span>
                  <ArrowUpRight className="cta__arrow size-4" aria-hidden="true" />
                </a>
              </MagneticButton>
              {/* Phones already have the floating WhatsApp button: the door keeps the room. */}
              <MagneticButton className="hidden lg:inline-flex">
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta cta--outline"
                >
                  <span className="cta__label">{VISIT.whatsappCta}</span>
                </a>
              </MagneticButton>
            </div>
          </div>
        </div>

        <div className={clsx("intro-fade", styles.heroDoor)} style={introDelay(0.25)}>
          <div className={clsx("frame-arch parallax-frame", styles.heroFrame)}>
            <ParallaxLayer strength={5}>
              <Image
                src="/images/site/facade-night.jpg"
                alt={HERO.doorAlt}
                fill
                priority
                sizes="(min-width: 1440px) 620px, (min-width: 1024px) 43vw, 115vw"
                className="object-cover object-[center_34%]"
              />
            </ParallaxLayer>
          </div>
        </div>
      </div>
    </section>
  );
}

function HoursSection() {
  return (
    <section
      aria-labelledby="hours-title"
      className="section-rise section-pad bg-cream-50 text-espresso-950"
    >
      <div className="page-x">
        <div className={styles.hoursHead}>
          <Reveal>
            <p className="text-eyebrow text-terracotta-700">{HOURS_EYEBROW}</p>
          </Reveal>
          <RevealLines
            id="hours-title"
            lines={[HERO.finalNote]}
            className={clsx("text-section", styles.hoursTitle)}
          />
        </div>

        <Reveal y={24} className="mt-12 lg:mt-20">
          <HoursBoard />
        </Reveal>
      </div>
    </section>
  );
}

function AccessSection() {
  return (
    <section
      aria-labelledby="access-title"
      className="section-rise section-pad bg-terracotta-700 text-cream-50"
    >
      <div className={clsx("page-x", styles.access)}>
        <div className={styles.accessCopy}>
          <Reveal>
            <p className="text-eyebrow text-gold-200">{ACCESS_EYEBROW}</p>
          </Reveal>
          <RevealLines id="access-title" lines={ACCESS_TITLE} className="text-section mt-6" />

          <Reveal delay={0.1}>
            <ol className={styles.routes}>
              {ROUTES.map((route, index) => (
                <li key={route.name} className={styles.route}>
                  <span className="text-eyebrow text-gold-200" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className={clsx("text-headline", styles.routeName)}>{route.name}</h3>
                  <p className={styles.routeDetail}>{route.detail}</p>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={0.15} className={styles.actions}>
            <MagneticButton>
              <a
                href={CONTACT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta cta--cream"
              >
                <span className="cta__label">{MAPS_CTA}</span>
                <ArrowUpRight className="cta__arrow size-4" aria-hidden="true" />
              </a>
            </MagneticButton>
            <MagneticButton>
              <a
                href={CONTACT.wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta cta--outline"
              >
                <span className="cta__label">{WAZE_CTA}</span>
              </a>
            </MagneticButton>
          </Reveal>
        </div>

        <Reveal y={48} className={styles.mapDoor}>
          <div className={clsx("frame-arch", styles.mapFrame)}>
            <iframe
              src={MAP_EMBED_URL}
              title={MAP_TITLE}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className={styles.map}
            />
          </div>
        </Reveal>

        <Reveal delay={0.1} className={styles.contactSlot}>
          <address className={styles.contact}>
            <div className={styles.contactBlock}>
              <p className="text-eyebrow text-gold-200">{VISIT.addressTitle}</p>
              <p className={styles.contactLine}>
                {CONTACT.addressLine}
                <br />
                {CONTACT.city}, {CONTACT.country}
              </p>
            </div>
            <div className={styles.contactBlock}>
              <p className="text-eyebrow text-gold-200">{PHONE_LABEL}</p>
              <a href={`tel:${CONTACT.phoneE164}`} className={styles.contactLink}>
                {CONTACT.phoneDisplay}
              </a>
              <ExternalLink href={whatsappUrl()} label={VISIT.whatsappCta} />
            </div>
            <div className={styles.contactBlock}>
              <p className="text-eyebrow text-gold-200">{DELIVERY_LABEL}</p>
              <ExternalLink href={CONTACT.glovoUrl} label={VISIT.deliveryCta} />
            </div>
            <div className={styles.contactBlock}>
              <p className="text-eyebrow text-gold-200">{SOCIAL_LABEL}</p>
              <ul className={styles.socials}>
                {SOCIALS.map((social) => (
                  <li key={social.label}>
                    <ExternalLink href={social.href} label={social.label} />
                  </li>
                ))}
              </ul>
            </div>
          </address>
        </Reveal>
      </div>
    </section>
  );
}

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
      <span>
        {label}
        <span className="sr-only"> (nouvel onglet)</span>
        <ArrowUpRight className="ml-1.5 inline size-4 align-[-0.125em]" aria-hidden="true" />
      </span>
    </a>
  );
}

/** Formatted from the source of truth, with the hemisphere in French: O for ouest. */
function coordinates() {
  const { latitude, longitude } = CONTACT.geo;
  const north = `${Math.abs(latitude)}° ${latitude >= 0 ? "N" : "S"}`;
  const east = `${Math.abs(longitude)}° ${longitude >= 0 ? "E" : "O"}`;
  return `${north} · ${east}`;
}

function introDelay(seconds: number) {
  return { "--intro-delay": `${seconds}s` } as CSSProperties;
}

function lineStyle(index: number) {
  return { "--line": index, "--intro-delay": "0.1s" } as CSSProperties;
}

// « MAG 33 » from the single address line, so the door can never disagree with it.
const [DOOR_LABEL, DOOR_NUMBER] = CONTACT.addressLine.split(",")[0].split(" ");

const HOURS_EYEBROW = `01 — ${VISIT.hoursTitle}`;
const ACCESS_EYEBROW = "02 — Accès";
const ACCESS_TITLE = ["Trois chemins,", "une destination."];

const ROUTES = [
  { name: "Depuis Majorelle", detail: "15 min du Jardin Majorelle" },
  { name: "En voiture", detail: "Parking gratuit à proximité" },
  { name: "En bus", detail: "Ligne 17 · Arrêt Al Badii" },
];

const MAPS_CTA = "Ouvrir dans Google Maps";
const WAZE_CTA = "Ouvrir dans Waze";
const PHONE_LABEL = "Téléphone";
const DELIVERY_LABEL = "Livraison";
const SOCIAL_LABEL = "Suivre";

const SOCIALS = [
  { label: "Instagram", href: CONTACT.instagramUrl },
  { label: "Facebook", href: CONTACT.facebookUrl },
  { label: "TikTok", href: CONTACT.tiktokUrl },
  { label: "Snapchat", href: CONTACT.snapchatUrl },
];

const MAP_TITLE = "Plan Google Maps\u00A0: Kech Waffles, MAG 33, Al Badii, Marrakech";
const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3395.915660444416!2d-8.0031921!3d31.663527100000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafede897f96e29%3A0x9b0246bfdfaea5bc!2skech%20Waffles!5e0!3m2!1sfr!2sfr!4v1739146023050!5m2!1sfr!2sfr";
