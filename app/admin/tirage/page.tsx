"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Trophy, Loader2, CheckCircle, Gift } from "lucide-react";
import Link from "next/link";

interface Draw {
  id: string;
  weekNumber: number;
  year: number;
  startDate: string;
  endDate: string;
  isCompleted: boolean;
  drawnAt: string | null;
  totalParticipants: number;
  totalScans: number;
  winners: Array<{
    id: string;
    position: number;
    prizeTitle: string;
    prizeValue: number | null;
    isClaimed: boolean;
    claimedAt: string | null;
    scanCount: number;
    user: {
      name: string;
      email: string;
    };
    partner: {
      name: string;
      logo: string | null;
    } | null;
  }>;
}

export default function AdminTiragePage() {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(true);
  const [performing, setPerforming] = useState(false);

  useEffect(() => {
    fetchDraws();
  }, []);

  const fetchDraws = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/draw/list");
      if (response.ok) {
        const data = await response.json();
        setDraws(data.draws || []);
      }
    } catch (error) {
      console.error("Error fetching draws:", error);
    } finally {
      setLoading(false);
    }
  };

  const performDraw = async () => {
    // Calcule la semaine en cours
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now.getTime() - yearStart.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((days + yearStart.getDay() + 1) / 7);
    const year = now.getFullYear();

    if (!confirm(
      `Effectuer le tirage pour la semaine ${weekNumber} de ${year} ?\n\n` +
      `3 gagnants seront tirés au sort parmi les participants.`
    )) {
      return;
    }

    try {
      setPerforming(true);
      const response = await fetch("/api/admin/draw/perform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year,
          weekNumber,
          numberOfWinners: 3,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          `✅ Tirage effectué !\n\n` +
          `${data.draw.totalParticipants} participants\n` +
          `${data.draw.winners.length} gagnant(s)\n\n` +
          data.draw.winners.map((w: { position: number; userName: string; prizeTitle: string }) =>
            `${w.position}. ${w.userName} - ${w.prizeTitle}`
          ).join("\n")
        );
        fetchDraws();
      } else {
        alert(`Erreur: ${data.message || "Impossible d'effectuer le tirage"}`);
      }
    } catch (error) {
      console.error("Error performing draw:", error);
      alert("Erreur de connexion");
    } finally {
      setPerforming(false);
    }
  };

  const claimPrize = async (winnerId: string, userName: string, prizeTitle: string) => {
    if (!confirm(`Confirmer la remise du lot à ${userName} ?\n\n${prizeTitle}`)) {
      return;
    }

    try {
      const response = await fetch("/api/admin/draw/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ winnerId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Lot réclamé avec succès !");
        fetchDraws();
      } else {
        alert(`Erreur: ${data.message || "Impossible de marquer le lot comme réclamé"}`);
      }
    } catch (error) {
      console.error("Error claiming prize:", error);
      alert("Erreur de connexion");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-amber-500 to-red-600 bg-clip-text text-transparent">
                🎲 Tirages au Sort
              </h1>
              <p className="text-gray-600">Effectuer les tirages hebdomadaires et gérer les gagnants</p>
            </div>
          </div>

          <Button
            onClick={performDraw}
            disabled={performing}
            className="bg-gradient-to-r from-green-600 via-amber-500 to-red-600"
            size="lg"
          >
            {performing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Tirage en cours...
              </>
            ) : (
              <>
                <Trophy className="mr-2 h-4 w-4" />
                Effectuer le tirage de la semaine
              </>
            )}
          </Button>
        </div>

        {/* Instructions */}
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <AlertDescription className="text-blue-900">
            <strong>Comment ça marche:</strong>
            <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
              <li>Chaque semaine, 3 gagnants sont tirés au sort parmi les participants</li>
              <li>Pour participer: avoir scanné au moins 1 QR code pendant la semaine</li>
              <li>1er prix: Gaufre XXL • 2ème prix: Ticanmisu • 3ème prix: Menu complet</li>
              <li>Cliquez sur le bouton ci-dessus pour effectuer le tirage de la semaine en cours</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Liste des tirages */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-600" />
          </div>
        ) : draws.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12 text-gray-500">
              Aucun tirage effectué pour le moment
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {draws.map((draw) => (
              <Card key={draw.id} className={draw.isCompleted ? "border-green-200" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Semaine {draw.weekNumber} - {draw.year}
                        {draw.isCompleted && (
                          <Badge className="bg-green-600">Effectué</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        Du {new Date(draw.startDate).toLocaleDateString("fr-FR")} au{" "}
                        {new Date(draw.endDate).toLocaleDateString("fr-FR")}
                        {draw.drawnAt && (
                          <> • Tiré le {new Date(draw.drawnAt).toLocaleDateString("fr-FR")}</>
                        )}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Participants</div>
                      <div className="text-2xl font-bold">{draw.totalParticipants}</div>
                    </div>
                  </div>
                </CardHeader>

                {draw.winners.length > 0 && (
                  <CardContent>
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-amber-600" />
                        Gagnants
                      </h3>
                      {draw.winners.map((winner) => (
                        <div
                          key={winner.id}
                          className="flex items-center justify-between p-4 border rounded-lg bg-white"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`text-2xl font-bold ${
                              winner.position === 1 ? "text-amber-500" :
                              winner.position === 2 ? "text-gray-400" :
                              "text-orange-600"
                            }`}>
                              {winner.position === 1 ? "🥇" : winner.position === 2 ? "🥈" : "🥉"}
                            </div>
                            <div>
                              <div className="font-semibold">{winner.user.name}</div>
                              <div className="text-sm text-gray-600">{winner.user.email}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {winner.scanCount} scan{winner.scanCount > 1 ? "s" : ""}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="font-semibold text-green-600">
                                {winner.prizeTitle}
                              </div>
                              {winner.prizeValue && (
                                <div className="text-sm text-gray-600">
                                  {winner.prizeValue} MAD
                                </div>
                              )}
                              {winner.partner && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {winner.partner.name}
                                </div>
                              )}
                            </div>

                            {winner.isClaimed ? (
                              <Badge className="bg-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Réclamé
                              </Badge>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => claimPrize(winner.id, winner.user.name, winner.prizeTitle)}
                              >
                                <Gift className="h-3 w-3 mr-1" />
                                Remettre le lot
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
