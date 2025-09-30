"use client";

import FloatingBackground from "@/app/components/FloatingBackground";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

interface MenuItemProps {
  name: string;
  price?: number;
  image: string;
}

interface Recipe {
  name: string;
  description: string;
  image: string;
  price?: number;
}

interface RecipeCardProps {
  recipe: Recipe;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

const cardHover = {
  scale: 1.03,
  transition: { duration: 0.2 },
};

const imageHover = {
  scale: 1.1,
  transition: { duration: 0.3 },
};

// Menu Items Components
const MenuItem = ({
  name,
  price,
  image,
}: MenuItemProps) => (
  <motion.div
    variants={fadeInUp}
    whileHover={cardHover}
    className="p-4 border rounded-lg text-center bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow"
  >
    <div className="relative w-full h-32 mb-2 overflow-hidden rounded-md">
      <motion.div whileHover={imageHover} className="h-full">
        <Image
          src={`/images/menu-items/${image}`}
          alt={name}
          fill
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
    <motion.p className="font-semibold" whileHover={{ scale: 1.05 }}>
      {name}
    </motion.p>
    {price && (
      <motion.p
        className="text-sm text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {price} Dh
      </motion.p>
    )}
  </motion.div>
);

const RecipeCard = ({ recipe }: RecipeCardProps) => (
  <motion.div
    variants={fadeInUp}
    whileHover={cardHover}
    className="p-4 border rounded-lg bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
  >
    <div className="relative w-full h-40 mb-3 overflow-hidden rounded-md">
      <motion.div whileHover={imageHover} className="h-full">
        <Image
          src={`/images/menu-items/${recipe.image}`}
          alt={recipe.name}
          fill
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
    <motion.p className="font-semibold" whileHover={{ scale: 1.02 }}>
      {recipe.name}
    </motion.p>
    <motion.p
      className="text-sm text-gray-600"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      {recipe.description}
    </motion.p>
  </motion.div>
);

export default function MenuPage() {
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  const sweetBases = [
    { name: "Gaufres", price: 35, image: "gaufres.jpg" },
    { name: "Bubbles", price: 40, image: "bubbles.jpg" },
    { name: "Waffles", price: 35, image: "waffles.jpg" },
    { name: "Crauffles", price: 45, image: "crauffles.jpg" },
    { name: "Stuffed Brioche", price: 45, image: "brioche.jpg" },
    { name: "Ti Can Misu", price: 50, image: "ticanmisu.jpg" },
  ];

  const sauces = [
    { name: "Pistachio", price: 10, image: "sauce-pistache.jpg" },
    { name: "Strawberry", price: 10, image: "sauce-fraise.jpg" },
    { name: "Salted Caramel", price: 10, image: "sauce-caramel.jpg" },
    { name: "Hazelnut", price: 10, image: "sauce-noisette.jpg" },
    { name: "Speculoos", price: 10, image: "sauce-speculoos.jpg" },
    { name: "Ferrero", price: 10, image: "sauce-ferrero.jpg" },
    { name: "Milk Chocolate", price: 10, image: "sauce-chocolat-lait.jpg" },
    { name: "White Chocolate", price: 10, image: "sauce-chocolat-blanc.jpg" },
    { name: "Dark Chocolate", price: 10, image: "sauce-chocolat-noir.jpg" },
    { name: "Mango", price: 10, image: "sauce-mangue.jpg" },
  ];

  const toppings = [
    { name: "Kunefe", price: 10, image: "topping-kunefe.jpg" },
    { name: "Kinder", price: 10, image: "topping-kinder.jpg" },
    { name: "Oreo", price: 10, image: "topping-oreo.jpg" },
    { name: "Speculoos", price: 10, image: "topping-speculoos.jpg" },
    { name: "Coconut", price: 10, image: "topping-coco.jpg" },
    { name: "Fresh Strawberry", price: 10, image: "topping-fraise.jpg" },
    { name: "KitKat", price: 10, image: "topping-kitkat.jpg" },
    { name: "Bueno", price: 10, image: "topping-bueno.jpg" },
  ];

  const iceCream = [
    { name: "Vanilla", price: 15, image: "glace-vanille.jpg" },
    { name: "Chocolate", price: 15, image: "glace-chocolat.jpg" },
    { name: "Strawberry", price: 15, image: "glace-fraise.jpg" },
    { name: "Coffee", price: 15, image: "glace-cafe.jpg" },
    { name: "Pistachio", price: 15, image: "glace-pistache.jpg" },
    { name: "Caramel", price: 15, image: "glace-caramel.jpg" },
    { name: "Hazelnut", price: 15, image: "glace-noisette.jpg" },
    { name: "Rum Raisin", price: 15, image: "glace-rhum-raisin.jpg" },
  ];

  const savoryBases = [
    { name: "Stuffed Brioche", price: 40, image: "brioche-salee.jpg" },
    { name: "Soft Bread", price: 40, image: "pain-moelleux.jpg" },
    { name: "Naan", price: 40, image: "naan.jpg" },
    { name: "Flatbread", price: 40, image: "galette.jpg" },
  ];

  const proteins = [
    { name: "Chicken", image: "poulet.jpg", price: 10 },
    { name: "Beef", image: "boeuf.jpg", price: 10 },
    { name: "Kefta", image: "kefta.jpg", price: 10 },
    { name: "Tuna", image: "thon.jpg", price: 10 },
    { name: "Vegetarian", image: "vegetarien.jpg", price: 10 },
  ];

  const recipes = [
    {
      name: "Cheddar",
      description: "Melted cheddar sauce, caramelized onions, mild mustard",
      image: "recette-cheddar.jpg",
      price: 10,
    },
    {
      name: "Indian Goat Cheese",
      description: "Curry sauce, cashews, marinated red onions",
      image: "recette-chevre.jpg",
      price: 10,
    },
    {
      name: "Savoyard",
      description: "Raclette cheese, potatoes, onions, mushrooms",
      image: "recette-savoyard.jpg",
      price: 10,
    },
    {
      name: "Thai",
      description:
        "Sweet-salty soy sauce, sautéed vegetables, spicy coconut sauce",
      image: "recette-thai.jpg",
      price: 10,
    },
    {
      name: "Moroccan",
      description: "Traditional spices, candied onions, mild harissa",
      image: "recette-marocain.jpg",
      price: 10,
    },
  ];

  const extras = [
    { name: "Extra Cheese", price: 8, image: "extra-fromage.jpg" },
    { name: "Fried Egg", price: 8, image: "extra-oeuf.jpg" },
    { name: "Avocado", price: 8, image: "extra-avocat.jpg" },
    { name: "Mushrooms", price: 8, image: "extra-champignons.jpg" },
    { name: "Jalapenos", price: 8, image: "extra-jalapenos.jpg" },
    { name: "Bacon", price: 8, image: "extra-bacon.jpg" },
  ];

  const drinks = {
    softDrinks: [
      { name: "Coca-Cola", price: 15, image: "coca.jpg" },
      { name: "Sprite", price: 15, image: "sprite.jpg" },
      { name: "Fanta", price: 15, image: "fanta.jpg" },
      { name: "Schweppes", price: 15, image: "schweppes.jpg" },
    ],
    coffees: [
      { name: "Espresso", price: 18, image: "espresso.jpg" },
      { name: "Americano", price: 20, image: "americano.jpg" },
      { name: "Cappuccino", price: 25, image: "cappuccino.jpg" },
      { name: "Café Latte", price: 25, image: "latte.jpg" },
      { name: "Mocha", price: 28, image: "moka.jpg" },
    ],
    dairyDrinks: [
      { name: "Hot Chocolate", price: 25, image: "chocolat-chaud.jpg" },
      { name: "Chai Latte", price: 28, image: "chai-latte.jpg" },
      { name: "Matcha Latte", price: 30, image: "matcha-latte.jpg" },
    ],
    milkshakes: [
      { name: "Vanilla", price: 35, image: "milkshake-vanille.jpg" },
      { name: "Chocolate", price: 35, image: "milkshake-chocolat.jpg" },
      { name: "Strawberry", price: 35, image: "milkshake-fraise.jpg" },
      { name: "Oreo", price: 38, image: "milkshake-oreo.jpg" },
      { name: "Nutella", price: 38, image: "milkshake-nutella.jpg" },
      { name: "Caramel", price: 35, image: "milkshake-caramel.jpg" },
    ],
  };

  return (
    <FloatingBackground>
      <div className="relative min-h-screen">
        <FlickeringGrid className="absolute inset-0" />

        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 min-h-screen p-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative z-10 max-w-4xl mx-auto"
          >
            <Tabs defaultValue="sweet" className="w-full">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="sweet" className="flex-1">
                    <motion.span whileHover={{ scale: 1.05 }}>
                      Sweet Delights
                    </motion.span>
                  </TabsTrigger>
                  <TabsTrigger value="savory" className="flex-1">
                    <motion.span whileHover={{ scale: 1.05 }}>
                      Savory Delights
                    </motion.span>
                  </TabsTrigger>
                  <TabsTrigger value="drinks" className="flex-1">
                    <motion.span whileHover={{ scale: 1.05 }}>
                      Drinks
                    </motion.span>
                  </TabsTrigger>
                </TabsList>
              </motion.div>

              <AnimatePresence mode="wait">
                {/* SWEET SECTION */}
                <TabsContent
                  value="sweet"
                  className="bg-white/90 rounded-lg p-6"
                >
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl font-bold mb-6"
                  >
                    Create your sweet delight
                  </motion.h2>

                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="space-y-6"
                  >
                    <motion.div variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>1. Choose your base</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {sweetBases.map((base, index) => (
                            <motion.div
                              key={`sweet-base-${base.name}`}
                              variants={fadeInUp}
                              custom={index}
                            >
                              <MenuItem
                                name={base.name}
                                price={base.price}
                                image={base.image}
                              />
                            </motion.div>
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>2. Choose your sauce (10 Dh)</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {sauces.map((sauce, index) => (
                            <motion.div
                              key={`sauce-${sauce.name}`}
                              variants={fadeInUp}
                              custom={index}
                            >
                              <MenuItem
                                name={sauce.name}
                                image={sauce.image}
                                price={sauce.price}
                              />
                            </motion.div>
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>
                              3. Add your toppings (10 Dh each)
                            </CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {toppings.map((topping, index) => (
                            <motion.div
                              key={`topping-${topping.name}`}
                              variants={fadeInUp}
                              custom={index}
                            >
                              <MenuItem
                                name={topping.name}
                                image={topping.image}
                                price={topping.price}
                              />
                            </motion.div>
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>
                              4. Artisanal Ice Cream (15 Dh/scoop)
                            </CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {iceCream.map((item, index) => (
                            <motion.div
                              key={`ice-cream-${item.name}`}
                              variants={fadeInUp}
                              custom={index}
                            >
                              <MenuItem
                                name={item.name}
                                image={item.image}
                                price={item.price}
                              />
                            </motion.div>
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                </TabsContent>

                {/* SAVORY SECTION */}
                <TabsContent
                  value="savory"
                  className="bg-white/90 rounded-lg p-6"
                >
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl font-bold mb-6"
                  >
                    Create your savory delight
                  </motion.h2>

                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="space-y-6"
                  >
                    <motion.div variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>1. Choose your base (40 Dh)</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {savoryBases.map((base, index) => (
                            <motion.div
                              key={`savory-base-${base.name}`}
                              variants={fadeInUp}
                              custom={index}
                            >
                              <MenuItem
                                name={base.name}
                                image={base.image}
                                price={base.price}
                              />
                            </motion.div>
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>
                              2. Choose your protein (included)
                            </CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {proteins.map((protein, index) => (
                            <motion.div
                              key={`protein-${protein.name}`}
                              variants={fadeInUp}
                              custom={index}
                            >
                              <MenuItem
                                name={protein.name}
                                image={protein.image}
                                price={protein.price}
                              />
                            </motion.div>
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>3. Choose your recipe (10 Dh)</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {recipes.map((recipe, index) => (
                            <motion.div
                              key={`recipe-${recipe.name}`}
                              variants={fadeInUp}
                              custom={index}
                            >
                              <RecipeCard recipe={recipe} />
                            </motion.div>
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>4. Extras (8 Dh each)</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {extras.map((extra, index) => (
                            <motion.div
                              key={`extra-${extra.name}`}
                              variants={fadeInUp}
                              custom={index}
                            >
                              <MenuItem
                                name={extra.name}
                                image={extra.image}
                                price={extra.price}
                              />
                            </motion.div>
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                </TabsContent>

                {/* DRINKS SECTION */}
                <TabsContent
                  value="drinks"
                  className="bg-white/90 rounded-lg p-6"
                >
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl font-bold mb-6"
                  >
                    Our Drinks
                  </motion.h2>

                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="space-y-6"
                  >
                    <motion.div variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>Soft Drinks</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {drinks.softDrinks.map((drink, index) => (
                            <motion.div
                              key={`soft-drink-${drink.name}`}
                              variants={fadeInUp}
                              custom={index}
                            >
                              <MenuItem
                                name={drink.name}
                                image={drink.image}
                                price={drink.price}
                              />
                            </motion.div>
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>Coffees</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {drinks.coffees.map((coffee, index) => (
                            <motion.div
                              key={`coffee-${coffee.name}`}
                              variants={fadeInUp}
                              custom={index}
                            >
                              <MenuItem
                                name={coffee.name}
                                image={coffee.image}
                                price={coffee.price}
                              />
                            </motion.div>
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>Special Drinks</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {drinks.dairyDrinks.map((drink, index) => (
                            <motion.div
                              key={`dairy-drink-${drink.name}`}
                              variants={fadeInUp}
                              custom={index}
                            >
                              <MenuItem
                                name={drink.name}
                                image={drink.image}
                                price={drink.price}
                              />
                            </motion.div>
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>Homemade Milkshakes</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {drinks.milkshakes.map((shake, index) => (
                            <motion.div
                              key={`milkshake-${shake.name}`}
                              variants={fadeInUp}
                              custom={index}
                            >
                              <MenuItem
                                name={shake.name}
                                image={shake.image}
                                price={shake.price}
                              />
                            </motion.div>
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </motion.div>
        </motion.main>
      </div>
    </FloatingBackground>
  );
}
