import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { isUserAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminCheck = await isUserAdmin(session.user.id);
    if (!adminCheck) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const plans = await prisma.monthPlan.findMany({
      orderBy: [{ year: "desc" }, { month: "desc" }],
      include: { _count: { select: { posts: true } } },
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("plans list error:", error);
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}
