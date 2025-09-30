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
              Notre Histoire
            </motion.h1>
            <motion.p
              variants={fadeIn}
              className="text-xl text-white/90 max-w-2xl"
            >
              Une aventure gourmande qui a commencé dans les rues animées de
              Marrakech
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* Origin Story Section */}
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
            <h2 className="text-4xl font-bold text-[#2a2a2a]">Les Débuts</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              C&apos;est au cœur de la ville ocre que notre passion pour la
              pâtisserie créative a pris vie. Inspirés par les saveurs
              traditionnelles marocaines et notre amour pour les desserts du
              monde, nous avons imaginé un concept unique : le mariage parfait
              entre la gaufre belge et le célèbre tiramisu italien.
            </p>
          </motion.div>
          <motion.div
            variants={fadeIn}
            className="relative h-[500px] rounded-lg overflow-hidden"
          >
            <Image
              src="/images/story/origin.jpg"
              alt="Les débuts de Kech Waffles"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Values Section */}
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
            className="text-4xl font-bold text-center text-[#2a2a2a] mb-16"
          >
            Nos Valeurs
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Qualité",
                description:
                  "Des ingrédients soigneusement sélectionnés pour des créations d'exception",
                image: "/images/story/quality.jpg",
              },
              {
                title: "Innovation",
                description: "Une fusion créative entre tradition et modernité",
                image: "/images/story/innovation.jpg",
              },
              {
                title: "Partage",
                description:
                  "Une expérience gustative unique à partager en famille ou entre amis",
                image: "/images/story/sharing.jpg",
              },
            ].map((value) => (
              <motion.div
                key={value.title}
                variants={fadeIn}
                className="text-center"
              >
                <div className="relative h-64 rounded-lg overflow-hidden mb-6">
                  <Image
                    src={value.image}
                    alt={value.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                <p className="text-gray-700">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Experience Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-20 bg-[#2a2a2a] text-white"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={fadeIn}
              className="relative h-[600px] rounded-lg overflow-hidden"
            >
              <Image
                src="/images/story/gallery-1.jpg"
                alt="L'expérience Kech Waffles"
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div variants={fadeIn} className="space-y-6">
              <h2 className="text-4xl font-bold">
                L&apos;Expérience Kech Waffles
              </h2>
              <p className="text-lg leading-relaxed">
                Plus qu&apos;un simple dessert, nous créons des moments de
                bonheur. Chaque gaufre est préparée avec soin, chaque sauce est
                élaborée avec passion, et chaque présentation est pensée pour
                émerveiller vos sens.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div>
                  <h4 className="text-2xl font-bold text-amber-500">1000+</h4>
                  <p>Clients Satisfaits</p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-amber-500">15+</h4>
                  <p>Recettes Uniques</p>
                </div>
              </div>
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
