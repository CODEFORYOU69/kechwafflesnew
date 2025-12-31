"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Printer, RefreshCw, Volume2, VolumeX } from "lucide-react";

type PendingTicket = {
  ticketCode: string;
  playerName: string;
  playerNumber: number | null;
  teamName: string;
  teamFlag: string;
  matchHome: string;
  matchAway: string;
  matchHomeFlag: string;
  matchAwayFlag: string;
  matchDate: string;
  createdAt: string;
};

export default function PrintTicketsPage() {
  const [tickets, setTickets] = useState<PendingTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoMode, setAutoMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [printing, setPrinting] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const printedCodesRef = useRef<Set<string>>(new Set());

  const printTicket = useCallback((code: string) => {
    setPrinting(code);

    // Ouvrir la page d'impression dans une nouvelle fenêtre
    window.open(
      `/admin/print-ticket/${code}`,
      "_blank",
      "width=400,height=600"
    );

    // Marquer comme imprimé localement
    printedCodesRef.current.add(code);

    // Attendre un peu puis rafraîchir
    setTimeout(() => {
      setPrinting(null);
    }, 2000);
  }, []);

  const fetchTickets = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/print-ticket/pending");
      const data = await res.json();
      if (data.success) {
        const newTickets = data.tickets as PendingTicket[];

        // Vérifier s'il y a de nouveaux tickets
        const newCodes = newTickets
          .map((t) => t.ticketCode)
          .filter((code) => !printedCodesRef.current.has(code));

        if (newCodes.length > 0 && soundEnabled && audioRef.current) {
          audioRef.current.play().catch(() => {});
        }

        setTickets(newTickets);
        setLastCheck(new Date());

        // Auto-impression si activé
        if (autoMode && newCodes.length > 0) {
          for (const code of newCodes) {
            printTicket(code);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  }, [autoMode, soundEnabled, printTicket]);

  // Polling toutes les 5 secondes
  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 5000);
    return () => clearInterval(interval);
  }, [fetchTickets]);

  const printAllPending = () => {
    for (const ticket of tickets) {
      printTicket(ticket.ticketCode);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      {/* Audio notification */}
      <audio ref={audioRef} src="/sounds/notification.mp3" preload="auto" />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-amber-500 to-red-600 bg-clip-text text-transparent">
                🖨️ Impression Tickets Buteur
              </h1>
              <p className="text-gray-600">
                {lastCheck
                  ? `Dernière vérification: ${lastCheck.toLocaleTimeString("fr-FR")}`
                  : "Chargement..."}
              </p>
            </div>
          </div>
          <Button onClick={fetchTickets} variant="outline" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                {/* Auto-print toggle */}
                <div className="flex items-center gap-2">
                  <Switch
                    checked={autoMode}
                    onCheckedChange={setAutoMode}
                    id="auto-mode"
                  />
                  <label htmlFor="auto-mode" className="text-sm font-medium">
                    Impression automatique
                  </label>
                </div>

                {/* Sound toggle */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                  >
                    {soundEnabled ? (
                      <Volume2 className="h-4 w-4" />
                    ) : (
                      <VolumeX className="h-4 w-4" />
                    )}
                  </Button>
                  <span className="text-sm text-gray-600">
                    {soundEnabled ? "Son activé" : "Son désactivé"}
                  </span>
                </div>
              </div>

              {tickets.length > 0 && (
                <Button onClick={printAllPending} className="bg-green-600 hover:bg-green-700">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimer tous ({tickets.length})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Auto-mode alert */}
        {autoMode && (
          <Alert className="mb-6 border-green-300 bg-green-50">
            <AlertDescription className="text-green-800">
              <strong>Mode automatique activé</strong> - Les nouveaux tickets seront
              imprimés automatiquement dès leur création.
            </AlertDescription>
          </Alert>
        )}

        {/* Tickets list */}
        {tickets.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <span className="text-6xl mb-4 block">✅</span>
              <p className="text-xl font-semibold text-gray-700">
                Aucun ticket en attente
              </p>
              <p className="text-gray-500 mt-2">
                Les nouveaux tickets apparaîtront ici automatiquement
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Card
                key={ticket.ticketCode}
                className={printing === ticket.ticketCode ? "border-green-500 bg-green-50" : ""}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-mono">
                      {ticket.ticketCode}
                    </CardTitle>
                    <Badge variant="outline">
                      {new Date(ticket.createdAt).toLocaleTimeString("fr-FR")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Match info */}
                      <div className="flex items-center gap-2">
                        <Image
                          src={ticket.matchHomeFlag}
                          alt={ticket.matchHome}
                          width={24}
                          height={18}
                          className="rounded"
                        />
                        <span className="text-sm">{ticket.matchHome}</span>
                        <span className="text-gray-400">vs</span>
                        <span className="text-sm">{ticket.matchAway}</span>
                        <Image
                          src={ticket.matchAwayFlag}
                          alt={ticket.matchAway}
                          width={24}
                          height={18}
                          className="rounded"
                        />
                      </div>

                      {/* Player info */}
                      <div className="flex items-center gap-2 border-l pl-4">
                        <Image
                          src={ticket.teamFlag}
                          alt={ticket.teamName}
                          width={24}
                          height={18}
                          className="rounded"
                        />
                        <span className="font-semibold">
                          {ticket.playerNumber && `#${ticket.playerNumber} `}
                          {ticket.playerName}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => printTicket(ticket.ticketCode)}
                      disabled={printing === ticket.ticketCode}
                      size="sm"
                    >
                      {printing === ticket.ticketCode ? (
                        "Impression..."
                      ) : (
                        <>
                          <Printer className="h-4 w-4 mr-1" />
                          Imprimer
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Instructions */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-bold text-blue-800 mb-2">💡 Comment ça marche ?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Les tickets apparaissent ici dès qu&apos;un client achète un produit</li>
              <li>• Activez le mode automatique pour imprimer sans intervention</li>
              <li>• Chaque ticket ne s&apos;imprime qu&apos;une seule fois</li>
              <li>• La page se rafraîchit toutes les 5 secondes</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
