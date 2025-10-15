"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Loader2, ExternalLink, RefreshCw, Webhook, ArrowLeft, CreditCard } from "lucide-react";
import Link from "next/link";

type LoyverseStatus = {
  isConnected: boolean;
  storeId: string | null;
  expiresAt: string | null;
  lastSync: string | null;
  webhooksActive: boolean;
};

export default function LoyverseAdminPage() {
  const [status, setStatus] = useState<LoyverseStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settingUpWebhooks, setSettingUpWebhooks] = useState(false);
  const [syncingCards, setSyncingCards] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/loyverse/status");
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      } else {
        setError("Erreur lors de la récupération du statut");
      }
    } catch {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    window.location.href = "/api/loyverse/connect";
  };

  const handleSetupWebhooks = async () => {
    try {
      setSettingUpWebhooks(true);
      const response = await fetch("/api/loyverse/setup-webhook", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Webhooks configurés avec succès !\n${data.webhooks?.length || 0} webhooks créés.`);
        fetchStatus();
      } else {
        const data = await response.json();
        alert(`Erreur : ${data.error || "Impossible de configurer les webhooks"}`);
      }
    } catch {
      alert("Erreur lors de la configuration des webhooks");
    } finally {
      setSettingUpWebhooks(false);
    }
  };

  const handleSyncMemberCards = async () => {
    if (!confirm("Créer des cartes membres (et customers Loyverse) pour tous les utilisateurs qui n'en ont pas ?")) {
      return;
    }

    try {
      setSyncingCards(true);
      const response = await fetch("/api/admin/sync-member-cards", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        alert(
          `✅ Synchronisation terminée !\n\n` +
          `Total: ${data.stats.total}\n` +
          `Créées: ${data.stats.created}\n` +
          `Erreurs: ${data.stats.failed}\n\n` +
          (data.errors.length > 0 ? `Erreurs:\n${data.errors.join("\n")}` : "")
        );
      } else {
        const data = await response.json();
        alert(`Erreur : ${data.message || "Impossible de synchroniser"}`);
      }
    } catch {
      alert("Erreur lors de la synchronisation");
    } finally {
      setSyncingCards(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-amber-500 to-red-600 bg-clip-text text-transparent">
            Configuration Loyverse
          </h1>
          <p className="text-gray-600">Gérez la connexion avec votre système de caisse Loyverse</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Statut de Connexion */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status?.isConnected ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            Statut de la Connexion
          </CardTitle>
          <CardDescription>
            {status?.isConnected
              ? "Votre application est connectée à Loyverse"
              : "Votre application n'est pas encore connectée"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">État</span>
            {status?.isConnected ? (
              <Badge className="bg-green-600">Connecté</Badge>
            ) : (
              <Badge variant="destructive">Non connecté</Badge>
            )}
          </div>

          {status?.storeId && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Store ID</span>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                {status.storeId}
              </code>
            </div>
          )}

          {status?.expiresAt && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Token expire le</span>
              <span className="text-sm font-mono">
                {new Date(status.expiresAt).toLocaleString("fr-FR")}
              </span>
            </div>
          )}

          {status?.lastSync && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Dernière sync</span>
              <span className="text-sm font-mono">
                {new Date(status.lastSync).toLocaleString("fr-FR")}
              </span>
            </div>
          )}

          <div className="pt-4 flex gap-3">
            {!status?.isConnected ? (
              <Button
                onClick={handleConnect}
                className="bg-gradient-to-r from-green-600 via-amber-500 to-red-600"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Connecter à Loyverse
              </Button>
            ) : (
              <Button onClick={fetchStatus} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Rafraîchir
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Webhooks */}
      {status?.isConnected && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              Webhooks
            </CardTitle>
            <CardDescription>
              Configurez les webhooks pour recevoir les notifications en temps réel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">État des webhooks</span>
              {status.webhooksActive ? (
                <Badge className="bg-green-600">Actifs</Badge>
              ) : (
                <Badge variant="secondary">Non configurés</Badge>
              )}
            </div>

            <Alert>
              <AlertDescription className="text-sm">
                Les webhooks permettent de recevoir automatiquement les données
                des achats effectués en caisse. Événements surveillés :
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>receipts.update - Nouveau reçu ou reçu modifié</li>
                  <li>receipts.delete - Reçu supprimé (remboursement)</li>
                </ul>
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleSetupWebhooks}
              disabled={settingUpWebhooks}
              variant="outline"
            >
              {settingUpWebhooks ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Configuration...
                </>
              ) : (
                <>
                  <Webhook className="mr-2 h-4 w-4" />
                  Configurer les webhooks
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Synchronisation Cartes Membres */}
      {status?.isConnected && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Cartes Membres & Customers Loyverse
            </CardTitle>
            <CardDescription>
              Créer automatiquement des cartes membres et customers Loyverse pour les utilisateurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertDescription>
                Cette action va créer une carte membre (et un customer Loyverse) pour tous les utilisateurs qui n&apos;en ont pas encore.
                Les nouveaux utilisateurs reçoivent automatiquement une carte membre à l&apos;inscription.
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleSyncMemberCards}
              disabled={syncingCards}
              variant="outline"
            >
              {syncingCards ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Synchronisation...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Créer cartes pour utilisateurs existants
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Instructions de Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600">
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              1. Créer une application OAuth sur Loyverse
            </h4>
            <p>
              Rendez-vous sur{" "}
              <a
                href="https://developer.loyverse.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                https://developer.loyverse.com/
              </a>{" "}
              et créez une nouvelle application.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              2. Configurer la Redirect URI
            </h4>
            <code className="block bg-gray-100 px-3 py-2 rounded text-xs mt-1">
              {typeof window !== "undefined" &&
                `${window.location.origin}/api/loyverse/callback`}
            </code>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              3. Scopes nécessaires
            </h4>
            <p className="font-mono text-xs">
              CUSTOMERS_READ, ITEMS_READ, RECEIPTS_READ, STORES_READ, MERCHANT_READ
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              4. Variables d&apos;environnement
            </h4>
            <p>
              Ajoutez les variables <code>LOYVERSE_CLIENT_ID</code> et{" "}
              <code>LOYVERSE_CLIENT_SECRET</code> dans votre configuration Vercel.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
