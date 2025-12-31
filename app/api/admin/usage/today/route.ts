import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const today = new Date().toISOString().slice(0, 10);

  // total
  const { data: all } = await supabase
    .from("usage_logs")
    .select("count")
    .eq("date", today);

  const total = (all ?? []).reduce((s, r) => s + r.count, 0);

  // guests
  const { data: guests } = await supabase
    .from("usage_logs")
    .select("count")
    .eq("date", today)
    .is("user_id", null);

  const guestTotal = (guests ?? []).reduce((s, r) => s + r.count, 0);

  // logged-in (free+pro)
  const { data: users } = await supabase
    .from("usage_logs")
    .select("count")
    .eq("date", today)
    .not("user_id", "is", null);

  const userTotal = (users ?? []).reduce((s, r) => s + r.count, 0);

  return NextResponse.json({
    today,
    total,
    guestTotal,
    userTotal,
  });
}
