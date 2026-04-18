import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";
import { FeatureCard } from "@/components/ui/FeatureCard";

export const metadata: Metadata = {
  title: "프로그램",
  description: "인지훈련/교육/운영 프로그램을 소개합니다."
};

export default function ProgramsPage() {
  return (
    <div className="space-y-8">
      <PageTitle
        title="프로그램"
        description="개인 체험부터 전문가 교육까지, 단계별 프로그램을 준비합니다."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <FeatureCard
          title="개인용 체험"
          description="무료 인지훈련·자가점검으로 시작하는 일상 루틴."
          href="/training"
        />
        <FeatureCard
          title="교육 프로그램(전문가)"
          description="인지학습 지도사/협력기관을 위한 교육 자료와 운영 도구."
          href="/education/courses"
        />
        <FeatureCard
          title="기관용(추후 확장)"
          description="기관 대시보드, 대상자 관리, 리포트 제공 등 확장 가능한 구조."
          href="/about"
        />
      </div>

      <section className="rounded-2xl border border-slate-200 p-6 bg-white space-y-3">
        <h2 className="text-lg font-semibold">다음 단계(로드맵)</h2>
        <ul className="list-disc pl-5 text-slate-700 space-y-2">
          <li>구독형 서비스</li>
          <li>검사 결과 PDF 리포트</li>
          <li>추천 콘텐츠/상품 자동 제안</li>
          <li>기관용 기능 분리</li>
        </ul>
      </section>
    </div>
  );
}

