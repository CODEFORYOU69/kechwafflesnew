import { SITE_URL, hoursSummary, openingDays } from "@/lib/site-content";
import { getSiteSettings } from "@/lib/site-settings.server";
import type { Metadata } from "next";

/** The week in one line, from the hours set in `/admin/site`. */
export async function generateMetadata(): Promise<Metadata> {
  const { hours } = await getSiteSettings();
  const summary = hoursSummary(openingDays(hours));
  const week = summary ? ` ${summary}` : "";

  return {
    title: "Adresse et horaires du café à Al Badii, Marrakech",
    description: `Kech Waffles, café de spécialité et croffles à Marrakech : MAG 33, Al Badii, à 15 minutes du Jardin Majorelle.${week} Plan, Google Maps, Waze et questions fréquentes.`,
    keywords: [
      "Kech Waffles adresse",
      "café de spécialité Marrakech adresse",
      "coffee shop Al Badii Marrakech",
      "horaires Kech Waffles",
      "itinéraire Kech Waffles",
    ],
    alternates: { canonical: "/location" },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: "Kech Waffles",
      url: `${SITE_URL}/location`,
      title: "Adresse et horaires · Kech Waffles, Marrakech",
      description: `MAG 33, Al Badii, Marrakech.${week} Horaires, plan d’accès, Google Maps et Waze.`,
      images: [
        {
          url: "/brand/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Logo Kech Waffles, Marrakech",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Adresse et horaires · Kech Waffles, Marrakech",
      description: `MAG 33, Al Badii, Marrakech.${week}`,
      images: ["/brand/og-image.jpg"],
    },
  };
}

export default function LocationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
