"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "홈" },
  { href: "/training", label: "훈련" },
  { href: "/screening", label: "검사" },
  { href: "/blog", label: "블로그" },
  { href: "/mypage", label: "마이" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 border-t border-slate-200 bg-white md:hidden"
      aria-label="주요 메뉴"
    >
      <div className="grid grid-cols-5">
        {tabs.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-3 text-xs font-medium transition-colors ${
                active
                  ? "text-brand-700"
                  : "text-slate-500 hover:text-brand-700"
              }`}
            >
              <span className="text-lg">{tab.label.charAt(0)}</span>
              <span className="mt-1">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
