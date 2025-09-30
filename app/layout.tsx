import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Navigation } from "./components/Navigation";
import { WhatsAppButton } from "./components/WhatsappButton";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Kech Waffles - Délices Sucrés & Brioches Fourrées à Marrakech",
  description:
    "Découvrez nos délicieuses gaufres façon Tiramisu et nos brioches fourrées salées dans notre restaurant à Marrakech.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={poppins.className}>
        <Navigation />
        <main className="pt-16">{children}</main>
        <WhatsAppButton />
      </body>
    </html>
  );
}
