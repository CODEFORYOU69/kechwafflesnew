"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Users, Trophy, Ticket, CreditCard } from "lucide-react";
import Link from "next/link";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  registeredForPronostics: boolean;
  _count: {
    pronostics: number;
    buteurTickets: number;
  };
  memberCard?: {
    cardNumber: string;
    tier: string;
    totalPoints: number;
    currentPoints: number;
  };
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Erreur chargement utilisateurs:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case "PLATINUM": return "bg-purple-100 text-purple-800";
      case "GOLD": return "bg-yellow-100 text-yellow-800";
      case "SILVER": return "bg-gray-100 text-gray-800";
      case "BRONZE": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-amber-500 to-red-600 bg-clip-text text-transparent">
              Utilisateurs
            </h1>
            <p className="text-gray-600">Liste des participants et leurs activités</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total utilisateurs</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Inscrits pronostics</p>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.registeredForPronostics).length}
                  </p>
                </div>
                <Trophy className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avec tickets</p>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u._count.buteurTickets > 0).length}
                  </p>
                </div>
                <Ticket className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cartes membres</p>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.memberCard).length}
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Participants ({filteredUsers.length})</CardTitle>
            <CardDescription>
              Liste complète des utilisateurs et leurs statistiques
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  Aucun utilisateur trouvé
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{user.name || "Sans nom"}</h3>
                          {user.role === "ADMIN" && (
                            <Badge className="bg-red-100 text-red-800">Admin</Badge>
                          )}
                          {user.registeredForPronostics && (
                            <Badge className="bg-green-100 text-green-800">
                              <Trophy className="h-3 w-3 mr-1" />
                              Pronostics
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-3">{user.email}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Pronostics</p>
                            <p className="font-semibold">{user._count.pronostics}</p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">Tickets buteur</p>
                            <p className="font-semibold">{user._count.buteurTickets}</p>
                          </div>

                          {user.memberCard && (
                            <>
                              <div>
                                <p className="text-xs text-gray-500">Carte membre</p>
                                <Badge className={getTierColor(user.memberCard.tier)}>
                                  {user.memberCard.tier}
                                </Badge>
                              </div>

                              <div>
                                <p className="text-xs text-gray-500">Points fidélité</p>
                                <p className="font-semibold">{user.memberCard.currentPoints} pts</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="text-right text-xs text-gray-500">
                        Inscrit le {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
