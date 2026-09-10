import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { isUserAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["draft", "rendering", "ready", "published"] as const;
type PostStatus = (typeof VALID_STATUSES)[number];

export async function PATCH(
  request: Request,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminCheck = await isUserAdmin(session.user.id);
    if (!adminCheck) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { postId } = await context.params;
    const body = await request.json();
    const { status } = body as { status: PostStatus };

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const post = await prisma.socialPost.update({
      where: { id: postId },
      data: { status },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("post update error:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}
