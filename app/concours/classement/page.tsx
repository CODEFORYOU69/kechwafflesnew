"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, Trophy } from "lucide-react";

type LeaderboardEntry = {
  rank: number;
  userId: string;
  userName: string;
  userImage?: string;
  totalPoints: number;
  totalPronostics: number;
};

export default function ClassementPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/concours/auth?redirect=/concours/classement");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    loadLeaderboard();
  }, [session]);

  async function loadLeaderboard() {
    try {
      const res = await fetch("/api/concours/leaderboard?limit=50");
      const data = await res.json();
      if (data.success) {
        setLeaderboard(data.leaderboard);

        // Trouver le rang de l'utilisateur
        const userEntry = data.leaderboard.find(
          (entry: LeaderboardEntry) => entry.userId === session?.user?.id
        );
        setUserRank(userEntry || null);
      }
    } catch (error) {
      console.error("Erreur chargement classement:", error);
    } finally {
      setLoading(false);
    }
  }

  function getMedalEmoji(rank: number) {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return "";
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
                <CardTitle className="text-3xl">🏆 Classement Général</CardTitle>
                <CardDescription>Top 50 des meilleurs pronostiqueurs</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* User Rank Card */}
        {userRank && (
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-xl p-6 mb-6 text-white">
            <p className="text-sm opacity-90 mb-2">Votre classement</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-5xl font-bold">
                  #{userRank.rank}
                </div>
                <div>
                  <p className="font-bold text-xl">{userRank.userName}</p>
                  <p className="text-sm opacity-90">
                    {userRank.totalPronostics} pronostic{userRank.totalPronostics > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold">{userRank.totalPoints}</p>
                <p className="text-sm opacity-90">points</p>
              </div>
            </div>
          </div>
        )}

        {/* Podium */}
        {leaderboard.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* 2nd Place */}
            <div className="bg-gradient-to-b from-gray-300 to-gray-400 rounded-xl shadow-lg p-4 text-center text-white mt-8">
              <div className="text-4xl mb-2">🥈</div>
              <div className="text-2xl font-bold mb-1">2</div>
              <p className="font-bold truncate">{leaderboard[1].userName}</p>
              <p className="text-2xl font-bold mt-2">{leaderboard[1].totalPoints}</p>
              <p className="text-xs opacity-90">points</p>
            </div>

            {/* 1st Place */}
            <div className="bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-xl shadow-xl p-4 text-center text-white">
              <div className="text-5xl mb-2">🥇</div>
              <div className="text-3xl font-bold mb-1">1</div>
              <p className="font-bold truncate">{leaderboard[0].userName}</p>
              <p className="text-3xl font-bold mt-2">{leaderboard[0].totalPoints}</p>
              <p className="text-sm opacity-90">points</p>
            </div>

            {/* 3rd Place */}
            <div className="bg-gradient-to-b from-amber-600 to-amber-800 rounded-xl shadow-lg p-4 text-center text-white mt-8">
              <div className="text-4xl mb-2">🥉</div>
              <div className="text-2xl font-bold mb-1">3</div>
              <p className="font-bold truncate">{leaderboard[2].userName}</p>
              <p className="text-2xl font-bold mt-2">{leaderboard[2].totalPoints}</p>
              <p className="text-xs opacity-90">points</p>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>Classement complet</CardTitle>
          </CardHeader>

          {leaderboard.length === 0 ? (
            <CardContent className="pt-12 pb-12 text-center">
              <span className="text-6xl mb-4 block">🏆</span>
              <CardDescription>Aucun classement disponible</CardDescription>
            </CardContent>
          ) : (
            <CardContent>
              <div className="divide-y">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.userId}
                    className={`py-4 flex items-center justify-between hover:bg-muted/50 transition-colors rounded-lg px-2 ${
                      entry.userId === session?.user?.id ? "bg-orange-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {/* Rank */}
                      <div className="w-12 text-center">
                        {entry.rank <= 3 ? (
                          <span className="text-2xl">
                            {getMedalEmoji(entry.rank)}
                          </span>
                        ) : (
                          <Badge variant="secondary" className="font-bold">
                            {entry.rank}
                          </Badge>
                        )}
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <p className="font-bold">
                          {entry.userName}
                          {entry.userId === session?.user?.id && (
                            <Badge variant="outline" className="ml-2 text-orange-600 border-orange-600">
                              Vous
                            </Badge>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {entry.totalPronostics} pronostic{entry.totalPronostics > 1 ? "s" : ""}
                        </p>
                      </div>

                      {/* Points */}
                      <div className="text-right">
                        <p className="text-2xl font-bold text-orange-600">
                          {entry.totalPoints}
                        </p>
                        <p className="text-xs text-muted-foreground">points</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Prizes Info */}
        <div className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-xl p-6 text-white">
          <h3 className="text-xl font-bold mb-3">🎁 Lots à gagner</h3>
          <div className="space-y-2 text-sm">
            <p>🥇 <strong>1er</strong> : Menu complet ×10 (500 MAD)</p>
            <p>🥈 <strong>2ème</strong> : Bon partenaire 300 MAD</p>
            <p>🥉 <strong>3ème</strong> : Bon partenaire 200 MAD</p>
            <p className="text-xs opacity-90 mt-3">
              * Les gagnants seront annoncés à la fin de la CAN 2025
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Button
            onClick={() => router.push("/concours/pronostics")}
            variant="outline"
          >
            ⚽ Pronostics
          </Button>
          <Button
            onClick={() => router.push("/concours/mes-pronostics")}
            variant="outline"
          >
            📊 Mes résultats
          </Button>
        </div>
      </div>
    </div>
  );
}
