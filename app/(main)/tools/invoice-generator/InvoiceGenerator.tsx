"use client";

import { useState, useEffect } from "react";
import { Download, Plus, Trash2, AlertCircle, Palette } from "lucide-react";
import { useAuthModal } from "@/providers/AuthProvider";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import HowToUse from "@/components/tool/HowToUse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Types
type Item = { id: string; description: string; qty: number; rate: number };
type Company = { name: string; email: string; address: string };

const CURRENCIES = [
  { symbol: "INR", name: "Indian Rupee (INR)" },
  { symbol: "$", name: "USD" },
  { symbol: "€", name: "EUR" },
  { symbol: "£", name: "GBP" },
];

// Indian number format helper
const formatINR = (num: number) =>
  num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// Simple date formatter
const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return "";
  }
};

export default function InvoiceGenerator() {
  const [mounted, setMounted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [invoiceNo, setInvoiceNo] = useState("INV-LT001");
  const [invoiceDate, setInvoiceDate] = useState("");
  const { open } = useAuthModal();
  const [dueDate, setDueDate] = useState("");
  const [fromInfo, setFromInfo] = useState<Company>({
    name: "",
    email: "",
    address: "",
  });
  const [billTo, setBillTo] = useState<Company>({
    name: "",
    email: "",
    address: "",
  });
  const [items, setItems] = useState<Item[]>([
    { id: "1", description: "", qty: 1, rate: 0 },
  ]);
  const [tax, setTax] = useState(18);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("Thank you for your business!");
  const [currency, setCurrency] = useState("INR");
  const [isBlackWhite, setIsBlackWhite] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    const today = new Date().toISOString().slice(0, 10);
    const due = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
    setInvoiceDate(today);
    setDueDate(due);
  }, []);

  // Calculations (real-time update ke liye useMemo use kiya)
  const subtotal = items.reduce(
    (s, i) => s + (Number(i.qty) || 0) * (Number(i.rate) || 0),
    0
  );
  const discountAmount = (subtotal * discount) / 100;
  const taxAmount = ((subtotal - discountAmount) * tax) / 100;
  const total = subtotal - discountAmount + taxAmount;

  const validate = () => {
    const errs: string[] = [];
    if (!invoiceNo.trim()) errs.push("Invoice number required");
    if (!fromInfo.name.trim()) errs.push("Your company name required");
    if (!billTo.name.trim()) errs.push("Client name required");
    if (items.some((i) => !i.description.trim()))
      errs.push("All items need description");
    if (items.some((i) => i.qty <= 0 || i.rate < 0))
      errs.push("Check quantity & rate");
    if (!invoiceDate) errs.push("Invoice date required");
    if (!dueDate) errs.push("Due date required");
    setErrors(errs);
    return errs.length === 0;
  };

  const generatePDF = async () => {
    if (!validate()) return;

    setIsGenerating(true);
    try {
      const doc = new jsPDF({ unit: "mm", format: "a4" });

      const currencyDisplay = currency === "INR" ? "INR" : currency;
      const primaryColor: [number, number, number] = isBlackWhite
        ? [0, 0, 0]
        : [29, 78, 216];
      const bgColor: [number, number, number] = isBlackWhite
        ? [245, 245, 245]
        : [239, 246, 255];

      // ===== HEADER =====
      doc.setFont("helvetica", "bold");
      doc.setFontSize(32);
      doc.setTextColor(...primaryColor);
      doc.text("INVOICE", 20, 30);

      // ===== INVOICE META =====
      doc.setFontSize(9);
      doc.setTextColor(102, 102, 102);
      doc.setFont("helvetica", "normal");
      doc.text("INVOICE NO.", 20, 50);

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text(invoiceNo, 20, 56);

      doc.setFontSize(9);
      doc.setTextColor(102, 102, 102);
      doc.setFont("helvetica", "normal");
      doc.text("DATE", 160, 50);

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text(formatDate(invoiceDate), 160, 56);

      doc.setFontSize(9);
      doc.setTextColor(102, 102, 102);
      doc.setFont("helvetica", "normal");
      doc.text("DUE DATE", 160, 64);

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text(formatDate(dueDate), 160, 70);

      // ===== FROM =====
      doc.setFontSize(9);
      doc.setTextColor(102, 102, 102);
      doc.setFont("helvetica", "bold");
      doc.text("FROM", 20, 80);

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(fromInfo.name || "Your Company", 20, 86);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      let yPos = 92;

      if (fromInfo.email) {
        doc.text(fromInfo.email, 20, yPos);
        yPos += 5;
      }
      if (fromInfo.address) {
        const lines = doc.splitTextToSize(fromInfo.address, 80);
        doc.text(lines, 20, yPos);
      }

      // ===== BILL TO =====
      doc.setFontSize(9);
      doc.setTextColor(102, 102, 102);
      doc.setFont("helvetica", "bold");
      doc.text("BILL TO", 110, 80);

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(billTo.name || "Client", 110, 86);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      yPos = 92;

      if (billTo.email) {
        doc.text(billTo.email, 110, yPos);
        yPos += 5;
      }
      if (billTo.address) {
        const lines = doc.splitTextToSize(billTo.address, 80);
        doc.text(lines, 110, yPos);
      }

      // ===== TABLE =====
      const tableData = items.map((item) => [
        item.description || "-",
        item.qty.toString(),
        `${currencyDisplay} ${formatINR(item.rate)}`,
        `${currencyDisplay} ${formatINR(item.qty * item.rate)}`,
      ]);

      autoTable(doc, {
        startY: 115,
        margin: { left: 20, right: 20 },

        head: [["Description", "Qty", "Rate", "Amount"]],
        body: tableData,
        theme: "plain",

        headStyles: {
          fillColor: bgColor,
          textColor: [0, 0, 0],
          fontStyle: "bold",
          fontSize: 10,
          cellPadding: { top: 5, bottom: 5, left: 5, right: 5 },
        },

        bodyStyles: {
          fontSize: 10,
          cellPadding: { top: 6, bottom: 6, left: 6, right: 6 },
        },

        styles: {
          lineColor: [226, 232, 240],
          lineWidth: 0.25,
        },

        columnStyles: {
          0: { cellWidth: 80, halign: "left" },
          1: { cellWidth: 20, halign: "center" },
          2: { cellWidth: 35, halign: "right" },
          3: { cellWidth: 35, halign: "right" },
        },
      });

      const finalY = (doc as any).lastAutoTable.finalY + 16;
      const totalsX = 124;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);

      doc.text("Subtotal", totalsX, finalY);
      doc.text(`${currencyDisplay} ${formatINR(subtotal)}`, 190, finalY, {
        align: "right",
      });

      if (discount > 0) {
        doc.text(`Discount (${discount}%)`, totalsX, finalY + 6);
        doc.text(
          `-${currencyDisplay} ${formatINR(discountAmount)}`,
          190,
          finalY + 6,
          { align: "right" }
        );
      }

      const taxY = discount > 0 ? finalY + 12 : finalY + 6;
      doc.text(`Tax (${tax}%)`, totalsX, taxY);
      doc.text(`+${currencyDisplay} ${formatINR(taxAmount)}`, 190, taxY, {
        align: "right",
      });

      const totalY = discount > 0 ? finalY + 18 : finalY + 12;
      doc.setLineWidth(0.5);
      doc.setDrawColor(...primaryColor);
      doc.line(totalsX, totalY, 190, totalY);

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...primaryColor);
      doc.text("Total", totalsX, totalY + 8);
      doc.text(`${currencyDisplay} ${formatINR(total)}`, 190, totalY + 8, {
        align: "right",
      });

      if (notes.trim()) {
        const notesY = totalY + 22;
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text("Notes", 20, notesY);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(85, 85, 85);
        const notesLines = doc.splitTextToSize(notes, 160);
        doc.text(notesLines, 20, notesY + 5);
      }

      doc.save(`${invoiceNo}.pdf`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);

    try {
      // 🔒 RPC usage guard
      const res = await fetch("/api/run-tool", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.allowed) {
        if (data.reason === "IP_UNAVAILABLE" || data.plan === "guest") {
          alert("Guest limit reached. Please log in to continue.");
          open();
        } else {
          alert("Daily limit reached. Upgrade to Pro for unlimited access.");
        }
        return;
      }

      // ✅ allowed → ORIGINAL PDF GENERATION LOGIC
      await generatePDF();
    } catch (err: any) {
      console.error(err);
      alert("Invoice generation failed: " + (err.message || "Unknown error"));
    } finally {
      setIsGenerating(false);
    }
  };

  const addItem = () =>
    setItems([
      ...items,
      { id: Date.now().toString(), description: "", qty: 1, rate: 0 },
    ]);

  const updateItem = (
    id: string,
    field: keyof Item,
    value: string | number
  ) => {
    setItems(
      items.map((i) =>
        i.id === id
          ? {
              ...i,
              [field]:
                field === "description"
                  ? value
                  : Math.max(0, Number(value) || 0), // Safe number conversion
            }
          : i
      )
    );
  };

  const removeItem = (id: string) =>
    items.length > 1 && setItems(items.filter((i) => i.id !== id));

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background py-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-8 mb-8">
          <h1 className="text-2xl font-bold text-start">Invoice Generator</h1>
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-8 mb-8">
        <h1 className="text-2xl font-bold text-start">Invoice Generator</h1>
        <p className="text-muted-foreground text-sm">
          Generate professional invoices in minutes.
        </p>
      </div>
      <div className="max-w-3xl mx-auto">
        {errors.length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 shadow-sm">
            <div className="flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800">Please fix:</h3>
                <ul className="list-disc pl-5 mt-1 text-sm text-red-700">
                  {errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        <div className="bg-background rounded-md shadow-xl p-6 sm:p-8 space-y-7 border border-border">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-bold">Invoice</h1>
            <div className="flex items-center gap-4">
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="px-4 py-2 font-medium text-sm">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.symbol} value={c.symbol}>
                      {c.symbol} {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Invoice No + Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Invoice No.
              </label>
              <input
                className="w-[200px] px-3 py-2 border rounded-md text-base font-medium"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                placeholder="INV-0001"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-md"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-md"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* From & Bill To */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">
                From
              </h3>
              <input
                placeholder="Company Name *"
                className="w-full px-3 py-2 border rounded-md mb-2 text-sm"
                value={fromInfo.name}
                onChange={(e) =>
                  setFromInfo({ ...fromInfo, name: e.target.value })
                }
              />
              <input
                placeholder="Email"
                type="email"
                className="w-full px-3 py-2 border rounded-md mb-2 text-sm"
                value={fromInfo.email}
                onChange={(e) =>
                  setFromInfo({ ...fromInfo, email: e.target.value })
                }
              />
              <textarea
                placeholder="Address"
                rows={2}
                className="w-full px-3 py-2 border rounded-md text-sm"
                value={fromInfo.address}
                onChange={(e) =>
                  setFromInfo({ ...fromInfo, address: e.target.value })
                }
              />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">
                Bill To
              </h3>
              <input
                placeholder="Client Name *"
                className="w-full px-3 py-2 border rounded-md mb-2 text-sm"
                value={billTo.name}
                onChange={(e) => setBillTo({ ...billTo, name: e.target.value })}
              />
              <input
                placeholder="Email"
                type="email"
                className="w-full px-3 py-2 border rounded-md mb-2 text-sm"
                value={billTo.email}
                onChange={(e) =>
                  setBillTo({ ...billTo, email: e.target.value })
                }
              />
              <textarea
                placeholder="Address"
                rows={2}
                className="w-full px-3 py-2 border rounded-md text-sm"
                value={billTo.address}
                onChange={(e) =>
                  setBillTo({ ...billTo, address: e.target.value })
                }
              />
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">
              Items
            </h3>
            <div className="border rounded-md overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-background-dark">
                  <tr>
                    <th className="text-left py-2 px-3">Description</th>
                    <th className="text-center py-2 px-3 w-20">Qty</th>
                    <th className="text-center py-2 px-3 w-28">Rate</th>
                    <th className="text-right py-2 px-3 w-32">Amount</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-t hover:bg-input">
                      <td className="py-2 px-3">
                        <input
                          className="w-full outline-none bg-transparent placeholder:font-semibold"
                          value={item.description}
                          onChange={(e) =>
                            updateItem(item.id, "description", e.target.value)
                          }
                          placeholder="Item description"
                        />
                      </td>
                      <td className="py-2 px-3 text-center">
                        <input
                          type="number"
                          min="1"
                          className="w-16 text-center outline-none bg-transparent"
                          value={item.qty}
                          onChange={(e) =>
                            updateItem(item.id, "qty", e.target.value)
                          }
                        />
                      </td>
                      <td className="py-2 px-3 text-center">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="w-24 text-center outline-none bg-transparent"
                          value={item.rate}
                          onChange={(e) =>
                            updateItem(item.id, "rate", e.target.value)
                          }
                        />
                      </td>
                      <td className="py-2 px-3 text-right font-medium">
                        {currency === "INR" ? "INR" : currency}{" "}
                        {formatINR(
                          (Number(item.qty) || 0) * (Number(item.rate) || 0)
                        )}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={items.length === 1}
                          className="text-red-500 hover:text-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={addItem}
                className="w-full py-3 bg-background border-t border-border hover:bg-background-dark text-accent font-medium flex items-center justify-center gap-2 text-sm transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>
          </div>

          {/* Totals + Notes */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">
                Notes
              </label>
              <textarea
                className="w-full px-3 py-2 border rounded-md min-h-20 text-sm"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes..."
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>
                  {currency === "INR" ? "INR" : currency} {formatINR(subtotal)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Discount</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-16 text-center border rounded px-2 py-1 text-sm"
                    value={discount}
                    onChange={(e) =>
                      setDiscount(
                        Math.min(100, Math.max(0, Number(e.target.value) || 0))
                      )
                    }
                  />
                  <span className="text-sm">%</span>
                  <span className="text-red-600 text-sm">
                    -{currency === "INR" ? "INR" : currency}{" "}
                    {formatINR(discountAmount)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Tax</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    className="w-16 text-center border rounded px-2 py-1 text-sm"
                    value={tax}
                    onChange={(e) =>
                      setTax(Math.max(0, Number(e.target.value) || 0))
                    }
                  />
                  <span className="text-sm">%</span>
                  <span className="text-sm">
                    +{currency === "INR" ? "INR" : currency}{" "}
                    {formatINR(taxAmount)}
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t-2 border-gray-800 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-accent">
                  {currency === "INR" ? "INR" : currency} {formatINR(total)}
                </span>
              </div>
            </div>
          </div>

          {/* Download */}
          <div className="flex items-center justify-start gap-4 pt-6">
            <button
              onClick={handleGeneratePDF}
              disabled={isGenerating}
              className="inline-flex items-center gap-3 shadow bg-accent hover:bg-accent-dark disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold text-base py-3 px-4 rounded-md transition-colors"
            >
              <Download className="w-5 h-5" />
              {isGenerating ? "Generating..." : "Download PDF"}
            </button>

            <button
              onClick={() => setIsBlackWhite(!isBlackWhite)}
              className="flex items-center gap-2 px-4 py-3 border border-border rounded-md hover:bg-input text-sm transition-colors"
            >
              <Palette className="w-4 h-4" />
              {isBlackWhite ? "B&W" : "Color"}
            </button>
          </div>
        </div>
      </div>
      <HowToUse
        className="mt-8"
        steps={[
          "Enter your company and client details.",
          "Add items with descriptions, quantities, and rates.",
          "Set tax and discount percentages as needed.",
          "Choose color or black & white PDF style.",
          "Click 'Download PDF' to generate and save your invoice.",
        ]}
        tip="This tool generates professional invoices directly in your browser, ensuring your data remains private."
      />
    </div>
  );
}
