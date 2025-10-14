"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, CreditCard } from "lucide-react";

type MemberCard = {
  cardNumber: string;
  qrCode: string;
  totalPoints: number;
  currentPoints: number;
  totalSpent: number;
  visitCount: number;
  tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
  createdAt: string;
};

export default function LoyaltyCardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [card, setCard] = useState<MemberCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/concours/auth?redirect=/loyalty/card");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      loadCard();
    }
  }, [session]);

  async function loadCard() {
    try {
      const res = await fetch(`/api/loyalty/card?userId=${session?.user?.id}`);
      const data = await res.json();
      if (data.success) {
        setCard(data.card);
      }
    } catch (error) {
      console.error("Erreur chargement carte:", error);
    } finally {
      setLoading(false);
    }
  }

  function getTierInfo(tier: string) {
    const tiers = {
      BRONZE: {
        name: "Bronze",
        color: "from-orange-600 to-amber-700",
        icon: "🥉",
        nextTier: "Silver (500 MAD)",
        benefits: ["1 point = 10 MAD dépensés", "Accès aux concours CAN"],
      },
      SILVER: {
        name: "Silver",
        color: "from-gray-400 to-gray-600",
        icon: "🥈",
        nextTier: "Gold (1000 MAD)",
        benefits: ["1 point = 10 MAD", "Offres exclusives", "+5% bonus points"],
      },
      GOLD: {
        name: "Gold",
        color: "from-yellow-400 to-yellow-600",
        icon: "🥇",
        nextTier: "Platinum (2000 MAD)",
        benefits: ["1 point = 10 MAD", "Priorité service", "+10% bonus points"],
      },
      PLATINUM: {
        name: "Platinum",
        color: "from-purple-500 to-indigo-600",
        icon: "💎",
        nextTier: "Niveau maximum",
        benefits: ["1 point = 10 MAD", "VIP Access", "+15% bonus points", "Cadeaux anniversaire"],
      },
    };
    return tiers[tier as keyof typeof tiers] || tiers.BRONZE;
  }

  function getProgressToNextTier(totalSpent: number, tier: string) {
    const thresholds = {
      BRONZE: { next: 500, current: 0 },
      SILVER: { next: 1000, current: 500 },
      GOLD: { next: 2000, current: 1000 },
      PLATINUM: { next: 2000, current: 2000 },
    };
    const t = thresholds[tier as keyof typeof thresholds];
    if (!t) return 0;
    if (tier === "PLATINUM") return 100;
    const progress = ((totalSpent - t.current) / (t.next - t.current)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <Loader2 className="h-16 w-16 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
        <Card className="max-w-md">
          <CardContent className="pt-12 pb-12 text-center">
            <span className="text-6xl mb-4 block">💳</span>
            <CardTitle className="text-2xl mb-2">Aucune carte membre</CardTitle>
            <CardDescription className="mb-6">
              Une erreur s'est produite. Veuillez contacter le support.
            </CardDescription>
            <Button onClick={() => router.push("/")}>
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tierInfo = getTierInfo(card.tier);
  const progress = getProgressToNextTier(card.totalSpent, card.tier);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-3xl">💳 Ma Carte Membre</CardTitle>
                <CardDescription>Kech Waffles Loyalty</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Card Display */}
        <div
          className={`bg-gradient-to-br ${tierInfo.color} rounded-2xl shadow-2xl p-8 mb-6 text-white relative overflow-hidden`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-sm opacity-90 mb-1">KECH WAFFLES</p>
                <p className="text-2xl font-bold">{session?.user?.name}</p>
              </div>
              <div className="text-right">
                <p className="text-4xl mb-1">{tierInfo.icon}</p>
                <p className="text-sm font-bold">{tierInfo.name}</p>
              </div>
            </div>

            {/* Card Number */}
            <div className="mb-8">
              <p className="text-xs opacity-75 mb-1">NUMÉRO DE CARTE</p>
              <p className="text-2xl font-mono font-bold tracking-wider">
                {card.cardNumber}
              </p>
            </div>

            {/* QR Code */}
            <div className="bg-white rounded-xl p-4 inline-block">
              <img
                src={card.qrCode}
                alt="QR Code"
                className="w-32 h-32"
              />
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-between text-xs opacity-75">
              <p>Membre depuis {new Date(card.createdAt).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}</p>
              <p>{card.visitCount} visite{card.visitCount > 1 ? "s" : ""}</p>
            </div>
          </div>
        </div>

        {/* Points & Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Points disponibles</p>
              <p className="text-4xl font-bold text-orange-600">{card.currentPoints}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Total dépensé</p>
              <p className="text-4xl font-bold">{card.totalSpent.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">MAD</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress to Next Tier */}
        {card.tier !== "PLATINUM" && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold">
                  Progression vers {getTierInfo(card.tier === "BRONZE" ? "SILVER" : card.tier === "SILVER" ? "GOLD" : "PLATINUM").name}
                </p>
                <Badge variant="secondary">{progress.toFixed(0)}%</Badge>
              </div>
              <Progress value={progress} className="h-3 mb-2" />
              <p className="text-xs text-muted-foreground">
                Plus que {tierInfo.nextTier.split("(")[1]?.replace(")", "")} pour passer au niveau supérieur
              </p>
            </CardContent>
          </Card>
        )}

        {/* Benefits */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>✨ Avantages {tierInfo.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {tierInfo.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <span className="text-orange-500">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* How to Use */}
        <Alert className="border-blue-200 bg-blue-50">
          <AlertDescription className="text-blue-900">
            <h3 className="font-bold mb-3">💡 Comment utiliser ma carte ?</h3>
            <ol className="text-sm space-y-2 list-decimal list-inside">
              <li>Présentez votre carte (QR code) en magasin avant de payer</li>
              <li>Gagnez 1 point pour chaque 10 MAD dépensés</li>
              <li>Échangez vos points contre des récompenses</li>
            </ol>
          </AlertDescription>
        </Alert>

        {/* Navigation */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Button
            onClick={() => router.push("/concours/pronostics")}
            variant="outline"
          >
            🏆 Concours
          </Button>
          <Button
            onClick={() => router.push("/menu")}
          >
            📱 Menu
          </Button>
        </div>
      </div>
    </div>
  );
}
