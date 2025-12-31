"use client";

import { useEffect, useState, useCallback } from "react";

type Plan = "guest" | "free" | "pro";

type UsageData = {
  plan: Plan;
  used: number;
  limit: number | null; // null = unlimited
  remaining: number | null;
  resetAt: Date | null;
};

export function useUsage() {
  const [data, setData] = useState<UsageData>({
    plan: "guest",
    used: 0,
    limit: null,
    remaining: null,
    resetAt: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/usage/me", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch usage");
      }

      const json = await res.json();

      const limit =
        json.plan === "pro" ? null : Number(json.limit ?? 0);

      const used = Number(json.used ?? 0);

      setData({
        plan: json.plan,
        used,
        limit,
        remaining:
          limit === null ? null : Math.max(limit - used, 0),
        resetAt: json.resetAt ? new Date(json.resetAt) : null,
      });
    } catch (err: any) {
      setError(err.message ?? "Usage error");
    } finally {
      setLoading(false);
    }
  }, []);

  // initial load
  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  return {
    ...data,
    loading,
    error,
    refetch: fetchUsage, // 🔥 important
    isUnlimited: data.limit === null,
    isExceeded:
      data.limit !== null && data.used >= data.limit,
  };
}
