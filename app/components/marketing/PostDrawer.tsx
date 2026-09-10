"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { Post } from "./PostsTable";

type Props = {
  post: Post | null;
  open: boolean;
  onClose: () => void;
  onPostUpdated: (post: Post) => void;
};

export function PostDrawer({ post, open, onClose, onPostUpdated }: Props) {
  const [updatingStatus, setUpdatingStatus] = useState(false);

  async function handleStatusChange(newStatus: string) {
    if (!post) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/marketing/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Erreur mise à jour");
      const updated = await res.json();
      onPostUpdated(updated);
      toast.success(`Statut mis à jour : ${newStatus}`);
    } catch {
      toast.error("Impossible de mettre à jour le statut");
    } finally {
      setUpdatingStatus(false);
    }
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copié !`);
    });
  }

  if (!post) return null;

  const isVideo = post.postType === "reel";
  const mediaExt = isVideo ? "mp4" : "png";

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-[560px] sm:w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-lg font-bold pr-8">{post.title}</SheetTitle>
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="outline">{post.postType}</Badge>
            {post.platform.map((p) => (
              <Badge key={p} variant="secondary">{p}</Badge>
            ))}
            <Badge variant="outline">
              {new Date(post.scheduledAt).toLocaleDateString("fr-FR")}
            </Badge>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Caption */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                Caption
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(post.caption, "Caption")}
              >
                📋 Copier
              </Button>
            </div>
            <p className="text-sm leading-relaxed bg-muted rounded-lg p-3 whitespace-pre-wrap">
              {post.caption}
            </p>
          </section>

          <Separator />

          {/* Hashtags */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                Hashtags
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(post.hashtags.join(" "), "Hashtags")}
              >
                📋 Tout copier
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {post.hashtags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => copyToClipboard(tag, tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </section>

          <Separator />

          {/* Visual */}
          <section>
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
              Visuel — {post.remotionTemplate}
            </h3>

            {post.status === "ready" && post.mediaUrl ? (
              <div className="space-y-3">
                {isVideo ? (
                  <video
                    src={post.mediaUrl}
                    controls
                    className="w-full rounded-lg max-h-[400px]"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.mediaUrl}
                    alt={post.title}
                    className="w-full rounded-lg"
                  />
                )}
                <a
                  href={post.mediaUrl}
                  download={`${post.id}.${mediaExt}`}
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  ⬇️ Télécharger le visuel
                </a>
              </div>
            ) : post.status === "rendering" ? (
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg text-blue-700">
                <span className="animate-spin text-xl">⏳</span>
                <span className="text-sm">Rendu en cours... (peut prendre 30-60s)</span>
              </div>
            ) : post.renderError ? (
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-700 font-medium">Erreur de rendu</p>
                <p className="text-xs text-red-500 mt-1 font-mono">{post.renderError}</p>
              </div>
            ) : (
              <div className="p-4 bg-muted rounded-lg text-center text-muted-foreground text-sm">
                Aucun visuel généré — cliquez sur 🎬 Générer visuel dans le tableau
              </div>
            )}
          </section>

          <Separator />

          {/* Status */}
          <section>
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-2">
              Statut
            </h3>
            <Select
              value={post.status}
              onValueChange={handleStatusChange}
              disabled={updatingStatus}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="ready">Prêt</SelectItem>
                <SelectItem value="published">Publié</SelectItem>
              </SelectContent>
            </Select>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
