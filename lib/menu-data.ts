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
    category: "Boissons - Cafés",
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
    image: "thémenthe.png",
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

  // ===== BASES SUCRÉES =====
  {
    handle: "base-gaufre-liegeoise",
    sku: "BASE-LIE",
    name: "Gaufre Liégeoise",
    category: "Bases Sucrées",
    description: "Authentique gaufre liégeoise avec perles de sucre caramélisées",
    image: "waffles.png",
    price: 30,
  },
  {
    handle: "base-gaufre-bruxelles",
    sku: "BASE-BRU",
    name: "Gaufre Bruxelles",
    category: "Bases Sucrées",
    description: "Gaufre légère et croustillante",
    image: "waffles.png",
    price: 25,
  },
  {
    handle: "base-craffle",
    sku: "BASE-CRA",
    name: "Craffle",
    category: "Bases Sucrées",
    description: "Croissant gaufré croustillant",
    image: "croffle.jpg",
    price: 35,
  },
  {
    handle: "base-pancakes",
    sku: "BASE-PAN",
    name: "Pancakes",
    category: "Bases Sucrées",
    description: "Stack de pancakes moelleux",
    image: "pancakestiramisu.png",
    price: 35,
  },
  {
    handle: "base-bubble-waffle",
    sku: "BASE-BUB",
    name: "Bubble Waffle",
    category: "Bases Sucrées",
    description: "Gaufre bulle en cornet",
    image: "BUBBLETIRA.png",
    price: 40,
  },

  // ===== RECETTES SUCRÉES SIGNATURES =====
  {
    handle: "la-dubai",
    sku: "SIG-DUBAI",
    name: "La Dubai 🥧",
    category: "Recettes Sucrées - Signatures",
    description: "Pâte pistache, kadayif, chocolat noir, pistaches, tahini",
    image: "dubaichocolatecan.png",
    price: 55,
  },
  {
    handle: "la-souss-massa",
    sku: "SIG-SOUSS",
    name: "La Souss-Massa 🥜",
    category: "Recettes Sucrées - Signatures",
    description: "Amlou maison, amandes, miel eucalyptus, fleur de sel",
    image: "gaufres.jpg",
    price: 50,
  },
  {
    handle: "la-marrakchia",
    sku: "SIG-MARRAKCHIA",
    name: "La Marrakchia 🌹",
    category: "Recettes Sucrées - Signatures",
    description: "Crème fleur d'oranger, fraises, pétales de rose, sirop rose, pistaches",
    image: "glacefraise.png",
    price: 50,
  },
  {
    handle: "l-oasis",
    sku: "SIG-OASIS",
    name: "L'Oasis 🌴",
    category: "Recettes Sucrées - Signatures",
    description: "Crème de dattes, dattes fraîches, beurre cacahuète, amandes, fleur de sel",
    image: "gaufres.jpg",
    price: 50,
  },
  {
    handle: "la-tiramisu",
    sku: "SIG-TIRAMISU",
    name: "La Tiramisu ☕",
    category: "Recettes Sucrées - Signatures",
    description: "Crème mascarpone café, cacao, biscuits spéculoos, sauce chocolat",
    image: "BUBBLETIRA.png",
    price: 45,
  },
  {
    handle: "la-lotus",
    sku: "SIG-LOTUS",
    name: "La Lotus 🍪",
    category: "Recettes Sucrées - Signatures",
    description: "Pâte Lotus, biscuits Lotus émiettés, sauce caramel, chantilly",
    image: "croffle.jpg",
    price: 45,
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
    name: "Extra Jambon (halal)",
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
        option1Value: "Vanille",
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
    handle: "topping-daim",
    sku: "TOP-DAI",
    name: "Topping Daim",
    category: "Modificateurs",
    description: "Morceaux de Daim",
    image: "daim.png",
    price: 10,
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

  // ===== BASES SALÉES =====
  {
    handle: "base-pizza-waffle",
    sku: "BASE-PW",
    name: "Pizza Waffle",
    category: "Bases Salées",
    description: "Gaufre croustillante façon pizza",
    image: "wafflepizza.png",
    price: 30,
  },
  {
    handle: "base-potato-waffle",
    sku: "BASE-PTW",
    name: "Potato Waffle",
    category: "Bases Salées",
    description: "Gaufre de pomme de terre vapeur croustillante",
    image: "potatowaffle.png",
    price: 37,
  },

  // ===== SAUCES SALÉES =====
  {
    handle: "sauce-base-tomate",
    sku: "SAUCE-TOM",
    name: "Base Tomate",
    category: "Sauces Salées",
    description: "Sauce tomate maison au basilic",
    image: "sauce-tomate.png",
    price: 0,
  },
  {
    handle: "sauce-base-creme",
    sku: "SAUCE-CRE",
    name: "Base Crème",
    category: "Sauces Salées",
    description: "Sauce crème onctueuse",
    image: "saucegruyere.png",
    price: 0,
  },

  // ===== RECETTES SALÉES SIGNATURES =====
  {
    handle: "la-marrakchiya",
    sku: "SIG-MARRAKCHIYA",
    name: "La Marrakchiya 🌶️",
    category: "Recettes Salées - Signatures",
    description: "Kefta maison aux épices, sauce tomate harissa + cumin, poivrons grillés + oignons caramélisés, olives noires + coriandre fraîche",
    image: "image00016.jpeg",
    price: 45,
  },
  {
    handle: "la-fesiya",
    sku: "SIG-FESIYA",
    name: "La Fesiya 👑",
    category: "Recettes Salées - Signatures",
    description: "Poulet confit aux citrons confits & olives, crème fraîche au ras el hanout, amandes effilées + fromage de chèvre, oignons rouges confits au miel, huile d'argan",
    image: "image00017.jpeg",
    price: 50,
  },
  {
    handle: "la-khli3",
    sku: "SIG-KHLI3",
    name: "La Khli3 🥩",
    category: "Recettes Salées - Signatures",
    description: "Khli3 (viande séchée) émincé, œuf mollet au centre, poivrons rouges grillés, cumin + paprika fumé, fromage Hollandais + persil plat",
    image: "image00001.jpeg",
    price: 55,
  },
  {
    handle: "la-boisee",
    sku: "SIG-BOISEE",
    name: "La Boisée (Lyon) ⭐",
    category: "Recettes Salées - Signatures",
    description: "Poulet, mozzarella, poivron, pomme de terre + sauce gruyère généreuse",
    image: "wafflepizza.png",
    price: 45,
  },

  // ===== RECETTES SALÉES CLASSIQUES =====
  {
    handle: "recette-pepperoni",
    sku: "REC-PEP",
    name: "Pepperoni",
    category: "Recettes Salées - Classiques",
    description: "Mozzarella, pepperoni, poivron rouge, oignon",
    image: "extrapepperoni.png",
    price: 38,
  },
  {
    handle: "recette-thon-olives",
    sku: "REC-THO",
    name: "Thon & Olives",
    category: "Recettes Salées - Classiques",
    description: "Thon, mozzarella, olives noires, oignon, tomates",
    image: "extrathon.png",
    price: 38,
  },
  {
    handle: "recette-viande-hachee",
    sku: "REC-VHA",
    name: "Viande Hachée",
    category: "Recettes Salées - Classiques",
    description: "Viande hachée bœuf, mozzarella, cheddar, oignon, poivron, maïs",
    image: "extraviandehachée.png",
    price: 42,
  },
  {
    handle: "recette-poulet-bbq",
    sku: "REC-BBQ",
    name: "Poulet BBQ",
    category: "Recettes Salées - Classiques",
    description: "Sauce BBQ, poulet, mozzarella, cheddar, oignon rouge, maïs",
    image: "extrapoulet.png",
    price: 42,
  },
  {
    handle: "recette-4-fromages",
    sku: "REC-4FR",
    name: "4 Fromages",
    category: "Recettes Salées - Classiques",
    description: "Mozzarella, bleu, chèvre, parmesan",
    image: "extramozza.png",
    price: 40,
  },
  {
    handle: "recette-vegetarienne",
    sku: "REC-VEG",
    name: "Végétarienne",
    category: "Recettes Salées - Classiques",
    description: "Aubergines, poivrons, olives, parmesan",
    image: "extralegumegrille.png",
    price: 37,
  },
  {
    handle: "recette-margherita",
    sku: "REC-MAR",
    name: "Margherita",
    category: "Recettes Salées - Classiques",
    description: "Mozzarella, tomates cerises, basilic frais",
    image: "wafflepizza.png",
    price: 35,
  },
  {
    handle: "recette-champignons-jambon",
    sku: "REC-CHJ",
    name: "Champignons & Jambon",
    category: "Recettes Salées - Classiques",
    description: "Crème fraîche, champignons, jambon, mozzarella, emmental",
    image: "extrachampignon.png",
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
    name: "Shot Citron Gingembre Menthe Pomme",
    category: "Shots Vitaminés",
    description: "Digestion & Immunité : citron gingembre menthe pomme miel",
    image: "shotcitmentgin.png",
    price: 25,
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
