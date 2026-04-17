"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { makeId } from "@/lib/id";
import { hasSession } from "@/lib/client-auth";
import { screeningStorage } from "@/lib/storage";

type Answer = "yes" | "no" | "";

const questions = [
  "최근 들어 같은 질문을 반복하는 일이 늘었다.",
  "약속/일정을 자주 잊거나 메모를 자주 확인해야 한다.",
  "익숙한 장소에서 길을 헷갈리거나 방향감각이 떨어진 느낌이 있다.",
  "물건을 둔 곳을 잊고 찾는 시간이 자주 늘었다.",
  "계산/가계부/은행 업무 등에서 실수가 늘었다.",
  "대화 중 단어가 잘 떠오르지 않아 말이 끊기는 일이 늘었다.",
  "집안일/취미 등 익숙한 일을 예전보다 어렵게 느낀다.",
  "가족/주변에서 기억력/집중력 변화를 이야기한 적이 있다."
];

export function ScreeningSelfCheck() {
  const [answers, setAnswers] = useState<Answer[]>(() =>
    questions.map(() => "")
  );
  const [done, setDone] = useState(false);
  const [saveNote, setSaveNote] = useState("");

  const yesCount = useMemo(
    () => answers.filter((a) => a === "yes").length,
    [answers]
  );

  const canSubmit = answers.every((a) => a !== "");

  const resultText = useMemo(() => {
    if (!done) return "";
    if (yesCount <= 1) return "현재는 큰 위험 신호가 낮아 보입니다. 생활습관을 꾸준히 유지해보세요.";
    if (yesCount <= 3) return "가벼운 변화가 느껴질 수 있습니다. 루틴 점검과 기록을 권장합니다.";
    return "변화가 지속된다면 전문가 상담을 권장합니다. 이 결과는 진단이 아닙니다.";
  }, [done, yesCount]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2">
        <h1 className="text-2xl font-semibold">인지건강 자가점검</h1>
        <p className="text-slate-700">
          최근 1~3개월을 기준으로 답해주세요. 본 점검은{" "}
          <span className="font-semibold">의료 진단이 아닌 참고용</span>입니다.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        {questions.map((q, idx) => (
          <div key={q} className="rounded-2xl border border-slate-200 p-4">
            <div className="font-medium">{idx + 1}. {q}</div>
            <div className="mt-3 flex flex-wrap gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`q${idx}`}
                  checked={answers[idx] === "yes"}
                  onChange={() => {
                    const next = [...answers];
                    next[idx] = "yes";
                    setAnswers(next);
                  }}
                />
                예
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`q${idx}`}
                  checked={answers[idx] === "no"}
                  onChange={() => {
                    const next = [...answers];
                    next[idx] = "no";
                    setAnswers(next);
                  }}
                />
                아니오
              </label>
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
                test: "인지건강 자가점검",
                summary: `예 ${yesCount}개 / ${questions.length}문항`,
                note: "의료 진단이 아닌 참고/체험용 결과입니다."
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
          <div className="text-xl font-semibold">예 {yesCount}개</div>
          <p className="text-slate-800">{resultText}</p>
          <div className="text-sm text-slate-700">
            <Link className="underline text-brand-800" href="/mypage">
              마이페이지에서 기록 확인
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
