"use client";

import { useEffect, useState } from "react";
import { Copy, Trash2 } from "lucide-react";
import HowToUse from "@/components/tool/HowToUse";

export default function UrlEncodeDecode() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("url-encode-decode");
    if (saved) {
      const d = JSON.parse(saved);
      setInput(d.input || "");
      setOutput(d.output || "");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "url-encode-decode",
      JSON.stringify({ input, output })
    );
  }, [input, output]);

  const handleEncode = () => {
    try {
      setError(null);
      setOutput(encodeURIComponent(input));
    } catch {
      setError("Failed to encode input");
    }
  };

  const handleDecode = () => {
    try {
      setError(null);
      setOutput(decodeURIComponent(input));
    } catch {
      setError("Invalid encoded string");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  return (
    <div className="max-w-4xl w-full md:min-w-8xl mx-auto pt-16 px-4 py-6">
      {/* PAGE HEADING */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">URL Encode / Decode</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Encode or decode URLs safely for APIs, browsers and web requests
        </p>
      </div>

      {/* TOOL CARD */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        {/* INPUT */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            placeholder="Paste URL or text here"
            className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono focus:ring-2 focus:ring-ring/30"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2">
          <button
            onClick={handleEncode}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm"
          >
            Encode
          </button>
          <button
            onClick={handleDecode}
            className="px-4 py-2 rounded-md border border-border text-sm hover:bg-muted"
          >
            Decode
          </button>
        </div>

        <div className="h-px bg-border" />

        {/* OUTPUT */}
        <div className="space-y-2 relative">
          <label className="text-sm font-medium">Output</label>

          {/* ICONS INSIDE OUTPUT */}
          <div className="absolute right-2 top-9 flex gap-1 z-10">
            <button
              onClick={copyOutput}
              disabled={!output}
              title="Copy"
              className="p-1.5 rounded-md border border-border bg-background hover:bg-muted disabled:opacity-40"
            >
              <Copy size={14} />
            </button>
            <button
              onClick={handleClear}
              title="Clear"
              className="p-1.5 rounded-md border border-border bg-background hover:bg-muted text-muted-foreground"
            >
              <Trash2 size={14} />
            </button>
          </div>

          <textarea
            value={output}
            readOnly
            rows={6}
            placeholder="Result will appear here"
            className="w-full rounded-md border border-input bg-background px-3 py-2 pr-14 font-mono text-muted-foreground"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>

      <HowToUse
       className="mt-8"
        steps={[
          "Enter the URL or text you want to encode or decode in the input box.",
          "Click the 'Encode/Decode' button to convert the input into a URL-encoded/decoded format.",
          "Use the 'Clear/Copy' button to reset or copy output fields.",
        ]}
        tip="This tool helps you safely encode and decode URLs for web development and API usage."
      />
    </div>
  );
}
