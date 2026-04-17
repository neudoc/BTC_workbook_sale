import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";

export const metadata: Metadata = {
  title: "환불/교환 정책",
  description: "환불/교환 정책(예시)"
};

export default function RefundPolicyPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <PageTitle title="환불/교환 정책" description="운영 정책 및 전자상거래법 기준으로 교체하세요." />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 text-slate-800">
        <ul className="list-disc pl-5 text-slate-700 space-y-1">
          <li>상품 수령 후 일정 기간 내 교환/환불 신청 가능</li>
          <li>사용/훼손된 상품은 제한될 수 있음</li>
          <li>배송비 부담 기준은 운영 정책에 따름</li>
        </ul>
      </div>
    </div>
  );
}

