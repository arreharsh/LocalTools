"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";
import AdminShell from "../components/AdminShell";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  email: string;
  created_at: string;
  plan: "free" | "pro";
  pro_expires_at: string | null;
};

type Action = "free" | "pro_3day" | "pro_lifetime";

export default function UsersPage() {
  const supabase = createSupabaseBrowser();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  /* ---------------------------
     LOAD USERS
  --------------------------- */
  useEffect(() => {
    async function loadUsers() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/admin/login");
        return;
      }

      const res = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {}

      if (!res.ok) {
        console.error(data?.error ?? "Admin API error");
        setUsers([]);
        setLoading(false);
        return;
      }

      setUsers(Array.isArray(data) ? data : []);
      setLoading(false);
    }

    loadUsers();
  }, [router, supabase]);

  /* ---------------------------
     UPDATE PLAN
  --------------------------- */
  async function updateUserPlan(userId: string, action: Action) {
    setUpdating(userId);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return;

    const res = await fetch("/api/admin/update-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ userId, action }),
    });

    let data: any = null;
    try {
      data = await res.json();
    } catch {}

    if (!res.ok) {
      alert(data?.error ?? "Plan update failed");
      setUpdating(null);
      return;
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              plan: data.user.plan,
              pro_expires_at: data.user.pro_expires_at,
            }
          : u
      )
    );

    setUpdating(null);
  }

  /* ---------------------------
     FILTER
  --------------------------- */
  const filteredUsers = useMemo(
    () =>
      users.filter((u) =>
        u.email.toLowerCase().includes(query.toLowerCase())
      ),
    [users, query]
  );

  if (loading) {
    return (
      <AdminShell>
        <p className="text-sm text-muted-foreground">
          Loading users…
        </p>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* HEADER */}
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
              placeholder="Search email"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-md border bg-background"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto shadow-md border rounded-lg bg-background">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3">Email</th>
                <th className="text-center p-3">Plan</th>
                <th className="text-center p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((u) => {
                const isPro =
                  u.plan === "pro" &&
                  u.pro_expires_at &&
                  new Date(u.pro_expires_at) > new Date();

                const isLifetime =
                  isPro &&
                  new Date(u.pro_expires_at!) >
                    new Date("2090-01-01");

                return (
                  <tr
                    key={u.id}
                    className="border-t hover:bg-muted/50"
                  >
                    <td className="p-3">{u.email}</td>

                    {/* PLAN BADGE */}
                    <td className="p-3 text-center">
                      {!isPro && (
                        <span className="inline-flex rounded-full bg-gray-100 text-gray-700 px-2 py-0.5 text-xs font-medium">
                          Free
                        </span>
                      )}

                      {isPro && !isLifetime && (
                        <span className="inline-flex rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-xs font-medium">
                          Pro (3-Day)
                        </span>
                      )}

                      {isLifetime && (
                        <span className="inline-flex rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs font-medium">
                          Pro (Lifetime)
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-3 text-center">
                      <div className="inline-flex items-center gap-2">
                        <button
                          disabled={updating === u.id}
                          onClick={() =>
                            updateUserPlan(u.id, "free")
                          }
                          className="px-2 py-1 text-xs rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-60"
                        >
                          Free
                        </button>

                        <button
                          disabled={updating === u.id}
                          onClick={() =>
                            updateUserPlan(u.id, "pro_3day")
                          }
                          className="px-2 py-1 text-xs rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-60"
                        >
                          3-Day
                        </button>

                        <button
                          disabled={updating === u.id}
                          onClick={() =>
                            updateUserPlan(u.id, "pro_lifetime")
                          }
                          className="px-2 py-1 text-xs rounded-md bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-60"
                        >
                          Lifetime
                        </button>

                        {updating === u.id && (
                          <Loader2
                            size={14}
                            className="animate-spin ml-1"
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
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
    </AdminShell>
  );
}
