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
import { Menu, LogOut, User, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "@/lib/auth-client";

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
  const [isAdmin, setIsAdmin] = useState(false);
  const { scrollY } = useScroll();
  const { data: session } = useSession();

  useEffect(() => {
    const checkAdmin = async () => {
      if (session?.user) {
        try {
          const response = await fetch("/api/auth/check-admin");
          const data = await response.json();
          setIsAdmin(data.isAdmin);
        } catch (error) {
          console.error("Error checking admin:", error);
        }
      } else {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [session]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (previous !== undefined && latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

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
        <div className="hidden md:flex md:ml-8">
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

        {/* User Menu Desktop */}
        <div className="hidden md:flex ml-auto items-center gap-2">
          {session ? (
            <>
              {isAdmin && (
                <Button variant="outline" size="sm" asChild className="border-amber-500 text-amber-600 hover:bg-amber-50">
                  <Link href="/admin">
                    <Settings className="h-4 w-4 mr-2" />
                    Admin
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" asChild>
                <Link href="/loyalty/card">
                  <User className="h-4 w-4 mr-2" />
                  {session.user?.name?.split(" ")[0] || "Mon compte"}
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </>
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link href="/concours/auth">
                Connexion
              </Link>
            </Button>
          )}
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

                {/* User section mobile */}
                <div className="pt-8 border-t border-amber-500/20">
                  {session ? (
                    <>
                      <p className="text-amber-500 text-sm mb-4">
                        Connecté en tant que <strong>{session.user?.name}</strong>
                      </p>
                      {isAdmin && (
                        <Button
                          variant="outline"
                          className="w-full text-amber-500 border-amber-500 mb-2"
                          asChild
                        >
                          <Link href="/admin">
                            <Settings className="mr-2 h-4 w-4" />
                            Admin
                          </Link>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="w-full text-amber-500 border-amber-500"
                        onClick={handleSignOut}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Déconnexion
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="default"
                      className="w-full bg-amber-500 hover:bg-amber-600"
                      asChild
                    >
                      <Link href="/concours/auth">
                        Connexion
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.div>
  );
}
