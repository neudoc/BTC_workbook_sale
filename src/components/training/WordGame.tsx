"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { makeId } from "@/lib/id";
import { hasSession } from "@/lib/client-auth";
import { trainingStorage } from "@/lib/storage";

type Phase = "idle" | "study" | "test" | "feedback" | "done";

type Difficulty = "easy" | "normal" | "hard";

type WordPair = {
  cue: string;
  answer: string;
};

type Result = {
  cue: string;
  correct: boolean;
};

const WORD_PAIRS: WordPair[] = [
  { cue: "하늘", answer: "파랑" },
  { cue: "나무", answer: "초록" },
  { cue: "태양", answer: "따뜻" },
  { cue: "바다", answer: "넓다" },
  { cue: "꽃", answer: "향기" },
  { cue: "산", answer: "높다" },
  { cue: "달", answer: "밤" },
  { cue: "별", answer: "반짝" },
  { cue: "비", answer: "우산" },
  { cue: "눈", answer: "하얀" },
  { cue: "봄", answer: "따뜻" },
  { cue: "여름", answer: "더위" },
  { cue: "가을", answer: "단풍" },
  { cue: "겨울", answer: "추운" },
  { cue: "사과", answer: "빨강" },
  { cue: "바나나", answer: "노랑" },
  { cue: "포도", answer: "보라" },
  { cue: "수박", answer: "초록" },
  { cue: "책", answer: "지식" },
  { cue: "음악", answer: "멜로디" }
];

const DIFFICULTY_CONFIG: Record<Difficulty, number> = {
  easy: 5,
  normal: 8,
  hard: 12
};

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "쉬움",
  normal: "보통",
  hard: "어려움"
};

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
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

function WordChart({ results }: { results: Result[] }) {
  if (results.length === 0) return null;

  const width = 720;
  const height = 220;
  const paddingLeft = 44;
  const paddingRight = 16;
  const paddingTop = 16;
  const paddingBottom = 28;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  const barGap = 10;
  const barW = Math.max(12, Math.floor((chartW - barGap * (results.length - 1)) / results.length));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <div className="font-semibold">결과 그래프</div>
        <div className="text-xs text-slate-600">정답(초록) · 오답(빨강)</div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="단어 연상 결과 그래프"
          className="min-w-[560px] w-full"
        >
          {/* Y axis line */}
          <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={height - paddingBottom} stroke="#cbd5e1" strokeWidth={1} />

          {/* X axis line */}
          <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} stroke="#cbd5e1" strokeWidth={1} />

          {/* bars */}
          {results.map((result, idx) => {
            const x = paddingLeft + idx * (barW + barGap);
            const color = result.correct ? "#10b981" : "#ef4444";
            const label = `${idx + 1}: ${result.cue} - ${result.correct ? "정답" : "오답"}`;
            return (
              <g key={`${result.cue}-${idx}`}>
                <title>{label}</title>
                <rect
                  x={x}
                  y={paddingTop}
                  width={barW}
                  height={chartH}
                  rx={8}
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

export function WordGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [pairs, setPairs] = useState<WordPair[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [saveNote, setSaveNote] = useState<string>("");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [showVoiceNotice, setShowVoiceNotice] = useState(true);
  const [feedbackShown, setFeedbackShown] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const studyTimer = useRef<number | null>(null);
  const feedbackTimer = useRef<number | null>(null);
  const introSpokenRef = useRef(false);

  const { available: voiceAvailable, hasKoreanVoice, setEnabled: setSpeechEnabled, speak } = useSpeech();

  const totalPairs = pairs.length;
  const correctCount = results.filter((r) => r.correct).length;

  const introText = "단어 연상 훈련을 시작합니다. 화면에 나오는 단어 짝을 잘 기억해주세요.";

  useEffect(() => {
    return () => {
      if (studyTimer.current) window.clearTimeout(studyTimer.current);
      if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current);
    };
  }, []);

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

  const startGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    const count = DIFFICULTY_CONFIG[selectedDifficulty];
    const shuffled = shuffle(WORD_PAIRS).slice(0, count);
    setPairs(shuffled);
    setCurrentIndex(0);
    setResults([]);
    setSaveNote("");
    setPhase("study");
    speak("단어 연상 훈련을 시작합니다. 단어 짝을 기억해주세요.", { key: "start", force: true });

    // Start first pair
    studyTimer.current = window.setTimeout(() => {
      speak(`${shuffled[0].cue}, ${shuffled[0].answer}`, { key: `study_0`, force: true });
    }, 500);
  };

  const finishStudyPhase = () => {
    if (studyTimer.current) window.clearTimeout(studyTimer.current);
    studyTimer.current = null;
    setPhase("test");
    setCurrentIndex(0);
    speak("이제 테스트를 시작합니다.", { key: "test_start", force: true });

    // Speak first cue
    setTimeout(() => {
      speak(pairs[0].cue, { key: `test_${0}`, force: true });
    }, 500);
  };

  const moveToNextStudy = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= pairs.length) {
      finishStudyPhase();
      return;
    }
    setCurrentIndex(nextIndex);
    studyTimer.current = window.setTimeout(() => {
      speak(`${pairs[nextIndex].cue}, ${pairs[nextIndex].answer}`, { key: `study_${nextIndex}`, force: true });
    }, 500);
  };

  const generateOptions = (correctAnswer: string): string[] => {
    const allAnswers = WORD_PAIRS.map((p) => p.answer).filter((a) => a !== correctAnswer);
    const wrongOptions = shuffle(allAnswers).slice(0, 3);
    return shuffle([correctAnswer, ...wrongOptions]);
  };

  const handleAnswer = (selected: string) => {
    if (feedbackShown) return;

    const currentPair = pairs[currentIndex];
    const isCorrect = selected === currentPair.answer;

    setSelectedOption(selected);
    setLastAnswerCorrect(isCorrect);
    setFeedbackShown(true);

    const newResults = [...results, { cue: currentPair.cue, correct: isCorrect }];
    setResults(newResults);

    speak(isCorrect ? "정답입니다" : "틀렸습니다", { key: `feedback_${currentIndex}`, force: true });

    feedbackTimer.current = window.setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= pairs.length) {
        finishGame(newResults);
      } else {
        setCurrentIndex(nextIndex);
        setSelectedOption(null);
        setFeedbackShown(false);
        speak(pairs[nextIndex].cue, { key: `test_${nextIndex}`, force: true });
      }
    }, 500);
  };

  const finishGame = (finalResults: Result[]) => {
    setPhase("done");
    const correct = finalResults.filter((r) => r.correct).length;
    const scoreLabel = `정답 ${correct}/${pairs.length}`;
    speak(`완료. ${scoreLabel}입니다.`, { key: "done", force: true });

    void (async () => {
      const ok = await hasSession();
      if (!ok) {
        setSaveNote("로그인하면 마이페이지에 기록을 저장할 수 있습니다.");
        return;
      }
      trainingStorage.add({
        id: makeId("training"),
        createdAt: new Date().toISOString(),
        game: "단어연상",
        scoreLabel
      });
      setSaveNote("기록을 저장했습니다.");
    })();
  };

  const reset = () => {
    if (studyTimer.current) window.clearTimeout(studyTimer.current);
    if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current);
    studyTimer.current = null;
    feedbackTimer.current = null;
    setPhase("idle");
    setPairs([]);
    setCurrentIndex(0);
    setResults([]);
    setSaveNote("");
    setFeedbackShown(false);
    setSelectedOption(null);
    speak("초기화되었습니다.", { key: "reset", force: true });
  };

  const currentOptions = phase === "test" && pairs[currentIndex]
    ? generateOptions(pairs[currentIndex].answer)
    : [];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
        <h1 className="text-2xl font-semibold">단어 연상</h1>
        <div className="text-slate-700">
          화면에 나오는 <span className="font-semibold">단어 짝</span>을 기억했다가, 나중에 짝이 맞는 답을 고르세요.
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

      {phase === "idle" ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="font-semibold">난이도 선택</div>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => startGame(diff)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-6 font-semibold hover:bg-slate-50 transition-colors"
              >
                <div className="text-lg">{DIFFICULTY_LABEL[diff]}</div>
                <div className="text-sm text-slate-600 mt-1">
                  {DIFFICULTY_CONFIG[diff]}문제
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {phase === "study" ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="text-center text-sm text-slate-600">
            암기 단계 {currentIndex + 1} / {totalPairs}
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-12 text-center">
            <div className="text-4xl font-black text-slate-900">
              {pairs[currentIndex]?.cue} → {pairs[currentIndex]?.answer}
            </div>
          </div>
          <div className="text-center text-sm text-slate-600">
            3초 동안 단어 짝을 기억해주세요
          </div>
          <button
            type="button"
            onClick={moveToNextStudy}
            className="w-full rounded-xl bg-brand-700 px-5 py-3 font-medium text-white hover:bg-brand-800"
          >
            다음
          </button>
        </div>
      ) : null}

      {phase === "test" ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="text-center text-sm text-slate-600">
            문제 {currentIndex + 1} / {totalPairs}
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center">
            <div className="text-5xl font-black text-slate-900">
              {pairs[currentIndex]?.cue}
            </div>
            <div className="mt-3 text-slate-600">
              짝이 되는 단어를 선택하세요
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {currentOptions.map((option) => {
              let buttonClass = "rounded-2xl border border-slate-200 bg-white px-4 py-6 text-xl font-semibold hover:bg-slate-50 transition-colors";

              if (feedbackShown && selectedOption === option) {
                buttonClass = lastAnswerCorrect
                  ? "rounded-2xl border-2 border-emerald-500 bg-emerald-50 px-4 py-6 text-xl font-semibold"
                  : "rounded-2xl border-2 border-red-500 bg-red-50 px-4 py-6 text-xl font-semibold";
              }

              return (
                <button
                  key={option}
                  type="button"
                  disabled={feedbackShown}
                  onClick={() => handleAnswer(option)}
                  className={buttonClass}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {feedbackShown && (
            <div className={`text-center font-semibold ${lastAnswerCorrect ? "text-emerald-700" : "text-red-700"}`}>
              {lastAnswerCorrect ? "정답입니다!" : "틀렸습니다!"}
            </div>
          )}
        </div>
      ) : null}

      {phase === "done" ? (
        <>
          <WordChart results={results} />

          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
            <div className="text-center">
              <div className="text-3xl font-black text-slate-900">
                {correctCount} / {totalPairs}
              </div>
              <div className="text-slate-600 mt-2">
                정답률 {Math.round((correctCount / totalPairs) * 100)}%
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
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
              <div className="mt-4 text-sm text-slate-700 text-center">{saveNote}</div>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
