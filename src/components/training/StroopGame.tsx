"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { makeId } from "@/lib/id";
import { hasSession } from "@/lib/client-auth";
import { trainingStorage } from "@/lib/storage";

type ColorKey = "red" | "blue" | "green";

const colorLabel: Record<ColorKey, string> = {
  red: "빨강",
  blue: "파랑",
  green: "초록"
};

const colorClass: Record<ColorKey, string> = {
  red: "text-red-600",
  blue: "text-blue-600",
  green: "text-emerald-600"
};

function randomColor(): ColorKey {
  const keys: ColorKey[] = ["red", "blue", "green"];
  return keys[Math.floor(Math.random() * keys.length)];
}

export function StroopGame() {
  const [running, setRunning] = useState(false);
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [saveNote, setSaveNote] = useState("");
  const [target, setTarget] = useState<{ text: ColorKey; ink: ColorKey }>(() => ({
    text: randomColor(),
    ink: randomColor()
  }));

  const totalRounds = 10;

  const prompt = useMemo(
    () => (
      <div className="space-y-2">
        <div className="text-sm text-slate-600">단어의 의미가 아니라</div>
        <div className="text-xl font-semibold">글자 색(잉크 색)을 선택하세요</div>
      </div>
    ),
    []
  );

  const start = () => {
    setRunning(true);
    setRound(0);
    setCorrect(0);
    setWrong(0);
    setSaveNote("");
    setTarget({ text: randomColor(), ink: randomColor() });
  };

  const choose = (choice: ColorKey) => {
    if (!running) return;
    const ok = choice === target.ink;
    const nextCorrect = ok ? correct + 1 : correct;
    const nextWrong = ok ? wrong : wrong + 1;
    setCorrect(nextCorrect);
    setWrong(nextWrong);
    const nextRound = round + 1;
    setRound(nextRound);
    if (nextRound >= totalRounds) {
      setRunning(false);
      const scoreLabel = `정답 ${nextCorrect} / ${totalRounds}`;
      void (async () => {
        const okSession = await hasSession();
        if (!okSession) {
          setSaveNote("로그인하면 마이페이지에 기록을 저장할 수 있습니다.");
          return;
        }
        trainingStorage.add({
          id: makeId("training"),
          createdAt: new Date().toISOString(),
          game: "색-단어 과제",
          scoreLabel
        });
        setSaveNote("기록을 저장했습니다.");
      })();
      return;
    }
    setTarget({ text: randomColor(), ink: randomColor() });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2">
        <h1 className="text-2xl font-semibold">색-단어 과제</h1>
        <p className="text-slate-700">
          단어가 의미하는 색이 아니라, <span className="font-semibold">글자 색</span>을 고르는 연습입니다.
        </p>
        <p className="text-xs text-slate-600">안내: 체험/참고용 훈련입니다.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {prompt}
          <button
            type="button"
            onClick={start}
            className="rounded-xl bg-brand-700 px-5 py-3 font-medium text-white hover:bg-brand-800"
          >
            {running ? "다시 시작" : "시작"}
          </button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center">
          <div className="text-sm text-slate-600">
            라운드 {Math.min(round + 1, totalRounds)} / {totalRounds}
          </div>
          <div className={`mt-3 text-5xl font-black tracking-wider ${colorClass[target.ink]}`}>
            {colorLabel[target.text]}
          </div>
          <div className="mt-3 text-sm text-slate-600">
            정답: 글자 색(잉크 색) = {colorLabel[target.ink]}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(colorLabel) as ColorKey[]).map((key) => (
            <button
              key={key}
              type="button"
              disabled={!running}
              onClick={() => choose(key)}
              className="h-14 rounded-2xl border border-slate-200 bg-white text-lg font-semibold disabled:opacity-50 hover:bg-slate-50"
            >
              {colorLabel[key]}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-between">
          <div className="text-slate-700">
            정답 <span className="font-semibold">{correct}</span> · 오답{" "}
            <span className="font-semibold">{wrong}</span>
          </div>
          <Link className="underline text-brand-800" href="/mypage">
            기록 보기
          </Link>
        </div>
        {saveNote ? (
          <div className="text-sm text-slate-700">{saveNote}</div>
        ) : null}
      </div>
    </div>
  );
}
