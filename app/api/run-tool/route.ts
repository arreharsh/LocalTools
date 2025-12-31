import { normalizeIp } from "@/lib/normalizeIp";
import { createSupabaseServer } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id ?? null;
  const rawIp =
    req.headers.get("x-forwarded-for")?.split(",")[0] ??
    req.headers.get("x-real-ip");

  const ip = normalizeIp(rawIp);

  let plan: "guest" | "free" | "pro" = "guest";

  if (userId) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, pro_expires_at")
      .eq("id", userId)
      .single();

    if (
      profile?.plan === "pro" &&
      profile.pro_expires_at &&
      new Date(profile.pro_expires_at) > new Date()
    ) {
      plan = "pro";
    } else {
      plan = "free";
    }
  }

  const { data, error } = await supabase.rpc("check_and_increment_usage", {
    p_user_id: userId,
    p_ip: userId ? null : ip,
    p_plan: plan,
  });

  if (error) {
    return NextResponse.json(
      { allowed: false, error: error.message },
      { status: 500 }
    );
  }

  if (!data.allowed) {
    return NextResponse.json(data, { status: 429 });
  }

  return NextResponse.json(data);
}
