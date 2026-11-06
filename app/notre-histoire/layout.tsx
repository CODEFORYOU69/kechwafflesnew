import { SITE_URL } from "@/lib/site-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notre histoire",
  description:
    "D’un atelier dédié à la gaufre à un comptoir de café de spécialité : l’histoire de Kech Waffles à Marrakech, depuis 2023. Croffles, café, Girls Only et Café IA.",
  keywords: [
    "histoire Kech Waffles",
    "café de spécialité Marrakech",
    "croffles Marrakech",
    "atelier Marrakech",
  ],
  alternates: { canonical: "/notre-histoire" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Kech Waffles",
    url: `${SITE_URL}/notre-histoire`,
    title: "Notre histoire · Kech Waffles",
    description:
      "Un atelier, devenu comptoir : l’histoire de Kech Waffles à Marrakech, depuis 2023.",
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
    title: "Notre histoire · Kech Waffles",
    description:
      "Un atelier, devenu comptoir : l’histoire de Kech Waffles à Marrakech, depuis 2023.",
    images: ["/brand/og-image.jpg"],
  },
};

export default function NotreHistoireLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
