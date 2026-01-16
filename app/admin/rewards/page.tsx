"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface User {
  id: string;
  name: string | null;
  email: string | null;
}

interface Team {
  id: string;
  nameFr: string;
  flag: string;
  code: string;
}

interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  scheduledAt: string;
}

interface Reward {
  id: string;
  userId: string;
  type: string;
  description: string;
  code: string;
  isRedeemed: boolean;
  redeemedAt: string | null;
  matchId: string | null;
  reason: string;
  createdAt: string;
  expiresAt: string;
  user: User;
}

interface ExactScorePronostic {
  id: string;
  userId: string;
  homeScore: number;
  awayScore: number;
  points: number;
  createdAt: string;
  user: User;
  match: Match;
}

interface WinningTicket {
  id: string;
  ticketCode: string;
  hasWon: boolean;
  isRedeemed: boolean;
  redeemedAt: string | null;
  prizeType: string | null;
  prizeValue: number | null;
  createdAt: string;
  user: User | null;
  player: {
    id: string;
    name: string;
    nameFr: string;
    team: Team;
  };
  match: Match;
}

interface LeaderboardEntry {
  rank: number;
  user: User | null;
  totalPoints: number;
  totalPronostics: number;
}

interface Stats {
  totalRewards: number;
  redeemedRewards: number;
  pendingRewards: number;
  exactScores: number;
  exactScoresWithoutReward: number;
  winningTickets: number;
  redeemedTickets: number;
  pendingTickets: number;
}

interface RewardsData {
  rewards: Reward[];
  exactScorePronostics: ExactScorePronostic[];
  winningTickets: WinningTicket[];
  leaderboard: LeaderboardEntry[];
  stats: Stats;
}

export default function AdminRewardsPage() {
  const [data, setData] = useState<RewardsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingRewards, setGeneratingRewards] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/admin/rewards");
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching rewards:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateMissingRewards = async () => {
    setGeneratingRewards(true);
    try {
      const response = await fetch("/api/admin/rewards/generate-missing", {
        method: "POST",
      });
      if (response.ok) {
        await fetchData();
        alert("Rewards manquants generés avec succès!");
      }
    } catch (error) {
      console.error("Error generating rewards:", error);
      alert("Erreur lors de la génération des rewards");
    } finally {
      setGeneratingRewards(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 p-6 flex items-center justify-center">
        <p className="text-red-600">Erreur de chargement des données</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-amber-600 hover:underline mb-2 inline-block">
              &larr; Retour au dashboard
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-amber-500 to-red-600 bg-clip-text text-transparent mb-2">
              Gestion des Gains
            </h1>
            <p className="text-gray-600">
              Tous les gagnants : scores exacts, tickets buteur, classement
            </p>
          </div>
          {data.stats.exactScoresWithoutReward > 0 && (
            <Button
              onClick={generateMissingRewards}
              disabled={generatingRewards}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {generatingRewards ? "Génération..." : `Générer ${data.stats.exactScoresWithoutReward} rewards manquants`}
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{data.stats.exactScores}</div>
                <div className="text-sm text-gray-600">Scores Exacts</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">{data.stats.winningTickets}</div>
                <div className="text-sm text-gray-600">Tickets Gagnants</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{data.stats.totalRewards}</div>
                <div className="text-sm text-gray-600">Rewards Générés</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {data.stats.redeemedRewards + data.stats.redeemedTickets}
                </div>
                <div className="text-sm text-gray-600">Réclamés</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="exact-scores" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="exact-scores">
              Scores Exacts ({data.exactScorePronostics.length})
            </TabsTrigger>
            <TabsTrigger value="winning-tickets">
              Tickets Buteur ({data.winningTickets.length})
            </TabsTrigger>
            <TabsTrigger value="leaderboard">
              Classement Top 10
            </TabsTrigger>
            <TabsTrigger value="all-rewards">
              Tous les Rewards ({data.rewards.length})
            </TabsTrigger>
          </TabsList>

          {/* Tab: Scores Exacts */}
          <TabsContent value="exact-scores">
            <Card>
              <CardHeader>
                <CardTitle>Gagnants Score Exact</CardTitle>
                <CardDescription>
                  Utilisateurs ayant trouvé le score exact - Gaufre offerte
                </CardDescription>
              </CardHeader>
              <CardContent>
                {data.exactScorePronostics.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Aucun score exact pour le moment</p>
                ) : (
                  <div className="space-y-4">
                    {data.exactScorePronostics.map((prono) => {
                      const hasReward = data.rewards.some(
                        (r) => r.matchId === prono.match.id && r.userId === prono.userId
                      );
                      const reward = data.rewards.find(
                        (r) => r.matchId === prono.match.id && r.userId === prono.userId
                      );

                      return (
                        <div
                          key={prono.id}
                          className="flex items-center justify-between p-4 bg-white rounded-lg border shadow-sm"
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-2xl">
                              {prono.match.homeTeam.flag} {prono.homeScore} - {prono.awayScore}{" "}
                              {prono.match.awayTeam.flag}
                            </div>
                            <div>
                              <div className="font-semibold">
                                {prono.user.name || "Anonyme"}
                              </div>
                              <div className="text-sm text-gray-600">
                                {prono.user.email}
                              </div>
                              <div className="text-xs text-gray-400">
                                {prono.match.homeTeam.nameFr} vs {prono.match.awayTeam.nameFr}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            {hasReward ? (
                              <div>
                                <Badge
                                  variant={reward?.isRedeemed ? "secondary" : "default"}
                                  className={reward?.isRedeemed ? "bg-gray-200" : "bg-green-500"}
                                >
                                  {reward?.isRedeemed ? "Réclamé" : "Code: " + reward?.code}
                                </Badge>
                                {reward?.isRedeemed && reward.redeemedAt && (
                                  <div className="text-xs text-gray-400 mt-1">
                                    {formatDate(reward.redeemedAt)}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <Badge variant="destructive">Reward non généré</Badge>
                            )}
                            <div className="text-xs text-gray-400 mt-1">
                              {formatDate(prono.createdAt)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Tickets Buteur Gagnants */}
          <TabsContent value="winning-tickets">
            <Card>
              <CardHeader>
                <CardTitle>Tickets Buteur Gagnants</CardTitle>
                <CardDescription>
                  Tickets dont le joueur sélectionné a marqué
                </CardDescription>
              </CardHeader>
              <CardContent>
                {data.winningTickets.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Aucun ticket gagnant pour le moment</p>
                ) : (
                  <div className="space-y-4">
                    {data.winningTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="flex items-center justify-between p-4 bg-white rounded-lg border shadow-sm"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-2xl">
                            {ticket.player.team.flag}
                          </div>
                          <div>
                            <div className="font-semibold">
                              {ticket.player.nameFr}
                            </div>
                            <div className="text-sm text-gray-600">
                              {ticket.user?.name || "Anonyme"} - {ticket.user?.email || "N/A"}
                            </div>
                            <div className="text-xs text-gray-400">
                              {ticket.match.homeTeam.nameFr} vs {ticket.match.awayTeam.nameFr}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-sm mb-1">{ticket.ticketCode}</div>
                          <Badge
                            variant={ticket.isRedeemed ? "secondary" : "default"}
                            className={ticket.isRedeemed ? "bg-gray-200" : "bg-green-500"}
                          >
                            {ticket.isRedeemed ? "Réclamé" : "En attente"}
                          </Badge>
                          {ticket.prizeType && (
                            <div className="text-xs text-amber-600 mt-1">
                              {ticket.prizeType} ({ticket.prizeValue} DH)
                            </div>
                          )}
                          <div className="text-xs text-gray-400 mt-1">
                            {formatDate(ticket.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Classement */}
          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle>Classement Top 10</CardTitle>
                <CardDescription>
                  Les meilleurs pronostiqueurs - Éligibles au tirage
                </CardDescription>
              </CardHeader>
              <CardContent>
                {data.leaderboard.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Aucun classement disponible</p>
                ) : (
                  <div className="space-y-3">
                    {data.leaderboard.map((entry) => (
                      <div
                        key={entry.user?.id || entry.rank}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          entry.rank <= 3 ? "bg-amber-50 border-amber-200" : "bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                              entry.rank === 1
                                ? "bg-yellow-400 text-white"
                                : entry.rank === 2
                                ? "bg-gray-300 text-white"
                                : entry.rank === 3
                                ? "bg-amber-600 text-white"
                                : "bg-gray-100"
                            }`}
                          >
                            {entry.rank}
                          </div>
                          <div>
                            <div className="font-semibold">{entry.user?.name || "Anonyme"}</div>
                            <div className="text-sm text-gray-600">
                              {entry.user?.email}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-amber-600">
                            {entry.totalPoints} pts
                          </div>
                          <div className="text-xs text-gray-400">
                            {entry.totalPronostics} pronostics
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Tous les Rewards */}
          <TabsContent value="all-rewards">
            <Card>
              <CardHeader>
                <CardTitle>Tous les Rewards</CardTitle>
                <CardDescription>Liste de tous les codes rewards générés</CardDescription>
              </CardHeader>
              <CardContent>
                {data.rewards.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Aucun reward généré</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Code</th>
                          <th className="text-left p-2">Type</th>
                          <th className="text-left p-2">Utilisateur</th>
                          <th className="text-left p-2">Raison</th>
                          <th className="text-left p-2">Statut</th>
                          <th className="text-left p-2">Expiration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.rewards.map((reward) => (
                          <tr key={reward.id} className="border-b">
                            <td className="p-2 font-mono">{reward.code}</td>
                            <td className="p-2">
                              <Badge variant="outline">
                                {reward.type === "GAUFRE_GRATUITE"
                                  ? "Gaufre"
                                  : reward.type === "CAFE_GRATUIT"
                                  ? "Café"
                                  : "Tirage"}
                              </Badge>
                            </td>
                            <td className="p-2">
                              <div className="font-semibold">{reward.user.name || "Anonyme"}</div>
                              <div className="text-xs text-gray-500">
                                {reward.user.email}
                              </div>
                            </td>
                            <td className="p-2 text-sm">{reward.reason}</td>
                            <td className="p-2">
                              <Badge
                                className={reward.isRedeemed ? "bg-gray-200" : "bg-green-500"}
                              >
                                {reward.isRedeemed ? "Réclamé" : "Disponible"}
                              </Badge>
                            </td>
                            <td className="p-2 text-sm">
                              {new Date(reward.expiresAt) < new Date() ? (
                                <span className="text-red-500">Expiré</span>
                              ) : (
                                formatDate(reward.expiresAt)
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
