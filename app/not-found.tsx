import { MagneticButton } from "@/components/motion/MagneticButton";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="page-x relative isolate flex min-h-[100svh] flex-col justify-end overflow-clip pb-12 pt-[calc(var(--nav-h)+2rem)] lg:pb-16">
      <Image
        src="/brand/emblem.svg"
        alt=""
        width={436}
        height={652}
        className="absolute right-[6vw] top-[calc(var(--nav-h)+1.5rem)] -z-10 h-[46svh] w-auto opacity-25"
      />
      <p className="text-eyebrow text-gold-400">Erreur 404</p>
      <h1 className="text-hero mt-4 max-w-[12ch] text-cream-50">Cette porte n’existe pas.</h1>
      <p className="text-subhead mt-5 max-w-md text-cream-200">
        La page a changé d’adresse, ou n’a jamais existé. Le comptoir, lui, n’a pas bougé.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <MagneticButton>
          <Link href="/" className="cta">
            <span className="cta__label">Revenir à l’accueil</span>
            <ArrowUpRight className="cta__arrow size-4" aria-hidden="true" />
          </Link>
        </MagneticButton>
        <MagneticButton>
          <Link href="/menu" className="cta cta--outline">
            <span className="cta__label">Voir la carte</span>
          </Link>
        </MagneticButton>
      </div>
    </section>
  );
}
