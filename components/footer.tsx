import Link from "next/link";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border pb-3 mt-28">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          
          {/* LEFT: BRAND + OWNERSHIP */}
          <div className="text-center sm:text-left font-medium">
            <span className="opacity-90">
              © {new Date().getFullYear()}{" "}
              <span className="">LocalTools™</span> . All rights reserved.
            </span>
            <div className="text-xs opacity-70 mt-1">
              Official website:{" "}
              <a
                href="https://localtools.app"
                className="bg-muted py-0.5 cursor-pointer underline hover:text-foreground text-xs rounded-sm px-1"
              >
                localtools.app
              </a>
            </div>

            
          </div>

          {/* RIGHT: LEGAL LINKS */}
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="hover:text-foreground underline transition">
              Pricing
            </Link>
            <span className="opacity-40">•</span>
            <Link href="/privacy" className="hover:text-foreground underline transition">
              Privacy Policy
            </Link>
            <span className="opacity-40">•</span>
            <Link href="/refund" className="hover:text-foreground underline transition">
              Refund Policy
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}
