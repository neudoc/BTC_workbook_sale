import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

const featuredProducts = [
  {
    title: "BTC 1% 인지학습 레벨 1 (예방)",
    desc: "치매 전 단계·정상군을 위한 고난이도 인지훈련 (난이도 상) · 여름·가을·겨울 각 75,000원",
    href: "/shop/level1-spring",
    image: "/images/products/textbook-level1.png",
    price: "봄 150,000원",
  },
  {
    title: "BTC 1% 인지학습 레벨 2 (관리)",
    desc: "경도인지장애(MCI)·초기 단계를 위한 집중력 강화·회상요법 (난이도 중) · 여름·가을·겨울 각 75,000원",
    href: "/shop/level2-spring",
    image: "/images/products/textbook-level2.png",
    price: "봄 150,000원",
  },
  {
    title: "BTC 1% 인지학습 레벨 3 (돌봄)",
    desc: "중증도 인지저하를 위한 감각자극·정서안정 활동 (난이도 하) · 여름·가을·겨울 각 75,000원",
    href: "/shop/level3-spring",
    image: "/images/products/textbook-level3.png",
    price: "봄 150,000원",
  },
];

const audiences = [
  {
    title: "가족과 보호자",
    desc: "어떤 활동을 해야 할지 막막한 보호자가 집에서 차근차근 따라 할 수 있도록 구성했습니다.",
  },
  {
    title: "주간보호센터와 기관",
    desc: "반복 운영이 쉬운 수준별 교재와 지도 흐름으로 프로그램 품질을 안정적으로 유지합니다.",
  },
  {
    title: "인지학습지도사",
    desc: "수업 준비 시간을 줄이고 대상자의 반응을 보며 활동을 조정할 수 있는 지도서를 제공합니다.",
  },
];

const impactItems = [
  "치매와 인지장애가 걱정되는 가정을 위한 쉬운 교육 자료 제공",
  "지역사회 기관에서 반복 운영 가능한 인지학습 프로그램 보급",
  "인지학습지도사 양성을 통한 돌봄 현장의 전문성 강화",
];

const partners = [
  { src: "/images/partners/happyhome.png", alt: "해피홈수원재활주간보호센터" },
  { src: "/images/partners/goodmorning.png", alt: "굿모닝주간보호센터" },
  { src: "/images/partners/dongnam.png", alt: "동남보건대학교 산학협력단" },
  { src: "/images/partners/boram.png", alt: "보람찬어르신센터" },
  { src: "/images/partners/sangrok.png", alt: "상록단원구노인주간보호센터" },
  { src: "/images/partners/kyungwoon.png", alt: "경운대학교" },
  { src: "/images/partners/korea-association.png", alt: "한국주야간보호협회" },
  { src: "/images/partners/cha.png", alt: "중앙대학교병원 신경과" },
];

export default function HomePage() {
  return (
    <div className="space-y-20">
      <section className="grid items-center gap-12 pt-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
        <div>
          <p className="flex items-center gap-3 text-lg font-bold tracking-[0.18em] text-gold-600">
            <span className="inline-block h-px w-8 bg-gold-400" aria-hidden />
            BTC 1% 인지학습
          </p>
          <h1 className="mt-5 break-words text-[1.6rem] font-bold leading-[1.22] tracking-tight text-slate-950 sm:text-[2.4rem] lg:text-[2.7rem]">
            의사가 만든
            <br />
            노화·치매 예방
            <span className="mt-2 block text-brand-800">1% 인지학습지</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-slate-700 sm:text-lg sm:leading-9">
            신경과 교수들이 감수한 단계별 맞춤 인지훈련 프로그램. 학습지 한 장
            한 장마다 의사의 처방과 같은 지침서가 함께합니다.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full bg-brand-700 px-7 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-brand-800"
            >
              교재 보러가기
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-7 py-3.5 text-base font-bold text-slate-800 transition hover:border-brand-600 hover:text-brand-800"
            >
              지도사 문의
            </Link>
          </div>
          <dl className="mt-9 grid grid-cols-3 gap-3 border-t border-slate-200 pt-5">
            <div>
              <dt className="text-xs font-semibold text-slate-500">전체 구성</dt>
              <dd className="mt-1 text-sm font-bold text-slate-950 sm:text-base">12권 · 4계절</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-slate-500">단계</dt>
              <dd className="mt-1 text-sm font-bold text-slate-950 sm:text-base">예방·관리·돌봄</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-slate-500">감수</dt>
              <dd className="mt-1 text-sm font-bold text-slate-950 sm:text-base">신경과 교수진</dd>
            </div>
          </dl>
        </div>

        <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
          <Image
            src="/images/home/products.jpg"
            alt="인지학습 교재와 교구"
            width={680}
            height={520}
            priority
            className="aspect-[4/3] h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 to-transparent p-5 text-white">
            <p className="text-sm font-semibold">수준별 교재와 실전 지도서</p>
            <p className="mt-1 text-xs leading-5 text-slate-200">
              보호자, 센터, 지도사가 같은 흐름으로 사용할 수 있는 프로그램형 자료
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="flex items-center gap-3 text-base font-bold tracking-[0.18em] text-gold-600">
              <span className="inline-block h-px w-8 bg-gold-400" aria-hidden />
              단계별 맞춤 인지훈련
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              인지 상태에 맞는 레벨을 선택하세요
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-slate-700">
              레벨 1 예방(정상군), 레벨 2 관리(경도인지장애), 레벨 3 돌봄(중증도).
              각 레벨은 봄·여름·가을·겨울 4세트, 총 12권으로 구성됩니다.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            전체 상품 보기
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {featuredProducts.map((product) => (
            <Link
              key={product.href}
              href={product.href}
              className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="aspect-[3/4] overflow-hidden bg-slate-50 p-3">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={420}
                  height={560}
                  className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-950">{product.title}</h3>
                <p className="mt-2 min-h-[4.5rem] text-sm leading-6 text-slate-700">
                  {product.desc}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-lg font-bold text-brand-800">{product.price}</span>
                  <span className="text-sm font-bold text-slate-900">상세 보기</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {audiences.map((item) => (
          <div key={item.title} className="rounded-lg border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-700">{item.desc}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-8 rounded-lg bg-brand-950 p-6 text-white sm:p-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="flex items-center gap-3 text-sm font-bold tracking-[0.18em] text-gold-300">
            <span className="inline-block h-px w-8 bg-gold-400" aria-hidden />
            SOCIAL IMPACT
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            교재를 판매하는 것을 넘어, 사회적 기여를 함께 만듭니다
          </h2>
          <p className="mt-4 leading-8 text-brand-50">
            인지건강은 개인의 문제가 아니라 가족과 지역사회가 함께 돌봐야 할
            영역입니다. BrainTrust Club은 실용적인 교재와 교육을 통해 돌봄
            현장의 부담을 낮추고 지속 가능한 학습 문화를 넓혀갑니다.
          </p>
        </div>
        <ul className="grid gap-3">
          {impactItems.map((item) => (
            <li key={item} className="rounded-lg border border-white/15 bg-white/10 p-4 text-sm leading-7">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="grid items-center gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <Image
            src="/images/home/training-class.jpg"
            alt="인지학습지도사 교육 현장"
            width={620}
            height={420}
            className="aspect-[4/3] h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="flex items-center gap-3 text-sm font-bold tracking-[0.18em] text-gold-600">
            <span className="inline-block h-px w-8 bg-gold-400" aria-hidden />
            INSTRUCTOR
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            인지학습지도사 선생님을 모집합니다
          </h2>
          <p className="mt-4 leading-8 text-slate-700">
            교재와 지도서를 활용해 어르신, 보호자, 기관 프로그램을 이끌
            선생님을 기다립니다. 교육 수료 후 지역사회 현장에서 인지학습
            프로그램을 운영할 수 있도록 자료와 상담을 지원합니다.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/education/courses"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              교육과정 보기
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-slate-800 transition hover:border-brand-600 hover:text-brand-800"
            >
              지도사 등록 문의
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="flex items-center gap-3 text-sm font-bold tracking-[0.18em] text-gold-600">
            <span className="inline-block h-px w-8 bg-gold-400" aria-hidden />
            BLOG
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            인지장애와 치매 관련 정보는 블로그에서 더 자세히 확인하세요
          </h2>
          <p className="mt-3 leading-7 text-slate-700">
            보호자 교육, 치매 예방, 일상 속 인지활동 자료를 꾸준히 제공합니다.
          </p>
        </div>
        <a
          href={siteConfig.blogUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-brand-700 px-7 py-3 text-sm font-bold text-white transition hover:bg-brand-800"
        >
          neudoc.tistory.com 방문
        </a>
      </section>

      <section className="pb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          교재 구매, 기관 도입, 지도사 문의를 한 번에 상담해 드립니다
        </h2>
        <p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-700">
          필요한 대상, 운영 환경, 희망 교육 형태를 알려주시면 적합한 교재와
          프로그램 방향을 안내하겠습니다.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full bg-brand-700 px-8 py-3 text-base font-bold text-white transition hover:bg-brand-800"
          >
            교재 구매하기
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-8 py-3 text-base font-bold text-slate-800 transition hover:border-brand-600 hover:text-brand-800"
          >
            상담 문의하기
          </Link>
        </div>
      </section>

      <section className="border-t border-slate-200 pt-10">
        <p className="flex items-center justify-center gap-3 text-sm font-bold tracking-[0.18em] text-gold-600">
          <span className="inline-block h-px w-8 bg-gold-400" aria-hidden />
          PARTNERS
          <span className="inline-block h-px w-8 bg-gold-400" aria-hidden />
        </p>
        <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-slate-950">
          함께하는 협력기관
        </h2>
        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4">
          {partners.map((p) => (
            <figure key={p.alt} className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-16 items-center justify-center">
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={180}
                  height={80}
                  className="max-h-16 w-auto object-contain"
                />
              </div>
              <figcaption className="text-xs leading-4 text-slate-600">{p.alt}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
