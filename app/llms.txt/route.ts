import { publicMenuSections } from "@/app/menu/menu-tabs";
import { formatMenuText } from "@/lib/menu-filter";
import { tryGetMenuProducts } from "@/lib/menu-products";
import {
  AI_CAFE,
  CONTACT,
  EVENTS_SECTION,
  FAQ,
  GIRLS_ONLY,
  MENU_SECTION,
  SITE_URL,
  openingHoursSentence,
} from "@/lib/site-content";

/**
 * `/llms.txt`: the café in plain Markdown for AI assistants and answer engines, which
 * often read neither scripts nor JSON-LD. Written from the same facts as the pages.
 */
export const revalidate = 3600;

export async function GET() {
  const catalogue = await tryGetMenuProducts();

  return new Response([intro(), pages(), menu(catalogue), faq()].filter(Boolean).join("\n\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}

function intro() {
  return `# Kech Waffles

> Café de spécialité et croffles à ${CONTACT.city}, au Maroc : ${CONTACT.addressLine}, à 15 minutes du Jardin Majorelle. Pâtisseries maison, Girls Only tous les mardis et jeudis, Café IA et service informatique pour les étudiants.

- Adresse : ${CONTACT.addressLine}, ${CONTACT.city}, ${CONTACT.country}
- Coordonnées : ${CONTACT.geo.latitude}, ${CONTACT.geo.longitude}
- Horaires : ${openingHoursSentence()}
- Réservation : non, on pousse la porte
- Téléphone et WhatsApp : ${CONTACT.phoneDisplay}
- Livraison : Glovo, ${CONTACT.glovoUrl}
- Google Maps : ${CONTACT.mapsUrl}
- Instagram : ${CONTACT.instagramUrl}

## À savoir

- Café de spécialité préparé au comptoir : espresso, laits travaillés, cold brew, boissons glacées signatures (${MENU_SIGNATURES}).
- ${MENU_SECTION.intro}
- Girls Only : ${GIRLS_ONLY.intro}
- Café IA : ${AI_CAFE.intro}
- Prestations : ${EVENTS_SECTION.intro} Dès 30 personnes, à Marrakech et sa région.`;
}

function pages() {
  return `## Pages

${PAGES.map((page) => `- [${page.name}](${SITE_URL}${page.path}) : ${page.summary}`).join("\n")}`;
}

/** The dishes the menu page shows, in its order. Skipped when the database is down. */
function menu(catalogue: Awaited<ReturnType<typeof tryGetMenuProducts>>) {
  if (!catalogue) return null;

  const lines = publicMenuSections(catalogue).map(
    ({ name, items }) => `- ${name} : ${items.map((item) => formatMenuText(item.name)).join(", ")}`,
  );
  return `## La carte\n\n${lines.join("\n")}`;
}

function faq() {
  return `## Questions fréquentes

${FAQ.items.map((item) => `### ${item.question}\n\n${item.answer}`).join("\n\n")}`;
}

const MENU_SIGNATURES = ["Ice White Mocha", "Ice Latte Caramel", "Ice Matcha Latte"].join(", ");

const PAGES = [
  { name: "Accueil", path: "", summary: "le café, la carte, Girls Only, Café IA, nous trouver" },
  { name: "La carte", path: "/menu", summary: "cafés, croffles, pâtisseries, boissons glacées, salé" },
  { name: "Girls Only", path: "/girls-only", summary: "le café réservé aux filles, mardi et jeudi" },
  { name: "Café IA", path: "/cafe-ia", summary: "travailler, coder, aide informatique aux étudiants" },
  { name: "Nous trouver", path: "/location", summary: "adresse, horaires, accès, questions fréquentes" },
  { name: "Prestations", path: "/prestations", summary: "corner gaufres pour les événements" },
  { name: "Notre histoire", path: "/notre-histoire", summary: "de l’atelier de gaufres au comptoir" },
  { name: "In English", path: "/en", summary: "the café, croffles, Girls Only, AI Café, hours, in English" },
];
