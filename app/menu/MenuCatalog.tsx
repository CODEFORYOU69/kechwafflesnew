"use client";

import { useLenis } from "lenis/react";
import { Reveal } from "@/components/motion/Reveal";
import {
  formatMenuText,
  isEventOnlyProduct,
  normalizeText,
  resolveProductImage,
} from "@/lib/menu-filter";
import { whatsappUrl, MENU_SECTION } from "@/lib/site-content";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { TABS, type GroupVariant, type MenuGroup } from "./menu-tabs";
import styles from "./menu.module.css";

/**
 * The page renders the catalogue on the server, so search engines and AI crawlers read it
 * without running a script. That copy can be ten minutes old: the browser refreshes it from
 * `/api/products`, for the stock above all, and loads it alone when the server had none.
 */
export function MenuCatalog({ initialProducts }: { initialProducts: MenuProduct[] | null }) {
  const [products, setProducts] = useState<MenuProduct[]>(initialProducts ?? []);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    initialProducts ? "ready" : "loading",
  );
  const [activeId, setActiveId] = useState(TABS[0].id);
  const lenis = useLenis();
  const railRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // `/menu?onglet=cans`: read after mount, the server sends the default tab.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get(TAB_PARAM);
    if (requested && TABS.some((tab) => tab.id === requested)) setActiveId(requested);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/products", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data: { products: MenuProduct[] }) => {
        setProducts(data.products);
        setStatus("ready");
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error("Erreur chargement produits:", error);
        // The server copy stays on screen: only a menu with nothing to show is an error.
        if (!initialProducts) setStatus("error");
      });

    return () => controller.abort();
  }, [initialProducts]);

  useEffect(() => {
    const rail = railRef.current;
    const sentinel = sentinelRef.current;
    if (!rail || !sentinel) return;

    // An attribute, not state: crossing this line must not render the whole catalogue.
    const observer = new IntersectionObserver(([entry]) => {
      rail.dataset.docked = String(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const shelves = useMemo(() => buildShelves(products), [products]);
  const activeTab = TABS.find((tab) => tab.id === activeId) ?? TABS[0];

  function selectTab(tabId: string) {
    setActiveId(tabId);

    // A long tab leaves the reader far down the page: the next one starts from its top.
    const rail = railRef.current;
    const section = rail?.parentElement;
    if (!rail || !section) return;
    const top =
      section.getBoundingClientRect().top +
      window.scrollY +
      parseFloat(getComputedStyle(section).paddingTop) -
      parseFloat(getComputedStyle(rail).top);
    if (window.scrollY <= top) return;
    // Lenis rewrites the position on each frame of its inertia: a native jump would be lost.
    if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
    else window.scrollTo({ top });
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const current = TABS.findIndex((tab) => tab.id === activeTab.id);
    const next = nextTabIndex(event.key, current);
    if (next === null) return;

    event.preventDefault();
    selectTab(TABS[next].id);
    document.getElementById(tabElementId(TABS[next].id))?.focus();
  }

  return (
    <>
      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />

      <section
        aria-labelledby={PANEL_TITLE_ID}
        className={cn("section-rise section-pad bg-cream-100 text-espresso-950", styles.catalog)}
      >
        <div ref={railRef} className={styles.rail}>
          <div className="page-x">
            <div
              role="tablist"
              aria-label={TABS_LABEL}
              className={cn("no-scrollbar", styles.tabs)}
              onKeyDown={onTabKeyDown}
            >
              {TABS.map((tab, index) => {
                const isActive = tab.id === activeTab.id;
                return (
                  <button
                    key={tab.id}
                    id={tabElementId(tab.id)}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={PANEL_ID}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => selectTab(tab.id)}
                    className={styles.tab}
                  >
                    <span className={cn("text-eyebrow", styles.tabIndex)}>{formatIndex(index + 1)}</span>
                    <span className={styles.tabLabel}>{tab.label}</span>
                    <span className={cn("text-eyebrow", styles.tabSublabel)}>{tab.sublabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div
          key={activeTab.id}
          id={PANEL_ID}
          role="tabpanel"
          aria-labelledby={tabElementId(activeTab.id)}
          tabIndex={0}
          aria-busy={status === "loading"}
          className={cn("page-x", styles.panel)}
        >
          <header className={styles.panelHeader}>
            <h2 id={PANEL_TITLE_ID} className="text-section">
              {activeTab.title}
            </h2>
            <p className={cn("text-eyebrow", styles.panelSteps)}>{activeTab.description}</p>
          </header>

          {activeTab.id === FRESH_TAB ? <FreshGroup /> : null}
          {status === "loading" ? <CatalogSkeleton /> : null}
          {status === "error" ? <CatalogError /> : null}
          {status === "ready"
            ? activeTab.groups.map((group) => (
                <ProductGroup key={group.title} group={group} items={shelves(group)} />
              ))
            : null}
        </div>
      </section>
    </>
  );
}

/** Baked on site, so not in the catalogue: the cookies, brownies, brioches and cakes of the day. */
function FreshGroup() {
  return (
    <div className={styles.group}>
      <Reveal y={20} className={styles.groupHeader}>
        <span className={cn("text-eyebrow", styles.groupMarker)}>{FRESH_MARKER}</span>
        <h3 className="text-headline">{MENU_SECTION.freshTitle}</h3>
        <span className={styles.groupLine} aria-hidden="true" />
        <span className={cn("text-eyebrow", styles.groupCount)}>{MENU_SECTION.freshNote}</span>
      </Reveal>
      <ul className={cn(styles.items, styles.items_regular)}>
        {MENU_SECTION.fresh.map((item) => (
          <li key={item.id} className={cn(styles.item, styles.item_regular)}>
            <div className={styles.itemText}>
              <h4 className={styles.itemName}>{item.name}</h4>
              <p className={styles.itemDescription}>{item.detail}</p>
            </div>
            <div className={cn("frame-arch", styles.visual)}>
              <Image
                src={item.src}
                alt=""
                fill
                sizes={VISUAL_SIZES.regular}
                className="object-cover"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductGroup({ group, items }: { group: MenuGroup; items: MenuProduct[] }) {
  if (items.length === 0) return null;
  const variant = group.variant ?? "regular";

  return (
    <div className={styles.group}>
      <Reveal y={20} className={styles.groupHeader}>
        <span className={cn("text-eyebrow", styles.groupMarker)}>{group.marker}</span>
        <h3 className="text-headline">{group.title}</h3>
        <span className={styles.groupLine} aria-hidden="true" />
        <span className={cn("text-eyebrow", styles.groupCount)}>
          {items.length} {items.length > 1 ? "articles" : "article"}
        </span>
      </Reveal>

      <ul className={cn(styles.items, styles[`items_${variant}`])}>
        {items.map((product) => (
          <ProductItem key={`${product.handle}-${product.sku}`} product={product} variant={variant} />
        ))}
      </ul>
    </div>
  );
}

function ProductItem({ product, variant }: { product: MenuProduct; variant: GroupVariant }) {
  const name = formatMenuText(product.name);
  const options = (product.variants ?? [])
    .map((option) =>
      [option.option1Value, option.option2Value]
        .filter((value) => value && !HIDDEN_OPTIONS.has(value))
        .map((value) => frenchOption(value as string))
        .join(" · "),
    )
    .filter(Boolean);

  return (
    <li className={cn(styles.item, styles[`item_${variant}`])} data-out={product.outOfStock || undefined}>
      <div className={styles.itemText}>
        <h4 className={styles.itemName}>{name}</h4>
        {product.description && variant !== "compact" ? (
          <p className={styles.itemDescription}>{formatMenuText(product.description)}</p>
        ) : null}
        {options.length > 0 ? (
          <p className={styles.itemOptions}>{options.map(formatMenuText).join(" · ")}</p>
        ) : null}
        {product.outOfStock ? <p className={cn("text-eyebrow", styles.itemOut)}>{OUT_OF_STOCK}</p> : null}
      </div>
      <ProductVisual product={product} name={name} variant={variant} />
    </li>
  );
}

function ProductVisual({
  product,
  name,
  variant,
}: {
  product: MenuProduct;
  name: string;
  variant: GroupVariant;
}) {
  const [hasFailed, setHasFailed] = useState(false);
  const src = resolveProductImage(product);

  if (!src || hasFailed) {
    return (
      <div className={cn("frame-arch", styles.visual, styles.visualTile)} aria-hidden="true">
        <span className={styles.visualInitial}>{initialOf(name)}</span>
      </div>
    );
  }

  return (
    <div className={cn("frame-arch", styles.visual)}>
      <Image
        src={src}
        alt=""
        fill
        sizes={VISUAL_SIZES[variant]}
        onError={() => setHasFailed(true)}
        className="object-cover"
      />
    </div>
  );
}

function CatalogSkeleton() {
  return (
    <div className={styles.skeleton}>
      <p className="sr-only">{LOADING_LABEL}</p>
      <noscript>
        <p className="text-headline text-balance">{NOSCRIPT_NOTE}</p>
      </noscript>
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className={styles.skeletonItem} aria-hidden="true">
          <span />
          <span />
        </div>
      ))}
    </div>
  );
}

function CatalogError() {
  return (
    <div className={styles.error} role="status">
      <p className="text-headline text-balance">{ERROR_TITLE}</p>
      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="cta cta--ink mt-6"
      >
        <span className="cta__label">{ERROR_CTA}</span>
      </a>
    </div>
  );
}

/** Sorts the visible catalogue once; each group then reads its shelf. */
function buildShelves(products: MenuProduct[]) {
  const visible = products.filter(
    (product) => product.isActive !== false && !isEventOnlyProduct(product),
  );

  return (group: MenuGroup) => {
    if (group.category) {
      // The croffle base opens the list: the catalogue itself sorts by name.
      return visible
        .filter((product) => product.category === group.category)
        .sort((a, b) => Number(b.handle === LEAD_PRODUCT) - Number(a.handle === LEAD_PRODUCT));
    }

    const modifiers = visible.filter((product) => product.category === MODIFIERS_CATEGORY);
    if (group.modifiers === "drink") {
      return modifiers.filter((product) => DRINK_OPTIONS.has(product.handle));
    }
    return modifiers.filter(
      (product) =>
        !DRINK_OPTIONS.has(product.handle) &&
        isSavoury(product.name) === (group.modifiers === "savoury"),
    );
  };
}

/** « Small 25cl » reads « Petit 25cl »: the catalogue keeps its own values. */
function frenchOption(value: string) {
  const [size, ...rest] = value.split(" ");
  return [OPTION_LABELS[size] ?? size, ...rest].join(" ");
}

function isSavoury(name: string) {
  const normalized = normalizeText(name);
  return SAVOURY_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

function nextTabIndex(key: string, current: number) {
  if (key === "ArrowRight") return (current + 1) % TABS.length;
  if (key === "ArrowLeft") return (current - 1 + TABS.length) % TABS.length;
  if (key === "Home") return 0;
  if (key === "End") return TABS.length - 1;
  return null;
}

/** The letter a typographic tile shows: « La Souss-Massa » gives S, « L’Oasis » gives O. */
function initialOf(name: string) {
  return name.replace(/^(la |le |les |l’)/i, "").charAt(0).toUpperCase();
}

function formatIndex(value: number) {
  return String(value).padStart(2, "0");
}

function tabElementId(tabId: string) {
  return `menu-tab-${tabId}`;
}

const PANEL_ID = "menu-panel";
const PANEL_TITLE_ID = "menu-panel-title";
const TABS_LABEL = "Rubriques de la carte";
const OUT_OF_STOCK = "Victime de son succès";
const LOADING_LABEL = "Chargement de la carte…";
const NOSCRIPT_NOTE = "La carte a besoin de JavaScript pour s’afficher. Demandez-la au comptoir.";
const ERROR_TITLE = "La carte ne s’affiche pas pour le moment. Demandez-la au comptoir, ou écrivez-nous.";
const ERROR_CTA = "Écrire sur WhatsApp";
const MODIFIERS_CATEGORY = "Modificateurs";
const TAB_PARAM = "onglet";
const FRESH_TAB = "sucrees";
const FRESH_MARKER = "Jour";
const LEAD_PRODUCT = "base-craffle";
// Plant milk, espresso shot and syrups go with the drinks, not on a dessert.
const DRINK_OPTIONS = new Set(["ext-soj", "shot-espresso", "sir-van"]);
const HIDDEN_OPTIONS = new Set(["Autre"]);
const OPTION_LABELS: Record<string, string> = { Small: "Petit", Medium: "Moyen", Large: "Grand" };

const SAVOURY_KEYWORDS = [
  "jambon",
  "mozzarella",
  "olives",
  "pepperoni",
  "poulet",
  "thon",
  "viande",
  "cheddar",
  "oignons",
  "gruyere",
  "harissa",
  "mayo",
  "pesto",
  "saucisse",
  "fromage",
  "oeuf",
  "œuf",
  "champignon",
  "legume",
];


const VISUAL_SIZES: Record<GroupVariant, string> = {
  regular: "(min-width: 1024px) 8rem, 6rem",
  signature: "(min-width: 1024px) 18rem, 40vw",
  compact: "3rem",
};

type ProductVariant = {
  option1Value: string | null;
  option2Value: string | null;
};

export type MenuProduct = {
  handle: string;
  sku: string;
  name: string;
  category: string;
  description?: string | null;
  variants?: ProductVariant[];
  image?: string | null;
  outOfStock?: boolean;
  isActive?: boolean;
};
