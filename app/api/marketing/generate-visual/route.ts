import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { after } from "next/server";
import { auth } from "@/lib/auth";
import { isUserAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { renderPostVisual } from "@/lib/marketing/remotion-renderer";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminCheck = await isUserAdmin(session.user.id);
    if (!adminCheck) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { postId } = body as { postId: string };

    if (!postId) {
      return NextResponse.json({ error: "postId required" }, { status: 400 });
    }

    // Set status to rendering immediately
    await prisma.socialPost.update({
      where: { id: postId },
      data: { status: "rendering", renderError: null },
    });

    // Fire render in background after response is sent
    after(async () => {
      await renderPostVisual(postId).catch((err) => {
        console.error(`Background render failed for post ${postId}:`, err);
      });
    });

    return NextResponse.json({ status: "rendering" });
  } catch (error) {
    console.error("generate-visual error:", error);
    return NextResponse.json(
      { error: "Failed to start render" },
      { status: 500 }
    );
  }
}
