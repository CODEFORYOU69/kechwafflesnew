"use client";

import FloatingBackground from "@/app/components/FloatingBackground";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ProductImage {
  front: string;
  back: string;
  backDescription: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: ProductImage;
  backDescription: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "TiCanMisu",
    description: "Notre tiramisu signature en bocal",
    imageUrl: {
      front: "/images/menu-items/ticandaim.png",
      back: "/images/menu-items/ticandaim.png",
      backDescription:
        "Préparé avec amour, chaque couche est soigneusement assemblée...",
    },
    backDescription:
      "Un dessert traditionnel revisité, servi dans des bocaux hermétiques élégants. Parfait pour emporter ou offrir, nos TiCanMisu sont disponibles en plusieurs saveurs exquises : Dubai Chocolate, Amlou, Speculoos, et bien plus encore !",
  },
  {
    id: 2,
    name: "Waffle Pizza",
    description: "L'audace sucrée-salée réinventée",
    imageUrl: {
      front: "/images/menu-items/wafflepizza.jpg",
      back: "/images/menu-items/wafflepizza.jpg",
      backDescription:
        "Une création audacieuse qui marie la texture croustillante de la gaufre avec la générosité d'une pizza. Garnie de fromage fondant, tomates fraîches, et basilic, cette fusion culinaire unique saura surprendre vos papilles !",
    },
    backDescription:
      "Une création audacieuse qui marie la texture croustillante de la gaufre avec la générosité d'une pizza. Garnie de fromage fondant, tomates fraîches, et basilic, cette fusion culinaire unique saura surprendre vos papilles !",
  },
];

// Composant pour la flèche animée
function AnimatedArrow() {
  return (
    <motion.div
      className="w-24 h-24 mx-auto mt-4"
      initial="hidden"
      animate="visible"
    >
      <motion.svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-amber-900"
      >
        <motion.path
          d="M4 12 L20 12 M13 5 L20 12 L13 19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: 1,
            opacity: 1,
            transition: {
              pathLength: { duration: 1, repeat: Infinity },
              opacity: { duration: 0.2 },
            },
          }}
        />
      </motion.svg>
    </motion.div>
  );
}

export default function ProductPage() {
  return (
    <FloatingBackground>
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg inline-block">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-amber-900 mb-6"
          >
            Nos Produits Exclusifs
          </motion.h1>
        </div>
      </section>

      {/* Products Section */}
      <section className="max-w-5xl mx-auto px-4 py-12 mb-20">
        <div className="flex flex-col gap-24">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </FloatingBackground>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  // Réinitialiser l'état de la frappe lors du retournement
  const handleFlip = () => {
    if (isFlipped) {
      setIsTyping(false); // Arrête l'effet de frappe
      setTimeout(() => {
        setIsFlipped(false);
      }, 100); // Petit délai pour laisser le texte s'effacer
    } else {
      setIsFlipped(true);
      setIsTyping(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative group"
    >
      <motion.div
        style={{
          x,
          y,
          rotateX,
          rotateY,
          z: 100,
        }}
        drag
        dragElastic={0.1}
        dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
        whileTap={{ cursor: "grabbing" }}
        className="relative w-full bg-white/90 backdrop-blur-md rounded-xl p-8 cursor-grab"
      >
        {/* Ombre décorative */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300" />

        {/* Contenu de la carte */}
        <div className="relative bg-white/95 backdrop-blur-md rounded-lg p-6 flex flex-col items-center gap-8">
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
            <h2 className="text-4xl font-bold text-amber-900">
              {product.name}
            </h2>
          </div>

          {/* Container pour l'effet de flip */}
          <div className="w-full cursor-pointer" onClick={handleFlip}>
            <motion.div
              animate={{
                rotateY: isFlipped ? 180 : 0,
                scale: isFlipped ? 0.7 : 1,
              }}
              transition={{
                duration: 0.6,
                scale: { delay: isFlipped ? 0 : 0.3 },
              }}
              className="relative w-full preserve-3d"
            >
              {/* Face avant */}
              <div className="w-full backface-hidden">
                <div className="relative aspect-[16/9]">
                  <Image
                    src={product.imageUrl.front}
                    alt={product.name}
                    fill
                    className="object-contain rounded-lg"
                    priority
                  />
                </div>
              </div>

              {/* Face arrière */}
              <div
                className="absolute top-0 left-0 w-full h-full backface-hidden bg-amber-50/95 backdrop-blur-md rounded-lg p-6 flex flex-col items-center justify-between"
                style={{ transform: "rotateY(180deg)" }}
              >
                <div className="relative w-full aspect-[16/9]">
                  <Image
                    src={product.imageUrl.back}
                    alt={`${product.name} détail`}
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
                <motion.div
                  className="w-full text-center mt-4 font-mono bg-white/80 backdrop-blur-sm p-4 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isTyping ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isTyping && (
                    <TypewriterEffect
                      text={product.imageUrl.backDescription}
                      delay={50}
                    />
                  )}
                </motion.div>
              </div>
            </motion.div>

            {/* Flèche animée */}
            {!isFlipped && <AnimatedArrow />}
          </div>
        </div>
      </motion.div>

      {/* Ombre portée */}
      <div className="absolute -inset-4 -z-10 bg-amber-200/20 rounded-xl blur-xl transform-gpu opacity-50 group-hover:opacity-75 transition duration-300" />
    </motion.div>
  );
}

// Composant pour l'effet de machine à écrire
function TypewriterEffect({
  text,
  delay = 50,
}: {
  text: string;
  delay?: number;
}) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    setDisplayedText("");

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, delay);

    return () => clearInterval(timer);
  }, [text, delay]);

  return <span>{displayedText}</span>;
}
