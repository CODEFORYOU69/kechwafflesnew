import { EVENT_ONLY_PRODUCT_HANDLES, MENU_IMAGE_OVERRIDES } from "./site-content";

/**
 * What the public menu shows from the catalogue. The database stays untouched:
 * these rules only decide what reaches the page.
 */

/** Traditional waffles are served at events only: they never appear on the menu. */
export function isEventOnlyProduct(product: { handle: string; name: string }) {
  return (
    EVENT_ONLY_PRODUCT_HANDLES.includes(product.handle) ||
    EVENT_ONLY_NAME.test(normalizeText(product.name))
  );
}

/** The photo to show for a product, or `null` when it has none worth calling a photo. */
export function resolveProductImage(product: { handle: string; image?: string | null }) {
  const override = MENU_IMAGE_OVERRIDES[product.handle];
  if (override) return override;
  if (!product.image || LOGO_COPIES.has(product.image)) return null;
  return `/images/menu-items/${product.image}`;
}

/** Catalogue text as printed on the menu: no decorative emoji, typographic apostrophes, « croffle ». */
export function formatMenuText(text: string) {
  return text
    .replace(PICTOGRAPHS, "")
    .replace(/'/g, "’")
    .replace(/craffle/gi, (match) => (match[0] === "C" ? "Croffle" : "croffle"))
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Lowercase and without accents, for matching catalogue names. */
export function normalizeText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

const EVENT_ONLY_NAME = /\bgauf+res?\s+(de\s+)?(liege(oises?)?|bruxelles)\b/;

// Byte-identical copies of the logo, filed under product names in public/images/menu-items.
const LOGO_COPIES = new Set([
  "brioche.jpg",
  "bubbles.jpg",
  "crauffles.jpg",
  "gaufres.jpg",
  "kechlogo copy 8.jpg",
  "kechlogo copy.jpg",
  "kechlogo.jpg",
  "ticanmisu.jpg",
  "waffles.jpg",
]);

const PICTOGRAPHS = /[\p{Extended_Pictographic}️‍]/gu;
