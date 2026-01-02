"use client";

import { useState } from "react";
import Modal from "./Modal";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function RequestToolModal({ open, onClose }: Props) {
  const [tool, setTool] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!tool.trim()) {
      toast.error("Please enter a tool name");
      return;
    }

    if (loading) return;

    setLoading(true);
    const toastId = toast.loading("Submitting your request...");

    try {
      const res = await fetch("/api/email/request-tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool,
          desc,
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Tool request submitted 🚀", { id: toastId });

      setTool("");
      setDesc("");
      onClose();
    } catch {
      toast.error("Failed to submit request. Try again.", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Request a tool">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium">Tool name</label>
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
          disabled={loading}
          className="w-full rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
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
