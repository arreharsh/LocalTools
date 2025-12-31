"use client";

import { useEffect, useRef, useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import HowToUse from "@/components/tool/HowToUse";
import { runToolWithGuard } from "@/lib/runToolWithGuard";
import { useAuthModal } from "@/providers/AuthProvider";


/* PDF.js */
import * as pdfjsLib from "pdfjs-dist";

/* DND KIT */
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* Icons */
import { RotateCw, Trash2, Download, FileText } from "lucide-react";

/* ✅ Next.js safe worker */
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

/* ---------- TYPES ---------- */
type PageItem = {
  id: string;
  index: number;
  rotation: number;
  orientation: "portrait" | "landscape";
};

/* ---------- SORTABLE PAGE ITEM ---------- */
function SortablePage({
  page,
  index,
  selected,
  onSelect,
  onRotate,
  onToggleOrientation,
  onDelete,
}: {
  page: PageItem;
  index: number;
  selected: boolean;
  onSelect: (i: number) => void;
  onRotate: (i: number) => void;
  onToggleOrientation: (i: number) => void;
  onDelete: (i: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect(index)}
      {...(isMobile ? { ...attributes, ...listeners } : {})}
      className={` flex items-center gap-3 rounded-md border px-3 py-2 cursor-pointer ${
        selected
          ? "border-primary bg-muted"
          : "border-border bg-background"
      }`}
    >
      {/* DRAG HANDLE (DESKTOP ONLY) */}
      {!isMobile && (
        <div
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="cursor-grab touch-none text-muted-foreground"
          title="Drag to reorder"
        >
          ⠿
        </div>
      )}

      <span className="text-sm flex-1">
        Page {page.index + 1}
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onRotate(index);
        }}
        className="p-1.5 border rounded-md"
        title="Rotate"
      >
        <RotateCw size={14} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleOrientation(index);
        }}
        className="px-2 py-1 text-xs border rounded-md"
        title="Toggle orientation"
      >
        {page.orientation === "portrait"
          ? "Landscape"
          : "Portrait"}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(index);
        }}
        className="p-1.5 border rounded-md"
        title="Delete page"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

/* ---------- MAIN COMPONENT ---------- */
export default function PdfPageReorder() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { open } = useAuthModal();


  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  /* ✅ MOBILE-FRIENDLY SENSORS */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // long press
        tolerance: 5,
      },
    })
  );

  /* ---------- FILE LOAD ---------- */
  const handleFile = async (f: File | null) => {
    if (!f || f.type !== "application/pdf") return;

    setFile(f);
    setSelected(null);

    const bytes = await f.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);

    setPages(
      pdf.getPages().map((_, i) => ({
        id: `${Date.now()}-${i}`,
        index: i,
        rotation: 0,
        orientation: "portrait",
      }))
    );
  };

 const handleApplyChanges = async () => {
  try {
    const res = await fetch("/api/run-tool", {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok || !data.allowed) {
      if (data.reason === "IP_UNAVAILABLE" || data.plan === "guest") {
        alert("Guest limit reached. Please log in to continue.");
        open(); // auth modal
      } else {
        alert("Daily limit reached. Upgrade to Pro for unlimited access.");
      }
      return;
    }

    // ✅ allowed → ORIGINAL LOGIC
    applyChanges();
  } catch (err: any) {
    console.error(err);
    alert("Action failed: " + (err.message || "Unknown error"));
  }
};


  /* ---------- PAGE ACTIONS ---------- */
  const rotatePage = (i: number) => {
    setPages((p) =>
      p.map((x, idx) =>
        idx === i
          ? { ...x, rotation: (x.rotation + 90) % 360 }
          : x
      )
    );
  };

  const toggleOrientation = (i: number) => {
    setPages((p) =>
      p.map((x, idx) =>
        idx === i
          ? {
              ...x,
              orientation:
                x.orientation === "portrait"
                  ? "landscape"
                  : "portrait",
            }
          : x
      )
    );
  };

  const removePage = (i: number) => {
    setPages((p) => p.filter((_, idx) => idx !== i));
    setSelected(null);
  };

  /* ---------- DESKTOP PREVIEW ---------- */
  useEffect(() => {
    if (selected === null || !file || !canvasRef.current) return;

    const render = async () => {
      const data = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data }).promise;
      const page = await pdf.getPage(pages[selected].index + 1);

      const viewport = page.getViewport({
        scale: 1.2,
        rotation: pages[selected].rotation,
      });

      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport, canvas }).promise;
    };

    render();
  }, [selected, pages, file]);

  /* ---------- APPLY & DOWNLOAD ---------- */
  const applyChanges = async () => {
    if (!file) return;
    setLoading(true);

    const bytes = await file.arrayBuffer();
    const source = await PDFDocument.load(bytes);
    const outPdf = await PDFDocument.create();

    for (const p of pages) {
      const [page] = await outPdf.copyPages(source, [p.index]);

      page.setRotation(degrees(p.rotation));

      if (p.orientation === "landscape") {
        const { width, height } = page.getSize();
        if (height > width) page.setSize(height, width);
      }

      outPdf.addPage(page);
    }

    const out = await outPdf.save();
    const blob = new Blob([new Uint8Array(out)], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "reordered.pdf";
    a.click();

    URL.revokeObjectURL(url);
    setLoading(false);
  };

  /* ---------- UI ---------- */
  return (
    <div className="max-w-4xl w-full md:min-w-8xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          PDF Page Reorder & Rotate
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Touch-drag anywhere on mobile, click to preview on desktop
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* PAGE LIST */}
        <div className="md:col-span-3 space-y-2">
          {!file ? (
            <label className="block rounded-lg border-2 border-dashed border-border p-6 text-center cursor-pointer hover:bg-muted">
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) =>
                  handleFile(e.target.files?.[0] || null)
                }
              />
             <FileText className="mx-auto mb-2 text-primary" size={32} />
              <p className="font-medium">Upload PDF</p>
            </label>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) => {
                const { active, over } = e;
                if (!over || active.id === over.id) return;

                const oldIndex = pages.findIndex(
                  (p) => p.id === active.id
                );
                const newIndex = pages.findIndex(
                  (p) => p.id === over.id
                );

                setPages(arrayMove(pages, oldIndex, newIndex));
              }}
            >
              <SortableContext
                items={pages.map((p) => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {pages.map((p, i) => (
                    <SortablePage
                      key={p.id}
                      page={p}
                      index={i}
                      selected={selected === i}
                      onSelect={setSelected}
                      onRotate={rotatePage}
                      onToggleOrientation={toggleOrientation}
                      onDelete={removePage}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* PREVIEW (DESKTOP ONLY) */}
        <div className="hidden md:block md:col-span-2 border-l border-border pl-4">
          {selected === null ? (
            <p className="text-sm text-muted-foreground">
              Select a page to preview
            </p>
          ) : (
            <>
              <canvas
                ref={canvasRef}
                className="w-full rounded-md border"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Preview is for reference only
              </p>
            </>
          )}
        </div>
      </div>

      {pages.length > 0 && (
        <button
          onClick={handleApplyChanges}
          disabled={loading}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm"
        >
          <Download size={16} />
          {loading ? "Processing..." : "Download PDF"}
        </button>
      )}

        {/* HOW TO USE */}
        <HowToUse
        className="mt-8"
        steps={[
          "Upload a PDF file",
          "Drag and drop pages to reorder them",
          "Select a page to preview, rotate, change orientation, or delete it",
          "Click 'Download PDF' to save the changes",
        ]}
        tip="You can touch-drag pages on mobile devices for easier reordering."
      />
    </div>
  );
}
