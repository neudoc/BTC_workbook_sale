"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { mocaTest } from "@/lib/data/screenings";
import { makeId } from "@/lib/id";
import { hasSession } from "@/lib/client-auth";
import { screeningStorage } from "@/lib/storage";

type Phase = "intro" | "question" | "result";

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
      onEnd?: () => void;
    }
  ) => {
    if (!available || !enabledRef.current || !text) {
      opts?.onEnd?.();
      return;
    }
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
      if (opts?.onEnd) {
        u.onend = () => opts.onEnd?.();
        u.onerror = () => opts.onEnd?.();
      }
      window.speechSynthesis.speak(u);
    } catch {
      opts?.onEnd?.();
    }
  };

  // 숫자·문자를 1초 간격으로 또박또박 읽어 줍니다.
  const timersRef = useRef<number[]>([]);

  const cancelSequence = () => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
    // 이미 대기열에 들어간 발화도 중단해 이전 문항 음성이 넘어오지 않게 합니다.
    try {
      if (available) window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  };

  const speakSequence = (
    items: string[],
    opts?: { startDelayMs?: number; gapMs?: number; onDone?: () => void }
  ) => {
    if (!available || !enabledRef.current || items.length === 0) {
      opts?.onDone?.();
      return;
    }
    cancelSequence();
    const gap = opts?.gapMs ?? 1000;
    const start = opts?.startDelayMs ?? 1200;
    const last = items.length - 1;

    items.forEach((item, i) => {
      const t = window.setTimeout(() => {
        try {
          const u = new SpeechSynthesisUtterance(item);
          u.lang = "ko-KR";
          const voice = pickKoreanVoice();
          if (voice) u.voice = voice;
          u.rate = 0.75; // 또박또박
          u.pitch = 1;
          if (i === last && opts?.onDone) u.onend = () => opts.onDone?.();
          window.speechSynthesis.speak(u);
        } catch {
          if (i === last) opts?.onDone?.();
        }
      }, start + i * gap);
      timersRef.current.push(t);
    });

    // 안전장치: 음성 이벤트가 오지 않아도 예상 시간 후 완료 처리 (넉넉하게)
    if (opts?.onDone) {
      const est = start + last * gap + Math.max(1800, items[last].length * 320) + 1200;
      timersRef.current.push(window.setTimeout(() => opts.onDone?.(), est));
    }
  };

  return { available, hasKoreanVoice, setEnabled, speak, speakSequence, cancelSequence };
}

function DomainChart({ scoresByDomain }: { scoresByDomain: Record<string, { score: number; maxScore: number; label: string }> }) {
  const domains = Object.entries(scoresByDomain);
  const width = 640;
  const height = 280;
  const paddingLeft = 100;
  const paddingRight = 60;
  const paddingTop = 20;
  const paddingBottom = 20;
  const chartW = width - paddingLeft - paddingRight;
  const barHeight = 32;
  const gap = 12;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
      <div className="font-semibold">영역별 점수</div>
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${Math.max(height, paddingTop + paddingBottom + domains.length * (barHeight + gap))}`}
          role="img"
          aria-label="영역별 점수 차트"
          className="min-w-[500px] w-full"
        >
          {domains.map(([domain, data], idx) => {
            const y = paddingTop + idx * (barHeight + gap);
            const maxW = chartW;
            const w = (data.score / data.maxScore) * maxW;
            return (
              <g key={domain}>
                <text
                  x={paddingLeft - 12}
                  y={y + barHeight / 2 + 4}
                  textAnchor="end"
                  fontSize="13"
                  fontWeight="500"
                  fill="#334155"
                >
                  {data.label}
                </text>
                <rect
                  x={paddingLeft}
                  y={y}
                  width={maxW}
                  height={barHeight}
                  rx={6}
                  fill="#f1f5f9"
                />
                <rect
                  x={paddingLeft}
                  y={y}
                  width={w}
                  height={barHeight}
                  rx={6}
                  fill="#115f4a"
                  opacity={0.9}
                />
                <text
                  x={paddingLeft + w + 8}
                  y={y + barHeight / 2 + 4}
                  fontSize="13"
                  fontWeight="600"
                  fill="#334155"
                >
                  {data.score}점
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export function MocaTest() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [saveNote, setSaveNote] = useState<string>("");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const introSpokenRef = useRef(false);
  // 현재 화면에 떠 있는 문항 id (지나간 문항의 음성이 재생되는 것을 막는 용도)
  const activeQidRef = useRef<string>("");
  const {
    available: voiceAvailable,
    setEnabled: setSpeechEnabled,
    speak,
    speakSequence,
    cancelSequence,
  } = useSpeech();

  const currentQuestion = mocaTest.questions[currentIndex];
  const totalQuestions = mocaTest.questions.length;
  const estimatedMinutes = Math.ceil(totalQuestions * 0.5);

  // ── 단어 학습(3회 반복) 상태 ──
  const [learnTrial, setLearnTrial] = useState(1);
  const [learnPhase, setLearnPhase] = useState<"listen" | "recall">("listen");
  const [learnPicked, setLearnPicked] = useState<string[]>([]);
  const [learnScores, setLearnScores] = useState<number[]>([]);
  // 음성 자극 재생이 끝났는지 (끝난 뒤에 보기를 노출)
  const [stimulusDone, setStimulusDone] = useState(true);
  // 음성으로만 자극을 주는 문항인지 (그런 문항만 보기를 잠시 감춤)
  const needsAudioGate =
    !!currentQuestion?.audioSequence?.length && voiceEnabled && voiceAvailable;
  // ── 지연 재인 상태 ──
  const [recogIndex, setRecogIndex] = useState(0);
  const [recogResult, setRecogResult] = useState<{ hit: number; fa: number; miss: number; cr: number } | null>(null);

  const scoresByDomain = useMemo(() => {
    const domainScores: Record<string, { score: number; maxScore: number; label: string }> = {};
    mocaTest.questions.forEach((q) => {
      if (!domainScores[q.domain]) {
        domainScores[q.domain] = { score: 0, maxScore: 0, label: q.domainKo };
      }
      domainScores[q.domain].maxScore += q.maxScore;
      if (answers[q.id]) {
        domainScores[q.domain].score += answers[q.id];
      }
    });
    return domainScores;
  }, [answers]);

  const totalScore = useMemo(() => {
    return Object.values(scoresByDomain).reduce((sum, d) => sum + d.score, 0);
  }, [scoresByDomain]);

  const interpretation = useMemo(() => {
    if (totalScore >= 26) {
      return "정상 범위";
    }
    if (totalScore >= 20) {
      return "경도 인지저하 가능성";
    }
    if (totalScore >= 15) {
      return "중등도 관심";
    }
    return "전문가 상담 권장";
  }, [totalScore]);

  useEffect(() => {
    setSpeechEnabled(voiceEnabled);
    if (!voiceEnabled && voiceAvailable) window.speechSynthesis?.cancel?.();
  }, [voiceEnabled, setSpeechEnabled, voiceAvailable]);

  useEffect(() => {
    if (!voiceAvailable) return;
    const onGesture = () => {
      if (!voiceEnabled) return;
      if (introSpokenRef.current) return;
      introSpokenRef.current = true;
      speak(`${mocaTest.title}. ${mocaTest.questions.length}문항이며, 예상 소요 시간은 ${estimatedMinutes}분입니다.`, { key: "intro", force: true });
      window.removeEventListener("pointerdown", onGesture);
    };
    window.addEventListener("pointerdown", onGesture);
    return () => window.removeEventListener("pointerdown", onGesture);
  }, [voiceAvailable, voiceEnabled, speak, estimatedMinutes]);

  useEffect(() => {
    cancelSequence();
    if (phase === "question" && currentQuestion) {
      activeQidRef.current = currentQuestion.id;
      const isWordlist = currentQuestion.type === "wordlist";
      // 단어 학습 안내문은 첫 회차 '듣기' 단계에서만 읽습니다.
      // (회차가 바뀌거나 보기를 고를 때 같은 안내를 반복하지 않도록)
      const speakIntro = !isWordlist || (learnPhase === "listen" && learnTrial === 1);
      const useVoice = voiceEnabled && voiceAvailable;
      const seq = currentQuestion.audioSequence;
      const words = isWordlist && learnPhase === "listen" ? currentQuestion.words : undefined;

      // 자극(숫자·글자·문장·단어)은 문제 낭독이 끝난 뒤에 재생합니다.
      const qidAtStart = currentQuestion.id;
      const playStimulus = () => {
        // 낭독 중 문항이 바뀌었으면(답변 등으로 취소된 경우) 재생하지 않습니다.
        if (activeQidRef.current !== qidAtStart) return;
        if (seq?.length) {
          speakSequence(seq, { startDelayMs: 600, onDone: () => setStimulusDone(true) });
        } else if (words?.length) {
          speakSequence(words, { startDelayMs: 600 });
        }
      };

      if (seq?.length && useVoice) setStimulusDone(false);
      else setStimulusDone(true);

      if (speakIntro) {
        speak(currentQuestion.text, {
          key: `q_${currentQuestion.id}`,
          force: true,
          onEnd: playStimulus,
        });
      } else {
        playStimulus();
      }
    }
    if (phase === "result") {
      speak(`검사 완료. 총점 ${totalScore}점. ${interpretation}`, { key: "result", force: true });
    }
    return () => cancelSequence();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentIndex, currentQuestion, totalScore, interpretation, learnTrial, learnPhase]);

  const shuffledLearnOptions = useMemo(() => {
    const q = currentQuestion;
    if (q?.type !== "wordlist" || !q.words) return [];
    const pool = [...q.words, ...(q.foils ?? []).slice(0, 3)];
    // 시행마다 배열 순서를 바꿔 위치 암기를 막음
    return pool
      .map((w, i) => ({ w, k: (i * 7 + learnTrial * 13) % pool.length }))
      .sort((a, b) => a.k - b.k)
      .map((x) => x.w);
  }, [currentQuestion, learnTrial]);

  const recogItems = useMemo(() => {
    const q = currentQuestion;
    if (q?.type !== "recognition" || !q.words) return [] as { word: string; target: boolean }[];
    const items = [
      ...q.words.map((w) => ({ word: w, target: true })),
      ...(q.foils ?? []).map((w) => ({ word: w, target: false })),
    ];
    return items
      .map((it, i) => ({ it, k: (i * 5 + 3) % items.length }))
      .sort((a, b) => a.k - b.k)
      .map((x) => x.it);
  }, [currentQuestion]);

  const handleAnswer = (value: string, score: number) => {
    activeQidRef.current = ""; // 답변 즉시 이전 문항 자극 재생을 차단
    cancelSequence();
    const newAnswers = { ...answers, [currentQuestion.id]: score };
    setAnswers(newAnswers);
    speak(value, { key: `answer_${currentQuestion.id}`, force: true });

    setTimeout(() => {
      if (currentIndex < totalQuestions - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setPhase("result");
        void (async () => {
          const ok = await hasSession();
          if (!ok) {
            setSaveNote("로그인하면 마이페이지에 기록을 저장할 수 있습니다.");
            return;
          }
          screeningStorage.add({
            id: makeId("screening"),
            createdAt: new Date().toISOString(),
            test: "MoCA 스타일 검사",
            summary: `${totalScore}/${mocaTest.maxScore}점`,
            note: interpretation
          });
          setSaveNote("기록을 저장했습니다.");
        })();
      }
    }, 800);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  if (phase === "intro") {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
          <h1 className="text-2xl font-semibold">{mocaTest.title}</h1>
          <p className="text-slate-700">{mocaTest.description}</p>
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-slate-800">
            <div className="font-semibold">안내</div>
            <div className="mt-1">{mocaTest.disclaimer}</div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-700">
            <div>• 총 문항: <span className="font-semibold">{totalQuestions}문항</span></div>
            <div>• 예상 소요 시간: <span className="font-semibold">{estimatedMinutes}분</span></div>
            <div>• 배점: 총 <span className="font-semibold">{mocaTest.maxScore}점</span></div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
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
        </div>

        <button
          type="button"
          className="w-full rounded-xl bg-brand-700 px-5 py-3 font-medium text-white hover:bg-brand-800"
          onClick={() => {
            setPhase("question");
            if (!voiceEnabled) {
              setVoiceEnabled(true);
            }
          }}
        >
          검사 시작하기
        </button>
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6 space-y-3">
          <h2 className="text-xl font-semibold">검사 결과 (참고용)</h2>
          <div className="text-3xl font-bold text-brand-800">{totalScore} / {mocaTest.maxScore}점</div>
          <p className="text-slate-800">{interpretation}</p>
        </div>

        {recogResult ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
            <div className="font-semibold">단어 지연 재인 결과</div>
            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <div className="rounded-xl bg-brand-50 p-3">
                <div className="text-slate-600">맞게 &apos;예&apos;</div>
                <div className="text-xl font-bold text-brand-800">{recogResult.hit} / 5</div>
              </div>
              <div className="rounded-xl bg-brand-50 p-3">
                <div className="text-slate-600">맞게 &apos;아니오&apos;</div>
                <div className="text-xl font-bold text-brand-800">{recogResult.cr} / 5</div>
              </div>
              <div className="rounded-xl bg-amber-50 p-3">
                <div className="text-slate-600">놓친 단어</div>
                <div className="text-xl font-bold text-amber-800">{recogResult.miss}</div>
              </div>
              <div className="rounded-xl bg-amber-50 p-3">
                <div className="text-slate-600">잘못 &apos;예&apos;</div>
                <div className="text-xl font-bold text-amber-800">{recogResult.fa}</div>
              </div>
            </div>
            <p className="text-sm leading-6 text-slate-600">
              정답 {recogResult.hit + recogResult.cr}개 · 오답 {recogResult.miss + recogResult.fa}개.
              없던 단어를 &apos;예&apos;라고 고른 경우(잘못 &apos;예&apos;)가 많으면 점수에서 차감됩니다.
            </p>
          </div>
        ) : null}

        <DomainChart scoresByDomain={scoresByDomain} />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
          <div className="font-semibold">영역별 점수</div>
          {Object.entries(scoresByDomain).map(([domain, data]) => (
            <div key={domain} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
              <span className="text-slate-700">{data.label}</span>
              <span className="font-semibold">{data.score} / {data.maxScore}점</span>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-slate-800">
            <div className="font-semibold">면책 조항</div>
            <div className="mt-1">{mocaTest.disclaimer}</div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              className="rounded-xl border border-slate-200 px-5 py-3 font-medium hover:bg-slate-50"
              onClick={() => {
                setPhase("intro");
                setCurrentIndex(0);
                setAnswers({});
                setSaveNote("");
                introSpokenRef.current = false;
              }}
            >
              다시 검사하기
            </button>
            <Link
              href="/mypage"
              className="rounded-xl bg-brand-700 px-5 py-3 font-medium text-white hover:bg-brand-800 text-center"
            >
              마이페이지 기록 보기
            </Link>
          </div>
          {saveNote ? (
            <div className="text-sm text-slate-700">{saveNote}</div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm text-slate-700">
            <span>문항 {currentIndex + 1} / {totalQuestions}</span>
            <span className="text-brand-800 font-semibold">{currentQuestion.domainKo}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-700 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">
            {currentQuestion.type === "wordlist" && learnPhase === "recall"
              ? "방금 들은 단어를 모두 고르세요."
              : currentQuestion.text}
          </h2>

          {currentQuestion.image ? (
            <div className="flex justify-center rounded-2xl border border-slate-200 bg-white p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentQuestion.image}
                alt={currentQuestion.imageAlt ?? "동물 그림"}
                className="h-56 w-auto max-w-full object-contain sm:h-64"
              />
            </div>
          ) : null}

          {currentQuestion.audioSequence?.length ? (
            voiceEnabled && voiceAvailable ? (
              <div className="flex flex-wrap items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4">
                <span className="text-sm text-slate-700">
                  {currentQuestion.audioSequence.length > 1
                    ? "🔊 음성으로 하나씩 읽어 드립니다. 화면에는 표시되지 않습니다."
                    : "🔊 음성으로 들려드립니다. 화면에는 표시되지 않습니다."}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setStimulusDone(false);
                    speakSequence(currentQuestion.audioSequence!, {
                      startDelayMs: 300,
                      onDone: () => setStimulusDone(true),
                    });
                  }}
                  className="rounded-xl border border-brand-300 bg-white px-4 py-2 text-sm font-semibold text-brand-800 hover:bg-brand-100"
                >
                  다시 듣기
                </button>
              </div>
            ) : (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm leading-6 text-amber-900">
                  음성이 꺼져 있어 아래 내용을 화면으로 보여 드립니다. 음성을 켜면
                  하나씩 읽어 드립니다.
                </p>
                <p
                  className={
                    currentQuestion.audioSequence.every((s) => s.length <= 2)
                      ? "mt-2 text-lg font-bold tracking-widest text-slate-900"
                      : "mt-2 text-lg font-bold leading-8 text-slate-900"
                  }
                >
                  {currentQuestion.audioSequence.join(" ")}
                </p>
              </div>
            )
          ) : null}

          {/* ── 단어 학습 (3회 반복) ── */}
          {currentQuestion.type === "wordlist" && currentQuestion.words ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-brand-200 bg-brand-50 px-4 py-3">
                <span className="font-semibold text-brand-900">
                  학습 {learnTrial} / {currentQuestion.trials ?? 3}회차
                </span>
                {voiceEnabled && voiceAvailable ? (
                  <button
                    type="button"
                    onClick={() => speakSequence(currentQuestion.words!, { startDelayMs: 300 })}
                    className="rounded-xl border border-brand-300 bg-white px-4 py-2 text-sm font-semibold text-brand-800 hover:bg-brand-100"
                  >
                    다시 듣기
                  </button>
                ) : null}
              </div>

              {learnPhase === "listen" ? (
                <div className="space-y-4">
                  {voiceEnabled && voiceAvailable ? (
                    <p className="text-slate-700">🔊 단어를 하나씩 읽어 드립니다. 끝까지 들어 주세요.</p>
                  ) : (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <p className="text-sm text-amber-900">음성이 꺼져 있어 화면으로 보여 드립니다. 외운 뒤 넘어가세요.</p>
                      <p className="mt-2 text-lg font-bold leading-8 text-slate-900">
                        {currentQuestion.words.join(" · ")}
                      </p>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => { cancelSequence(); setLearnPhase("recall"); setLearnPicked([]); }}
                    className="w-full rounded-xl bg-brand-700 px-5 py-3 font-semibold text-white hover:bg-brand-800"
                  >
                    다 들었어요 · 단어 고르기
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-slate-700">
                    5개를 고르세요. 지금 {learnPicked.length}개 선택
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {shuffledLearnOptions.map((w) => {
                      const on = learnPicked.includes(w);
                      return (
                        <button
                          key={w}
                          type="button"
                          onClick={() =>
                            setLearnPicked((p) => (p.includes(w) ? p.filter((x) => x !== w) : [...p, w]))
                          }
                          className={`rounded-xl border-2 p-4 font-medium transition-all ${
                            on ? "border-brand-600 bg-brand-50 text-brand-900" : "border-slate-200 hover:border-brand-300"
                          }`}
                        >
                          {on ? "✓ " : ""}{w}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    disabled={learnPicked.length === 0}
                    onClick={() => {
                      const correct = learnPicked.filter((w) => currentQuestion.words!.includes(w)).length;
                      const nextScores = [...learnScores, correct];
                      setLearnScores(nextScores);
                      const total = currentQuestion.trials ?? 3;
                      if (learnTrial < total) {
                        setLearnTrial(learnTrial + 1);
                        setLearnPhase("listen");
                        setLearnPicked([]);
                      } else {
                        handleAnswer("학습 완료", 0); // 학습 단계는 점수에 반영하지 않습니다
                      }
                    }}
                    className="w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-black disabled:opacity-50"
                  >
                    {learnTrial < (currentQuestion.trials ?? 3) ? "다음 회차" : "학습 마치기"}
                  </button>
                </div>
              )}
            </div>
          ) : null}

          {/* ── 지연 재인 (예/아니오) ── */}
          {currentQuestion.type === "recognition" && recogItems.length > 0 ? (
            <div className="space-y-4">
              <div className="text-sm text-slate-600">
                {recogIndex + 1} / {recogItems.length}
              </div>
              <div className="rounded-2xl border-2 border-slate-200 p-8 text-center">
                <span className="text-3xl font-bold text-slate-900">{recogItems[recogIndex].word}</span>
                <p className="mt-2 text-slate-600">이 단어가 있었나요?</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "예", said: true },
                  { label: "아니오", said: false },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    type="button"
                    onClick={() => {
                      const item = recogItems[recogIndex];
                      const prev = recogResult ?? { hit: 0, fa: 0, miss: 0, cr: 0 };
                      const next = { ...prev };
                      if (item.target && btn.said) next.hit += 1;
                      else if (item.target && !btn.said) next.miss += 1;
                      else if (!item.target && btn.said) next.fa += 1;
                      else next.cr += 1;
                      setRecogResult(next);

                      if (recogIndex < recogItems.length - 1) {
                        setRecogIndex(recogIndex + 1);
                      } else {
                        const score = Math.max(0, Math.min(5, next.hit - next.fa));
                        handleAnswer(`정답 ${next.hit + next.cr}개`, score);
                      }
                    }}
                    className="rounded-xl border-2 border-slate-200 px-5 py-5 text-lg font-bold hover:border-brand-400 hover:bg-brand-50"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* 음성 자극 재생 중에는 보기를 감춥니다 (듣기에 집중) */}
          {currentQuestion.type === "choice" && currentQuestion.options && needsAudioGate && !stimulusDone ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
              <p className="text-slate-700">🔊 잘 들어 주세요. 다 들으면 보기가 나타납니다.</p>
              <button
                type="button"
                onClick={() => { cancelSequence(); setStimulusDone(true); }}
                className="mt-3 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                보기 바로 보기
              </button>
            </div>
          ) : null}

          {currentQuestion.type === "choice" && currentQuestion.options && (!needsAudioGate || stimulusDone) ? (
            <div key={currentQuestion.id} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuestion.options.map((option, optionIndex) => (
                <button
                  key={`${currentQuestion.id}-${optionIndex}`}
                  type="button"
                  className={
                    option.image
                      ? "flex flex-col items-center gap-2 rounded-xl border-2 border-slate-200 p-3 font-medium transition-all hover:border-brand-300 hover:bg-brand-50"
                      : "rounded-xl border-2 border-slate-200 p-4 text-left font-medium transition-all hover:border-brand-300 hover:bg-brand-50"
                  }
                  onClick={() => handleAnswer(option.label, option.score)}
                >
                  {option.image ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={option.image}
                        alt={option.label}
                        className="h-36 w-auto object-contain sm:h-40"
                      />
                      <span className="text-sm text-slate-700">{option.label}</span>
                    </>
                  ) : (
                    option.label
                  )}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex justify-between pt-2">
          <button
            type="button"
            disabled={currentIndex === 0}
            className="rounded-xl border border-slate-200 px-5 py-2 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handlePrevious}
          >
            이전
          </button>
          <span className="text-sm text-slate-600 py-2">
            {currentIndex + 1} / {totalQuestions}
          </span>
        </div>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-slate-800">
        음성 안내가 활성화되어 있습니다. 문항을 읽어드립니다.
      </div>
    </div>
  );
}
