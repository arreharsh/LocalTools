"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { GripVertical, Trash2, FileText } from "lucide-react";
import HowToUse from "@/components/tool/HowToUse";

type PdfFile = {
  file: File;
  id: string;
};

export default function PdfMerge() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const generateId = () =>
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    const pdfs = Array.from(list)
      .filter((f) => f.type === "application/pdf")
      .map((f) => ({
        file: f,
        id: generateId(),
      }));

    setFiles((prev) => [...prev, ...pdfs]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= files.length) return;
    const updated = [...files];
    const [item] = updated.splice(from, 1);
    updated.splice(to, 0, item);
    setFiles(updated);
  };

  /* DRAG HANDLERS */
  const onDragStart = (index: number) => {
    setDragIndex(index);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    move(dragIndex, index);
    setDragIndex(null);
  };

  const mergePdfs = async () => {
    if (files.length < 2) return;

    setLoading(true);
    const merged = await PDFDocument.create();

    for (const item of files) {
      const bytes = await item.file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pages = await merged.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((p) => merged.addPage(p));
    }

    const mergedBytes = await merged.save();
    const blob = new Blob([mergedBytes.slice(0)], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "localtools-merged.pdf";
    a.click();

    URL.revokeObjectURL(url);
    setLoading(false);
  };

  const clearAll = () => setFiles([]);

  return (
    <div className="max-w-4xl w-full md:min-w-8xl mx-auto px-4 py-6">
      {/* PAGE HEADING */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">PDF Merge</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Combine multiple PDF files into one — fully client-side
        </p>
      </div>

      {/* CARD */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        {/* Upload */}
        <label className="block rounded-lg border-2 border-dashed border-border p-6 text-center cursor-pointer hover:bg-muted">
          <input
            type="file"
            multiple
            accept="application/pdf"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <FileText className="mx-auto mb-2 text-primary" size={32} />
          <p className="font-medium">Click to upload PDFs</p>
          <p className="text-sm text-muted-foreground">
            or drag & drop (multiple allowed)
          </p>
        </label>

        {/* File list */}
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => onDragStart(index)}
                onDragOver={onDragOver}
                onDrop={() => onDrop(index)}
                className={`flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2 cursor-move ${
                  dragIndex === index ? "opacity-50" : ""
                }`}
              >
                <GripVertical
                  className="text-muted-foreground"
                  size={16}
                />

                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium">
                    {item.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(item.file.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => move(index, index - 1)}
                    className="px-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => move(index, index + 1)}
                    className="px-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    ↓
                  </button>
                </div>

                <button
                  onClick={() => removeFile(item.id)}
                  className="p-1.5 rounded-md border border-border hover:bg-muted"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={mergePdfs}
            disabled={files.length < 2 || loading}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm disabled:opacity-50"
          >
            {loading ? "Merging..." : "Merge PDFs"}
          </button>

          <button
            onClick={clearAll}
            disabled={files.length === 0}
            className="px-4 py-2 rounded-md border border-border text-sm hover:bg-muted disabled:opacity-50"
          >
            Clear
          </button>
        </div>
      </div>
      <HowToUse
       className="mt-8"
        steps={[
          "Click to upload multiple PDF files or drag & drop them into the upload area.",
          "Reorder the files by dragging or using the up/down buttons to set the merge order.",
          "Click 'Merge PDFs' to combine the selected files into a single PDF document.",
          "Use the 'Clear' button to remove all uploaded files and start over.",
        ]}
        tip="This tool merges multiple PDF files entirely on the client side, ensuring your files remain private."
      />
    </div>
  );
}


 