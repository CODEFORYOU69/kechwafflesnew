"use client";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const MenuLink = ({ text, href }: { text: string; href: string }) => {
  return (
    <motion.div className="flex items-baseline gap-4 group">
      <div className="perspective-[1000px]">
        <motion.a
          href={href}
          className="text-2xl font-extrabold tracking-wider inline-block text-amber-500" // Changé en text-amber-500 pour le doré
          whileHover={{
            rotateX: 360,
            transition: { duration: 0.6, ease: "easeInOut" },
          }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <span className="inline-block">{text}</span>
        </motion.a>
      </div>
    </motion.div>
  );
};

export function Navigation() {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (previous !== undefined && latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.div
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-8 flex items-center">
          <Image
            src="/images/menu-items/TransparentBlack.jpg"
            alt="Kech Waffles Logo"
            width={100}
            height={100}
            className="h-12 w-auto mr-2"
          />
          <span className="text-2xl font-bold text-primary">Kech Waffles</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Accueil
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/notre-histoire" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Notre Histoire
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/product" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Nos Produits
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/menu" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Notre Carte
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/location" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Où nous trouver
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/concours" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Concours CAN
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/loyalty/card" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Ma Carte Fidélité
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#121212] border-l-0 p-8">
              <div className="flex flex-col space-y-8 mt-8">
                <MenuLink text="ACCUEIL" href="/" />
                <MenuLink text="NOTRE HISTOIRE" href="/notre-histoire" />
                <MenuLink text="NOS PRODUITS" href="/product" />
                <MenuLink text="NOTRE CARTE" href="/menu" />
                <MenuLink text="NOUS TROUVER" href="/location" />
                <MenuLink text="CONCOURS CAN" href="/concours" />
                <MenuLink text="FIDÉLITÉ" href="/loyalty/card" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.div>
  );
}
