import { SITE_URL } from "@/lib/site-content";
import type { Metadata } from "next";

const TITLE = "Menu : café, croffles et pâtisseries à Marrakech";
const DESCRIPTION =
  "La carte de Kech Waffles à Marrakech : café de spécialité, croffles du jour, pâtisseries maison, boissons glacées et jus pressés. MAG 33, Al Badii.";
const SOCIAL_IMAGE = "/brand/og-image.jpg";

// Next.js replaces nested metadata objects instead of merging them: `openGraph` and
// `twitter` have to repeat what the root layout sets, the image included.
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "carte Kech Waffles",
    "menu café Marrakech",
    "café de spécialité Marrakech",
    "croffles Marrakech",
    "iced latte Marrakech",
    "cold brew Marrakech",
  ],
  alternates: { canonical: "/menu" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Kech Waffles",
    url: `${SITE_URL}/menu`,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: SOCIAL_IMAGE,
        width: 1200,
        height: 630,
        alt: "Logo Kech Waffles, Marrakech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [SOCIAL_IMAGE],
  },
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
