import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 text-sm text-slate-700">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div>
            <div className="font-semibold text-slate-900">{siteConfig.name}</div>
            <div className="mt-2 text-slate-600 max-w-md leading-relaxed">
              치매 예방과 뇌건강 증진을 위한 인지 예비능 통합 플랫폼.
              검증된 상품과 교육, 전문가 가이드를 통해 건강한 인지 능력을 유지하세요.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="font-semibold text-slate-900">메뉴</div>
              <ul className="space-y-1">
                <li>
                  <Link className="hover:underline rounded focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 outline-none" href="/about">
                    소개
                  </Link>
                </li>
                <li>
                  <Link className="hover:underline rounded focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 outline-none" href="/shop">
                    쇼핑몰
                  </Link>
                </li>
                <li>
                  <Link className="hover:underline rounded focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 outline-none" href="/blog">
                    블로그
                  </Link>
                </li>
                <li>
                  <Link className="hover:underline rounded focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 outline-none" href="/contact">
                    문의하기
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="font-semibold text-slate-900">정책</div>
              <ul className="space-y-1">
                <li>
                  <Link className="hover:underline rounded focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 outline-none" href="/legal/terms">
                    이용약관
                  </Link>
                </li>
                <li>
                  <Link className="hover:underline rounded focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 outline-none" href="/legal/privacy">
                    개인정보처리방침
                  </Link>
                </li>
                <li>
                  <Link className="hover:underline rounded focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 outline-none" href="/legal/disclaimer">
                    면책문구
                  </Link>
                </li>
                <li>
                  <Link className="hover:underline rounded focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 outline-none" href="/legal/cookies">
                    쿠키/마케팅
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-slate-100 pt-8 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</div>
          <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600">
            <strong>안내:</strong> 본 사이트의 검사 및 훈련 프로그램은 의료적 진단이나 치료를 대체할 수 없으며, 참고 및 체험용으로 제공됩니다.
          </div>
        </div>
      </div>
    </footer>
  );
}

