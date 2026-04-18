import type { Metadata } from "next";
import Link from "next/link";
import { AccessDenied } from "@/components/AccessDenied";
import { getSession, hasRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "전문가센터",
  description: "지도사 과정 소개, 기관 도입 안내, 승인 후 전문가 자료 제공",
  robots: { index: false, follow: false }
};

export default async function ExpertCenterPage() {
  const session = getSession();

  if (!session) {
    return (
      <div className="max-w-3xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h1 className="text-2xl font-semibold">전문가센터</h1>
          <p className="mt-3 text-slate-700">
            지도사 과정, 기관 도입 검토, 전문가용 운영 흐름을 먼저 확인할 수 있는 소개 페이지입니다.
            전체 교육자료와 운영 도구는 로그인 또는 승인 이후에만 이어집니다.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/login" className="inline-flex items-center justify-center rounded-xl bg-brand-700 px-5 py-3 font-medium text-white hover:bg-brand-800">
              로그인하기
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 font-medium hover:bg-slate-50">
              승인 문의하기
            </Link>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
            <h2 className="text-lg font-semibold">게스트 안내</h2>
            <ul className="list-disc pl-5 text-slate-700 space-y-2">
              <li>지도사 과정 소개와 기관 도입 검토 흐름</li>
              <li>전문가센터 자료 범위와 승인 절차 안내</li>
            </ul>
          </section>
          <section className="rounded-2xl border border-brand-100 bg-brand-50 p-6 space-y-3">
            <h2 className="text-lg font-semibold">승인 후 제공 범위</h2>
            <ul className="list-disc pl-5 text-slate-700 space-y-2">
              <li>교육자료실 전체 문서 및 양식 접근</li>
              <li>운영 도구, 대상자 관리, 평가 기록</li>
              <li>기관 운영에 맞춘 전문가 전용 작업 흐름</li>
            </ul>
          </section>
        </div>
      </div>
    );
  }

  if (session.role === "expert_pending") {
    return (
      <div className="max-w-2xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h1 className="text-2xl font-semibold">전문가센터</h1>
          <p className="mt-2 text-slate-700">현재 상태: <span className="font-mono">승인 대기</span></p>
          <p className="mt-3 text-slate-700">승인 후 교육자료/양식/운영도구에 접근할 수 있습니다.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/contact" className="inline-flex items-center justify-center rounded-xl bg-brand-700 px-5 py-3 font-medium text-white hover:bg-brand-800">
              승인 문의하기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!hasRole(session, ["expert", "admin"])) {
    return (
      <AccessDenied title="전문가 전용 페이지입니다" description="승인된 전문가만 전문가센터에 접근할 수 있습니다." />
    );
  }

  const resources = await prisma.expertResource.findMany({
    orderBy: { createdAt: "desc" }
  });

  const grouped = resources.reduce<Record<string, typeof resources>>((acc, r) => {
    const cat = r.category || "기타";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(r);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold">전문가센터</h1>
        <p className="mt-2 text-slate-700">
          {session.name}님 환영합니다. (권한: <span className="font-mono">{session.role}</span>)
        </p>
      </div>

      {Object.entries(grouped).map(([category, items]) => (
        <section key={category} className="space-y-3">
          <h2 className="text-lg font-semibold">{category}</h2>
          <div className="grid gap-3">
            {items.map((r) => (
              <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{r.title}</div>
                    {r.description ? (
                      <div className="mt-1 text-sm text-slate-600">{r.description}</div>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    {r.fileUrl ? (
                      <a
                        href={r.fileUrl}
                        download
                        className="inline-flex items-center justify-center rounded-xl bg-brand-700 px-3 py-1.5 text-sm text-white hover:bg-brand-800"
                      >
                        다운로드
                      </a>
                    ) : null}
                  </div>
                </div>
                {r.content ? (
                  <div className="mt-3 text-sm text-slate-700 whitespace-pre-line border-t border-slate-100 pt-3">
                    {r.content}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ))}

      {resources.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700">
          등록된 자료가 없습니다.
        </div>
      ) : null}
    </div>
  );
}
