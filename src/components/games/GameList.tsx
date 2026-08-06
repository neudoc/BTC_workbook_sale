"use client";

import { useEffect, useState } from "react";

export type GameItem = {
  href: string;
  thumb: string;
  title: string;
  desc: string;
  domain: string;
};

const PROGRESS_KEY = "btc_games_progress_v1";

/** 시작한 게임 목록을 이 기기에 저장해, 다음 게임을 열어 줍니다. */
function readStarted(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? (arr as string[]) : [];
  } catch {
    return [];
  }
}

export function GameList({ games }: { games: GameItem[] }) {
  const [started, setStarted] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setStarted(readStarted());
    setReady(true);
  }, []);

  // 앞의 게임을 한 번이라도 시작했으면 다음 게임이 열립니다.
  const unlockedCount = Math.min(
    games.length,
    games.reduce((count, g, i) => (i < count && started.includes(g.href) ? count + 1 : count), 1)
  );

  function markStarted(href: string) {
    setStarted((prev) => {
      if (prev.includes(href)) return prev;
      const next = [...prev, href];
      try {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
      } catch {
        /* 저장 실패해도 게임은 열립니다 */
      }
      return next;
    });
  }

  function resetProgress() {
    try {
      localStorage.removeItem(PROGRESS_KEY);
    } catch {
      /* ignore */
    }
    setStarted([]);
  }

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((g, i) => {
          // 서버·첫 렌더에서는 1번만 열어 두고, 저장된 진행도를 읽은 뒤 갱신합니다.
          const locked = ready ? i >= unlockedCount : i > 0;
          const done = started.includes(g.href);

          const card = (
            <>
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.thumb}
                  alt={locked ? "" : `${g.title} 미리보기`}
                  width={320}
                  height={180}
                  loading="lazy"
                  className={`aspect-[16/9] w-full border-b border-slate-100 bg-slate-50 object-cover transition ${
                    locked ? "scale-105 blur-[6px]" : ""
                  }`}
                />
                {locked ? (
                  // 간유리(frosted glass) 느낌의 잠금 표시
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 border-b border-slate-100 bg-white/55 backdrop-blur-md">
                    <span className="text-2xl" aria-hidden>
                      🔒
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      앞의 게임을 하면 열려요
                    </span>
                  </div>
                ) : null}
                {done ? (
                  <span className="absolute right-3 top-3 rounded-full bg-brand-700 px-2.5 py-1 text-xs font-bold text-white">
                    완료
                  </span>
                ) : null}
              </div>

              <div className="flex flex-1 flex-col p-6">
                <span
                  className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-bold ${
                    locked ? "bg-slate-100 text-slate-500" : "bg-brand-100 text-brand-800"
                  }`}
                >
                  {g.domain}
                </span>
                <h2
                  className={`mt-3 text-lg font-bold transition ${
                    locked ? "text-slate-400" : "text-slate-950 group-hover:text-brand-700"
                  }`}
                >
                  {g.title}
                </h2>
                <p
                  className={`mt-2 flex-1 text-sm leading-6 ${
                    locked ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {locked ? "이전 게임을 시작하면 열립니다." : g.desc}
                </p>
                <span
                  className={`mt-4 inline-flex items-center gap-1.5 text-sm font-bold ${
                    locked ? "text-slate-400" : "text-brand-700"
                  }`}
                >
                  {locked ? (
                    "잠김"
                  ) : (
                    <>
                      게임 시작 <span aria-hidden>→</span>
                    </>
                  )}
                </span>
              </div>
            </>
          );

          const base =
            "group flex flex-col overflow-hidden rounded-[18px] border bg-white shadow-sm transition";

          return locked ? (
            <div
              key={g.href}
              aria-disabled="true"
              className={`${base} select-none border-slate-200 opacity-95`}
            >
              {card}
            </div>
          ) : (
            <a
              key={g.href}
              href={g.href}
              target="_blank"
              rel="noreferrer"
              onClick={() => markStarted(g.href)}
              className={`${base} border-slate-200 hover:border-brand-300 hover:shadow-md`}
            >
              {card}
            </a>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          진행 상황: <strong>{Math.min(unlockedCount, games.length)}</strong> / {games.length}개
          열림
        </p>
        {ready && started.length > 0 ? (
          <button
            type="button"
            onClick={resetProgress}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            처음부터 다시
          </button>
        ) : null}
      </div>
    </>
  );
}
