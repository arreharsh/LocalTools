"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Trash2, FileText } from "lucide-react";
import HowToUse from "@/components/tool/HowToUse";

import { useAuthModal } from "@/providers/AuthProvider";


type Level = "low" | "medium" | "high";

export default function PdfCompress() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<Level>("medium");
  const [loading, setLoading] = useState(false);
  const { open } = useAuthModal();

  const [error, setError] = useState<string | null>(null);

  const handleFile = (f: File | null) => {
    if (!f || f.type !== "application/pdf") return;
    setError(null);
    setFile(f);
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
  };

  const compressPdf = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);

      let scale = 1;
      if (level === "medium") scale = 0.85;
      if (level === "high") scale = 0.7;

      const newPdf = await PDFDocument.create();
      const pages = await newPdf.copyPages(pdf, pdf.getPageIndices());

      pages.forEach((p) => {
        p.scale(scale, scale);
        newPdf.addPage(p);
      });

      const out = await newPdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      download(out, file.name.replace(".pdf", "-compressed.pdf"));
    } catch {
      setError("Failed to compress PDF");
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
        <h1 className="text-2xl font-semibold">PDF Compress</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Reduce PDF size directly in your browser
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
              Single PDF supported
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
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>

            
          </div>
        )}

        {/* Compression level */}
        {file && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Compression level
              </label>
              <div className="flex gap-2">
                {(["low", "medium", "high"] as Level[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`px-4 py-2 rounded-md border text-sm capitalize ${
                      level === l
                        ? "bg-primary text-primary-foreground"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* HONEST NOTE + SIGNUP */}
            <div className="rounded-md border border-border bg-muted px-3 py-2 text-xs">
              <p className="text-muted-foreground">
                This tool uses browser-based compression. Best results for
                image-heavy PDFs.
              </p>
              <p className="mt-1 font-medium">
                Advanced compression requires  {' '} 
                <a href=""
                className="underline underline-offset-2 text-md text-pink-600 cursor-pointer">
                  Signup.</a>
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            {/* Action */}
            <div className="flex gap-2">
              <button
                onClick={compressPdf}
                disabled={loading}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm disabled:opacity-50"
              >
                {loading ? "Compressing..." : "Compress PDF"}
              </button>

              {/* Trash button */}
             
             <button
              onClick={removeFile}
              className="p-2 rounded-md border border-border hover:bg-muted"
              title="Remove PDF">
              <Trash2 size={16} />
              </button>

            </div>
          </>
        )}
      </div>
      <HowToUse
       className="mt-8"
        steps={[
          "Click to upload a PDF file that you want to compress.",
          "Choose the desired compression level: low, medium, or high.",
          "Click 'Compress PDF' to download the compressed PDF file.",
          "Use the remove button to upload a different PDF file.",
        ]}
        tip="This tool compresses PDF files directly in your browser, ensuring your files remain private."
      />
    </div>
  );
}
