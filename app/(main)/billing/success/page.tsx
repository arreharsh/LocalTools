"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function BillingSuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 text-center shadow-xl">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />

        <h1 className="mt-4 text-2xl font-semibold">
          Payment Successful 🎉
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Your payment has been received.
          <br />
          Pro access will be activated shortly.
        </p>

        <div className="mt-6 space-y-3">
          <Link
            href="/"
            className="block w-full rounded-xl bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
          >
            Go to Dashboard
          </Link>

          <p className="text-xs text-muted-foreground">
            If access isn’t activated within a few minutes, contact support.
          </p>
        </div>
      </div>
    </main>
  );
}
