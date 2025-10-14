"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import QRCode from "qrcode";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Gift } from "lucide-react";

type Reward = {
  id: string;
  type: string;
  description: string;
  code: string;
  isRedeemed: boolean;
  redeemedAt: string | null;
  redeemedBy: string | null;
  matchId: string | null;
  reason: string;
  createdAt: string;
  expiresAt: string;
};

export default function MesLotsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<"all" | "available" | "used">("available");

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/concours/auth?redirect=/concours/mes-lots");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      loadRewards();
    }
  }, [session]);

  async function loadRewards() {
    try {
      const res = await fetch(`/api/concours/rewards?userId=${session?.user?.id}`);
      const data = await res.json();
      if (data.success) {
        setRewards(data.rewards);

        // Générer les QR codes pour les lots disponibles
        data.rewards.forEach(async (reward: Reward) => {
          if (!reward.isRedeemed && !isExpired(reward.expiresAt)) {
            const qr = await QRCode.toDataURL(reward.code, {
              width: 300,
              margin: 2,
            });
            setQrCodes((prev) => ({ ...prev, [reward.id]: qr }));
          }
        });
      }
    } catch (error) {
      console.error("Erreur chargement lots:", error);
    } finally {
      setLoading(false);
    }
  }

  function isExpired(expiresAt: string) {
    return new Date(expiresAt) < new Date();
  }

  function getDaysLeft(expiresAt: string) {
    const diff = new Date(expiresAt).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  const filteredRewards = rewards.filter((reward) => {
    if (filter === "available") return !reward.isRedeemed && !isExpired(reward.expiresAt);
    if (filter === "used") return reward.isRedeemed || isExpired(reward.expiresAt);
    return true;
  });

  const availableCount = rewards.filter((r) => !r.isRedeemed && !isExpired(r.expiresAt)).length;
  const usedCount = rewards.filter((r) => r.isRedeemed || isExpired(r.expiresAt)).length;

  function getTypeLabel(type: string) {
    const labels: Record<string, string> = {
      CAFE_GRATUIT: "☕ Café gratuit",
      GAUFRE_GRATUITE: "🧇 Gaufre gratuite",
      TIRAGE_GRAND_PRIX: "🎁 Éligibilité tirage grand prix",
    };
    return labels[type] || type;
  }

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <Loader2 className="h-16 w-16 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-3xl">🎁 Mes Lots</CardTitle>
                <CardDescription>Récompenses gagnées</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Lots disponibles</p>
              <p className="text-5xl font-bold">{availableCount}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90 mb-1">Lots utilisés</p>
              <p className="text-3xl font-bold">{usedCount}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Tabs value={filter} onValueChange={(value) => setFilter(value as "all" | "available" | "used")} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Tous ({rewards.length})</TabsTrigger>
            <TabsTrigger value="available">Disponibles ({availableCount})</TabsTrigger>
            <TabsTrigger value="used">Utilisés ({usedCount})</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Rewards List */}
        {filteredRewards.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <span className="text-6xl mb-4 block">🎁</span>
              <CardTitle className="text-2xl mb-2">Aucun lot</CardTitle>
              <CardDescription className="mb-6">
                {filter === "available"
                  ? "Vous n'avez pas de lots disponibles pour le moment"
                  : filter === "used"
                  ? "Vous n'avez pas encore utilisé de lots"
                  : "Faites des pronostics pour gagner des lots !"}
              </CardDescription>
              {filter === "available" && (
                <Button onClick={() => router.push("/concours/pronostics")}>
                  Faire des pronostics
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRewards.map((reward) => {
              const expired = isExpired(reward.expiresAt);
              const daysLeft = getDaysLeft(reward.expiresAt);
              const isAvailable = !reward.isRedeemed && !expired;

              return (
                <Card
                  key={reward.id}
                  className={isAvailable ? "border-orange-400" : ""}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">
                          {getTypeLabel(reward.type)}
                        </CardTitle>
                        <CardDescription className="mb-1">{reward.description}</CardDescription>
                        <p className="text-xs text-muted-foreground">{reward.reason}</p>
                      </div>
                      {isAvailable && (
                        <Badge className="bg-orange-100 text-orange-700">
                          DISPONIBLE
                        </Badge>
                      )}
                      {reward.isRedeemed && (
                        <Badge variant="secondary">
                          ✅ UTILISÉ
                        </Badge>
                      )}
                      {expired && !reward.isRedeemed && (
                        <Badge variant="destructive">
                          EXPIRÉ
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">

                    {/* QR Code */}
                    {isAvailable && qrCodes[reward.id] && (
                      <Card className="bg-muted">
                        <CardContent className="pt-6 text-center">
                          <p className="text-sm font-semibold mb-3">
                            Scannez ce code en magasin
                          </p>
                          <img
                            src={qrCodes[reward.id]}
                            alt="QR Code"
                            className="mx-auto w-48 h-48 mb-3"
                          />
                          <Badge variant="outline" className="font-mono">
                            {reward.code}
                          </Badge>
                        </CardContent>
                      </Card>
                    )}

                    {/* Expiration Warning */}
                    {isAvailable && daysLeft <= 3 && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-700">
                          ⚠️ <strong>Attention :</strong> Ce lot expire dans {daysLeft} jour{daysLeft > 1 ? "s" : ""} !
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Créé le</p>
                        <p className="font-semibold">
                          {new Date(reward.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Expire le</p>
                        <p className="font-semibold">
                          {new Date(reward.expiresAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      {reward.isRedeemed && reward.redeemedAt && (
                        <>
                          <div>
                            <p className="text-muted-foreground">Utilisé le</p>
                            <p className="font-semibold">
                              {new Date(reward.redeemedAt).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                          {reward.redeemedBy && (
                            <div>
                              <p className="text-muted-foreground">Par</p>
                              <p className="font-semibold">{reward.redeemedBy}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Help Card */}
        {availableCount > 0 && (
          <Alert className="mt-6 border-blue-200 bg-blue-50">
            <AlertDescription className="text-blue-900">
              <h3 className="font-bold mb-2">💡 Comment utiliser mes lots ?</h3>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Rendez-vous en magasin Kech Waffles</li>
                <li>Présentez le QR code à scanner au staff</li>
                <li>Profitez de votre lot !</li>
              </ol>
            </AlertDescription>
          </Alert>
        )}

        {/* Navigation */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Button
            onClick={() => router.push("/concours/pronostics")}
            variant="outline"
          >
            ⚽ Pronostics
          </Button>
          <Button
            onClick={() => router.push("/location")}
          >
            📍 Adresse
          </Button>
        </div>
      </div>
    </div>
  );
}
