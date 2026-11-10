import { MotionRuntime } from "@/components/motion/MotionRuntime";
import { PageTransition } from "@/components/motion/PageTransition";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import { ClosureNotice } from "./components/ClosureNotice";
import { Navigation } from "./components/Navigation";
import { StructuredData } from "./components/StructuredData";
import { WhatsAppButton } from "./components/WhatsappButton";
import Footer from "./Footer";
import "./globals.css";

// Instanced to keep the first paint light: see app/fonts/README.md.
const display = localFont({
  src: "./fonts/bricolage-grotesque-opsz40.woff2",
  weight: "600 800",
  declarations: [{ prop: "font-stretch", value: "75% 90%" }],
  variable: "--font-display",
  display: "swap",
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-serif",
  display: "swap",
  preload: false,
});

const mono = localFont({
  src: "./fonts/jetbrains-mono-400-500.woff2",
  weight: "400 500",
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

const SITE_TITLE = "Café de spécialité et croffles à Marrakech · Kech Waffles";
const SITE_DESCRIPTION =
  "Café de spécialité et coffee shop à Marrakech (MAG 33, Al Badii) : croffles du jour, pâtisseries maison, ouvert jusqu’à 2h. Girls Only mardi et jeudi, Café IA étudiants.";
const SOCIAL_IMAGE = "/brand/og-image.jpg";

export const viewport: Viewport = {
  themeColor: "#0F0B08",
};

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: "%s · Kech Waffles",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "café Marrakech",
    "café de spécialité Marrakech",
    "coffee shop Marrakech",
    "croffles Marrakech",
    "barista Marrakech",
    "iced latte Marrakech",
    "café pour travailler Marrakech",
    "café ouvert tard Marrakech",
    "café Al Badii Marrakech",
    "Girls Only Marrakech",
    "Café IA Marrakech",
    "service informatique étudiants Marrakech",
    "pâtisserie maison Marrakech",
    "corner gaufres événement Marrakech",
    "Kech Waffles",
  ],
  authors: [{ name: "Kech Waffles" }],
  creator: "Kech Waffles",
  publisher: "Kech Waffles",
  metadataBase: new URL("https://www.kechwaffles.com"),
  icons: {
    apple: "/brand/icons/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.kechwaffles.com",
    siteName: "Kech Waffles",
    title: SITE_TITLE,
    description:
      "Le café pris au sérieux, des croffles du jour, des mardis et jeudis Girls Only et un Café IA pour les étudiants. MAG 33, Al Badii, Marrakech.",
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
    title: SITE_TITLE,
    description:
      "Café de spécialité, croffles du jour, Girls Only mardi et jeudi, Café IA pour les étudiants. Marrakech.",
    images: [SOCIAL_IMAGE],
  },
  // Search Console: the value of `content` in its HTML tag, set in the Vercel project.
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${display.variable} ${sans.variable} ${serif.variable} ${mono.variable} dark`}
    >
      <head>
        <StructuredData />
      </head>
      <body className="bg-[hsl(var(--bg))] text-[hsl(var(--text))] antialiased grain">
        <noscript>
          <style>{`[data-reveal]{opacity:1;transform:none}.line-mask>span{transform:none}body>header{background:hsl(var(--espresso-950))}.hero{height:auto}.hero__stage{position:relative;height:auto;display:flex;flex-direction:column}.hero__opening{position:relative}.hero__door{display:none}.hero__final{position:relative;height:auto;opacity:1!important;transform:none!important}[data-rail-scene]{height:auto!important}`}</style>
        </noscript>
        <a href="#contenu" className="skip-link" data-no-transition>
          Aller au contenu
        </a>
        <Navigation />
        <ClosureNotice />
        <main id="contenu" tabIndex={-1}>{children}</main>
        <Footer />
        <WhatsAppButton />
        <SmoothScroll />
        <MotionRuntime />
        <PageTransition />
      </body>
    </html>
  );
}
