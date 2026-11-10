import { isEventOnlyProduct } from "@/lib/menu-filter";

/**
 * The tabs of the menu and the catalogue categories each one shows. Kept out of the client
 * catalogue so the server can list the same dishes in the schema and in `llms.txt`.
 */
export const TABS: MenuTab[] = [
  {
    id: "sucrees",
    label: "Sucrées",
    sublabel: "Croffles · Pâtisseries · Bubble",
    title: "Composer son dessert",
    description: "1. Base · 2. Recette ou libre · 3. Toppings",
    groups: [
      { marker: "01", title: "Les bases", category: "Bases Sucrées" },
      {
        marker: "02",
        title: "Créations signatures",
        category: "Recettes Sucrées - Signatures",
        variant: "signature",
      },
      { marker: "+", title: "Toppings", modifiers: "sweet", variant: "compact" },
    ],
  },
  {
    id: "boissons",
    label: "Boissons",
    sublabel: "Cafés · Shakes · Jus",
    title: "Tout ce qui se boit",
    description: "Cafés, shakes, jus frais et shots vitaminés",
    groups: [
      { marker: "01", title: "Cafés", category: "Boissons - Cafés" },
      { marker: "02", title: "Lactées", category: "Boissons - Boissons Lactées" },
      { marker: "03", title: "Ice lactées", category: "Boissons Ice Lactées" },
      { marker: "04", title: "Milkshakes", category: "Boissons - Milkshakes" },
      { marker: "05", title: "Spécialités", category: "Boissons - Spécialisées" },
      { marker: "06", title: "Jus frais pressés", category: "Jus Frais Pressés" },
      { marker: "07", title: "Shots vitaminés", category: "Shots Vitaminés" },
      { marker: "08", title: "Eaux & soft drinks", category: "Eaux & Soft Drinks" },
      { marker: "+", title: "Options", modifiers: "drink", variant: "compact" },
    ],
  },
  {
    id: "salees",
    label: "Salées",
    sublabel: "Pizza · Potato",
    title: "Composer son salé",
    description: "1. Base · 2. Sauce · 3. Recette · 4. Suppléments",
    groups: [
      { marker: "01", title: "Les bases", category: "Bases Salées" },
      { marker: "02", title: "Les sauces", category: "Sauces Salées" },
      {
        marker: "03",
        title: "Recettes signatures",
        category: "Recettes Salées - Signatures",
        variant: "signature",
      },
      { marker: "04", title: "Recettes classiques", category: "Recettes Salées - Classiques" },
      { marker: "+", title: "Suppléments salés", modifiers: "savoury", variant: "compact" },
    ],
  },
  {
    id: "cans",
    label: "Cans",
    sublabel: "À emporter",
    title: "Desserts à emporter",
    description: "Nos créations en format nomade. Frais, hermétique, prêt à partir",
    groups: [{ marker: "01", title: "Nos cans", category: "Desserts - Cans" }],
  },
];

/** The dishes the menu shows, group by group and in its order: modifiers and event-only waffles left out. */
export function publicMenuSections<T extends { category: string; handle: string; name: string }>(
  products: T[],
) {
  return TABS.flatMap((tab) =>
    tab.groups.flatMap((group) => {
      if (!group.category) return [];
      const items = products.filter(
        (product) => product.category === group.category && !isEventOnlyProduct(product),
      );
      return items.length > 0 ? [{ name: `${tab.label} · ${group.title}`, items }] : [];
    }),
  );
}

export type GroupVariant = "regular" | "signature" | "compact";

export type MenuGroup = {
  marker: string;
  title: string;
  variant?: GroupVariant;
  /** A catalogue category, or a share of the modifiers. */
  category?: string;
  modifiers?: "savoury" | "sweet" | "drink";
};

export type MenuTab = {
  id: string;
  label: string;
  sublabel: string;
  title: string;
  description: string;
  groups: MenuGroup[];
};
