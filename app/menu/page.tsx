"use client";

import FloatingBackground from "@/app/components/FloatingBackground";
import { SparklesCore } from "@/components/ui/sparkles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { menuProducts, type Product } from "@/lib/menu-data";

interface ProductCardProps {
  product: Product;
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

// Product Card Component
const ProductCard = ({ product }: ProductCardProps) => (
  <motion.div
    variants={fadeInUp}
    whileHover={cardHover}
    className="p-4 border rounded-lg bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
  >
    {product.image && (
      <div className="relative w-full h-32 mb-3 overflow-hidden rounded-md">
        <motion.div whileHover={{ scale: 1.1 }} className="h-full">
          <Image
            src={`/images/menu-items/${product.image}`}
            alt={product.name}
            fill
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
    )}
    <motion.div whileHover={{ scale: 1.02 }}>
      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
      {product.description && (
        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
      )}

      {product.variants && product.variants.length > 0 ? (
        <div className="space-y-1">
          {product.variants.map((variant, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {variant.option1Value}
                {variant.option2Value && ` - ${variant.option2Value}`}
              </span>
              <span className="font-medium">{variant.price} Dh</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-lg font-medium text-green-600">{product.price} Dh</p>
      )}
    </motion.div>
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

  // Organiser les produits par catégorie
  const cafes = menuProducts.filter((p) => p.category === "Boissons - Cafés");
  const boissonsLactees = menuProducts.filter(
    (p) => p.category === "Boissons - Boissons Lactées"
  );
  const milkshakes = menuProducts.filter(
    (p) => p.category === "Boissons - Milkshakes"
  );
  const boissonsSpeciales = menuProducts.filter(
    (p) => p.category === "Boissons - Spécialisées"
  );

  const desserts = menuProducts.filter((p) => p.category === "Desserts");
  const dessertsCans = menuProducts.filter(
    (p) => p.category === "Desserts - Cans"
  );

  const briodogsSales = menuProducts.filter(
    (p) => p.category === "Briodogs Salés"
  );
  const briodogsSucres = menuProducts.filter(
    (p) => p.category === "Briodogs Sucrés"
  );

  const modificateurs = menuProducts.filter(
    (p) => p.category === "Modificateurs"
  );

  const shotsVitamines = menuProducts.filter(
    (p) => p.category === "Shots Vitaminés"
  );
  const eauxSoftDrinks = menuProducts.filter(
    (p) => p.category === "Eaux & Soft Drinks"
  );
  const jusFrais = menuProducts.filter(
    (p) => p.category === "Jus Frais Pressés"
  );
  const boissonsIceLactees = menuProducts.filter(
    (p) => p.category === "Boissons Ice Lactées"
  );

  return (
    <FloatingBackground>
      <div className="relative min-h-screen">
        {/* Green Sparkles - Full screen */}
        <div className="absolute inset-0 overflow-hidden">
          <SparklesCore
            id="sparkles-green-menu"
            background="transparent"
            minSize={1.5}
            maxSize={3.5}
            particleDensity={60}
            className="w-full h-full"
            particleColor="#22c55e"
          />
        </div>

        {/* Red Sparkles - Full screen */}
        <div className="absolute inset-0 overflow-hidden">
          <SparklesCore
            id="sparkles-red-menu"
            background="transparent"
            minSize={1.5}
            maxSize={3.5}
            particleDensity={60}
            className="w-full h-full"
            particleColor="#ef4444"
          />
        </div>

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
            <Tabs defaultValue="boissons" className="w-full">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <TabsList className="w-full mb-6 grid grid-cols-2 md:grid-cols-4">
                  <TabsTrigger value="boissons" className="flex-1">
                    <motion.span whileHover={{ scale: 1.05 }}>
                      Boissons
                    </motion.span>
                  </TabsTrigger>
                  <TabsTrigger value="desserts" className="flex-1">
                    <motion.span whileHover={{ scale: 1.05 }}>
                      Desserts
                    </motion.span>
                  </TabsTrigger>
                  <TabsTrigger value="briodogs" className="flex-1">
                    <motion.span whileHover={{ scale: 1.05 }}>
                      Briodogs
                    </motion.span>
                  </TabsTrigger>
                  <TabsTrigger value="extras" className="flex-1">
                    <motion.span whileHover={{ scale: 1.05 }}>
                      Extras
                    </motion.span>
                  </TabsTrigger>
                </TabsList>
              </motion.div>

              <AnimatePresence mode="wait">
                {/* BOISSONS SECTION */}
                <TabsContent
                  value="boissons"
                  className="bg-white/90 rounded-lg p-6"
                >
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl font-bold mb-6"
                  >
                    Nos Boissons
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
                            <CardTitle>Cafés</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {cafes.map((product, idx) => (
                            <ProductCard key={`${product.handle}-${product.sku}-${idx}`} product={product} />
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>Boissons Lactées</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {boissonsLactees.map((product, idx) => (
                            <ProductCard key={`${product.handle}-${product.sku}-${idx}`} product={product} />
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>Milkshakes</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {milkshakes.map((product, idx) => (
                            <ProductCard key={`${product.handle}-${product.sku}-${idx}`} product={product} />
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>Boissons Spécialisées</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {boissonsSpeciales.map((product, idx) => (
                            <ProductCard key={`${product.handle}-${product.sku}-${idx}`} product={product} />
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>Boissons Ice Lactées</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {boissonsIceLactees.map((product, idx) => (
                            <ProductCard key={`${product.handle}-${product.sku}-${idx}`} product={product} />
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>Eaux & Soft Drinks</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {eauxSoftDrinks.map((product, idx) => (
                            <ProductCard key={`${product.handle}-${product.sku}-${idx}`} product={product} />
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>Jus Frais Pressés</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {jusFrais.map((product, idx) => (
                            <ProductCard key={`${product.handle}-${product.sku}-${idx}`} product={product} />
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>Shots Vitaminés</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {shotsVitamines.map((product, idx) => (
                            <ProductCard key={`${product.handle}-${product.sku}-${idx}`} product={product} />
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                </TabsContent>

                {/* DESSERTS SECTION */}
                <TabsContent
                  value="desserts"
                  className="bg-white/90 rounded-lg p-6"
                >
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl font-bold mb-6"
                  >
                    Nos Desserts
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
                            <CardTitle>Desserts</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {desserts.map((product, idx) => (
                            <ProductCard key={`${product.handle}-${product.sku}-${idx}`} product={product} />
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>Cans</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {dessertsCans.map((product, idx) => (
                            <ProductCard key={`${product.handle}-${product.sku}-${idx}`} product={product} />
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                </TabsContent>

                {/* BRIODOGS SECTION */}
                <TabsContent
                  value="briodogs"
                  className="bg-white/90 rounded-lg p-6"
                >
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl font-bold mb-6"
                  >
                    Nos Briodogs
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
                            <CardTitle>Briodogs Salés</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {briodogsSales.map((product, idx) => (
                            <ProductCard key={`${product.handle}-${product.sku}-${idx}`} product={product} />
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>Briodogs Sucrés</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {briodogsSucres.map((product, idx) => (
                            <ProductCard key={`${product.handle}-${product.sku}-${idx}`} product={product} />
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                </TabsContent>

                {/* EXTRAS SECTION */}
                <TabsContent
                  value="extras"
                  className="bg-white/90 rounded-lg p-6"
                >
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl font-bold mb-6"
                  >
                    Extras & Modificateurs
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
                            <CardTitle>Toppings, Sauces & Extras</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {modificateurs.map((product, idx) => (
                            <ProductCard key={`${product.handle}-${product.sku}-${idx}`} product={product} />
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
