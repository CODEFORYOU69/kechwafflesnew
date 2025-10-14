"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft } from "lucide-react";

type PronosticHistory = {
  id: string;
  match: {
    id: string;
    homeTeam: string;
    awayTeam: string;
    homeFlag: string;
    awayFlag: string;
    scheduledAt: string;
    isFinished: boolean;
    homeScore: number | null;
    awayScore: number | null;
  };
  pronostic: {
    homeScore: number;
    awayScore: number;
  };
  result: {
    points: number;
    isExactScore: boolean;
    isCorrectWinner: boolean;
  };
};

export default function MesPronosticsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [pronostics, setPronostics] = useState<PronosticHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPronostics: 0,
    exactScores: 0,
    correctWinners: 0,
    totalPoints: 0,
    accuracy: 0,
    pendingRewards: 0,
  });

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/concours/auth?redirect=/concours/mes-pronostics");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      loadPronostics();
      loadStats();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  async function loadPronostics() {
    try {
      const res = await fetch(`/api/concours/pronostic?userId=${session?.user?.id}`);
      const data = await res.json();
      if (data.success) {
        setPronostics(data.pronostics);
      }
    } catch (error) {
      console.error("Erreur chargement pronostics:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      const res = await fetch(`/api/concours/stats?userId=${session?.user?.id}`);
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Erreur chargement stats:", error);
    }
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
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
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-3xl">📊 Mes Pronostics</CardTitle>
                <CardDescription>Historique et résultats</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Total</p>
              <p className="text-3xl font-bold">{stats.totalPronostics}</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <p className="text-sm text-green-700 mb-1">Scores exacts</p>
              <p className="text-3xl font-bold text-green-800">{stats.exactScores}</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <p className="text-sm text-blue-700 mb-1">Bons résultats</p>
              <p className="text-3xl font-bold text-blue-800">{stats.correctWinners}</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <p className="text-sm text-orange-700 mb-1">Points totaux</p>
              <p className="text-3xl font-bold text-orange-800">{stats.totalPoints}</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="pt-6">
              <p className="text-sm text-purple-700 mb-1">Précision</p>
              <p className="text-3xl font-bold text-purple-800">
                {stats.accuracy.toFixed(0)}%
              </p>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <p className="text-sm text-yellow-700 mb-1">Lots en attente</p>
              <p className="text-3xl font-bold text-yellow-800">{stats.pendingRewards}</p>
            </CardContent>
          </Card>
        </div>

        {/* Pronostics List */}
        {pronostics.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <span className="text-6xl mb-4 block">⚽</span>
              <CardTitle className="text-2xl mb-2">
                Aucun pronostic
              </CardTitle>
              <CardDescription className="mb-6">
                Vous n&apos;avez pas encore fait de pronostics
              </CardDescription>
              <Button onClick={() => router.push("/concours/pronostics")}>
                Faire un pronostic
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pronostics.map((prono) => (
              <Card key={prono.id} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(prono.match.scheduledAt)}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Teams & Scores */}
                  <div className="flex items-center justify-between">
                    {/* Home Team */}
                    <div className="flex items-center gap-3 flex-1">
                      <Image
                        src={prono.match.homeFlag}
                        alt={prono.match.homeTeam}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                      <span className="font-bold">{prono.match.homeTeam}</span>
                    </div>

                    {/* Scores */}
                    <div className="px-6 text-center">
                      {prono.match.isFinished ? (
                        <div>
                          <div className="text-2xl font-bold mb-1">
                            {prono.match.homeScore} - {prono.match.awayScore}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Votre prono: {prono.pronostic.homeScore} - {prono.pronostic.awayScore}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xl font-bold text-orange-600">
                          {prono.pronostic.homeScore} - {prono.pronostic.awayScore}
                        </div>
                      )}
                    </div>

                    {/* Away Team */}
                    <div className="flex items-center gap-3 flex-1 justify-end">
                      <span className="font-bold">{prono.match.awayTeam}</span>
                      <Image
                        src={prono.match.awayFlag}
                        alt={prono.match.awayTeam}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                    </div>
                  </div>

                  {/* Result */}
                  {prono.match.isFinished ? (
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {prono.result.isExactScore && (
                          <Badge className="bg-green-100 text-green-700">
                            🎯 Score exact (+5 pts)
                          </Badge>
                        )}
                        {!prono.result.isExactScore && prono.result.isCorrectWinner && (
                          <Badge className="bg-blue-100 text-blue-700">
                            ✅ Bon résultat (+3 pts)
                          </Badge>
                        )}
                        {!prono.result.isExactScore && !prono.result.isCorrectWinner && (
                          <Badge variant="secondary">
                            ❌ Manqué (0 pt)
                          </Badge>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="text-2xl font-bold text-orange-600">
                          {prono.result.points} pts
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <span className="text-sm text-muted-foreground">
                        ⏳ En attente du résultat...
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => router.push("/concours/pronostics")}
            variant="outline"
          >
            ⚽ Nouveaux pronostics
          </Button>
          <Button onClick={() => router.push("/concours/mes-lots")}>
            🎁 Mes lots
          </Button>
        </div>
      </div>
    </div>
  );
}
