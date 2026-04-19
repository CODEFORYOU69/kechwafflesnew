"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Reveal } from "../components/Parallax";

type ProductVariant = {
  option1Name: string | null;
  option1Value: string | null;
  option2Name: string | null;
  option2Value: string | null;
  price: number;
};

type Product = {
  handle: string;
  sku: string;
  name: string;
  category: string;
  description?: string | null;
  price?: number | null;
  variants?: ProductVariant[];
  isModifier?: boolean;
  hasTax?: boolean;
  image?: string | null;
  outOfStock?: boolean;
  isActive?: boolean;
};

type Tab = {
  id: string;
  label: string;
  sublabel: string;
};

const tabs: Tab[] = [
  { id: "salees", label: "Salées", sublabel: "Pizza · Potato" },
  { id: "sucrees", label: "Sucrées", sublabel: "Gaufres · Bubble · Crêpes" },
  { id: "cans", label: "Cans", sublabel: "À emporter" },
  { id: "boissons", label: "Boissons", sublabel: "Cafés · Shakes · Jus" },
];

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("salees");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Erreur chargement produits:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--bg))]">
        <Loader2 className="h-10 w-10 animate-spin text-[hsl(var(--accent))]" />
      </div>
    );
  }

  const by = (cat: string) =>
    products.filter((p) => p.category === cat && p.isActive !== false);

  // Salées
  const basesSalees = by("Bases Salées");
  const saucesSalees = by("Sauces Salées");
  const recettesSignaturesSalees = by("Recettes Salées - Signatures");
  const recettesClassiquesSalees = by("Recettes Salées - Classiques");

  // Sucrées
  const basesSucrees = by("Bases Sucrées");
  const recettesSignaturesSucrees = by("Recettes Sucrées - Signatures");
  const dessertsCans = by("Desserts - Cans");

  // Boissons
  const cafes = by("Boissons - Cafés");
  const boissonsLactees = by("Boissons - Boissons Lactées");
  const milkshakes = by("Boissons - Milkshakes");
  const boissonsSpeciales = by("Boissons - Spécialisées");
  const boissonsIceLactees = by("Boissons Ice Lactées");
  const eauxSoftDrinks = by("Eaux & Soft Drinks");
  const jusFrais = by("Jus Frais Pressés");
  const shotsVitamines = by("Shots Vitaminés");

  // Supplements
  const saltyKeywords = [
    "jambon", "mozzarella", "olives", "pepperoni", "poulet", "thon",
    "viande", "cheddar", "oignons", "gruyère", "gruyere", "harissa",
    "mayo", "pesto", "saucisse", "fromage", "oeuf", "œuf",
  ];
  const normalize = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const allSupplements = by("Modificateurs");
  const supplementsSales = allSupplements.filter((p) => {
    const n = normalize(p.name);
    return saltyKeywords.some((kw) => n.includes(normalize(kw)));
  });
  const supplementsSucres = allSupplements.filter((p) => {
    const n = normalize(p.name);
    return !saltyKeywords.some((kw) => n.includes(normalize(kw)));
  });

  return (
    <>
      <MenuHero />

      <section className="bg-[hsl(var(--bg))] pb-32">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10">
          {/* Tab rail */}
          <div className="sticky top-[72px] z-30 -mx-6 mb-12 border-b border-white/5 bg-[hsl(var(--bg))]/85 px-6 backdrop-blur-xl md:top-[80px] md:-mx-10 md:px-10">
            <div className="flex gap-1 overflow-x-auto py-4 md:gap-2">
              {tabs.map((t) => {
                const isActive = active === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActive(t.id)}
                    className={[
                      "group relative flex flex-shrink-0 flex-col items-start rounded-[var(--radius-md)] px-5 py-3 text-left transition",
                      isActive
                        ? "bg-[hsl(var(--ink-900))]"
                        : "hover:bg-[hsl(var(--ink-900))]/50",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "font-display text-lg transition-colors",
                        isActive
                          ? "text-[hsl(var(--accent))]"
                          : "text-[hsl(var(--text))]",
                      ].join(" ")}
                    >
                      {t.label}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[hsl(var(--text-subtle))]">
                      {t.sublabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-20"
            >
              {active === "salees" && (
                <>
                  <Intro title="Composer sa gaufre salée" description="1. Base · 2. Sauce · 3. Recette · 4. Suppléments." />
                  <Group n="01" title="Les bases" items={basesSalees} />
                  <Group n="02" title="Les sauces" items={saucesSalees} />
                  <Group n="03" title="Recettes signatures" items={recettesSignaturesSalees} accent />
                  <Group n="04" title="Recettes classiques" items={recettesClassiquesSalees} />
                  <Group n="+" title="Suppléments salés" items={supplementsSales} compact />
                </>
              )}

              {active === "sucrees" && (
                <>
                  <Intro title="Composer son dessert" description="1. Base · 2. Recette ou libre · 3. Toppings." />
                  <Group n="01" title="Les bases" items={basesSucrees} />
                  <Group n="02" title="Créations signatures" items={recettesSignaturesSucrees} accent />
                  <Group n="+" title="Toppings" items={supplementsSucres} compact />
                </>
              )}

              {active === "cans" && (
                <>
                  <Intro title="Desserts à emporter" description="Nos créations en format nomade. Frais, hermétique, prêt à partir." />
                  <Group n="01" title="Nos cans" items={dessertsCans} />
                </>
              )}

              {active === "boissons" && (
                <>
                  <Intro title="Boissons signatures" description="Cafés, shakes, jus frais et shots vitaminés." />
                  <Group n="01" title="Cafés" items={cafes} />
                  <Group n="02" title="Lactées" items={boissonsLactees} />
                  <Group n="03" title="Ice lactées" items={boissonsIceLactees} />
                  <Group n="04" title="Milkshakes" items={milkshakes} />
                  <Group n="05" title="Spécialités" items={boissonsSpeciales} />
                  <Group n="06" title="Jus frais pressés" items={jusFrais} />
                  <Group n="07" title="Shots vitaminés" items={shotsVitamines} />
                  <Group n="08" title="Eaux & soft drinks" items={eauxSoftDrinks} />
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}

function MenuHero() {
  return (
    <section className="relative flex min-h-[60vh] items-end bg-[hsl(var(--ink-950))] px-6 pb-16 pt-40 md:min-h-[70vh] md:px-10">
      <div className="mx-auto w-full max-w-[1440px]">
        <Reveal>
          <p className="text-eyebrow mb-6 text-[hsl(var(--accent))]">
            — La carte
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="text-hero text-balance text-[hsl(var(--text))]">
            Tout ce qui
            <br />
            <span className="serif-italic text-[hsl(var(--accent))]">
              sort de l&apos;atelier.
            </span>
          </h1>
        </Reveal>
      </div>
    </section>
  );
}

function Intro({ title, description }: { title: string; description: string }) {
  return (
    <Reveal>
      <div className="flex flex-col gap-3 border-b border-white/5 pb-10 md:flex-row md:items-end md:justify-between">
        <h2 className="text-section text-[hsl(var(--text))]">{title}</h2>
        <p className="text-sm font-light text-[hsl(var(--text-muted))] md:max-w-sm md:text-right">
          {description}
        </p>
      </div>
    </Reveal>
  );
}

function Group({
  n,
  title,
  items,
  accent = false,
  compact = false,
}: {
  n: string;
  title: string;
  items: Product[];
  accent?: boolean;
  compact?: boolean;
}) {
  if (!items.length) return null;
  return (
    <div>
      <Reveal>
        <div className="mb-8 flex items-baseline gap-4">
          <span
            className={[
              "font-display text-2xl",
              accent ? "text-[hsl(var(--accent))]" : "text-[hsl(var(--text-subtle))]",
            ].join(" ")}
          >
            {n}
          </span>
          <h3 className="text-headline text-[hsl(var(--text))]">{title}</h3>
          <span className="h-px flex-1 bg-white/5" />
          <span className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--text-subtle))]">
            {items.length} {items.length > 1 ? "articles" : "article"}
          </span>
        </div>
      </Reveal>

      <div
        className={[
          "grid gap-4",
          compact
            ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        ].join(" ")}
      >
        {items.map((p, i) => (
          <MenuCard key={`${p.handle}-${p.sku}-${i}`} product={p} compact={compact} />
        ))}
      </div>
    </div>
  );
}

function MenuCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const isOut = product.outOfStock;
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={[
        "group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-white/5 bg-[hsl(var(--ink-900))] transition hover:border-white/15",
        isOut ? "opacity-60" : "",
      ].join(" ")}
    >
      {product.image && (
        <div className={`relative ${compact ? "aspect-square" : "aspect-[5/4]"} overflow-hidden bg-[hsl(var(--ink-800))]`}>
          <Image
            src={`/images/menu-items/${product.image}`}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className={`object-cover transition-transform duration-700 group-hover:scale-105 ${isOut ? "grayscale" : ""}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--ink-900))]/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          {isOut && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="rounded-[var(--radius-full)] bg-[hsl(var(--ink-950))]/80 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[hsl(var(--accent))] backdrop-blur">
                Victime de son succès
              </span>
            </div>
          )}
        </div>
      )}
      <div className={compact ? "p-4" : "p-6"}>
        <h4 className={`font-display ${compact ? "text-base" : "text-xl"} text-[hsl(var(--text))]`}>
          {product.name}
        </h4>
        {product.description && !compact && (
          <p className="mt-2 text-sm font-light leading-relaxed text-[hsl(var(--text-muted))]">
            {product.description}
          </p>
        )}
        {product.variants && product.variants.length > 0 && (
          <ul className="mt-3 space-y-1 text-xs font-light text-[hsl(var(--text-subtle))]">
            {product.variants.map((v, idx) => (
              <li key={idx}>
                {v.option1Value}
                {v.option2Value ? ` · ${v.option2Value}` : ""}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.article>
  );
}
