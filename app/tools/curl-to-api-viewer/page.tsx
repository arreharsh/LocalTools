"use client";

import { useEffect, useState } from "react";
import { Play, Loader2, Copy, Wand2, AlertTriangle } from "lucide-react";
import HowToUse from "@/components/tool/HowToUse";
// @ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight, // @ts-ignore
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { runToolWithGuard } from "@/lib/runToolWithGuard";
import { useAuthModal } from "@/providers/AuthProvider";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export default function CurlToApiViewerV2() {
  const { theme } = useTheme();
  const { open } = useAuthModal(); // ✅ auth modal

  const METHODS: Method[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

  /* ---------------- MOUNTED STATE ---------------- */
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ---------------- RAW CURL ---------------- */
  const [curl, setCurl] =
    useState(`curl -X POST https://jsonplaceholder.typicode.com/posts \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Hello","body":"World","userId":1}'`);

  /* ---------------- PARSED FIELDS ---------------- */
  const [method, setMethod] = useState<Method>("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [body, setBody] = useState("");

  /* ---------------- REQUEST STATE ---------------- */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [time, setTime] = useState<number | null>(null);

  /* ---------------- PARSE CURL ---------------- */
  const parseCurl = () => {
    try {
      const m = curl.match(/-X\s+(\w+)/i)?.[1]?.toUpperCase() || "GET";
      setMethod(m as Method);

      const u = curl.match(/(https?:\/\/[^\s\\]+)/)?.[1];
      if (!u) throw new Error("URL not found in cURL");
      setUrl(u);

      const h: Record<string, string> = {};
      for (const match of curl.matchAll(/-H\s+"([^:]+):\s*([^"]+)"/gi)) {
        h[match[1]] = match[2];
      }
      setHeaders(h);

      const d =
        curl.match(/-d\s+'([^']+)'/)?.[1] ||
        curl.match(/--data-raw\s+'([^']+)'/)?.[1];
      setBody(d || "");
    } catch (e: any) {
      setError(e.message);
    }
  };

  /* ---------------- REAL TOOL LOGIC ---------------- */
  const runRequest = async () => {
    setError(null);
    setResponse(null);
    setStatus(null);
    setTime(null);

    if (!url || !url.startsWith("http")) {
      setError("Please parse a valid cURL or enter a valid API URL");
      return;
    }

    try {
      setLoading(true);
      const start = performance.now();

      const res = await fetch(url, {
        method,
        headers,
        body:
          method === "GET" || method === "DELETE"
            ? undefined
            : body || undefined,
      });

      const end = performance.now();

      setStatus(res.status);
      setTime(Math.round(end - start));

      const text = await res.text();
      try {
        setResponse(JSON.parse(text));
      } catch {
        setResponse(text);
      }
    } catch {
      setError("Request failed. Possible CORS or network error.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- GUARDED HANDLER ---------------- */
  const handleRunRequest = () => {
    runToolWithGuard(runRequest, open);
  };

  /* ---------------- CODE GENERATORS ---------------- */
  const generators = {
    fetch: `fetch("${url}", {
  method: "${method}",
  headers: ${JSON.stringify(headers, null, 2)},
  body: ${body ? JSON.stringify(body) : "undefined"},
}).then(res => res.json());`,

    axios: `axios({
  method: "${method.toLowerCase()}",
  url: "${url}",
  headers: ${JSON.stringify(headers, null, 2)},
  data: ${body ? JSON.stringify(body) : "undefined"},
});`,

    node: `const https = require("https");

const options = {
  method: "${method}",
  headers: ${JSON.stringify(headers, null, 2)},
};

const req = https.request("${url}", options, res => {
  res.on("data", d => process.stdout.write(d));
});

req.write(${body ? JSON.stringify(body) : '""'});
req.end();`,

    python: `import requests

response = requests.request(
  "${method}",
  "${url}",
  headers=${JSON.stringify(headers, null, 2)},
  json=${body || "{}"}
)

print(response.text)`,
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="w-full mx-auto px-34 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">cURL to API Viewer</h1>
        <p className="text-muted-foreground mt-1">
          Paste a cURL command, edit request and generate code.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 px-5 py-4 flex items-center gap-2 text-red-500 text-sm">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* CURL INPUT */}
      <div className="rounded-xl border bg-card p-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-medium text-sm">cURL Command</span>
          <button
            onClick={parseCurl}
            className="flex items-center gap-1 text-sm text-primary"
          >
            <Wand2 className="w-4 h-4" />
            Parse
          </button>
        </div>

        <textarea
          value={curl}
          onChange={(e) => setCurl(e.target.value)}
          className="w-full min-h-[160px] resize-none rounded-md border bg-background p-3 font-mono text-sm"
        />
      </div>

      {/* EDITABLE REQUEST */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="flex gap-3">
          <Select
            value={method}
            onValueChange={(value) => {
              setMethod(value as Method);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {METHODS.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com"
            className="flex-1 border rounded-md bg-background px-3 py-2 text-sm"
          />
        </div>

        <textarea
          placeholder="Request Body (JSON / text)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full min-h-[120px] resize-none rounded-md border bg-background p-3 font-mono text-sm"
        />

        <button
          onClick={handleRunRequest}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm hover:opacity-90"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          Run Request
        </button>
      </div>

      {/* RESPONSE */}
      <div className="rounded-xl border bg-card p-6">
        <div className="flex gap-4 mb-3 text-sm">
          {status && <span>Status: {status}</span>}
          {time && <span>Time: {time} ms</span>}
        </div>

        <div className="relative h-[200px] overflow-hidden rounded-md border bg-background">
          {!response ? (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
              No response yet
            </div>
          ) : (
            <div className="absolute inset-0 overflow-auto">
              {!mounted ? null : (
                <SyntaxHighlighter
                  language="json"
                  wrapLongLines
                  style={theme === "dark" ? oneDark : oneLight}
                  customStyle={{
                    margin: 0,
                    background: "transparent",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontSize: "13px",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {typeof response === "string"
                    ? response
                    : JSON.stringify(response, null, 2)}
                </SyntaxHighlighter>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CODE GENERATORS */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <h3 className="font-medium">Code Generators</h3>

        {Object.entries(generators).map(([key, code]) => (
          <div key={key} className="relative">
            <button
              onClick={() => navigator.clipboard.writeText(code)}
              className="absolute right-2 top-2 text-xs text-muted-foreground"
            >
              <Copy className="w-3 h-3" />
            </button>
            <SyntaxHighlighter
              language={key === "python" ? "python" : "javascript"}
              style={theme === "dark" ? oneDark : oneLight}
              customStyle={{
                fontSize: "12px",
                borderRadius: "0.5rem",
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        ))}
      </div>

      <HowToUse
        steps={[
          "Paste a cURL command",
          "Parse & edit request fields",
          "Run request or generate code",
        ]}
        tip="Editable preview makes this faster than Postman for quick tests"
      />
    </div>
  );
}
