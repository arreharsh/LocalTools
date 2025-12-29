import { supabase } from "@/lib/supabase/client";

/**
 * Guest → 10/day (localStorage + daily reset)
 * Free → 50/day (server)
 * Pro → unlimited
 */

const GUEST_LIMIT = 10;
const GUEST_KEY = "guest_usage";

type GuestUsage = {
  count: number;
  date: string; // YYYY-MM-DD
};

export type UsageResult = true | "LOGIN_REQUIRED" | "FREE_LIMIT_REACHED";

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export async function checkUsage(): Promise<UsageResult> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  /* =======================
     🟢 GUEST USER (DAILY RESET)
     ======================= */
  if (!token) {
    const today = getToday();

    const raw = localStorage.getItem(GUEST_KEY);
    let usage: GuestUsage = raw
      ? JSON.parse(raw)
      : { count: 0, date: today };

    // 🔄 reset if date changed
    if (usage.date !== today) {
      usage = { count: 0, date: today };
    }

    if (usage.count < GUEST_LIMIT) {
      usage.count += 1;
      localStorage.setItem(GUEST_KEY, JSON.stringify(usage));
      return true;
    }

    return "LOGIN_REQUIRED";
  }

  /* =======================
     🟡 LOGGED-IN USER
     (Free / Pro via backend)
     ======================= */
  const res = await fetch("/api/usage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.ok) {
    return true;
  }

  if (res.status === 429) {
    const data = await res.json();

    if (data.plan === "free") {
      return "FREE_LIMIT_REACHED";
    }
  }

  throw new Error("USAGE_CHECK_FAILED");
}
