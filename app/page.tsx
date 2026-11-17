import { AICafeSection } from "@/components/sections/AICafeSection";
import { CoffeeSection } from "@/components/sections/CoffeeSection";
import { EventsSection } from "@/components/sections/EventsSection";
import { GirlsOnlySection } from "@/components/sections/GirlsOnlySection";
import { HeroParallax, type HeroPillar } from "@/components/sections/HeroParallax";
import { MenuGrid } from "@/components/sections/MenuGrid";
import { VisitSection } from "@/components/sections/VisitSection";
import { PILLARS, hoursSummary } from "@/lib/site-content";
import { cafeSchedule, homeSectionIndexes } from "@/lib/site-settings";
import { getSiteSettings } from "@/lib/site-settings.server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  // The English page is this one translated: Google shows each to its own language.
  alternates: {
    canonical: "/",
    languages: { fr: "/", en: "/en", "x-default": "/" },
  },
};

/** The sections the admin shows in `/admin/site`, numbered in the order they appear. */
export default async function Home() {
  const settings = await getSiteSettings();
  const schedule = cafeSchedule(settings);
  const index = homeSectionIndexes(settings.sections);
  const pillars: HeroPillar[] = PILLARS.flatMap((pillar) => {
    const number = index[pillar.section];
    return number
      ? [{ index: number, label: pillar.label, short: pillar.short, href: `/#${pillar.section}` }]
      : [];
  });

  return (
    <>
      <HeroParallax pillars={pillars} hoursNote={hoursSummary(schedule.days)} />
      {index.cafe ? <CoffeeSection index={index.cafe} /> : null}
      {index.carte ? <MenuGrid index={index.carte} /> : null}
      {index["girls-only"] ? (
        <GirlsOnlySection index={index["girls-only"]} schedule={schedule} />
      ) : null}
      {index["cafe-ia"] ? <AICafeSection index={index["cafe-ia"]} /> : null}
      {index.prestations ? <EventsSection index={index.prestations} /> : null}
      <VisitSection index={index.visite} schedule={schedule} />
    </>
  );
}
