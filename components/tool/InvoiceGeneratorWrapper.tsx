"use client";

import dynamic from "next/dynamic";

const InvoiceGenerator = dynamic(
  () => import("./InvoiceGenerator.client"),
  { ssr: false }
);

export default function InvoiceGeneratorWrapper() {
  return <InvoiceGenerator />;
}
