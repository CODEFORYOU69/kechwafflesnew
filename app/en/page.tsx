import { JsonLd } from "@/app/components/JsonLd";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { IntroFade, Reveal, RevealLines } from "@/components/motion/Reveal";
import { FaqSection, faqSchema } from "@/components/sections/FaqSection";
import {
  CONTACT,
  ENGLISH,
  MENU_SECTION,
  SITE_URL,
  englishHourGroups,
  whatsappUrl,
} from "@/lib/site-content";
import { clsx } from "clsx";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import styles from "./en.module.css";

export const metadata: Metadata = {
  title: ENGLISH.title,
  description: ENGLISH.description,
  alternates: {
    canonical: "/en",
    languages: { fr: "/", en: "/en", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["fr_FR"],
    siteName: "Kech Waffles",
    url: `${SITE_URL}/en`,
    title: `${ENGLISH.title} · Kech Waffles`,
    description: ENGLISH.description,
    images: [
      { url: "/brand/og-image.jpg", width: 1200, height: 630, alt: "Kech Waffles logo, Marrakech" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${ENGLISH.title} · Kech Waffles`,
    description: ENGLISH.description,
    images: ["/brand/og-image.jpg"],
  },
};

/**
 * One page in English for the visitors who search in English, mostly travellers. The root
 * layout says `fr`: the page marks its own language, the navigation stays French.
 */
export default function EnglishPage() {
  return (
    <div lang="en">
      <JsonLd data={faqSchema(ENGLISH.faq.items)} />
      <Hero />
      <Coffee />
      <Croffles />
      <GirlsOnly />
      <AiCafe />
      <Visit />
      <FaqSection {...ENGLISH.faq} />
    </div>
  );
}

function Hero() {
  const { hero } = ENGLISH;

  return (
    <section className={styles.hero} aria-labelledby="en-title">
      <div className={clsx("kufic-grid", styles.heroGrid)} aria-hidden="true" />

      <div className={clsx("page-x", styles.heroStage)}>
        <IntroFade delay={0.1} className={styles.heroMeta}>
          <p className="text-eyebrow text-gold-400">{hero.eyebrow}</p>
          <p className="text-eyebrow text-cream-300">{hero.meta}</p>
        </IntroFade>

        <div className={styles.heroCopy}>
          <h1 id="en-title" className={styles.heroTitle}>
            {hero.titleLines.map((line, index) => (
              <span key={line} className="intro-line" style={lineStyle(index)}>
                <span>{line}</span>
              </span>
            ))}
            <span className="sr-only">{hero.titleSuffix}</span>
          </h1>
          <IntroFade delay={0.5} className={styles.heroFoot}>
            <p className="text-subhead max-w-[32rem] text-cream-200">{hero.lead}</p>
            <p className="text-eyebrow text-gold-400">{hero.note}</p>
            <div className={styles.actions}>
              <MagneticButton>
                <a href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer" className="cta">
                  <span className="cta__label">{hero.directionsCta}</span>
                  <ArrowUpRight className="cta__arrow size-4" aria-hidden="true" />
                </a>
              </MagneticButton>
              <MagneticButton>
                <a
                  href={CONTACT.glovoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta cta--outline"
                >
                  <span className="cta__label">{hero.deliveryCta}</span>
                </a>
              </MagneticButton>
            </div>
          </IntroFade>
        </div>

        <IntroFade delay={0.25} className={styles.heroDoor}>
          <div className={clsx("frame-arch parallax-frame", styles.fill)}>
            <ParallaxLayer strength={5}>
              <Image
                src="/images/site/facade-night.jpg"
                alt={hero.imageAlt}
                fill
                priority
                sizes="(min-width: 1440px) 520px, (min-width: 1024px) 36vw, 92vw"
                className="object-cover object-[center_34%]"
              />
            </ParallaxLayer>
          </div>
        </IntroFade>
      </div>
    </section>
  );
}

function Coffee() {
  const { coffee } = ENGLISH;

  return (
    <section
      aria-labelledby="en-coffee"
      className="section-rise section-pad bg-espresso-900 text-cream-50"
    >
      <div className={clsx("page-x", styles.split)}>
        <div className={styles.splitHead}>
          <Reveal>
            <p className="text-eyebrow text-gold-400">{coffee.eyebrow}</p>
          </Reveal>
          <RevealLines id="en-coffee" lines={coffee.titleLines} className="text-section mt-6" />
          <Reveal delay={0.1}>
            <p className="text-subhead mt-8 max-w-[34rem] text-cream-200">{coffee.intro}</p>
          </Reveal>
        </div>

        <Reveal y={24} className={styles.splitBody}>
          <dl className={styles.families}>
            {coffee.families.map((family) => (
              <div key={family.name} className={styles.family}>
                <dt className="text-eyebrow text-gold-400">{family.name}</dt>
                <dd className={styles.familyDrinks}>{family.drinks.join(" · ")}</dd>
              </div>
            ))}
          </dl>
          <div className={clsx("frame-arch", styles.coffeePhoto)}>
            <Image
              src="/images/site/espresso-latte.jpg"
              alt={coffee.imageAlt}
              fill
              sizes="(min-width: 1024px) 30vw, 80vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Croffles() {
  const { croffles } = ENGLISH;

  return (
    <section
      aria-labelledby="en-croffles"
      className="section-rise section-pad bg-cream-100 text-espresso-950"
    >
      <div className="page-x">
        <div className={styles.split}>
          <div className={styles.splitHead}>
            <Reveal>
              <p className="text-eyebrow text-terracotta-700">{croffles.eyebrow}</p>
            </Reveal>
            <RevealLines id="en-croffles" lines={croffles.titleLines} className="text-section mt-6" />
          </div>
          <Reveal delay={0.1} className={styles.splitBody}>
            <p className="text-subhead max-w-[34rem] text-espresso-700">{croffles.intro}</p>
            <MagneticButton className="mt-8">
              <Link href="/menu" hrefLang="fr" className="cta cta--ink">
                <span className="cta__label">{croffles.menuCta}</span>
                <ArrowUpRight className="cta__arrow size-4" aria-hidden="true" />
              </Link>
            </MagneticButton>
          </Reveal>
        </div>

        <ul className={styles.croffles}>
          {croffles.items.map((item, index) => {
            const photo = CROFFLE_PHOTOS.get(item.id);
            if (!photo) return null;
            return (
              <li key={item.id} className={styles.croffle}>
                <Reveal delay={index * 0.06} y={24}>
                  <div className={clsx("frame-arch", styles.croffleFrame)}>
                    <Image
                      src={photo.src}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 1024px) 22vw, 45vw"
                      className="object-cover"
                      style={{ objectPosition: photo.position }}
                    />
                  </div>
                  <p className={clsx("text-eyebrow", styles.croffleName)}>{item.name}</p>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function GirlsOnly() {
  const { girlsOnly } = ENGLISH;

  return (
    <section
      aria-labelledby="en-girls-only"
      className="section-rise section-pad bg-terracotta-700 text-cream-50"
    >
      <div className={clsx("page-x", styles.split)}>
        <div className={styles.splitHead}>
          <Reveal>
            <p className="text-eyebrow text-gold-200">{girlsOnly.eyebrow}</p>
          </Reveal>
          <RevealLines id="en-girls-only" lines={girlsOnly.titleLines} className="text-section mt-6" />
        </div>
        <Reveal delay={0.1} className={styles.splitBody}>
          <p className="text-subhead max-w-[34rem] text-cream-50">{girlsOnly.intro}</p>
        </Reveal>
      </div>
    </section>
  );
}

function AiCafe() {
  const { aiCafe } = ENGLISH;

  return (
    <section
      aria-labelledby="en-ai-cafe"
      className="section-rise section-pad bg-espresso-950 text-cream-50"
    >
      <div className={clsx("page-x", styles.split)}>
        <div className={styles.splitHead}>
          <Reveal>
            <p className="text-eyebrow text-zellige-400">{aiCafe.eyebrow}</p>
          </Reveal>
          <RevealLines id="en-ai-cafe" lines={aiCafe.titleLines} className="text-section mt-6" />
        </div>
        <Reveal delay={0.1} className={styles.splitBody}>
          <p className="text-subhead max-w-[34rem] text-cream-300">{aiCafe.intro}</p>
          <MagneticButton className="mt-8">
            <a
              href={whatsappUrl(aiCafe.message)}
              target="_blank"
              rel="noopener noreferrer"
              className="cta cta--zellige"
            >
              <span className="cta__label">{aiCafe.cta}</span>
              <ArrowUpRight className="cta__arrow size-4" aria-hidden="true" />
            </a>
          </MagneticButton>
        </Reveal>
      </div>
    </section>
  );
}

function Visit() {
  const { visit } = ENGLISH;

  return (
    <section
      aria-labelledby="en-visit"
      className="section-rise section-pad bg-cream-50 text-espresso-950"
    >
      <div className={clsx("page-x", styles.split)}>
        <div className={styles.splitHead}>
          <Reveal>
            <p className="text-eyebrow text-terracotta-700">{visit.eyebrow}</p>
          </Reveal>
          <RevealLines id="en-visit" lines={visit.titleLines} className="text-section mt-6" />
          <Reveal delay={0.1} className={styles.actions}>
            <MagneticButton>
              <a href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer" className="cta cta--ink">
                <span className="cta__label">{visit.mapsCta}</span>
                <ArrowUpRight className="cta__arrow size-4" aria-hidden="true" />
              </a>
            </MagneticButton>
            <MagneticButton>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="cta cta--ink-outline"
              >
                <span className="cta__label">{visit.whatsappCta}</span>
              </a>
            </MagneticButton>
          </Reveal>
        </div>

        <Reveal y={24} className={clsx(styles.splitBody, styles.visitBlocks)}>
          <div>
            <h3 className="text-eyebrow text-terracotta-700">{visit.addressTitle}</h3>
            <address className={styles.visitText}>
              {CONTACT.addressLine}
              <br />
              {CONTACT.city}, Morocco
              <br />
              <a href={`tel:${CONTACT.phoneE164}`} className={styles.visitLink}>
                {CONTACT.phoneDisplay}
              </a>
            </address>
          </div>
          <div>
            <h3 className="text-eyebrow text-terracotta-700">{visit.hoursTitle}</h3>
            <dl className={styles.hours}>
              {englishHourGroups().map(({ days, hours }) => (
                <div key={hours} className={styles.hoursRow}>
                  <dt>{days.join(", ")}</dt>
                  <dd>{hours}</dd>
                </div>
              ))}
            </dl>
            <p className={styles.hoursNote}>{visit.girlsOnlyNote}</p>
          </div>
          <div>
            <h3 className="text-eyebrow text-terracotta-700">{visit.accessTitle}</h3>
            <ul className={styles.visitText}>
              {visit.access.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function lineStyle(index: number) {
  return { "--line": index, "--intro-delay": "0.1s" } as CSSProperties;
}

const CROFFLE_PHOTOS = new Map(MENU_SECTION.croffles.map((croffle) => [croffle.id, croffle]));
