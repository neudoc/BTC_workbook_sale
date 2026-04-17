import type { Metadata } from "next";
import { AccessDenied } from "@/components/AccessDenied";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "관리자",
  description: "관리자 페이지(데모)",
  robots: { index: false, follow: false }
};

export default function AdminPage() {
  const session = getSession();
  if (!session) return <AccessDenied title="로그인이 필요합니다" />;
  if (session.role !== "admin") return <AccessDenied title="관리자 전용 페이지입니다" />;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold">관리자 페이지(데모)</h1>
        <p className="mt-2 text-slate-700">
          실제 운영에서는 상품/콘텐츠/문의/회원 관리가 가능한 CMS 또는 관리자 기능이 필요합니다.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
          <h2 className="text-lg font-semibold">관리 항목(예시)</h2>
          <ul className="list-disc pl-5 text-slate-700 space-y-2">
            <li>상품 관리(가격/재고/노출)</li>
            <li>블로그/공지 관리(SEO 포함)</li>
            <li>문의/CS 관리</li>
            <li>전문가 승인/권한 관리</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-brand-100 bg-brand-50 p-6 space-y-3">
          <h2 className="text-lg font-semibold">다음 구현 제안</h2>
          <ul className="list-disc pl-5 text-slate-700 space-y-2">
            <li>DB(PostgreSQL) + 관리자 UI로 CRUD 연결</li>
            <li>NextAuth/커스텀 인증 + 역할/승인 상태 관리</li>
            <li>PG 연동(카드결제) + 주문/배송/환불 정책 적용</li>
          </ul>
          <p className="text-sm text-slate-700">
            참고: 요구사항은 저장소의 <code>website_PRD.md</code>를 기준으로 구성했습니다.
          </p>
        </section>
      </div>
    </div>
  );
}
