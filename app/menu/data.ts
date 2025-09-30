import { MenuSection } from "./types";

const menuData: Record<string, MenuSection> = {
  sucres: {
    title: "Délices Sucrés « Façon Tiramisu »",
    items: [
      {
        name: "Gaufre Classique Tiramisu",
        description:
          "Notre signature : gaufre moelleuse, crème mascarpone, café, cacao",
        price: "45 DH",
        badges: ["Bestseller"],
      },
      {
        name: "Crauffle Nutella",
        description: "Croissant-gaufre fourré au Nutella, crème fouettée",
        price: "40 DH",
        badges: ["Nouveau"],
      },
      {
        name: "Crème de Sucre",
        description: "Crème de sucre, crème fouettée, chocolat",
        price: "35 DH",
        badges: ["Popular"],
      },
      {
        name: "Milkshake",
        description: "Crème de sucre, crème fouettée, chocolat",
        price: "35 DH",
        badges: ["Popular"],
      },
    ],
  },
  sales: {
    title: "Brioches Fourrées Salées",
    items: [
      {
        name: "Le Marocain",
        description: "Kefta traditionnelle, sauce tomate épicée, fromage fondu",
        price: "50 DH",
        badges: ["Épicé", "Popular"],
      },
      {
        name: "Chèvre Indien",
        description: "Fromage de chèvre, épices indiennes, miel",
        price: "55 DH",
        badges: ["Végétarien"],
      },
    ],
  },
  boissons: {
    title: "Boissons",
    items: [
      {
        name: "Café Glacé Tiramisu",
        description: "Notre spécialité café glacé avec crème mascarpone",
        price: "35 DH",
        badges: [],
      },
    ],
  },
};

export default menuData;
