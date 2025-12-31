import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧇 Ajout des recettes signatures salées...\n');

  // Recettes signatures salées à ajouter
  const signatureRecipes = [
    {
      name: "La Marrakchiya 🌶️",
      handle: "la-marrakchiya",
      sku: "SIG-MARRAKCHIYA",
      category: "Pizza Waffles",
      description: "Kefta maison aux épices, sauce tomate harissa + cumin, poivrons grillés + oignons caramélisés, olives noires + coriandre fraîche",
      price: 45,
      image: "gaufres.jpg",
      displayOrder: 10,
    },
    {
      name: "La Fesiya 👑",
      handle: "la-fesiya",
      sku: "SIG-FESIYA",
      category: "Pizza Waffles",
      description: "Poulet confit aux citrons confits & olives, crème fraîche au ras el hanout, amandes effilées + fromage de chèvre, oignons rouges confits au miel, huile d'argan",
      price: 50,
      image: "gaufres.jpg",
      displayOrder: 11,
    },
    {
      name: "La Khli3 🥩",
      handle: "la-khli3",
      sku: "SIG-KHLI3",
      category: "Pizza Waffles",
      description: "Khli3 (viande séchée) émincé, œuf mollet au centre, poivrons rouges grillés, cumin + paprika fumé, fromage Hollandais + persil plat",
      price: 55,
      image: "gaufres.jpg",
      displayOrder: 12,
    },
  ];

  for (const recipe of signatureRecipes) {
    // Vérifier si existe déjà
    const existing = await prisma.product.findUnique({
      where: { sku: recipe.sku }
    });

    if (existing) {
      console.log(`⏭️  ${recipe.name} existe déjà, mise à jour...`);
      await prisma.product.update({
        where: { sku: recipe.sku },
        data: {
          name: recipe.name,
          description: recipe.description,
          price: recipe.price,
          image: recipe.image,
          displayOrder: recipe.displayOrder,
        }
      });
    } else {
      console.log(`✅ Création de ${recipe.name}...`);
      await prisma.product.create({
        data: {
          name: recipe.name,
          handle: recipe.handle,
          sku: recipe.sku,
          category: recipe.category,
          description: recipe.description,
          price: recipe.price,
          image: recipe.image,
          displayOrder: recipe.displayOrder,
          isActive: true,
          isModifier: false,
        }
      });
    }
  }

  console.log('\n🎉 Recettes signatures salées ajoutées avec succès!');

  // Afficher le résumé
  const pizzaWaffles = await prisma.product.findMany({
    where: { category: 'Pizza Waffles', isActive: true },
    orderBy: { displayOrder: 'asc' }
  });

  console.log('\n📋 Pizza Waffles en base:');
  pizzaWaffles.forEach((d, i) => {
    console.log(`  ${i+1}. ${d.name} - ${d.price} Dh`);
  });

  await prisma.$disconnect();
}

main();
