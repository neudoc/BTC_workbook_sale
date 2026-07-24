import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-brand-900 bg-brand-950 text-slate-200">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 text-sm">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="font-display text-lg font-bold text-white">{siteConfig.name}</div>
            <p className="mt-1 text-xs font-semibold tracking-wide text-gold-300">
              BTC 1% 인지학습 · 의사가 만든 1% 인지학습지
            </p>
            <p className="mt-3 max-w-md leading-7 text-slate-300">
              인지장애와 치매가 걱정되는 가정, 보호자, 기관을 위해
              구조화된 인지학습 교재와 지도서를 제공합니다. 사회적 기여를
              목표로 지역사회 인지건강 교육과 지도사 양성을 함께 추진합니다.
            </p>
            <p className="mt-4 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs leading-6 text-slate-300">
              안내: 본 사이트의 콘텐츠와 교재는 의학적 진단이나 치료를
              대체하지 않으며, 건강 관리와 교육 목적의 참고 자료입니다.
            </p>
          </div>

          <div>
            <div className="font-semibold text-white">바로가기</div>
            <ul className="mt-3 space-y-2">
              <li>
                <Link className="hover:text-white" href="/shop">
                  교재 구매
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/education/courses">
                  인지학습지도사 교육
                </Link>
              </li>
              <li>
                <a
                  className="hover:text-white"
                  href={siteConfig.blogUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  정보 블로그
                </a>
              </li>
              <li>
                <Link className="hover:text-white" href="/contact">
                  구매 및 제휴 문의
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-white">문의 및 구매</div>
            <ul className="mt-3 space-y-2 leading-6 text-slate-300">
              <li>
                <span className="text-slate-400">본사주소 </span>
                {siteConfig.contact.address}
              </li>
              <li>
                <span className="text-slate-400">상담시간 </span>
                {siteConfig.contact.hours}
              </li>
              <li>
                <span className="text-slate-400">문의전화 </span>
                <a className="hover:text-white" href={`tel:${siteConfig.contact.phone}`}>
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <span className="text-slate-400">이메일 </span>
                <a className="hover:text-white" href={`mailto:${siteConfig.contact.email}`}>
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
              <li>
                <Link className="hover:text-white" href="/legal/terms">
                  이용약관
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/legal/privacy">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/legal/shipping">
                  배송 안내
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/legal/disclaimer">
                  의학적 고지
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-slate-400">
          {siteConfig.contact.company} · 대표 {siteConfig.contact.ceo}
          <br />
          Copyright {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
