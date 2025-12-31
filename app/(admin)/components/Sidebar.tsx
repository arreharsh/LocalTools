"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BarChart3,
} from "lucide-react";

const links = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/users",
    label: "Users",
    icon: Users,
  },
  {
    href: "/usage",
    label: "Usage",
    icon: BarChart3,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="h-full p-4 space-y-6">
      <div className="text-lg font-semibold tracking-tight">
        LocalTools Admin
      </div>

      <nav className="space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 rounded px-3 py-2 text-sm transition
                ${
                  active
                    ? "bg-muted font-medium"
                    : "hover:bg-muted"
                }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
