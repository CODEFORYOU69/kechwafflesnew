"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Player {
  id: string;
  nameFr: string;
  number: number | null;
  goals: number;
  team: {
    nameFr: string;
    flag: string;
  };
}

interface Match {
  id: string;
  matchNumber: number;
  phase: string;
  scheduledAt: string;
  homeTeam: {
    id: string;
    nameFr: string;
    code: string;
    flag: string;
  };
  awayTeam: {
    id: string;
    nameFr: string;
    code: string;
    flag: string;
  };
  homeScore: number | null;
  awayScore: number | null;
  isFinished: boolean;
}

export default function AdminMatchsResultatsPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [scorers, setScorers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFinishedMatches();
  }, []);

  useEffect(() => {
    if (selectedMatch) {
      fetchMatchScorers(selectedMatch.id);
    }
  }, [selectedMatch]);

  const fetchFinishedMatches = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/buteurs/matches?finished=true");
      if (response.ok) {
        const data = await response.json();
        setMatches(data.matches || []);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchScorers = async (matchId: string) => {
    try {
      const response = await fetch(`/api/admin/buteurs/players?matchId=${matchId}`);
      if (response.ok) {
        const data = await response.json();
        setPlayers(data.players || []);

        // Initialiser scorers avec les buts actuels
        const initialScorers: Record<string, number> = {};
        data.players.forEach((player: Player) => {
          initialScorers[player.id] = player.goals;
        });
        setScorers(initialScorers);
      }
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  const incrementGoals = (playerId: string) => {
    setScorers(prev => ({
      ...prev,
      [playerId]: (prev[playerId] || 0) + 1
    }));
  };

  const decrementGoals = (playerId: string) => {
    setScorers(prev => ({
      ...prev,
      [playerId]: Math.max(0, (prev[playerId] || 0) - 1)
    }));
  };

  const saveScorers = async () => {
    if (!selectedMatch) return;

    const scorersToUpdate = Object.entries(scorers)
      .filter(([, goals]) => goals > 0)
      .map(([playerId, goals]) => ({ playerId, goals }));

    if (scorersToUpdate.length === 0) {
      alert("Veuillez sélectionner au moins un buteur");
      return;
    }

    if (!confirm(`Enregistrer ${scorersToUpdate.length} buteur(s) et vérifier les tickets gagnants ?`)) {
      return;
    }

    try {
      setSaving(true);
      const response = await fetch("/api/admin/buteurs/save-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: selectedMatch.id,
          scorers: scorersToUpdate,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          `✅ Succès !\n\n` +
          `Buteurs enregistrés: ${scorersToUpdate.length}\n` +
          `Tickets vérifiés: ${data.totalTickets || 0}\n` +
          `Tickets gagnants: ${data.winnersCount || 0}`
        );
        setSelectedMatch(null);
        setPlayers([]);
        setScorers({});
        fetchFinishedMatches();
      } else {
        alert(`Erreur: ${data.message || "Impossible d'enregistrer"}`);
      }
    } catch (error) {
      console.error("Error saving scorers:", error);
      alert("Erreur de connexion");
    } finally {
      setSaving(false);
    }
  };

  const homeScorers = players.filter(p => p.team.nameFr === selectedMatch?.homeTeam.nameFr);
  const awayScorers = players.filter(p => p.team.nameFr === selectedMatch?.awayTeam.nameFr);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-amber-500 to-red-600 bg-clip-text text-transparent">
              ⚽ Résultats & Buteurs
            </h1>
            <p className="text-gray-600">Enregistrer les buteurs et vérifier les tickets gagnants</p>
          </div>
        </div>

        {!selectedMatch ? (
          /* Liste des matchs */
          <Card>
            <CardHeader>
              <CardTitle>Matchs terminés</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-600" />
                </div>
              ) : matches.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  Aucun match terminé
                </div>
              ) : (
                <div className="space-y-3">
                  {matches.map((match) => {
                    return (
                    <div
                      key={match.id}
                      onClick={() => setSelectedMatch(match)}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex items-center gap-2">
                            <Image
                              src={match.homeTeam.flag}
                              alt={match.homeTeam.nameFr}
                              width={32}
                              height={32}
                              className="rounded"
                            />
                            <span className="font-semibold">{match.homeTeam.nameFr}</span>
                          </div>

                          <div className="text-center px-4">
                            <div className="text-2xl font-bold">
                              {match.homeScore ?? "-"} - {match.awayScore ?? "-"}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Image
                              src={match.awayTeam.flag}
                              alt={match.awayTeam.nameFr}
                              width={32}
                              height={32}
                              className="rounded"
                            />
                            <span className="font-semibold">{match.awayTeam.nameFr}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {new Date(match.scheduledAt).toLocaleDateString("fr-FR")}
                          </Badge>
                          {match.isFinished && (
                            <Badge className="bg-green-600">Terminé</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )})}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          /* Sélection des buteurs */
          <div className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-900">
                <strong>Instructions:</strong> Sélectionnez les buteurs et leur nombre de buts.
                Les tickets gagnants seront automatiquement vérifiés après l&apos;enregistrement.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Image
                      src={selectedMatch.homeTeam.flag}
                      alt={selectedMatch.homeTeam.nameFr}
                      width={40}
                      height={40}
                      className="rounded"
                    />
                    <span>{selectedMatch.homeTeam.nameFr}</span>
                    <span className="text-3xl font-bold mx-4">
                      {selectedMatch.homeScore ?? "-"}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {homeScorers.map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <span className="font-semibold">#{player.number || "?"}</span>
                        <span className="ml-2">{player.nameFr}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => decrementGoals(player.id)}
                        >
                          -
                        </Button>
                        <span className="font-bold text-xl w-8 text-center">
                          {scorers[player.id] || 0}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => incrementGoals(player.id)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Image
                      src={selectedMatch.awayTeam.flag}
                      alt={selectedMatch.awayTeam.nameFr}
                      width={40}
                      height={40}
                      className="rounded"
                    />
                    <span>{selectedMatch.awayTeam.nameFr}</span>
                    <span className="text-3xl font-bold mx-4">
                      {selectedMatch.awayScore ?? "-"}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {awayScorers.map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <span className="font-semibold">#{player.number || "?"}</span>
                        <span className="ml-2">{player.nameFr}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => decrementGoals(player.id)}
                        >
                          -
                        </Button>
                        <span className="font-bold text-xl w-8 text-center">
                          {scorers[player.id] || 0}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => incrementGoals(player.id)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedMatch(null);
                  setPlayers([]);
                  setScorers({});
                }}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={saveScorers}
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-green-600 via-amber-500 to-red-600"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Enregistrer et vérifier tickets
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
