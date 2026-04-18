import Link from "next/link";

const services = [
  {
    label: "Wellness for everyone",
    title: "인지훈련",
    desc: "기억력, 주의집중, 실행기능을 자극하는 게임형 훈련을 무료로 체험하세요.",
    href: "/training",
  },
  {
    label: "Self-check screening",
    title: "자가점검",
    desc: "간단한 문항으로 현재 인지 상태를 참고용으로 확인해보세요.",
    href: "/screening",
    badge: null,
  },
  {
    label: "Digital Therapeutics",
    title: "전문가센터",
    desc: "지도사 과정, 교육자료, 기관 운영 도구를 승인 후 이용할 수 있습니다.",
    href: "/expert",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-24 md:py-36">
        <p className="text-sm font-medium tracking-widest text-brand-700 uppercase">
          치매 예방 · 뇌건강 · 인지 예비능
        </p>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 md:text-6xl md:leading-[1.1]">
          뇌건강을 위한
          <br />
          인지 케어 플랫폼
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
          인지 예비능을 높이기 위한 훈련, 검사, 교구, 전문가 교육을
          하나의 플랫폼에서 제공합니다.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/training"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3.5 text-base font-medium text-white hover:bg-slate-800 transition-colors"
          >
            무료 체험 시작하기
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-8 py-3.5 text-base font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            서비스 소개
          </Link>
        </div>
        <p className="mt-5 text-xs text-slate-500">
          본 서비스의 검사·훈련은 의료적 진단을 대체하지 않으며 건강관리 참고용입니다.
        </p>
      </section>

      {/* Service Cards */}
      <section className="border-t border-slate-100">
        <div className="mx-auto max-w-5xl px-4 py-20 md:py-28">
          <p className="text-sm font-medium tracking-widest text-brand-700 uppercase">
            Services
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
            단계별 인지 케어 솔루션
          </h2>
          <p className="mt-3 text-slate-600 max-w-lg">
            조기 발견과 예방을 위한 단계적 접근을 제공합니다.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {services.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:border-slate-300 hover:shadow-lg"
              >
                <p className="text-xs font-medium tracking-widest text-brand-700 uppercase">
                  {s.label}
                </p>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">
                  {s.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                  {s.desc}
                </p>
                <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 group-hover:gap-2.5 transition-all">
                  자세히 보기
                  <span aria-hidden="true">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section - Blog + Shop */}
      <section className="border-t border-slate-100 bg-slate-50/50">
        <div className="mx-auto max-w-5xl px-4 py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            {/* Blog */}
            <div>
              <p className="text-xs font-medium tracking-widest text-brand-700 uppercase">
                Blog
              </p>
              <h2 className="mt-3 text-xl font-semibold">
                뇌건강 정보
              </h2>
              <div className="mt-6 space-y-4">
                {[
                  { title: "인지 예비능, 쉽게 이해하기", href: "/blog/cognitive-reserve-basics" },
                  { title: "하루 10분 뇌건강 루틴 만들기", href: "/blog/daily-brain-routine" },
                  { title: "보호자에게 도움이 되는 대화 방법", href: "/blog/caregiver-communication" },
                ].map((post) => (
                  <Link
                    key={post.href}
                    href={post.href}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 transition-colors hover:border-brand-200"
                  >
                    <span className="text-sm font-medium text-slate-800 group-hover:text-brand-800">
                      {post.title}
                    </span>
                    <span className="text-slate-400 group-hover:text-brand-700 transition-colors">→</span>
                  </Link>
                ))}
              </div>
              <Link
                href="/blog"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:gap-2.5 transition-all"
              >
                전체 글 보기 →
              </Link>
            </div>

            {/* Shop */}
            <div>
              <p className="text-xs font-medium tracking-widest text-brand-700 uppercase">
                Shop
              </p>
              <h2 className="mt-3 text-xl font-semibold">
                인지훈련 교구
              </h2>
              <div className="mt-6 space-y-4">
                {[
                  { title: "인지훈련 워크북 (기초)", price: "18,000원", href: "/shop/workbook-basic" },
                  { title: "인지훈련 워크북 (심화)", price: "22,000원", href: "/shop/workbook-advanced" },
                  { title: "인지활동 카드 세트", price: "29,000원", href: "/shop/training-cards" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 transition-colors hover:border-brand-200"
                  >
                    <span className="text-sm font-medium text-slate-800 group-hover:text-brand-800">
                      {item.title}
                    </span>
                    <span className="text-sm font-semibold text-slate-600">{item.price}</span>
                  </Link>
                ))}
              </div>
              <Link
                href="/shop"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:gap-2.5 transition-all"
              >
                전체 상품 보기 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-slate-100">
        <div className="mx-auto max-w-3xl px-4 py-20 md:py-28 text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            지금 바로 시작해보세요
          </h2>
          <p className="mt-4 text-slate-600">
            무료 인지훈련과 자가점검으로 뇌건강 관리를 시작하세요.
            <br />
            기관 도입이나 전문가 과정이 필요하신가요?
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/training"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3.5 text-base font-medium text-white hover:bg-slate-800 transition-colors"
            >
              무료 체험하기
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-8 py-3.5 text-base font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              문의하기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
