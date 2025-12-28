import Link from "next/link";

export function Footer() {
  return (

    

 <footer className="border-t border-border">
  <div className="max-w-7xl mx-auto px-6 py-10 relative">
    {/* CENTER TEXT */}
    <div className="text-center pb-2 text-sm text-muted-foreground">
      <span className="p-2">Created with ♥ to help others</span>
    </div>

    {/* BOTTOM RIGHT LINKS */}
    <div className="absolute right-6 bottom-4 flex gap-2 text-sm text-muted-foreground">
      <Link
        href="/privacy"
        className="hover:text-foreground underline transition"
      >
        Privacy
      </Link>

      <span className="opacity-40">•</span>

      <Link
        href="/refund"
        className="hover:text-foreground underline transition"
      >
        Refund Policy
      </Link>
      <span className="opacity-40">•</span>
      <Link
        href="/pricing"
        className="hover:text-foreground underline transition"
      >
        Pricing
      </Link>
    </div>
  </div>
 </footer>
  
);
}  