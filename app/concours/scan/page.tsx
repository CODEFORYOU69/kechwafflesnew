"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function ScanQRPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [isFirstScan, setIsFirstScan] = useState(false);

  useEffect(() => {
    const qrCode = searchParams.get("code");

    if (!qrCode) {
      setStatus("error");
      setMessage("QR code invalide");
      return;
    }

    if (!isPending && !session) {
      router.push(`/concours/auth?redirect=/concours/scan?code=${qrCode}`);
      return;
    }

    if (session?.user) {
      handleScan(qrCode, session.user.id);
    }
  }, [searchParams, session, isPending, router]);

  async function handleScan(qrCode: string, userId: string) {
    try {
      const response = await fetch("/api/concours/scan-qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          qrCode,
          userId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        setMessage(data.message);
        setIsFirstScan(data.isFirstScan);

        setTimeout(() => {
          router.push("/concours/pronostics");
        }, 2000);
      } else {
        setStatus("error");
        setMessage(data.message || "Erreur lors du scan");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Erreur de connexion au serveur");
    }
  }

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <Loader2 className="h-16 w-16 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          {status === "loading" && (
            <div className="text-center space-y-4">
              <Loader2 className="h-16 w-16 animate-spin text-orange-500 mx-auto" />
              <CardTitle className="text-2xl">
                Vérification du QR Code
              </CardTitle>
              <CardDescription>Veuillez patienter...</CardDescription>
            </div>
          )}

          {status === "success" && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-2xl mb-2">
                  {isFirstScan ? "QR Code Scanné !" : "Déjà Scanné"}
                </CardTitle>
                <CardDescription>{message}</CardDescription>
              </div>
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="pt-4">
                  <p className="text-sm text-orange-800">
                    Redirection vers les pronostics dans quelques instants...
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {status === "error" && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-2xl mb-2">Erreur</CardTitle>
                <CardDescription>{message}</CardDescription>
              </div>
              <Button
                onClick={() => router.push("/concours")}
                className="w-full"
              >
                Retour au concours
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
