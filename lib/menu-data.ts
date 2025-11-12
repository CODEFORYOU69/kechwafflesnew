export type ProductVariant = {
  option1Name?: string;
  option1Value?: string;
  option2Name?: string;
  option2Value?: string;
  price: number;
};

export type Product = {
  handle: string;
  sku: string;
  name: string;
  category: string;
  description?: string;
  price?: number;
  variants?: ProductVariant[];
  isModifier?: boolean;
  hasTax?: boolean;
  image?: string; // Chemin de l'image dans /images/menu-items/
};

export const menuProducts: Product[] = [
  {
    handle: "cafe-au-lait",
    sku: "CAL-001",
    name: "Café au Lait",
    category: "Boissons - Boissons Lactées",
    description: "Café avec lait",
    image: "caféaulait.png",
    price: 18,
  },

  {
    handle: "cap-sm",
    sku: "CAP-SM",
    name: "Cappuccino",
    category: "Boissons - Boissons Lactées",
    image: "cappuccino.png",
    variants: [
      {
        option1Name: "Taille",
        option1Value: "Small",
        price: 20,
      },
      {
        option1Name: "Taille",
        option1Value: "Medium",
        price: 25,
      },
      {
        option1Name: "Taille",
        option1Value: "Large",
        price: 30,
      }
    ],
  },

  {
    handle: "cha-h",
    sku: "CHA-H",
    name: "Chai Latte",
    category: "Boissons - Boissons Lactées",
    image: "chailatté.png",
    variants: [
      {
        option1Name: "Température",
        option1Value: "Chaud",
        price: 18,
      },
      {
        option1Name: "Température",
        option1Value: "Froid",
        price: 18,
      }
    ],
  },

  {
    handle: "chb-h",
    sku: "CHB-H",
    name: "Chocolat Blanc",
    category: "Boissons - Boissons Lactées",
    image: "chocolat blanc.png",
    variants: [
      {
        option1Name: "Température",
        option1Value: "Froid",
        price: 22,
      },
      {
        option1Name: "Température",
        option1Value: "Chaud",
        price: 22,
      }
    ],
  },

  {
    handle: "cold-brew",
    sku: "COL-001",
    name: "Cold Brew",
    category: "Boissons - Boissons Lactées",
    description: "Café infusé froid",
    image: "coldbrew.png",
    price: 35,
  },

  {
    handle: "cortado",
    sku: "COR-001",
    name: "Cortado",
    category: "Boissons - Boissons Lactées",
    description: "Espresso coupé lait",
    image: "cortado.png",
    price: 25,
  },

  {
    handle: "macchiato",
    sku: "MAC-001",
    name: "Espresso Macchiato",
    category: "Boissons - Boissons Lactées",
    description: "Espresso marqué lait",
    image: "espressomachiatto.png",
    price: 22,
  },

  {
    handle: "flat-white",
    sku: "FLW-001",
    name: "Flat White",
    category: "Boissons - Boissons Lactées",
    description: "Espresso micro-mousse",
    image: "flatwhite.png",
    price: 30,
  },

  {
    handle: "frappe-cafe",
    sku: "FRA-001",
    name: "Frappé Café",
    category: "Boissons - Boissons Lactées",
    description: "Café mixé glace",
    image: "frappé.png",
    price: 40,
  },

  {
    handle: "iced-latte",
    sku: "ICL-001",
    name: "Iced Latte",
    category: "Boissons - Boissons Lactées",
    description: "Espresso avec lait froid",
    image: "icedlatté.png",
    price: 35,
  },

  {
    handle: "lca-sm",
    sku: "LCA-SM",
    name: "Lait Chaud Aromatisé",
    category: "Boissons - Boissons Lactées",
    image: "laitaromtisé.png",
    variants: [
      {
        option1Name: "Taille",
        option1Value: "Small",
        price: 25,
      },
      {
        option1Name: "Taille",
        option1Value: "Medium",
        price: 35,
      }
    ],
  },

  {
    handle: "lch-sm",
    sku: "LCH-SM",
    name: "Lait Chaud Simple",
    category: "Boissons - Boissons Lactées",
    image: "laitchaud.png",
    variants: [
      {
        option1Name: "Taille",
        option1Value: "Small",
        price: 20,
      },
      {
        option1Name: "Taille",
        option1Value: "Medium",
        price: 30,
      }
    ],
  },

  {
    handle: "lait-froid-arome",
    sku: "LFA-001",
    name: "Lait Froid Aromatisé",
    category: "Boissons - Boissons Lactées",
    description: "Lait froid sirop",
    image: "laitaromtiséfroidchaud.png",
    price: 35,
  },

  {
    handle: "lait-froid",
    sku: "LFR-001",
    name: "Lait Froid Simple",
    category: "Boissons - Boissons Lactées",
    description: "Lait froid nature",
    image: "laitfroid.png",
    price: 30,
  },

  {
    handle: "lat-sm",
    sku: "LAT-SM",
    name: "Latte",
    category: "Boissons - Boissons Lactées",
    image: "latte.png",
    variants: [
      {
        option1Name: "Taille",
        option1Value: "Small",
        price: 20,
      },
      {
        option1Name: "Taille",
        option1Value: "Medium",
        price: 30,
      },
      {
        option1Name: "Taille",
        option1Value: "Large",
        price: 40,
      }
    ],
  },

  {
    handle: "mat-h",
    sku: "MAT-H",
    name: "Matcha Latte",
    category: "Boissons - Boissons Lactées",
    image: "matchahot.png",
    variants: [
      {
        option1Name: "Température",
        option1Value: "Chaud",
        price: 40,
      },
      {
        option1Name: "Température",
        option1Value: "Froid",
        price: 40,
      }
    ],
  },

  {
    handle: "americano-chaud",
    sku: "AME-001",
    name: "Americano Chaud",
    category: "Boissons - Cafés",
    description: "Espresso allongé eau chaude",
    image: "AMERICANOCHAUD.png",
    price: 20,
  },

  {
    handle: "americano-froid",
    sku: "AME-002",
    name: "Americano Froid",
    category: "Boissons - Cafés",
    description: "Espresso servi froid",
    image: "americanofroid.png",
    price: 30,
  },

  {
    handle: "cafe-glace",
    sku: "ICE-001",
    name: "Café Glacé",
    category: "Boissons - Cafés",
    description: "Café froid avec glaçons",
    image: "cafeglace.png",
    price: 30,
  },

  {
    handle: "espresso-double",
    sku: "ESP-002",
    name: "Double Espresso",
    category: "Boissons - Cafés",
    description: "Double dose d'espresso",
    image: "double-espresso.png",
    price: 20,
  },

  {
    handle: "espresso",
    sku: "ESP-001",
    name: "Espresso",
    category: "Boissons - Cafés",
    description: "Café espresso classique",
    image: "espresso.png",
    price: 15,
  },

  {
    handle: "lungo",
    sku: "LUN-001",
    name: "Long / Lungo",
    category: "Boissons - Cafés",
    description: "Espresso allongé",
    image: "lungo.png",
    price: 20,
  },

  {
    handle: "ristretto",
    sku: "RIS-001",
    name: "Ristretto",
    category: "Boissons - Cafés",
    description: "Espresso court et concentré",
    image: "ristretto.png",
    price: 18,
  },

  {
    handle: "milkshake-chocolat",
    sku: "MSC-001",
    name: "Milkshake Chocolat",
    category: "Boissons - Milkshakes",
    description: "Milkshake chocolat",
    image: "milkshakechocolat.png",
    price: 45,
  },

  {
    handle: "milkshake-fraise",
    sku: "MSF-001",
    name: "Milkshake Fraise",
    category: "Boissons - Milkshakes",
    description: "Milkshake fraise",
    image: "milkshakefraise.png",
    price: 50,
  },

  {
    handle: "milkshake-vanille",
    sku: "MSV-001",
    name: "Milkshake Vanille",
    category: "Boissons - Milkshakes",
    description: "Milkshake vanille",
    image: "milkshakevanille.png",
    price: 45,
  },

  {
    handle: "chocolat-chaud",
    sku: "CHO-001",
    name: "Chocolat Chaud",
    category: "Boissons - Spécialisées",
    description: "Chocolat chaud",
    image: "chocolatchaud.png",
    price: 30,
  },

  {
    handle: "chocolat-froid",
    sku: "CHF-001",
    name: "Chocolat Froid",
    category: "Boissons - Spécialisées",
    description: "Chocolat froid",
    image: "chocolat froidice.png",
    price: 35,
  },

  {
    handle: "white-mocha",
    sku: "WMO-001",
    name: "White Mocha",
    category: "Boissons - Spécialisées",
    description: "Latte chocolat blanc",
    image: "whitemocha.png",
    price: 45,
  },

  {
    handle: "the-menthe",
    sku: "THE-MEN",
    name: "Thé à la Menthe",
    category: "Boissons - Spécialisées",
    description: "Thé à la menthe traditionnel",
    image: "waffles.png",
    variants: [
      {
        option1Name: "Taille",
        option1Value: "Petit",
        price: 10,
      },
      {
        option1Name: "Taille",
        option1Value: "Grand",
        price: 15,
      }
    ],
  },

  {
    handle: "ice-caramel-macchiato",
    sku: "ICE-MAC",
    name: "Ice Caramel Macchiato",
    category: "Boissons Ice Lactées",
    description: "Café glacé caramel macchiato",
    image: "icecaramelmachiato.png",
    price: 38,
  },

  {
    handle: "ice-chai-latte",
    sku: "ICE-CHA",
    name: "Ice Chai Latte",
    category: "Boissons Ice Lactées",
    description: "Chai glacé lait épices",
    image: "chailattéfroid.png",
    price: 40,
  },

  {
    handle: "ice-dalgona",
    sku: "ICE-DAL",
    name: "Ice Dalgona",
    category: "Boissons Ice Lactées",
    description: "Café glacé fouetté style Dalgona",
    image: "DALGONA.png",
    price: 20,
  },

  {
    handle: "ice-latte-caramel",
    sku: "ICE-LAT-CAR",
    name: "Ice Latte Caramel",
    category: "Boissons Ice Lactées",
    description: "Café glacé lait caramel",
    image: "icelattecaramel.png",
    price: 35,
  },

  {
    handle: "ice-latte-noisette",
    sku: "ICE-LAT-NOI",
    name: "Ice Latte Noisette",
    category: "Boissons Ice Lactées",
    description: "Café glacé lait noisette",
    image: "icelattenoisette.png",
    price: 35,
  },

  {
    handle: "ice-latte-vanille",
    sku: "ICE-LAT-VAN",
    name: "Ice Latte Vanille",
    category: "Boissons Ice Lactées",
    description: "Café glacé lait vanille",
    image: "icelattevanille.png",
    price: 35,
  },

  {
    handle: "ice-matcha-latte",
    sku: "ICE-MAT",
    name: "Ice Matcha Latte",
    category: "Boissons Ice Lactées",
    description: "Matcha glacé lait",
    image: "icematchalatté.png",
    price: 40,
  },

  {
    handle: "ice-mocha",
    sku: "ICE-MOC",
    name: "Ice Mocha",
    category: "Boissons Ice Lactées",
    description: "Café glacé chocolat lait",
    image: "icemocha.png",
    price: 38,
  },

  {
    handle: "ice-white-mocha",
    sku: "ICE-WHI",
    name: "Ice White Mocha",
    category: "Boissons Ice Lactées",
    description: "Café glacé chocolat blanc lait",
    image: "icewhitemocha.png",
    price: 40,
  },

  {
    handle: "brioche-tiramisu",
    sku: "BRI-TIR",
    name: "Brioche Tiramisu",
    category: "Desserts",
    description: "Brioche tiramisu",
    image: "brioche.jpg",
    price: 60,
  },

  {
    handle: "bubble-tiramisu",
    sku: "BUB-TIR",
    name: "Bubble Waffle Tiramisu",
    category: "Desserts",
    description: "Bubble tiramisu",
    image: "BUBBLETIRA.png",
    price: 65,
  },

  {
    handle: "craffle-tiramisu",
    sku: "CRA-TIR",
    name: "Craffle Tiramisu",
    category: "Desserts",
    description: "Craffle tiramisu",
    image: "crauffles.jpg",
    price: 60,
  },

  {
    handle: "gaufre-classique",
    sku: "GAU-CLA",
    name: "Gaufre Classique",
    category: "Desserts",
    description: "Gaufre croustillante",
    image: "waffles.png",
    price: 35,
  },

  {
    handle: "gaufre-tiramisu",
    sku: "GAU-TIR",
    name: "Gaufre Tiramisu",
    category: "Desserts",
    description: "Gaufre tiramisu",
    image: "wafflestiramisu.png",
    price: 55,
  },

  {
    handle: "gaufre-liegeoise",
    sku: "GAU-LIE",
    name: "Gaufre Liégeoise",
    category: "Desserts",
    description: "Authentique gaufre liégeoise avec perles de sucre caramélisées",
    image: "waffles.png",
    price: 30,
  },

  {
    handle: "pancake-tiramisu",
    sku: "PAN-TIR",
    name: "Pancake Tiramisu",
    category: "Desserts",
    description: "Pancakes tiramisu",
    image: "pancakestiramisu.png",
    price: 55,
  },

  {
    handle: "can-dubai",
    sku: "CAN-DUB",
    name: "Can Façon Dubai",
    category: "Desserts - Cans",
    description: "Canette Dubai",
    image: "dubaichocolatecan.png",
    price: 60,
  },

  {
    handle: "can-fraise-choco",
    sku: "CAN-FCP",
    name: "Can Fraise Choco Pistache",
    category: "Desserts - Cans",
    description: "Canette trio",
    image: "canstrawchocpist.png",
    price: 65,
  },

  {
    handle: "ticanmisu-oreo",
    sku: "TIC-ORE",
    name: "Ticanmisu",
    category: "Desserts - Cans",
    description: "Canette tiramisu Oreo",
    image: "ticanoreo.png",
    variants: [
      {
        option1Name: "Saveur",
        option1Value: "Fraise",
        price: 50,
      },
      {
        option1Name: "Saveur",
        option1Value: "Oreo",
        price: 50,
      },
      {
        option1Name: "Saveur",
        option1Value: "Caramel",
        price: 50,
      },
      {
        option1Name: "Saveur",
        option1Value: "Daim",
        price: 50,
      },
      {
        option1Name: "Saveur",
        option1Value: "M&M's",
        price: 55,
      },
      {
        option1Name: "Saveur",
        option1Value: "Kinder Bueno",
        price: 55,
      },
      {
        option1Name: "Saveur",
        option1Value: "Nutella",
        price: 50,
      },
      {
        option1Name: "Saveur",
        option1Value: "Mangue",
        price: 55,
      }
    ],
  },

  {
    handle: "oulm-25v",
    sku: "OULM-25V",
    name: "Oulmes",
    category: "Eaux & Soft Drinks",
    image: "oulmes33.png",
    variants: [
      {
        option1Name: "Format",
        option1Value: "25cl verre",
        price: 10,
      },
      {
        option1Name: "Format",
        option1Value: "33cl",
        price: 8,
      },
      {
        option1Name: "Format",
        option1Value: "1L",
        price: 15,
      }
    ],
  },

  {
    handle: "oulmes-citron",
    sku: "OULM-CIT",
    name: "Oulmes Bulles Fruitées Citron",
    category: "Eaux & Soft Drinks",
    description: "Eau gazeuse jus citron naturel 25cl verre",
    image: "oukmesfruitee.png",
    price: 12,
  },

  {
    handle: "oulmes-fruits-rouges",
    sku: "OULM-FRU",
    name: "Oulmes Bulles Fruitées Fruits Rouges",
    category: "Eaux & Soft Drinks",
    description: "Eau gazeuse fruits rouges 25cl verre",
    image: "oukmesfruitee.png",
    price: 12,
  },

  {
    handle: "oulmes-mojito",
    sku: "OULM-MOJ",
    name: "Oulmes Bulles Fruitées Mojito",
    category: "Eaux & Soft Drinks",
    description: "Eau gazeuse saveur mojito menthe 25cl verre",
    image: "oukmesfruitee.png",
    price: 12,
  },

  {
    handle: "oulmes-orange",
    sku: "OULM-ORA",
    name: "Oulmes Bulles Fruitées Orange",
    category: "Eaux & Soft Drinks",
    description: "Eau gazeuse jus orange naturel 25cl verre",
    image: "oukmesfruitee.png",
    price: 12,
  },

  {
    handle: "oulmes-pinacolada",
    sku: "OULM-PIN",
    name: "Oulmes Bulles Fruitées Piña Colada",
    category: "Eaux & Soft Drinks",
    description: "Eau gazeuse saveur piña colada 25cl verre",
    image: "oukmesfruitee.png",
    price: 12,
  },

  {
    handle: "oulmes-tropical",
    sku: "OULM-TRO",
    name: "Oulmes Bulles Fruitées Tropical",
    category: "Eaux & Soft Drinks",
    description: "Eau gazeuse jus fruits tropical 25cl verre",
    image: "oukmesfruitee.png",
    price: 12,
  },

  {
    handle: "sidi-33",
    sku: "SIDI-33",
    name: "Sidi Ali",
    category: "Eaux & Soft Drinks",
    image: "sidiali33.png",
    variants: [
      {
        option1Name: "Format",
        option1Value: "33cl",
        price: 6,
      },
      {
        option1Name: "Format",
        option1Value: "50cl",
        price: 8,
      },
      {
        option1Name: "Format",
        option1Value: "75cl verre",
        price: 12,
      }
    ],
  },

  {
    handle: "jus-orange-presse",
    sku: "JUS-ORA",
    name: "Jus d'Orange Frais Pressé",
    category: "Jus Frais Pressés",
    description: "100% orange fraîches pressées sur place",
    image: "jusdorange.png",
    variants: [
      {
        option1Name: "Taille",
        option1Value: "Small 25cl",
        price: 25,
      },
      {
        option1Name: "Taille",
        option1Value: "Medium 40cl",
        price: 35,
      },
      {
        option1Name: "Taille",
        option1Value: "Large 50cl",
        price: 45,
      }
    ],
  },

  {
    handle: "creme-fouettee",
    sku: "EXT-CRE",
    name: "Crème Fouettée",
    category: "Modificateurs",
    description: "Crème fouettée",
    image: "FOUETTE.png",
    price: 8,
    isModifier: true,
  },

  {
    handle: "extra-champignons",
    sku: "EXT-CHA",
    name: "Extra Champignons",
    category: "Modificateurs",
    description: "Supplément champignons",
    image: "extrachampignon.png",
    price: 5,
    isModifier: true,
  },

  {
    handle: "extra-jambon",
    sku: "EXT-JAM",
    name: "Extra Jambon",
    category: "Modificateurs",
    description: "Supplément jambon",
    image: "extrajambon.png",
    price: 8,
    isModifier: true,
  },

  {
    handle: "extra-legumes-grilles",
    sku: "EXT-LEG",
    name: "Extra Légumes Grillés",
    category: "Modificateurs",
    description: "Supplément légumes grillés",
    image: "extralegumegrille.png",
    price: 5,
    isModifier: true,
  },

  {
    handle: "extra-mozzarella",
    sku: "EXT-MOZ",
    name: "Extra Mozzarella",
    category: "Modificateurs",
    description: "Supplément mozzarella",
    image: "extramozza.png",
    price: 5,
    isModifier: true,
  },

  {
    handle: "extra-olives",
    sku: "EXT-OLI",
    name: "Extra Olives",
    category: "Modificateurs",
    description: "Supplément olives",
    image: "extraolive.png",
    price: 3,
    isModifier: true,
  },

  {
    handle: "extra-pepperoni",
    sku: "EXT-PEP",
    name: "Extra Pepperoni",
    category: "Modificateurs",
    description: "Supplément pepperoni",
    image: "extrapepperoni.png",
    price: 8,
    isModifier: true,
  },

  {
    handle: "extra-poulet-pizza",
    sku: "EXT-POU",
    name: "Extra Poulet",
    category: "Modificateurs",
    description: "Supplément poulet",
    image: "extrapoulet.png",
    price: 10,
    isModifier: true,
  },

  {
    handle: "extra-sauce-tomate",
    sku: "EXT-STO",
    name: "Extra Sauce Tomate",
    category: "Modificateurs",
    description: "Supplément sauce tomate",
    image: "sauce-tomate.png",
    price: 2,
    isModifier: true,
  },

  {
    handle: "extra-thon",
    sku: "EXT-THO",
    name: "Extra Thon",
    category: "Modificateurs",
    description: "Supplément thon",
    image: "extrathon.png",
    price: 8,
    isModifier: true,
  },

  {
    handle: "extra-viande-hachee",
    sku: "EXT-VHA",
    name: "Extra Viande Hachée",
    category: "Modificateurs",
    description: "Supplément viande hachée",
    image: "extraviandehachée.png",
    price: 10,
    isModifier: true,
  },

  {
    handle: "extra-falafel",
    sku: "EXT-FAL",
    name: "Falafel Extra",
    category: "Modificateurs",
    description: "Falafel extra",
    image: "falafel.png",
    price: 10,
    isModifier: true,
  },

  {
    handle: "fromage-cheddar",
    sku: "FRO-CHE",
    name: "Fromage Cheddar",
    category: "Modificateurs",
    description: "Cheddar",
    image: "cheddar.png",
    price: 8,
    isModifier: true,
  },

  {
    handle: "fromage-mozzarella",
    sku: "FRO-MOZ",
    name: "Fromage Mozzarella",
    category: "Modificateurs",
    description: "Mozzarella",
    image: "mozzarella.png",
    price: 8,
    isModifier: true,
  },

  {
    handle: "glace-choco-lait",
    sku: "EXT-GCL",
    name: "Glace Chocolat Lait",
    category: "Modificateurs",
    description: "Glace choco lait",
    image: "glacechocolatlait.png",
    price: 10,
    isModifier: true,
  },

  {
    handle: "glace-choco-noir",
    sku: "EXT-GCN",
    name: "Glace Chocolat Noir",
    category: "Modificateurs",
    description: "Glace choco noir",
    image: "glacechocolatnoir.png",
    price: 10,
    isModifier: true,
  },

  {
    handle: "glace-fraise",
    sku: "EXT-GLF",
    name: "Glace Fraise",
    category: "Modificateurs",
    description: "Glace fraise",
    image: "glacefraise.png",
    price: 12,
    isModifier: true,
  },

  {
    handle: "glace-mangue",
    sku: "EXT-GMA",
    name: "Glace Mangue",
    category: "Modificateurs",
    description: "Glace mangue",
    image: "glacemangue.png",
    price: 12,
    isModifier: true,
  },

  {
    handle: "glace-pistache",
    sku: "EXT-GPI",
    name: "Glace Pistache",
    category: "Modificateurs",
    description: "Glace pistache",
    image: "glacepistache.png",
    price: 15,
    isModifier: true,
  },

  {
    handle: "glace-raffaelo",
    sku: "EXT-GRA",
    name: "Glace Raffaelo",
    category: "Modificateurs",
    description: "Glace Raffaelo",
    image: "glaceraffaelo.png",
    price: 15,
    isModifier: true,
  },

  {
    handle: "glace-ruby",
    sku: "EXT-GRU",
    name: "Glace Ruby Framboise",
    category: "Modificateurs",
    description: "Glace ruby",
    image: "glacerubyframboise.png",
    price: 15,
    isModifier: true,
  },

  {
    handle: "glace-vanille",
    sku: "EXT-GLV",
    name: "Glace Vanille",
    category: "Modificateurs",
    description: "Glace vanille",
    image: "glacevanille.png",
    price: 10,
    isModifier: true,
  },

  {
    handle: "ext-soj",
    sku: "EXT-SOJ",
    name: "Lait Végétal",
    category: "Modificateurs",
    image: "laitvegetal.png",
    variants: [
      {
        option1Name: "Type",
        option1Value: "Soja",
        price: 5,
      },
      {
        option1Name: "Type",
        option1Value: "Amande",
        price: 5,
      },
      {
        option1Name: "Type",
        option1Value: "Avoine",
        price: 5,
      },
      {
        option1Name: "Type",
        option1Value: "Coco",
        price: 5,
      }
    ],
  },

  {
    handle: "oignons-caramelises",
    sku: "EXT-OIG",
    name: "Oignons Caramélisés",
    category: "Modificateurs",
    description: "Oignons",
    image: "oignoncaramelisé.png",
    price: 5,
    isModifier: true,
  },

  {
    handle: "option-chantilly",
    sku: "OPT-CHA",
    name: "Option Chantilly",
    category: "Modificateurs",
    description: "Chantilly",
    image: "chantilly.png",
    price: 8,
    isModifier: true,
  },

  {
    handle: "opt-fra",
    sku: "OPT-FRA",
    name: "Option Fraise Can",
    category: "Modificateurs",
    image: "topfraises.png",
    price: 10,
  },

  {
    handle: "sauce-andalouse",
    sku: "SAU-AND",
    name: "Sauce Andalouse",
    category: "Modificateurs",
    description: "Andalouse",
    image: "saucandalou.png",
    price: 5,
    isModifier: true,
  },

  {
    handle: "sauce-bbq",
    sku: "SAU-BBQ",
    name: "Sauce BBQ",
    category: "Modificateurs",
    description: "BBQ",
    image: "saucebbq.png",
    price: 5,
    isModifier: true,
  },

  {
    handle: "sauce-gruyere",
    sku: "SAU-GRU",
    name: "Sauce Gruyère Lyonnaise",
    category: "Modificateurs",
    image: "saucegruyere.png",
    variants: [
      {
        option1Name: "Taille",
        option1Value: "Petite (50ml)",
        price: 8,
      },
      {
        option1Name: "Taille",
        option1Value: "Standard (100ml)",
        price: 15,
      },
      {
        option1Name: "Taille",
        option1Value: "Grande (150ml)",
        price: 20,
      },
      {
        option1Name: "Taille",
        option1Value: "Pot familial (400ml)",
        price: 50,
      }
    ],
    isModifier: true,
  },

  {
    handle: "sauce-harissa",
    sku: "SAU-HAR",
    name: "Sauce Harissa",
    category: "Modificateurs",
    description: "Harissa",
    image: "sauceharissa.png",
    price: 5,
    isModifier: true,
  },

  {
    handle: "sauce-ketchup",
    sku: "SAU-KET",
    name: "Sauce Ketchup",
    category: "Modificateurs",
    description: "Ketchup",
    image: "sauceketchup.png",
    price: 3,
    isModifier: true,
  },

  {
    handle: "sauce-mayo",
    sku: "SAU-MAY",
    name: "Sauce Mayo",
    category: "Modificateurs",
    description: "Mayo",
    image: "saucemayo.png",
    price: 3,
    isModifier: true,
  },

  {
    handle: "sauce-moutarde",
    sku: "SAU-MMI",
    name: "Sauce Moutarde-Miel",
    category: "Modificateurs",
    description: "Moutarde miel",
    image: "saucemoutardemiel.png",
    price: 5,
    isModifier: true,
  },

  {
    handle: "sauce-pesto",
    sku: "SAU-PES",
    name: "Sauce Pesto",
    category: "Modificateurs",
    description: "Pesto",
    image: "saucepesto.png",
    price: 8,
    isModifier: true,
  },

  {
    handle: "extra-saucisse",
    sku: "EXT-SAU",
    name: "Saucisse Extra",
    category: "Modificateurs",
    description: "Saucisse extra",
    image: "saucisseextra.png",
    price: 15,
    isModifier: true,
  },

  {
    handle: "shot-espresso",
    sku: "EXT-ESP",
    name: "Shot Espresso",
    category: "Modificateurs",
    description: "Shot espresso",
    image: "espresso.png",
    price: 8,
    isModifier: true,
  },

  {
    handle: "sir-van",
    sku: "SIR-VAN",
    name: "Sirop Supplément",
    category: "Modificateurs",
    image: "sirops.png",
    variants: [
      {
        option1Name: "Parfum",
        option1Value: "Vanille",
        price: 5,
      },
      {
        option1Name: "Parfum",
        option1Value: "Caramel",
        price: 5,
      },
      {
        option1Name: "Parfum",
        option1Value: "Noisette",
        price: 5,
      },
      {
        option1Name: "Parfum",
        option1Value: "Autre",
        price: 10,
      }
    ],
  },

  {
    handle: "topping-amandes",
    sku: "TOP-AMD",
    name: "Topping Amandes",
    category: "Modificateurs",
    description: "Amandes",
    image: "topamandes.png",
    price: 10,
    isModifier: true,
  },

  {
    handle: "topping-banane",
    sku: "TOP-BAN",
    name: "Topping Banane",
    category: "Modificateurs",
    description: "Banane",
    image: "topbanane.png",
    price: 8,
    isModifier: true,
  },

  {
    handle: "topping-caramel",
    sku: "TOP-CAR",
    name: "Topping Caramel",
    category: "Modificateurs",
    description: "Sauce caramel",
    image: "topcar.png",
    price: 8,
    isModifier: true,
  },

  {
    handle: "topping-choco",
    sku: "TOP-CHO",
    name: "Topping Chocolat",
    category: "Modificateurs",
    description: "Sauce chocolat",
    image: "topchoc.png",
    price: 8,
    isModifier: true,
  },

  {
    handle: "topping-coco",
    sku: "TOP-COC",
    name: "Topping Coco",
    category: "Modificateurs",
    description: "Coco râpée",
    image: "topcoco.png",
    price: 8,
    isModifier: true,
  },

  {
    handle: "topping-fraises",
    sku: "TOP-FRA",
    name: "Topping Fraises",
    category: "Modificateurs",
    description: "Fraises",
    image: "topfraises.png",
    price: 12,
    isModifier: true,
  },

  {
    handle: "topping-framboises",
    sku: "TOP-FRM",
    name: "Topping Framboises",
    category: "Modificateurs",
    description: "Framboises",
    image: "topframboise.png",
    price: 12,
    isModifier: true,
  },

  {
    handle: "topping-fruits",
    sku: "TOP-FRU",
    name: "Topping Fruits Rouges",
    category: "Modificateurs",
    description: "Fruits rouges",
    image: "topfruitsrouges.png",
    price: 12,
    isModifier: true,
  },

  {
    handle: "topping-kiwi",
    sku: "TOP-KIW",
    name: "Topping Kiwi",
    category: "Modificateurs",
    description: "Kiwi",
    image: "topkiwi.png",
    price: 10,
    isModifier: true,
  },

  {
    handle: "topping-lotus",
    sku: "TOP-LOT",
    name: "Topping Lotus",
    category: "Modificateurs",
    description: "Lotus",
    image: "toplot.png",
    price: 12,
    isModifier: true,
  },

  {
    handle: "topping-mnm",
    sku: "TOP-MNM",
    name: "Topping M&M's",
    category: "Modificateurs",
    description: "M&M's",
    image: "TOPM&ms.png",
    price: 10,
    isModifier: true,
  },

  {
    handle: "topping-miel",
    sku: "TOP-MIE",
    name: "Topping Miel",
    category: "Modificateurs",
    description: "Miel",
    image: "TOPMIEL.png",
    price: 8,
    isModifier: true,
  },

  {
    handle: "topping-noisettes",
    sku: "TOP-NOI",
    name: "Topping Noisettes",
    category: "Modificateurs",
    description: "Noisettes",
    image: "topnoisette.png",
    price: 10,
    isModifier: true,
  },

  {
    handle: "topping-nutella",
    sku: "TOP-NUT",
    name: "Topping Nutella",
    category: "Modificateurs",
    description: "Nutella",
    image: "topnut.png",
    price: 12,
    isModifier: true,
  },

  {
    handle: "topping-oreo",
    sku: "TOP-ORE",
    name: "Topping Oreo",
    category: "Modificateurs",
    description: "Biscuits Oreo",
    image: "TOPOREO.png",
    price: 10,
    isModifier: true,
  },

  {
    handle: "topping-pistache",
    sku: "TOP-PIS",
    name: "Topping Pistaches",
    category: "Modificateurs",
    description: "Pistaches",
    image: "toppistache.png",
    price: 12,
    isModifier: true,
  },

  {
    handle: "topping-smarties",
    sku: "TOP-SMA",
    name: "Topping Smarties",
    category: "Modificateurs",
    description: "Smarties",
    image: "TOPSMARTIES.png",
    price: 8,
    isModifier: true,
  },

  {
    handle: "topping-speculoos",
    sku: "TOP-SPE",
    name: "Topping Speculoos",
    category: "Modificateurs",
    description: "Biscuits speculoos",
    image: "TOPSPECULOOS.png",
    price: 10,
    isModifier: true,
  },

  {
    handle: "pizza-waffle-4-fromages",
    sku: "PW-4FR",
    name: "Pizza Waffle 4 Fromages",
    category: "Pizza Waffles",
    description: "Mozzarella, gorgonzola, chèvre, parmesan, noix, miel",
    image: "wafflepizza.png",
    price: 40,
  },

  {
    handle: "pizza-waffle-boisee",
    sku: "PW-BOI",
    name: "Pizza Waffle Boisée (Lyon) ⭐",
    category: "Pizza Waffles",
    description: "Poulet, mozzarella, poivron, champignons + sauce gruyère généreuse",
    image: "wafflepizza.png",
    price: 45,
  },

  {
    handle: "pizza-waffle-champignons-jambon",
    sku: "PW-CHJ",
    name: "Pizza Waffle Champignons & Jambon",
    category: "Pizza Waffles",
    description: "Crème fraîche, champignons, jambon, mozzarella, emmental",
    image: "wafflepizza.png",
    price: 40,
  },

  {
    handle: "pizza-waffle-margherita",
    sku: "PW-MAR",
    name: "Pizza Waffle Margherita",
    category: "Pizza Waffles",
    description: "Sauce tomate basilic, mozzarella, tomates cerises, basilic frais",
    image: "wafflepizza.png",
    price: 35,
  },

  {
    handle: "pizza-waffle-pepperoni",
    sku: "PW-PEP",
    name: "Pizza Waffle Pepperoni",
    category: "Pizza Waffles",
    description: "Sauce tomate, mozzarella, pepperoni, poivron rouge, oignon",
    image: "wafflepizza.png",
    price: 38,
  },

  {
    handle: "pizza-waffle-poulet-bbq",
    sku: "PW-BBQ",
    name: "Pizza Waffle Poulet BBQ",
    category: "Pizza Waffles",
    description: "Sauce BBQ, poulet, mozzarella, cheddar, oignon rouge, maïs",
    image: "wafflepizza.png",
    price: 42,
  },

  {
    handle: "pizza-waffle-thon-olives",
    sku: "PW-THO",
    name: "Pizza Waffle Thon & Olives",
    category: "Pizza Waffles",
    description: "Thon, mozzarella, olives noires, câpres, oignon, tomates cerises",
    image: "wafflepizza.png",
    price: 38,
  },

  {
    handle: "pizza-waffle-vegetarienne",
    sku: "PW-VEG",
    name: "Pizza Waffle Végétarienne",
    category: "Pizza Waffles",
    description: "Courgette, poivrons, champignons, olives, roquette, parmesan",
    image: "wafflepizza.png",
    price: 37,
  },

  {
    handle: "pizza-waffle-viande-hachee",
    sku: "PW-VHA",
    name: "Pizza Waffle Viande Hachée",
    category: "Pizza Waffles",
    description: "Viande hachée bœuf, mozzarella, cheddar, oignon, poivron, maïs",
    image: "wafflepizza.png",
    price: 42,
  },

  // ===== POTATO WAFFLES - BASE FROMAGÈRE =====
  {
    handle: "potato-waffle-fromage-pepperoni",
    sku: "PTW-FRO-PEP",
    name: "Potato Waffle Fromagère Pepperoni",
    category: "Potato Waffles",
    description: "Gaufre de pomme de terre vapeur croustillante, sauce fromagère crémeuse, pepperoni, mozzarella",
    image: "potatowaffle.png",
    price: 38,
  },

  {
    handle: "potato-waffle-fromage-thon",
    sku: "PTW-FRO-THO",
    name: "Potato Waffle Fromagère Thon",
    category: "Potato Waffles",
    description: "Gaufre de pomme de terre vapeur croustillante, sauce fromagère crémeuse, thon, olives, mozzarella",
    image: "potatowaffle.png",
    price: 38,
  },

  {
    handle: "potato-waffle-fromage-poulet",
    sku: "PTW-FRO-POU",
    name: "Potato Waffle Fromagère Poulet",
    category: "Potato Waffles",
    description: "Gaufre de pomme de terre vapeur croustillante, sauce fromagère crémeuse, poulet grillé, mozzarella",
    image: "potatowaffle.png",
    price: 40,
  },

  {
    handle: "potato-waffle-fromage-viande",
    sku: "PTW-FRO-VHA",
    name: "Potato Waffle Fromagère Viande Hachée",
    category: "Potato Waffles",
    description: "Gaufre de pomme de terre vapeur croustillante, sauce fromagère crémeuse, viande hachée bœuf, mozzarella",
    image: "potatowaffle.png",
    price: 40,
  },

  {
    handle: "potato-waffle-fromage-champignons",
    sku: "PTW-FRO-CHA",
    name: "Potato Waffle Fromagère Champignons",
    category: "Potato Waffles",
    description: "Gaufre de pomme de terre vapeur croustillante, sauce fromagère crémeuse, champignons frais, mozzarella",
    image: "potatowaffle.png",
    price: 35,
  },

  {
    handle: "potato-waffle-fromage-vegetarienne",
    sku: "PTW-FRO-VEG",
    name: "Potato Waffle Fromagère Végétarienne",
    category: "Potato Waffles",
    description: "Gaufre de pomme de terre vapeur croustillante, sauce fromagère crémeuse, poivrons, courgettes, champignons, mozzarella",
    image: "potatowaffle.png",
    price: 37,
  },

  {
    handle: "potato-waffle-fromage-3fromages",
    sku: "PTW-FRO-3FR",
    name: "Potato Waffle Fromagère 3 Fromages",
    category: "Potato Waffles",
    description: "Gaufre de pomme de terre vapeur croustillante, sauce fromagère crémeuse, cheddar, mozzarella, emmental",
    image: "potatowaffle.png",
    price: 40,
  },

  // ===== POTATO WAFFLES - BASE TOMATE =====
  {
    handle: "potato-waffle-tomate-pepperoni",
    sku: "PTW-TOM-PEP",
    name: "Potato Waffle Tomate Pepperoni",
    category: "Potato Waffles",
    description: "Gaufre de pomme de terre vapeur croustillante, sauce tomate basilic, pepperoni, mozzarella",
    image: "potatowaffle.png",
    price: 38,
  },

  {
    handle: "potato-waffle-tomate-thon",
    sku: "PTW-TOM-THO",
    name: "Potato Waffle Tomate Thon",
    category: "Potato Waffles",
    description: "Gaufre de pomme de terre vapeur croustillante, sauce tomate basilic, thon, olives, mozzarella",
    image: "potatowaffle.png",
    price: 38,
  },

  {
    handle: "potato-waffle-tomate-poulet",
    sku: "PTW-TOM-POU",
    name: "Potato Waffle Tomate Poulet",
    category: "Potato Waffles",
    description: "Gaufre de pomme de terre vapeur croustillante, sauce tomate basilic, poulet grillé, mozzarella",
    image: "potatowaffle.png",
    price: 40,
  },

  {
    handle: "potato-waffle-tomate-viande",
    sku: "PTW-TOM-VHA",
    name: "Potato Waffle Tomate Viande Hachée",
    category: "Potato Waffles",
    description: "Gaufre de pomme de terre vapeur croustillante, sauce tomate basilic, viande hachée bœuf, mozzarella",
    image: "potatowaffle.png",
    price: 40,
  },

  {
    handle: "potato-waffle-tomate-champignons",
    sku: "PTW-TOM-CHA",
    name: "Potato Waffle Tomate Champignons",
    category: "Potato Waffles",
    description: "Gaufre de pomme de terre vapeur croustillante, sauce tomate basilic, champignons frais, mozzarella",
    image: "potatowaffle.png",
    price: 35,
  },

  {
    handle: "potato-waffle-tomate-vegetarienne",
    sku: "PTW-TOM-VEG",
    name: "Potato Waffle Tomate Végétarienne",
    category: "Potato Waffles",
    description: "Gaufre de pomme de terre vapeur croustillante, sauce tomate basilic, poivrons, courgettes, champignons, mozzarella",
    image: "potatowaffle.png",
    price: 37,
  },

  {
    handle: "potato-waffle-tomate-3fromages",
    sku: "PTW-TOM-3FR",
    name: "Potato Waffle Tomate 3 Fromages",
    category: "Potato Waffles",
    description: "Gaufre de pomme de terre vapeur croustillante, sauce tomate basilic, cheddar, mozzarella, emmental",
    image: "potatowaffle.png",
    price: 40,
  },

  {
    handle: "shot-betterave",
    sku: "SHOT-BET",
    name: "Shot Betterave Boost",
    category: "Shots Vitaminés",
    description: "Énergie : betterave pomme citron gingembre",
    image: "shotbetterave.png",
    price: 26,
  },

  {
    handle: "shot-cayenne",
    sku: "SHOT-CAY",
    name: "Shot Cayenne Fire",
    category: "Shots Vitaminés",
    description: "Métabolisme : citron sirop érable cayenne",
    image: "shotcayenne.png",
    price: 24,
  },

  {
    handle: "shot-citron-menthe",
    sku: "SHOT-CIT",
    name: "Shot Citron Gingembre Menthe",
    category: "Shots Vitaminés",
    description: "Digestion : citron gingembre menthe miel",
    image: "shotcitmentgin.png",
    price: 22,
  },

  {
    handle: "shot-coco-ananas",
    sku: "SHOT-COC",
    name: "Shot Coco Ananas Immuno",
    category: "Shots Vitaminés",
    description: "Immunité : eau coco ananas citron gingembre",
    image: "shotananascoco.png",
    price: 27,
  },

  {
    handle: "shot-gingembre",
    sku: "SHOT-GIN",
    name: "Shot Gingembre Citron Pomme",
    category: "Shots Vitaminés",
    description: "Boost immunitaire : pomme citron gingembre miel",
    image: "shotginmenthecitron.png",
    price: 25,
  },

  {
    handle: "shot-lait-or",
    sku: "SHOT-LOR",
    name: "Shot Lait d'Or",
    category: "Shots Vitaminés",
    description: "Golden milk : lait coco curcuma gingembre cannelle",
    image: "shotlaidor.png",
    price: 28,
  },

  {
    handle: "shot-mangue-curcuma",
    sku: "SHOT-MAN",
    name: "Shot Mangue Curcuma Tropical",
    category: "Shots Vitaminés",
    description: "Tropical : mangue orange curcuma lait coco",
    image: "shotcurcumamangue.png",
    price: 28,
  },

  {
    handle: "shot-orange-curcuma",
    sku: "SHOT-ORA",
    name: "Shot Orange Curcuma Carotte",
    category: "Shots Vitaminés",
    description: "Vitamine C : orange carotte curcuma gingembre",
    image: "shotorangecurcar.png",
    price: 25,
  },

  {
    handle: "shot-proteine",
    sku: "SHOT-PRO",
    name: "Shot Protéine Verte",
    category: "Shots Vitaminés",
    description: "Protéines : lait amande spiruline épinards chia",
    image: "shotspiruline.png",
    price: 35,
  },

  {
    handle: "shot-vert-detox",
    sku: "SHOT-VER",
    name: "Shot Vert Détox",
    category: "Shots Vitaminés",
    description: "Détox : concombre céleri citron menthe spiruline",
    image: "shotvertdetox.png",
    price: 28,
  },

  {
    handle: "shot-wheatgrass",
    sku: "SHOT-WHE",
    name: "Shot Wheatgrass",
    category: "Shots Vitaminés",
    description: "Détox : herbe de blé pomme citron spiruline",
    image: "SHOTWHEATGRASS.png",
    price: 30,
  }

];

// Fonction utilitaire pour obtenir les produits par catégorie
export const getProductsByCategory = (category: string): Product[] => {
  return menuProducts.filter((product) => product.category === category);
};

// Fonction utilitaire pour obtenir toutes les catégories uniques
export const getAllCategories = (): string[] => {
  return Array.from(new Set(menuProducts.map((product: Product) => product.category)));
};

// Fonction utilitaire pour obtenir les catégories principales
export const getMainCategories = (): string[] => {
  const categories = getAllCategories();
  return Array.from(
    new Set(categories.map((cat: string) => cat.split(" - ")[0]))
  ).filter((cat: string) => cat !== "Modificateurs");
};
