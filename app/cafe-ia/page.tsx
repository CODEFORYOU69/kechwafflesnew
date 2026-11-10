import { MagneticButton } from "@/components/motion/MagneticButton";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { IntroFade, IntroLines, Reveal, RevealLines } from "@/components/motion/Reveal";
import styles from "@/components/sections/AICafeSection.module.css";
import { AccentedPeriod, KuficCircuit } from "@/components/sections/KuficCircuit";
import { ServiceTerminal } from "@/components/sections/ServiceTerminal";
import { AI_CAFE, COFFEE, GIRLS_ONLY, whatsappUrl } from "@/lib/site-content";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

// Missing from lib/site-content.ts, listed in the report and to validate with the team.
// Above `metadata`, which reads them as soon as the module loads.
const PAGE_TITLE = "Café IA et service informatique étudiant, Marrakech";
const PAGE_DESCRIPTION =
  "Un cadre pour travailler, coder et échanger autour de l’IA chez Kech Waffles, à Marrakech. Et un service informatique pour les étudiants : le code, les projets d’études, le CV et les dossiers scolaires.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/cafe-ia" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Kech Waffles",
    url: "/cafe-ia",
    title: `${PAGE_TITLE} · Kech Waffles`,
    description: PAGE_DESCRIPTION,
    // Declaring `openGraph` here replaces the layout's whole object, image included.
    images: [
      { url: "/brand/og-image.jpg", width: 1200, height: 630, alt: "Logo Kech Waffles, Marrakech" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${PAGE_TITLE} · Kech Waffles`,
    description: PAGE_DESCRIPTION,
    images: ["/brand/og-image.jpg"],
  },
};

export default function CafeIaPage() {
  return (
    // `stage`: the terminal lights the pins of the circuit above it, from another section.
    <div className={styles.stage}>
      <section aria-labelledby="cafe-ia-page-title" className={styles.pageHero}>
        <div className={cn("page-x", styles.pageHeroGrid)}>
          <KuficCircuit variant="hero" className={styles.pageHeroCircuit} />
          <div className={styles.pageHeroText}>
            <p className="text-eyebrow text-zellige-400">{EYEBROW}</p>
            <div className={styles.pageHeroLead}>
              <IntroFade delay={0.2} className={styles.pageHeroIntro}>
                <p className="text-subhead text-pretty text-cream-300">{AI_CAFE.intro}</p>
              </IntroFade>
              <IntroLines
                as="h1"
                id="cafe-ia-page-title"
                lines={[AI_CAFE.titleLines[0], <AccentedPeriod key="last" line={AI_CAFE.titleLines[1]} />]}
                className="text-hero text-cream-50"
              />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="cafe-ia-service-title" className={styles.pageService}>
        <h2 id="cafe-ia-service-title" className="sr-only">
          {SERVICE_HEADING}
        </h2>
        <div className="page-x">
          <div className={styles.terminalRow}>
            <Reveal y={48}>
              <ServiceTerminal />
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="cafe-ia-pillars-title" className={styles.pagePillars}>
        <div className={cn("page-x", styles.pagePillarsGrid)}>
          <Reveal y={48} className={styles.pagePhotoCell}>
            <div className={cn("frame-arch parallax-frame", styles.pagePhoto)}>
              <ParallaxLayer strength={4}>
                <Image
                  src={WALL_PHOTO.src}
                  alt={WALL_PHOTO.alt}
                  fill
                  sizes="(min-width: 1440px) 520px, (min-width: 768px) 38vw, calc(100vw - 3rem)"
                  className="object-cover object-[center_24%]"
                />
              </ParallaxLayer>
            </div>
          </Reveal>

          <div className={styles.pagePillarsBody}>
            <RevealLines
              id="cafe-ia-pillars-title"
              lines={PILLARS_HEADING_LINES}
              className="text-section text-cream-50"
            />
            <ol className={styles.pagePillarList}>
              {AI_CAFE.pillars.map((pillar, index) => (
                <li key={pillar.id} className={styles.pagePillar}>
                  <Reveal y={20} delay={index * 0.06} className={styles.pagePillarRow}>
                    <p className={styles.pagePillarIndex}>{String(index + 1).padStart(2, "0")}</p>
                    <h3 className={styles.pagePillarName}>{pillar.name}</h3>
                    <p className={styles.pagePillarDetail}>{pillar.detail}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="cafe-ia-contact-title"
        className={cn("section-rise", styles.pageContact)}
      >
        <div className={cn("page-x", styles.pageContactGrid)}>
          <RevealLines
            id="cafe-ia-contact-title"
            lines={CONTACT_HEADING_LINES}
            className={cn("text-hero", styles.pageContactTitle)}
          />
          <Reveal delay={0.12} className={styles.pageContactAction}>
            <p className={styles.pageContactNote}>{CONTACT_NOTE}</p>
            <p className={styles.pageContactNote}>{GIRLS_ONLY.closedNote}</p>
            <MagneticButton>
              <a
                href={whatsappUrl(AI_CAFE.ctaDefaultMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className={cn("cta", styles.pageContactCta)}
              >
                <span className="cta__label">{AI_CAFE.ctaLabel}</span>
                <span className="sr-only"> {NEW_TAB_NOTE}</span>
                <ArrowUpRight className="cta__arrow size-4" aria-hidden="true" />
              </a>
            </MagneticButton>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

const SERVICE_HEADING = "Le service informatique : ce qu’on peut faire avec vous";
const PILLARS_HEADING_LINES = ["Trois raisons", "de pousser la porte."];
const CONTACT_HEADING_LINES = ["Ça coince ?", "Écrivez-nous."];
const CONTACT_NOTE =
  "Dites-nous ce qu’il vous faut, le message est déjà prêt. La suite se passe sur WhatsApp, puis au comptoir.";
const NEW_TAB_NOTE = "sur WhatsApp, dans un nouvel onglet";

// The emblem in real life, on the wall of the café: what the circuit above is drawn from.
const WALL_PHOTO = COFFEE.stationImages.side;
// The number only makes sense in the series on the home page.
const EYEBROW = "Café IA";
