"use client";

import { X } from "lucide-react";
import { useUsage } from "@/hooks/useUsage";
import { useRouter } from "next/navigation";
import { useAuth, useAuthModal } from "@/providers/AuthProvider";

function formatTimeLeft(date: Date | null) {
  if (!date) return "";
  const diff = date.getTime() - Date.now();
  if (diff <= 0) return "Resets soon";

  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${h}h ${m}m`;
}

export default function ProfileUsageModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user, plan: authPlan, isPro } = useAuth();
  const { open: openAuthModal } = useAuthModal();

  const navigation = useRouter();

  const {
    used,
    limit,
    resetAt,
    loading,
  } = useUsage();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 px-4">
      <div className="w-full max-w-xs sm:max-w-md dark:border-2 border-border rounded-xl bg-background shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-semibold">Your Usage</h2>
          <button onClick={onClose}>
            <X className="h-5 w-5 opacity-60" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-5 py-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">
              Loading usage…
            </p>
          ) : (
            <>
              {/* Plan */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Current plan
                </span>
                <span className="rounded-md bg-muted-foreground/10 px-2 py-1 text-xs font-medium uppercase">
                  {isPro ? "pro" : authPlan}
                </span>
              </div>

              {/* Usage */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Daily usage</span>
                  {isPro ? (
                    <span className="font-medium">Unlimited</span>
                  ) : (
                    <span className="font-medium">
                      {used} / {limit}
                    </span>
                  )}
                </div>

                {/* Progress bar (ONLY for non-pro) */}
                {!isPro && (
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted-foreground/10">
                    <div
                      className={`h-full rounded-full transition-all ${
                        used / (limit ?? 1) >= 1
                          ? "bg-red-500"
                          : used / (limit ?? 1) >= 0.8
                          ? "bg-yellow-500"
                          : "bg-emerald-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          (used / (limit ?? 1)) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                )}

                {!isPro && (
                  <p className="text-xs text-muted-foreground">
                    Resets in {formatTimeLeft(resetAt)}
                  </p>
                )}
              </div>

              {/* CTA */}
              {!user && (
                <button
                  onClick={() => {
                    onClose();
                    openAuthModal();
                  }}
                  className="w-full rounded-md bg-primary py-2 text-sm text-white shadow-md font-medium"
                >
                  Login to get more usage
                </button>
              )}

              {user && !isPro && (
                <button
                  onClick={() =>{  onClose(); navigation.push("/pricing")}}
                  className="w-full rounded-md bg-primary shadow-md font-medium py-2 text-sm text-white"
                >
                  Upgrade to Pro
                </button>
              )}

              {isPro && (
                <p className="text-center text-sm text-emerald-600">
                  Pro plan active ✨
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
