import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle } from "@/components/ui/PageTitle";

export const metadata: Metadata = {
  title: "자가점검",
  description: "간단 인지 자가점검(참고/체험용)"
};

const tests = [
  {
    href: "/screening/self-check",
    title: "인지건강 자가점검",
    desc: "기억/주의/일상 변화에 대한 간단 체크(참고용)."
  },
  {
    href: "/screening/lifestyle",
    title: "생활습관 체크",
    desc: "수면/운동/식사/사회활동 등 루틴 점검."
  },
  {
    href: "/screening/cognitive",
    title: "간이인지검사",
    desc: "기억력, 주의력, 언어 등 6개 영역 간단 확인 (15문항)."
  },
  {
    href: "/screening/moca",
    title: "MoCA 스타일 검사",
    desc: "집행기능, 주의력, 언어 등 다영역 인지 평가 (12문항)."
  }
];

export default function ScreeningPage() {
  return (
    <div className="space-y-6">
      <PageTitle
        title="간단 자가점검"
        description="의료 진단이 아닌 참고/체험용입니다. 걱정되는 증상이 있으면 전문가 상담을 권장합니다."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {tests.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-brand-200 hover:bg-brand-50/30 transition-colors"
          >
            <div className="text-lg font-semibold">{t.title}</div>
            <div className="mt-2 text-slate-700">{t.desc}</div>
            <div className="mt-4 text-sm text-brand-800 underline">시작</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

