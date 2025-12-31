"use client";

import Link from "next/link";

export default function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* overlay */}
      <div
        className="flex-1 bg-black/40"
        onClick={onClose}
      />

      {/* drawer */}
      <div className="w-64 bg-background p-4">
        <div className="mb-6 font-semibold">
          LocalTools Admin
        </div>

        <nav className="space-y-2">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="block rounded px-3 py-2 hover:bg-muted"
          >
            Dashboard
          </Link>

          <Link
            href="/users"
            onClick={onClose}
            className="block rounded px-3 py-2 hover:bg-muted"
          >
            Users
          </Link>

          <Link
            href="/usage"
            onClick={onClose}
            className="block rounded px-3 py-2 hover:bg-muted"
          >
            Usage
          </Link>
        </nav>
      </div>
    </div>
  );
}
