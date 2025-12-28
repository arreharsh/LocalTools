import dynamic from "next/dynamic";

const InvoiceGenerator = dynamic(
  () => import("@/components/tool/InvoiceGenerator.client"),
  { ssr: false }
);

export default function InvoiceGeneratorPage() {
  return (
    <div className="min-h-screen">
      <InvoiceGenerator />
    </div>
  );
}
