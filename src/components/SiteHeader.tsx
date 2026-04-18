import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/session";
import { CartBadge } from "@/components/cart/CartBadge";

export function SiteHeader() {
  const session = getSession();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 rounded-lg focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 outline-none">
          <Image
            src="/logo-btc.png"
            alt="Brain Trust Club"
            width={300}
            height={121}
            priority
            className="h-10 w-auto"
            sizes="(max-width: 768px) 160px, 220px"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-4 text-sm">
          <Link className="hover:underline rounded focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 outline-none" href="/about">
            소개
          </Link>
          <Link className="hover:underline rounded focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 outline-none" href="/cognitive-reserve">
            인지 예비능
          </Link>
          <Link className="hover:underline rounded focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 outline-none" href="/programs">
            프로그램
          </Link>
          <Link className="hover:underline rounded focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 outline-none" href="/education/courses">
            교육과정
          </Link>
          <Link className="hover:underline rounded focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 outline-none" href="/shop">
            쇼핑몰
          </Link>
          <Link className="hover:underline rounded focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 outline-none" href="/training">
            인지훈련
          </Link>
          <Link className="hover:underline rounded focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 outline-none" href="/screening">
            자가점검
          </Link>
          <Link className="hover:underline rounded focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 outline-none" href="/blog">
            블로그
          </Link>
          <Link className="hover:underline rounded focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 outline-none" href="/expert">
            전문가센터
          </Link>
          <Link className="hover:underline rounded focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 outline-none" href="/contact">
            문의
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <details className="md:hidden relative">
            <summary className="list-none cursor-pointer inline-flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 outline-none">
              메뉴
            </summary>
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
              {[
                ["/about", "소개"],
                ["/cognitive-reserve", "인지 예비능"],
                ["/programs", "프로그램"],
                ["/education/courses", "교육과정"],
                ["/shop", "쇼핑몰"],
                ["/training", "인지훈련"],
                ["/screening", "자가점검"],
                ["/blog", "블로그"],
                ["/expert", "전문가센터"],
                ["/contact", "문의하기"]
              ].map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-brand-600 outline-none"
                >
                  {label}
                </Link>
              ))}
            </div>
          </details>

          <Link
            href="/cart"
            className="relative inline-flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 outline-none"
          >
            장바구니
            <CartBadge />
          </Link>

          {session ? (
            <div className="flex items-center gap-2">
              <Link
                href="/mypage"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-sm text-white hover:bg-black focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 outline-none"
              >
                내 정보
              </Link>
              <form action="/api/auth/logout" method="post">
                <button
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 outline-none"
                  type="submit"
                >
                  로그아웃
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-brand-700 px-3 py-2 text-sm text-white hover:bg-brand-800 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 outline-none"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
