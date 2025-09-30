"use client";
import { motion } from "framer-motion";
import Link from "next/link"; // Ajoutez cette ligne
import { QRCodeSVG } from "qrcode.react";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function QRCode() {
  const menuUrl = "https://localhost:3000/menu"; // À remplacer par l'URL réelle

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="inline-block bg-card p-4 rounded-xl shadow-lg"
        >
          <QRCodeSVG
            value={menuUrl}
            size={200}
            level="H"
            includeMargin={true}
            fgColor="hsl(var(--primary))"
          />
          <p className="mt-4 text-muted-foreground text-sm">
            Scannez pour voir notre carte
          </p>
        </motion.div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex flex-col space-y-2">
          <h4 className="text-sm font-semibold">Notre carte complète</h4>
          <p className="text-sm text-muted-foreground">
            Accédez à tous nos plats, boissons et desserts directement sur votre
            mobile
          </p>
          <Button asChild size="sm" className="mt-2">
            <Link href="/menu">Voir la carte en ligne</Link>
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
