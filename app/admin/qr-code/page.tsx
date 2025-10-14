"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Download, Printer, RefreshCw } from "lucide-react";

type QRCode = {
  id: string;
  qrCode: string;
  qrCodeUrl: string;
  validDate: string;
  scanCount: number;
  isActive: boolean;
};

export default function AdminQRCodePage() {
  const [currentQR, setCurrentQR] = useState<QRCode | null>(null);
  const [generating, setGenerating] = useState(false);
  const [history, setHistory] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentQR();
    loadHistory();
  }, []);

  async function loadCurrentQR() {
    try {
      const res = await fetch("/api/admin/qr-code/current");
      const data = await res.json();
      if (data.success && data.qrCode) {
        setCurrentQR(data.qrCode);
      }
    } catch (error) {
      console.error("Erreur chargement QR:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadHistory() {
    try {
      const res = await fetch("/api/admin/qr-code/history");
      const data = await res.json();
      if (data.success) {
        setHistory(data.history);
      }
    } catch (error) {
      console.error("Erreur chargement historique:", error);
    }
  }

  async function generateNewQR() {
    if (!confirm("Générer un nouveau QR code pour aujourd&apos;hui ?")) return;

    setGenerating(true);
    try {
      const res = await fetch("/api/admin/qr-code/generate", {
        method: "POST",
      });
      const data = await res.json();

      if (data.success) {
        setCurrentQR(data.qrCode);
        await loadHistory();
        alert("QR code généré avec succès !");
      } else {
        alert(data.message || "Erreur lors de la génération");
      }
    } catch (error) {
      console.error("Erreur génération QR:", error);
      alert("Erreur de connexion");
    } finally {
      setGenerating(false);
    }
  }

  function downloadQR() {
    if (!currentQR) return;

    const link = document.createElement("a");
    link.href = currentQR.qrCodeUrl;
    link.download = `QR-${currentQR.validDate}.png`;
    link.click();
  }

  function printQR() {
    if (!currentQR) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code du Jour - ${new Date(currentQR.validDate).toLocaleDateString("fr-FR")}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              font-family: Arial, sans-serif;
            }
            h1 {
              color: #f97316;
              margin-bottom: 20px;
            }
            img {
              width: 400px;
              height: 400px;
            }
            p {
              margin-top: 20px;
              font-size: 18px;
              color: #666;
            }
            @media print {
              body { padding: 40px; }
            }
          </style>
        </head>
        <body>
          <h1>🏆 Concours CAN 2025</h1>
          <h2>Kech Waffles Marrakech</h2>
          <img src="${currentQR.qrCodeUrl}" alt="QR Code" />
          <p><strong>Scannez ce QR code pour accéder aux pronostics !</strong></p>
          <p>Valable le ${new Date(currentQR.validDate).toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}</p>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-16 w-16 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">🔲 QR Code Journalier</CardTitle>
            <CardDescription>Générer et gérer le QR code du jour</CardDescription>
          </CardHeader>
        </Card>

        {/* Current QR */}
        {currentQR ? (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">QR Code Actif</CardTitle>
                  <CardDescription>
                    Valable le{" "}
                    {new Date(currentQR.validDate).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  Actif - {currentQR.scanCount} scans
                </Badge>
              </div>
            </CardHeader>

            <CardContent>

              <div className="grid md:grid-cols-2 gap-8">
                {/* QR Code Display */}
                <div className="text-center">
                  <Card className="bg-muted inline-block">
                    <CardContent className="pt-6">
                      <Image
                        src={currentQR.qrCodeUrl}
                        alt="QR Code"
                        width={256}
                        height={256}
                        className="w-64 h-64 mx-auto"
                      />
                    </CardContent>
                  </Card>
                  <Badge variant="outline" className="font-mono mt-4">
                    {currentQR.qrCode}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-4">
                  <Button onClick={downloadQR} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger PNG
                  </Button>

                  <Button onClick={printQR} variant="outline" className="w-full">
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimer
                  </Button>

                  <Button
                    onClick={generateNewQR}
                    disabled={generating}
                    variant="secondary"
                    className="w-full"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Régénérer
                      </>
                    )}
                  </Button>

                  {/* Info Box */}
                  <Alert className="mt-4 border-blue-200 bg-blue-50">
                    <AlertDescription className="text-blue-900">
                      <h4 className="font-semibold mb-2">💡 Instructions</h4>
                      <ol className="text-sm space-y-1 list-decimal list-inside">
                        <li>Téléchargez ou imprimez le QR code</li>
                        <li>Affichez-le en vitrine et au comptoir</li>
                        <li>Les clients scannent pour accéder aux pronostics</li>
                        <li>Un nouveau QR est généré chaque jour à minuit</li>
                      </ol>
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardContent className="pt-12 pb-12 text-center">
              <span className="text-6xl mb-4 block">📱</span>
              <CardTitle className="text-2xl mb-2">Aucun QR Code Actif</CardTitle>
              <CardDescription className="mb-6">
                Générez le QR code du jour pour permettre aux clients d&apos;accéder aux pronostics
              </CardDescription>
              <Button
                onClick={generateNewQR}
                disabled={generating}
              >
                {generating ? "Génération..." : "Générer le QR du jour"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">📅 Historique</CardTitle>
          </CardHeader>

          <CardContent>
            {history.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Aucun historique</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.slice(0, 9).map((qr) => (
                  <Card
                    key={qr.id}
                    className={qr.isActive ? "border-green-300 bg-green-50" : ""}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold">
                          {new Date(qr.validDate).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                        {qr.isActive && (
                          <Badge className="bg-green-200 text-green-800">
                            Actif
                          </Badge>
                        )}
                      </div>
                      <Image
                        src={qr.qrCodeUrl}
                        alt="QR Code"
                        width={200}
                        height={128}
                        className="w-full h-32 object-contain mb-2"
                      />
                      <p className="text-xs text-muted-foreground text-center">
                        {qr.scanCount} scan{qr.scanCount > 1 ? "s" : ""}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
