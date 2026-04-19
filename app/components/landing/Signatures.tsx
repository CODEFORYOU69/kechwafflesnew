"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "../Parallax";

type Sig = {
  n: string;
  title: string;
  caption: string;
  image: string;
};

const signatures: Sig[] = [
  {
    n: "S/01",
    title: "Tiramisu Waffle",
    caption:
      "Gaufre sucrée, crème mascarpone au café, cacao Van Houten. Notre création exclusive.",
    image: "/images/menu-items/wafflestiramisu.png",
  },
  {
    n: "S/02",
    title: "Pizza Waffle",
    caption:
      "Gaufre salée maison, base tomate ou crème, garnitures au choix. Gratinée au four.",
    image: "/images/menu-items/wafflepizza.png",
  },
  {
    n: "S/03",
    title: "Bubble Waffle",
    caption:
      "La gaufre bulle de Hong Kong revisitée. Glace artisanale, fruits frais, sauces maison.",
    image: "/images/menu-items/bubbles.jpg",
  },
  {
    n: "S/04",
    title: "TiCanMisu",
    caption:
      "Tiramisu signature en canette. Dubai Chocolate, Amlou, Speculoos. Nomade, frais.",
    image: "/images/menu-items/ticanmisu.jpg",
  },
];

export function Signatures() {
  return (
    <section className="relative bg-[hsl(var(--ink-900))] py-32 md:py-40">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10">
        <div className="mb-16 flex flex-col justify-between gap-8 md:mb-24 md:flex-row md:items-end">
          <div>
            <Reveal>
              <p className="text-eyebrow mb-6 text-[hsl(var(--accent))]">
                — Signatures
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-section text-balance text-[hsl(var(--text))]">
                Quatre créations.
                <br />
                <span className="serif-italic text-[hsl(var(--text-muted))]">
                  Aucun compromis.
                </span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <Link
              href="/menu"
              className="group inline-flex items-center gap-3 self-start text-sm uppercase tracking-[0.18em] text-[hsl(var(--text-muted))] hover:text-[hsl(var(--accent))]"
            >
              Toute la carte
              <span className="inline-block h-px w-12 bg-current transition-all group-hover:w-16" />
            </Link>
          </Reveal>
        </div>

        <ul className="divide-y divide-white/5 border-y border-white/5">
          {signatures.map((s, i) => (
            <SignatureRow key={s.n} sig={s} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function SignatureRow({ sig, index }: { sig: Sig; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 1.04]);

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative grid grid-cols-12 items-center gap-6 py-10 md:py-14"
    >
      <span className="col-span-2 font-display text-sm text-[hsl(var(--text-subtle))] md:text-base">
        {sig.n}
      </span>

      <div className="col-span-10 flex flex-col justify-between gap-4 md:col-span-5 md:col-start-3">
        <h3 className="text-headline text-[hsl(var(--text))] transition-colors group-hover:text-[hsl(var(--accent))]">
          {sig.title}
        </h3>
        <p className="max-w-md text-[15px] font-light leading-relaxed text-[hsl(var(--text-muted))]">
          {sig.caption}
        </p>
      </div>

      <div className="relative col-span-12 aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] md:col-span-4 md:col-start-9 md:aspect-[5/4]">
        <motion.div style={{ y, scale }} className="absolute inset-0">
          <Image
            src={sig.image}
            alt={sig.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </motion.div>
      </div>
    </motion.li>
  );
}
