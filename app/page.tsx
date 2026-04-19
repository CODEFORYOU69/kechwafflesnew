import Hero from "./components/Hero";
import { Marquee } from "./components/landing/Marquee";
import { Signatures } from "./components/landing/Signatures";
import { Manifesto } from "./components/landing/Manifesto";
import { Ingredients } from "./components/landing/Ingredients";
import { VisitCTA } from "./components/landing/VisitCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Manifesto />
      <Signatures />
      <Ingredients />
      <VisitCTA />
    </>
  );
}
