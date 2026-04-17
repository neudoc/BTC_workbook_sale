"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { makeId } from "@/lib/id";
import { hasSession } from "@/lib/client-auth";
import { screeningStorage } from "@/lib/storage";

type Score = 0 | 1 | 2;

type Item = {
  label: string;
  help: string;
};

const items: Item[] = [
  { label: "수면", help: "최근 1주일 평균 수면이 규칙적이었나요?" },
  { label: "운동", help: "주 3회 이상 가벼운 운동(걷기 등)을 했나요?" },
  { label: "식사", help: "균형 잡힌 식사(채소/단백질 등)를 의식했나요?" },
  { label: "사회활동", help: "대화/모임/취미 등 사회적 교류가 있었나요?" },
  { label: "인지자극", help: "독서/퍼즐/학습 등 두뇌 자극 활동을 했나요?" },
  { label: "스트레스", help: "스트레스 관리(휴식/취미)가 잘 되었나요?" }
];

const options: { label: string; value: Score }[] = [
  { label: "잘 하고 있어요", value: 2 },
  { label: "보통이에요", value: 1 },
  { label: "개선이 필요해요", value: 0 }
];

export function LifestyleCheck() {
  const [scores, setScores] = useState<(Score | null)[]>(() =>
    items.map(() => null)
  );
  const [done, setDone] = useState(false);
  const [saveNote, setSaveNote] = useState("");

  const total = useMemo(
    () => scores.reduce<number>((sum, s) => sum + (s ?? 0), 0),
    [scores]
  );
  const max = items.length * 2;
  const canSubmit = scores.every((s) => s !== null);

  const summary = useMemo(() => {
    if (!done) return "";
    const ratio = total / max;
    if (ratio >= 0.8) return "아주 좋아요. 현재 루틴을 유지해보세요.";
    if (ratio >= 0.55) return "괜찮아요. 한두 가지 습관을 정해서 꾸준히 개선해보세요.";
    return "최근 루틴이 힘들었을 수 있어요. 작은 목표부터 천천히 시작해보세요.";
  }, [done, total, max]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2">
        <h1 className="text-2xl font-semibold">생활습관 체크</h1>
        <p className="text-slate-700">
          생활습관은 뇌건강 관리에 영향을 줄 수 있습니다. 점수는{" "}
          <span className="font-semibold">참고용</span>으로만 활용하세요.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        {items.map((item, idx) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 p-4">
            <div className="font-medium">{item.label}</div>
            <div className="mt-1 text-sm text-slate-600">{item.help}</div>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              {options.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3">
                  <input
                    type="radio"
                    name={`i${idx}`}
                    checked={scores[idx] === opt.value}
                    onChange={() => {
                      const next = [...scores];
                      next[idx] = opt.value;
                      setScores(next);
                    }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          disabled={!canSubmit}
          className="w-full rounded-xl bg-brand-700 px-5 py-3 font-medium text-white hover:bg-brand-800 disabled:opacity-50"
          onClick={() => {
            setDone(true);
            void (async () => {
              const ok = await hasSession();
              if (!ok) {
                setSaveNote("로그인하면 마이페이지에 기록을 저장할 수 있습니다.");
                return;
              }
              screeningStorage.add({
                id: makeId("screening"),
                createdAt: new Date().toISOString(),
                test: "생활습관 체크",
                summary: `${total} / ${max}점`,
                note: "건강관리 참고용 결과입니다."
              });
              setSaveNote("기록을 저장했습니다.");
            })();
          }}
        >
          결과 보기(저장)
        </button>
      </div>

      {done ? (
        <div className="rounded-2xl border border-brand-100 bg-brand-50 p-6 space-y-3">
          <div className="text-sm text-slate-700">결과(참고용)</div>
          <div className="text-xl font-semibold">{total} / {max}점</div>
          <p className="text-slate-800">{summary}</p>
          <div className="text-sm text-slate-700">
            <Link className="underline text-brand-800" href="/training">
              인지훈련도 함께 해보기
            </Link>{" "}
            ·{" "}
            <Link className="underline text-brand-800" href="/mypage">
              마이페이지 기록 확인
            </Link>
          </div>
          {saveNote ? (
            <div className="text-sm text-slate-700">{saveNote}</div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
