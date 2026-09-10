"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Plan = {
  id: string;
  month: number;
  year: number;
  monthContext: string | null;
  posts: unknown[];
};

type Props = {
  month: number;
  year: number;
  hasPlan: boolean;
  onPlanGenerated: (plan: Plan) => void;
};

export function GeneratePlanButton({ month, year, hasPlan, onPlanGenerated }: Props) {
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function generate() {
    setLoading(true);
    const toastId = toast.loading(`Génération du plan ${month}/${year} par l'IA...`);
    try {
      const res = await fetch("/api/marketing/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, year }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Erreur inconnue" }));
        throw new Error(err.error ?? "Erreur serveur");
      }

      const plan = await res.json();
      toast.success(`Plan généré — ${plan.posts?.length ?? 0} posts créés`, { id: toastId });
      onPlanGenerated(plan);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur de génération", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  function handleClick() {
    if (hasPlan) {
      setConfirmOpen(true);
    } else {
      generate();
    }
  }

  return (
    <>
      <Button onClick={handleClick} disabled={loading} className="gap-2">
        {loading ? (
          <>
            <span className="animate-spin">⏳</span>
            Génération en cours...
          </>
        ) : (
          <>✨ Générer le plan IA</>
        )}
      </Button>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Régénérer le plan ?</DialogTitle>
            <DialogDescription>
              Un plan existe déjà pour {month}/{year}. Cette action remplacera tous les posts
              existants. Les visuels générés seront conservés dans le dossier renders.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmOpen(false);
                generate();
              }}
            >
              Régénérer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
