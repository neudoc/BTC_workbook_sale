import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageTitle } from "@/components/ui/PageTitle";

export const metadata: Metadata = {
  title: "브레인트러스트 클럽",
  description: "브레인트러스트 클럽 인지건강 플랫폼 소개"
};

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

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <PageTitle
        title="브레인트러스트 클럽"
        description="인지건강 플랫폼 · 기억을 지키고, 건강한 내일을 엽니다."
      />

      <figure className="overflow-hidden rounded-2xl border border-slate-200 shadow-card">
        <Image
          src="/images/about/instructor-ceremony.jpg"
          alt="인지학습 전문 지도사 양성과정 설명회 및 협약식 단체사진"
          width={1400}
          height={663}
          priority
          className="h-auto w-full object-cover"
        />
        <figcaption className="bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
          인지학습 전문 지도사 양성과정 · BTC 사업설명회 및 협약식 (2026. 2. 12, 동남보건대학교 — 중앙대학교병원 윤영철 교수 초청)
        </figcaption>
      </figure>

      {/* Mission & Vision */}
      <section className="rounded-2xl border border-slate-200 bg-white p-8 space-y-6">
        <div>
          <p className="text-sm font-medium tracking-widest text-brand-700 uppercase">Mission</p>
          <h2 className="mt-2 text-xl font-bold">미션</h2>
          <p className="mt-3 text-slate-700 leading-relaxed">
            누구나 쉽게 인지 건강을 관리할 수 있도록, 과학적 근거 기반의 평가와 훈련을 제공합니다.
            치매 예방과 뇌건강 증진을 위한 인지 예비능 플랫폼으로 일반인, 보호자, 전문가가 함께 성장합니다.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium tracking-widest text-brand-700 uppercase">Vision</p>
          <h2 className="mt-2 text-xl font-bold">비전</h2>
          <p className="mt-3 text-slate-700 leading-relaxed">
            인지 예비능 향상을 통해 치매 발병을 늦추고, 모든 세대가 건강한 인지 기능을 유지하는 사회를 만듭니다.
            AI 기술과 임상 전문성을 결합하여 개인 맞춤형 뇌건강 관리의 표준을 제시합니다.
          </p>
        </div>
      </section>

      {/* Business Areas */}
      <section className="space-y-4">
        <div className="text-center">
          <p className="text-sm font-medium tracking-widest text-brand-700 uppercase">Business</p>
          <h2 className="mt-2 text-2xl font-bold">사업 영역</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "인지 평가 · 훈련",
              desc: "AI 기반 인지 평가 도구와 게임형 인지훈련 프로그램으로 개인의 인지 예비능을 체계적으로 관리합니다.",
              href: "/screening",
            },
            {
              title: "교육 · 지도사 양성",
              desc: "인지학습지도사 자격과정, 보호자 교육, 기관 실무자 연수 등 전문 교육 프로그램을 운영합니다.",
              href: "/education/courses",
            },
            {
              title: "인지학습 교재 · 교구",
              desc: "BTC 1% 인지학습지(총 12권·4계절 세트), 지도사 지침서, 학습교구 등 인지활동 전문 자료를 개발·공급합니다.",
              href: "/shop",
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-brand-200 hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{item.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 group-hover:underline">
                자세히 보기 <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Research & Professionalism */}
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-8 space-y-4">
        <h2 className="text-xl font-bold">연구 · 전문성 기반</h2>
        <ul className="space-y-3 text-slate-700 leading-relaxed">
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-700" />
            신경과 전문의, 임상심리학자 등 의료진과 협력하여 프로그램을 개발합니다.
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-700" />
            인지재활학회, 노인인지재활 등 관련 학회의 최신 연구를 반영합니다.
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-700" />
            실제 주간보호센터, 요양원 등 현장에서 검증된 방법론을 적용합니다.
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-700" />
            다수의 협력 기관과 함께 파일럿 테스트를 거쳐 서비스를 고도화합니다.
          </li>
        </ul>
      </section>

      {/* Partners */}
      <section className="space-y-6">
        <div className="text-center">
          <p className="text-sm font-medium tracking-widest text-brand-700 uppercase">Partners</p>
          <h2 className="mt-2 text-2xl font-bold">협력 기관</h2>
          <p className="mt-2 text-slate-600">의료, 교육, 복지 분야의 전문 기관과 함께합니다.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 rounded-2xl border border-slate-200 bg-white p-8">
          {partners.map((p) => (
            <div key={p.alt} className="h-12 w-auto opacity-60 hover:opacity-100 transition-opacity">
              <Image src={p.src} alt={p.alt} width={100} height={48} className="h-12 w-auto object-contain" />
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="rounded-2xl border border-slate-200 p-6 space-y-3">
        <h2 className="text-lg font-semibold">중요 안내</h2>
        <p className="text-slate-700">
          본 사이트의 자가점검/훈련은 의료적 진단이 아닌 참고/체험용입니다. 증상이 지속되거나
          우려가 있다면 반드시 의료 전문가와 상담하세요.
        </p>
      </section>
    </div>
  );
}
