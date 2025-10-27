import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const pizzaWaffles = [
  {
    handle: "pizza-waffle-margherita",
    sku: "PW-MAR",
    name: "Pizza Waffle Margherita",
    category: "Pizza Waffles",
    description: "Sauce tomate basilic, mozzarella, tomates cerises, basilic frais",
    image: "pizza-margherita.png",
    price: 35,
    isModifier: false,
    hasTax: true,
  },
  {
    handle: "pizza-waffle-pepperoni",
    sku: "PW-PEP",
    name: "Pizza Waffle Pepperoni",
    category: "Pizza Waffles",
    description: "Sauce tomate, mozzarella, pepperoni, poivron rouge, oignon",
    image: "pizza-pepperoni.png",
    price: 38,
    isModifier: false,
    hasTax: true,
  },
  {
    handle: "pizza-waffle-4-fromages",
    sku: "PW-4FR",
    name: "Pizza Waffle 4 Fromages",
    category: "Pizza Waffles",
    description: "Mozzarella, gorgonzola, chèvre, parmesan, noix, miel",
    image: "pizza-4fromages.png",
    price: 40,
    isModifier: false,
    hasTax: true,
  },
  {
    handle: "pizza-waffle-vegetarienne",
    sku: "PW-VEG",
    name: "Pizza Waffle Végétarienne",
    category: "Pizza Waffles",
    description: "Courgette, poivrons, champignons, olives, roquette, parmesan",
    image: "pizza-vegetarienne.png",
    price: 37,
    isModifier: false,
    hasTax: true,
  },
  {
    handle: "pizza-waffle-viande-hachee",
    sku: "PW-VHA",
    name: "Pizza Waffle Viande Hachée",
    category: "Pizza Waffles",
    description: "Viande hachée bœuf, mozzarella, cheddar, oignon, poivron, maïs",
    image: "pizza-viande.png",
    price: 42,
    isModifier: false,
    hasTax: true,
  },
  {
    handle: "pizza-waffle-poulet-bbq",
    sku: "PW-BBQ",
    name: "Pizza Waffle Poulet BBQ",
    category: "Pizza Waffles",
    description: "Sauce BBQ, poulet, mozzarella, cheddar, oignon rouge, maïs",
    image: "pizza-poulet-bbq.png",
    price: 42,
    isModifier: false,
    hasTax: true,
  },
  {
    handle: "pizza-waffle-thon-olives",
    sku: "PW-THO",
    name: "Pizza Waffle Thon & Olives",
    category: "Pizza Waffles",
    description: "Thon, mozzarella, olives noires, câpres, oignon, tomates cerises",
    image: "pizza-thon.png",
    price: 38,
    isModifier: false,
    hasTax: true,
  },
  {
    handle: "pizza-waffle-champignons-jambon",
    sku: "PW-CHJ",
    name: "Pizza Waffle Champignons & Jambon",
    category: "Pizza Waffles",
    description: "Crème fraîche, champignons, jambon, mozzarella, emmental",
    image: "pizza-champignons.png",
    price: 40,
    isModifier: false,
    hasTax: true,
  },
  {
    handle: "pizza-waffle-boisee",
    sku: "PW-BOI",
    name: "Pizza Waffle Boisée (Lyon) ⭐",
    category: "Pizza Waffles",
    description: "Poulet, mozzarella, poivron, champignons + sauce gruyère généreuse",
    image: "pizza-boisee.png",
    price: 45,
    isModifier: false,
    hasTax: true,
  },
];

const sauceGruyere = {
  handle: "sauce-gruyere",
  sku: "SAU-GRU",
  name: "Sauce Gruyère Lyonnaise",
  category: "Modificateurs",
  image: "sauce-gruyere.png",
  isModifier: true,
  hasTax: true,
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
    },
  ],
};

const supplements = [
  {
    handle: "extra-mozzarella",
    sku: "EXT-MOZ",
    name: "Extra Mozzarella",
    category: "Modificateurs",
    description: "Supplément mozzarella",
    image: "mozzarella.png",
    price: 5,
    isModifier: true,
    hasTax: true,
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
    hasTax: true,
  },
  {
    handle: "extra-legumes-grilles",
    sku: "EXT-LEG",
    name: "Extra Légumes Grillés",
    category: "Modificateurs",
    description: "Supplément légumes grillés",
    image: "legumes-grilles.png",
    price: 5,
    isModifier: true,
    hasTax: true,
  },
  {
    handle: "extra-champignons",
    sku: "EXT-CHA",
    name: "Extra Champignons",
    category: "Modificateurs",
    description: "Supplément champignons",
    image: "champignons.png",
    price: 5,
    isModifier: true,
    hasTax: true,
  },
  {
    handle: "extra-olives",
    sku: "EXT-OLI",
    name: "Extra Olives",
    category: "Modificateurs",
    description: "Supplément olives",
    image: "olives.png",
    price: 3,
    isModifier: true,
    hasTax: true,
  },
  {
    handle: "extra-poulet-pizza",
    sku: "EXT-POU",
    name: "Extra Poulet",
    category: "Modificateurs",
    description: "Supplément poulet",
    image: "poulet.png",
    price: 10,
    isModifier: true,
    hasTax: true,
  },
  {
    handle: "extra-viande-hachee",
    sku: "EXT-VHA",
    name: "Extra Viande Hachée",
    category: "Modificateurs",
    description: "Supplément viande hachée",
    image: "viande-hachee.png",
    price: 10,
    isModifier: true,
    hasTax: true,
  },
  {
    handle: "extra-pepperoni",
    sku: "EXT-PEP",
    name: "Extra Pepperoni",
    category: "Modificateurs",
    description: "Supplément pepperoni",
    image: "pepperoni.png",
    price: 8,
    isModifier: true,
    hasTax: true,
  },
  {
    handle: "extra-jambon",
    sku: "EXT-JAM",
    name: "Extra Jambon",
    category: "Modificateurs",
    description: "Supplément jambon",
    image: "jambon.png",
    price: 8,
    isModifier: true,
    hasTax: true,
  },
  {
    handle: "extra-thon",
    sku: "EXT-THO",
    name: "Extra Thon",
    category: "Modificateurs",
    description: "Supplément thon",
    image: "thon.png",
    price: 8,
    isModifier: true,
    hasTax: true,
  },
];

async function addPizzaWaffles() {
  console.log("🍕 Ajout des Pizza Waffles...\n");

  try {
    // Ajouter les pizzas waffles
    for (const pizza of pizzaWaffles) {
      const existing = await prisma.product.findFirst({
        where: { sku: pizza.sku },
      });

      if (existing) {
        console.log(`⚠️  ${pizza.name} existe déjà (SKU: ${pizza.sku})`);
        continue;
      }

      await prisma.product.create({
        data: {
          ...pizza,
          isActive: true,
          displayOrder: 0,
          variants: {
            create: {
              price: pizza.price,
              isActive: true,
            },
          },
        },
      });

      console.log(`✅ ${pizza.name} ajouté (${pizza.price} MAD)`);
    }

    // Ajouter la sauce gruyère avec variantes
    const existingSauce = await prisma.product.findFirst({
      where: { sku: sauceGruyere.sku },
    });

    if (!existingSauce) {
      await prisma.product.create({
        data: {
          handle: sauceGruyere.handle,
          sku: sauceGruyere.sku,
          name: sauceGruyere.name,
          category: sauceGruyere.category,
          image: sauceGruyere.image,
          isModifier: sauceGruyere.isModifier,
          hasTax: sauceGruyere.hasTax,
          isActive: true,
          displayOrder: 0,
          variants: {
            create: sauceGruyere.variants.map((v) => ({
              option1Name: v.option1Name,
              option1Value: v.option1Value,
              price: v.price,
              isActive: true,
            })),
          },
        },
      });
      console.log(`✅ ${sauceGruyere.name} ajouté avec 4 tailles`);
    } else {
      console.log(`⚠️  ${sauceGruyere.name} existe déjà`);
    }

    // Ajouter les suppléments
    for (const supplement of supplements) {
      const existing = await prisma.product.findFirst({
        where: { sku: supplement.sku },
      });

      if (existing) {
        console.log(`⚠️  ${supplement.name} existe déjà (SKU: ${supplement.sku})`);
        continue;
      }

      await prisma.product.create({
        data: {
          ...supplement,
          isActive: true,
          displayOrder: 0,
          variants: {
            create: {
              price: supplement.price,
              isActive: true,
            },
          },
        },
      });

      console.log(`✅ ${supplement.name} ajouté (${supplement.price} MAD)`);
    }

    console.log("\n✨ Pizza Waffles et suppléments ajoutés avec succès!");
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout des Pizza Waffles:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

addPizzaWaffles();
