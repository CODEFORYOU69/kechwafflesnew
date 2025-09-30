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
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Nos Spécialités
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground">
                Des créations uniques qui allient tradition et innovation
              </p>
            </div>
            <Separator className="my-8" />
            <div className="grid md:grid-cols-2 gap-6 md:gap-12">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="relative aspect-video overflow-hidden rounded-t-lg mb-4">
                    <Image
                      src="/images/menu-items/kechlogo.jpg"
                      alt="Délices sucrés"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </div>
                  <CardTitle className="text-2xl">Délices Sucrés</CardTitle>
                  <CardDescription className="text-base">
                    Découvrez nos gaufres façon Tiramisu, pancakes gourmands et
                    crauffes uniques
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="relative aspect-video overflow-hidden rounded-t-lg mb-4">
                    <Image
                      src="/images/menu-items/kechlogo.jpg"
                      alt="Brioches fourrées salées"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={false}
                    />
                  </div>
                  <CardTitle className="text-2xl">
                    Brioches Fourrées Salées
                  </CardTitle>
                  <CardDescription className="text-base">
                    Savourez nos recettes originales : cheddar fondant, chèvre
                    indien épicé, savoyard traditionnel...
                  </CardDescription>
                </CardHeader>
              </Card>
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
