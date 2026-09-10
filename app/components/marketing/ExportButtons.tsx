"use client";

import { Button } from "@/components/ui/button";

type Post = {
  weekNumber: number;
  dayOfWeek: string;
  scheduledAt: string;
  theme: string;
  product: string | null;
  postType: string;
  platform: string[];
  caption: string;
  hashtags: string[];
  status: string;
};

type Plan = {
  month: number;
  year: number;
  monthContext: string | null;
  posts: Post[];
};

type Props = { plan: Plan };

function triggerDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportButtons({ plan }: Props) {
  const fileBase = `kech-waffles-${plan.year}-${String(plan.month).padStart(2, "0")}`;

  function exportCSV() {
    const headers = ["Semaine", "Jour", "Date", "Thème", "Produit", "Type", "Plateforme", "Caption", "Hashtags", "Statut"];
    const rows = plan.posts.map((p) => [
      p.weekNumber,
      p.dayOfWeek,
      new Date(p.scheduledAt).toLocaleDateString("fr-FR"),
      p.theme,
      p.product ?? "",
      p.postType,
      p.platform.join("+"),
      `"${p.caption.replace(/"/g, '""')}"`,
      p.hashtags.join(" "),
      p.status,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    triggerDownload(csv, `${fileBase}.csv`, "text/csv;charset=utf-8;");
  }

  function exportJSON() {
    const json = JSON.stringify(plan, null, 2);
    triggerDownload(json, `${fileBase}.json`, "application/json");
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={exportCSV}>
        📥 Export CSV
      </Button>
      <Button variant="outline" size="sm" onClick={exportJSON}>
        📥 Export JSON
      </Button>
    </div>
  );
}
