"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";

const ArrowSVG = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 22 22"
    className={className}
  >
    <path
      fill="currentColor"
      d="M3 10V8h1V7h1V6h1V5h1V4h2v2H8v1H7v1h4v1h2v1h1v2h1v7h-2v-6h-1v-2h-2v-1H7v1h1v1h1v2H7v-1H6v-1H5v-1H4v-1"
    />
  </svg>
);

const ArrowI = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 22 22"
    className={className}
  >
    <path
      fill="currentColor"
      d="M5 12v-2h1V9h1V8h1V7h1V6h2v2h-1v1H9v1h9v2H9v1h1v1h1v2H9v-1H8v-1H7v-1H6v-1"
    />
  </svg>
);

export default function ToolsPage() {
  return (
    <div className="h-screen overflow-hidden bg-background">
      <div className="relative h-full max-w-7xl mx-auto px-6 py-10">
        {/* TOP ARROW + TEXT */}
        <div className="flex items-start mt-6 gap-4">
          <ArrowI className="w-8 h-8 mt-2" />

          <h1 className="text-2xl md:text-xl text max-w-sm leading-snug">
            Search what tools are <br /> you looking for?
          </h1>
        </div>

        {/* MIDDLE SECTION */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 mt-6 flex items-center gap-6">
          {/* LEFT ARROWS + LINE */}
          <div className="flex flex-col items-center">
            <ArrowSVG className="" />

            <div className="h-70 w-px bg-gray-500 my-2" />

            <ArrowSVG className="-rotate-180 scale-x-[-1]" />
          </div>

          {/* TEXT */}
          <p className="text-xl md:text-xl font-medium text leading-relaxed">
            Choose Tools directly <br />
            from the list :)
          </p>
        </div>
      </div>
    </div>
  );
}
