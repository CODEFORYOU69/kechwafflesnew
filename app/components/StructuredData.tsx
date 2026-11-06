import { CONTACT, OPENING_HOURS, SITE_URL } from "@/lib/site-content";

export function StructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CAFE_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }}
      />
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
  addressCountry: "MA",
};

const SOCIAL_PROFILES = [
  CONTACT.instagramUrl,
  CONTACT.facebookUrl,
  CONTACT.tiktokUrl,
  CONTACT.snapchatUrl,
];

const DESCRIPTION =
  "Café de spécialité à Marrakech : croffles du jour et pâtisseries maison, mardis et jeudis réservés aux filles (Girls Only), Café IA et service informatique pour les étudiants.";

const CAFE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  "@id": `${SITE_URL}/#cafe`,
  name: "Kech Waffles",
  description: DESCRIPTION,
  url: SITE_URL,
  image: `${SITE_URL}/brand/og-image.jpg`,
  telephone: CONTACT.phoneE164,
  priceRange: "$$",
  address: ADDRESS,
  geo: {
    "@type": "GeoCoordinates",
    latitude: CONTACT.geo.latitude,
    longitude: CONTACT.geo.longitude,
  },
  hasMap: CONTACT.mapsUrl,
  openingHoursSpecification: openingHoursSpecification(),
  servesCuisine: ["Café de spécialité", "Croffles", "Pâtisseries maison"],
  acceptsReservations: "False",
  menu: `${SITE_URL}/menu`,
  sameAs: SOCIAL_PROFILES,
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
