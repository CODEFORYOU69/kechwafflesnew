"use client";

import FloatingBackground from "@/app/components/FloatingBackground";
import { motion } from "framer-motion";
import Image from "next/image";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const container: StyleProps = {
  margin: "0 auto",
  maxWidth: "1200px",
  width: "100%",
  padding: "0 20px",
};

const cardContainer: StyleProps = {
  overflow: "hidden",
  position: "relative",
  width: "100%",
  aspectRatio: "4/5",
};

const card: StyleProps = {
  width: "100%",
  height: "100%",
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "20px",
  background: "white",
  boxShadow:
    "0 0 1px hsl(0deg 0% 0% / 0.075), 0 0 2px hsl(0deg 0% 0% / 0.075), 0 0 4px hsl(0deg 0% 0% / 0.075), 0 0 8px hsl(0deg 0% 0% / 0.075), 0 0 16px hsl(0deg 0% 0% / 0.075)",
  transformOrigin: "center",
};

interface StyleProps {
  [key: string]: string | number | undefined;
}

interface galleryImages {
  src: string;
  hueA: number;
  hueB: number;
}

const hue = (h: number): string => `hsl(${h}, 100%, 50%)`;

const splash: StyleProps = {
  position: "absolute",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  clipPath: `path("M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z")`,
};

const galleryImages: [string, number, number][] = [
  ["/images/story/gallery-1.jpg", 340, 10],
  ["/images/story/gallery-2.jpg", 20, 40],
  ["/images/story/gallery-3.jpg", 60, 90],
  ["/images/story/gallery-4.jpg", 80, 120],
  ["/images/story/gallery-5.jpg", 100, 140],
  ["/images/story/gallery-6.jpg", 205, 245],
  ["/images/story/gallery-7.jpg", 260, 290],
  ["/images/story/gallery-8.jpg", 290, 320],
];

export default function NostreHistoire() {
  return (
    <FloatingBackground>
      {/* Hero Section */}
      <section className="relative h-screen">
        <Image
          src="/images/story/hero-background.jpg"
          alt="Kech Waffles Atmosphere"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center"
        >
          <div className="bg-black/40 backdrop-blur-sm p-8 rounded-lg inline-block">
            <motion.h1
              variants={fadeIn}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              🧇 Kech Waffles
            </motion.h1>
            <motion.p
              variants={fadeIn}
              className="text-2xl text-white font-bold mb-4"
            >
              L&apos;Art de la Gaufre Maison à Marrakech
            </motion.p>
            <motion.p
              variants={fadeIn}
              className="text-xl text-white/90 max-w-2xl"
            >
              Le premier concept 100% artisanal de gaufres gourmandes au cœur de Marrakech.
              Notre passion : créer des gaufres exceptionnelles avec des ingrédients nobles
              et un savoir-faire authentique.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-20 container mx-auto px-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={fadeIn}
            className="space-y-6 bg-white/80 backdrop-blur-sm p-8 rounded-lg"
          >
            <h2 className="text-4xl font-bold text-[#2a2a2a]">🏡 Le Fait Maison Avant Tout</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Chez Kech Waffles, chaque gaufre est une création unique, préparée avec amour
              et patience. Nous croyons en la valeur du fait maison et refusons tout compromis
              sur la qualité.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Pâtes préparées quotidiennement dans notre laboratoire</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Sauces chocolat & pistache créées maison avec recettes exclusives</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Garnitures fraîches sélectionnées chaque matin</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Cuisson minute pour une fraîcheur incomparable</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Glaces artisanales préparées avec soin</span>
              </li>
            </ul>
          </motion.div>
          <motion.div
            variants={fadeIn}
            className="relative h-[500px] rounded-lg overflow-hidden"
          >
            <Image
              src="/images/story/origin.jpg"
              alt="Notre philosophie du fait maison"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Ingredients Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={fadeIn}
            className="text-4xl font-bold text-center text-[#2a2a2a] mb-8"
          >
            🌍 Des Ingrédients d&apos;Exception
          </motion.h2>
          <motion.p
            variants={fadeIn}
            className="text-center text-lg text-gray-700 mb-16 max-w-3xl mx-auto"
          >
            Notre engagement : n&apos;utiliser que les meilleurs produits pour vous offrir
            une expérience gustative inoubliable.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "🇧🇪 Chocolat Callebaut",
                country: "Belgique",
                description:
                  "Le chocolat des plus grands chocolatiers du monde. Texture soyeuse, goût intense, qualité professionnelle. Nos sauces chocolat (noir, lait, blanc) sont préparées chaque jour avec ce chocolat d'exception et de la crème fraîche premium.",
                image: "/images/story/quality.jpg",
              },
              {
                title: "🌰 Crème Pistache",
                country: "Qualité Premium",
                description: "Une crème pistache authentique au goût intense pour nos créations signature. Sélectionnée parmi les meilleures pour sa richesse en saveur.",
                image: "/images/story/innovation.jpg",
              },
              {
                title: "🍰 Mascarpone",
                country: "Qualité Supérieure",
                description:
                  "Pour notre crème tiramisu maison, nous utilisons du mascarpone de qualité. Texture crémeuse, goût authentique italien.",
                image: "/images/story/sharing.jpg",
              },
            ].map((ingredient) => (
              <motion.div
                key={ingredient.title}
                variants={fadeIn}
                className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg"
              >
                <div className="relative h-48 rounded-lg overflow-hidden mb-6">
                  <Image
                    src={ingredient.image}
                    alt={ingredient.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2">{ingredient.title}</h3>
                <p className="text-amber-600 font-medium mb-3">{ingredient.country}</p>
                <p className="text-gray-700 leading-relaxed">{ingredient.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Signature Creations Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-20 bg-[#2a2a2a] text-white"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={fadeIn}
            className="text-4xl font-bold text-center mb-12"
          >
            🌟 Nos Créations Signature
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div variants={fadeIn} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-amber-400">🍕 Pizza Waffles</h3>
                <p className="text-lg leading-relaxed">
                  Notre concept innovant qui fusionne l&apos;Italie et la Belgique ! Une gaufre
                  SALÉE maison (fromages, herbes, lardons) garnie comme une vraie pizza,
                  gratinée au four. Base tomate ou base blanche, garnitures au choix.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-amber-400">🥔 Potato Waffles</h3>
                <p className="text-lg leading-relaxed">
                  Notre création originale ! Pommes de terre assaisonnées passées à la
                  presse à gaufres, gratinées avec fromage fondant. Un concept unique que vous
                  ne trouverez nulle part ailleurs !
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-amber-400">🫧 Bubble Waffles</h3>
                <p className="text-lg leading-relaxed">
                  Le dessert tendance de Hong Kong revisité. Garnis de glace artisanale,
                  fruits frais, et nos sauces maison.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="relative h-[600px] rounded-lg overflow-hidden"
            >
              <Image
                src="/images/story/gallery-1.jpg"
                alt="Nos créations signature"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <motion.div variants={fadeIn} className="space-y-3">
              <h3 className="text-xl font-bold text-amber-400">☕ Tiramisu Waffle</h3>
              <p>Notre création exclusive : gaufre sucrée nappée de notre crème tiramisu maison
              (mascarpone + café), saupoudrée de cacao Van Houten.</p>
            </motion.div>

            <motion.div variants={fadeIn} className="space-y-3">
              <h3 className="text-xl font-bold text-amber-400">🥫 Canettes Tiramisu</h3>
              <p>Notre signature en format nomade ! Le délicieux goût du tiramisu dans une
              canette fraîche et pratique.</p>
            </motion.div>

            <motion.div variants={fadeIn} className="space-y-3">
              <h3 className="text-xl font-bold text-amber-400">💉 Shots Vitaminés</h3>
              <p>Des concentrés de vitalité ! Nos shots vitaminés sont préparés avec des
              ingrédients frais et naturels.</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Gallery Section */}
      <motion.section className="gallery py-20">
        <div style={container}>
          <motion.h2
            variants={fadeIn}
            className="text-4xl font-bold text-center text-[#2a2a2a] mb-16 bg-white/80 backdrop-blur-sm p-4 rounded-lg inline-block mx-auto"
          >
            Notre Univers en Images
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {galleryImages.map(([src, hueA, hueB], i) => (
              <motion.div
                key={i}
                className="w-full"
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.3 }}
              >
                <motion.div
                  style={cardContainer}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    style={{
                      ...splash,
                      background: `linear-gradient(306deg, ${hue(hueA)}, ${hue(
                        hueB
                      )})`,
                    }}
                  />
                  <motion.div
                    style={card}
                    variants={{
                      offscreen: {
                        y: 100,
                        opacity: 0,
                      },
                      onscreen: {
                        y: 0,
                        opacity: 1,
                        transition: {
                          type: "spring",
                          bounce: 0.4,
                          duration: 0.8,
                          delay: i * 0.1,
                        },
                      },
                    }}
                  >
                    <Image
                      src={src}
                      alt={`Gallery image ${i + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </FloatingBackground>
  );
}
