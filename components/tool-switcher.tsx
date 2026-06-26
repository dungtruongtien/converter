"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "PDF → HTML", href: "/pdf-to-html" },
  { label: "HTML → PDF", href: "/html-to-pdf" },
];

export function ToolSwitcher() {
  const pathname = usePathname();

  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1 gap-1">
      {TABS.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(tab.href + "/");
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={[
              "px-4 py-2 rounded-md text-sm font-medium transition-all",
              active
                ? "bg-white text-blue-600 shadow-sm border border-gray-200"
                : "text-gray-600 hover:text-gray-900",
            ].join(" ")}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
