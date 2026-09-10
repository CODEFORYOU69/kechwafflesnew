"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { GeneratePlanButton } from "@/app/components/marketing/GeneratePlanButton";
import { PostsTable, type Post } from "@/app/components/marketing/PostsTable";
import { PostDrawer } from "@/app/components/marketing/PostDrawer";
import { ExportButtons } from "@/app/components/marketing/ExportButtons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Plan = {
  id: string;
  month: number;
  year: number;
  monthContext: string | null;
  posts: Post[];
};

const MONTHS = [
  { value: 1, label: "Janvier" },
  { value: 2, label: "Février" },
  { value: 3, label: "Mars" },
  { value: 4, label: "Avril" },
  { value: 5, label: "Mai" },
  { value: 6, label: "Juin" },
  { value: 7, label: "Juillet" },
  { value: 8, label: "Août" },
  { value: 9, label: "Septembre" },
  { value: 10, label: "Octobre" },
  { value: 11, label: "Novembre" },
  { value: 12, label: "Décembre" },
];

const YEARS = [2025, 2026, 2027];

export default function MarketingPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [drawerPost, setDrawerPost] = useState<Post | null>(null);

  const fetchPlan = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/marketing/plans");
      if (!res.ok) return;
      const plans: Array<Plan & { _count: { posts: number } }> = await res.json();
      const found = plans.find((p) => p.month === month && p.year === year);
      if (found) {
        const detailRes = await fetch(`/api/marketing/plans/${found.id}`);
        if (detailRes.ok) {
          setPlan(await detailRes.json());
        }
      } else {
        setPlan(null);
      }
    } catch {
      // no plan found
      setPlan(null);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  async function handleRenderRequested(postId: string) {
    // Optimistically update local state
    setPlan((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        posts: prev.posts.map((p) =>
          p.id === postId ? { ...p, status: "rendering" } : p
        ),
      };
    });

    try {
      const res = await fetch("/api/marketing/generate-visual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      if (!res.ok) throw new Error("Erreur démarrage rendu");
      toast.info("Rendu démarré — mise à jour automatique dans quelques secondes");
    } catch {
      toast.error("Impossible de démarrer le rendu");
      // Revert
      setPlan((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          posts: prev.posts.map((p) =>
            p.id === postId ? { ...p, status: "draft" } : p
          ),
        };
      });
    }
  }

  function handlePostUpdated(updatedPost: Post) {
    setPlan((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        posts: prev.posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)),
      };
    });
    // Sync drawer post
    if (drawerPost?.id === updatedPost.id) {
      setDrawerPost(updatedPost);
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Marketing Kech Waffles 🧇</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Planification IA du contenu social media mensuel
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Month selector */}
          <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem key={m.value} value={String(m.value)}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Year selector */}
          <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <GeneratePlanButton
            month={month}
            year={year}
            hasPlan={!!plan}
            onPlanGenerated={(newPlan) => setPlan(newPlan as Plan)}
          />
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      )}

      {/* No plan */}
      {!loading && !plan && (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="text-5xl mb-4">🧇</div>
            <p className="text-muted-foreground">
              Aucun plan pour{" "}
              {MONTHS.find((m) => m.value === month)?.label} {year}.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Cliquez sur &quot;✨ Générer le plan IA&quot; pour créer un plan mensuel.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Plan content */}
      {!loading && plan && (
        <>
          {/* Month context */}
          {plan.monthContext && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="py-3 px-4">
                <p className="text-sm font-medium text-amber-900">
                  📅 Contexte IA —{" "}
                  <span className="font-normal">{plan.monthContext}</span>
                </p>
              </CardContent>
            </Card>
          )}

          {/* Actions bar */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {plan.posts.length} posts • Cliquez sur une ligne pour les détails
            </p>
            <ExportButtons plan={plan} />
          </div>

          {/* Posts table */}
          <PostsTable
            posts={plan.posts}
            onRenderRequested={handleRenderRequested}
            onPostClick={(post) => setDrawerPost(post)}
          />
        </>
      )}

      {/* Post drawer */}
      <PostDrawer
        post={drawerPost}
        open={!!drawerPost}
        onClose={() => setDrawerPost(null)}
        onPostUpdated={handlePostUpdated}
      />
    </div>
  );
}
