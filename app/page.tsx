import { AICafeSection } from "@/components/sections/AICafeSection";
import { CoffeeSection } from "@/components/sections/CoffeeSection";
import { EventsSection } from "@/components/sections/EventsSection";
import { GirlsOnlySection } from "@/components/sections/GirlsOnlySection";
import { HeroParallax } from "@/components/sections/HeroParallax";
import { MenuGrid } from "@/components/sections/MenuGrid";
import { VisitSection } from "@/components/sections/VisitSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <HeroParallax />
      <CoffeeSection />
      <MenuGrid />
      <GirlsOnlySection />
      <AICafeSection />
      <EventsSection />
      <VisitSection />
    </>
  );
}
