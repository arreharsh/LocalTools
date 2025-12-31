import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  const { data: freeUsers } = await supabase
    .from("profiles")
    .select("id")
    .eq("plan", "free");

  const ids = (freeUsers ?? []).map(u => u.id);
  if (ids.length) {
    await supabase.from("usage_logs").delete().in("user_id", ids);
  }
  return NextResponse.json({ success: true });
}
