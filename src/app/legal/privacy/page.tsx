import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "개인정보처리방침(예시 문구)"
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <PageTitle
        title="개인정보처리방침"
        description="운영 환경에서는 수집 항목/보관 기간/처리 위탁/국외 이전 여부 등을 명확히 기재하세요."
      />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 text-slate-800">
        <h2 className="text-lg font-semibold">수집 항목(예시)</h2>
        <ul className="list-disc pl-5 text-slate-700 space-y-1">
          <li>회원 정보: 이름, 이메일(로그인/고객지원 목적)</li>
          <li>구매 정보: 주문/결제 처리에 필요한 정보(실제 운영 시 PG 연동 기준)</li>
          <li>서비스 이용 기록: 접속 로그, 쿠키 등(분석/보안 목적)</li>
        </ul>
        <h2 className="text-lg font-semibold">보관 및 파기</h2>
        <p>관련 법령 및 내부 정책에 따라 보관 후 파기합니다.</p>
      </div>
    </div>
  );
}

