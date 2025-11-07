import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nous Trouver - Restaurant Marrakech",
  description:
    "Retrouvez Kech Waffles à Marrakech. Adresse, horaires d'ouverture, plan d'accès et contact. Restaurant spécialisé en gaufres, pancakes et desserts gourmands.",
  keywords: [
    "Kech Waffles adresse",
    "restaurant Marrakech localisation",
    "où manger des gaufres Marrakech",
    "horaires Kech Waffles",
    "itinéraire Kech Waffles",
    "contact restaurant Marrakech",
  ],
  openGraph: {
    title: "Nous Trouver - Kech Waffles Marrakech",
    description: "Retrouvez-nous à Marrakech. Adresse, horaires et contact.",
    url: "https://www.kechwaffles.com/location",
  },
};

export default function LocationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
