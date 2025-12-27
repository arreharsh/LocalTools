"use client";

import { useEffect, useMemo, useState } from "react";
import HowToUse from "@/components/tool/HowToUse";
import BackBtn from "@/components/ui/backbtn";

const PRESETS = {
  Email: "^[\\w.-]+@[\\w.-]+\\.\\w+$",
  Phone: "^\\+?[0-9]{10,13}$",
  URL: "https?:\\/\\/(www\\.)?[-\\w@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-\\w()@:%_\\+.~#?&//=]*)",
  Password:
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
};

export default function RegexTesterPro() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("regex-tester");
    if (saved) {
      const p = JSON.parse(saved);
      setPattern(p.pattern || "");
      setFlags(p.flags || "g");
      setText(p.text || "");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "regex-tester",
      JSON.stringify({ pattern, flags, text })
    );
  }, [pattern, flags, text]);

  const regex = useMemo(() => {
    try {
      setError(null);
      if (!pattern) return null;
      return new RegExp(pattern, flags);
    } catch (e: any) {
      setError(e.message);
      return null;
    }
  }, [pattern, flags]);

  const matches = useMemo(() => {
    if (!regex || !text) return [];
    return [...text.matchAll(regex)];
  }, [regex, text]);

  const highlightedText = useMemo(() => {
    if (!regex || !text) return text;
    return text.replace(regex, (m) => `%%${m}%%`);
  }, [regex, text]);

  return (
    <div className="w-full max-w-4xl md:min-w-8xl mx-auto px-4 py-16">
      {/* PAGE HEADING (OUTSIDE CARD) */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Regex Tester</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Test, debug and understand regular expressions in real-time
        </p>
      </div>

      {/* TOOL CARD */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        {/* Regex input */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Regular Expression</label>
          <input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regex pattern"
            className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono focus:ring-2 focus:ring-ring/30"
          />

          {/* Flags */}
          <div className="flex gap-2 flex-wrap">
            {["g", "i", "m", "s", "u", "y"].map((f) => (
              <button
                key={f}
                onClick={() =>
                  setFlags((prev) =>
                    prev.includes(f)
                      ? prev.replace(f, "")
                      : prev + f
                  )
                }
                className={`px-3 py-1 rounded-md border text-sm ${
                  flags.includes(f)
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border-border"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Presets */}
        <div className="flex gap-2 flex-wrap">
          {Object.entries(PRESETS).map(([name, value]) => (
            <button
              key={name}
              onClick={() => setPattern(value)}
              className="px-3 py-1 rounded-md border border-border text-sm hover:bg-muted"
            >
              {name}
            </button>
          ))}
        </div>

        <div className="h-px bg-border" />

        {/* Test string */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Test String</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder="Paste text to test regex against"
            className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono focus:ring-2 focus:ring-ring/30"
          />
        </div>

        <div className="h-px bg-border" />

        {/* Results */}
        <div className="space-y-3">
          {error && (
            <p className="text-sm text-red-500">
              Invalid regex: {error}
            </p>
          )}

          <p className="text-sm">
            Matches found:{" "}
            <span className="font-semibold">{matches.length}</span>
          </p>

          {/* Highlighted output */}
          <div className="rounded-md border border-border bg-background p-3 font-mono text-sm whitespace-pre-wrap">
            {highlightedText.split("%%").map((part, i) =>
              i % 2 === 1 ? (
                <mark
                  key={i}
                  className="bg-accent text-accent-foreground px-1 rounded"
                >
                  {part}
                </mark>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </div>

          {/* Groups */}
          {matches.length > 0 && matches[0].length > 1 && (
            <div className="rounded-md border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-3 py-2 text-left">Group</th>
                    <th className="px-3 py-2 text-left">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {matches[0].slice(1).map((g, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="px-3 py-2">{i + 1}</td>
                      <td className="px-3 py-2 font-mono">
                        {g || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
      <HowToUse
        steps={[
          "Enter your regex pattern and select desired flags.",
          "Paste the text you want to test against the regex.",]}
        tip="The tool will highlight matches in the text and show captured groups if any."
      />
     </div>
    </div>

  );
}
