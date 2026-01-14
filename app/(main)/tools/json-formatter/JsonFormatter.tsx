"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FileJson, Trash2, Copy, ArrowLeft } from "lucide-react";
import { useAuthModal } from "@/providers/AuthProvider";

// @ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import BackBtn from "@/components/ui/backbtn";
// @ts-ignore
import {oneLight,oneDark,} from "react-syntax-highlighter/dist/esm/styles/prism";
import HowToUse from "@/components/tool/HowToUse";



/* ---------- SAMPLE JSON ---------- */
const SAMPLE_JSON = `[
  {
    "name": "John Doe",
    "age": 30,
    "email": "john@example.com",
    "city": "New York",
    "active": true,
    "skills": ["JavaScript", "React"],
    "address": null
  },
  {
    "name": "Jane Smith",
    "age": 25,
    "email": "jane@example.com",
    "city": "Los Angeles",
    "active": false,
    "skills": ["Python", "Django"],
    "address": {
      "zip": "90001",
      "country": "USA"
    }
  }
]`;

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);
  const { theme } = useTheme();
  const { open } = useAuthModal();


  useEffect(() => {
    setInput(SAMPLE_JSON);
  }, []);

  const router = useRouter();

  const parseJson = () => {
    try {
      setError("");
      return JSON.parse(input);
    } catch (e: any) {
      setError(e.message);
      throw e;
    }
  };

  /* ---------- ACTIONS ---------- */

  


  const formatJson = () => {
    try {
      setOutput(JSON.stringify(parseJson(), null, indent));
    } catch {}
  };

  const minifyJson = () => {
    try {
      setOutput(JSON.stringify(parseJson()));
    } catch {}
  };

  const validateJson = () => {
    try {
      parseJson();
      setOutput("✅ Valid JSON");
    } catch {}
  };

  const sortKeys = () => {
    const sortObj = (obj: any): any =>
      Array.isArray(obj)
        ? obj.map(sortObj)
        : obj && typeof obj === "object"
        ? Object.keys(obj)
            .sort()
            .reduce((acc: any, key) => {
              acc[key] = sortObj(obj[key]);
              return acc;
            }, {})
        : obj;

    try {
      setOutput(JSON.stringify(sortObj(parseJson()), null, indent));
    } catch {}
  };

  const removeNulls = () => {
    const clean = (obj: any): any =>
      Array.isArray(obj)
        ? obj.map(clean)
        : obj && typeof obj === "object"
        ? Object.fromEntries(
            Object.entries(obj)
              .filter(([_, v]) => v !== null)
              .map(([k, v]) => [k, clean(v)])
          )
        : obj;

    try {
      setOutput(JSON.stringify(clean(parseJson()), null, indent));
    } catch {}
  };

  const flattenJson = () => {
    const res: any = {};
    const flat = (obj: any, prefix = "") => {
      for (const k in obj) {
        const key = prefix ? `${prefix}.${k}` : k;
        if (typeof obj[k] === "object" && obj[k] !== null) {
          flat(obj[k], key);
        } else {
          res[key] = obj[k];
        }
      }
    };
    try {
      flat(parseJson());
      setOutput(JSON.stringify(res, null, indent));
    } catch {}
  };

  const extractKeys = () => {
    const keys = new Set<string>();
    const walk = (obj: any) => {
      if (obj && typeof obj === "object") {
        Object.keys(obj).forEach((k) => {
          keys.add(k);
          walk(obj[k]);
        });
      }
    };
    try {
      walk(parseJson());
      setOutput(JSON.stringify([...keys], null, indent));
    } catch {}
  };

  const countItems = () => {
    const count = (obj: any): number =>
      Array.isArray(obj)
        ? obj.reduce((a: number, b) => a + count(b), 0)
        : obj && typeof obj === "object"
        ? Object.values(obj).reduce((a: number, b) => a + count(b), 1)
        : 1;

    try {
      setOutput(`Total items: ${count(parseJson())}`);
    } catch {}
  };

  const toCSV = () => {
    try {
      const arr = parseJson();
      if (!Array.isArray(arr)) throw new Error("JSON must be array");
      const headers = Object.keys(arr[0]);
      const rows = arr.map((o: any) =>
        headers.map((h) => JSON.stringify(o[h] ?? "")).join(",")
      );
      setOutput([headers.join(","), ...rows].join("\n"));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const toXML = () => {
    const xml = (obj: any, tag = "item"): string =>
      typeof obj !== "object"
        ? `<${tag}>${obj}</${tag}>`
        : Object.entries(obj)
            .map(([k, v]) => xml(v, k))
            .join("");
    try {
      setOutput(`<root>${xml(parseJson())}</root>`);
    } catch {}
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  /* ---------- UI ---------- */

  return (
    <div className="w-full mx-auto px-8  pb-10 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">JSON Formatter</h1>
        <p className="text-muted-foreground mt-1">
          Format, validate and transform JSON data easily.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center font-medium">
            <FileJson className="w-5 h-5 text-primary" />
            JSON Options
          </div>
          <Select
  value={String(indent)}
  onValueChange={(v) => setIndent(Number(v))}
>
  <SelectTrigger className="w-[130px] py-1">
    <SelectValue placeholder="Indent" />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="2">2 spaces</SelectItem>
    <SelectItem value="4">4 spaces</SelectItem>
  </SelectContent>
</Select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Btn onClick={() => (formatJson)} text="Format JSON" />
          <Btn onClick={() => (minifyJson)} text="Minify JSON" />
          <Btn onClick={() => (validateJson)} text="Validate JSON" />
          <Btn onClick={() => (sortKeys)} text="Sort Keys" />
          <Btn onClick={() => (removeNulls)} text="Remove Nulls" />
          <Btn onClick={() => (flattenJson)} text="Flatten" />
          <Btn onClick={() => (toCSV)} text="To CSV" />
          <Btn onClick={() => (toXML)} text="To XML" />
          <Btn onClick={() => (extractKeys)} text="Extract Keys" />
          <Btn onClick={() => (countItems)} text="Count Items" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-4 flex flex-col">
          <div className="flex justify-between mb-2">
            <span className="font-medium flex gap-2 items-center">
              <FileJson className="w-4 h-4 text-primary" />
              JSON Input
            </span>
            <button
              onClick={clearAll}
              className="text-sm flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`flex-1 min-h-[300px] resize-none no-scrollbar rounded-md border bg-background p-3 font-mono text-sm ${
              error ? "border-red-500" : ""
            }`}
          />

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <div className="rounded-xl border bg-card p-4 flex flex-col">
          {!output ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-2">
              <FileJson className="w-10 h-10 opacity-50" />
              <p className="font-medium">No Formatted JSON Yet</p>
              <p className="text-sm text-center">
                Enter JSON and select an option to see output here.
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => navigator.clipboard.writeText(output)}
                  className="text-sm flex items-center gap-1 text-muted-foreground hover:text-foreground"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>
              <div className="flex-1 overflow-auto rounded-md border bg-background">
                <SyntaxHighlighter
                  language="json"
                  style={theme === "dark" ? oneDark : oneLight}
                  customStyle={{
                    margin: 0,
                    background: "transparent",
                    fontSize: "13px",
                    fontFamily: "var(--font-mono)",
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: "var(--font-mono)",
                    },
                  }}
                >
                  {output}
                </SyntaxHighlighter>
              </div>
            </>
          )}
        </div>
      </div>

      <HowToUse
  steps={[
    "Paste your JSON",
    "Choose an operation (format, minify, validate)",
    "Copy or download the result",
  ]}
  tip='Try "Flatten" or "To CSV" for data transformation'
/>

    </div>
  );
}

function Btn({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-md border px-3 py-2 text-sm hover:bg-muted transition"
    >
      {text}
    </button>
  );
}
