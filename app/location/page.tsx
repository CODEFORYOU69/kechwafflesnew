"use client";

import FloatingBackground from "@/app/components/FloatingBackground";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Clock, Facebook, Instagram, MapPin, MessageCircle } from "lucide-react";
import Image from "next/image";

// Icône TikTok personnalisée
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// Icône Snapchat personnalisée (fantôme)
const SnapchatIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 512 512" fill="currentColor">
    <path d="M496 347.21a190.31 190.31 0 0 1-32.79-5.31c-27.28-6.63-54.84-24.26-68.12-52.43-6.9-14.63-2.64-18.59 11.86-24 14.18-5.27 29.8-7.72 36.86-23 5.89-12.76 1.13-27.76-10.41-35.49-15.71-10.53-30.35-.21-46.62 2.07 3.73-46.66 8.66-88.57-22.67-127.73C338.14 48.86 297.34 32 256.29 32s-81.86 16.86-107.81 49.33c-31.38 39.26-26.4 81.18-22.67 127.92-16.32-2.25-30.81-12.79-46.63-2.18-10.58 7.1-16.36 22-10.52 35.12 6.3 14.14 21.92 17.73 36.86 23 14.37 5.38 18.61 9.39 11.71 24-13.19 28.07-40.66 45.72-67.85 52.35A193.63 193.63 0 0 1 16 347.21c-9.38 1.87-16 9.87-16 19.31 0 26.12 42.44 39 65.31 44.57 3.11.76 10.65 2.62 12.14 6 3.39 7.63-.61 19.18 6.65 29.77C93 459.23 108.42 464 124.71 464c13.32 0 27.15-3.15 41.23-6.36a228.37 228.37 0 0 1 41.23-5.19c14.61 0 24.74 4.59 38.29 15.06C265.69 482.53 280.66 496 304 496s38.31-13.47 58.54-28.49c13.55-10.47 23.68-15.06 38.29-15.06a228.37 228.37 0 0 1 41.23 5.19c14.08 3.21 27.91 6.36 41.23 6.36 16.29 0 31.69-4.77 40.58-17.15 7.26-10.59 3.26-22.14 6.65-29.77 1.49-3.36 9-5.22 12.14-6C565.56 406.19 608 393.33 608 367.21c0-9.44-6.62-17.44-16-19.31z"/>
  </svg>
);

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

export default function Location() {
  return (
    <FloatingBackground>
      {/* Hero Section */}
      <section className="relative h-[50vh]">
        <Image
          src="/images/story/hero-background.jpg" // Ajouter une image de la devanture
          alt="Kech Waffles Storefront"
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
          <motion.h1
            variants={fadeIn}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Où Nous Trouver
          </motion.h1>
        </motion.div>
      </section>

      {/* Main Content */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-20"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column - Map */}
            <motion.div
              variants={fadeIn}
              className="rounded-lg overflow-hidden space-y-4"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3395.915660444416!2d-8.0031921!3d31.663527100000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafede897f96e29%3A0x9b0246bfdfaea5bc!2skech%20Waffles!5e0!3m2!1sfr!2sfr!4v1739146023050!5m2!1sfr!2sfr"
                width="600"
                height="450"
                loading="lazy"
                className="w-full rounded-lg"
              ></iframe>

              <div className="flex gap-4 justify-center">
                {/* Lien Google Maps */}
                <a
                  href="https://maps.app.goo.gl/CpcUoJM1worpgeUZ9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M12 0C7.802 0 4 3.403 4 7.602C4 11.8 7.469 16.812 12 24C16.531 16.812 20 11.8 20 7.602C20 3.403 16.199 0 12 0ZM12 11C10.343 11 9 9.657 9 8C9 6.343 10.343 5 12 5C13.657 5 15 6.343 15 8C15 9.657 13.657 11 12 11Z" />
                  </svg>
                  Google Maps
                </a>

                {/* Lien Waze */}
                <a
                  href="https://www.waze.com/ul?ll=31.663527,-8.003192&navigate=yes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M20.94,11C20.48,6.83 17.17,3.52 13,3.06V1H11V3.06C6.83,3.52 3.52,6.83 3.06,11H1V13H3.06C3.52,17.17 6.83,20.48 11,20.94V23H13V20.94C17.17,20.48 20.48,17.17 20.94,13H23V11H20.94M12,19C8.13,19 5,15.87 5,12C5,8.13 8.13,5 12,5C15.87,5 19,8.13 19,12C19,15.87 15.87,19 12,19Z" />
                  </svg>
                  Waze
                </a>
              </div>
            </motion.div>

            {/* Right Column - Info Cards */}
            <div className="space-y-6">
              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-amber-500" />
                      Adresse
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg">
                      MAG 33 AL BADII <br />
                      Marrakech, Maroc
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-amber-500" />
                      Horaires d&apos;ouverture
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Lundi - Jeudi</span>
                        <span>10:00 - 22:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vendredi </span>
                        <span>17:00 - 02:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Samedi</span>
                        <span>10:00 - 02:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dimanche</span>
                        <span>11:00 - 22:00</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-amber-500" />
                      Suivez-nous
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <a
                        href="https://instagram.com/kech_waffles"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-amber-500 transition-colors"
                      >
                        <Instagram className="h-6 w-6" />
                      </a>
                      <a
                        href="https://facebook.com/kechwaffles"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-amber-500 transition-colors"
                      >
                        <Facebook className="h-6 w-6" />
                      </a>
                      <a
                        href="https://tiktok.com/@kechwaffles"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-amber-500 transition-colors"
                      >
                        <TikTokIcon className="h-6 w-6" />
                      </a>
                      <a
                        href="https://snapchat.com/add/kechwaffles"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-amber-500 transition-colors"
                      >
                        <SnapchatIcon className="h-6 w-6" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Directions Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-20 bg-white/80 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={fadeIn}
            className="text-3xl font-bold text-center mb-12"
          >
            Comment nous rejoindre
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={fadeIn} className="text-center">
              <h3 className="text-xl font-bold mb-4">En voiture</h3>
              <p className="text-gray-600">
                Parking gratuit disponible à proximité
              </p>
            </motion.div>
            <motion.div variants={fadeIn} className="text-center">
              <h3 className="text-xl font-bold mb-4">En bus</h3>
              <p className="text-gray-600">
                Lignes 17 - Arrêt al badii Service des mines
              </p>
            </motion.div>
            <motion.div variants={fadeIn} className="text-center">
              <h3 className="text-xl font-bold mb-4">À pied</h3>
              <p className="text-gray-600">
                À 15 minutes de la place Jemaa el-Fna
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </FloatingBackground>
  );
}
