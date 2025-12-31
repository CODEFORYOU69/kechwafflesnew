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

  // ===== SALÉES =====
  const basesSalees = products.filter(
    (p) => p.category === "Bases Salées" && p.isActive !== false
  );
  const saucesSalees = products.filter(
    (p) => p.category === "Sauces Salées" && p.isActive !== false
  );
  const recettesSignaturesSalees = products.filter(
    (p) => p.category === "Recettes Salées - Signatures" && p.isActive !== false
  );
  const recettesClassiquesSalees = products.filter(
    (p) => p.category === "Recettes Salées - Classiques" && p.isActive !== false
  );

  // ===== SUCRÉES =====
  const basesSucrees = products.filter(
    (p) => p.category === "Bases Sucrées" && p.isActive !== false
  );
  const recettesSignaturesSucrees = products.filter(
    (p) => p.category === "Recettes Sucrées - Signatures" && p.isActive !== false
  );
  const dessertsCans = products.filter(
    (p) => p.category === "Desserts - Cans" && p.isActive !== false
  );

  // ===== BOISSONS =====
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
  const boissonsIceLactees = products.filter(
    (p) => p.category === "Boissons Ice Lactées" && p.isActive !== false
  );
  const eauxSoftDrinks = products.filter(
    (p) => p.category === "Eaux & Soft Drinks" && p.isActive !== false
  );
  const jusFrais = products.filter(
    (p) => p.category === "Jus Frais Pressés" && p.isActive !== false
  );
  const shotsVitamines = products.filter(
    (p) => p.category === "Shots Vitaminés" && p.isActive !== false
  );

  // ===== SUPPLÉMENTS =====
  const allSupplements = products.filter(
    (p) => p.category === "Modificateurs" && p.isActive !== false
  );

  // Mots-clés pour identifier les suppléments salés
  const saltyKeywords = [
    "jambon", "mozzarella", "olives", "pepperoni", "poulet", "thon",
    "viande", "cheddar", "oignons", "gruyère", "gruyere", "harissa",
    "mayo", "pesto", "saucisse", "fromage", "oeuf", "œuf"
  ];

  const supplementsSales = allSupplements.filter((p) => {
    const nameLower = p.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return saltyKeywords.some((kw) => nameLower.includes(kw.normalize("NFD").replace(/[\u0300-\u036f]/g, "")));
  });

  const supplementsSucres = allSupplements.filter((p) => {
    const nameLower = p.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return !saltyKeywords.some((kw) => nameLower.includes(kw.normalize("NFD").replace(/[\u0300-\u036f]/g, "")));
  });

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
            <Tabs defaultValue="salees" className="w-full">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <TabsList className="w-full mb-6 grid grid-cols-2 md:grid-cols-4">
                  <TabsTrigger value="salees" className="flex-1">
                    <motion.span whileHover={{ scale: 1.05 }}>
                      Waffles Salées
                    </motion.span>
                  </TabsTrigger>
                  <TabsTrigger value="sucrees" className="flex-1">
                    <motion.span whileHover={{ scale: 1.05 }}>
                      Waffles Sucrées
                    </motion.span>
                  </TabsTrigger>
                  <TabsTrigger value="cans" className="flex-1">
                    <motion.span whileHover={{ scale: 1.05 }}>
                      Cans
                    </motion.span>
                  </TabsTrigger>
                  <TabsTrigger value="boissons" className="flex-1">
                    <motion.span whileHover={{ scale: 1.05 }}>
                      Boissons
                    </motion.span>
                  </TabsTrigger>
                </TabsList>
              </motion.div>

              <AnimatePresence mode="wait">
                {/* SALÉES SECTION */}
                <TabsContent
                  value="salees"
                  className="bg-white/90 rounded-lg p-6"
                >
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl font-bold mb-6"
                  >
                    Nos Waffles Salées 🧇
                  </motion.h2>

                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="space-y-6"
                  >
                    {/* Comment ça marche */}
                    <motion.div key="comment-ca-marche" variants={fadeInUp}>
                      <Card className="bg-amber-50 border-amber-200">
                        <CardHeader>
                          <CardTitle className="text-amber-800">Comment ça marche ?</CardTitle>
                        </CardHeader>
                        <CardContent className="text-amber-700">
                          <ol className="list-decimal list-inside space-y-2">
                            <li>Choisissez votre <strong>base</strong> (Pizza Waffle ou Potato Waffle)</li>
                            <li>Choisissez votre <strong>sauce</strong> (Tomate ou Crème)</li>
                            <li>Choisissez votre <strong>recette</strong> (Signature ou Classique)</li>
                            <li>Ajoutez des <strong>suppléments</strong> si vous le souhaitez !</li>
                          </ol>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Bases */}
                    <motion.div key="bases-salees" variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>1. Choisissez votre base</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {basesSalees.map((product, idx) => (
                            <ProductCard key={`${product.handle}-${product.sku}-${idx}`} product={product} />
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Sauces */}
                    <motion.div key="sauces-salees" variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>2. Choisissez votre sauce</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {saucesSalees.map((product, idx) => (
                            <ProductCard key={`${product.handle}-${product.sku}-${idx}`} product={product} />
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Recettes Signatures */}
                    <motion.div key="signatures-salees" variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow border-2 border-amber-400">
                        <CardHeader className="bg-amber-50">
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>3. Nos Recettes Signatures ⭐</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                          {recettesSignaturesSalees.map((product, idx) => (
                            <ProductCard key={`${product.handle}-${product.sku}-${idx}`} product={product} />
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Recettes Classiques */}
                    <motion.div key="classiques-salees" variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>3. Ou nos Recettes Classiques</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {recettesClassiquesSalees.map((product, idx) => (
                            <ProductCard key={`${product.handle}-${product.sku}-${idx}`} product={product} />
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Suppléments Salés */}
                    <motion.div key="supplements-salees" variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>4. Ajoutez des suppléments</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {supplementsSales.map((product, idx) => (
                            <ProductCard key={`${product.handle}-${product.sku}-${idx}`} product={product} />
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                </TabsContent>

                {/* SUCRÉES SECTION */}
                <TabsContent
                  value="sucrees"
                  className="bg-white/90 rounded-lg p-6"
                >
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl font-bold mb-6"
                  >
                    Nos Waffles Sucrées 🍫
                  </motion.h2>

                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="space-y-6"
                  >
                    {/* Comment ça marche */}
                    <motion.div key="comment-sucrees" variants={fadeInUp}>
                      <Card className="bg-pink-50 border-pink-200">
                        <CardHeader>
                          <CardTitle className="text-pink-800">Composez votre dessert !</CardTitle>
                        </CardHeader>
                        <CardContent className="text-pink-700">
                          <ol className="list-decimal list-inside space-y-2">
                            <li>Choisissez votre <strong>base</strong> (Gaufre, Craffle, Pancakes...)</li>
                            <li>Optez pour une de nos <strong>recettes signatures</strong> ou composez la vôtre</li>
                            <li>Ajoutez vos <strong>toppings</strong> (fruits, sauces, glaces...)</li>
                          </ol>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Bases Sucrées */}
                    <motion.div key="bases-sucrees" variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>1. Choisissez votre base</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {basesSucrees.map((product, idx) => (
                            <ProductCard key={`${product.handle}-${product.sku}-${idx}`} product={product} />
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Recettes Signatures Sucrées */}
                    <motion.div key="signatures-sucrees" variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow border-2 border-pink-400">
                        <CardHeader className="bg-pink-50">
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>2. Nos Créations Signatures ⭐</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                          {recettesSignaturesSucrees.map((product, idx) => (
                            <ProductCard key={`${product.handle}-${product.sku}-${idx}`} product={product} />
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Toppings Sucrés */}
                    <motion.div key="toppings-sucres" variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>3. Ajoutez vos toppings</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {supplementsSucres.map((product, idx) => (
                            <ProductCard key={`${product.handle}-${product.sku}-${idx}`} product={product} />
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>

                  </motion.div>
                </TabsContent>

                {/* CANS SECTION */}
                <TabsContent
                  value="cans"
                  className="bg-white/90 rounded-lg p-6"
                >
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl font-bold mb-6"
                  >
                    Nos Cans 🥫
                  </motion.h2>

                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="space-y-6"
                  >
                    {/* Description */}
                    <motion.div key="cans-desc" variants={fadeInUp}>
                      <Card className="bg-purple-50 border-purple-200">
                        <CardHeader>
                          <CardTitle className="text-purple-800">Desserts en pot à emporter !</CardTitle>
                        </CardHeader>
                        <CardContent className="text-purple-700">
                          <p>Nos créations gourmandes en format pratique. Parfait pour une pause sucrée où vous voulez !</p>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Cans */}
                    <motion.div key="cans-list" variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <CardTitle>Nos Cans</CardTitle>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {dessertsCans.map((product, idx) => (
                            <ProductCard key={`${product.handle}-${product.sku}-${idx}`} product={product} />
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                </TabsContent>

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

              </AnimatePresence>
            </Tabs>
          </motion.div>
        </motion.main>
      </div>
    </FloatingBackground>
  );
}
