import { CONTACT, OPENING_HOURS, SITE_URL } from "@/lib/site-content";
import { JsonLd } from "./JsonLd";

export function StructuredData() {
  return (
    <>
      <JsonLd data={CAFE_SCHEMA} />
      <JsonLd data={ORGANIZATION_SCHEMA} />
      <JsonLd data={WEBSITE_SCHEMA} />
    </>
  );
}

/** Days left out are closed. `closes` before `opens` means the next morning. */
function openingHoursSpecification() {
  return OPENING_HOURS.flatMap((day) =>
    day.opensAt === null || day.closesAt === null
      ? []
      : [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: SCHEMA_DAYS[day.weekday],
            opens: clockTime(day.opensAt),
            closes: clockTime(day.closesAt % MINUTES_PER_DAY),
          },
        ],
  );
}

function clockTime(minutes: number) {
  const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
  return `${hours}:${String(minutes % 60).padStart(2, "0")}`;
}

const MINUTES_PER_DAY = 24 * 60;

/** Indexed like `Date.getDay()`. */
const SCHEMA_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: CONTACT.addressLine,
  addressLocality: CONTACT.city,
  addressRegion: CONTACT.region,
  addressCountry: "MA",
};

const SOCIAL_PROFILES = [
  CONTACT.instagramUrl,
  CONTACT.facebookUrl,
  CONTACT.tiktokUrl,
  CONTACT.snapchatUrl,
];

// Real photos of the place first: Google shows them beside the listing, the logo says nothing.
const PHOTOS = [
  "/images/site/facade-night.jpg",
  "/images/site/barista-counter-2.jpg",
  "/images/site/croffle-caramel.jpg",
  "/images/site/espresso-latte.jpg",
].map((path) => `${SITE_URL}${path}`);

const DESCRIPTION =
  "Café de spécialité à Marrakech : croffles du jour et pâtisseries maison, mardis et jeudis réservés aux filles (Girls Only), Café IA et service informatique pour les étudiants.";

const CAFE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  "@id": `${SITE_URL}/#cafe`,
  name: "Kech Waffles",
  alternateName: "Kech Waffles Marrakech",
  description: DESCRIPTION,
  url: SITE_URL,
  image: PHOTOS,
  logo: `${SITE_URL}/brand/icons/icon-512.png`,
  telephone: CONTACT.phoneE164,
  priceRange: "$$",
  currenciesAccepted: "MAD",
  address: ADDRESS,
  geo: {
    "@type": "GeoCoordinates",
    latitude: CONTACT.geo.latitude,
    longitude: CONTACT.geo.longitude,
  },
  hasMap: CONTACT.mapsUrl,
  openingHoursSpecification: openingHoursSpecification(),
  servesCuisine: ["Café", "Café de spécialité", "Croffles", "Pâtisseries maison"],
  acceptsReservations: "False",
  hasMenu: `${SITE_URL}/menu`,
  // The Google Maps listing and the Glovo store tie this entity to the same place elsewhere.
  sameAs: [...SOCIAL_PROFILES, CONTACT.mapsUrl, CONTACT.glovoUrl],
  parentOrganization: { "@id": `${SITE_URL}/#organization` },
};

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Kech Waffles",
  url: SITE_URL,
  logo: `${SITE_URL}/brand/icons/icon-512.png`,
  description: DESCRIPTION,
  address: ADDRESS,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: CONTACT.phoneE164,
    contactType: "customer service",
    areaServed: "MA",
    availableLanguage: ["French", "Arabic"],
  },
  sameAs: SOCIAL_PROFILES,
};

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "Kech Waffles",
  alternateName: "Kech Waffles Marrakech",
  url: SITE_URL,
  inLanguage: "fr",
  publisher: { "@id": `${SITE_URL}/#organization` },
};
