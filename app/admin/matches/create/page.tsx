"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Plus } from "lucide-react";

type Team = {
  id: string;
  name: string;
  nameFr: string;
  code: string;
  flag: string;
};

const PHASES = [
  { value: "ROUND_OF_16", label: "8èmes de finale" },
  { value: "QUARTER_FINAL", label: "Quarts de finale" },
  { value: "SEMI_FINAL", label: "Demi-finales" },
  { value: "THIRD_PLACE", label: "Match pour la 3ème place" },
  { value: "FINAL", label: "Finale" },
];

const VENUES = [
  { venue: "Stade Mohammed V", city: "Casablanca" },
  { venue: "Complexe Sportif Prince Moulay Abdellah", city: "Rabat" },
  { venue: "Stade Ibn Batouta", city: "Tanger" },
  { venue: "Stade Adrar", city: "Agadir" },
  { venue: "Stade de Marrakech", city: "Marrakech" },
  { venue: "Stade de Fès", city: "Fès" },
];

export default function CreateMatchPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [nextMatchNumber, setNextMatchNumber] = useState(37);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [matchNumber, setMatchNumber] = useState("");
  const [phase, setPhase] = useState("");
  const [homeTeamId, setHomeTeamId] = useState("");
  const [awayTeamId, setAwayTeamId] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [matchTime, setMatchTime] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/matches/create");
      const data = await res.json();
      if (data.success) {
        setTeams(data.teams);
        setNextMatchNumber(data.nextMatchNumber);
        setMatchNumber(data.nextMatchNumber.toString());
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Combiner date et heure
      const scheduledAt = new Date(`${matchDate}T${matchTime}:00`);

      // Récupérer venue et city
      const venueData = VENUES.find(v => `${v.venue}, ${v.city}` === selectedVenue);

      const res = await fetch("/api/admin/matches/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchNumber: parseInt(matchNumber),
          phase,
          homeTeamId,
          awayTeamId,
          scheduledAt: scheduledAt.toISOString(),
          venue: venueData?.venue,
          city: venueData?.city,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: "success", text: `Match #${matchNumber} créé avec succès!` });
        // Réinitialiser le formulaire
        setMatchNumber((parseInt(matchNumber) + 1).toString());
        setPhase("");
        setHomeTeamId("");
        setAwayTeamId("");
        setMatchDate("");
        setMatchTime("");
        setSelectedVenue("");
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch (error) {
      console.error("Error creating match:", error);
      setMessage({ type: "error", text: "Erreur lors de la création du match" });
    } finally {
      setLoading(false);
    }
  };

  const selectedHomeTeam = teams.find(t => t.id === homeTeamId);
  const selectedAwayTeam = teams.find(t => t.id === awayTeamId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/matches">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-amber-500 to-red-600 bg-clip-text text-transparent">
              Créer un Match
            </h1>
            <p className="text-gray-600">Phase finale CAN 2025</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Nouveau Match</CardTitle>
            <CardDescription>
              Créez un match pour les 8èmes, quarts, demi-finales ou finale
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Numéro et Phase */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="matchNumber">Numéro du match</Label>
                  <Input
                    id="matchNumber"
                    type="number"
                    value={matchNumber}
                    onChange={(e) => setMatchNumber(e.target.value)}
                    placeholder={nextMatchNumber.toString()}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phase">Phase</Label>
                  <Select value={phase} onValueChange={setPhase} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la phase" />
                    </SelectTrigger>
                    <SelectContent>
                      {PHASES.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Équipes */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Équipe à domicile</Label>
                  <Select value={homeTeamId} onValueChange={setHomeTeamId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner l'équipe" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id} disabled={team.id === awayTeamId}>
                          <div className="flex items-center gap-2">
                            <Image src={team.flag} alt={team.code} width={20} height={14} className="w-5 h-3.5 object-cover" />
                            {team.nameFr}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Aperçu match */}
                {(selectedHomeTeam || selectedAwayTeam) && (
                  <div className="flex items-center justify-center gap-4 py-4 bg-gray-50 rounded-lg">
                    {selectedHomeTeam ? (
                      <div className="flex items-center gap-2">
                        <Image src={selectedHomeTeam.flag} alt={selectedHomeTeam.code} width={32} height={24} className="w-8 h-6 object-cover" />
                        <span className="font-bold">{selectedHomeTeam.nameFr}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Équipe domicile</span>
                    )}
                    <span className="text-2xl font-bold text-gray-400">VS</span>
                    {selectedAwayTeam ? (
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{selectedAwayTeam.nameFr}</span>
                        <Image src={selectedAwayTeam.flag} alt={selectedAwayTeam.code} width={32} height={24} className="w-8 h-6 object-cover" />
                      </div>
                    ) : (
                      <span className="text-gray-400">Équipe extérieur</span>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Équipe à l&apos;extérieur</Label>
                  <Select value={awayTeamId} onValueChange={setAwayTeamId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner l'équipe" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id} disabled={team.id === homeTeamId}>
                          <div className="flex items-center gap-2">
                            <Image src={team.flag} alt={team.code} width={20} height={14} className="w-5 h-3.5 object-cover" />
                            {team.nameFr}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date et Heure */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="matchDate">Date</Label>
                  <Input
                    id="matchDate"
                    type="date"
                    value={matchDate}
                    onChange={(e) => setMatchDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="matchTime">Heure (locale Maroc)</Label>
                  <Input
                    id="matchTime"
                    type="time"
                    value={matchTime}
                    onChange={(e) => setMatchTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Lieu */}
              <div className="space-y-2">
                <Label>Stade</Label>
                <Select value={selectedVenue} onValueChange={setSelectedVenue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le stade" />
                  </SelectTrigger>
                  <SelectContent>
                    {VENUES.map((v) => (
                      <SelectItem key={v.venue} value={`${v.venue}, ${v.city}`}>
                        {v.venue}, {v.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Message */}
              {message && (
                <Alert className={message.type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
                  <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
                    {message.text}
                  </AlertDescription>
                </Alert>
              )}

              {/* Boutons */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={loading || !phase || !homeTeamId || !awayTeamId || !matchDate || !matchTime}
                  className="flex-1 bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {loading ? "Création..." : "Créer le match"}
                </Button>
                <Link href="/admin/matches">
                  <Button type="button" variant="outline">
                    Retour
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
