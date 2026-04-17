"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { makeId } from "@/lib/id";
import { hasSession } from "@/lib/client-auth";
import { trainingStorage } from "@/lib/storage";

type Phase = "idle" | "showing" | "waiting" | "feedback" | "done";

type Difficulty = "easy" | "normal" | "hard";

interface TrialResult {
  correct: boolean;
  responseTime: number;
  currentNumber: number;
  nBackNumber: number;
  userAnswer: "same" | "different";
  correctAnswer: "same" | "different";
}

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

function NBackChart({ results }: { results: TrialResult[] }) {
  if (results.length === 0) return null;

  const width = 720;
  const height = 220;
  const paddingLeft = 44;
  const paddingRight = 16;
  const paddingTop = 16;
  const paddingBottom = 28;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  const correctCount = results.filter((r) => r.correct).length;
  const incorrectCount = results.length - correctCount;
  const maxValue = Math.max(10, correctCount, incorrectCount);

  const ticks = [0, Math.round(maxValue / 2), maxValue];

  const barGap = 10;
  const barW = Math.max(12, Math.floor((chartW - barGap * (results.length - 1)) / results.length));

  const toY = (value: number) => paddingTop + (value / maxValue) * chartH;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <div className="font-semibold">기록 그래프</div>
        <div className="text-xs text-slate-600">초록색: 정답 · 빨간색: 오답</div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="N-Back 기록 그래프"
          className="min-w-[560px] w-full"
        >
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

          {results.map((result, idx) => {
            const x = paddingLeft + idx * (barW + barGap);
            const h = chartH;
            const y = paddingTop;
            const color = result.correct ? "#115f4a" : "#dc2626";
            const label = `${idx + 1}회: ${result.correct ? "정답" : "오답"} (${result.responseTime}ms)`;
            return (
              <g key={`${idx}-${result.correct}`}>
                <title>{label}</title>
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={h}
                  rx={10}
                  fill={color}
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

export function NBackGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [sequence, setSequence] = useState<number[]>([]);
  const [currentTrial, setCurrentTrial] = useState(0);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [results, setResults] = useState<TrialResult[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [saveNote, setSaveNote] = useState<string>("");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [showVoiceNotice, setShowVoiceNotice] = useState(true);

  const timer = useRef<number | null>(null);
  const trialStartRef = useRef<number | null>(null);
  const introSpokenRef = useRef(false);
  const { available: voiceAvailable, hasKoreanVoice, setEnabled: setSpeechEnabled, speak } = useSpeech();

  const totalTrials = 20;

  const getNBack = (difficulty: Difficulty): number => {
    switch (difficulty) {
      case "easy":
        return 1;
      case "normal":
        return 2;
      case "hard":
        return 3;
      default:
        return 1;
    }
  };

  const difficultyLabel = useMemo(() => {
    if (!difficulty) return "";
    const labels = {
      easy: "쉬움 (1-back)",
      normal: "보통 (2-back)",
      hard: "어려움 (3-back)"
    };
    return labels[difficulty];
  }, [difficulty]);

  const accuracy = useMemo(() => {
    if (results.length === 0) return 0;
    const correct = results.filter((r) => r.correct).length;
    return Math.round((correct / results.length) * 100);
  }, [results]);

  const avgResponseTime = useMemo(() => {
    return average(results.map((r) => r.responseTime));
  }, [results]);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    setSpeechEnabled(voiceEnabled);
    if (!voiceEnabled && voiceAvailable) window.speechSynthesis?.cancel?.();
  }, [voiceEnabled, setSpeechEnabled, voiceAvailable]);

  useEffect(() => {
    setVoiceEnabled(true);
  }, []);

  useEffect(() => {
    if (!voiceAvailable) return;
    const onGesture = () => {
      if (!voiceEnabled) return;
      if (introSpokenRef.current) return;
      introSpokenRef.current = true;
      const introText =
        "숫자 기억 훈련을 시작합니다. 난이도를 선택해주세요. 숫자가 나타나면, N번 전에 나왔던 숫자와 같은지 기억해서 답해주세요.";
      speak(introText, { key: "intro", force: true });
      window.removeEventListener("pointerdown", onGesture);
    };
    window.addEventListener("pointerdown", onGesture);
    return () => window.removeEventListener("pointerdown", onGesture);
  }, [voiceAvailable, voiceEnabled, speak]);

  const generateNumber = (): number => {
    return Math.floor(Math.random() * 9) + 1;
  };

  const startGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setPhase("showing");
    setResults([]);
    setCurrentTrial(0);
    setSequence([]);

    const nBack = getNBack(selectedDifficulty);
    speak(`숫자 기억 훈련을 시작합니다. ${nBack}-백 과제입니다.`, { key: "start", force: true });

    setTimeout(() => {
      showNextNumber();
    }, 1000);
  };

  const showNextNumber = () => {
    const newNumber = generateNumber();
    setSequence((prev) => [...prev, newNumber]);
    setCurrentNumber(newNumber);

    const nBack = difficulty ? getNBack(difficulty) : 1;

    if (sequence.length >= nBack) {
      setPhase("waiting");
      trialStartRef.current = performance.now();
    } else {
      setPhase("showing");
      speak(newNumber.toString(), { key: `num_${sequence.length}` });
      timer.current = window.setTimeout(() => {
        showNextNumber();
      }, 2000);
    }
  };

  const handleAnswer = (answer: "same" | "different") => {
    if (phase !== "waiting" || trialStartRef.current === null || !difficulty) return;

    const responseTime = Math.round(performance.now() - trialStartRef.current);
    const nBack = getNBack(difficulty);
    const currentIndex = sequence.length;
    const nBackNumber = sequence[currentIndex - nBack];
    const currentNum = sequence[currentIndex - 1];

    const isSame = currentNum === nBackNumber;
    const correct = (answer === "same" && isSame) || (answer === "different" && !isSame);

    const result: TrialResult = {
      correct,
      responseTime,
      currentNumber: currentNum,
      nBackNumber,
      userAnswer: answer,
      correctAnswer: isSame ? "same" : "different"
    };

    setResults((prev) => [...prev, result]);
    setFeedbackMessage(correct ? "정답!" : "오답!");
    setPhase("feedback");

    speak(correct ? "정답" : "오답", { key: `feedback_${currentIndex}`, force: true });

    timer.current = window.setTimeout(() => {
      setFeedbackMessage("");
      const nextTrial = currentTrial + 1;
      setCurrentTrial(nextTrial);

      if (nextTrial >= totalTrials) {
        setPhase("done");
        const nBack = getNBack(difficulty);
        speak(`완료! 정확도 ${Math.round(((results.length + 1) / totalTrials) * 100)}퍼센트입니다.`, {
          key: "done",
          force: true
        });

        void (async () => {
          const ok = await hasSession();
          if (!ok) {
            setSaveNote("로그인하면 마이페이지에 기록을 저장할 수 있습니다.");
            return;
          }
          const finalResults = [...results, result];
          const finalAccuracy = Math.round(
            (finalResults.filter((r) => r.correct).length / finalResults.length) * 100
          );
          trainingStorage.add({
            id: makeId("training"),
            createdAt: new Date().toISOString(),
            game: "숫자기억 (N-Back)",
            scoreLabel: `정확도 ${finalAccuracy}% · N=${nBack}`
          });
          setSaveNote("기록을 저장했습니다.");
        })();
      } else {
        setPhase("showing");
        showNextNumber();
      }
    }, 500);
  };

  const reset = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
    trialStartRef.current = null;
    setPhase("idle");
    setDifficulty(null);
    setSequence([]);
    setCurrentTrial(0);
    setCurrentNumber(null);
    setResults([]);
    setFeedbackMessage("");
    setSaveNote("");
    introSpokenRef.current = false;
    speak("초기화되었습니다.", { key: "reset", force: true });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
        <h1 className="text-2xl font-semibold">숫자기억 (N-Back)</h1>
        <div className="text-slate-700">
          숫자가 나타나면 <span className="font-semibold">N번 전에 나왔던 숫자와 같은지</span>{" "}
          기억해서 답해주세요. 총 {totalTrials}회 진행합니다.
        </div>

        {voiceAvailable && showVoiceNotice ? (
          <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4 text-sm text-slate-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">음성 안내가 자동으로 시작됩니다</div>
                <div className="mt-1 text-slate-700">
                  브라우저 정책상 소리가 바로 안 나면{" "}
                  <span className="font-semibold">화면을 한 번 눌러</span> 시작해 주세요.
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
                Windows에서는{" "}
                <span className="font-semibold">설정 → 시간 및 언어 → 음성</span>에서 한국어
                음성을 추가할 수 있습니다.
              </p>
              <p>
                설치 후 브라우저(Chrome/Edge)를 재시작하면 더 자연스러운 음성으로 안내가 나올 수
                있습니다.
              </p>
            </div>
          </details>
        ) : null}

        <p className="text-xs text-slate-600">
          안내: 본 훈련은 의료 진단이 아닌 참고/체험용입니다.
        </p>
      </div>

      {phase === "idle" && !difficulty ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="font-semibold">난이도 선택</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              className="rounded-xl border-2 border-brand-200 bg-brand-50 px-5 py-4 font-medium text-brand-800 hover:bg-brand-100 transition-colors"
              onClick={() => startGame("easy")}
            >
              <div className="text-lg font-semibold">쉬움</div>
              <div className="text-sm text-brand-700">1-back (바로 전 숫자)</div>
            </button>
            <button
              type="button"
              className="rounded-xl border-2 border-brand-200 bg-brand-50 px-5 py-4 font-medium text-brand-800 hover:bg-brand-100 transition-colors"
              onClick={() => startGame("normal")}
            >
              <div className="text-lg font-semibold">보통</div>
              <div className="text-sm text-brand-700">2-back (2칸 전 숫자)</div>
            </button>
            <button
              type="button"
              className="rounded-xl border-2 border-brand-200 bg-brand-50 px-5 py-4 font-medium text-brand-800 hover:bg-brand-100 transition-colors"
              onClick={() => startGame("hard")}
            >
              <div className="text-lg font-semibold">어려움</div>
              <div className="text-sm text-brand-700">3-back (3칸 전 숫자)</div>
            </button>
          </div>
        </div>
      ) : null}

      {phase === "showing" || phase === "waiting" || phase === "feedback" ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          {difficulty && (
            <div className="text-sm text-slate-600">난이도: {difficultyLabel}</div>
          )}

          {currentNumber !== null && (
            <div className="py-8">
              <div className="text-center">
                <div className="text-8xl font-bold text-brand-700 mb-4">{currentNumber}</div>
                {phase === "waiting" && (
                  <div className="text-lg text-slate-700 mt-4">
                    이전 숫자와 같나요?
                  </div>
                )}
                {phase === "feedback" && (
                  <div
                    className={`text-2xl font-semibold mt-4 ${
                      feedbackMessage === "정답!" ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {feedbackMessage}
                  </div>
                )}
              </div>
            </div>
          )}

          {phase === "waiting" && (
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="rounded-xl bg-brand-700 px-6 py-6 text-xl font-semibold text-white hover:bg-brand-800 transition-colors"
                onClick={() => handleAnswer("same")}
              >
                같음
              </button>
              <button
                type="button"
                className="rounded-xl border-2 border-slate-300 px-6 py-6 text-xl font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={() => handleAnswer("different")}
              >
                다름
              </button>
            </div>
          )}

          <div className="text-center text-sm text-slate-600">
            진행: {currentTrial + 1} / {totalTrials}
          </div>
        </div>
      ) : null}

      {phase === "done" ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="text-center">
            <div className="text-2xl font-semibold mb-2">완료!</div>
            <div className="text-lg text-slate-700">
              정확도: <span className="font-bold text-brand-700">{accuracy}%</span>
            </div>
            <div className="text-sm text-slate-600 mt-1">
              평균 반응 시간: {formatMs(avgResponseTime)}
            </div>
            <div className="text-sm text-slate-600 mt-1">
              난이도: {difficultyLabel}
            </div>
          </div>

          <NBackChart results={results} />

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-xl border border-slate-200 px-5 py-3 font-medium hover:bg-slate-50"
              onClick={reset}
            >
              다시 시작
            </button>
            <Link
              href="/mypage"
              className="rounded-xl bg-brand-700 px-5 py-3 font-medium text-white hover:bg-brand-800"
            >
              마이페이지 기록 보기
            </Link>
          </div>

          {saveNote ? (
            <div className="text-sm text-slate-700">{saveNote}</div>
          ) : null}
        </div>
      ) : null}

      {difficulty && phase !== "done" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
              onClick={reset}
            >
              초기화
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
