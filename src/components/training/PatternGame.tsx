"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { makeId } from "@/lib/id";
import { hasSession } from "@/lib/client-auth";
import { trainingStorage } from "@/lib/storage";

type Phase = "idle" | "showing" | "input" | "feedback" | "done";

type Difficulty = "easy" | "normal" | "hard";

interface PatternResult {
  correct: boolean;
  sequence: number[];
  userSequence: number[];
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

function PatternChart({ results }: { results: PatternResult[] }) {
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
          aria-label="패턴매칭 기록 그래프"
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
            const label = `${idx + 1}회: ${result.correct ? "정답" : "오답"}`;
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

export function PatternGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [currentPattern, setCurrentPattern] = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [showIndex, setShowIndex] = useState(-1);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [results, setResults] = useState<PatternResult[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [saveNote, setSaveNote] = useState<string>("");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [showVoiceNotice, setShowVoiceNotice] = useState(true);

  const timer = useRef<number | null>(null);
  const introSpokenRef = useRef(false);
  const { available: voiceAvailable, hasKoreanVoice, setEnabled: setSpeechEnabled, speak } = useSpeech();

  const totalPatterns = 10;

  const getGridSize = (difficulty: Difficulty): number => {
    switch (difficulty) {
      case "easy":
        return 3;
      case "normal":
        return 4;
      case "hard":
        return 5;
      default:
        return 3;
    }
  };

  const getStartingCells = (difficulty: Difficulty): number => {
    switch (difficulty) {
      case "easy":
        return 3;
      case "normal":
        return 5;
      case "hard":
        return 7;
      default:
        return 3;
    }
  };

  const difficultyLabel = useMemo(() => {
    if (!difficulty) return "";
    const labels = {
      easy: "쉬움 (3x3)",
      normal: "보통 (4x4)",
      hard: "어려움 (5x5)"
    };
    return labels[difficulty];
  }, [difficulty]);

  const gridSize = difficulty ? getGridSize(difficulty) : 3;
  const currentLength = difficulty ? getStartingCells(difficulty) + currentPattern : 3;
  const correctCount = results.filter((r) => r.correct).length;

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
        "패턴 기억 훈련을 시작합니다. 난이도를 선택해주세요. 색칠된 칸을 순서대로 기억하세요.";
      speak(introText, { key: "intro", force: true });
      window.removeEventListener("pointerdown", onGesture);
    };
    window.addEventListener("pointerdown", onGesture);
    return () => window.removeEventListener("pointerdown", onGesture);
  }, [voiceAvailable, voiceEnabled, speak]);

  const generatePattern = (length: number, gridSize: number): number[] => {
    const cells = gridSize * gridSize;
    const pattern: number[] = [];
    const used = new Set<number>();

    while (pattern.length < length) {
      const cell = Math.floor(Math.random() * cells);
      if (!used.has(cell)) {
        used.add(cell);
        pattern.push(cell);
      }
    }

    return pattern;
  };

  const startGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setPhase("showing");
    setCurrentPattern(0);
    setResults([]);
    setSequence([]);
    setUserSequence([]);
    setShowIndex(-1);

    const gs = getGridSize(selectedDifficulty);
    const startingCells = getStartingCells(selectedDifficulty);
    const newSequence = generatePattern(startingCells, gs);
    setSequence(newSequence);

    speak(`패턴 기억 훈련을 시작합니다. ${difficultyLabel}`, { key: "start", force: true });

    setTimeout(() => {
      showNextCell(0);
    }, 1000);
  };

  const showNextCell = (index: number) => {
    if (index >= sequence.length) {
      setPhase("input");
      speak("순서대로 눌러주세요.", { key: "input", force: true });
      return;
    }

    setShowIndex(index);
    speak(`${index + 1}`, { key: `cell_${index}` });

    timer.current = window.setTimeout(() => {
      setShowIndex(-1);
      timer.current = window.setTimeout(() => {
        showNextCell(index + 1);
      }, 200);
    }, 800);
  };

  const handleCellClick = (cellIndex: number) => {
    if (phase !== "input") return;

    const newUserSequence = [...userSequence, cellIndex];
    setUserSequence(newUserSequence);

    // Check if this click is correct so far
    const expectedCell = sequence[newUserSequence.length - 1];
    if (cellIndex !== expectedCell) {
      // Wrong cell - immediate feedback
      const result: PatternResult = {
        correct: false,
        sequence: [...sequence],
        userSequence: newUserSequence
      };
      handleResult(result);
      return;
    }

    // Check if pattern is complete
    if (newUserSequence.length === sequence.length) {
      const result: PatternResult = {
        correct: true,
        sequence: [...sequence],
        userSequence: newUserSequence
      };
      handleResult(result);
    }
  };

  const handleResult = (result: PatternResult) => {
    setResults((prev) => [...prev, result]);
    setFeedbackMessage(result.correct ? "정답!" : "오답!");
    setPhase("feedback");

    speak(result.correct ? "정답입니다" : "틀렸습니다", { key: `feedback_${currentPattern}`, force: true });

    timer.current = window.setTimeout(() => {
      setFeedbackMessage("");
      const nextPattern = currentPattern + 1;
      setCurrentPattern(nextPattern);

      if (nextPattern >= totalPatterns) {
        setPhase("done");
        const finalCorrect = results.filter((r) => r.correct).length + (result.correct ? 1 : 0);
        speak(`완료! ${finalCorrect}개 정답입니다.`, {
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
          const finalScore = finalResults.filter((r) => r.correct).length;
          trainingStorage.add({
            id: makeId("training"),
            createdAt: new Date().toISOString(),
            game: "패턴매칭",
            scoreLabel: `정답 ${finalScore}/10`
          });
          setSaveNote("기록을 저장했습니다.");
        })();
      } else {
        // Generate next pattern
        const gs = difficulty ? getGridSize(difficulty) : 3;
        const startingCells = difficulty ? getStartingCells(difficulty) : 3;
        const newLength = Math.min(startingCells + nextPattern, gs + 3);
        const newSequence = generatePattern(newLength, gs);
        setSequence(newSequence);
        setUserSequence([]);
        setPhase("showing");

        setTimeout(() => {
          showNextCell(0);
        }, 500);
      }
    }, 1500);
  };

  const reset = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
    setPhase("idle");
    setDifficulty(null);
    setCurrentPattern(0);
    setSequence([]);
    setUserSequence([]);
    setShowIndex(-1);
    setResults([]);
    setFeedbackMessage("");
    setSaveNote("");
    introSpokenRef.current = false;
    speak("초기화되었습니다.", { key: "reset", force: true });
  };

  const renderGrid = () => {
    const cells = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
      const isShowing = showIndex === sequence.indexOf(i);
      const isUserClicked = userSequence.includes(i);
      const cellStyle = isShowing
        ? "bg-brand-500 border-brand-600"
        : isUserClicked
          ? "bg-brand-300 border-brand-400"
          : "bg-slate-100 border-slate-200 hover:bg-slate-200";

      cells.push(
        <button
          key={i}
          type="button"
          disabled={phase !== "input"}
          className={`aspect-square rounded-lg border-2 transition-colors ${cellStyle} ${
            phase === "input" ? "cursor-pointer" : "cursor-default"
          }`}
          onClick={() => handleCellClick(i)}
          aria-label={`셀 ${i + 1}`}
        />
      );
    }
    return cells;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
        <h1 className="text-2xl font-semibold">패턴매칭</h1>
        <div className="text-slate-700">
          색칠된 칸이 <span className="font-semibold">순서대로</span> 나타납니다. 같은 순서로 눌러주세요.
          총 {totalPatterns}개 패턴을 진행합니다.
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
              <div className="text-sm text-brand-700">3x3 그리드</div>
            </button>
            <button
              type="button"
              className="rounded-xl border-2 border-brand-200 bg-brand-50 px-5 py-4 font-medium text-brand-800 hover:bg-brand-100 transition-colors"
              onClick={() => startGame("normal")}
            >
              <div className="text-lg font-semibold">보통</div>
              <div className="text-sm text-brand-700">4x4 그리드</div>
            </button>
            <button
              type="button"
              className="rounded-xl border-2 border-brand-200 bg-brand-50 px-5 py-4 font-medium text-brand-800 hover:bg-brand-100 transition-colors"
              onClick={() => startGame("hard")}
            >
              <div className="text-lg font-semibold">어려움</div>
              <div className="text-sm text-brand-700">5x5 그리드</div>
            </button>
          </div>
        </div>
      ) : null}

      {phase === "showing" || phase === "input" || phase === "feedback" ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          {difficulty && (
            <div className="text-sm text-slate-600">난이도: {difficultyLabel}</div>
          )}

          <div className="text-center text-sm text-slate-600">
            진행: {currentPattern + 1} / {totalPatterns} · 칸 수: {currentLength}
          </div>

          <div className="flex justify-center">
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                width: gridSize === 3 ? "240px" : gridSize === 4 ? "280px" : "320px"
              }}
            >
              {renderGrid()}
            </div>
          </div>

          {phase === "showing" && (
            <div className="text-center text-lg font-semibold text-brand-700">
              패턴을 기억하세요...
            </div>
          )}

          {phase === "input" && (
            <div className="text-center text-lg font-semibold text-brand-700">
              순서대로 눌러주세요 ({userSequence.length} / {sequence.length})
            </div>
          )}

          {phase === "feedback" && (
            <div
              className={`text-center text-2xl font-semibold ${
                feedbackMessage === "정답!" ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {feedbackMessage}
            </div>
          )}
        </div>
      ) : null}

      {phase === "done" ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="text-center">
            <div className="text-2xl font-semibold mb-2">완료!</div>
            <div className="text-lg text-slate-700">
              정답: <span className="font-bold text-brand-700">{correctCount} / {totalPatterns}</span>
            </div>
            <div className="text-sm text-slate-600 mt-1">
              난이도: {difficultyLabel}
            </div>
          </div>

          <PatternChart results={results} />

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
