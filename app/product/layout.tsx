import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos Produits Signature - TiCanMisu & Pizza Waffles",
  description:
    "Découvrez nos créations uniques : TiCanMisu en bocal (tiramisu revisité aux saveurs Dubai Chocolate, Amlou, Speculoos) et nos Pizza Waffles audacieuses. Produits exclusifs Kech Waffles Marrakech.",
  keywords: [
    "TiCanMisu",
    "tiramisu bocal Marrakech",
    "pizza waffle",
    "tiramisu Dubai chocolate",
    "dessert en bocal",
    "tiramisu Amlou",
    "tiramisu Speculoos",
    "dessert à emporter Marrakech",
    "cadeau gourmand Marrakech",
  ],
  openGraph: {
    title: "Produits Exclusifs Kech Waffles - TiCanMisu & Pizza Waffles",
    description:
      "TiCanMisu en bocal et Pizza Waffles : nos créations signature disponibles chez Kech Waffles Marrakech.",
    url: "https://www.kechwaffles.com/product",
  },
};

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
