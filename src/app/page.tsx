import Link from "next/link";
import Image from "next/image";

const partners = [
  { src: "/images/partners/cha.png", alt: "중앙대학교병원 신경과" },
  { src: "/images/partners/dongnam.png", alt: "동남보건대학교 산학협력단" },
  { src: "/images/partners/korea-association.png", alt: "한국주야간보호협회" },
  { src: "/images/partners/goodmorning.png", alt: "굿모닝주간보호센터" },
  { src: "/images/partners/boram.png", alt: "보람찬어르신센터" },
  { src: "/images/partners/sangrok.png", alt: "상록단원구노인주간보호센터" },
  { src: "/images/partners/happyhome.png", alt: "해피홈수원재활주간보호센터" },
];

const steps = [
  {
    num: "01",
    title: "검사",
    subtitle: "AI 인지 평가",
    desc: "5~10분 만에 인지 상태를 체계적으로 평가합니다.",
    href: "/screening",
  },
  {
    num: "02",
    title: "분석",
    subtitle: "영역별 결과 분석",
    desc: "기억력, 주의집중, 실행기능 등 영역별 점수를 확인합니다.",
    href: "/screening",
  },
  {
    num: "03",
    title: "훈련",
    subtitle: "맞춤형 인지훈련",
    desc: "개인 수준에 맞는 게임형 훈련 프로그램을 제공합니다.",
    href: "/training",
  },
];

const targets = [
  {
    icon: "👤",
    title: "개인 사용자",
    desc: "내 인지 건강 상태를 확인하고, 맞춤 훈련으로 뇌건강을 관리하세요.",
    cta: "무료 검사 시작하기",
    href: "/screening",
  },
  {
    icon: "👨‍⚕️",
    title: "전문가 · 기관",
    desc: "환자 인지 관리, 교육 자료, 평가 도구를 전문가센터에서 활용하세요.",
    cta: "전문가센터 안내",
    href: "/expert",
  },
  {
    icon: "👨‍👩‍👧",
    title: "보호자 · 가족",
    desc: "가족의 인지 상태를 이해하고, 일상에서 도울 수 있는 방법을 알아보세요.",
    cta: "가이드 읽기",
    href: "/blog",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
            {/* Left: Text */}
            <div>
              <p className="text-sm font-medium tracking-widest text-brand-700 uppercase">
                치매 예방 · 뇌건강 · 인지 예비능
              </p>
              <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl md:leading-[1.15]">
                뇌건강을 위한
                <br />
                인지 케어 플랫폼
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">
                과학적 근거 기반의 인지 평가와 맞춤형 훈련으로
                인지 예비능을 높이는 통합 솔루션을 제공합니다.
              </p>

              {/* Checkmarks */}
              <ul className="mt-6 space-y-2.5">
                {[
                  "전문가 검증 인지 평가 도구",
                  "개인 맞춤형 인지훈련 프로그램",
                  "의료진 · 연구진 참여 개발",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-slate-700">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    <span className="text-[15px] font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/screening"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3.5 text-base font-semibold text-white hover:bg-slate-800 transition-colors"
                >
                  무료 인지검사 시작하기
                </Link>
                <Link
                  href="/training"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 px-8 py-3.5 text-base font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  훈련 체험하기
                </Link>
              </div>

              <p className="mt-4 text-xs text-slate-500">
                * 본 서비스의 검사·훈련은 의료적 진단을 대체하지 않으며 건강관리 참고용입니다.
              </p>
            </div>

            {/* Right: Visual */}
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                <Image
                  src="/images/home/senior-tablet.png"
                  alt="태블릿으로 인지훈련을 하는 어르신"
                  width={600}
                  height={450}
                  className="w-full object-cover"
                  priority
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-4 -left-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L12.5 7.5L18 10L12.5 12.5L10 18L7.5 12.5L2 10L7.5 7.5L10 2Z" fill="currentColor"/></svg>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">AI 기반 분석</div>
                    <div className="text-sm font-semibold text-slate-900">영역별 인지 평가</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar - Numbers + Partners */}
      <section className="border-y border-slate-100 bg-slate-50/50">
        <div className="mx-auto max-w-6xl px-4 py-10">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { num: "5,000+", label: "서비스 이용자" },
              { num: "20+", label: "협력 기관" },
              { num: "7종", label: "인지훈련 게임" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-slate-900 md:text-3xl">{stat.num}</div>
                <div className="mt-1 text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Partner logos */}
          <div className="mt-8 border-t border-slate-200 pt-6">
            <p className="mb-4 text-center text-xs font-medium tracking-widest text-slate-400 uppercase">
              협력 기관
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {partners.map((p) => (
                <div key={p.alt} className="h-10 w-auto opacity-60 hover:opacity-100 transition-opacity">
                  <Image src={p.src} alt={p.alt} width={80} height={40} className="h-10 w-auto object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-medium tracking-widest text-brand-700 uppercase">
              How it works
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
              3단계 인지 케어 프로세스
            </h2>
            <p className="mt-3 text-slate-600">
              검사부터 맞춤 훈련까지, 체계적인 과정으로 인지건강을 관리합니다.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <Link
                key={s.num}
                href={s.href}
                className="group rounded-2xl border border-slate-200 bg-white p-8 text-center transition-all hover:border-brand-200 hover:shadow-lg"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white">
                  {s.num}
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-900">{s.title}</h3>
                <p className="mt-1 text-sm font-medium text-brand-700">{s.subtitle}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Target Segments */}
      <section className="border-t border-slate-100 bg-slate-50/50">
        <div className="mx-auto max-w-5xl px-4 py-16 md:py-24">
          <div className="text-center">
            <p className="text-sm font-medium tracking-widest text-brand-700 uppercase">
              For everyone
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
              사용자별 맞춤 경험
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {targets.map((t) => (
              <div
                key={t.title}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8"
              >
                <div className="text-3xl">{t.icon}</div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{t.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{t.desc}</p>
                <Link
                  href={t.href}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:gap-2.5 transition-all"
                >
                  {t.cta} <span aria-hidden="true">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Courses */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-medium tracking-widest text-brand-700 uppercase">
              Education
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
              전문가 교육과정
            </h2>
            <p className="mt-3 text-slate-600">
              인지학습지도사 양성부터 보호자 교육까지, 체계적인 교육 프로그램을 제공합니다.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "인지학습지도사 기초과정",
                desc: "뇌건강 기초 이론부터 인지훈련 실습, 프로그램 운영 실무까지 8주 과정",
                tag: "자격과정",
                href: "/education/courses/cognitive-instructor-basic",
              },
              {
                title: "인지학습지도사 심화과정",
                desc: "고급 인지평가, 특수 인지훈련, 기관 운영 실무를 다루는 6주 심화 과정",
                tag: "자격과정",
                href: "/education/courses/cognitive-instructor-advanced",
              },
              {
                title: "가족 보호자 교육과정",
                desc: "치매 가족 보호자를 위한 실용적인 인지케어 교육 4주 과정",
                tag: "일반과정",
                href: "/education/courses/family-caregiver",
              },
            ].map((course) => (
              <Link
                key={course.title}
                href={course.href}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-brand-200 hover:shadow-lg"
              >
                <span className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-900">
                  {course.tag}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{course.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{course.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 group-hover:underline">
                  과정 상세보기 <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/education/courses"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-8 py-3.5 text-base font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              전체 교육과정 보기
            </Link>
          </div>
        </div>
      </section>

      {/* Screenshots / Preview */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-medium tracking-widest text-brand-700 uppercase">
              Preview
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
              실제 서비스 화면
            </h2>
            <p className="mt-3 text-slate-600">
              훈련 화면, 검사 리포트, 교육 현장 모습을 미리 확인하세요.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { src: "/images/home/training-class.jpg", alt: "인지훈련 교육 현장", label: "인지훈련 현장" },
              { src: "/images/home/active-seniors.png", alt: "인지훈련에 참여하는 어르신들", label: "훈련 참여 모습" },
              { src: "/images/home/products.jpg", alt: "인지훈련 교구 및 워크북", label: "교구와 워크북" },
            ].map((img) => (
              <div key={img.label} className="overflow-hidden rounded-2xl border border-slate-200">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={400}
                  height={300}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog + Shop */}
      <section className="border-t border-slate-100 bg-slate-50/50">
        <div className="mx-auto max-w-5xl px-4 py-16 md:py-24">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            {/* Blog */}
            <div>
              <p className="text-xs font-medium tracking-widest text-brand-700 uppercase">Blog</p>
              <h2 className="mt-3 text-xl font-bold">뇌건강 정보</h2>
              <div className="mt-6 space-y-3">
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
                    <span className="text-sm font-medium text-slate-800 group-hover:text-brand-800">{post.title}</span>
                    <span className="text-slate-400 group-hover:text-brand-700 transition-colors">→</span>
                  </Link>
                ))}
              </div>
              <Link href="/blog" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:gap-2.5 transition-all">
                전체 글 보기 →
              </Link>
            </div>

            {/* Shop */}
            <div>
              <p className="text-xs font-medium tracking-widest text-brand-700 uppercase">Shop</p>
              <h2 className="mt-3 text-xl font-bold">인지훈련 교구</h2>
              <div className="mt-6 space-y-3">
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
                    <span className="text-sm font-medium text-slate-800 group-hover:text-brand-800">{item.title}</span>
                    <span className="text-sm font-semibold text-slate-600">{item.price}</span>
                  </Link>
                ))}
              </div>
              <Link href="/shop" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:gap-2.5 transition-all">
                전체 상품 보기 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-slate-100">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center md:py-28">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            지금 바로 시작해보세요
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            무료 인지검사와 훈련으로 뇌건강 관리의 첫걸음을 내디뎌보세요.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/screening"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3.5 text-base font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              무료 인지검사 시작하기
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-8 py-3.5 text-base font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              기관·전문가 문의
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
