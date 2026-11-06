import { SITE_URL } from "@/lib/site-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nous trouver",
  description:
    "Kech Waffles, café de spécialité et croffles à Marrakech : MAG 33, Al Badii, à 15 minutes du Jardin Majorelle. Horaires, plan d’accès, Google Maps et Waze.",
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
    title: "Nous trouver · Kech Waffles",
    description:
      "MAG 33, Al Badii, Marrakech. Du mardi au dimanche, jusqu’à 2h du matin. Horaires, plan d’accès, Google Maps et Waze.",
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
    title: "Nous trouver · Kech Waffles",
    description:
      "MAG 33, Al Badii, Marrakech. Du mardi au dimanche, jusqu’à 2h du matin.",
    images: ["/brand/og-image.jpg"],
  },
};

export default function LocationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
