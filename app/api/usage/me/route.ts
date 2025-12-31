import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { normalizeIp } from "@/lib/normalizeIp";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const today = new Date().toISOString().slice(0, 10);

  let plan: "guest" | "free" | "pro";
  let used = 0;
  let limit: number | null;

  if (!user) {
    /* ---------- GUEST ---------- */
    plan = "guest";
    limit = 10;

    const rawIp =
      req.headers.get("x-forwarded-for")?.split(",")[0] ??
      req.headers.get("x-real-ip");

    const ip = normalizeIp(rawIp);

    if (ip) {
      const { data } = await supabase
        .from("usage_logs")
        .select("count")
        .eq("date", today)
        .eq("ip", ip)
        .single();

      used = data?.count ?? 0;
    }
  } else {
    /* ---------- AUTH USER ---------- */
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, pro_expires_at")
      .eq("id", user.id)
      .single();

    const isPro =
      profile?.plan === "pro" &&
      profile.pro_expires_at &&
      new Date(profile.pro_expires_at) > new Date();

    plan = isPro ? "pro" : "free";
    limit = isPro ? null : 50;

    const { data } = await supabase
      .from("usage_logs")
      .select("count")
      .eq("date", today)
      .eq("user_id", user.id)
      .single();

    used = data?.count ?? 0;
  }

  return NextResponse.json({
    plan,
    used,
    limit,
    resetAt: new Date(`${today}T23:59:59.999Z`).toISOString(),
  });
}
