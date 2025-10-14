"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";

interface Team {
  id: string;
  name: string;
  nameFr: string;
  code: string;
  flag: string;
}

interface Match {
  id: string;
  matchNumber: number;
  phase: string;
  scheduledAt: string;
  venue: string | null;
  city: string | null;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  isFinished: boolean;
  lockPronostics: boolean;
}

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [homeScore, setHomeScore] = useState<string>("");
  const [awayScore, setAwayScore] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Charger les matchs
  useEffect(() => {
    fetchMatches();
  }, []);

  // Filtrer les matchs par phase
  useEffect(() => {
    if (selectedPhase === "all") {
      setFilteredMatches(matches);
    } else {
      setFilteredMatches(matches.filter((m) => m.phase === selectedPhase));
    }
  }, [selectedPhase, matches]);

  const fetchMatches = async () => {
    try {
      const response = await fetch("/api/admin/matches");
      if (response.ok) {
        const data = await response.json();
        setMatches(data.matches || []);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  const handleSelectMatch = (match: Match) => {
    setSelectedMatch(match);
    setHomeScore(match.homeScore?.toString() || "");
    setAwayScore(match.awayScore?.toString() || "");
    setMessage(null);
  };

  const handleSaveResult = async () => {
    if (!selectedMatch) return;

    const homeScoreNum = parseInt(homeScore);
    const awayScoreNum = parseInt(awayScore);

    if (isNaN(homeScoreNum) || isNaN(awayScoreNum) || homeScoreNum < 0 || awayScoreNum < 0) {
      setMessage({ type: "error", text: "Veuillez entrer des scores valides (≥ 0)" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/matches/update-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: selectedMatch.id,
          homeScore: homeScoreNum,
          awayScore: awayScoreNum,
          isFinished: true,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Résultat enregistré avec succès!" });
        await fetchMatches();
        setSelectedMatch(null);
        setHomeScore("");
        setAwayScore("");
      } else {
        setMessage({ type: "error", text: data.error || "Erreur lors de l'enregistrement" });
      }
    } catch {
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

  const getMatchStatus = (match: Match) => {
    if (match.isFinished) {
      return (
        <span className="text-green-600 font-medium">
          Terminé: {match.homeScore} - {match.awayScore}
        </span>
      );
    }
    const matchDate = new Date(match.scheduledAt);
    const now = new Date();
    if (matchDate > now) {
      return <span className="text-amber-600">À venir</span>;
    }
    return <span className="text-blue-600">En cours</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-amber-500 to-red-600 bg-clip-text text-transparent mb-2">
            Gestion des Matchs
          </h1>
          <p className="text-gray-600">Saisir les résultats et gérer les matchs de la CAN 2025</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des matchs */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Liste des Matchs</CardTitle>
              <CardDescription>
                <Select value={selectedPhase} onValueChange={setSelectedPhase}>
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="Filtrer par phase" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les phases</SelectItem>
                    <SelectItem value="GROUP_STAGE">Phase de poules</SelectItem>
                    <SelectItem value="ROUND_OF_16">8èmes de finale</SelectItem>
                    <SelectItem value="QUARTER_FINAL">Quarts de finale</SelectItem>
                    <SelectItem value="SEMI_FINAL">Demi-finales</SelectItem>
                    <SelectItem value="THIRD_PLACE">Match pour la 3ème place</SelectItem>
                    <SelectItem value="FINAL">Finale</SelectItem>
                  </SelectContent>
                </Select>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredMatches.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Aucun match trouvé</p>
                ) : (
                  filteredMatches.map((match) => (
                    <div
                      key={match.id}
                      onClick={() => handleSelectMatch(match)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedMatch?.id === match.id
                          ? "border-amber-500 bg-amber-50"
                          : "border-gray-200 hover:border-amber-300"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          Match #{match.matchNumber} - {getPhaseLabel(match.phase)}
                        </span>
                        {getMatchStatus(match)}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <Image src={match.homeTeam.flag} alt={match.homeTeam.code} width={24} height={16} className="w-6 h-4 object-cover" />
                          <span className="font-medium">{match.homeTeam.nameFr}</span>
                        </div>
                        <span className="mx-4 text-lg font-bold text-gray-400">VS</span>
                        <div className="flex items-center gap-2 flex-1 justify-end">
                          <span className="font-medium">{match.awayTeam.nameFr}</span>
                          <Image src={match.awayTeam.flag} alt={match.awayTeam.code} width={24} height={16} className="w-6 h-4 object-cover" />
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {new Date(match.scheduledAt).toLocaleString("fr-FR")} - {match.venue}, {match.city}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Formulaire de saisie */}
          <Card>
            <CardHeader>
              <CardTitle>Saisir le Résultat</CardTitle>
              <CardDescription>
                {selectedMatch
                  ? `Match #${selectedMatch.matchNumber}`
                  : "Sélectionnez un match"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedMatch ? (
                <div className="space-y-4">
                  {/* Équipe à domicile */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Image
                        src={selectedMatch.homeTeam.flag}
                        alt={selectedMatch.homeTeam.code}
                        width={32}
                        height={24}
                        className="w-8 h-6 object-cover"
                      />
                      <span className="font-medium">{selectedMatch.homeTeam.nameFr}</span>
                    </div>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Score"
                      value={homeScore}
                      onChange={(e) => setHomeScore(e.target.value)}
                      className="text-2xl text-center font-bold"
                    />
                  </div>

                  <div className="text-center text-2xl font-bold text-gray-400">-</div>

                  {/* Équipe à l'extérieur */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Image
                        src={selectedMatch.awayTeam.flag}
                        alt={selectedMatch.awayTeam.code}
                        width={32}
                        height={24}
                        className="w-8 h-6 object-cover"
                      />
                      <span className="font-medium">{selectedMatch.awayTeam.nameFr}</span>
                    </div>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Score"
                      value={awayScore}
                      onChange={(e) => setAwayScore(e.target.value)}
                      className="text-2xl text-center font-bold"
                    />
                  </div>

                  {message && (
                    <Alert className={message.type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
                      <p className={message.type === "success" ? "text-green-800" : "text-red-800"}>
                        {message.text}
                      </p>
                    </Alert>
                  )}

                  <Button
                    onClick={handleSaveResult}
                    disabled={loading || !homeScore || !awayScore}
                    className="w-full bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700"
                  >
                    {loading ? "Enregistrement..." : "Enregistrer le Résultat"}
                  </Button>

                  <Button
                    onClick={() => {
                      setSelectedMatch(null);
                      setHomeScore("");
                      setAwayScore("");
                      setMessage(null);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Annuler
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>Sélectionnez un match dans la liste pour saisir son résultat</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
