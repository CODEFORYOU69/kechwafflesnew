import { MagneticButton } from "@/components/motion/MagneticButton";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { Reveal, RevealLines } from "@/components/motion/Reveal";
import { GirlsOnlyAccess, GirlsOnlyPoster } from "@/components/sections/GirlsOnlySection";
import styles from "@/components/sections/GirlsOnlySection.module.css";
import { WeekStrip } from "@/components/sections/WeekStrip";
import { CONTACT, GIRLS_ONLY, MENU_SECTION } from "@/lib/site-content";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: GIRLS_ONLY.titleSr,
  description: GIRLS_ONLY.intro,
  alternates: { canonical: "/girls-only" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Kech Waffles",
    url: "/girls-only",
    title: `${GIRLS_ONLY.titleSr} · Kech Waffles`,
    description: GIRLS_ONLY.intro,
    images: [
      {
        url: "/brand/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Logo Kech Waffles, Marrakech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${GIRLS_ONLY.titleSr} · Kech Waffles`,
    description: GIRLS_ONLY.intro,
    images: ["/brand/og-image.jpg"],
  },
};

export default function GirlsOnlyPage() {
  return (
    <>
      <section
        aria-labelledby="girls-only-page-title"
        className={cn(styles.wall, styles.pageHero)}
      >
        <h1 id="girls-only-page-title" className="sr-only">
          {GIRLS_ONLY.titleSr}
        </h1>
        <GirlsOnlyPoster isPageOpening>
          <div className={styles.pageHeroActions}>
            <MagneticButton className={styles.actionWrap}>
              <a href="#venir" className={cn("cta cta--cream", styles.actionLink)}>
                <span className="cta__label">{COME_CTA}</span>
              </a>
            </MagneticButton>
            <MagneticButton className={styles.actionWrap}>
              <a href="#programme" className={cn("cta cta--outline", styles.actionLink)}>
                <span className="cta__label">{GIRLS_ONLY.programmeCta}</span>
              </a>
            </MagneticButton>
          </div>
        </GirlsOnlyPoster>
      </section>

      <section
        aria-labelledby="girls-only-moments-title"
        className="section-rise section-pad bg-espresso-900 text-cream-50"
      >
        <div className="page-x">
          <h2 id="girls-only-moments-title" className="sr-only">
            {MOMENTS_TITLE}
          </h2>
          <ul className={styles.gallery}>
            {GIRLS_ONLY.moments.map((moment, index) => (
              <li key={moment.id} className={styles.galleryItem}>
                <Reveal delay={index * 0.1}>
                  <div className={cn("frame-arch parallax-frame", styles.galleryFrame)}>
                    <ParallaxLayer strength={MOMENT_PHOTOS[moment.id].drift}>
                      <Image
                        src={MOMENT_PHOTOS[moment.id].src}
                        alt={MOMENT_PHOTOS[moment.id].alt}
                        fill
                        sizes={MOMENT_PHOTOS[moment.id].sizes}
                        className="object-cover"
                        style={{ objectPosition: MOMENT_PHOTOS[moment.id].position }}
                      />
                    </ParallaxLayer>
                  </div>
                  <div className={styles.galleryText}>
                    <p className={cn("text-eyebrow", styles.galleryIndex)}>{`0${index + 1}`}</p>
                    <h3 className="text-headline mt-2">{moment.name}</h3>
                    <p className={styles.galleryDetail}>{moment.detail}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="venir"
        aria-labelledby="girls-only-venir-title"
        className={cn("section-rise section-pad", styles.wall)}
      >
        <div className="page-x">
          <h2 id="girls-only-venir-title" className="sr-only">
            {COME_CTA}
          </h2>
          <WeekStrip />
          <GirlsOnlyAccess />
        </div>
      </section>

      <section
        id="programme"
        aria-labelledby="girls-only-programme-title"
        className="section-rise section-pad bg-cream-50 text-espresso-950"
      >
        <div className="page-x grid gap-8 lg:grid-cols-12 lg:gap-x-6">
          <RevealLines
            as="h2"
            id="girls-only-programme-title"
            lines={[GIRLS_ONLY.programmeTitle]}
            className={cn("text-hero lg:col-span-8", styles.programmeTitle)}
          />
          <Reveal y={20} className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="text-subhead text-espresso-700">{GIRLS_ONLY.programmeText}</p>
            <a
              href={CONTACT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("text-headline mt-6", styles.programmeLink)}
            >
              {CONTACT.instagramHandle}
              <span className="sr-only"> {INSTAGRAM_NOTICE}</span>
              <ArrowUpRight className="size-[0.8em]" aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}

const COME_CTA = "Comment venir";
const MOMENTS_TITLE = "Se retrouver, bosser, se détendre";
const INSTAGRAM_NOTICE = "(Instagram, s’ouvre dans un nouvel onglet)";

/**
 * Each photo shows what its moment names: a table for two, the latte, the croffle.
 * `sizes` is what the crop really renders, parallax scale included: the landscape
 * cappuccino covers its square frame by height, so it needs far more than the frame's width.
 */
const MOMENT_PHOTOS: Record<
  string,
  { src: string; alt: string; sizes: string; position: string; drift: number }
> = {
  retrouver: {
    src: "/images/site/latte-tray.jpg",
    alt: "Un latte et un espresso en verres double paroi, sur un plateau en bambou",
    sizes: "(min-width: 1440px) 625px, (min-width: 1024px) 44vw, 77vw",
    position: "50% 30%",
    drift: 6,
  },
  bosser: {
    src: "/images/site/cappuccino-top.jpg",
    alt: "Un cappuccino vu de dessus, sa mousse de lait dans un verre posé sur le granit du comptoir",
    sizes: "(min-width: 1440px) 615px, (min-width: 1024px) 43vw, 110vw",
    position: "49% 50%",
    drift: 3,
  },
  detendre: {
    src: "/images/site/croffle-caramel.jpg",
    alt: MENU_SECTION.croffles[0].alt,
    sizes: "(min-width: 1440px) 494px, (min-width: 1024px) 34vw, 77vw",
    position: "50% 55%",
    drift: 6,
  },
};
