import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";

export const metadata: Metadata = {
  title: "브레인트러스트 클럽",
  description: "브레인트러스트 클럽 인지건강 플랫폼 소개"
};

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <PageTitle
        title="브레인트러스트 클럽"
        description="인지건강 플랫폼 · 기억을 지키고, 건강한 내일을 엽니다."
      />

      <section className="rounded-2xl border border-slate-200 p-6 bg-white space-y-4">
        <h2 className="text-lg font-semibold">저희가 하는 일</h2>
        <ul className="list-disc pl-5 text-slate-700 space-y-2">
          <li>일반 사용자가 치매 예방/뇌건강 정보를 쉽게 이해하도록 돕습니다.</li>
          <li>무료 체험(인지훈련/자가점검)으로 부담 없이 시작할 수 있도록 합니다.</li>
          <li>워크북/교구/훈련도구 구매를 돕습니다.</li>
          <li>전문가에게는 교육자료/양식/운영도구를 제공합니다.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 p-6 bg-slate-50 space-y-3">
        <h2 className="text-lg font-semibold">중요 안내</h2>
        <p className="text-slate-700">
          본 사이트의 자가점검/훈련은 의료적 진단이 아닌 참고/체험용입니다. 증상이 지속되거나
          우려가 있다면 반드시 의료 전문가와 상담하세요.
        </p>
      </section>
    </div>
  );
}
