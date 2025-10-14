"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

interface Player {
  id: string;
  name: string;
  nameFr: string;
  number: number | null;
  position: string | null;
  team: {
    id: string;
    name: string;
    nameFr: string;
    code: string;
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
    name: string;
    nameFr: string;
    code: string;
    flag: string;
  };
  awayTeam: {
    id: string;
    name: string;
    nameFr: string;
    code: string;
    flag: string;
  };
  isFinished: boolean;
}

export default function AdminButeursPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchUpcomingMatches();
  }, []);

  useEffect(() => {
    if (selectedMatch) {
      fetchMatchPlayers(selectedMatch.id);
      fetchSelectedPlayers(selectedMatch.id);
    }
  }, [selectedMatch]);

  const fetchUpcomingMatches = async () => {
    try {
      const response = await fetch("/api/admin/buteurs/matches");
      if (response.ok) {
        const data = await response.json();
        setMatches(data.matches || []);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  const fetchMatchPlayers = async (matchId: string) => {
    try {
      const response = await fetch(`/api/admin/buteurs/players?matchId=${matchId}`);
      if (response.ok) {
        const data = await response.json();
        setPlayers(data.players || []);
      }
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  const fetchSelectedPlayers = async (matchId: string) => {
    try {
      const response = await fetch(`/api/admin/buteurs/selected?matchId=${matchId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedPlayers(new Set(data.playerIds || []));
      }
    } catch (error) {
      console.error("Error fetching selected players:", error);
    }
  };

  const handleTogglePlayer = (playerId: string) => {
    const newSelected = new Set(selectedPlayers);
    if (newSelected.has(playerId)) {
      newSelected.delete(playerId);
    } else {
      newSelected.add(playerId);
    }
    setSelectedPlayers(newSelected);
  };

  const handleSelectAll = (teamId: string) => {
    const teamPlayers = players.filter((p) => p.team.id === teamId);
    const newSelected = new Set(selectedPlayers);
    teamPlayers.forEach((p) => newSelected.add(p.id));
    setSelectedPlayers(newSelected);
  };

  const handleDeselectAll = (teamId: string) => {
    const teamPlayers = players.filter((p) => p.team.id === teamId);
    const newSelected = new Set(selectedPlayers);
    teamPlayers.forEach((p) => newSelected.delete(p.id));
    setSelectedPlayers(newSelected);
  };

  const handleSaveSelection = async () => {
    if (!selectedMatch) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/buteurs/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: selectedMatch.id,
          playerIds: Array.from(selectedPlayers),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: `${data.count} buteurs potentiels sélectionnés avec succès!`,
        });
      } else {
        setMessage({ type: "error", text: data.error || "Erreur lors de l'enregistrement" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur réseau" });
    } finally {
      setLoading(false);
    }
  };

  const getPhaseLabel = (phase: string) => {
    const labels: { [key: string]: string } = {
      GROUP_STAGE: "Phase de poules",
      ROUND_OF_16: "8èmes de finale",
      QUARTER_FINAL: "Quarts de finale",
      SEMI_FINAL: "Demi-finales",
      THIRD_PLACE: "Match pour la 3ème place",
      FINAL: "Finale",
    };
    return labels[phase] || phase;
  };

  const homeTeamPlayers = players.filter((p) => p.team.id === selectedMatch?.homeTeam.id);
  const awayTeamPlayers = players.filter((p) => p.team.id === selectedMatch?.awayTeam.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-amber-500 to-red-600 bg-clip-text text-transparent mb-2">
            Sélection des Buteurs Potentiels
          </h1>
          <p className="text-gray-600">
            Sélectionnez les joueurs qui pourraient marquer pour le Concours 3 (Jeu du Buteur)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Liste des matchs */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Matchs à Venir</CardTitle>
              <CardDescription>Sélectionnez un match</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {matches.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">Aucun match à venir</p>
                ) : (
                  matches.map((match) => (
                    <div
                      key={match.id}
                      onClick={() => setSelectedMatch(match)}
                      className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedMatch?.id === match.id
                          ? "border-amber-500 bg-amber-50"
                          : "border-gray-200 hover:border-amber-300"
                      }`}
                    >
                      <div className="text-xs font-medium text-gray-600 mb-2">
                        #{match.matchNumber} - {getPhaseLabel(match.phase)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <img src={match.homeTeam.flag} alt={match.homeTeam.code} className="w-5 h-3 object-cover" />
                          <span className="text-sm font-medium">{match.homeTeam.code}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <img src={match.awayTeam.flag} alt={match.awayTeam.code} className="w-5 h-3 object-cover" />
                          <span className="text-sm font-medium">{match.awayTeam.code}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {new Date(match.scheduledAt).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sélection des joueurs */}
          <div className="lg:col-span-3">
            {selectedMatch ? (
              <div className="space-y-6">
                {/* En-tête */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Match #{selectedMatch.matchNumber} - {selectedMatch.homeTeam.nameFr} vs{" "}
                      {selectedMatch.awayTeam.nameFr}
                    </CardTitle>
                    <CardDescription>
                      {selectedPlayers.size} buteur(s) potentiel(s) sélectionné(s)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {message && (
                      <Alert className={message.type === "success" ? "bg-green-50 border-green-200 mb-4" : "bg-red-50 border-red-200 mb-4"}>
                        <p className={message.type === "success" ? "text-green-800" : "text-red-800"}>
                          {message.text}
                        </p>
                      </Alert>
                    )}
                    <Button
                      onClick={handleSaveSelection}
                      disabled={loading || selectedPlayers.size === 0}
                      className="w-full bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700"
                    >
                      {loading ? "Enregistrement..." : `Enregistrer la Sélection (${selectedPlayers.size})`}
                    </Button>
                  </CardContent>
                </Card>

                {/* Grille des équipes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Équipe à domicile */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={selectedMatch.homeTeam.flag}
                            alt={selectedMatch.homeTeam.code}
                            className="w-10 h-7 object-cover"
                          />
                          <div>
                            <CardTitle>{selectedMatch.homeTeam.nameFr}</CardTitle>
                            <CardDescription>{homeTeamPlayers.length} joueurs</CardDescription>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSelectAll(selectedMatch.homeTeam.id)}
                          >
                            Tout
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeselectAll(selectedMatch.homeTeam.id)}
                          >
                            Aucun
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-[500px] overflow-y-auto">
                        {homeTeamPlayers.map((player) => (
                          <div
                            key={player.id}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                            onClick={() => handleTogglePlayer(player.id)}
                          >
                            <Checkbox
                              checked={selectedPlayers.has(player.id)}
                              onCheckedChange={() => handleTogglePlayer(player.id)}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                {player.number && (
                                  <span className="text-xs font-bold text-gray-500 w-6">
                                    #{player.number}
                                  </span>
                                )}
                                <span className="text-sm font-medium">{player.nameFr}</span>
                              </div>
                              <div className="text-xs text-gray-500">{player.position}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Équipe à l'extérieur */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={selectedMatch.awayTeam.flag}
                            alt={selectedMatch.awayTeam.code}
                            className="w-10 h-7 object-cover"
                          />
                          <div>
                            <CardTitle>{selectedMatch.awayTeam.nameFr}</CardTitle>
                            <CardDescription>{awayTeamPlayers.length} joueurs</CardDescription>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSelectAll(selectedMatch.awayTeam.id)}
                          >
                            Tout
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeselectAll(selectedMatch.awayTeam.id)}
                          >
                            Aucun
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-[500px] overflow-y-auto">
                        {awayTeamPlayers.map((player) => (
                          <div
                            key={player.id}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                            onClick={() => handleTogglePlayer(player.id)}
                          >
                            <Checkbox
                              checked={selectedPlayers.has(player.id)}
                              onCheckedChange={() => handleTogglePlayer(player.id)}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                {player.number && (
                                  <span className="text-xs font-bold text-gray-500 w-6">
                                    #{player.number}
                                  </span>
                                )}
                                <span className="text-sm font-medium">{player.nameFr}</span>
                              </div>
                              <div className="text-xs text-gray-500">{player.position}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-gray-500">
                    <p>Sélectionnez un match pour choisir les buteurs potentiels</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
