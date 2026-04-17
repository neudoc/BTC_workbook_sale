import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";

export const metadata: Metadata = {
  title: "쿠키/마케팅",
  description: "쿠키 및 마케팅 정보 수신 동의 안내"
};

export default function CookiesPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <PageTitle
        title="쿠키/마케팅 동의"
        description="분석/광고 쿠키 사용 여부와 동의/철회 방법을 운영 정책에 맞게 고지하세요."
      />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 text-slate-800">
        <p>
          본 사이트는 서비스 품질 개선 및 분석을 위해 쿠키를 사용할 수 있습니다.
        </p>
        <p>
          운영 환경에서는 쿠키 배너, 동의 기록, 철회 방법, GA4/서치콘솔 연동에 대한 고지가 필요합니다.
        </p>
      </div>
    </div>
  );
}

