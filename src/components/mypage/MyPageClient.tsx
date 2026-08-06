"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Session } from "@/lib/session";
import { orderStorage, screeningStorage, trainingStorage, type Order, type ScreeningRecord, type TrainingRecord } from "@/lib/storage";

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString("ko-KR");
  } catch {
    return iso;
  }
}

function formatPrice(won: number) {
  return won.toLocaleString("ko-KR") + "원";
}

export function MyPageClient({ session }: { session: Session }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [training, setTraining] = useState<TrainingRecord[]>([]);
  const [screening, setScreening] = useState<ScreeningRecord[]>([]);

  useEffect(() => {
    setOrders(orderStorage.getAll());
    setScreening(screeningStorage.getAll());

    const local = trainingStorage.getAll();
    setTraining(local);

    // 계정에 저장된 기록(서버)과 이 기기 기록을 합쳐서 보여 줍니다.
    fetch("/api/training", { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : null))
      .then((rows) => {
        if (!Array.isArray(rows)) return;
        const fromServer: TrainingRecord[] = rows.map(
          (r: { id: number; gameType: string; score: number; playedAt: string; resultJson: string | null }) => {
            let label = `점수 ${r.score}점`;
            try {
              const parsed = r.resultJson ? JSON.parse(r.resultJson) : null;
              if (parsed?.label) label = String(parsed.label);
            } catch {
              /* 기본 라벨 사용 */
            }
            return {
              id: `srv_${r.id}`,
              createdAt: r.playedAt,
              game: r.gameType,
              scoreLabel: label,
            };
          }
        );
        // 같은 기록이 양쪽에 있을 수 있어 시각+게임명으로 중복 제거
        const seen = new Set<string>();
        const merged = [...fromServer, ...local].filter((rec) => {
          const key = `${rec.game}|${rec.scoreLabel}|${rec.createdAt.slice(0, 16)}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        merged.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
        setTraining(merged);
      })
      .catch(() => {
        /* 비로그인·오프라인이면 이 기기 기록만 표시 */
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold">마이페이지</h1>
        <p className="mt-2 text-slate-700">
          {session.name}님 · 권한: <span className="font-mono">{session.role}</span>
        </p>
        <p className="mt-2 text-xs leading-5 text-slate-600">
          인지훈련·게임 기록은 계정에 저장되어 다른 기기에서도 확인할 수 있습니다.
          주문·자가점검 기록은 현재 이 기기에만 저장됩니다.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
          <h2 className="text-lg font-semibold">최근 인지훈련 기록</h2>
          {training.length ? (
            <ul className="space-y-2">
              {training.slice(0, 6).map((r) => (
                <li key={r.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="font-medium">{r.game}</div>
                  <div className="text-sm text-slate-700">{r.scoreLabel}</div>
                  <div className="text-xs text-slate-500">{formatDate(r.createdAt)}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-700">아직 기록이 없습니다.</p>
          )}
          <Link className="underline text-brand-800" href="/training">
            인지훈련 하러가기
          </Link>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
          <h2 className="text-lg font-semibold">최근 자가점검 기록</h2>
          {screening.length ? (
            <ul className="space-y-2">
              {screening.slice(0, 6).map((r) => (
                <li key={r.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="font-medium">{r.test}</div>
                  <div className="text-sm text-slate-700">{r.summary}</div>
                  <div className="text-xs text-slate-500">{formatDate(r.createdAt)}</div>
                  <div className="mt-1 text-xs text-slate-600">{r.note}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-700">아직 기록이 없습니다.</p>
          )}
          <Link className="underline text-brand-800" href="/screening">
            자가점검 하러가기
          </Link>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
        <h2 className="text-lg font-semibold">주문 내역(데모)</h2>
        {orders.length ? (
          <ul className="space-y-2">
            {orders.slice(0, 6).map((o) => (
              <li key={o.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="font-medium">주문번호 {o.id}</div>
                  <div className="text-sm text-slate-600">{formatDate(o.createdAt)}</div>
                </div>
                <div className="mt-2 text-sm text-slate-700">
                  {o.items.map((i) => (
                    <div key={i.slug}>
                      {i.title} · {i.quantity}개
                    </div>
                  ))}
                </div>
                <div className="mt-2 font-semibold">{formatPrice(o.total)}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-700">아직 주문 내역이 없습니다.</p>
        )}
        <Link className="underline text-brand-800" href="/shop">
          쇼핑몰로 가기
        </Link>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <div className="font-semibold">전문가센터</div>
        <p className="mt-2 text-slate-700">
          전문가센터는 승인된 전문가만 접근 가능합니다.
        </p>
        <Link className="mt-3 inline-block underline text-brand-800" href="/expert">
          전문가센터로
        </Link>
      </section>
    </div>
  );
}

