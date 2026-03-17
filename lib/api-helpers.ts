import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin-check";
import { NextResponse } from "next/server";

export async function requireSession(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  return { session };
}

export async function requireAdmin(request: Request) {
  const result = await requireSession(request);
  if (result instanceof NextResponse) return result;
  const adminCheck = await isAdmin(result.session.user.id);
  if (!adminCheck) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  return result;
}
