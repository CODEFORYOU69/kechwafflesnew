"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Ticket, Gift, User, LogIn, Building2, ExternalLink, QrCode, X } from "lucide-react";
import { ShineBorder } from "@/components/ui/shine-border";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type PartnerTier = "PREMIUM" | "GOLD" | "SILVER" | "BRONZE";

interface Partner {
  id: string;
  name: string;
  description: string;
  logo?: string;
  address?: string;
  phone?: string;
  website?: string;
  tier: PartnerTier;
  prizeTitle: string;
  prizeDescription?: string;
  prizeValue?: number;
  prizeImage?: string;
  prizeQuantity: number;
}

export default function ConcoursPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isRegisteredForPronostics, setIsRegisteredForPronostics] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(true);
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);

  useEffect(() => {
    fetchPartners();
  }, []);

  useEffect(() => {
    if (session?.user) {
      checkRegistration();
    } else {
      setCheckingRegistration(false);
    }
  }, [session]);

  const fetchPartners = async () => {
    try {
      const response = await fetch("/api/partners");
      if (response.ok) {
        const data = await response.json();
        setPartners(data.partners || []);
      }
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
  };

  const checkRegistration = async () => {
    try {
      const response = await fetch("/api/concours/register");
      if (response.ok) {
        const data = await response.json();
        setIsRegisteredForPronostics(data.registered || false);
      }
    } catch (error) {
      console.error("Error checking registration:", error);
    } finally {
      setCheckingRegistration(false);
    }
  };

  const handlePronosticsClick = () => {
    if (!session?.user) {
      router.push("/concours/auth?redirect=/concours/pronostics");
    } else if (!isRegisteredForPronostics) {
      // Ouvre le dialog pour expliquer comment s'inscrire
      setShowRegistrationDialog(true);
    } else {
      router.push("/concours/pronostics");
    }
  };

  const getTierColor = (tier: PartnerTier) => {
    switch (tier) {
      case "PREMIUM":
        return "from-purple-500 to-purple-700 shadow-purple-500/50";
      case "GOLD":
        return "from-yellow-400 to-yellow-600 shadow-yellow-500/50";
      case "SILVER":
        return "from-gray-300 to-gray-500 shadow-gray-400/50";
      case "BRONZE":
        return "from-amber-600 to-amber-800 shadow-amber-700/50";
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  // Séparer les partenaires PREMIUM/GOLD et SILVER/BRONZE
  const premiumGoldPartners = partners.filter(p => p.tier === "PREMIUM" || p.tier === "GOLD");
  const silverBronzePartners = partners.filter(p => p.tier === "SILVER" || p.tier === "BRONZE");

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Partenaires Premium/Gold - Colonne gauche */}
          {premiumGoldPartners.length > 0 && (
            <div className="lg:col-span-2 space-y-4 hidden lg:block">
              <h3 className="text-sm font-semibold text-amber-400 mb-3 text-center drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]">
                🏆 Nos Partenaires
              </h3>
              {premiumGoldPartners.map((partner) => (
                <Card
                  key={partner.id}
                  className={`bg-gradient-to-br ${getTierColor(partner.tier)} border-0 shadow-lg hover:scale-105 transition-transform cursor-pointer`}
                  onClick={() => partner.website && window.open(partner.website, "_blank")}
                >
                  <CardContent className="p-3 text-white">
                    {partner.logo && (
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="w-full h-20 object-contain mb-2 bg-white/10 rounded p-1"
                      />
                    )}
                    <h4 className="font-bold text-sm text-center mb-1">{partner.name}</h4>
                    <p className="text-xs text-center opacity-90 line-clamp-2">{partner.prizeTitle}</p>
                    {partner.prizeValue && (
                      <p className="text-xs text-center font-bold mt-1">{partner.prizeValue} MAD</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Contenu principal */}
          <div className={`${partners.length > 0 ? "lg:col-span-8" : "lg:col-span-12"}`}>
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-500 via-amber-400 to-red-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]">
                Concours CAN 2025
              </h1>
              <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-md">
                Participez à nos concours et gagnez des lots exclusifs chez Kech Waffles !
              </p>
            </div>

            {/* Auth Status */}
            {!session?.user && (
              <Card className="mb-8 border-amber-500/50 bg-gradient-to-br from-green-900/80 to-red-900/80 backdrop-blur-sm shadow-[0_0_50px_rgba(251,191,36,0.3)]">
                <CardContent className="pt-6 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <User className="h-8 w-8 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                    <div>
                      <p className="font-semibold text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">Connectez-vous pour participer</p>
                      <p className="text-sm text-white/80">Créez un compte ou connectez-vous pour accéder aux concours</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => router.push("/concours/auth")}
                    className="bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-500 hover:via-yellow-600 hover:to-amber-700 text-black font-bold shadow-[0_0_20px_rgba(251,191,36,0.6)] hover:shadow-[0_0_30px_rgba(251,191,36,0.8)]"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Se connecter
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Concours Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Concours 1: Pronostics */}
              <Card className="hover:shadow-2xl transition-all hover:scale-105 border-green-500/50 bg-black/60 backdrop-blur-md relative shadow-[0_0_30px_rgba(16,185,129,0.3)] overflow-hidden h-full flex flex-col">
                <ShineBorder
                  borderWidth={3}
                  duration={10}
                  shineColor={["#10b981", "#d97706", "#dc2626"]}
                />
                <CardHeader>
                  <div className="mb-4 p-3 bg-green-500/20 rounded-full w-fit border border-green-500/50 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                    <Trophy className="h-8 w-8 text-green-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                  </div>
                  <CardTitle className="text-2xl text-amber-400 drop-shadow-[0_0_10px_rgba(217,119,6,0.6)]">Concours 1</CardTitle>
                  <CardDescription className="text-base text-white/80">
                    Pronostics Matchs CAN 2025
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <p className="text-sm text-white/70">
                    Pronostiquez les résultats des matchs et gagnez des points. Les meilleurs remportent des lots !
                  </p>
                  <ul className="text-sm space-y-2 text-white/70 flex-1">
                    <li>• Score exact : 5 points</li>
                    <li>• Bon vainqueur : 3 points</li>
                    <li>• Lots : Cafés, gaufres gratuits</li>
                    {session?.user && !isRegisteredForPronostics && !checkingRegistration && (
                      <li className="text-amber-300 font-semibold">⚠️ Scanner le QR en magasin</li>
                    )}
                    {session?.user && isRegisteredForPronostics && (
                      <li className="text-green-300 font-semibold">✅ Inscrit au concours</li>
                    )}
                  </ul>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                    onClick={handlePronosticsClick}
                    disabled={checkingRegistration}
                  >
                    {checkingRegistration ? "Vérification..." : isRegisteredForPronostics ? "Faire mes pronostics" : "Participer"}
                  </Button>
                </CardContent>
              </Card>

              {/* Concours 2: QR Code */}
              <Card className="hover:shadow-2xl transition-all hover:scale-105 border-amber-500/50 bg-black/60 backdrop-blur-md relative shadow-[0_0_30px_rgba(217,119,6,0.4)] overflow-hidden h-full flex flex-col">
                <ShineBorder
                  borderWidth={3}
                  duration={12}
                  shineColor={["#d97706", "#f59e0b", "#b45309"]}
                />
                <CardHeader>
                  <div className="mb-4 p-3 bg-amber-600/20 rounded-full w-fit border border-amber-500/50 shadow-[0_0_15px_rgba(217,119,6,0.6)]">
                    <Target className="h-8 w-8 text-amber-400 drop-shadow-[0_0_10px_rgba(217,119,6,0.8)]" />
                  </div>
                  <CardTitle className="text-2xl text-amber-400 drop-shadow-[0_0_10px_rgba(217,119,6,0.6)]">Concours 2</CardTitle>
                  <CardDescription className="text-base text-white/80">
                    Scan QR Code Journalier
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <p className="text-sm text-white/70">
                    Scannez le QR code du jour en magasin pour participer au tirage au sort hebdomadaire !
                  </p>
                  <ul className="text-sm space-y-2 text-white/70 flex-1">
                    <li>• 1 scan par jour</li>
                    <li>• Tirage hebdomadaire</li>
                    <li>• Grand prix à la fin</li>
                  </ul>
                  <Button
                    className="w-full bg-gradient-to-br from-amber-500 via-yellow-600 to-amber-700 hover:from-amber-600 hover:via-yellow-700 hover:to-amber-800 text-black font-bold shadow-[0_0_20px_rgba(217,119,6,0.6)]"
                    onClick={() => router.push(session?.user ? "/concours/scan" : "/concours/auth?redirect=/concours/scan")}
                  >
                    Scanner
                  </Button>
                </CardContent>
              </Card>

              {/* Concours 3: Jeu du Buteur */}
              <Card className="hover:shadow-2xl transition-all hover:scale-105 border-red-500/50 bg-black/60 backdrop-blur-md relative shadow-[0_0_30px_rgba(220,38,38,0.3)] overflow-hidden h-full flex flex-col">
                <ShineBorder
                  borderWidth={3}
                  duration={14}
                  shineColor={["#dc2626", "#d97706", "#10b981"]}
                />
                <CardHeader>
                  <div className="mb-4 p-3 bg-red-500/20 rounded-full w-fit border border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                    <Ticket className="h-8 w-8 text-red-400 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
                  </div>
                  <CardTitle className="text-2xl text-amber-400 drop-shadow-[0_0_10px_rgba(217,119,6,0.6)]">Concours 3</CardTitle>
                  <CardDescription className="text-base text-white/80">
                    Jeu du Buteur
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <p className="text-sm text-white/70">
                    Recevez un ticket avec un buteur aléatoire. S&apos;il marque, vous gagnez un lot !
                  </p>
                  <ul className="text-sm space-y-2 text-white/70 flex-1">
                    <li>• Ticket gratuit avec achat</li>
                    <li>• Buteur aléatoire</li>
                    <li>• Lots instantanés si but</li>
                  </ul>
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                    onClick={() => router.push(session?.user ? "/concours/mes-tickets" : "/concours/auth?redirect=/concours/mes-tickets")}
                  >
                    Mes Tickets
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* User Menu (if connected) */}
            {session?.user && (
              <Card className="border-amber-500/50 bg-black/60 backdrop-blur-md shadow-[0_0_40px_rgba(217,119,6,0.3)]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-400 drop-shadow-[0_0_10px_rgba(217,119,6,0.6)]">
                    <Gift className="h-6 w-6 text-amber-400" />
                    Mon Espace Concours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className="justify-start border-green-500/50 text-green-400 hover:bg-green-500/20 hover:text-green-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                      onClick={() => router.push("/concours/mes-pronostics")}
                    >
                      Mes Pronostics
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 shadow-[0_0_10px_rgba(220,38,38,0.3)]"
                      onClick={() => router.push("/concours/mes-tickets")}
                    >
                      Mes Tickets Buteur
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start border-amber-500/50 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 shadow-[0_0_10px_rgba(217,119,6,0.3)]"
                      onClick={() => router.push("/concours/mes-lots")}
                    >
                      Mes Lots Gagnés
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start border-amber-500/50 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 shadow-[0_0_10px_rgba(217,119,6,0.3)]"
                      onClick={() => router.push("/concours/classement")}
                    >
                      Classement Général
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Partenaires Silver/Bronze - Colonne droite */}
          {silverBronzePartners.length > 0 && (
            <div className="lg:col-span-2 space-y-4 hidden lg:block">
              <h3 className="text-sm font-semibold text-amber-400 mb-3 text-center drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]">
                🤝 Partenaires
              </h3>
              {silverBronzePartners.map((partner) => (
                <Card
                  key={partner.id}
                  className={`bg-gradient-to-br ${getTierColor(partner.tier)} border-0 shadow-lg hover:scale-105 transition-transform cursor-pointer`}
                  onClick={() => partner.website && window.open(partner.website, "_blank")}
                >
                  <CardContent className="p-3 text-white">
                    {partner.logo && (
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="w-full h-20 object-contain mb-2 bg-white/10 rounded p-1"
                      />
                    )}
                    <h4 className="font-bold text-sm text-center mb-1">{partner.name}</h4>
                    <p className="text-xs text-center opacity-90 line-clamp-2">{partner.prizeTitle}</p>
                    {partner.prizeValue && (
                      <p className="text-xs text-center font-bold mt-1">{partner.prizeValue} MAD</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Partenaires Mobile - En bas */}
        {partners.length > 0 && (
          <div className="lg:hidden mt-8">
            <h3 className="text-lg font-semibold text-amber-400 mb-4 text-center drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]">
              🏆 Nos Partenaires
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {partners.map((partner) => (
                <Card
                  key={partner.id}
                  className={`bg-gradient-to-br ${getTierColor(partner.tier)} border-0 shadow-lg hover:scale-105 transition-transform cursor-pointer`}
                  onClick={() => partner.website && window.open(partner.website, "_blank")}
                >
                  <CardContent className="p-3 text-white">
                    {partner.logo && (
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="w-full h-16 object-contain mb-2 bg-white/10 rounded p-1"
                      />
                    )}
                    <h4 className="font-bold text-xs text-center mb-1">{partner.name}</h4>
                    <p className="text-xs text-center opacity-90 line-clamp-2">{partner.prizeTitle}</p>
                    {partner.prizeValue && (
                      <p className="text-xs text-center font-bold mt-1">{partner.prizeValue} MAD</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dialog d'inscription */}
      <Dialog open={showRegistrationDialog} onOpenChange={setShowRegistrationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <QrCode className="h-6 w-6 text-orange-600" />
              Inscription au Concours
            </DialogTitle>
            <DialogDescription>
              Pour participer au concours de pronostics
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-900 mb-2">
                📱 Scannez le QR code en magasin
              </h4>
              <p className="text-sm text-orange-800">
                Le QR code d&apos;inscription est affiché à l&apos;entrée et au comptoir de Kech Waffles.
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <h5 className="font-semibold">Comment ça marche ?</h5>
              <ol className="list-decimal list-inside space-y-1 text-gray-700">
                <li>Venez chez Kech Waffles</li>
                <li>Scannez le QR code affiché en magasin</li>
                <li>Vous êtes inscrit pour toute la CAN 2025</li>
                <li>Faites vos pronostics sur les matchs à venir</li>
                <li>Gagnez des points et des lots !</li>
              </ol>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <strong>💡 Astuce :</strong> Une seule inscription suffit pour participer pendant toute la durée de la CAN. Vous pouvez rejoindre le concours à tout moment !
              </p>
            </div>

            <Button
              onClick={() => setShowRegistrationDialog(false)}
              className="w-full"
            >
              Compris !
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
