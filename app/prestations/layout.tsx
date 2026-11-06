import { SITE_URL } from "@/lib/site-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prestations : les gaufres sur mesure",
  description:
    "Les gaufres de Kech Waffles, désormais sur mesure : un corner installé chez vous à Marrakech et sa région, cuisson à la minute devant vos invités, dès 30 personnes.",
  keywords: [
    "corner gaufres Marrakech",
    "traiteur gaufres Marrakech",
    "animation culinaire mariage Marrakech",
    "stand gaufres événement",
    "prestation événementielle Marrakech",
  ],
  alternates: { canonical: "/prestations" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Kech Waffles",
    url: `${SITE_URL}/prestations`,
    title: "Les gaufres sur mesure · Kech Waffles",
    description:
      "Les gaufres traditionnelles ont quitté la carte pour vos événements : un corner chez vous, cuisson à la minute devant vos invités, à Marrakech et sa région.",
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
    title: "Les gaufres sur mesure · Kech Waffles",
    description:
      "Un corner gaufres chez vous, cuisson à la minute devant vos invités, à Marrakech et sa région.",
    images: ["/brand/og-image.jpg"],
  },
};

export default function PrestationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
