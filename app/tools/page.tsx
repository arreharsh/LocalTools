"use client";

import { useEffect, useState } from "react";
import ToolsDesktop from "@/components/tool/ToolsDesktop";
import ToolsMobile from "@/components/tool/ToolsMobile";

export default function ToolsPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);

    check(); // initial
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!isMobile) return <ToolsDesktop />;
  return <ToolsMobile />;
}
