import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prestations - Corner gaufres live pour vos événements",
  description:
    "Kech Waffles installe son corner gaufres chez vous à Marrakech. Cuisson à la minute devant vos invités : mariages, anniversaires, soirées privées, événements d'entreprise. Devis sous 48h.",
  keywords: [
    "corner gaufres Marrakech",
    "traiteur gaufres Marrakech",
    "animation culinaire mariage Marrakech",
    "stand gaufres événement",
    "prestation événementielle Marrakech",
    "food corner mariage Maroc",
  ],
  openGraph: {
    title: "Prestations - Corner gaufres live | Kech Waffles",
    description:
      "On installe l'atelier chez vous. Gaufres cuites à la minute devant vos invités, à Marrakech et sa région.",
    url: "https://www.kechwaffles.com/prestations",
  },
};

export default function PrestationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
