"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Command, Link } from "lucide-react";
import { ALL_TOOLS } from "@/lib/tool-search";
import FloatingIcons from "@/components/FloatingIcons";
import { FLOATING_ICONS } from "@/lib/floating-icons";
import { useRouter } from "next/navigation";
import RequestToolModal from "@/components/RequestToolModal";

import { Footer } from "@/components/footer";

export default function ToolsPage() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [openRequest, setOpenRequest] = useState(false);

  // Animated placeholder

  const PLACEHOLDERS = [
    "PDF Merge",
    "Image to PDF",
    "PDF Compress",
    "Regex Tester",
    "JWT Decoder",
    "URL Encode / Decode",
  ];

  const [placeholder, setPlaceholder] = useState("");
  useEffect(() => {
    let index = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const current = PLACEHOLDERS[index];

      if (!isDeleting) {
        setPlaceholder(current.slice(0, charIndex + 1));
        charIndex++;

        if (charIndex === current.length) {
          setTimeout(() => (isDeleting = true), 1200);
        }
      } else {
        setPlaceholder(current.slice(0, charIndex - 1));
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          index = (index + 1) % PLACEHOLDERS.length;
        }
      }
    };

    const interval = setInterval(type, isDeleting ? 40 : 80);
    return () => clearInterval(interval);
  }, []);

  // Ctrl / Cmd + K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const results = ALL_TOOLS.filter((tool) => {
    const q = query.toLowerCase();

    return (
      tool.name.toLowerCase().includes(q) || tool.slug.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-xl relative group">
          {/* Title */}

          <h1 className="text-3xl font-semibold text-center mb-2">
            Find a tool
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Search from 50+ privacy-focused tools…
          </p>
          <div className="absolute inset-0 -top-24">
            <FloatingIcons icons={FLOATING_ICONS} />
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />

            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`${placeholder}${placeholder ? "|" : ""}`}
              className="
              w-full rounded-xl bg-muted
              pl-11 pr-20 py-4 text-sm
              outline-none placeholder:font-medium
              focus:ring-2 focus:ring-primary
            "
            />

            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-muted-foreground border rounded-md px-2 py-0.5">
              <Command className="size-3" />K
            </div>
          </div>

          {/* Results */}
          {query && (
            <div className="mt-6 rounded-xl border bg-background shadow-sm divide-y relative z-20">
              {/* TOOLS LIST */}
              {results.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => router.push(`/tools/${tool.slug}`)}
                  className="
          w-full flex items-center gap-2
          px-4 py-3 text-sm text-left
          hover:bg-muted transition
        "
                >
                  {tool.icon && (
                    <tool.icon className="size-4 text-muted-foreground shrink-0" />
                  )}
                  <span>{tool.name}</span>
                </button>
              ))}

              {/* EMPTY STATE (NO TOOL FOUND) */}
              {results.length === 0 && (
                <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                  No tool found
                </div>
              )}

              {/* REQUEST TOOL — ALWAYS AT END */}
              <button
                onClick={() => setOpenRequest(true)}
                className="
        w-full px-4 py-3 text-sm font-semibold
        text-pink-600 text-center
        hover:bg-primary/5 transition
      "
              >
                <span className="">Request a tool +</span>
              </button>
            </div>
          )}

          {/* Hint */}
          {!query && (
            <p className="mt-6 text-xs text-muted-foreground text-center">
              Tip: Press <kbd className="px-1 py-0.5 border rounded">Ctrl</kbd>{" "}
              + <kbd className="px-1 py-0.5 border rounded">K</kbd> to search
            </p>
          )}
        </div>
      </div>
      <RequestToolModal
        open={openRequest}
        onClose={() => setOpenRequest(false)}
      />
    </>
  );
}
