"use client";

export default function UserMenuSkeleton() {
  return (
    <div className="fixed hidden lg:flex top-4 right-6 z-50 items-center gap-2">
      {/* User box */}
      <div className="flex items-center gap-3 rounded-xl border px-3 py-2 shadow-sm min-w-[180px] animate-pulse bg-background">
        <div className="size-8 rounded-full bg-muted" />
        <div className="flex-1 space-y-1">
          <div className="h-3 w-24 rounded bg-muted" />
          <div className="h-2 w-16 rounded bg-muted" />
        </div>
      </div>

      {/* Theme toggle placeholder */}
      <div className="size-9 rounded-md bg-muted animate-pulse" />
    </div>
  );
}
