"use client";

import { useState } from "react";
import { Play, Copy, Loader2, Globe, AlertTriangle } from "lucide-react";
import HowToUse from "@/components/tool/HowToUse";
// @ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-ignore
import {oneDark,oneLight,} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import BackBtn from "@/components/ui/backbtn";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ---------------- TYPES ---------------- */
type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type Tab = "headers" | "body";

const METHODS: Method[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];
/* ---------------- PAGE ---------------- */
export default function ApiResponseViewer() {
  const { theme } = useTheme();

  const [url, setUrl] = useState(
    "https://jsonplaceholder.typicode.com/posts/1"
  );
  const [method, setMethod] = useState<Method>("GET");
  const [activeTab, setActiveTab] = useState<Tab>("headers");

  const [headers, setHeaders] = useState(`{
  "Content-Type": "application/json"
}`);
  const [body, setBody] = useState(`{
  "title": "foo",
  "body": "bar",
  "userId": 1
}`);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [responseBody, setResponseBody] = useState<any>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [time, setTime] = useState<number | null>(null);

  /* ---------------- SEND REQUEST ---------------- */
  const sendRequest = async () => {
    setError(null);
    setResponseBody(null);
    setStatus(null);
    setTime(null);

    // parse headers
    let parsedHeaders: Record<string, string> = {};
    try {
      parsedHeaders = headers ? JSON.parse(headers) : {};
    } catch {
      setError("Invalid headers JSON");
      return;
    }

    // parse body (non-GET)
    let parsedBody: any = undefined;
    if (method !== "GET") {
      try {
        parsedBody = body ? JSON.parse(body) : {};
      } catch {
        setError("Invalid request body JSON");
        return;
      }
    }

    try {
      setLoading(true);
      const start = performance.now();

      const res = await fetch(url, {
        method,
        headers: parsedHeaders,
        body: method !== "GET" ? JSON.stringify(parsedBody) : undefined,
      });

      const end = performance.now();

      setStatus(res.status);
      setTime(Math.round(end - start));

      const text = await res.text();
      try {
        setResponseBody(JSON.parse(text));
      } catch {
        setResponseBody(text);
      }
    } catch {
      setError("Request failed. Possible CORS or network error.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-7xl xl:max-w-screen-2xl mx-auto px-4 py-4 space-y-8 no-scrollbar ">
      <div>
        <h1 className="text-3xl font-semibold">API Response Viewer</h1>
        <p className="text-muted-foreground mt-1">
          Send API requests and inspect responses with a clean, readable
          interface.
        </p>
      </div>

      {/* REQUEST SECTION */}
      <div className="rounded-xl border bg-card p-6 space-y-4 max-h-[70vh] overflow-hidden">
        {/* URL + Method */}
        <div className="flex flex-col lg:flex-row gap-3">
          <Select
            value={method}
            onValueChange={(value) => {
              if (!METHODS.includes(value as Method)) return;

              setMethod(value as Method);

              if (value === "GET") {
                setActiveTab("headers");
              }
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
            placeholder="https://api.example.com/data"
            className="flex-1 border rounded-md bg-background px-3 py-2 text-sm"
          />

          <button
            onClick={sendRequest}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm hover:opacity-90"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            Send Request
          </button>
        </div>

        {/* TABS */}
        <div className="border-b flex gap-6 text-sm">
          <button
            onClick={() => setActiveTab("headers")}
            className={`pb-2 ${
              activeTab === "headers"
                ? "border-b-2 border-primary text-primary font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Headers
          </button>

          {method !== "GET" && (
            <button
              onClick={() => setActiveTab("body")}
              className={`pb-2 ${
                activeTab === "body"
                  ? "border-b-2 border-primary text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Body
            </button>
          )}
        </div>

        {/* TAB CONTENT */}
        {activeTab === "headers" && (
          <div>
            <label className="text-sm font-medium">Headers (JSON)</label>
            <textarea
              value={headers}
              onChange={(e) => setHeaders(e.target.value)}
              className="mt-1 w-full min-h-[140px] resize-none rounded-md border bg-background p-3 font-mono text-sm"
            />
          </div>
        )}

        {activeTab === "body" && method !== "GET" && (
          <div>
            <label className="text-sm font-medium">Body (JSON)</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="mt-1 w-full min-h-[160px] resize-none rounded-md border bg-background p-3 font-mono text-sm"
            />
          </div>
        )}
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 px-5 py-4 flex items-center gap-2 text-red-500 text-sm">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* RESPONSE */}
      <div className="rounded-xl border bg-card p-6">
        {/* Response Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 text-sm">
            <Globe className="w-4 h-4 text-primary" />
            {status !== null && (
              <span
                className={`font-medium ${
                  status >= 200 && status < 300
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                Status: {status}
              </span>
            )}
            {time !== null && (
              <span className="text-muted-foreground">Time: {time} ms</span>
            )}
          </div>

          {responseBody && (
            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  typeof responseBody === "string"
                    ? responseBody
                    : JSON.stringify(responseBody, null, 2)
                )
              }
              className="text-sm flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <Copy className="w-4 h-4" />
              Copy Response
            </button>
          )}
        </div>

        {/* RESPONSE BODY (LOCKED SIZE) */}
        <div className="relative h-[300px] w-full overflow-hidden rounded-md border bg-background">
          {!responseBody ? (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
              No response yet. Send a request to view response.
            </div>
          ) : (
            <div className="absolute inset-0 overflow-auto">
              <div className="min-w-0 max-w-full">
                <SyntaxHighlighter
                  language="json"
                  wrapLongLines
                  style={theme === "dark" ? oneDark : oneLight}
                  customStyle={{
                    margin: 0,
                    background: "transparent",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                    width: "100%",
                    maxWidth: "100%",
                    fontSize: "13px",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {typeof responseBody === "string"
                    ? responseBody
                    : JSON.stringify(responseBody, null, 2)}
                </SyntaxHighlighter>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* HOW TO USE */}
      <HowToUse
        steps={[
          "Enter API URL and select HTTP method",
          "Add headers or body using tabs",
          "Send request and inspect response",
        ]}
        tip="Request history will be available after login"
      />
    </div>
  );
}
