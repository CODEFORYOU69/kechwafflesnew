import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { Navigation } from "./components/Navigation";
import { WhatsAppButton } from "./components/WhatsappButton";
import { StructuredData } from "./components/StructuredData";
import { Toaster } from "sonner";
import Footer from "./Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kech Waffles — Atelier de gaufres artisanales · Marrakech",
    template: "%s · Kech Waffles",
  },
  description:
    "Atelier de gaufres artisanales à Marrakech. Chocolat Callebaut, pistache premium, tiramisu maison, pizza waffles et boissons signatures. 100% fait maison.",
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
    "Kech Waffles",
    "TiCanMisu",
    "crêpes Marrakech",
  ],
  authors: [{ name: "Kech Waffles" }],
  creator: "Kech Waffles",
  publisher: "Kech Waffles",
  metadataBase: new URL("https://www.kechwaffles.com"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.kechwaffles.com",
    siteName: "Kech Waffles",
    title: "Kech Waffles — Atelier de gaufres artisanales · Marrakech",
    description:
      "Atelier de gaufres à Marrakech. Ingrédients nobles, recettes signatures, savoir-faire artisanal.",
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
    title: "Kech Waffles — Atelier de gaufres · Marrakech",
    description:
      "Atelier de gaufres à Marrakech. Recettes signatures, ingrédients nobles.",
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
  verification: { google: "votre-code-google-search-console" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${instrumentSerif.variable} dark`}
    >
      <head>
        <StructuredData />
      </head>
      <body className="bg-[hsl(var(--bg))] text-[hsl(var(--text))] antialiased grain">
        <Navigation />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <Toaster
          position="top-right"
          richColors
          theme="dark"
          toastOptions={{ className: "font-sans" }}
        />
      </body>
    </html>
  );
}
