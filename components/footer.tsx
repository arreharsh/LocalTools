import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border pb-3 mt-28">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          
          {/* LEFT: BUILT BY */}
          <div className="text-center sm:text-left font-medium">
            <span className="opacity-90">© {new Date().getFullYear()}</span> · Built with ♡ by Harsh
          </div>

          {/* RIGHT: PRODUCT LINE */}
          <div className="text-center sm:text-right max-w-md">
            Privacy-first tools for everyday work.
          </div>

          {/* CENTER: LINKS */}
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="hover:text-foreground underline transition">
              Pricing
            </Link>
            <span className="opacity-40">•</span>
            <Link href="/privacy" className="hover:text-foreground underline transition">
              Privacy
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
