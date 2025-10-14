"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft } from "lucide-react";

type Ticket = {
  ticketCode: string;
  playerName: string;
  playerNumber: number | null;
  teamName: string;
  teamFlag: string;
  matchInfo: string;
  matchDate: string;
  isFinished: boolean;
  hasWon: boolean;
  isChecked: boolean;
  prizeType: string | null;
  prizeValue: number | null;
  isRedeemed: boolean;
  redeemedAt: string | null;
};

export default function MesTicketsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "waiting" | "winners">("all");

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/concours/auth?redirect=/concours/mes-tickets");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      loadTickets();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  async function loadTickets() {
    try {
      const res = await fetch(`/api/concours/ticket?userId=${session?.user?.id}`);
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (error) {
      console.error("Erreur chargement tickets:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredTickets = tickets.filter((ticket) => {
    if (filter === "waiting") return !ticket.isFinished;
    if (filter === "winners") return ticket.hasWon && !ticket.isRedeemed;
    return true;
  });

  const waitingCount = tickets.filter((t) => !t.isFinished).length;
  const winnersCount = tickets.filter((t) => t.hasWon && !t.isRedeemed).length;

  function getPrizeLabel(prizeType: string | null) {
    if (!prizeType) return "";
    const labels: Record<string, string> = {
      SMOOTHIE: "🥤 Smoothie",
      GAUFRE: "🧇 Gaufre",
      BON_PARTENAIRE: "🎟️ Bon partenaire",
    };
    return labels[prizeType] || prizeType;
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
                <CardTitle className="text-3xl">⚽ Mes Tickets Buteur</CardTitle>
                <CardDescription>Jeu du buteur - Concours 3</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Info Card */}
        <Alert className="border-blue-300 bg-gradient-to-r from-blue-500 to-purple-500 text-white mb-6">
          <AlertDescription>
            <h3 className="font-bold text-lg mb-2">💡 Comment ça marche ?</h3>
            <p className="text-sm opacity-90">
              À chaque menu acheté, vous recevez un ticket avec un buteur aléatoire.
              Si votre buteur marque lors du match, vous gagnez un lot !
            </p>
          </AlertDescription>
        </Alert>

        {/* Filters */}
        <Tabs value={filter} onValueChange={(value) => setFilter(value as "all" | "waiting" | "winners")} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Tous ({tickets.length})</TabsTrigger>
            <TabsTrigger value="waiting">En attente ({waitingCount})</TabsTrigger>
            <TabsTrigger value="winners">Gagnants ({winnersCount})</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <span className="text-6xl mb-4 block">🎫</span>
              <CardTitle className="text-2xl mb-2">Aucun ticket</CardTitle>
              <CardDescription>
                {filter === "all"
                  ? "Achetez un menu pour recevoir votre premier ticket !"
                  : filter === "waiting"
                  ? "Tous vos tickets ont été vérifiés"
                  : "Aucun ticket gagnant pour le moment"}
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <Card
                key={ticket.ticketCode}
                className={ticket.hasWon && !ticket.isRedeemed ? "border-green-500" : ""}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground">
                      {ticket.ticketCode}
                    </span>
                    {ticket.hasWon && !ticket.isRedeemed && (
                      <Badge className="bg-green-100 text-green-700">
                        🎉 GAGNANT
                      </Badge>
                    )}
                    {ticket.isRedeemed && (
                      <Badge variant="secondary">
                        ✅ RÉCLAMÉ
                      </Badge>
                    )}
                    {!ticket.isFinished && (
                      <Badge className="bg-orange-100 text-orange-700">
                        ⏳ EN COURS
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">

                  {/* Player Info */}
                  <div className="flex items-center gap-4">
                    <Image
                      src={ticket.teamFlag}
                      alt={ticket.teamName}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-xl">
                        {ticket.playerName}
                        {ticket.playerNumber && (
                          <span className="text-orange-600 ml-2">#{ticket.playerNumber}</span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">{ticket.teamName}</p>
                    </div>
                  </div>

                  {/* Match Info */}
                  <Card className="bg-muted">
                    <CardContent className="pt-4">
                      <p className="text-sm">
                        <span className="font-semibold">Match:</span> {ticket.matchInfo}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(ticket.matchDate).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Prize Info */}
                  {ticket.hasWon && ticket.prizeType && (
                    <Card className={ticket.isRedeemed ? "bg-muted" : "bg-green-50 border-green-300"}>
                      <CardContent className="pt-4">
                        <p className="font-bold text-lg mb-1">
                          {getPrizeLabel(ticket.prizeType)}
                        </p>
                        {ticket.prizeValue && (
                          <p className="text-sm text-muted-foreground">
                            Valeur: {ticket.prizeValue} MAD
                          </p>
                        )}
                        {!ticket.isRedeemed && (
                          <p className="text-xs text-green-700 mt-2">
                            💡 Présentez ce ticket en magasin pour récupérer votre lot
                          </p>
                        )}
                        {ticket.isRedeemed && ticket.redeemedAt && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Réclamé le {new Date(ticket.redeemedAt).toLocaleDateString("fr-FR")}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Losing Ticket */}
                  {ticket.isChecked && !ticket.hasWon && (
                    <Card className="bg-muted">
                      <CardContent className="pt-4 text-center">
                        <p className="text-sm text-muted-foreground">
                          😔 Votre joueur n&apos;a pas marqué cette fois
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CTA */}
        {tickets.length > 0 && winnersCount > 0 && (
          <Card className="mt-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-2">
                🎉 Vous avez {winnersCount} lot{winnersCount > 1 ? "s" : ""} à récupérer !
              </h3>
              <p className="text-sm opacity-90 mb-4">
                Présentez vos tickets gagnants en magasin pour récupérer vos lots
              </p>
              <Button
                onClick={() => router.push("/location")}
                variant="secondary"
                className="bg-white text-green-600 hover:bg-gray-100"
              >
                📍 Voir l&apos;adresse
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
