"use client";

import { useState } from "react";
import { Download, Plus, Trash2, AlertCircle, Palette } from "lucide-react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { format } from "date-fns";
import HowToUse from "@/components/tool/HowToUse";

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

// PDF Styles - Color Version
const colorStyles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica", lineHeight: 1.4 },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    paddingBottom: 10,
    color: "#1d4ed8",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  col: { width: "48%" },
  label: {
    fontSize: 9,
    color: "#666",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  bold: { fontWeight: "bold", fontSize: 12 },
  text: { marginBottom: 3, fontSize: 10 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#eff6ff",
    padding: 10,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
  },
  desc: { width: "50%", paddingLeft: 10 },
  qty: { width: "12%", textAlign: "center" },
  rate: { width: "18%", textAlign: "right" },
  amount: { width: "20%", textAlign: "right", paddingRight: 10 },
  totals: { width: "45%", alignSelf: "flex-end", marginTop: 20 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  grandTotal: { fontSize: 18, fontWeight: "bold", color: "#1d4ed8" },
  notes: { marginTop: 30, fontSize: 9, color: "#555" },
});

// Black & White Styles (same but no colors)
const bwStyles = StyleSheet.create({
  ...colorStyles,
  header: { ...colorStyles.header, color: "#000" },
  tableHeader: { ...colorStyles.tableHeader, backgroundColor: "#f5f5f5" },
  grandTotal: { ...colorStyles.grandTotal, color: "#000" },
});

const InvoicePDF = ({ data, isBW }: { data: any; isBW: boolean }) => {
  const styles = isBW ? bwStyles : colorStyles;
  const currencyDisplay = data.currency === "INR" ? "INR" : data.currency;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>INVOICE</Text>

        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Invoice No.</Text>
            <Text style={styles.bold}>{data.invoiceNo}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.bold}>
              {format(new Date(data.invoiceDate), "dd MMM yyyy")}
            </Text>
            <Text style={styles.label}>Due Date</Text>
            <Text style={styles.bold}>
              {format(new Date(data.dueDate), "dd MMM yyyy")}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>From</Text>
            <Text style={styles.bold}>{data.from.name || "Your Company"}</Text>
            {data.from.email && (
              <Text style={styles.text}>{data.from.email}</Text>
            )}
            {data.from.address && (
              <Text style={styles.text}>{data.from.address}</Text>
            )}
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Bill To</Text>
            <Text style={styles.bold}>{data.billTo.name || "Client"}</Text>
            {data.billTo.email && (
              <Text style={styles.text}>{data.billTo.email}</Text>
            )}
            {data.billTo.address && (
              <Text style={styles.text}>{data.billTo.address}</Text>
            )}
          </View>
        </View>

        <View>
          <View style={styles.tableHeader}>
            <Text style={styles.desc}>Description</Text>
            <Text style={styles.qty}>Qty</Text>
            <Text style={styles.rate}>Rate</Text>
            <Text style={styles.amount}>Amount</Text>
          </View>
          {data.items.map((item: Item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.desc}>{item.description || "-"}</Text>
              <Text style={styles.qty}>{item.qty}</Text>
              <Text style={styles.rate}>
                {currencyDisplay} {formatINR(item.rate)}
              </Text>
              <Text style={styles.amount}>
                {currencyDisplay} {formatINR(item.qty * item.rate)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text>Subtotal</Text>
            <Text>
              {currencyDisplay} {formatINR(data.calcs.subtotal)}
            </Text>
          </View>
          {data.discount > 0 && (
            <View style={styles.totalRow}>
              <Text>Discount ({data.discount}%)</Text>
              <Text>
                -{currencyDisplay} {formatINR(data.calcs.discountAmount)}
              </Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text>Tax ({data.tax}%)</Text>
            <Text>
              +{currencyDisplay} {formatINR(data.calcs.taxAmount)}
            </Text>
          </View>
          <View
            style={[
              styles.totalRow,
              {
                borderTopWidth: 2,
                borderColor: isBW ? "#000" : "#1d4ed8",
                paddingTop: 10,
              },
            ]}
          >
            <Text style={styles.grandTotal}>Total</Text>
            <Text style={styles.grandTotal}>
              {currencyDisplay} {formatINR(data.calcs.total)}
            </Text>
          </View>
        </View>

        {data.notes.trim() && (
          <View style={styles.notes}>
            <Text style={{ fontWeight: "bold", marginBottom: 6 }}>Notes</Text>
            <Text>{data.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default function InvoiceGenerator() {
  const today = new Date().toISOString().slice(0, 10);
  const due = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const [invoiceNo, setInvoiceNo] = useState("INV-0001");
  const [invoiceDate, setInvoiceDate] = useState(today);
  const [dueDate, setDueDate] = useState(due);
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
  const [currency, setCurrency] = useState("INR"); // Default INR
  const [isBlackWhite, setIsBlackWhite] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Calculations
  const subtotal = items.reduce((s, i) => s + i.qty * i.rate, 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxAmount = ((subtotal - discountAmount) * tax) / 100;
  const total = subtotal - discountAmount + taxAmount;
  const calcs = { subtotal, discountAmount, taxAmount, total };

  const dataForPDF = {
    invoiceNo,
    invoiceDate,
    dueDate,
    from: fromInfo,
    billTo,
    items,
    tax,
    discount,
    notes,
    currency,
    calcs,
  };

  const validate = () => {
    const errs: string[] = [];
    if (!invoiceNo.trim()) errs.push("Invoice number required");
    if (!fromInfo.name.trim()) errs.push("Your company name required");
    if (!billTo.name.trim()) errs.push("Client name required");
    if (items.some((i) => !i.description.trim()))
      errs.push("All items need description");
    if (items.some((i) => i.qty <= 0 || i.rate < 0))
      errs.push("Check quantity & rate");
    setErrors(errs);
    return errs.length === 0;
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
          ? { ...i, [field]: field === "description" ? value : Number(value) }
          : i
      )
    );
  };
  const removeItem = (id: string) =>
    items.length > 1 && setItems(items.filter((i) => i.id !== id));

  return (
    <div className="min-h-screen bg-background py-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-8 mb-8">
        <h1 className="text-2xl font-bold text-start">Invoice Generator</h1>
        <p className="text-muted-foreground text-sm">
          Generate professional invoices in minutes.
        </p>
      </div>
      <div className="max-w-3xl mx-auto">
        {" "}
        {/* Compact width */}
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
            {/* Left: Invoice No */}
            <div className="">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Invoice No.
              </label>
              <input
                className="w-[200px] px-3 py-2 border rounded-md text-base font-medium"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
              />
            </div>

            {/* Right: Dates (stacked) */}
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

          {/* From & Bill To - Compact */}
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
                        {formatINR(item.qty * item.rate)}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={items.length === 1}
                          className="text-red-500 hover:text-red-700 disabled:opacity-40"
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
                className="w-full py-3 bg-background border-t border-border hover:bg-background-dark text-accent font-medium flex items-center justify-center gap-2 text-sm"
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
                        Math.min(100, Math.max(0, Number(e.target.value)))
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
                      setTax(Math.max(0, Number(e.target.value)))
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
            <PDFDownloadLink
              document={<InvoicePDF data={dataForPDF} isBW={isBlackWhite} />}
              fileName={`${invoiceNo}.pdf`}
            >
              {({ loading }) => (
                <button
                  onClick={() => {
                    if (!validate()) return;
                  }}
                  disabled={loading}
                  className="inline-flex items-center gap-3 shadow bg-accent hover:bg-accent-dark disabled:bg-gray-400 text-white font-bold text-base py-3 px-4 rounded-md transition"
                >
                  <Download className="w-5 h-5" />
                  {loading ? "Generating..." : "Download PDF"}
                </button>
              )}
            </PDFDownloadLink>

            <button
              onClick={() => setIsBlackWhite(!isBlackWhite)}
              className="flex items-center gap-2 px-4 py-3 border border-border rounded-md hover:bg-input text-sm"
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
