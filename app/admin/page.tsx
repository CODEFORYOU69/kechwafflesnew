"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  matches: {
    total: number;
    finished: number;
    upcoming: number;
    today: number;
  };
  users: {
    total: number;
    withPronostics: number;
    withTickets: number;
  };
  pronostics: {
    total: number;
    exactScores: number;
    correctWinners: number;
  };
  tickets: {
    total: number;
    winners: number;
    redeemed: number;
    pending: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-amber-500 to-red-600 bg-clip-text text-transparent mb-2">
            Dashboard Admin
          </h1>
          <p className="text-gray-600">Tableau de bord des concours CAN 2025 - Kech Waffles</p>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/admin/matches">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-green-200 hover:border-green-400">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Gestion des Matchs</h3>
                    <p className="text-sm text-gray-600">Saisir les résultats</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/buteurs">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-amber-200 hover:border-amber-400">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Buteurs du Jour</h3>
                    <p className="text-sm text-gray-600">Sélectionner les joueurs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/matchs-resultats">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-green-200 hover:border-green-400">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Résultats & Buteurs</h3>
                    <p className="text-sm text-gray-600">Marquer les buteurs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/loyverse">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-blue-200 hover:border-blue-400">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Loyverse</h3>
                    <p className="text-sm text-gray-600">Configuration POS</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/users">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-red-200 hover:border-red-400">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Utilisateurs</h3>
                    <p className="text-sm text-gray-600">Voir les participants</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/partners">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-purple-200 hover:border-purple-400">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Partenaires</h3>
                    <p className="text-sm text-gray-600">Gérer les commerces</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/qr-code">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-orange-200 hover:border-orange-400">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">QR Codes</h3>
                    <p className="text-sm text-gray-600">Générer et gérer les QR</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/verify-ticket">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-teal-200 hover:border-teal-400">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-teal-100 rounded-lg">
                    <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Vérifier Tickets</h3>
                    <p className="text-sm text-gray-600">Valider les gagnants</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Matchs */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Matchs</CardTitle>
                <CardDescription>État des matchs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total</span>
                    <span className="font-semibold">{stats.matches.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Terminés</span>
                    <span className="font-semibold text-green-600">{stats.matches.finished}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">À venir</span>
                    <span className="font-semibold text-blue-600">{stats.matches.upcoming}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Aujourd&apos;hui</span>
                    <span className="font-semibold text-amber-600">{stats.matches.today}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Utilisateurs */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Participants</CardTitle>
                <CardDescription>Utilisateurs inscrits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total</span>
                    <span className="font-semibold">{stats.users.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avec pronostics</span>
                    <span className="font-semibold text-green-600">{stats.users.withPronostics}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avec tickets</span>
                    <span className="font-semibold text-blue-600">{stats.users.withTickets}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pronostics */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Pronostics</CardTitle>
                <CardDescription>Concours 1</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total</span>
                    <span className="font-semibold">{stats.pronostics.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Scores exacts</span>
                    <span className="font-semibold text-green-600">{stats.pronostics.exactScores}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Bons vainqueurs</span>
                    <span className="font-semibold text-blue-600">{stats.pronostics.correctWinners}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Taux de réussite</span>
                    <span className="font-semibold text-amber-600">
                      {stats.pronostics.total > 0
                        ? Math.round((stats.pronostics.correctWinners / stats.pronostics.total) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tickets Buteur */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Tickets Buteur</CardTitle>
                <CardDescription>Concours 3</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total</span>
                    <span className="font-semibold">{stats.tickets.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Gagnants</span>
                    <span className="font-semibold text-green-600">{stats.tickets.winners}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Réclamés</span>
                    <span className="font-semibold text-blue-600">{stats.tickets.redeemed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">En attente</span>
                    <span className="font-semibold text-amber-600">{stats.tickets.pending}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Activité récente */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
            <CardDescription>Tâches administratives courantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="justify-start h-auto py-4"
                asChild
              >
                <Link href="/admin/matches">
                  <div className="text-left">
                    <div className="font-semibold mb-1">Saisir un résultat</div>
                    <div className="text-xs text-gray-500">Entrer le score d&apos;un match terminé</div>
                  </div>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto py-4"
                asChild
              >
                <Link href="/admin/buteurs">
                  <div className="text-left">
                    <div className="font-semibold mb-1">Sélectionner buteurs</div>
                    <div className="text-xs text-gray-500">Choisir les joueurs du jour</div>
                  </div>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto py-4"
                asChild
              >
                <Link href="/admin/rewards">
                  <div className="text-left">
                    <div className="font-semibold mb-1">Gérer récompenses</div>
                    <div className="text-xs text-gray-500">Valider les gains</div>
                  </div>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto py-4"
                asChild
              >
                <Link href="/admin/qr-code">
                  <div className="text-left">
                    <div className="font-semibold mb-1">Générer QR Codes</div>
                    <div className="text-xs text-gray-500">Inscription et QR quotidiens</div>
                  </div>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto py-4"
                asChild
              >
                <Link href="/admin/verify-ticket">
                  <div className="text-left">
                    <div className="font-semibold mb-1">Vérifier un ticket</div>
                    <div className="text-xs text-gray-500">Valider les tickets gagnants</div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
