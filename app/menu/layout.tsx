import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu - Gaufres, Pancakes, Milkshakes & Desserts",
  description:
    "Découvrez notre menu complet : bubble waffles tiramisu, pancakes américains, milkshakes gourmands, pizza waffles, crêpes, cafés glacés et bien plus. Restaurant Kech Waffles Marrakech.",
  keywords: [
    "menu Kech Waffles",
    "carte restaurant Marrakech",
    "bubble waffle tiramisu",
    "pancakes Marrakech",
    "milkshake prix",
    "desserts menu",
    "pizza waffle carte",
    "prix gaufres Marrakech",
    "menu complet Marrakech",
  ],
  openGraph: {
    title: "Menu Kech Waffles - Gaufres, Pancakes & Desserts Marrakech",
    description:
      "Découvrez notre menu complet : bubble waffles, pancakes, milkshakes, pizza waffles, crêpes et cafés gourmands.",
    url: "https://www.kechwaffles.com/menu",
  },
};

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
