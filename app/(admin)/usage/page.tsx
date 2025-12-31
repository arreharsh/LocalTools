"use client";

import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";

type TodayStats = {
  today: string;
  total: number;
  guestTotal: number;
  userTotal: number;
};

export default function UsagePage() {
  const [stats, setStats] = useState<TodayStats | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    const r = await fetch("/api/admin/usage/today");
    setStats(await r.json());
  }

  useEffect(() => { load(); }, []);

  async function resetGuests() {
    if (!confirm("Reset ALL guest usage?")) return;
    setLoading(true);
    await fetch("/api/admin/usage/reset-guests", { method: "POST" });
    await load();
    setLoading(false);
  }

  async function resetFree() {
    if (!confirm("Reset ALL free users usage?")) return;
    setLoading(true);
    await fetch("/api/admin/usage/reset-free", { method: "POST" });
    await load();
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Usage Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card title="Total Today" value={stats?.total ?? "—"} />
        <Card title="Guests Today" value={stats?.guestTotal ?? "—"} />
        <Card title="Logged-in Today" value={stats?.userTotal ?? "—"} />
      </div>

      <div className="border border-red-300 rounded-lg p-4 space-y-3">
        <h2 className="font-semibold text-red-600">Danger Zone</h2>
        <div className="flex flex-wrap gap-2">
          <button
            disabled={loading}
            onClick={resetGuests}
            className="flex items-center gap-2 text-sm text-white bg-orange-600 px-3 py-2 rounded"
          >
            <RotateCcw size={14} /> Reset Guest Usage
          </button>
          <button
            disabled={loading}
            onClick={resetFree}
            className="flex items-center gap-2 text-sm text-white bg-red-600 px-3 py-2 rounded"
          >
            <RotateCcw size={14} /> Reset Free Users Usage
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="border rounded-lg p-4 bg-background">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
