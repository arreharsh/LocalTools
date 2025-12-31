import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("usage_logs")
    .select("date, count")
    .gte("date", new Date(Date.now() - 6 * 86400000).toISOString().slice(0,10))
    .order("date", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // aggregate per day
  const map = new Map<string, number>();
  for (const r of data ?? []) {
    map.set(r.date, (map.get(r.date) ?? 0) + r.count);
  }

  const series = Array.from(map.entries()).map(([date, total]) => ({
    date,
    total,
  }));

  return NextResponse.json(series);
}
