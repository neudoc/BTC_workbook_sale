"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { makeId } from "@/lib/id";
import { hasSession } from "@/lib/client-auth";
import { trainingStorage } from "@/lib/storage";

type Step = "intro" | "show" | "input" | "result";

function pickSequence(length: number) {
  const seq: number[] = [];
  while (seq.length < length) {
    const n = 1 + Math.floor(Math.random() * 9);
    if (!seq.includes(n)) seq.push(n);
  }
  return seq;
}

export function NumberSequenceGame() {
  const [step, setStep] = useState<Step>("intro");
  const [level, setLevel] = useState(3);
  const [sequence, setSequence] = useState<number[]>([]);
  const [input, setInput] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  const [saveNote, setSaveNote] = useState("");

  const tiles = useMemo(() => Array.from({ length: 9 }, (_, i) => i + 1), []);

  const start = () => {
    const seq = pickSequence(level);
    setSequence(seq);
    setInput([]);
    setMessage("");
    setSaveNote("");
    setStep("show");
    // 1.2초 뒤 입력 단계로
    window.setTimeout(() => setStep("input"), 1200 + level * 250);
  };

  const press = (n: number) => {
    if (step !== "input") return;
    const next = [...input, n];
    setInput(next);
    if (next.length === sequence.length) {
      const ok = next.every((v, i) => v === sequence[i]);
      if (ok) {
        const nextLevel = Math.min(6, level + 1);
        setMessage(`정답! 난이도 ${nextLevel}로 올라갑니다.`);
        setLevel(nextLevel);
        void (async () => {
          const has = await hasSession();
          if (!has) {
            setSaveNote("로그인하면 마이페이지에 기록을 저장할 수 있습니다.");
            return;
          }
          trainingStorage.add({
            id: makeId("training"),
            createdAt: new Date().toISOString(),
            game: "숫자 순서 기억",
            scoreLabel: `성공(길이 ${level})`
          });
          setSaveNote("기록을 저장했습니다.");
        })();
      } else {
        setMessage(
          `아쉬워요. 정답: ${sequence.join("-")} / 입력: ${next.join("-")}`
        );
        void (async () => {
          const has = await hasSession();
          if (!has) {
            setSaveNote("로그인하면 마이페이지에 기록을 저장할 수 있습니다.");
            return;
          }
          trainingStorage.add({
            id: makeId("training"),
            createdAt: new Date().toISOString(),
            game: "숫자 순서 기억",
            scoreLabel: `실패(길이 ${level})`
          });
          setSaveNote("기록을 저장했습니다.");
        })();
      }
      setStep("result");
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2">
        <h1 className="text-2xl font-semibold">숫자 순서 기억</h1>
        <p className="text-slate-700">
          잠깐 보여주는 숫자 순서를 기억한 뒤, 같은 순서로 눌러주세요.
        </p>
        <p className="text-xs text-slate-600">
          안내: 체험/참고용 훈련입니다.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm text-slate-600">현재 난이도</div>
            <div className="text-xl font-semibold">길이 {level}</div>
          </div>
          {step === "intro" || step === "result" ? (
            <button
              className="rounded-xl bg-brand-700 px-5 py-3 font-medium text-white hover:bg-brand-800"
              type="button"
              onClick={start}
            >
              시작
            </button>
          ) : (
            <div className="text-sm text-slate-600">
              {step === "show" ? "순서를 외워보세요…" : "순서대로 눌러주세요"}
            </div>
          )}
        </div>

        {step === "show" ? (
          <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4 text-slate-800">
            순서: <span className="font-semibold">{sequence.join("  ")}</span>
          </div>
        ) : null}

        {step === "input" ? (
          <div className="rounded-2xl border border-slate-200 p-4 text-slate-800">
            입력: <span className="font-semibold">{input.join("  ") || "—"}</span>
          </div>
        ) : null}

        <div className="grid grid-cols-3 gap-3">
          {tiles.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => press(n)}
              disabled={step !== "input"}
              className="h-16 rounded-2xl border border-slate-200 bg-white text-lg font-semibold disabled:opacity-50 hover:bg-slate-50"
            >
              {n}
            </button>
          ))}
        </div>

        {step === "result" ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-800">
            {message}
          </div>
        ) : null}
        {step === "result" && saveNote ? (
          <div className="text-sm text-slate-700">{saveNote}</div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Link className="underline text-brand-800" href="/mypage">
            마이페이지 기록 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
