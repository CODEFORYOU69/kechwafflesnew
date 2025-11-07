import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Navigation } from "./components/Navigation";
import { WhatsAppButton } from "./components/WhatsappButton";
import { StructuredData } from "./components/StructuredData";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Kech Waffles Marrakech - Gaufres, Crêpes, Desserts & Boissons",
    template: "%s | Kech Waffles Marrakech",
  },
  description:
    "Restaurant à Marrakech spécialisé en gaufres tiramisu, pancakes, milkshakes, bubble waffles, pizza waffles et boissons gourmandes. Livraison disponible. Découvrez nos créations sucrées et salées uniques.",
  keywords: [
    "gaufres Marrakech",
    "restaurant Marrakech",
    "bubble waffle Marrakech",
    "tiramisu Marrakech",
    "pancakes Marrakech",
    "milkshake Marrakech",
    "desserts Marrakech",
    "café Marrakech",
    "pizza waffle",
    "brunch Marrakech",
    "petit déjeuner Marrakech",
    "goûter Marrakech",
    "Kech Waffles",
    "livraison desserts Marrakech",
    "TiCanMisu",
    "crêpes Marrakech",
    "ice coffee Marrakech",
  ],
  authors: [{ name: "Kech Waffles" }],
  creator: "Kech Waffles",
  publisher: "Kech Waffles",
  metadataBase: new URL("https://www.kechwaffles.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.kechwaffles.com",
    siteName: "Kech Waffles",
    title: "Kech Waffles Marrakech - Gaufres, Crêpes, Desserts & Boissons",
    description:
      "Restaurant à Marrakech spécialisé en gaufres tiramisu, pancakes, milkshakes, bubble waffles et boissons gourmandes. Découvrez nos créations uniques.",
    images: [
      {
        url: "/images/menu-items/TransparentBlack.jpg",
        width: 1200,
        height: 630,
        alt: "Kech Waffles Marrakech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kech Waffles Marrakech - Gaufres, Crêpes, Desserts",
    description:
      "Restaurant à Marrakech spécialisé en gaufres tiramisu, pancakes, milkshakes et bubble waffles. Découvrez nos créations uniques.",
    images: ["/images/menu-items/TransparentBlack.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "votre-code-google-search-console", // À remplacer
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <StructuredData />
      </head>
      <body className={poppins.className}>
        <Navigation />
        <main className="pt-16">{children}</main>
        <WhatsAppButton />
      </body>
    </html>
  );
}
