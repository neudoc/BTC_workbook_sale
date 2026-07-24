"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { makeId } from "@/lib/id";
import { hasSession } from "@/lib/client-auth";
import { screeningStorage, type ScreeningRecord } from "@/lib/storage";

const TEST_NAME = "인지건강 자가점검(KDSQ)";
const MAX_SCORE = 30; // KDSQ-C
const CUTOFF = 6;

type Opt = { label: string; score: number };
const triOptions: Opt[] = [
  { label: "아니다", score: 0 },
  { label: "가끔·조금 그렇다", score: 1 },
  { label: "자주·많이 그렇다", score: 2 },
];
const binOptions: Opt[] = [
  { label: "아니다", score: 0 },
  { label: "그렇다", score: 1 },
];

// KDSQ-C 인지 15문항 (0/1/2)
const cognitiveQuestions: { text: string; hint?: string }[] = [
  { text: "오늘이 몇 월이고 무슨 요일인지를 잘 모른다." },
  { text: "자기가 놓아둔 물건을 찾지 못한다." },
  { text: "같은 질문을 반복해서 한다." },
  { text: "약속을 하고서 잊어버린다." },
  { text: "물건을 가지러 갔다가 잊어버리고 그냥 온다." },
  { text: "물건이나 사람의 이름을 대기가 힘들어 머뭇거린다." },
  { text: "대화 중 내용이 이해되지 않아 반복해서 물어본다." },
  { text: "길을 잃거나 헤맨 적이 있다." },
  { text: "예전에 비해 계산 능력이 떨어졌다.", hint: "예: 물건 값이나 거스름돈 계산을 못한다" },
  { text: "예전에 비해 성격이 변했다." },
  { text: "이전에 잘 다루던 기구의 사용이 서툴러졌다.", hint: "예: 세탁기, 전기밥솥, 컴퓨터 등" },
  { text: "예전에 비해 방이나 집안의 정리 정돈을 잘하지 못한다." },
  { text: "상황과 날씨에 맞게 스스로 옷을 선택하여 입지 못한다." },
  { text: "혼자 대중교통 수단을 이용하여 목적지에 가기 힘들다.", hint: "관절염 등 신체적 문제로 인한 경우는 제외" },
  { text: "내복이나 옷이 더러워져도 갈아입지 않으려고 한다." },
];

// KDSQ-V 혈관성(허혈) 5문항 (아니다/그렇다)
const vascularQuestions: string[] = [
  "위의 인지 증상들이 어느 날 갑자기 발생하였다.",
  "뇌졸중을 앓았던 적이 있다.",
  "고혈압이나 당뇨병을 앓고 있다.",
  "보행 장애, 발음 장애, 손발 마비, 감각 이상 등이 있었다.",
  "증상이 갑자기 나빠졌다 서서히 회복되고 다시 나빠짐을 반복하면서 점차 심해진다.",
];

// KDSQ-D 우울 5문항 (0/1/2)
const depressionQuestions: string[] = [
  "우울한 기분이 든다(혹은 그런 이야기를 한다).",
  "잠을 잘 못 자거나 일찍 깬다.",
  "모든 일에 흥미를 잃었다.",
  "자신이 쓸모없다고 느낀다(혹은 그런 말을 한다).",
  "식욕이 떨어졌다.",
];

type Tone = "brand" | "gold";
type Interp = { level: string; tone: Tone; text: string };

function interpretCognitive(score: number): Interp {
  if (score < CUTOFF)
    return {
      level: "위험도 낮음",
      tone: "brand",
      text:
        `총점 ${score}점으로 KDSQ 절단점(${CUTOFF}점) 미만입니다. 현재 인지 저하 위험도는 낮은 편입니다. ` +
        "다만 진단이 아니므로, 변화가 느껴지면 생활습관 관리와 정기 점검을 이어가세요.",
    };
  if (score < 15)
    return {
      level: "상담 권장",
      tone: "gold",
      text:
        `총점 ${score}점으로 절단점(${CUTOFF}점) 이상입니다. 초기 인지 저하 가능성이 있어, ` +
        "신경과·정신건강의학과 또는 치매안심센터에서 전문가 상담과 정밀 평가를 권장합니다.",
    };
  return {
    level: "전문 평가 권장",
    tone: "gold",
    text:
      `총점 ${score}점으로 절단점(${CUTOFF}점)을 크게 넘습니다. 보고된 변화가 많은 편이므로 ` +
      "가급적 빠른 시일 내 전문가 진료와 정밀 인지 평가를 권장합니다.",
  };
}

function interpretVascular(count: number): Interp {
  if (count === 0)
    return {
      level: "해당 없음",
      tone: "brand",
      text: "혈관성 관련 위험요인은 특별히 확인되지 않았습니다.",
    };
  if (count <= 2)
    return {
      level: "일부 해당",
      tone: "gold",
      text:
        `혈관성 위험요인이 ${count}개 확인됩니다. 뇌졸중 병력·갑작스러운 발병·고혈압/당뇨 등이 있으면 ` +
        "혈관성 요인이 인지 변화에 관여할 수 있으니 전문가와 상의하세요.",
    };
  return {
    level: "전문 평가 권장",
    tone: "gold",
    text:
      `혈관성 위험요인이 ${count}개로 여러 개 확인됩니다. 특히 갑작스러운 발병이나 계단식 악화가 있다면 ` +
      "신경과 진료를 권장합니다. (혈관성 치매 가능성 참고)",
  };
}

function interpretDepression(score: number): Interp {
  if (score <= 2)
    return {
      level: "낮음",
      tone: "brand",
      text: "우울 관련 항목은 낮은 편입니다.",
    };
  if (score <= 5)
    return {
      level: "일부 해당",
      tone: "gold",
      text:
        `우울 점수 ${score}/10점으로 우울감·수면·흥미 저하 등 일부 증상이 확인됩니다. ` +
        "우울은 인지기능 저하를 유발할 수 있고 치료가 가능하므로 전문가 상담을 고려하세요.",
    };
  return {
    level: "전문 평가 권장",
    tone: "gold",
    text:
      `우울 점수 ${score}/10점으로 우울 증상이 뚜렷합니다. 우울이 인지 저하처럼 나타날 수 있어(가성치매) ` +
      "정신건강의학과 등 전문가 상담을 권장합니다.",
  };
}

function QuestionBlock({
  title,
  desc,
  list,
  options,
  answers,
  onSelect,
}: {
  title: string;
  desc: string;
  list: { text: string; hint?: string }[];
  options: Opt[];
  answers: number[];
  onSelect: (idx: number, score: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">{desc}</p>
      </div>
      {list.map((q, idx) => (
        <div key={q.text} className="rounded-2xl border border-slate-200 p-4">
          <div className="font-medium">
            {idx + 1}. {q.text}
          </div>
          {q.hint ? <div className="mt-1 text-sm text-slate-500">{q.hint}</div> : null}
          <div className={`mt-3 grid gap-2 ${options.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
            {options.map((opt) => (
              <label
                key={opt.label}
                className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                  answers[idx] === opt.score
                    ? "border-brand-600 bg-brand-50 font-semibold text-brand-900"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  className="min-h-0 min-w-0"
                  name={`${title}-${idx}`}
                  checked={answers[idx] === opt.score}
                  onChange={() => onSelect(idx, opt.score)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ResultRow({ label, valueText, info }: { label: string; valueText: string; info: Interp }) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        info.tone === "gold" ? "border-gold-200 bg-gold-50" : "border-brand-100 bg-brand-50"
      }`}
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-bold text-slate-950">{label}</span>
        <span className="text-lg font-bold text-slate-950">{valueText}</span>
        <span
          className={`rounded-full px-3 py-0.5 text-xs font-bold ${
            info.tone === "gold" ? "bg-gold-200 text-gold-900" : "bg-brand-200 text-brand-900"
          }`}
        >
          {info.level}
        </span>
      </div>
      <p className="mt-2 text-sm leading-7 text-slate-800">{info.text}</p>
    </div>
  );
}

export function ScreeningSelfCheck() {
  const [cA, setCA] = useState<number[]>(() => cognitiveQuestions.map(() => -1));
  const [vA, setVA] = useState<number[]>(() => vascularQuestions.map(() => -1));
  const [dA, setDA] = useState<number[]>(() => depressionQuestions.map(() => -1));
  const [done, setDone] = useState(false);
  const [saveNote, setSaveNote] = useState("");
  const [history, setHistory] = useState<ScreeningRecord[]>([]);

  useEffect(() => {
    setHistory(screeningStorage.getAll().filter((r) => r.test === TEST_NAME));
  }, []);

  const cTotal = useMemo(() => cA.reduce((s, a) => s + (a > 0 ? a : 0), 0), [cA]);
  const vCount = useMemo(() => vA.reduce((s, a) => s + (a > 0 ? a : 0), 0), [vA]);
  const dTotal = useMemo(() => dA.reduce((s, a) => s + (a > 0 ? a : 0), 0), [dA]);

  const canSubmit =
    cA.every((a) => a >= 0) && vA.every((a) => a >= 0) && dA.every((a) => a >= 0);

  const cInfo = useMemo(() => (done ? interpretCognitive(cTotal) : null), [done, cTotal]);
  const vInfo = useMemo(() => (done ? interpretVascular(vCount) : null), [done, vCount]);
  const dInfo = useMemo(() => (done ? interpretDepression(dTotal) : null), [done, dTotal]);

  function submit() {
    setDone(true);
    const info = interpretCognitive(cTotal);
    screeningStorage.add({
      id: makeId("screening"),
      createdAt: new Date().toISOString(),
      test: TEST_NAME,
      summary: `인지 ${cTotal}/30 · 혈관성 ${vCount}/5 · 우울 ${dTotal}/10 · ${info.level}`,
      note: "의료 진단이 아닌 참고/선별용 결과입니다.",
      score: cTotal,
      maxScore: MAX_SCORE,
      level: info.level,
    });
    setHistory(screeningStorage.getAll().filter((r) => r.test === TEST_NAME));
    void (async () => {
      const ok = await hasSession();
      setSaveNote(
        ok
          ? "이 기기와 마이페이지 기록에 저장했습니다."
          : "이 기기에 기록을 저장했습니다. 로그인하면 마이페이지에서도 확인할 수 있습니다."
      );
    })();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2">
        <h1 className="text-2xl font-semibold">인지건강 자가점검 (KDSQ)</h1>
        <p className="text-slate-700">
          한국판 치매선별설문(KDSQ)입니다. 이 설문은{" "}
          <span className="font-semibold">대상자 본인이 직접</span> 하거나,{" "}
          <span className="font-semibold">함께 지내는 보호자(가족)가 대신</span> 응답할 수 있습니다. 최근 6개월간의
          변화를 기준으로, 인지(15문항)·혈관성(5문항)·우울(5문항)에 모두 답해 주세요.
        </p>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
          ⚠️ 본 점검은 <span className="font-bold">의료 진단이 아닌 참고·선별용</span>입니다. 결과와 무관하게
          걱정되는 증상이 있으면 반드시 전문가와 상담하세요.
        </div>
      </div>

      <QuestionBlock
        title="1. 인지 (KDSQ-C)"
        desc="기억·언어·판단·일상생활 능력의 변화 15문항"
        list={cognitiveQuestions}
        options={triOptions}
        answers={cA}
        onSelect={(idx, score) => setCA((p) => p.map((v, i) => (i === idx ? score : v)))}
      />

      <QuestionBlock
        title="2. 혈관성 위험요인 (KDSQ-V)"
        desc="뇌혈관 문제(혈관성 치매) 관련 5문항"
        list={vascularQuestions.map((t) => ({ text: t }))}
        options={binOptions}
        answers={vA}
        onSelect={(idx, score) => setVA((p) => p.map((v, i) => (i === idx ? score : v)))}
      />

      <QuestionBlock
        title="3. 우울 (KDSQ-D)"
        desc="우울이 인지 변화에 관여하는지 확인하는 5문항"
        list={depressionQuestions.map((t) => ({ text: t }))}
        options={triOptions}
        answers={dA}
        onSelect={(idx, score) => setDA((p) => p.map((v, i) => (i === idx ? score : v)))}
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
        <button
          type="button"
          disabled={!canSubmit}
          className="w-full rounded-xl bg-brand-700 px-5 py-3 font-medium text-white hover:bg-brand-800 disabled:opacity-50"
          onClick={submit}
        >
          결과 보기(저장)
        </button>
        {!canSubmit ? (
          <p className="text-center text-sm text-slate-500">세 영역 모든 문항에 응답하면 결과를 볼 수 있습니다.</p>
        ) : null}
      </div>

      {done && cInfo && vInfo && dInfo ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
          <div className="text-sm text-slate-600">결과 (참고용 · 진단 아님)</div>
          <ResultRow label="인지 (KDSQ-C)" valueText={`${cTotal} / 30점`} info={cInfo} />
          <ResultRow label="혈관성 (KDSQ-V)" valueText={`${vCount} / 5개`} info={vInfo} />
          <ResultRow label="우울 (KDSQ-D)" valueText={`${dTotal} / 10점`} info={dInfo} />
          <p className="text-xs leading-6 text-slate-500">
            해석 기준: 양동원 등, 「한국판 치매선별설문(KDSQ)의 개발과 타당도 및 신뢰도 평가」, 대한신경과학회지
            2002;20(2). 인지(KDSQ-C)는 절단점 6점 기준 민감도 79%·특이도 80%로 보고되었습니다. 혈관성·우울 척도는
            원인·배경을 참고하기 위한 보조 지표이며, 모든 결과는 집단 연구에 근거한 <span className="font-semibold">선별용</span>으로
            개인의 진단을 의미하지 않습니다.
          </p>
          <div className="text-sm">
            <Link className="font-semibold text-brand-800 underline" href="/contact">
              전문가 상담 문의
            </Link>
          </div>
          {saveNote ? <div className="text-sm text-slate-700">{saveNote}</div> : null}
        </div>
      ) : null}

      {history.length > 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-950">인지 점수 추적</h2>
            <span className="text-sm text-slate-500">최근 {history.length}회</span>
          </div>
          <ul className="space-y-2">
            {history.map((rec, i) => {
              const score = rec.score ?? 0;
              const prev = history[i + 1]?.score; // newest-first
              const delta = prev == null ? null : score - prev;
              return (
                <li key={rec.id} className="flex items-center gap-3 text-sm">
                  <span className="w-24 shrink-0 text-slate-500">
                    {new Date(rec.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${score >= CUTOFF ? "bg-gold-400" : "bg-brand-500"}`}
                      style={{ width: `${Math.min(100, (score / MAX_SCORE) * 100)}%` }}
                    />
                  </div>
                  <span className="w-14 shrink-0 text-right font-semibold text-slate-900">{score}점</span>
                  <span className="w-12 shrink-0 text-right">
                    {delta == null ? (
                      <span className="text-slate-400">—</span>
                    ) : delta > 0 ? (
                      <span className="text-red-600">▲{delta}</span>
                    ) : delta < 0 ? (
                      <span className="text-emerald-600">▼{Math.abs(delta)}</span>
                    ) : (
                      <span className="text-slate-400">±0</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="text-xs leading-6 text-slate-500">
            인지(KDSQ-C) 점수가 <span className="font-semibold">오를수록 위험도가 올라간다는 의미</span>입니다(▲ 증가 = 주의).
            추세가 지속적으로 오르면 전문가 상담을 권장합니다. 기록은 이 기기(브라우저)에 저장됩니다.
          </p>
        </div>
      ) : null}
    </div>
  );
}
