import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";

export const metadata: Metadata = {
  title: "면책문구",
  description: "검사/훈련 결과는 의료 진단이 아닙니다."
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <PageTitle title="면책문구" description="PRD의 법적/정책 요구사항을 반영한 기본 문구입니다." />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 text-slate-800">
        <p>
          본 사이트의 인지훈련/자가점검/콘텐츠는 의료적 진단, 치료, 처방을 제공하지 않습니다.
        </p>
        <p>
          자가점검 결과는 참고용이며, 증상이 지속되거나 우려가 있는 경우 의료 전문가와 상담하시기 바랍니다.
        </p>
        <p>
          본 사이트는 치료 효과를 단정하는 표현을 지양하며, 건강관리/교육/체험 목적임을 명확히 합니다.
        </p>
      </div>
    </div>
  );
}

