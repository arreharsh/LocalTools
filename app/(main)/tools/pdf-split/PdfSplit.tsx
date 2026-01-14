"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Trash2, FileText } from "lucide-react";
import HowToUse from "@/components/tool/HowToUse";

export default function PdfSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [range, setRange] = useState("");
  const [mode, setMode] = useState<"range" | "single">("range");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (f: File | null) => {
    if (!f || f.type !== "application/pdf") return;
    setError(null);
    setFile(f);

    const bytes = await f.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    setPageCount(pdf.getPageCount());
  };

  const removeFile = () => {
    setFile(null);
    setPageCount(0);
    setRange("");
    setError(null);
  };

  const parseRanges = (input: string) =>
    input.split(",").map((part) => {
      const [start, end] = part.split("-").map(Number);
      if (!start || !end || start > end) return null;
      return { start: start - 1, end: end - 1 };
    });

  const splitPdf = async () => {
    if (!file) return;
    setError(null);
    setLoading(true);

    try {
      const bytes = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(bytes);

      if (mode === "single") {
        for (let i = 0; i < pageCount; i++) {
          const newPdf = await PDFDocument.create();
          const [page] = await newPdf.copyPages(sourcePdf, [i]);
          newPdf.addPage(page);
          const out = await newPdf.save();
          download(out, `page-${i + 1}.pdf`);
        }
      } else {
        const ranges = parseRanges(range);
        if (!ranges || ranges.some((r) => r === null)) {
          throw new Error("Invalid page range format");
        }

        for (const r of ranges) {
          const newPdf = await PDFDocument.create();
          const pages = await newPdf.copyPages(
            sourcePdf,
            Array.from(
              { length: r!.end - r!.start + 1 },
              (_, i) => r!.start + i
            )
          );
          pages.forEach((p) => newPdf.addPage(p));
          const out = await newPdf.save();
          download(out, `pages-${r!.start + 1}-${r!.end + 1}.pdf`);
        }
      }
    } catch (e: any) {
      setError(e.message || "Failed to split PDF");
    }

    setLoading(false);
  };

  const download = (bytes: Uint8Array, name: string) => {
    const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl w-full md:min-w-8xl mx-auto px-4 py-6">
      {/* HEADING */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">PDF Split</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Split PDF by page range or extract individual pages
        </p>
      </div>

      {/* CARD */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        {/* Upload / Preview */}
        {!file ? (
          <label className="block rounded-lg border-2 border-dashed border-border p-6 text-center cursor-pointer hover:bg-muted">
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] || null)}
            />
            <FileText className="mx-auto mb-2 text-primary" size={32} />
            <p className="font-medium">Click to upload PDF</p>
            <p className="text-sm text-muted-foreground">
              Single PDF only
            </p>
          </label>
        ) : (
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background px-4 py-3">
            <div className="flex items-center gap-3">
              <FileText className="text-primary" size={22} />
              <div>
                <p className="text-sm font-medium truncate max-w-[240px]">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {pageCount} pages • {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>

           
          </div>
        )}

        {/* Mode */}
        {file && (
          <>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={mode === "range"}
                  onChange={() => setMode("range")}
                />
                Split by range
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={mode === "single"}
                  onChange={() => setMode("single")}
                />
                Split every page
              </label>
            </div>

            {mode === "range" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Page ranges (e.g. 1-3,4-6)
                </label>
                <input
                  value={range}
                  onChange={(e) => setRange(e.target.value)}
                  placeholder="1-3,4-6"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono focus:ring-2 focus:ring-ring/30"
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={splitPdf}
                disabled={loading}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm disabled:opacity-50"
              >
                {loading ? "Splitting..." : "Split PDF"}
              </button>

               <button
              onClick={removeFile}
              className="p-2 rounded-md border border-border hover:bg-muted"
              title="Remove PDF"
            >
              <Trash2 size={16} />
            </button>
            </div>
          </>
        )}
      </div>
      <HowToUse
       className="mt-8"
        steps={[
          "Click to upload a PDF file that you want to split.",
          "Choose to split by page range or extract every single page.",
          "Enter the page ranges if splitting by range (e.g. 1-3,4-6).",
          "Click 'Split PDF' to download the resulting PDF files.",
          "Use the remove button to upload a different PDF file.",
        ]}
        tip="This tool splits PDF files entirely on the client side, ensuring your files remain private."
      />
    </div>
  );
}
