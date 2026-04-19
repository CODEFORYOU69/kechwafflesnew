"use client";

import Image from "next/image";
import { Clock, Facebook, Instagram, MapPin, MessageCircle } from "lucide-react";
import { Reveal, Parallax } from "../components/Parallax";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export default function Location() {
  return (
    <>
      <LocationHero />
      <Details />
      <DirectionsStrip />
    </>
  );
}

function LocationHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[70vh] items-end overflow-hidden bg-[hsl(var(--ink-950))] px-6 pb-16 pt-40 md:min-h-[80vh] md:px-10 md:pb-24"
    >
      <motion.div style={{ y }} className="absolute inset-0 -z-10">
        <Image
          src="/images/story/hero-background.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[hsl(var(--ink-950))]/60 via-transparent to-[hsl(var(--ink-950))]" />

      <div className="mx-auto w-full max-w-[1440px]">
        <Reveal>
          <p className="text-eyebrow mb-6 text-[hsl(var(--accent))]">
            — Venir nous voir
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="text-hero text-balance text-[hsl(var(--text))]">
            MAG 33
            <br />
            <span className="serif-italic text-[hsl(var(--accent))]">Al Badii.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.25}>
          <p className="mt-8 max-w-xl text-subhead text-[hsl(var(--text-muted))]">
            À quinze minutes à pied de Jemaa el-Fna. Parking gratuit à
            proximité, arrêt de bus à deux pas.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Details() {
  return (
    <section className="bg-[hsl(var(--bg))] py-24 md:py-32">
      <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-6 md:grid-cols-12 md:gap-16 md:px-10">
        {/* Map */}
        <Reveal className="md:col-span-7">
          <div className="group relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-white/10 bg-[hsl(var(--ink-900))]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3395.915660444416!2d-8.0031921!3d31.663527100000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafede897f96e29%3A0x9b0246bfdfaea5bc!2skech%20Waffles!5e0!3m2!1sfr!2sfr!4v1739146023050!5m2!1sfr!2sfr"
              loading="lazy"
              className="h-full w-full grayscale contrast-[1.1] transition-all duration-700 group-hover:grayscale-0"
              style={{ filter: "invert(92%) hue-rotate(180deg) grayscale(100%) contrast(95%)" }}
              title="Kech Waffles Marrakech"
            />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://maps.app.goo.gl/CpcUoJM1worpgeUZ9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[var(--radius-full)] bg-[hsl(var(--accent))] px-5 py-3 text-sm font-medium text-[hsl(var(--ink-950))] transition hover:bg-[hsl(var(--accent-soft))]"
            >
              <MapPin className="h-4 w-4" />
              Ouvrir dans Google Maps
            </a>
            <a
              href="https://www.waze.com/ul?ll=31.663527,-8.003192&navigate=yes"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-white/15 px-5 py-3 text-sm font-light text-[hsl(var(--text))] transition hover:border-white/30 hover:bg-white/5"
            >
              Ouvrir dans Waze
            </a>
          </div>
        </Reveal>

        {/* Info cards */}
        <div className="space-y-6 md:col-span-5">
          <Reveal delay={0.1}>
            <InfoBlock icon={<MapPin className="h-4 w-4" />} title="Adresse">
              <p className="text-subhead text-[hsl(var(--text))]">
                MAG 33 AL BADII
                <br />
                Marrakech, Maroc
              </p>
            </InfoBlock>
          </Reveal>

          <Reveal delay={0.18}>
            <InfoBlock icon={<Clock className="h-4 w-4" />} title="Horaires">
              <ul className="space-y-2 text-[hsl(var(--text-muted))]">
                <HourRow d="Lundi – Jeudi" h="10h – 22h" />
                <HourRow d="Vendredi" h="17h – 02h" />
                <HourRow d="Samedi" h="10h – 02h" />
                <HourRow d="Dimanche" h="11h – 22h" />
              </ul>
            </InfoBlock>
          </Reveal>

          <Reveal delay={0.26}>
            <InfoBlock icon={<MessageCircle className="h-4 w-4" />} title="Suivre">
              <div className="flex gap-5 text-[hsl(var(--text-muted))]">
                <a href="https://instagram.com/kech_waffles" target="_blank" rel="noopener noreferrer" className="transition hover:text-[hsl(var(--accent))]" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="https://facebook.com/kechwaffles" target="_blank" rel="noopener noreferrer" className="transition hover:text-[hsl(var(--accent))]" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="https://tiktok.com/@kechwaffles" target="_blank" rel="noopener noreferrer" className="transition hover:text-[hsl(var(--accent))]" aria-label="TikTok">
                  <TikTokIcon className="h-5 w-5" />
                </a>
              </div>
            </InfoBlock>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function InfoBlock({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-white/10 bg-[hsl(var(--ink-900))] p-8 transition hover:border-white/20">
      <div className="flex items-center gap-3 text-[hsl(var(--accent))]">
        {icon}
        <span className="text-eyebrow">{title}</span>
      </div>
      <div className="mt-5 text-[15px] font-light leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function HourRow({ d, h }: { d: string; h: string }) {
  return (
    <li className="flex items-baseline justify-between gap-4 border-b border-white/5 pb-2">
      <span className="text-[hsl(var(--text-subtle))]">{d}</span>
      <span className="font-display text-[hsl(var(--text))]">{h}</span>
    </li>
  );
}

function DirectionsStrip() {
  const modes = [
    { title: "À pied", desc: "15 min depuis Jemaa el-Fna" },
    { title: "En voiture", desc: "Parking gratuit à proximité" },
    { title: "En bus", desc: "Ligne 17 · Arrêt Al Badii" },
  ];
  return (
    <section className="relative overflow-hidden bg-[hsl(var(--ink-900))] py-24 md:py-32">
      <Parallax speed={0.75} className="pointer-events-none absolute inset-0 -z-10">
        <div className="relative h-full w-full opacity-20">
          <Image
            src="/images/story/gallery-4.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </Parallax>

      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10">
        <div className="mb-12">
          <Reveal>
            <p className="text-eyebrow mb-4 text-[hsl(var(--accent))]">
              — Nous rejoindre
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-section text-[hsl(var(--text))]">
              Trois chemins,
              <br />
              <span className="serif-italic text-[hsl(var(--text-muted))]">
                une destination.
              </span>
            </h2>
          </Reveal>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {modes.map((m, i) => (
            <Reveal key={m.title} delay={0.1 + i * 0.08}>
              <div className="flex h-full flex-col justify-between rounded-[var(--radius-lg)] border border-white/10 bg-[hsl(var(--ink-950))]/60 p-8 backdrop-blur-sm">
                <span className="text-eyebrow text-[hsl(var(--text-subtle))]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="mt-16">
                  <h3 className="font-display text-3xl text-[hsl(var(--text))]">
                    {m.title}
                  </h3>
                  <p className="mt-3 text-sm font-light text-[hsl(var(--text-muted))]">
                    {m.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
