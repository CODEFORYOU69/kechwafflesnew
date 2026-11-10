import { JsonLd } from "@/app/components/JsonLd";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { formatMenuText } from "@/lib/menu-filter";
import { tryGetMenuProducts } from "@/lib/menu-products";
import { HERO, MENU_SECTION, SITE_URL } from "@/lib/site-content";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { CSSProperties } from "react";
import { MenuCatalog, type MenuProduct } from "./MenuCatalog";
import { publicMenuSections } from "./menu-tabs";
import styles from "./menu.module.css";

// The catalogue changes from the back office: the page is rebuilt at most every ten minutes.
export const revalidate = 600;

export default async function MenuPage() {
  const catalogue = await tryGetMenuProducts();
  const products = catalogue ? catalogue.map(toMenuProduct) : null;

  return (
    <>
      {products ? <JsonLd data={menuSchema(products)} /> : null}
      <MenuHero />
      <MenuCatalog initialProducts={products} />
    </>
  );
}

/**
 * The title is CSS-animated and server-rendered: it never waits for the catalogue. The
 * photo loads like the one of the home hero: any higher priority adds a Link header that
 * has Chrome preload the largest width of the srcset, on top of the one the page uses.
 */
function MenuHero() {
  return (
    <section aria-labelledby="menu-title" className={cn("bg-espresso-950 text-cream-50", styles.hero)}>
      <span className={cn("kufic-grid", styles.heroGrid)} aria-hidden="true" />

      <div className={cn("page-x", styles.heroInner)}>
        <div className={styles.heroStage}>
          <div className={cn("frame-arch parallax-frame", styles.heroFrame)}>
            <ParallaxLayer strength={5}>
              <Image
                src={HERO_PHOTO.src}
                alt={HERO_PHOTO.alt}
                fill
                loading="eager"
                fetchPriority="low"
                sizes="(min-width: 1024px) 36vw, 62vw"
                className="object-cover"
                style={{ objectPosition: HERO_PHOTO.position }}
              />
            </ParallaxLayer>
          </div>

          <p className={`text-eyebrow intro-fade ${styles.heroEyebrow}`} style={introDelay(0.35)}>
            {HERO.finalEyebrow}
          </p>

          <h1 id="menu-title" className={cn("text-mega", styles.heroTitle)}>
            {TITLE_WORDS.map((word, index) => (
              <span key={word} className="intro-line" style={wordStyle(index)}>
                <span>{word}</span>
              </span>
            ))}
            <span className="sr-only">{TITLE_SUFFIX}</span>
          </h1>
        </div>

        <p className={`text-subhead intro-fade ${styles.heroLead}`} style={introDelay(0.5)}>
          {PAGE_LEAD}
        </p>
      </div>
    </section>
  );
}

/** Only what the catalogue displays crosses to the browser: no price, no sync fields. */
function toMenuProduct(product: CatalogueProduct): MenuProduct {
  return {
    handle: product.handle,
    sku: product.sku,
    name: product.name,
    category: product.category,
    description: product.description,
    image: product.image,
    outOfStock: product.outOfStock,
    isActive: product.isActive,
    variants: product.variants.map(({ option1Value, option2Value }) => ({
      option1Value,
      option2Value,
    })),
  };
}

/** The whole menu, every tab included, for the engines that do not click through tabs. */
function menuSchema(products: MenuProduct[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${SITE_URL}/menu#carte`,
    name: "La carte de Kech Waffles, Marrakech",
    url: `${SITE_URL}/menu`,
    inLanguage: "fr",
    hasMenuSection: publicMenuSections(products).map(({ name, items }) => ({
      "@type": "MenuSection",
      name,
      hasMenuItem: items.map((item) => ({
        "@type": "MenuItem",
        name: formatMenuText(item.name),
        ...(item.description ? { description: formatMenuText(item.description) } : {}),
      })),
    })),
  };
}

function introDelay(seconds: number) {
  return { "--intro-delay": `${seconds}s` } as CSSProperties;
}

function wordStyle(index: number) {
  return { "--line": index, "--intro-delay": "0.1s" } as CSSProperties;
}

const HERO_PHOTO = MENU_SECTION.croffles[2];

const TITLE_WORDS = ["La", "carte"];
const TITLE_SUFFIX = " de Kech Waffles, café de spécialité et croffles à Marrakech";
const PAGE_LEAD =
  "Le sucré, tout ce qui se boit, le salé et les cans à emporter. La carte, à parcourir avant de pousser la porte.";

type CatalogueProduct = NonNullable<Awaited<ReturnType<typeof tryGetMenuProducts>>>[number];
