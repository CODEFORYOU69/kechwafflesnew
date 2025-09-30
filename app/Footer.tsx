// app/components/Footer.tsx
import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-background/95">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Coordonnées */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Nous trouver</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <p>123 Avenue Mohammed V, Guéliz, Marrakech</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <p>+212 5 24 XX XX XX</p>
              </div>
            </div>
          </div>

          {/* Horaires */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Horaires d&apos;ouverture</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Lundi - Jeudi: 9h00 - 22h00</p>
              <p>Vendredi - Dimanche: 9h00 - 23h00</p>
            </div>
          </div>

          {/* Réseaux sociaux */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Suivez-nous</h3>
            <div className="flex space-x-4">
              <Link
                href="https://instagram.com/kechwaffles"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://facebook.com/kechwaffles"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-sm text-muted-foreground">
          <p>© 2024 Kech Waffles. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
