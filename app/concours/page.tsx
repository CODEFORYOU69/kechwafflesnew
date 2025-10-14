"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Ticket, Gift, User, LogIn } from "lucide-react";
import { ShineBorder } from "@/components/ui/shine-border";

export default function ConcoursPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
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
              </ul>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                onClick={() => router.push(session?.user ? "/concours/pronostics" : "/concours/auth?redirect=/concours/pronostics")}
              >
                Participer
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
                Recevez un ticket avec un buteur aléatoire. S'il marque, vous gagnez un lot !
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
    </div>
  );
}
