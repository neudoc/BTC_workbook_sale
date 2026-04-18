"use client";

import { useEffect, useState } from "react";

interface PendingExpert {
  id: number;
  name: string;
  email: string;
  specialty: string;
  licenseNumber: string;
  bio: string;
  createdAt: string;
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("ko-KR");
  } catch {
    return dateStr;
  }
}

export default function ExpertsPage() {
  const [experts, setExperts] = useState<PendingExpert[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);

  function load() {
    fetch("/api/admin/members?role=expert_pending")
      .then((res) => res.json())
      .then((data) => setExperts(Array.isArray(data) ? data : []))
      .catch(() => setExperts([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAction(expertId: number, role: string) {
    setProcessing(expertId);
    try {
      const res = await fetch("/api/admin/members", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: expertId, role }),
      });
      if (res.ok) {
        setExperts((prev) => prev.filter((e) => e.id !== expertId));
      } else {
        alert("처리에 실패했습니다.");
      }
    } catch {
      alert("처리에 실패했습니다.");
    } finally {
      setProcessing(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">전문가 승인</h1>
        <p className="mt-1 text-slate-600">전문가 가입 신청을 검토하고 승인 또는 거절합니다.</p>
      </div>

      {/* Stats */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-purple-50 p-2">
            <svg className="h-5 w-5 text-purple-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-semibold">{experts.length}</div>
            <div className="text-sm text-slate-600">승인 대기 중</div>
          </div>
        </div>
      </div>

      {/* Expert Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            로딩 중...
          </div>
        ) : experts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            승인 대기 중인 전문가 신청이 없습니다.
          </div>
        ) : (
          experts.map((expert) => (
            <div
              key={expert.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold">{expert.name}</h3>
                  <p className="text-sm text-slate-500">{expert.email}</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  승인 대기
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {expert.specialty && (
                  <div>
                    <span className="text-xs font-medium text-slate-500">전문 분야</span>
                    <p className="text-sm">{expert.specialty}</p>
                  </div>
                )}
                {expert.licenseNumber && (
                  <div>
                    <span className="text-xs font-medium text-slate-500">면허 번호</span>
                    <p className="text-sm">{expert.licenseNumber}</p>
                  </div>
                )}
              </div>

              {expert.bio && (
                <div>
                  <span className="text-xs font-medium text-slate-500">소개</span>
                  <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">{expert.bio}</p>
                </div>
              )}

              <div className="text-xs text-slate-500">
                신청일: {formatDate(expert.createdAt)}
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => handleAction(expert.id, "expert")}
                  disabled={processing === expert.id}
                  className="inline-flex items-center justify-center rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-50"
                >
                  {processing === expert.id ? "처리 중..." : "승인"}
                </button>
                <button
                  onClick={() => handleAction(expert.id, "member")}
                  disabled={processing === expert.id}
                  className="inline-flex items-center justify-center rounded-xl border border-red-200 px-5 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                >
                  거절
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
