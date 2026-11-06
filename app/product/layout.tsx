import { SITE_URL } from "@/lib/site-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TiCanMisu et Pizza Waffle",
  description:
    "À côté du café de spécialité et des croffles, deux créations d’atelier de Kech Waffles à Marrakech : le TiCanMisu, tiramisu en canette, et la Pizza Waffle, gaufre salée gratinée.",
  keywords: [
    "TiCanMisu",
    "tiramisu en canette Marrakech",
    "Pizza Waffle Marrakech",
    "dessert à emporter Marrakech",
    "Kech Waffles",
  ],
  alternates: { canonical: "/product" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Kech Waffles",
    url: `${SITE_URL}/product`,
    title: "TiCanMisu et Pizza Waffle · Kech Waffles",
    description:
      "Deux créations d’atelier, à côté du comptoir : le tiramisu en canette et la gaufre salée gratinée.",
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
    title: "TiCanMisu et Pizza Waffle · Kech Waffles",
    description:
      "Deux créations d’atelier, à côté du comptoir : le tiramisu en canette et la gaufre salée gratinée.",
    images: ["/brand/og-image.jpg"],
  },
};

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
