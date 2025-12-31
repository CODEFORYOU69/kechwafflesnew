"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

type TicketData = {
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
};

export default function PrintTicketPage() {
  const params = useParams();
  const code = params.code as string;
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (code) {
      fetchTicket();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  async function fetchTicket() {
    try {
      const res = await fetch(`/api/admin/print-ticket?code=${code}`);
      const data = await res.json();
      if (data.success) {
        setTicket(data.ticket);
        // Auto-print après chargement
        setTimeout(() => window.print(), 500);
      } else {
        setError(data.message || "Ticket non trouvé");
      }
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error || "Ticket non trouvé"}</p>
      </div>
    );
  }

  return (
    <>
      {/* Styles d'impression pour ticket thermique 80mm */}
      <style jsx global>{`
        @media print {
          @page {
            size: 80mm auto;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
        }
        body {
          font-family: 'Courier New', monospace;
        }
      `}</style>

      {/* Bouton imprimer (caché à l'impression) */}
      <div className="no-print fixed top-4 right-4 flex gap-2">
        <button
          onClick={() => window.print()}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          🖨️ Imprimer
        </button>
        <button
          onClick={() => window.close()}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          ✕ Fermer
        </button>
      </div>

      {/* Ticket imprimable */}
      <div className="w-[80mm] mx-auto bg-white p-4 text-center text-black">
        {/* Header */}
        <div className="border-b-2 border-dashed border-black pb-3 mb-3">
          <h1 className="text-xl font-bold">⚽ TICKET BUTEUR ⚽</h1>
          <p className="text-xs mt-1">Kech Waffles - CAN 2025</p>
        </div>

        {/* Code ticket */}
        <div className="bg-black text-white py-2 px-3 mb-4 rounded">
          <p className="text-lg font-bold tracking-wider">{ticket.ticketCode}</p>
        </div>

        {/* Match */}
        <div className="mb-4">
          <p className="text-xs text-gray-600 mb-2">MATCH</p>
          <div className="flex items-center justify-center gap-2">
            <div className="text-center">
              <Image
                src={ticket.matchHomeFlag}
                alt={ticket.matchHome}
                width={32}
                height={24}
                className="mx-auto mb-1"
              />
              <p className="text-xs font-semibold">{ticket.matchHome}</p>
            </div>
            <span className="text-lg font-bold mx-2">VS</span>
            <div className="text-center">
              <Image
                src={ticket.matchAwayFlag}
                alt={ticket.matchAway}
                width={32}
                height={24}
                className="mx-auto mb-1"
              />
              <p className="text-xs font-semibold">{ticket.matchAway}</p>
            </div>
          </div>
          <p className="text-xs mt-2 text-gray-600">
            {new Date(ticket.matchDate).toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Buteur */}
        <div className="border-2 border-black rounded-lg p-3 mb-4">
          <p className="text-xs text-gray-600 mb-1">VOTRE BUTEUR</p>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Image
              src={ticket.teamFlag}
              alt={ticket.teamName}
              width={40}
              height={30}
              className="rounded"
            />
          </div>
          <p className="text-lg font-bold">
            {ticket.playerNumber && `#${ticket.playerNumber} `}
            {ticket.playerName}
          </p>
          <p className="text-sm text-gray-600">{ticket.teamName}</p>
        </div>

        {/* Instructions */}
        <div className="border-t-2 border-dashed border-black pt-3 text-xs">
          <p className="font-bold mb-1">🎁 S&apos;il marque, vous gagnez !</p>
          <p className="text-gray-600 mb-2">
            Conservez ce ticket et vérifiez après le match sur :
          </p>
          <p className="font-bold">kechwaffles.com/mes-tickets</p>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-300 text-xs text-gray-500">
          <p>Merci de votre visite !</p>
          <p className="mt-1">🧇 Kech Waffles</p>
        </div>
      </div>
    </>
  );
}
