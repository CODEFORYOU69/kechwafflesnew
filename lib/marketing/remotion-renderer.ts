import path from "path";
import fs from "fs";
import { prisma } from "@/lib/prisma";

const RENDERS_DIR = path.join(process.cwd(), "public", "renders");

// Module-level bundle path cache — bundle() runs once per server process.
// CRITICAL: @remotion/bundler cannot be used inside Next.js API routes
// (webpack-in-webpack conflict), so we lazy-import it here at module level.
let bundlePathCache: string | null = null;
let bundleInProgress: Promise<string> | null = null;

async function getBundlePath(): Promise<string> {
  if (bundlePathCache) return bundlePathCache;
  if (bundleInProgress) return bundleInProgress;

  bundleInProgress = (async () => {
    // Dynamic import avoids Next.js bundling @remotion/bundler at build time
    const { bundle } = await import("@remotion/bundler");
    const entryPoint = path.join(process.cwd(), "remotion", "src", "index.ts");
    const bundled = await bundle({
      entryPoint,
      webpackOverride: (config) => config,
    });
    bundlePathCache = bundled;
    bundleInProgress = null;
    return bundled;
  })();

  return bundleInProgress;
}

function buildInputProps(post: {
  product: string | null;
  title: string;
  caption: string;
  hashtags: string[];
  visualBrief: string;
}) {
  return {
    productName: post.product ?? post.title,
    caption: post.caption,
    hashtags: post.hashtags,
    visualBrief: post.visualBrief,
    title: post.title,
    subtitle: post.visualBrief.slice(0, 60),
    moroccanIngredient: post.product ?? "",
    offerText: post.title,
  };
}

export async function renderPostVisual(postId: string): Promise<string> {
  const post = await prisma.socialPost.findUniqueOrThrow({ where: { id: postId } });

  if (!fs.existsSync(RENDERS_DIR)) {
    fs.mkdirSync(RENDERS_DIR, { recursive: true });
  }

  try {
    const { selectComposition, renderMedia, renderStill } = await import(
      "@remotion/renderer"
    );

    const serveUrl = await getBundlePath();
    const inputProps = buildInputProps(post);

    const composition = await selectComposition({
      serveUrl,
      id: post.remotionTemplate,
      inputProps,
    });

    const isVideo = post.postType === "reel";
    const ext = isVideo ? "mp4" : "png";
    const outputFile = path.join(RENDERS_DIR, `${postId}.${ext}`);

    if (isVideo) {
      await renderMedia({
        composition,
        serveUrl,
        codec: "h264",
        outputLocation: outputFile,
        inputProps,
      });
    } else {
      await renderStill({
        composition,
        serveUrl,
        output: outputFile,
        inputProps,
        frame: 120,
      });
    }

    const publicUrl = `/renders/${postId}.${ext}`;

    await prisma.socialPost.update({
      where: { id: postId },
      data: { status: "ready", mediaUrl: publicUrl, renderError: null },
    });

    return publicUrl;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await prisma.socialPost.update({
      where: { id: postId },
      data: { status: "draft", renderError: message },
    });
    throw error;
  }
}
