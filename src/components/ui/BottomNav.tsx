"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site";

const tabs = [
  { href: "/", label: "홈", icon: "⌂", external: false },
  { href: "/shop", label: "교재", icon: "책", external: false },
  { href: "/screening", label: "점검", icon: "검", external: false },
  { href: siteConfig.blogUrl, label: "블로그", icon: "글", external: true },
  { href: "/contact", label: "문의", icon: "문", external: false },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white md:hidden"
      aria-label="주요 메뉴"
    >
      <div className="grid grid-cols-5">
        {tabs.map((tab) => {
          const active =
            !tab.external &&
            (tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href));
          const className = `flex flex-col items-center justify-center py-2 text-xs font-medium transition-colors ${
            active ? "text-brand-700" : "text-slate-500 hover:text-brand-700"
          }`;

          if (tab.external) {
            return (
              <a
                key={tab.href}
                href={tab.href}
                target="_blank"
                rel="noreferrer"
                className={className}
              >
                <span className="text-sm font-bold">{tab.icon}</span>
                <span className="mt-1">{tab.label}</span>
              </a>
            );
          }

          return (
            <Link key={tab.href} href={tab.href} className={className}>
              <span className="text-sm font-bold">{tab.icon}</span>
              <span className="mt-1">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
