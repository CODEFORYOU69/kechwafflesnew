"use client";

import FloatingBackground from "@/app/components/FloatingBackground";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Clock, Facebook, Instagram, MapPin, Phone } from "lucide-react";
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
                      <Phone className="h-5 w-5 text-amber-500" />
                      Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">+212 600-000000</p>
                    <div className="flex gap-4">
                      <a
                        href="https://instagram.com/kechwaffles"
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
