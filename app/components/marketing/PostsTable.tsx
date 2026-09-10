"use client";

import { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type Post = {
  id: string;
  weekNumber: number;
  dayOfWeek: string;
  scheduledAt: string;
  theme: string;
  product: string | null;
  postType: string;
  platform: string[];
  status: string;
  mediaUrl: string | null;
  renderError: string | null;
  title: string;
  caption: string;
  hashtags: string[];
  remotionTemplate: string;
};

type Props = {
  posts: Post[];
  onRenderRequested: (postId: string) => void;
  onPostClick: (post: Post) => void;
};

const THEME_COLORS: Record<string, string> = {
  product: "bg-green-100 text-green-800 border-green-200",
  behind_scenes: "bg-gray-100 text-gray-700 border-gray-200",
  moroccan_touch: "bg-amber-100 text-amber-800 border-amber-200",
  promotion: "bg-red-100 text-red-800 border-red-200",
};

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  rendering: "bg-blue-100 text-blue-700",
  ready: "bg-blue-200 text-blue-900",
  published: "bg-green-100 text-green-800",
};

function RenderingPoller({
  postId,
  onStatusUpdate,
}: {
  postId: string;
  onStatusUpdate: (postId: string, status: string, mediaUrl: string | null) => void;
}) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/marketing/visual-status/${postId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.status !== "rendering") {
          onStatusUpdate(postId, data.status, data.mediaUrl);
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      } catch {
        // Silently continue polling
      }
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [postId, onStatusUpdate]);

  return null;
}

export function PostsTable({ posts: initialPosts, onRenderRequested, onPostClick }: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  function handleStatusUpdate(postId: string, status: string, mediaUrl: string | null) {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, status, mediaUrl } : p))
    );
  }

  const renderingPosts = posts.filter((p) => p.status === "rendering");

  return (
    <>
      {renderingPosts.map((p) => (
        <RenderingPoller
          key={p.id}
          postId={p.id}
          onStatusUpdate={handleStatusUpdate}
        />
      ))}

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12">Sem.</TableHead>
              <TableHead className="w-24">Jour</TableHead>
              <TableHead className="w-28">Date</TableHead>
              <TableHead>Thème</TableHead>
              <TableHead>Produit</TableHead>
              <TableHead className="w-20">Type</TableHead>
              <TableHead className="w-28">Plateforme</TableHead>
              <TableHead className="w-28">Statut</TableHead>
              <TableHead className="w-36">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow
                key={post.id}
                className="cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => onPostClick(post)}
              >
                <TableCell className="text-muted-foreground">{post.weekNumber}</TableCell>
                <TableCell className="capitalize font-medium">{post.dayOfWeek}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(post.scheduledAt).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                      THEME_COLORS[post.theme] ?? "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {post.theme.replace("_", " ")}
                  </span>
                </TableCell>
                <TableCell className="text-sm">{post.product ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {post.postType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {post.platform.map((p) => (
                      <Badge key={p} variant="secondary" className="text-xs">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      STATUS_COLORS[post.status] ?? "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {post.status === "rendering" && (
                      <span className="animate-pulse">●</span>
                    )}
                    {post.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div
                    className="flex gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs px-2"
                      disabled={post.status === "rendering"}
                      onClick={() => onRenderRequested(post.id)}
                      title="Générer le visuel"
                    >
                      {post.status === "rendering" ? "⏳" : "🎬"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs px-2"
                      onClick={() => onPostClick(post)}
                      title="Voir les détails"
                    >
                      👁
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
