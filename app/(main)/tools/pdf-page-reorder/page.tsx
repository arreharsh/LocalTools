"use client";

import dynamic from 'next/dynamic';


const PdfPageReorder = dynamic(
  () => import('./PdfPageReorderClient'),
  { ssr: false }
);

export default function Page() {
  return <PdfPageReorder />;
}