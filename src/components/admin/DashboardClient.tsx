"use client";

import { useEffect, useState } from "react";

interface Stats {
  totalMembers: number;
  totalOrders: number;
  totalRevenue: number;
  unansweredInquiries: number;
  pendingExperts: number;
}

const STAT_CARDS: {
  key: keyof Stats;
  label: string;
  icon: string;
  format: "number" | "currency";
  color: string;
}[] = [
  {
    key: "totalMembers",
    label: "총 회원 수",
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    format: "number",
    color: "bg-brand-50 text-brand-800",
  },
  {
    key: "totalOrders",
    label: "총 주문 수",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
    format: "number",
    color: "bg-blue-50 text-blue-800",
  },
  {
    key: "totalRevenue",
    label: "총 매출",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    format: "currency",
    color: "bg-emerald-50 text-emerald-800",
  },
  {
    key: "unansweredInquiries",
    label: "미답변 문의",
    icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z",
    format: "number",
    color: "bg-amber-50 text-amber-800",
  },
  {
    key: "pendingExperts",
    label: "승인 대기 전문가",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    format: "number",
    color: "bg-purple-50 text-purple-800",
  },
];

function formatValue(value: number, format: "number" | "currency") {
  if (format === "currency") {
    return value.toLocaleString("ko-KR") + "원";
  }
  return value.toLocaleString("ko-KR") + "명";
}

export function DashboardClient({ adminName }: { adminName: string }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {
        // Demo fallback
        setStats({
          totalMembers: 0,
          totalOrders: 0,
          totalRevenue: 0,
          unansweredInquiries: 0,
          pendingExperts: 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-slate-700">
          안녕하세요, <span className="font-semibold">{adminName}</span>님. 오늘도 좋은 하루 되세요.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {STAT_CARDS.map((card) => (
          <div
            key={card.key}
            className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-xl p-2 ${card.color}`}>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d={card.icon}
                  />
                </svg>
              </div>
              <span className="text-sm text-slate-600">{card.label}</span>
            </div>
            <div className="text-2xl font-semibold">
              {loading ? (
                <div className="h-8 w-20 animate-pulse rounded bg-slate-100" />
              ) : stats ? (
                formatValue(stats[card.key], card.format)
              ) : (
                "-"
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
