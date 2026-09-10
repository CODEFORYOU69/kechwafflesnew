import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { isUserAdmin } from "@/lib/admin";
import { generateMonthPlan } from "@/lib/marketing/gemini-planner";

export const maxDuration = 60;

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
    const { month, year } = body as { month: number; year: number };

    if (!month || !year || month < 1 || month > 12) {
      return NextResponse.json({ error: "Invalid month or year" }, { status: 400 });
    }

    const plan = await generateMonthPlan(month, year);
    return NextResponse.json(plan);
  } catch (error) {
    console.error("generate-plan error:", error);
    return NextResponse.json(
      { error: "Failed to generate plan" },
      { status: 500 }
    );
  }
}
