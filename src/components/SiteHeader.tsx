import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/session";
import { siteConfig } from "@/lib/site";
import { CartBadge } from "@/components/cart/CartBadge";

const navItems = [
  { href: "/shop", label: "교재 구매", external: false },
  { href: "/programs", label: "프로그램", external: false },
  { href: "/education/courses", label: "지도사 교육", external: false },
  { href: "/screening", label: "인지 자가점검", external: false },
  { href: siteConfig.blogUrl, label: "정보 블로그", external: true },
  { href: "/contact", label: "문의", external: false },
] as const;

export function SiteHeader() {
  const session = getSession();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="hidden bg-brand-950 text-brand-100 md:block">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-1.5 text-xs">
          <p className="tracking-wide">
            의사가 만든 노화·치매 예방 인지학습 프로그램{" "}
            <span className="font-semibold text-gold-300">BTC 1% 인지학습</span>
          </p>
          <a
            className="font-semibold tracking-wide hover:text-white"
            href={`tel:${siteConfig.contact.phone}`}
          >
            상담 {siteConfig.contact.phone} · 주중 13:00–17:00
          </a>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
        >
          <Image
            src="/logo-btc.png"
            alt="BrainTrust Club"
            width={300}
            height={121}
            priority
            className="h-8 w-auto sm:h-10"
            sizes="(max-width: 768px) 150px, 220px"
          />
          <span className="hidden border-l border-slate-200 pl-3 text-[11px] font-medium leading-4 text-slate-500 xl:block">
            BTC 1% 인지학습
            <br />
            의사가 만든 1% 인지학습지
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-700 lg:flex">
          {navItems.map((item) =>
            item.external ? (
              <a
                key={item.href}
                className="rounded outline-none transition-colors hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
                href={item.href}
                target="_blank"
                rel="noreferrer"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                className="rounded outline-none transition-colors hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
                href={item.href}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          <details className="relative lg:hidden">
            <summary className="inline-flex cursor-pointer list-none items-center justify-center rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2">
              메뉴
            </summary>
            <div className="absolute right-0 mt-2 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
              {navItems.map((item) =>
                item.external ? (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>
          </details>

          <Link
            href="/cart"
            className="relative hidden items-center justify-center rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 sm:inline-flex"
          >
            장바구니
            <CartBadge />
          </Link>

          {session ? (
            <Link
              href="/mypage"
              className="hidden items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white outline-none hover:bg-black focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 sm:inline-flex"
            >
              내 정보
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden items-center justify-center rounded-xl bg-brand-700 px-3 py-2 text-sm font-semibold text-white outline-none hover:bg-brand-800 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 sm:inline-flex"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
