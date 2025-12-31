import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧇 Ajout des recettes signatures sucrées...\n');

  // Recettes signatures sucrées à ajouter
  const signatureRecipes = [
    {
      name: "La Dubai 🥧",
      handle: "la-dubai",
      sku: "SIG-DUBAI",
      category: "Desserts",
      description: "Gaufre Liège ou Bubble Waffle + pâte pistache, kadayif, chocolat noir, pistaches, tahini",
      price: 55,
      image: "dubaichocolatecan.png",
      displayOrder: 1,
    },
    {
      name: "La Souss-Massa 🥜",
      handle: "la-souss-massa",
      sku: "SIG-SOUSS",
      category: "Desserts",
      description: "Gaufre Liège + amlou maison, amandes, miel eucalyptus, fleur de sel",
      price: 50,
      image: "gaufres.jpg",
      displayOrder: 2,
    },
    {
      name: "La Marrakchia 🌹",
      handle: "la-marrakchia",
      sku: "SIG-MARRAKCHIA",
      category: "Desserts",
      description: "Gaufre Bruxelles ou Bubble + crème fleur d'oranger, fraises, pétales de rose, sirop rose, pistaches",
      price: 50,
      image: "glacefraise.png",
      displayOrder: 3,
    },
    {
      name: "L'Oasis 🌴",
      handle: "l-oasis",
      sku: "SIG-OASIS",
      category: "Desserts",
      description: "Gaufre Liège + crème de dattes, dattes fraîches, beurre cacahuète, amandes, fleur de sel",
      price: 50,
      image: "gaufres.jpg",
      displayOrder: 4,
    },
    {
      name: "La Tiramisu ☕",
      handle: "la-tiramisu",
      sku: "SIG-TIRAMISU",
      category: "Desserts",
      description: "Gaufre Liège + crème mascarpone café, cacao, biscuits spéculoos, sauce chocolat",
      price: 45,
      image: "BUBBLETIRA.png",
      displayOrder: 5,
    },
    {
      name: "La Lotus 🍪",
      handle: "la-lotus",
      sku: "SIG-LOTUS",
      category: "Desserts",
      description: "Gaufre Liège + pâte Lotus, biscuits Lotus émiettés, sauce caramel, chantilly",
      price: 45,
      image: "croffle.jpg",
      displayOrder: 6,
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

  console.log('\n🎉 Recettes signatures ajoutées avec succès!');

  // Afficher le résumé
  const desserts = await prisma.product.findMany({
    where: { category: 'Desserts', isActive: true },
    orderBy: { displayOrder: 'asc' }
  });

  console.log('\n📋 Desserts en base:');
  desserts.forEach((d, i) => {
    console.log(`  ${i+1}. ${d.name} - ${d.price} Dh`);
  });

  await prisma.$disconnect();
}

main();
