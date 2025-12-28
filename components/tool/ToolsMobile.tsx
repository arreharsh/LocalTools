"use client";

import { useState } from "react";
import { Search, Flame } from "lucide-react";
import { ALL_TOOLS } from "@/lib/tool-search";
import { useRouter } from "next/navigation";
import HowToUse from "./HowToUse";



const FEATURED_TOOLS_COUNT = 9;

const TOOL_COLORS = [
  "bg-blue-500/10 text-blue-600",
  "bg-purple-500/10 text-purple-600",
  "bg-green-500/10 text-green-600",
  "bg-orange-500/10 text-orange-600",
  "bg-pink-500/10 text-pink-600",
  "bg-teal-500/10 text-teal-600",
];

export default function ToolsMobile() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const results = ALL_TOOLS.filter((tool) => {
    const q = query.toLowerCase();
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.slug.toLowerCase().includes(q)
    );
  });

  const featuredTools = ALL_TOOLS.slice(0, FEATURED_TOOLS_COUNT);

  return (
    <div className="min-h-screen bg-muted/10 px-4 py-4">
      {/* Header */}
      <h1 className="text-lg font-semibold mb-3">Explore tools</h1>

      {/* Search bar (proper height + spacing) */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools"
          className="
            w-full h-10
            rounded-md bg-muted
            pl-11 pr-4 text-sm
            outline-none
            focus:ring-2 focus:ring-primary
          "
        />
      </div>
      <div className="mb-5">
        {/* Featured section title */}
        {!query && (
          <h2 className="text-sm font-medium mb-3">
            Featured tools <Flame className="inline-block size-4 text-orange-500" />
          </h2>
        )}
      </div>
      {/* Featured tools (auto scalable) */}
      {!query && (
        <div className="grid grid-cols-3 gap-3">
          {featuredTools.map((tool, index) => (
            <button
              key={tool.id}
              onClick={() => router.push(`/tools/${tool.slug}`)}
              className={`
                aspect-square
                rounded-xl
                border
                shadow-sm
                transition
                flex flex-col items-center justify-center
                gap-2
                text-sm font-medium
                ${TOOL_COLORS[index % TOOL_COLORS.length]}
              `}
            >
              {tool.icon && <tool.icon className="size-5" />}
              <span className="text-center px-2 leading-tight">
                {tool.name}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Search results */}
      {query && (
        <div className="space-y-2">
          {results.map((tool) => (
            <button
              key={tool.id}
              onClick={() => router.push(`/tools/${tool.slug}`)}
              className="
                w-full flex items-center gap-3
                rounded-md border bg-background
                px-4 py-2.5 text-sm
                shadow-sm
              "
            >
              {tool.icon && (
                <tool.icon className="size-4 text-muted-foreground" />
              )}
              <span>{tool.name}</span>
            </button>
          ))}

          {results.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-6">
              No tool found
            </div>
          )}
        </div>
      )}
      <div className="mt-10 text-center text-xs text-muted-foreground">
        Tools not working? Visit the desktop site to access all tools.
      </div>

      {/* How to use section */}
      <HowToUse className="mt-12" steps={[
        "Input your data or upload files as required by the tool.",
        "Click the 'Process' button to execute the tool's function.",
      ]} 
      tip="Visit the desktop site for better experience."
      />

    </div>
  );
}
