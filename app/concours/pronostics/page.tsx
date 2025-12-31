"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Clock, MapPin } from "lucide-react";

type Match = {
  id: string;
  matchNumber: number;
  phase: string;
  homeTeam: {
    name: string;
    code: string;
    flag: string;
  };
  awayTeam: {
    name: string;
    code: string;
    flag: string;
  };
  scheduledAt: string;
  venue?: string;
  city?: string;
  userPronostic?: {
    homeScore: number;
    awayScore: number;
  } | null;
};

export default function PronosticsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasScanned, setHasScanned] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/concours/auth?redirect=/concours/pronostics");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      loadMatches();
      checkQRScan();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  async function loadMatches() {
    try {
      const res = await fetch(`/api/concours/matches?userId=${session?.user?.id}`);
      const data = await res.json();
      if (data.success) {
        setMatches(data.matches);
      }
    } catch (error) {
      console.error("Erreur chargement matchs:", error);
    } finally {
      setLoading(false);
    }
  }

  async function checkQRScan() {
    setHasScanned(true);
  }

  function openPronosticModal(match: Match) {
    setSelectedMatch(match);
    if (match.userPronostic) {
      setHomeScore(match.userPronostic.homeScore);
      setAwayScore(match.userPronostic.awayScore);
    } else {
      setHomeScore(0);
      setAwayScore(0);
    }
  }

  function closeModal() {
    setSelectedMatch(null);
    setHomeScore(0);
    setAwayScore(0);
  }

  async function submitPronostic() {
    if (!selectedMatch || !session?.user) return;

    setSubmitting(true);

    try {
      const res = await fetch("/api/concours/pronostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          matchId: selectedMatch.id,
          homeScore,
          awayScore,
        }),
      });

      const data = await res.json();

      if (data.success) {
        await loadMatches();
        closeModal();
      } else {
        alert(data.message || "Erreur lors de l'enregistrement");
      }
    } catch (error) {
      console.error("Erreur soumission:", error);
      alert("Erreur de connexion");
    } finally {
      setSubmitting(false);
    }
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  function getPhaseLabel(phase: string) {
    const labels: Record<string, string> = {
      GROUP_STAGE: "Phase de poules",
      ROUND_OF_16: "Huitièmes de finale",
      QUARTER_FINAL: "Quarts de finale",
      SEMI_FINAL: "Demi-finales",
      THIRD_PLACE: "Petite finale",
      FINAL: "Finale",
    };
    return labels[phase] || phase;
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
            <CardTitle className="text-3xl">🏆 Pronostics CAN 2025</CardTitle>
            <CardDescription>
              Pronostiquez les scores et gagnez des lots !
            </CardDescription>
          </CardHeader>
        </Card>

        {/* QR Scan Warning */}
        {!hasScanned && (
          <Alert className="border-orange-300 bg-orange-50">
            <AlertDescription className="text-orange-900">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h3 className="font-bold mb-1">
                    Scannez le QR code en magasin
                  </h3>
                  <p className="text-sm">
                    Vous devez scanner le QR code affiché en magasin pour accéder aux pronostics d&apos;aujourd&apos;hui.
                  </p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Matches List */}
        {matches.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <span className="text-6xl mb-4 block">⚽</span>
              <CardTitle className="text-2xl mb-2">
                Aucun match disponible
              </CardTitle>
              <CardDescription>
                Les matchs à venir s&apos;afficheront ici
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => {
              const timeLeft = new Date(match.scheduledAt).getTime() - Date.now();
              const minutesLeft = Math.floor(timeLeft / (1000 * 60));
              const hoursLeft = Math.floor(minutesLeft / 60);

              return (
                <Card key={match.id} className="hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {getPhaseLabel(match.phase)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Match #{match.matchNumber}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Teams */}
                    <div className="flex items-center justify-between">
                      <div className="flex-1 text-center">
                        <Image
                          src={match.homeTeam.flag}
                          alt={match.homeTeam.name}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-full mx-auto mb-2"
                        />
                        <p className="font-bold">{match.homeTeam.name}</p>
                        <p className="text-sm text-muted-foreground">{match.homeTeam.code}</p>
                      </div>

                      <div className="px-6">
                        <span className="text-2xl font-bold text-muted-foreground">VS</span>
                      </div>

                      <div className="flex-1 text-center">
                        <Image
                          src={match.awayTeam.flag}
                          alt={match.awayTeam.name}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-full mx-auto mb-2"
                        />
                        <p className="font-bold">{match.awayTeam.name}</p>
                        <p className="text-sm text-muted-foreground">{match.awayTeam.code}</p>
                      </div>
                    </div>

                    {/* Date & Venue */}
                    <div className="text-center space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                        <Clock className="h-4 w-4" />
                        {formatDate(match.scheduledAt)}
                      </p>
                      {match.venue && (
                        <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                          <MapPin className="h-3 w-3" />
                          {match.venue}, {match.city}
                        </p>
                      )}
                    </div>

                    {/* User Pronostic or CTA */}
                    {match.userPronostic ? (
                      <Card className="border-green-200 bg-green-50">
                        <CardContent className="pt-4">
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                            <div className="flex items-center gap-2 sm:gap-4">
                              <span className="text-sm text-green-800">
                                Votre pronostic :
                              </span>
                              <span className="text-2xl font-bold text-green-900">
                                {match.userPronostic.homeScore} - {match.userPronostic.awayScore}
                              </span>
                            </div>
                            <Button
                              onClick={() => openPronosticModal(match)}
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-700"
                            >
                              Modifier
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Button
                        onClick={() => openPronosticModal(match)}
                        disabled={minutesLeft < 5}
                        className="w-full"
                      >
                        {minutesLeft < 5 ? "Pronostics fermés" : "Faire mon pronostic"}
                      </Button>
                    )}

                    {minutesLeft < 60 && minutesLeft >= 5 && (
                      <p className="text-center text-xs text-orange-600">
                        ⏰ Encore {minutesLeft} min pour pronostiquer
                      </p>
                    )}
                    {hoursLeft >= 1 && hoursLeft < 24 && (
                      <p className="text-center text-xs text-orange-600">
                        ⏰ Encore {hoursLeft}h pour pronostiquer
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => router.push("/concours/mes-pronostics")}
            variant="outline"
          >
            📊 Mes pronostics
          </Button>
          <Button
            onClick={() => router.push("/concours/classement")}
            variant="outline"
          >
            🏆 Classement
          </Button>
        </div>
      </div>

      {/* Modal Pronostic */}
      <Dialog open={!!selectedMatch} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Votre pronostic</DialogTitle>
          </DialogHeader>

          {selectedMatch && (
            <div className="space-y-6">
              {/* Teams */}
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <Image
                    src={selectedMatch.homeTeam.flag}
                    alt={selectedMatch.homeTeam.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-cover rounded-full mx-auto mb-2"
                  />
                  <p className="font-bold text-sm">{selectedMatch.homeTeam.name}</p>
                </div>

                <div className="px-4">
                  <span className="text-xl font-bold text-muted-foreground">VS</span>
                </div>

                <div className="text-center flex-1">
                  <Image
                    src={selectedMatch.awayTeam.flag}
                    alt={selectedMatch.awayTeam.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-cover rounded-full mx-auto mb-2"
                  />
                  <p className="font-bold text-sm">{selectedMatch.awayTeam.name}</p>
                </div>
              </div>

              {/* Score Inputs */}
              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center space-y-2">
                  <Label>Score domicile</Label>
                  <Input
                    type="number"
                    min="0"
                    max="20"
                    value={homeScore}
                    onChange={(e) => setHomeScore(parseInt(e.target.value) || 0)}
                    className="w-20 h-20 text-3xl font-bold text-center"
                  />
                </div>

                <span className="text-3xl font-bold text-muted-foreground mt-8">-</span>

                <div className="flex flex-col items-center space-y-2">
                  <Label>Score extérieur</Label>
                  <Input
                    type="number"
                    min="0"
                    max="20"
                    value={awayScore}
                    onChange={(e) => setAwayScore(parseInt(e.target.value) || 0)}
                    className="w-20 h-20 text-3xl font-bold text-center"
                  />
                </div>
              </div>

              {/* Info */}
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="pt-4">
                  <p className="text-xs text-orange-800">
                    🧇 <strong>Score exact</strong> = Gaufre offerte le lendemain !<br />
                    ⚽ <strong>Bon résultat</strong> = Points pour le classement
                  </p>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={closeModal}
                  disabled={submitting}
                  variant="outline"
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  onClick={submitPronostic}
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? "Envoi..." : "Valider"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
