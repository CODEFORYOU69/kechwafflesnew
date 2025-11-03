"use client";

import { useEffect, useState } from "react";
import FloatingBackground from "@/app/components/FloatingBackground";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Loader2 } from "lucide-react";

type ProductVariant = {
  option1Name: string | null;
  option1Value: string | null;
  option2Name: string | null;
  option2Value: string | null;
  price: number;
};

type Product = {
  handle: string;
  sku: string;
  name: string;
  category: string;
  description?: string | null;
  price?: number | null;
  variants?: ProductVariant[];
  isModifier?: boolean;
  hasTax?: boolean;
  image?: string | null;
  outOfStock?: boolean;
  isActive?: boolean;
};

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
    className={`p-4 border rounded-lg bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 ${
      product.outOfStock ? "opacity-70" : ""
    }`}
  >
    {product.image && (
      <div className="relative w-full h-32 mb-3 overflow-hidden rounded-md">
        <motion.div whileHover={{ scale: 1.1 }} className="h-full">
          <Image
            src={`/images/menu-items/${product.image}`}
            alt={product.name}
            fill
            className={`object-cover ${product.outOfStock ? "grayscale" : ""}`}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Badge "Victime de son succès" */}
        {product.outOfStock && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28">
            <Image
              src="/images/victime.png"
              alt="Victime de son succès"
              fill
              className="object-contain drop-shadow-lg"
            />
          </div>
        )}
      </div>
    )}
    <motion.div whileHover={{ scale: 1.02 }}>
      <h3 className={`font-semibold text-lg mb-1 ${product.outOfStock ? "text-gray-500" : ""}`}>
        {product.name}
      </h3>
      {product.description && (
        <p className={`text-sm mb-2 ${product.outOfStock ? "text-gray-400" : "text-gray-600"}`}>
          {product.description}
        </p>
      )}

      {product.variants && product.variants.length > 0 && (
        <div className="space-y-1">
          {product.variants.map((variant, index) => (
            <div key={index} className="text-sm">
              <span className={product.outOfStock ? "text-gray-400" : "text-gray-700"}>
                {variant.option1Value}
                {variant.option2Value && ` - ${variant.option2Value}`}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  </motion.div>
);

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Erreur chargement produits:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
      </div>
    );
  }

  // Organiser les produits par catégorie (filtrer les produits inactifs)
  const cafes = products.filter((p) => p.category === "Boissons - Cafés" && p.isActive !== false);
  const boissonsLactees = products.filter(
    (p) => p.category === "Boissons - Boissons Lactées" && p.isActive !== false
  );
  const milkshakes = products.filter(
    (p) => p.category === "Boissons - Milkshakes" && p.isActive !== false
  );
  const boissonsSpeciales = products.filter(
    (p) => p.category === "Boissons - Spécialisées" && p.isActive !== false
  );

  const desserts = products.filter((p) => p.category === "Desserts" && p.isActive !== false);
  const dessertsCans = products.filter(
    (p) => p.category === "Desserts - Cans" && p.isActive !== false
  );

  const pizzaWaffles = products.filter(
    (p) => p.category === "Pizza Waffles" && p.isActive !== false
  );

  const supplements = products.filter(
    (p) => p.category === "Modificateurs" && p.isActive !== false
  );

  const shotsVitamines = products.filter(
    (p) => p.category === "Shots Vitaminés" && p.isActive !== false
  );
  const eauxSoftDrinks = products.filter(
    (p) => p.category === "Eaux & Soft Drinks" && p.isActive !== false
  );
  const jusFrais = products.filter(
    (p) => p.category === "Jus Frais Pressés" && p.isActive !== false
  );
  const boissonsIceLactees = products.filter(
    (p) => p.category === "Boissons Ice Lactées" && p.isActive !== false
  );

  return (
    <FloatingBackground>
      <div className="relative min-h-screen">
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
                  <TabsTrigger value="pizzas" className="flex-1">
                    <motion.span whileHover={{ scale: 1.05 }}>
                      Pizza Waffles
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
                    <motion.div key="cafes" variants={fadeInUp}>
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

                    <motion.div key="boissons-lactees" variants={fadeInUp}>
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

                    <motion.div key="milkshakes" variants={fadeInUp}>
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

                    <motion.div key="boissons-speciales" variants={fadeInUp}>
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

                    <motion.div key="boissons-ice-lactees" variants={fadeInUp}>
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

                    <motion.div key="eaux-soft-drinks" variants={fadeInUp}>
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

                    <motion.div key="jus-frais" variants={fadeInUp}>
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

                    <motion.div key="shots-vitamines" variants={fadeInUp}>
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
                    <motion.div key="desserts" variants={fadeInUp}>
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

                    <motion.div key="cans" variants={fadeInUp}>
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

                {/* PIZZA WAFFLES SECTION */}
                <TabsContent
                  value="pizzas"
                  className="bg-white/90 rounded-lg p-6"
                >
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl font-bold mb-6"
                  >
                    Nos Pizza Waffles 🍕
                  </motion.h2>

                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="space-y-6"
                  >
                    <motion.div key="pizza-waffles" variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>Pizza Waffles</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {pizzaWaffles.map((product, idx) => (
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
                    Suppléments
                  </motion.h2>

                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="space-y-6"
                  >
                    <motion.div key="supplements" variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>Toppings, Sauces & Suppléments</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {supplements.map((product, idx) => (
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
