import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 🔒 server-only
);

// limits
const LIMITS = {
  GUEST: 10,
  FREE: 50,
};

export async function POST(req: NextRequest) {
  const today = new Date().toISOString().slice(0, 10);

  // 🔹 IP (local me ::1 aayega – ok hai)
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ??
    req.headers.get("x-real-ip") ??
    "::1";

  // 🔹 Auth (optional)
  const authHeader = req.headers.get("authorization");
  let userId: string | null = null;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabase.auth.getUser(token);
    userId = data.user?.id ?? null;
  }

  /* =========================
     PRO CHECK (unlimited)
  ========================= */
  if (userId) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_pro")
      .eq("id", userId)
      .single();

    if (profile?.is_pro) {
      return NextResponse.json({ allowed: true, plan: "pro" });
    }
  }

  /* =========================
     GUEST USER (IP based)
  ========================= */
  if (!userId) {
    const { data } = await supabase
      .from("usage_logs")
      .select("count")
      .eq("ip", ip)
      .eq("date", today)
      .single();

    const count = data?.count ?? 0;

    if (count >= LIMITS.GUEST) {
      return NextResponse.json(
        { allowed: false, limit: LIMITS.GUEST, plan: "guest" },
        { status: 429 }
      );
    }

    await supabase.from("usage_logs").upsert(
      {
        ip,
        date: today,
        count: count + 1,
      },
      { onConflict: "ip,date" }
    );

    return NextResponse.json({
      allowed: true,
      plan: "guest",
      used: count + 1,
      limit: LIMITS.GUEST,
    });
  }

  /* =========================
     LOGGED-IN FREE USER
  ========================= */
  const { data } = await supabase
    .from("usage_logs")
    .select("count")
    .eq("user_id", userId)
    .eq("date", today)
    .single();

  const count = data?.count ?? 0;

  if (count >= LIMITS.FREE) {
    return NextResponse.json(
      { allowed: false, limit: LIMITS.FREE, plan: "free" },
      { status: 429 }
    );
  }

  await supabase.from("usage_logs").upsert(
    {
      user_id: userId,
      date: today,
      count: count + 1,
    },
    { onConflict: "user_id,date" }
  );

  return NextResponse.json({
    allowed: true,
    plan: "free",
    used: count + 1,
    limit: LIMITS.FREE,
  });
}
