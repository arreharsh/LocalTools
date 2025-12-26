"use client";

import { useMemo, useState } from "react";
import { Copy, AlertTriangle } from "lucide-react";
import HowToUse from "@/components/tool/HowToUse";

/* ---------------- utils ---------------- */
function cleanToken(token: string) {
  return token.replace(/\s+/g, "");
}

function base64UrlDecode(part: string) {
  try {
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + (4 - (base64.length % 4)) % 4,
      "="
    );
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

function formatTs(ts?: number) {
  if (!ts) return "—";
  return new Date(ts * 1000).toLocaleString();
}

/* ---------------- page ---------------- */
export default function JwtDecoderPro() {
  const [rawToken, setRawToken] = useState("");
  const token = useMemo(() => cleanToken(rawToken), [rawToken]);

  const parts = useMemo(() => token.split("."), [token]);
  const hasToken = token.length > 0;
  const valid = hasToken && parts.length === 3;

  const header = useMemo(
    () => (valid ? base64UrlDecode(parts[0]) : null),
    [valid, parts]
  );
  const payload = useMemo(
    () => (valid ? base64UrlDecode(parts[1]) : null),
    [valid, parts]
  );

  const decoded = !!header && !!payload;

  const isExpired =
    typeof payload?.exp === "number"
      ? Date.now() / 1000 > payload.exp
      : false;

  const error =
    hasToken && !valid
      ? "Invalid JWT format (expected 3 dot-separated parts)"
      : hasToken && valid && !decoded
      ? "Unable to decode JWT payload"
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      {/* TITLE (NO LOGO) */}
      <div>
        <h1 className="text-3xl font-semibold">JWT Decoder</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Decode and inspect JWTs locally. No data leaves your browser.
        </p>
      </div>

      {/* INPUT */}
      <div className="rounded-md border bg-card p-6 space-y-3">
        <label className="text-sm font-medium">JWT Token</label>

        <textarea
          value={rawToken}
          onChange={(e) => setRawToken(e.target.value)}
          placeholder="Paste JWT token here"
          className="w-full min-h-[130px] resize-none rounded-md border bg-background p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />

        {!hasToken && (
          <p className="text-sm text-muted-foreground">
            Paste a JWT token to decode
          </p>
        )}

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-500">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>

      {/* DECODED */}
      {decoded && (
        <>
          {/* EXPIRED */}
          {isExpired && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-4">
              <p className="font-medium text-red-500">Token Expired</p>
              <p className="text-sm text-red-400">
                Expired on {formatTs(payload.exp)}
              </p>
            </div>
          )}

          {/* HEADER + PAYLOAD */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SimpleCard title="Header" data={header}>
              <Meta label="Algorithm" value={header.alg} />
              <Meta label="Type" value={header.typ} />
            </SimpleCard>

            <SimpleCard title="Payload" data={payload}>
              <Meta label="Issued At" value={formatTs(payload.iat)} />
              <Meta
                label="Expires"
                value={formatTs(payload.exp)}
                danger={isExpired}
              />
            </SimpleCard>
          </div>

          {/* SIGNATURE */}
          <div className="rounded-xl border bg-card">
            <div className="px-5 py-4 border-b">
              <h3 className="font-medium">Signature</h3>
            </div>
            <pre className="px-5 py-4 text-xs font-mono break-all text-muted-foreground">
              {parts[2]}
            </pre>
          </div>
        </>
      )}
      {/* HOW TO USE */}
      <HowToUse steps={[
        "Paste your JWT token into the input field.",
        "The tool will decode the token and display the header and payload in a readable format.",

      ]} 
      tip="Ensure your JWT token is correctly formatted with three parts separated by dots."   
   
      /> 
    </div>
  );
}

/* ---------------- UI HELPERS ---------------- */
function SimpleCard({
  title,
  data,
  children,
}: {
  title: string;
  data: any;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border bg-card">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <h3 className="font-medium">{title}</h3>
        <CopyBtn value={data} />
      </div>

      {/* JSON */}
      <pre className="px-5 py-4 text-sm font-mono overflow-auto max-h-[320px]">
        {JSON.stringify(data, null, 2)}
      </pre>

      {/* SEPARATOR */}
      <div className="border-t" />

      {/* META */}
      <div className="grid grid-cols-2 gap-4 px-5 py-4 mt-3 text-sm">
        {children}
      </div>
    </div>
  );
}

function Meta({
  label,
  value,
  danger,
}: {
  label: string;
  value?: string;
  danger?: boolean;
}) {
  return (
    <div>
      <div className="text-muted-foreground">{label}</div>
      <div className={`font-medium ${danger ? "text-red-500" : ""}`}>
        {value || "—"}
      </div>
    </div>
  );
}

function CopyBtn({ value }: { value: any }) {
  return (
    <button
      onClick={() =>
        navigator.clipboard.writeText(JSON.stringify(value, null, 2))
      }
      className="text-xs text-muted-foreground hover:text-foreground transition"
    >
      <Copy className="w-3 h-3 inline mr-1" />
      Copy
    </button>
  );
}

