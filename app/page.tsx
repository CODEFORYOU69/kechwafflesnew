// app/page.tsx
"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import Image from "next/image";
import Hero from "./components/Hero";
import { QRCode } from "./components/QRCode";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen">
        <Hero />
      </section>

      {/* Spécialités Section */}
      <section className="min-h-screen bg-white/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="py-20"
        >
          <Container>
            <div className="space-y-4 text-center mb-12">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl">
                🧇 KECH WAFFLES MARRAKECH 🧇
              </h2>
              <Separator className="my-6 max-w-md mx-auto" />
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold">LES VRAIES GAUFRES ARTISANALES</h3>
                <p className="text-xl text-amber-600 font-medium">100% Fait Maison | Ingrédients Premium</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Colonne gauche - Notre Savoir-Faire */}
              <Card className="border-2 border-amber-200 shadow-lg bg-gradient-to-br from-white to-amber-50">
                <CardHeader className="space-y-4">
                  <CardTitle className="text-2xl text-center">Notre Savoir-Faire</CardTitle>
                  <CardDescription className="text-base space-y-2">
                    <div className="flex items-start gap-2">
                      <span>🏡</span>
                      <span>Pâtes préparées quotidiennement</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span>🇧🇪</span>
                      <span>Chocolat Callebaut professionnel</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span>🌰</span>
                      <span>Crème pistache de qualité</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span>💨</span>
                      <span>Chantilly maison au siphon</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span>☕</span>
                      <span>Crème tiramisu avec mascarpone</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span>☕</span>
                      <span>Cafés de qualité & Shots vitaminés</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span>🍦</span>
                      <span>Glaces artisanales</span>
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Colonne droite - Nos Signatures */}
              <Card className="border-2 border-amber-200 shadow-lg bg-gradient-to-br from-white to-amber-50">
                <CardHeader className="space-y-4">
                  <CardTitle className="text-2xl text-center">Nos Signatures</CardTitle>
                  <CardDescription className="text-base space-y-2">
                    <div className="flex items-start gap-2">
                      <span>🍕</span>
                      <span>Pizza Waffles (salées gratinées)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span>🥔</span>
                      <span>Potato Waffles (concept unique)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span>🫧</span>
                      <span>Bubble Waffles de Hong Kong</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span>☕</span>
                      <span>Tiramisu Waffle</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span>🌰</span>
                      <span>Pistache Premium</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span>☕</span>
                      <span>Cafés de qualité</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span>🥫</span>
                      <span>Canettes Tiramisu</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span>💉</span>
                      <span>Shots vitaminés</span>
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            <Separator className="my-8" />

            {/* Message final */}
            <div className="text-center space-y-4">
              <p className="text-lg font-medium text-amber-700">
                Recettes maison | Ingrédients premium
              </p>
              <p className="text-xl font-bold">
                100% Authenticité | 100% Passion
              </p>
              <div className="pt-4">
                <p className="text-lg">📍 Marrakech</p>
                <p className="text-lg font-medium text-amber-600">
                  🧇 Fait avec amour, servi avec passion
                </p>
              </div>
            </div>
          </Container>
        </motion.div>
      </section>

      {/* QR Code Section */}
      <section className="min-h-screen bg-muted/50">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter">
                Découvrez Notre Carte
              </h2>
              <p className="text-muted-foreground">
                Scannez le QR code pour explorer notre menu complet
              </p>
            </div>
            <QRCode />
          </div>
        </Container>
      </section>
    </>
  );
}
