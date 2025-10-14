"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Download, Printer, RefreshCw, Trophy, Calendar } from "lucide-react";

type RegistrationQR = {
  id: string;
  qrCode: string;
  qrCodeUrl: string;
  scanCount: number;
  isActive: boolean;
};

type DailyQR = {
  id: string;
  qrCode: string;
  qrCodeUrl: string;
  validDate: string;
  scanCount: number;
  isActive: boolean;
};

export default function AdminQRCodePage() {
  const [registrationQR, setRegistrationQR] = useState<RegistrationQR | null>(null);
  const [dailyQR, setDailyQR] = useState<DailyQR | null>(null);
  const [dailyHistory, setDailyHistory] = useState<DailyQR[]>([]);
  const [totalRegistered, setTotalRegistered] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRegistrationQR();
    loadDailyQR();
    loadDailyHistory();
  }, []);

  async function loadRegistrationQR() {
    try {
      const res = await fetch("/api/admin/registration-qr");
      const data = await res.json();
      if (data.success && data.qrCode) {
        setRegistrationQR(data.qrCode);
        setTotalRegistered(data.totalRegistered || 0);
      }
    } catch (error) {
      console.error("Erreur chargement QR inscription:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadDailyQR() {
    try {
      const res = await fetch("/api/admin/qr-code/current");
      const data = await res.json();
      if (data.success && data.qrCode) {
        setDailyQR(data.qrCode);
      }
    } catch (error) {
      console.error("Erreur chargement QR quotidien:", error);
    }
  }

  async function loadDailyHistory() {
    try {
      const res = await fetch("/api/admin/qr-code/history");
      const data = await res.json();
      if (data.success) {
        setDailyHistory(data.history);
      }
    } catch (error) {
      console.error("Erreur chargement historique:", error);
    }
  }

  async function generateRegistrationQR() {
    if (
      !confirm(
        "Générer un nouveau QR code d'inscription ? L'ancien sera désactivé."
      )
    )
      return;

    setGenerating(true);
    try {
      const res = await fetch("/api/admin/registration-qr", {
        method: "POST",
      });
      const data = await res.json();

      if (data.success) {
        setRegistrationQR(data.qrCode);
        alert("QR code d'inscription généré avec succès !");
      } else {
        alert(data.message || "Erreur lors de la génération");
      }
    } catch (error) {
      console.error("Erreur génération QR inscription:", error);
      alert("Erreur de connexion");
    } finally {
      setGenerating(false);
    }
  }

  async function generateDailyQR() {
    if (!confirm("Générer un nouveau QR code pour aujourd'hui ?")) return;

    setGenerating(true);
    try {
      const res = await fetch("/api/admin/qr-code/generate", {
        method: "POST",
      });
      const data = await res.json();

      if (data.success) {
        setDailyQR(data.qrCode);
        await loadDailyHistory();
        alert("QR code quotidien généré avec succès !");
      } else {
        alert(data.message || "Erreur lors de la génération");
      }
    } catch (error) {
      console.error("Erreur génération QR quotidien:", error);
      alert("Erreur de connexion");
    } finally {
      setGenerating(false);
    }
  }

  function downloadQR(qrCodeUrl: string, filename: string) {
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = filename;
    link.click();
  }

  function printRegistrationQR() {
    if (!registrationQR) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code Inscription - Concours CAN 2025</title>
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
              margin-bottom: 10px;
            }
            h2 {
              color: #666;
              margin-bottom: 30px;
            }
            img {
              width: 500px;
              height: 500px;
            }
            p {
              margin-top: 20px;
              font-size: 20px;
              color: #333;
              text-align: center;
              max-width: 600px;
            }
            .subtitle {
              font-size: 18px;
              color: #666;
              margin-top: 10px;
            }
            @media print {
              body { padding: 40px; }
            }
          </style>
        </head>
        <body>
          <h1>🏆 Concours CAN 2025 - Pronostics</h1>
          <h2>Kech Waffles Marrakech</h2>
          <img src="${registrationQR.qrCodeUrl}" alt="QR Code" />
          <p><strong>Scannez ce QR code pour vous inscrire au concours de pronostics !</strong></p>
          <p class="subtitle">Valable pendant toute la durée de la CAN 2025</p>
          <p class="subtitle">Une seule inscription suffit</p>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }

  function printDailyQR() {
    if (!dailyQR) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code du Jour - ${new Date(dailyQR.validDate).toLocaleDateString("fr-FR")}</title>
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
              margin-bottom: 10px;
            }
            h2 {
              color: #666;
              margin-bottom: 30px;
            }
            img {
              width: 500px;
              height: 500px;
            }
            p {
              margin-top: 20px;
              font-size: 20px;
              color: #333;
            }
            .date {
              font-size: 18px;
              color: #666;
              margin-top: 10px;
            }
            @media print {
              body { padding: 40px; }
            }
          </style>
        </head>
        <body>
          <h1>🗓️ QR Code Quotidien - Concours 2</h1>
          <h2>Kech Waffles Marrakech</h2>
          <img src="${dailyQR.qrCodeUrl}" alt="QR Code" />
          <p><strong>Scannez ce QR code pour participer au tirage quotidien !</strong></p>
          <p class="date">Valable le ${new Date(dailyQR.validDate).toLocaleDateString("fr-FR", {
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
            <CardTitle className="text-3xl">🔲 Gestion QR Codes</CardTitle>
            <CardDescription>
              Gérer les QR codes pour les différents concours
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="registration" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="registration" className="gap-2">
              <Trophy className="h-4 w-4" />
              Concours 1 - Inscription
            </TabsTrigger>
            <TabsTrigger value="daily" className="gap-2">
              <Calendar className="h-4 w-4" />
              Concours 2 - Quotidien
            </TabsTrigger>
          </TabsList>

          {/* QR CODE D'INSCRIPTION (Concours 1) */}
          <TabsContent value="registration" className="space-y-6">
            {registrationQR ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">
                        QR Code d&apos;Inscription - Concours 1
                      </CardTitle>
                      <CardDescription>
                        Pour s&apos;inscrire aux pronostics (scan unique)
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {totalRegistered} inscrits
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
                            src={registrationQR.qrCodeUrl}
                            alt="QR Code Inscription"
                            width={300}
                            height={300}
                            className="w-72 h-72 mx-auto"
                          />
                        </CardContent>
                      </Card>
                      <Badge variant="outline" className="font-mono mt-4">
                        {registrationQR.qrCode}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-4">
                      <Button
                        onClick={() =>
                          downloadQR(
                            registrationQR.qrCodeUrl,
                            "QR-Inscription-Concours1.png"
                          )
                        }
                        className="w-full"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger PNG
                      </Button>

                      <Button
                        onClick={printRegistrationQR}
                        variant="outline"
                        className="w-full"
                      >
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimer
                      </Button>

                      <Button
                        onClick={generateRegistrationQR}
                        disabled={generating}
                        variant="destructive"
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
                            Régénérer (désactive l&apos;ancien)
                          </>
                        )}
                      </Button>

                      {/* Info Box */}
                      <Alert className="mt-4 border-blue-200 bg-blue-50">
                        <AlertDescription className="text-blue-900">
                          <h4 className="font-semibold mb-2">
                            💡 Concours 1 - Pronostics
                          </h4>
                          <ul className="text-sm space-y-1 list-disc list-inside">
                            <li>Les clients scannent <strong>UNE SEULE FOIS</strong></li>
                            <li>Accès aux pronostics pendant toute la CAN</li>
                            <li>Peuvent rejoindre en cours de compétition</li>
                            <li>Affichez ce QR en vitrine et au comptoir</li>
                          </ul>
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <span className="text-6xl mb-4 block">🏆</span>
                  <CardTitle className="text-2xl mb-2">
                    Aucun QR Code d&apos;Inscription
                  </CardTitle>
                  <CardDescription className="mb-6">
                    Générez le QR code d&apos;inscription au concours de pronostics
                  </CardDescription>
                  <Button onClick={generateRegistrationQR} disabled={generating}>
                    {generating ? "Génération..." : "Générer QR d'inscription"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* QR CODE QUOTIDIEN (Concours 2) */}
          <TabsContent value="daily" className="space-y-6">
            {dailyQR ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">
                        QR Code Quotidien - Concours 2
                      </CardTitle>
                      <CardDescription>
                        Valable le{" "}
                        {new Date(dailyQR.validDate).toLocaleDateString(
                          "fr-FR",
                          {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          }
                        )}
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {dailyQR.scanCount} scans
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
                            src={dailyQR.qrCodeUrl}
                            alt="QR Code Quotidien"
                            width={300}
                            height={300}
                            className="w-72 h-72 mx-auto"
                          />
                        </CardContent>
                      </Card>
                      <Badge variant="outline" className="font-mono mt-4">
                        {dailyQR.qrCode}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-4">
                      <Button
                        onClick={() =>
                          downloadQR(
                            dailyQR.qrCodeUrl,
                            `QR-${dailyQR.validDate}.png`
                          )
                        }
                        className="w-full"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger PNG
                      </Button>

                      <Button
                        onClick={printDailyQR}
                        variant="outline"
                        className="w-full"
                      >
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimer
                      </Button>

                      <Button
                        onClick={generateDailyQR}
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
                      <Alert className="mt-4 border-amber-200 bg-amber-50">
                        <AlertDescription className="text-amber-900">
                          <h4 className="font-semibold mb-2">
                            💡 Concours 2 - Tirage Quotidien
                          </h4>
                          <ul className="text-sm space-y-1 list-disc list-inside">
                            <li>Les clients scannent <strong>TOUS LES JOURS</strong></li>
                            <li>Participation au tirage quotidien</li>
                            <li>Nouveau QR généré chaque jour à minuit</li>
                            <li>Changez l&apos;affichage chaque matin</li>
                          </ul>
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <span className="text-6xl mb-4 block">📅</span>
                  <CardTitle className="text-2xl mb-2">
                    Aucun QR Code Actif
                  </CardTitle>
                  <CardDescription className="mb-6">
                    Générez le QR code du jour pour le tirage quotidien
                  </CardDescription>
                  <Button onClick={generateDailyQR} disabled={generating}>
                    {generating ? "Génération..." : "Générer QR du jour"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Historique QR Quotidiens */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">📅 Historique</CardTitle>
              </CardHeader>

              <CardContent>
                {dailyHistory.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Aucun historique
                  </p>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dailyHistory.slice(0, 9).map((qr) => (
                      <Card
                        key={qr.id}
                        className={
                          qr.isActive ? "border-green-300 bg-green-50" : ""
                        }
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold">
                              {new Date(qr.validDate).toLocaleDateString(
                                "fr-FR",
                                {
                                  day: "numeric",
                                  month: "short",
                                }
                              )}
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
