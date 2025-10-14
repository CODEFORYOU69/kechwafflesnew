"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type TicketInfo = {
  valid: boolean;
  ticket?: {
    ticketCode: string;
    playerName: string;
    teamName: string;
    matchInfo: string;
    hasWon: boolean;
    isChecked: boolean;
    prizeType?: string;
    prizeValue?: number;
    isRedeemed: boolean;
  };
  message: string;
};

export default function VerifyTicketPage() {
  const [ticketCode, setTicketCode] = useState("");
  const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [redeeming, setRedeeming] = useState(false);

  async function verifyTicket() {
    if (!ticketCode.trim()) {
      alert("Veuillez entrer un code ticket");
      return;
    }

    setLoading(true);
    setTicketInfo(null);

    try {
      const res = await fetch(`/api/concours/ticket?ticketCode=${ticketCode.trim()}`);
      const data = await res.json();
      setTicketInfo(data);
    } catch (error) {
      console.error("Erreur vérification:", error);
      setTicketInfo({
        valid: false,
        message: "Erreur de connexion",
      });
    } finally {
      setLoading(false);
    }
  }

  async function redeemTicket() {
    if (!ticketInfo?.ticket) return;

    if (!confirm(`Confirmer la remise du lot : ${getPrizeLabel(ticketInfo.ticket.prizeType)} ?`)) {
      return;
    }

    setRedeeming(true);

    try {
      const res = await fetch("/api/concours/ticket", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketCode: ticketInfo.ticket.ticketCode,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Lot remis avec succès !");
        setTicketCode("");
        setTicketInfo(null);
      } else {
        alert(data.message || "Erreur lors de la réclamation");
      }
    } catch (error) {
      console.error("Erreur réclamation:", error);
      alert("Erreur de connexion");
    } finally {
      setRedeeming(false);
    }
  }

  function getPrizeLabel(prizeType?: string) {
    if (!prizeType) return "";
    const labels: Record<string, string> = {
      SMOOTHIE: "🥤 Smoothie",
      GAUFRE: "🧇 Gaufre",
      BON_PARTENAIRE: "🎟️ Bon partenaire",
    };
    return labels[prizeType] || prizeType;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-amber-500 to-red-600 bg-clip-text text-transparent">
              ✅ Vérification Tickets
            </h1>
            <p className="text-gray-600">Vérifier et valider les tickets gagnants</p>
          </div>
        </div>

        {/* Scanner Input */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ticket-code">Code Ticket (BUT-XXXXXX)</Label>
                <Input
                  id="ticket-code"
                  type="text"
                  value={ticketCode}
                  onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === "Enter" && verifyTicket()}
                  placeholder="BUT-ABC123"
                  className="text-lg font-mono"
                  autoFocus
                />
              </div>
              <Button
                onClick={verifyTicket}
                disabled={loading || !ticketCode.trim()}
                className="w-full"
              >
                {loading ? "Vérification..." : "Vérifier"}
              </Button>
              <p className="text-xs text-muted-foreground">
                💡 Scannez ou saisissez le code du ticket client
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Ticket Info */}
        {ticketInfo && (
          <Card
            className={`border-0 ${
              ticketInfo.valid
                ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white"
                : "bg-gradient-to-br from-red-500 to-pink-600 text-white"
            }`}
          >
            <CardContent className="pt-8">
            {ticketInfo.valid && ticketInfo.ticket ? (
              <>
                {/* Valid Ticket */}
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-3xl font-bold mb-2">Ticket Gagnant !</h2>
                  <p className="text-lg opacity-90">{ticketInfo.message}</p>
                </div>

                {/* Ticket Details */}
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="opacity-75 mb-1">Code</p>
                      <p className="font-bold text-lg font-mono">
                        {ticketInfo.ticket.ticketCode}
                      </p>
                    </div>
                    <div>
                      <p className="opacity-75 mb-1">Joueur</p>
                      <p className="font-bold">{ticketInfo.ticket.playerName}</p>
                      <p className="text-sm opacity-90">{ticketInfo.ticket.teamName}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="opacity-75 mb-1">Match</p>
                      <p className="font-semibold">{ticketInfo.ticket.matchInfo}</p>
                    </div>
                  </div>
                </div>

                {/* Prize Info */}
                <div className="bg-white rounded-xl p-6 text-gray-800 mb-6">
                  <p className="text-sm text-gray-600 mb-2">Lot à remettre</p>
                  <p className="text-3xl font-bold text-orange-600 mb-2">
                    {getPrizeLabel(ticketInfo.ticket.prizeType)}
                  </p>
                  {ticketInfo.ticket.prizeValue && (
                    <p className="text-gray-600">
                      Valeur : {ticketInfo.ticket.prizeValue} MAD
                    </p>
                  )}
                </div>

                {/* Action Button */}
                {!ticketInfo.ticket.isRedeemed && (
                  <Button
                    onClick={redeemTicket}
                    disabled={redeeming}
                    className="w-full bg-white text-green-600 hover:bg-gray-50 py-6 text-lg"
                    size="lg"
                  >
                    {redeeming ? "En cours..." : "✅ Confirmer la remise du lot"}
                  </Button>
                )}

                {ticketInfo.ticket.isRedeemed && (
                  <Alert className="bg-white bg-opacity-20 backdrop-blur-sm border-0 text-white">
                    <AlertDescription className="text-center font-semibold">
                      ✅ Lot déjà réclamé
                    </AlertDescription>
                  </Alert>
                )}
              </>
            ) : (
              <>
                {/* Invalid Ticket */}
                <div className="text-center">
                  <div className="text-6xl mb-4">❌</div>
                  <h2 className="text-3xl font-bold mb-2">Ticket Invalide</h2>
                  <p className="text-lg opacity-90">{ticketInfo.message}</p>
                </div>
              </>
            )}
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Alert className="border-blue-200 bg-blue-50">
          <AlertDescription className="text-blue-900">
            <h3 className="font-bold mb-3">📝 Instructions</h3>
            <ol className="text-sm space-y-2 list-decimal list-inside">
              <li>Le client présente son ticket avec le code BUT-XXXXXX</li>
              <li>Scannez ou saisissez le code dans le champ ci-dessus</li>
              <li>Si le ticket est gagnant, vérifiez le lot à remettre</li>
              <li>Remettez le lot au client</li>
              <li>Cliquez sur &quot;Confirmer la remise du lot&quot;</li>
              <li>Le ticket est automatiquement marqué comme utilisé</li>
            </ol>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
