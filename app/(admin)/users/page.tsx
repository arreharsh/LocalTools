"use client";

import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, BadgeX, Loader2, Search } from "lucide-react";

type User = {
  id: string;
  email: string;
  created_at: string;
  plan: "free" | "pro";
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  async function togglePlan(
    userId: string,
    nextPlan: "free" | "pro"
  ) {
    setUpdating(userId);

    const res = await fetch("/api/admin/update-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, plan: nextPlan }),
    });

    if (!res.ok) {
      alert("Plan update failed");
      setUpdating(null);
      return;
    }

    const data = await res.json();

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, plan: data.user.plan } : u
      )
    );

    setUpdating(null);
  }

  const filteredUsers = useMemo(
    () =>
      users.filter((u) =>
        u.email.toLowerCase().includes(query.toLowerCase())
      ),
    [users, query]
  );

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">
        Loading users…
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-semibold">Users</h1>

        <div className="relative w-full sm:w-64">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by email"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-md border bg-background"
          />
        </div>
      </div>

      <div className="overflow-x-auto shadow-md border rounded-lg bg-background">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Joined</th>
              <th className="text-center p-3">Status</th>
              <th className="text-center p-3">Plan</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u) => {
              const isPro = u.plan === "pro";

              return (
                <tr
                  key={u.id}
                  className="border-t hover:bg-muted/50"
                >
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    {new Date(u.created_at).toDateString()}
                  </td>

                  <td className="p-3 text-center">
                    {isPro ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs font-medium">
                        <BadgeCheck size={12} />
                        Pro
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-700 px-2 py-0.5 text-xs font-medium">
                        <BadgeX size={12} />
                        Free
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-center">
                    <button
                      disabled={updating === u.id}
                      onClick={() =>
                        togglePlan(
                          u.id,
                          isPro ? "free" : "pro"
                        )
                      }
                      className={`relative w-11 h-6 rounded-full transition
                        ${
                          isPro
                            ? "bg-emerald-500"
                            : "bg-gray-300 dark:bg-gray-600"
                        }
                        ${
                          updating === u.id
                            ? "opacity-60 cursor-not-allowed"
                            : ""
                        }`}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition
                          ${isPro ? "left-5" : "left-1"}`}
                      >
                        {updating === u.id && (
                          <Loader2
                            size={12}
                            className="animate-spin m-auto"
                          />
                        )}
                      </span>
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="p-4 text-center text-muted-foreground"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
