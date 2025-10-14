"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, Trophy } from "lucide-react";
import { storeEncryptedQRCode, retrieveEncryptedQRCode } from "@/lib/crypto/qr-crypto";

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();

  const [status, setStatus] = useState<"loading" | "success" | "error" | "already_registered">("loading");
  const [message, setMessage] = useState("");

  const checkRegistrationAndProcess = useCallback(async () => {
    // Récupérer le code depuis l'URL ou sessionStorage crypté
    let code = searchParams.get("code");

    if (!code) {
      // Vérifier si le code est stocké en session (crypté)
      try {
        code = await retrieveEncryptedQRCode("qr_registration_code");
      } catch (error) {
        console.error("Erreur décryptage code QR:", error);
      }
    }

    if (!code) {
      setStatus("error");
      setMessage("Code QR manquant. Veuillez scanner le QR code affiché en magasin.");
      return;
    }

    try {
      // Vérifie d'abord si déjà inscrit
      const checkRes = await fetch("/api/concours/register");
      const checkData = await checkRes.json();

      if (checkData.registered) {
        setStatus("already_registered");
        setMessage("Vous êtes déjà inscrit au concours de pronostics !");
        setTimeout(() => {
          router.push("/concours/pronostics");
        }, 2000);
        return;
      }

      // Procède à l'inscription
      const res = await fetch("/api/concours/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrCode: code }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setMessage(data.message);

        // Redirige vers les pronostics après 2 secondes
        setTimeout(() => {
          router.push("/concours/pronostics");
        }, 2000);
      } else {
        setStatus("error");
        setMessage(data.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error("Erreur inscription:", error);
      setStatus("error");
      setMessage("Erreur de connexion. Veuillez réessayer.");
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (!isPending && !session) {
      // Stocker le code QR crypté en sessionStorage
      const code = searchParams.get("code");
      if (code) {
        // Stocker de manière cryptée puis rediriger
        storeEncryptedQRCode(code, "qr_registration_code").then(() => {
          router.push(`/concours/auth?redirect=${encodeURIComponent("/concours/register")}`);
        });
      } else {
        router.push(`/concours/auth?redirect=${encodeURIComponent("/concours/register")}`);
      }
      return;
    }

    if (session?.user) {
      checkRegistrationAndProcess();
    }
  }, [session, isPending, router, checkRegistrationAndProcess, searchParams]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <Loader2 className="h-16 w-16 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 bg-orange-100 rounded-full w-fit">
              <Trophy className="h-12 w-12 text-orange-600" />
            </div>
            <CardTitle className="text-3xl">Inscription au Concours</CardTitle>
            <CardDescription className="text-base">
              Concours de Pronostics CAN 2025
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {status === "loading" && (
              <div className="text-center py-12">
                <Loader2 className="h-16 w-16 animate-spin text-orange-500 mx-auto mb-4" />
                <p className="text-gray-600">Inscription en cours...</p>
              </div>
            )}

            {status === "success" && (
              <Alert className="border-green-500 bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <AlertDescription className="text-green-800">
                  <h4 className="font-bold mb-2">✅ Inscription réussie !</h4>
                  <p className="mb-3">{message}</p>
                  <p className="text-sm">
                    Vous allez être redirigé vers la page de pronostics...
                  </p>
                </AlertDescription>
              </Alert>
            )}

            {status === "already_registered" && (
              <Alert className="border-blue-500 bg-blue-50">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <h4 className="font-bold mb-2">ℹ️ Déjà inscrit</h4>
                  <p className="mb-3">{message}</p>
                  <p className="text-sm">
                    Redirection vers les pronostics...
                  </p>
                </AlertDescription>
              </Alert>
            )}

            {status === "error" && (
              <div className="space-y-4">
                <Alert className="border-red-500 bg-red-50">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <h4 className="font-bold mb-2">❌ Erreur</h4>
                    <p>{message}</p>
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Button
                    onClick={() => router.push("/concours")}
                    className="w-full"
                  >
                    Retour aux concours
                  </Button>
                  <Button
                    onClick={() => router.push("/concours/auth")}
                    variant="outline"
                    className="w-full"
                  >
                    Se connecter
                  </Button>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-3">📋 Comment participer ?</h3>
              <ol className="text-sm space-y-2 text-gray-700 list-decimal list-inside">
                <li>Scannez le QR code affiché en magasin</li>
                <li>Vous êtes inscrit pour toute la durée de la CAN</li>
                <li>Faites vos pronostics sur les matchs à venir</li>
                <li>Gagnez des points et des lots !</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <Loader2 className="h-16 w-16 animate-spin text-orange-500" />
      </div>
    }>
      <RegisterPageContent />
    </Suspense>
  );
}
