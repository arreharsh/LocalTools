"use client";

import { useState } from "react";
import Modal from "./Modal";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function RequestToolModal({
  open,
  onClose,
}: Props) {
  const [tool, setTool] = useState("");
  const [desc, setDesc] = useState("");

  const submit = () => {
    if (!tool.trim()) return;

    // later: API / email / notion
    console.log("Tool request:", {
      tool,
      desc,
    });

    setTool("");
    setDesc("");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Request a tool">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium">
            Tool name
          </label>
          <input
            value={tool}
            onChange={(e) => setTool(e.target.value)}
            placeholder="e.g. PDF Watermark"
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-xs font-medium">
            What should it do? (optional)
          </label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Brief description…"
            rows={3}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none resize-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          onClick={submit}
          className="w-full rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground"
        >
          Submit request
        </button>

        <p className="text-xs text-muted-foreground text-center">
          Popular requests get built faster 🚀
        </p>
      </div>
    </Modal>
  );
}
