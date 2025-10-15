"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy, Gift, CheckCircle } from "lucide-react";

interface Winning {
  id: string;
  position: number;
  prizeTitle: string;
  prizeDescription: string | null;
  prizeValue: number | null;
  prizeImage: string | null;
  isClaimed: boolean;
  claimedAt: string | null;
  scanCount: number;
  createdAt: string;
  draw: {
    weekNumber: number;
    year: number;
    drawType: string;
    drawnAt: string | null;
  };
  partner: {
    name: string;
    logo: string | null;
  } | null;
}

export default function MesGainsPage() {
  const [winnings, setWinnings] = useState<Winning[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWinnings();
  }, []);

  const fetchWinnings = async () => {
    try {
      const response = await fetch("/api/concours/my-winnings");
      if (response.ok) {
        const data = await response.json();
        setWinnings(data.winnings || []);
      }
    } catch (error) {
      console.error("Error fetching winnings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-amber-500 to-red-600 bg-clip-text text-transparent mb-2">
            🏆 Mes Gains
          </h1>
          <p className="text-gray-600">Vos lots gagnés aux tirages au sort</p>
        </div>

        {/* Winnings List */}
        {winnings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Vous n&apos;avez pas encore gagné de lot</p>
              <p className="text-sm text-gray-500 mt-2">
                Continuez à scanner les QR codes pour participer aux tirages!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {winnings.map((winning) => (
              <Card
                key={winning.id}
                className={`border-2 ${
                  winning.isClaimed
                    ? "border-green-200 bg-green-50/30"
                    : "border-amber-200 bg-amber-50/30"
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`text-3xl ${
                        winning.position === 1 ? "text-amber-500" :
                        winning.position === 2 ? "text-gray-400" :
                        "text-orange-600"
                      }`}>
                        {winning.position === 1 ? "🥇" : winning.position === 2 ? "🥈" : "🥉"}
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-1">
                          {winning.prizeTitle}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {winning.draw.drawType === "GRAND_PRIZE" ? (
                            <Badge className="bg-gradient-to-r from-amber-500 to-red-500">
                              GRAND PRIX
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              Semaine {winning.draw.weekNumber} - {winning.draw.year}
                            </Badge>
                          )}
                          {winning.draw.drawnAt && (
                            <span>
                              • Tiré le{" "}
                              {new Date(winning.draw.drawnAt).toLocaleDateString("fr-FR")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {winning.isClaimed ? (
                      <Badge className="bg-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Récupéré
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-600">
                        <Gift className="h-3 w-3 mr-1" />
                        À récupérer
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  {winning.prizeDescription && (
                    <p className="text-gray-700 mb-3">{winning.prizeDescription}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {winning.prizeValue && (
                        <div className="text-sm">
                          <span className="text-gray-600">Valeur:</span>{" "}
                          <span className="font-semibold text-green-600">
                            {winning.prizeValue} MAD
                          </span>
                        </div>
                      )}

                      {winning.partner && (
                        <div className="text-sm text-gray-600">
                          Partenaire: <span className="font-semibold">{winning.partner.name}</span>
                        </div>
                      )}
                    </div>

                    {!winning.isClaimed && (
                      <div className="text-sm text-gray-600 text-right">
                        <div className="font-semibold text-amber-600">
                          À récupérer en magasin
                        </div>
                        <div className="text-xs">
                          Présentez-vous avec votre email
                        </div>
                      </div>
                    )}

                    {winning.isClaimed && winning.claimedAt && (
                      <div className="text-sm text-gray-600 text-right">
                        Récupéré le{" "}
                        {new Date(winning.claimedAt).toLocaleDateString("fr-FR")}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Box */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">📍 Comment récupérer vos lots ?</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Présentez-vous au restaurant Kech Waffles</li>
              <li>• Indiquez votre email au staff</li>
              <li>• Récupérez votre lot sur place</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
