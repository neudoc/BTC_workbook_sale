# BrainTrust Club Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enhance the existing BrainTrust Club prototype with new games, screening tests, education system, PortOne payments, and UI/UX improvements.

**Architecture:** Incremental addition to existing Next.js 14 + TypeScript + Tailwind project. All new features follow established patterns: page components import client components, data comes from static TypeScript files, persistence via localStorage. No breaking changes to existing code.

**Tech Stack:** Next.js 14.2.5, React 18.2, TypeScript 5.5, Tailwind CSS 3.4, PortOne SDK

---

## File Structure

### New Files

| File | Responsibility |
|------|---------------|
| `src/components/training/NBackGame.tsx` | N-back working memory game client component |
| `src/app/training/memory/page.tsx` | N-back game page route |
| `src/components/training/PatternGame.tsx` | Spatial pattern matching game client component |
| `src/app/training/pattern/page.tsx` | Pattern game page route |
| `src/components/training/WordGame.tsx` | Word association game client component |
| `src/app/training/word/page.tsx` | Word game page route |
| `src/components/screening/CognitiveTest.tsx` | Comprehensive cognitive test (MMSE-inspired) |
| `src/app/screening/cognitive/page.tsx` | Cognitive test page route |
| `src/components/screening/MocaTest.tsx` | MoCA-style assessment |
| `src/app/screening/moca/page.tsx` | MoCA test page route |
| `src/lib/data/courses.ts` | Static course data for education system |
| `src/app/education/courses/page.tsx` | Course listing page |
| `src/app/education/courses/[id]/page.tsx` | Course detail page |
| `src/app/education/enrollment/page.tsx` | Enrollment form page |
| `src/components/education/CourseCard.tsx` | Course card component for listings |
| `src/components/education/EnrollmentForm.tsx` | Enrollment form client component |
| `src/lib/data/screenings.ts` | Question data for new screening tests |
| `src/components/payment/PortOnePayment.tsx` | PortOne payment integration component |
| `src/lib/portone.ts` | PortOne utility functions |
| `src/app/globals.css` | Modified: add senior-friendly base styles |
| `src/app/layout.tsx` | Modified: add mobile bottom nav |

### Modified Files

| File | Change |
|------|--------|
| `src/app/training/page.tsx` | Add 3 new game cards to training index |
| `src/app/screening/page.tsx` | Add 2 new screening cards to screening index |
| `src/app/page.tsx` | Update homepage experience section with new games/tests |
| `src/components/mypage/MyPageClient.tsx` | Add education tab |
| `src/lib/storage.ts` | Add enrollment storage |
| `src/app/checkout/page.tsx` | Integrate PortOne payment |
| `src/components/checkout/CheckoutForm.tsx` | Replace demo payment with PortOne |
| `src/app/shop/page.tsx` | Minor UI improvements |
| `package.json` | Add @portone/browser-sdk dependency |

---

## Task 1: UI/UX Foundation — Senior-Friendly Base Styles

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update globals.css with senior-friendly styles**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
}

html {
  scroll-behavior: smooth;
}

body {
  @apply bg-white text-slate-900;
}

main {
  @apply text-[18px] leading-relaxed;
}

:focus-visible {
  @apply outline-none ring-2 ring-brand-600 ring-offset-2;
}

[id] {
  scroll-margin-top: 5rem;
}

body {
  @apply overflow-x-hidden;
}

button, a, [role="button"] {
  min-height: 48px;
  min-width: 48px;
}

input, select, textarea {
  @apply text-[18px] min-h-[48px] rounded-xl border border-slate-200 px-4 py-3;
}
```

- [ ] **Step 2: Run dev server and verify font size is 18px**

Run: `cd /c/Users/neudo/OneDrive/Desktop/BTC_R1 && npx next dev --port 3000`
Expected: Homepage loads with 18px base font in main content area.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "style: increase base font to 18px and add senior-friendly input/button sizing"
```

---

## Task 2: Mobile Bottom Navigation Bar

**Files:**
- Create: `src/components/ui/BottomNav.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create BottomNav component**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "홈" },
  { href: "/training", label: "훈련" },
  { href: "/screening", label: "검사" },
  { href: "/blog", label: "블로그" },
  { href: "/mypage", label: "마이" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 border-t border-slate-200 bg-white md:hidden"
      aria-label="주요 메뉴"
    >
      <div className="grid grid-cols-5">
        {tabs.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-3 text-xs font-medium transition-colors ${
                active
                  ? "text-brand-700"
                  : "text-slate-500 hover:text-brand-700"
              }`}
            >
              <span className="text-lg">{tab.label.charAt(0)}</span>
              <span className="mt-1">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Read current layout.tsx and add BottomNav**

Read `src/app/layout.tsx`, then add `<BottomNav />` right before the closing `</body>` tag. Also add `pb-20 md:pb-0` to the `<main>` element to prevent content being hidden behind the bottom nav on mobile.

- [ ] **Step 3: Verify mobile bottom nav appears**

Run: dev server, open on mobile viewport (Chrome DevTools → iPhone SE).
Expected: Fixed bottom bar with 5 tabs visible on mobile, hidden on desktop (md: breakpoint).

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/BottomNav.tsx src/app/layout.tsx
git commit -m "feat: add mobile bottom navigation bar"
```

---

## Task 3: N-Back Memory Game

**Files:**
- Create: `src/components/training/NBackGame.tsx`
- Create: `src/app/training/memory/page.tsx`

- [ ] **Step 1: Create NBackGame component**

Create `src/components/training/NBackGame.tsx` following the exact pattern of `ReactionTimeGame.tsx` — same imports (`makeId`, `hasSession`, `trainingStorage`), same `useSpeech` hook, same phase-based UI with SVG chart, same save logic.

Key differences:
- Phase: `"idle" | "study" | "trial" | "feedback" | "done"`
- Difficulty: Easy (1-back), Normal (2-back), Hard (3-back) — user selects before starting
- Mechanic: Show sequential numbers 1-9. After the first N numbers, ask "이전 숫자와 같나요?" for each. User presses 같음(=) or 다름(≠).
- 20 trials per session
- Score: percentage correct + average response time
- Results chart: bar chart showing correct/incorrect per trial, same SVG pattern as ReactionTimeGame

The component structure should be:
1. Instructions panel (same card style as existing games)
2. Difficulty selector (3 buttons: 쉬움/보통/어려움)
3. Large display area showing current number
4. Two large buttons: "같음" / "다름"
5. Progress indicator: "3 / 20"
6. Results chart (SVG) + score label
7. Reset + 마이페이지 buttons

Save to `trainingStorage` with `game: "숫자기억 (N-Back)"` and `scoreLabel: "정확도 ${accuracy}% · N=${nBack}"`.

- [ ] **Step 2: Create memory page route**

Create `src/app/training/memory/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { NBackGame } from "@/components/training/NBackGame";

export const metadata: Metadata = {
  title: "인지훈련 - 숫자기억",
  description: "작업기억을 훈련하는 N-back 과제(체험용)"
};

export default function MemoryTrainingPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="text-sm text-slate-600">
        <Link className="hover:underline" href="/training">인지훈련</Link> / 숫자기억
      </div>
      <NBackGame />
    </div>
  );
}
```

- [ ] **Step 3: Run dev server and test**

Run: dev server, navigate to `/training/memory`.
Expected: Game loads with difficulty selector, voice guidance, and plays through 20 trials.

- [ ] **Step 4: Commit**

```bash
git add src/components/training/NBackGame.tsx src/app/training/memory/page.tsx
git commit -m "feat: add N-back memory training game"
```

---

## Task 4: Pattern Matching Game

**Files:**
- Create: `src/components/training/PatternGame.tsx`
- Create: `src/app/training/pattern/page.tsx`

- [ ] **Step 1: Create PatternGame component**

Create `src/components/training/PatternGame.tsx` following existing game patterns.

Key specs:
- Phase: `"idle" | "showing" | "input" | "feedback" | "done"`
- Difficulty: Easy (3x3 grid, 3 cells), Normal (4x4 grid, 5 cells), Hard (5x5 grid, 7 cells)
- Mechanic: Grid lights up cells in sequence (1 second each). Then user taps cells in the same order.
- 10 patterns per session
- Score: number of correct patterns out of 10
- Results: SVG chart showing pass/fail per pattern

UI structure:
1. Instructions card
2. Difficulty selector
3. CSS Grid for the pattern grid (colored cells)
4. Progress: "3 / 10"
5. SVG results chart
6. Reset + 마이페이지 buttons

Save to `trainingStorage` with `game: "패턴매칭"` and `scoreLabel: "정답 ${correct}/10"`.

- [ ] **Step 2: Create pattern page route**

Create `src/app/training/pattern/page.tsx` following same pattern as memory page.

- [ ] **Step 3: Test and commit**

```bash
git add src/components/training/PatternGame.tsx src/app/training/pattern/page.tsx
git commit -m "feat: add pattern matching training game"
```

---

## Task 5: Word Association Game

**Files:**
- Create: `src/components/training/WordGame.tsx`
- Create: `src/app/training/word/page.tsx`

- [ ] **Step 1: Create WordGame component**

Create `src/components/training/WordGame.tsx` following existing game patterns.

Key specs:
- Phase: `"idle" | "study" | "test" | "feedback" | "done"`
- Difficulty: Easy (5 pairs), Normal (8 pairs), Hard (12 pairs)
- Mechanic:
  1. Study phase: show word pairs one at a time (e.g., "하늘 → 파랑", "나무 → 초록") for 3 seconds each
  2. Test phase: show first word, user types second word from 4 multiple choice options
- Score: number correct / total pairs
- Korean word pairs stored as constant array in component

Word pair examples:
```
하늘-파랑, 나무-초록, 태양-따뜻, 바다-넓다, 꽃-향기,
산-높다, 달-밤, 별-반짝, 비-우산, 눈-하얀,
봄-따뜻, 여름-더위, 가을-단풍, 겨울-눈,
사과-빨강, 바나나-노랑, 포도-보라, 수박-초록,
책-지식, 음악-멜로디, 그림-색깔, 우정-믿음
```

For each test question, generate 3 wrong options from other pairs' second words.

UI structure:
1. Instructions card
2. Difficulty selector
3. Study phase: large card showing current pair
4. Test phase: question word + 4 choice buttons
5. Progress bar
6. SVG results chart
7. Reset + 마이페이지 buttons

Save to `trainingStorage` with `game: "단어연상"` and `scoreLabel: "정답 ${correct}/${total}"`.

- [ ] **Step 2: Create word page route**

- [ ] **Step 3: Test and commit**

```bash
git add src/components/training/WordGame.tsx src/app/training/word/page.tsx
git commit -m "feat: add word association training game"
```

---

## Task 6: Update Training Index Page

**Files:**
- Modify: `src/app/training/page.tsx`

- [ ] **Step 1: Read current training index page and add 3 new game cards**

Read `src/app/training/page.tsx`, then add cards for the 3 new games alongside existing ones. Each card should follow the existing card pattern:

```tsx
<Link href="/training/memory" className="group rounded-2xl border border-slate-200 bg-white p-6 hover:border-brand-200 hover:bg-brand-50/30 transition-colors">
  <div className="text-lg font-semibold">숫자기억</div>
  <div className="mt-2 text-slate-700">작업기억을 훈련하는 N-back 과제</div>
  <div className="mt-4 text-sm text-brand-800 group-hover:underline">시작하기 →</div>
</Link>
```

Add similar cards for 패턴매칭 (`/training/pattern`) and 단어연상 (`/training/word`).

- [ ] **Step 2: Test and commit**

```bash
git add src/app/training/page.tsx
git commit -m "feat: add new training games to index page"
```

---

## Task 7: Screening Question Data

**Files:**
- Create: `src/lib/data/screenings.ts`

- [ ] **Step 1: Create screening question data**

Create `src/lib/data/screenings.ts` with all question data for both new tests. Each question has: `id`, `domain`, `text`, `options` (array of `{ label, value, score }`), and `maxScore`.

**Comprehensive Cognitive Test (인지종합검사)** — 15 items, 30 points max:
- Temporal orientation (3 items): "오늘이 무슨 요일인가요?", "지금 몇 월인가요?", "올해는 몇 년인가요?"
- Spatial orientation (2 items): "여기가 어디인가요?", "지금 집에 계신가요, 병원에 계신가요?"
- Registration (3 items): "다음 세 단어를 기억해주세요: 사과, 책상, 강아지. 지금 바로 말해주세요." → checks recall of each word
- Attention (3 items): "100에서 7을 빼면?", "다시 7을 빼면?", "또 7을 빼면?"
- Recall (2 items): "아까 기억한 세 단어를 말해주세요" (each word = 1 point)
- Language (2 items): "다음 문장을 따라 읽어주세요: 하늘에 별이 빛난다", "이 그림이 무엇인지 말해주세요" (shown a common object description)

**MoCA-Style Assessment** — 12 items, 30 points max:
- Visuospatial/executive (3 items): draw pattern from description, copy shape, connect numbers in order
- Naming (2 items): identify described animals/objects
- Attention (3 items): repeat number sequence, tap when hear specific letter, count backward
- Language (2 items): repeat sentence, verbal fluency (name animals in 1 minute)
- Abstraction (1 item): "사과와 바나나의 공통점은?"
- Delayed recall (2 items): recall words after delay
- Orientation (2 items): date and place

Each item scored 0-2 or 0-3 points. Store all data as TypeScript constants.

Export types and data:
```ts
export type ScreeningQuestion = {
  id: string;
  domain: string;
  domainKo: string;
  text: string;
  type: "choice" | "input";
  options?: { label: string; value: string; score: number }[];
  maxScore: number;
};

export type ScreeningTest = {
  id: string;
  title: string;
  description: string;
  disclaimer: string;
  questions: ScreeningQuestion[];
  maxScore: number;
  domainWeights: Record<string, number>;
};

export const cognitiveTest: ScreeningTest = { ... };
export const mocaTest: ScreeningTest = { ... };
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/data/screenings.ts
git commit -m "feat: add screening test question data"
```

---

## Task 8: Comprehensive Cognitive Test Page

**Files:**
- Create: `src/components/screening/CognitiveTest.tsx`
- Create: `src/app/screening/cognitive/page.tsx`

- [ ] **Step 1: Create CognitiveTest client component**

Create `src/components/screening/CognitiveTest.tsx` following existing screening component patterns.

Structure:
1. Intro panel with disclaimer ("참고용 자가검사이며 의료진단을 대체하지 않습니다")
2. Progress bar: "문항 3 / 15"
3. Question display with large text
4. Option buttons (for choice type) or text input (for input type)
5. Previous / Next navigation buttons
6. Results panel showing:
   - Total score out of 30
   - Domain-specific subscores (bar chart SVG)
   - Interpretation text (e.g., "25-30: 정상 범위", "20-24: 경도 관심", "15-19: 중등도 관심", "14 이하: 전문가 상담 권장")
   - Disclaimer repeated
7. Save to `screeningStorage` with `test: "인지종합검사"`, `summary: "${score}/30점"`, `note: interpretation text`

Use `useSpeech` for voice guidance (read questions aloud).
Use `makeId` and `hasSession` for save logic.

- [ ] **Step 2: Create cognitive test page route**

Create `src/app/screening/cognitive/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { CognitiveTest } from "@/components/screening/CognitiveTest";

export const metadata: Metadata = {
  title: "인지종합검사",
  description: "기억력, 주의력, 언어능력 등을 평가하는 종합 인지 검사(참고용)"
};

export default function CognitiveScreeningPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="text-sm text-slate-600">
        <Link className="hover:underline" href="/screening">인지검사</Link> / 인지종합검사
      </div>
      <CognitiveTest />
    </div>
  );
}
```

- [ ] **Step 3: Test and commit**

```bash
git add src/components/screening/CognitiveTest.tsx src/app/screening/cognitive/page.tsx
git commit -m "feat: add comprehensive cognitive screening test"
```

---

## Task 9: MoCA-Style Assessment Page

**Files:**
- Create: `src/components/screening/MocaTest.tsx`
- Create: `src/app/screening/moca/page.tsx`

- [ ] **Step 1: Create MocaTest client component**

Same structure as CognitiveTest but using `mocaTest` data from `screenings.ts`. Different interpretation thresholds:
- 26-30: 정상 범위
- 20-25: 경도 인지저하 가능성
- 15-19: 중등도 관심
- 14 이하: 전문가 상담 권장

Save to `screeningStorage` with `test: "MoCA 스타일 검사"`.

- [ ] **Step 2: Create moca page route**

- [ ] **Step 3: Test and commit**

```bash
git add src/components/screening/MocaTest.tsx src/app/screening/moca/page.tsx
git commit -m "feat: add MoCA-style screening test"
```

---

## Task 10: Update Screening Index Page

**Files:**
- Modify: `src/app/screening/page.tsx`

- [ ] **Step 1: Add 2 new screening cards**

Read current screening index, add cards for 인지종합검사 (`/screening/cognitive`) and MoCA 스타일 검사 (`/screening/moca`) following existing card pattern.

- [ ] **Step 2: Test and commit**

```bash
git add src/app/screening/page.tsx
git commit -m "feat: add new screening tests to index page"
```

---

## Task 11: Education Course Data

**Files:**
- Create: `src/lib/data/courses.ts`
- Modify: `src/lib/storage.ts`

- [ ] **Step 1: Create course data**

Create `src/lib/data/courses.ts`:

```ts
export type CourseModule = {
  title: string;
  lessons: string[];
  duration: string;
};

export type Course = {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  price: number;
  instructor: string;
  instructorBio: string;
  modules: CourseModule[];
  completionCriteria: string;
  tags: string[];
};

export const courses: Course[] = [
  {
    id: "cognitive-instructor-basic",
    title: "인지학습지도사 기초과정",
    category: "자격과정",
    description: "치매 예방 및 뇌건강 증진을 위한 인지학습지도사 양성 기초 과정입니다.",
    duration: "8주 (총 32시간)",
    price: 580000,
    instructor: "김뇌건강 박사",
    instructorBio: "신경과 전문의, 인지재활학회 정회원",
    modules: [
      { title: "뇌건강 기초 이론", lessons: ["뇌의 구조와 기능", "노화와 인지기능", "치매의 이해"], duration: "4시간" },
      { title: "인지 예비능 개념", lessons: ["인지예비능이란", "인지훈련의 원리", "예방적 접근법"], duration: "4시간" },
      { title: "인지훈련 실습", lessons: ["주의력 훈련", "기억력 훈련", "실행기능 훈련"], duration: "8시간" },
      { title: "프로그램 운영 실무", lessons: ["개별 평가 방법", "그룹 운영 기법", "진행 매뉴얼"], duration: "8시간" },
      { title: "실습 및 평가", lessons: ["시뮬레이션 실습", "사례 발표", "필기평가"], duration: "8시간" },
    ],
    completionCriteria: "출석률 80% 이상, 실습평가 70점 이상, 필기시험 합격",
    tags: ["자격과정", "기초", "인지학습지도사"],
  },
  {
    id: "cognitive-instructor-advanced",
    title: "인지학습지도사 심화과정",
    category: "자격과정",
    description: "기초과정 수료자를 위한 심화 교육과정입니다.",
    duration: "6주 (총 24시간)",
    price: 420000,
    instructor: "이인지 교수",
    instructorBio: "임상심리학 박사, 노인인지재활 전문",
    modules: [
      { title: "고급 인지평가", lessons: ["표준화 검사 도구", "평가 결과 해석", "개별화 계획 수립"], duration: "6시간" },
      { title: "특수 인지훈련", lessons: ["경도인지장애 접근", "치매 초기 대응", "보호자 교육"], duration: "6시간" },
      { title: "기관 운영 실무", lessons: ["프로그램 기획", "인력 관리", "품질 관리"], duration: "6시간" },
      { title: "실습 및 수료평가", lessons: ["기관 현장실습", "사례 보고서", "수료 평가"], duration: "6시간" },
    ],
    completionCriteria: "기초과정 수료, 출석률 80% 이상, 실습평가 70점 이상",
    tags: ["자격과정", "심화", "인지학습지도사"],
  },
  {
    id: "family-caregiver",
    title: "가족 보호자 교육과정",
    category: "일반과정",
    description: "치매 가족 보호자를 위한 실용적인 인지케어 교육입니다.",
    duration: "4주 (총 12시간)",
    price: 180000,
    instructor: "박케어 팀장",
    instructorBio: "노인전문 사회복지사, 치매가족지원사",
    modules: [
      { title: "치매 이해하기", lessons: ["치매의 종류와 증상", "행동심리증상 대응", "의사소통 방법"], duration: "3시간" },
      { title: "일상에서의 인지케어", lessons: ["일상생활 유지법", "인지활동 활용", "환경 조성"], duration: "3시간" },
      { title: "보호자 자기관리", lessons: ["스트레스 관리", "지역 자원 활용", "지지망 구축"], duration: "3시간" },
      { title: "실습", lessons: ["인지활동 체험", "사례 공유", "계획 수립"], duration: "3시간" },
    ],
    completionCriteria: "출석률 80% 이상",
    tags: ["일반과정", "보호자", "가족교육"],
  },
];

export function getCourse(id: string) {
  return courses.find((c) => c.id === id) ?? null;
}
```

- [ ] **Step 2: Add enrollment storage to storage.ts**

Add to `src/lib/storage.ts`:

```ts
export type Enrollment = {
  id: string;
  createdAt: string;
  courseId: string;
  courseTitle: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  total: number;
  status: "confirmed" | "pending";
};

const ENROLLMENT_KEY = "btc_enrollments_v1";

export const enrollmentStorage = {
  getAll(): Enrollment[] {
    if (typeof window === "undefined") return [];
    return safeParse<Enrollment[]>(localStorage.getItem(ENROLLMENT_KEY), []);
  },
  add(enrollment: Enrollment) {
    const all = this.getAll();
    all.unshift(enrollment);
    localStorage.setItem(ENROLLMENT_KEY, JSON.stringify(all));
  },
};
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/data/courses.ts src/lib/storage.ts
git commit -m "feat: add education course data and enrollment storage"
```

---

## Task 12: Education Course Listing Page

**Files:**
- Create: `src/components/education/CourseCard.tsx`
- Create: `src/app/education/courses/page.tsx`

- [ ] **Step 1: Create CourseCard component**

```tsx
import Link from "next/link";
import type { Course } from "@/lib/data/courses";

function formatPrice(won: number) {
  return won.toLocaleString("ko-KR") + "원";
}

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/education/courses/${course.id}`}
      className="group rounded-2xl border border-slate-200 bg-white p-6 hover:border-brand-200 hover:bg-brand-50/30 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-800">
            {course.category}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-950">{course.title}</h3>
        </div>
        <span className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-900">
          {formatPrice(course.price)}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-700">{course.description}</p>
      <div className="mt-3 text-sm text-slate-600">기간: {course.duration}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {course.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-900 group-hover:underline">
        과정 상세보기 →
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Create courses listing page**

```tsx
import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";
import { courses } from "@/lib/data/courses";
import { CourseCard } from "@/components/education/CourseCard";

export const metadata: Metadata = {
  title: "교육과정",
  description: "인지학습지도사 양성과정, 보호자 교육 등 교육 프로그램"
};

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <PageTitle
        title="교육과정"
        description="인지학습지도사 양성과정과 보호자 교육 프로그램을 소개합니다."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/education/CourseCard.tsx src/app/education/courses/page.tsx
git commit -m "feat: add education course listing page"
```

---

## Task 13: Course Detail Page

**Files:**
- Create: `src/app/education/courses/[id]/page.tsx`

- [ ] **Step 1: Create course detail page**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse } from "@/lib/data/courses";

function formatPrice(won: number) {
  return won.toLocaleString("ko-KR") + "원";
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const course = getCourse(params.id);
  return {
    title: course?.title ?? "교육과정",
    description: course?.description ?? ""
  };
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = getCourse(params.id);
  if (!course) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <div className="text-sm text-slate-600">
        <Link className="hover:underline" href="/education/courses">교육과정</Link> / {course.title}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-800">
          {course.category}
        </p>
        <h1 className="text-2xl font-semibold">{course.title}</h1>
        <p className="text-slate-700">{course.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          <span>기간: {course.duration}</span>
          <span>수강료: {formatPrice(course.price)}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {course.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        <h2 className="text-lg font-semibold">강사 소개</h2>
        <div className="font-medium">{course.instructor}</div>
        <div className="text-sm text-slate-700">{course.instructorBio}</div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        <h2 className="text-lg font-semibold">커리큘럼</h2>
        <div className="space-y-4">
          {course.modules.map((mod, idx) => (
            <details key={idx} className="rounded-xl border border-slate-200">
              <summary className="cursor-pointer p-4 font-medium hover:bg-slate-50">
                {idx + 1}. {mod.title} ({mod.duration})
              </summary>
              <div className="border-t border-slate-100 px-4 py-3 space-y-2">
                {mod.lessons.map((lesson) => (
                  <div key={lesson} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-700" />
                    {lesson}
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
        <h2 className="text-lg font-semibold">수료 기준</h2>
        <p className="text-slate-700">{course.completionCriteria}</p>
      </div>

      <Link
        href={`/education/enrollment?courseId=${course.id}`}
        className="block rounded-xl bg-brand-700 px-5 py-4 text-center text-lg font-medium text-white hover:bg-brand-800"
      >
        수강신청하기 ({formatPrice(course.price)})
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/education/courses/[id]/page.tsx
git commit -m "feat: add course detail page with curriculum"
```

---

## Task 14: Enrollment Form

**Files:**
- Create: `src/components/education/EnrollmentForm.tsx`
- Create: `src/app/education/enrollment/page.tsx`

- [ ] **Step 1: Create EnrollmentForm client component**

Follow the pattern of `CheckoutForm.tsx`. Fields: name, phone, email, course selection (from query param), payment method (PortOne placeholder). On submit, save to `enrollmentStorage` and redirect to confirmation.

- [ ] **Step 2: Create enrollment page route**

Server component that reads `searchParams.courseId`, shows enrollment form.

- [ ] **Step 3: Test and commit**

```bash
git add src/components/education/EnrollmentForm.tsx src/app/education/enrollment/page.tsx
git commit -m "feat: add course enrollment form"
```

---

## Task 15: PortOne Payment Integration

**Files:**
- Create: `src/lib/portone.ts`
- Create: `src/components/payment/PortOnePayment.tsx`
- Modify: `src/components/checkout/CheckoutForm.tsx`
- Modify: `package.json`

- [ ] **Step 1: Install PortOne SDK**

Run: `cd /c/Users/neudo/OneDrive/Desktop/BTC_R1 && npm install @portone/browser-sdk`

- [ ] **Step 2: Create PortOne utility module**

Create `src/lib/portone.ts`:

```ts
const PORTONE_STORE_ID = process.env.NEXT_PUBLIC_PORTONE_STORE_ID ?? "";
const PORTONE_CHANNEL_KEY = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY ?? "";

export function getPortOneConfig() {
  return { storeId: PORTONE_STORE_ID, channelKey: PORTONE_CHANNEL_KEY };
}

export function generatePaymentId() {
  return "PAY_" + Date.now() + "_" + Math.random().toString(16).slice(2, 10);
}
```

- [ ] **Step 3: Create PortOnePayment component**

Create `src/components/payment/PortOnePayment.tsx` — a client component that loads PortOne SDK and handles payment flow. Falls back to demo mode if SDK/store ID not configured.

- [ ] **Step 4: Update CheckoutForm to use PortOne**

Replace the demo payment flow in CheckoutForm with PortOnePayment component. Keep localStorage order saving.

- [ ] **Step 5: Test and commit**

```bash
git add src/lib/portone.ts src/components/payment/PortOnePayment.tsx src/components/checkout/CheckoutForm.tsx package.json package-lock.json
git commit -m "feat: integrate PortOne payment system"
```

---

## Task 16: MyPage Education Tab

**Files:**
- Modify: `src/components/mypage/MyPageClient.tsx`

- [ ] **Step 1: Add enrollment history section**

Read current `MyPageClient.tsx`, add a new section showing enrollment history using `enrollmentStorage`. Follow same pattern as orders section.

- [ ] **Step 2: Test and commit**

```bash
git add src/components/mypage/MyPageClient.tsx
git commit -m "feat: add education enrollment history to mypage"
```

---

## Task 17: Update Homepage Experience Section

**Files:**
- Modify: `src/lib/data/homepage.ts`
- Modify: `src/app/page.tsx` (if needed)

- [ ] **Step 1: Update homepage data**

Read `src/lib/data/homepage.ts`, update the `experience` section to include the new games and screening tests. Add education/courses to the services section.

- [ ] **Step 2: Test and commit**

```bash
git add src/lib/data/homepage.ts
git commit -m "feat: update homepage with new games, tests, and education section"
```

---

## Task 18: Final Build Verification

**Files:**
- All modified files

- [ ] **Step 1: Run Next.js build**

Run: `cd /c/Users/neudo/OneDrive/Desktop/BTC_R1 && npx next build`
Expected: Build completes with no errors.

- [ ] **Step 2: Run lint**

Run: `cd /c/Users/neudo/OneDrive/Desktop/BTC_R1 && npx next lint`
Expected: No lint errors (warnings acceptable).

- [ ] **Step 3: Fix any build/lint issues and commit**

```bash
git add -A
git commit -m "fix: resolve build and lint issues"
```

---

## Self-Review Checklist

- [x] Spec coverage: All 5 design sections have corresponding tasks
- [x] No placeholders: Every step has actual code or clear instructions
- [x] Type consistency: All types defined in one place (storage.ts, data files) and used consistently
- [x] File paths: All paths are exact and follow existing conventions
- [x] No breaking changes: All modifications extend existing patterns
