"use client";

import { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import HowToUse from "@/components/tool/HowToUse";

import { runToolWithGuard } from "@/lib/runToolWithGuard";
import { useAuthModal } from "@/providers/AuthProvider";

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

import { Trash2, Download, FileText } from "lucide-react";

type ImgItem = {
  id: string;
  file: File;
  url: string;
};

function SortableImage({
  item,
  index,
  onDelete,
}: {
  item: ImgItem;
  index: number;
  onDelete: (i: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2 cursor-grab"
    >
      <img
        src={item.url}
        alt=""
        className="h-16 w-16 rounded object-cover border"
      />

      <span className="text-sm flex-1 truncate">{item.file.name}</span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(index);
        }}
        className="p-1.5 border rounded-md"
        title="Remove"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export default function ImagesToPdf() {
  const { open } = useAuthModal(); // ✅ auth modal
  const [images, setImages] = useState<ImgItem[]>([]);
  const [pageSize, setPageSize] = useState<"fit" | "a4">("fit");
  const [orientation, setOrientation] = useState<
    "auto" | "portrait" | "landscape"
  >("auto");
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    })
  );

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));

    const mapped = list.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...mapped]);
  };

  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  };

  /* ---------------- REAL TOOL LOGIC ---------------- */
  const createPdf = async () => {
    if (images.length === 0) return;
    setLoading(true);

    const pdf = await PDFDocument.create();

    for (const img of images) {
      const bytes = await img.file.arrayBuffer();
      const isPng = img.file.type === "image/png";

      const embed = isPng
        ? await pdf.embedPng(bytes)
        : await pdf.embedJpg(bytes);

      let width = embed.width;
      let height = embed.height;

      if (pageSize === "a4") {
        width = 595;
        height = 842;
      }

      if (orientation === "landscape") {
        [width, height] = [height, width];
      }

      const page = pdf.addPage([width, height]);

      const scale = Math.min(width / embed.width, height / embed.height);

      const imgW = embed.width * scale;
      const imgH = embed.height * scale;

      page.drawRectangle({
        x: 0,
        y: 0,
        width,
        height,
        color: rgb(1, 1, 1),
      });

      page.drawImage(embed, {
        x: (width - imgW) / 2,
        y: (height - imgH) / 2,
        width: imgW,
        height: imgH,
      });
    }

    const out = await pdf.save();
    const blob = new Blob([out as BlobPart], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "images.pdf";
    a.click();

    URL.revokeObjectURL(url);
    setLoading(false);
  };

  /* ---------------- GUARDED HANDLER ---------------- */
  const handleCreatePdf = () => {
    runToolWithGuard(createPdf, open);
  };

  return (
    <div className="max-w-4xl w-full md:min-w-8xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Image to PDF</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Convert multiple images into a single PDF
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        {/* Upload */}
        <label className="block rounded-lg border-2 border-dashed border-border p-6 text-center cursor-pointer hover:bg-muted">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <FileText className="mx-auto mb-2 text-primary" size={32} />
          <p className="font-medium">Upload images</p>
          <p className="text-sm text-muted-foreground">
            JPG, PNG, WEBP supported
          </p>
        </label>

        {/* Options */}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">
                Page size
              </label>
              <Select
                value={pageSize}
                onValueChange={(value) => setPageSize(value as any)}
              >
                <SelectTrigger className="border rounded-md px-2 py-1 text-sm">
                  <SelectValue placeholder="Select page size" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="fit">Fit to image</SelectItem>
                  <SelectItem value="a4">A4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">
                Orientation
              </label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as any)}
                className="border rounded-md px-2 py-1 text-sm"
              >
                <option value="auto">Auto</option>
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
          </div>
        )}

        {/* Image list */}
        {images.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e) => {
              const { active, over } = e;
              if (!over || active.id === over.id) return;

              const oldIndex = images.findIndex((i) => i.id === active.id);
              const newIndex = images.findIndex((i) => i.id === over.id);

              setImages(arrayMove(images, oldIndex, newIndex));
            }}
          >
            <SortableContext
              items={images.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {images.map((img, i) => (
                  <SortableImage
                    key={img.id}
                    item={img}
                    index={i}
                    onDelete={removeImage}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Action */}
        {images.length > 0 && (
          <button
            onClick={handleCreatePdf}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm"
          >
            <Download size={16} />
            {loading ? "Creating PDF..." : "Download PDF"}
          </button>
        )}
      </div>

     {/* How to Use */}
      <HowToUse
       className="mt-8"
        steps={[
          "Upload your images using the upload area. You can select multiple images at once.",
          "Arrange the images in your desired order by dragging and dropping them.",
          "Select your preferred page size and orientation for the PDF.",
          "Click on 'Download PDF' to generate and download your PDF file containing the images.",
        ]}
        tip="For best results, use high-resolution images to ensure clarity in the PDF."
      />


    </div>
  );
}
