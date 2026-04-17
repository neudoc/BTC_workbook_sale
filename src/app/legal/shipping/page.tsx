import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";

export const metadata: Metadata = {
  title: "배송 정책",
  description: "배송 정책(예시)"
};

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <PageTitle title="배송 정책" description="실제 배송사/발송 일정/비용 정책에 맞게 교체하세요." />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 text-slate-800">
        <ul className="list-disc pl-5 text-slate-700 space-y-1">
          <li>결제 완료 후 1~3영업일 내 발송(예시)</li>
          <li>지역/상품 특성에 따라 추가 기간이 소요될 수 있음</li>
          <li>배송비/무료배송 기준은 운영 정책에 따름</li>
        </ul>
      </div>
    </div>
  );
}

