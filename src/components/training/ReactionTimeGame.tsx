"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { makeId } from "@/lib/id";
import { hasSession } from "@/lib/client-auth";
import { trainingStorage } from "@/lib/storage";

type Phase = "idle" | "waiting" | "ready" | "done";

function average(values: number[]) {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

function formatMs(ms: number) {
  return `${ms}ms`;
}

function useSpeech() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const enabledRef = useRef(false);
  const lastKeyRef = useRef<string>("");

  const available =
    typeof window !== "undefined" &&
    typeof window.speechSynthesis !== "undefined" &&
    typeof window.SpeechSynthesisUtterance !== "undefined";

  useEffect(() => {
    if (!available) return;
    const sync = () => setVoices(window.speechSynthesis.getVoices());
    sync();
    window.speechSynthesis.addEventListener("voiceschanged", sync);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", sync);
  }, [available]);

  const setEnabled = (value: boolean) => {
    enabledRef.current = value;
    lastKeyRef.current = "";
  };

  const hasKoreanVoice = voices.some((v) => v.lang.toLowerCase().startsWith("ko"));

  const pickKoreanVoice = () => {
    const ko = voices.filter((v) => v.lang.toLowerCase().startsWith("ko"));
    if (ko.length === 0) return null;
    // Prefer "ko-KR" and more natural-sounding voices when available.
    const preferred =
      ko.find((v) => v.lang.toLowerCase() === "ko-kr" && /natural|neural|google/i.test(v.name)) ??
      ko.find((v) => v.lang.toLowerCase() === "ko-kr") ??
      ko[0];
    return preferred ?? null;
  };

  const speak = (
    text: string,
    opts?: {
      key?: string;
      force?: boolean;
    }
  ) => {
    if (!available) return;
    if (!enabledRef.current) return;
    if (!text) return;
    const key = opts?.key ?? text;
    if (!opts?.force && lastKeyRef.current === key) return;
    lastKeyRef.current = key;

    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ko-KR";
      const voice = pickKoreanVoice();
      if (voice) u.voice = voice;
      u.rate = 0.98;
      u.pitch = 1;
      window.speechSynthesis.speak(u);
    } catch {
      // ignore
    }
  };

  return { available, hasKoreanVoice, setEnabled, speak };
}

function ReactionChart({ results }: { results: number[] }) {
  if (results.length === 0) return null;

  const width = 720;
  const height = 220;
  const paddingLeft = 44;
  const paddingRight = 16;
  const paddingTop = 16;
  const paddingBottom = 28;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  const maxValue = Math.max(800, ...results);
  const ticks = [0, Math.round(maxValue / 2), maxValue];

  const barGap = 10;
  const barW = Math.max(12, Math.floor((chartW - barGap * (results.length - 1)) / results.length));

  const toY = (ms: number) => paddingTop + (ms / maxValue) * chartH;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <div className="font-semibold">기록 그래프</div>
        <div className="text-xs text-slate-600">0ms가 위쪽(↑) · 위로 갈수록 더 빠름</div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="반응 속도 기록 그래프(0ms가 위쪽)"
          className="min-w-[560px] w-full"
        >
          {/* grid + axis labels */}
          {ticks.map((t) => {
            const y = toY(t);
            return (
              <g key={t}>
                <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#e2e8f0" />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="#64748b"
                >
                  {t}
                </text>
              </g>
            );
          })}

          {/* bars */}
          {results.map((ms, idx) => {
            const x = paddingLeft + idx * (barW + barGap);
            const y = toY(ms);
            const h = paddingTop + chartH - y;
            const label = `${idx + 1}회: ${ms}ms`;
            return (
              <g key={`${ms}-${idx}`}>
                <title>{label}</title>
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={h}
                  rx={10}
                  fill="#115f4a"
                  opacity={0.9}
                />
                <text
                  x={x + barW / 2}
                  y={height - 10}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#64748b"
                >
                  {idx + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export function ReactionTimeGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [trial, setTrial] = useState(0);
  const [results, setResults] = useState<number[]>([]);
  const [saveNote, setSaveNote] = useState<string>("");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [showVoiceNotice, setShowVoiceNotice] = useState(true);
  const startAt = useRef<number | null>(null);
  const timer = useRef<number | null>(null);
  const introSpokenRef = useRef(false);
  const { available: voiceAvailable, hasKoreanVoice, setEnabled: setSpeechEnabled, speak } = useSpeech();

  const targetTrials = 5;
  const introText =
    "반응 속도를 올려보세요. 박스가 초록색으로 바뀌면 눌러주세요. 총 5회 진행합니다.";

  const avg = useMemo(() => average(results), [results]);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    if (phase === "waiting") speak("기다리세요.", { key: "waiting" });
    if (phase === "ready") speak("지금 누르세요.", { key: "ready" });
    if (phase === "done") speak(`완료. 평균 ${avg} 밀리초입니다.`, { key: "done" });
  }, [phase, speak, avg]);

  useEffect(() => {
    setSpeechEnabled(voiceEnabled);
    if (!voiceEnabled && voiceAvailable) window.speechSynthesis?.cancel?.();
  }, [voiceEnabled, setSpeechEnabled, voiceAvailable]);

  useEffect(() => {
    // Auto-enable voice guidance when the page opens.
    setVoiceEnabled(true);
  }, []);

  useEffect(() => {
    if (!voiceAvailable) return;
    const onGesture = () => {
      if (!voiceEnabled) return;
      if (introSpokenRef.current) return;
      introSpokenRef.current = true;
      speak(introText, { key: "intro", force: true });
      window.removeEventListener("pointerdown", onGesture);
    };
    window.addEventListener("pointerdown", onGesture);
    return () => window.removeEventListener("pointerdown", onGesture);
  }, [voiceAvailable, voiceEnabled, speak, introText]);

  const reset = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
    startAt.current = null;
    setPhase("idle");
    setTrial(0);
    setResults([]);
    setSaveNote("");
    speak("초기화되었습니다.", { key: "reset", force: true });
  };

  const beginTrial = () => {
    setPhase("waiting");
    startAt.current = null;
    const delay = 700 + Math.random() * 1600;
    timer.current = window.setTimeout(() => {
      setPhase("ready");
      startAt.current = performance.now();
    }, delay);
  };

  const click = () => {
    if (voiceEnabled && !introSpokenRef.current) {
      introSpokenRef.current = true;
      speak(introText, { key: "intro", force: true });
    }
    if (phase === "idle") {
      beginTrial();
      return;
    }
    if (phase === "waiting") {
      // 성급 클릭: 다시
      speak("아직입니다. 다시 시작하세요.", { key: "too_soon", force: true });
      reset();
      return;
    }
    if (phase === "ready") {
      const now = performance.now();
      const started = startAt.current;
      if (!started) return;
      const ms = Math.max(0, Math.round(now - started));
      const nextResults = [...results, ms];
      setResults(nextResults);
      const nextTrial = trial + 1;
      setTrial(nextTrial);
      speak(`${formatMs(ms)}.`, { key: `ms_${nextTrial}`, force: true });
      if (nextTrial >= targetTrials) {
        setPhase("done");
        const scoreLabel = `평균 ${average(nextResults)}ms`;
        void (async () => {
          const ok = await hasSession();
          if (!ok) {
            setSaveNote("로그인하면 마이페이지에 기록을 저장할 수 있습니다.");
            return;
          }
          trainingStorage.add({
            id: makeId("training"),
            createdAt: new Date().toISOString(),
            game: "반응 속도",
            scoreLabel
          });
          setSaveNote("기록을 저장했습니다.");
        })();
      } else {
        setPhase("idle");
      }
      return;
    }
  };

  const panel =
    phase === "waiting"
      ? "bg-amber-100 border-amber-200"
      : phase === "ready"
        ? "bg-emerald-100 border-emerald-200"
        : "bg-white border-slate-200";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
        <h1 className="text-2xl font-semibold">반응 속도</h1>
        <div className="text-slate-700">
          박스가 <span className="font-semibold">초록색</span>으로 바뀌면 눌러주세요. 총 {targetTrials}회 진행합니다.
        </div>

        {voiceAvailable && showVoiceNotice ? (
          <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4 text-sm text-slate-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">음성 안내가 자동으로 시작됩니다</div>
                <div className="mt-1 text-slate-700">
                  브라우저 정책상 소리가 바로 안 나면 <span className="font-semibold">화면을 한 번 눌러</span> 시작해 주세요.
                </div>
                <div className="mt-1 text-slate-700">* 훈련 중에도 상황 안내 음성이 나옵니다.</div>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium hover:bg-slate-50"
                onClick={() => setShowVoiceNotice(false)}
              >
                닫기
              </button>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            type="button"
            disabled={!voiceAvailable}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
            onClick={() => setVoiceEnabled((v) => !v)}
          >
            {voiceEnabled ? "음성 안내 끄기" : "음성 안내 시작하기"}
          </button>
          {!voiceAvailable ? (
            <div className="text-xs text-slate-600">
              현재 브라우저에서 음성 안내를 지원하지 않습니다.
            </div>
          ) : (
            <div className="text-xs text-slate-600">* 소리가 안 나면 화면을 한 번 눌러주세요.</div>
          )}
        </div>

        {voiceAvailable ? (
          <details
            className={`rounded-2xl p-4 text-sm text-slate-800 ${
              hasKoreanVoice
                ? "border border-slate-200 bg-slate-50"
                : "border border-amber-200 bg-amber-50"
            }`}
          >
            <summary className="cursor-pointer font-semibold">
              자연스러운 음성이 필요하신가요? (설치 안내)
            </summary>
            <div className="mt-2 text-slate-700 space-y-2">
              {!hasKoreanVoice ? (
                <p className="font-semibold">
                  현재 브라우저에서 사용할 수 있는 한국어 음성이 보이지 않습니다.
                </p>
              ) : null}
              <p>
                Windows에서는 <span className="font-semibold">설정 → 시간 및 언어 → 음성</span>에서 한국어 음성을 추가할 수 있습니다.
              </p>
              <p>
                설치 후 브라우저(Chrome/Edge)를 재시작하면 더 자연스러운 음성으로 안내가 나올 수 있습니다.
              </p>
            </div>
          </details>
        ) : null}

        <p className="text-xs text-slate-600">
          안내: 본 훈련은 의료 진단이 아닌 참고/체험용입니다.
        </p>
      </div>

      <button
        type="button"
        onClick={click}
        className={`w-full select-none rounded-3xl border p-10 text-center transition-colors ${panel}`}
      >
        {phase === "idle" ? (
          <div className="space-y-1">
            <div className="text-lg font-semibold">시작</div>
            <div className="text-sm text-slate-700">
              {trial + 1} / {targetTrials}회
            </div>
          </div>
        ) : null}
        {phase === "waiting" ? (
          <div className="text-lg font-semibold">기다리세요…</div>
        ) : null}
        {phase === "ready" ? (
          <div className="text-lg font-semibold">지금 누르세요</div>
        ) : null}
        {phase === "done" ? (
          <div className="space-y-1">
            <div className="text-lg font-semibold">완료</div>
            <div className="text-sm text-slate-700">평균 {avg}ms</div>
          </div>
        ) : null}
      </button>

      <ReactionChart results={results} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="font-semibold">기록</div>
        <div className="mt-2 text-slate-700">
          {results.length
            ? results.map((r, i) => (
                <span key={i} className="mr-2">
                  {formatMs(r)}
                </span>
              ))
            : "아직 없음"}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-xl border border-slate-200 px-5 py-3 font-medium hover:bg-slate-50"
            onClick={reset}
          >
            초기화
          </button>
          <Link
            href="/mypage"
            className="rounded-xl bg-brand-700 px-5 py-3 font-medium text-white hover:bg-brand-800"
          >
            마이페이지 기록 보기
          </Link>
        </div>
        {saveNote ? (
          <div className="mt-4 text-sm text-slate-700">{saveNote}</div>
        ) : null}
      </div>
    </div>
  );
}
