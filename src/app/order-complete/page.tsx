import Link from "next/link";
import type { Metadata } from "next";
import { first } from "@/lib/url";

export const metadata: Metadata = {
  title: "주문 완료",
  description: "주문이 완료되었습니다(데모).",
  robots: { index: false, follow: false }
};

export default function OrderCompletePage({
  searchParams
}: {
  searchParams?: { id?: string | string[] };
}) {
  const id = first(searchParams?.id);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold">주문이 완료되었습니다</h1>
        <p className="mt-2 text-slate-700">
          주문번호: <span className="font-mono">{id || "—"}</span>
        </p>
        <p className="mt-2 text-sm text-slate-600">
          안내: 결제/주문 처리는 데모이며, 실제 운영에서는 PG/주문관리 시스템과 연동해야 합니다.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/mypage"
            className="inline-flex items-center justify-center rounded-xl bg-brand-700 px-5 py-3 font-medium text-white hover:bg-brand-800"
          >
            마이페이지 보기
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 font-medium hover:bg-slate-50"
          >
            쇼핑 계속하기
          </Link>
        </div>
      </div>
    </div>
  );
}
