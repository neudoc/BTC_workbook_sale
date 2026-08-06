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
      <section className="-mx-4 -mt-8 bg-gradient-to-b from-brand-50 via-brand-50/40 to-white px-4 pb-16 pt-14 sm:pb-20 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <span className="inline-flex items-center rounded-full bg-brand-800 px-5 py-2 text-sm font-bold tracking-[0.08em] text-white sm:text-base">
              BTC 1% 인지학습
            </span>
            <h1 className="mt-6 break-keep font-sans text-[2rem] font-bold leading-[1.25] tracking-tight text-slate-950 sm:text-[2.8rem] lg:text-[3.1rem]">
              치매를 전문으로 하는
              <br />
              교수진이 검토합니다.
            </h1>
            <p className="mt-6 max-w-lg break-keep text-base leading-8 text-slate-600 sm:text-lg">
              임상적 전문성과 공감의 돌봄을 결합한 브레인트러스트 클럽의 인지 중재
              프로그램. 뇌 건강의 새로운 기준을 제시합니다.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="group inline-flex items-center justify-center gap-2 rounded-[10px] bg-brand-800 px-7 py-4 text-base font-bold text-white transition hover:bg-brand-900"
              >
                교재 보러가기
                <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>
                  →
                </span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-[10px] border border-brand-200 bg-white px-7 py-4 text-base font-bold text-slate-800 transition hover:border-brand-400 hover:text-brand-800"
              >
                지도사 문의
              </Link>
            </div>
            <p className="mt-6 text-base text-slate-600">
              상담{" "}
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="font-bold text-brand-800 hover:underline"
              >
                {siteConfig.contact.phone}
              </a>{" "}
              · 주중 13:00–17:00
            </p>
          </div>

          <div className="overflow-hidden rounded-[18px] shadow-lg">
            <Image
              src="/images/home/products.jpg"
              alt="인지학습 교재와 학습교구"
              width={720}
              height={520}
              priority
              className="aspect-[4/3] h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center rounded-full bg-brand-100 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-brand-800">
              단계별 맞춤 인지훈련
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              인지 상태에 맞는 레벨을 선택하세요
            </h2>
            <p className="mt-3 max-w-xl break-keep leading-7 text-slate-600">
              예방 · 관리 · 돌봄 3단계. 각 레벨은 4계절 12권입니다.
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
              className="group overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex aspect-[3/4] items-center justify-center overflow-hidden bg-gradient-to-b from-slate-100 to-white p-5">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={420}
                  height={560}
                  className="max-h-full w-auto rounded-sm object-contain shadow-lg transition duration-500 group-hover:scale-105"
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
          <div key={item.title} className="rounded-[18px] border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-700">{item.desc}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-8 rounded-[18px] bg-brand-950 p-6 text-white sm:p-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-brand-100">
            SOCIAL IMPACT
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            교재를 판매하는 것을 넘어, 사회적 기여를 함께 만듭니다
          </h2>
          <p className="mt-4 break-keep leading-8 text-brand-50">
            인지건강은 가족과 지역사회가 함께 돌봐야 할 영역입니다. 돌봄 현장의
            부담을 낮추는 교재와 교육을 만듭니다.
          </p>
        </div>
        <ul className="grid gap-3">
          {impactItems.map((item) => (
            <li key={item} className="rounded-[18px] border border-white/15 bg-white/10 p-4 text-sm leading-7">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="grid items-center gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[18px] border border-slate-200">
          <Image
            src="/images/home/training-class.jpg"
            alt="인지학습지도사 교육 현장"
            width={620}
            height={420}
            className="aspect-[4/3] h-full w-full object-cover"
          />
        </div>
        <div>
          <span className="inline-flex items-center rounded-full bg-brand-100 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-brand-800">
            INSTRUCTOR
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            인지학습지도사 선생님을 모집합니다
          </h2>
          <p className="mt-4 break-keep leading-8 text-slate-600">
            수료 후 현장에서 바로 운영할 수 있도록 자료와 상담을 지원합니다.
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

      <section className="grid gap-5 rounded-[18px] border border-slate-200 bg-white p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <span className="inline-flex items-center rounded-full bg-brand-100 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-brand-800">
            BLOG
          </span>
          <h2 className="mt-2 break-keep text-2xl font-bold tracking-tight text-slate-950">
            뇌 건강 정보를 블로그에서 확인하세요
          </h2>
          <p className="mt-3 break-keep leading-7 text-slate-600">
            보호자 교육, 치매 예방, 일상 인지활동 자료를 꾸준히 올립니다.
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
        <h2 className="break-keep text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          무엇부터 시작할지 함께 정해 드립니다
        </h2>
        <p className="mx-auto mt-4 max-w-xl break-keep leading-8 text-slate-600">
          교재 구매, 기관 도입, 지도사 과정 — 목적을 알려주시면 안내해 드립니다.
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
        <div className="text-center">
          <span className="inline-flex items-center rounded-full bg-brand-100 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-brand-800">PARTNERS</span>
        </div>
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
