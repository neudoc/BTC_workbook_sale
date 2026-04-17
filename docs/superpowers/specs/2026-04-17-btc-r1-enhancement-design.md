# BrainTrust Club Website Enhancement Design

**Date**: 2026-04-17
**Approach**: Incremental improvement on existing Next.js 14 prototype
**Status**: Approved

---

## Overview

Enhance the existing BrainTrust Club frontend prototype with:
1. 3 new cognitive training games
2. 2 new cognitive screening tests
3. Education/course management system
4. PortOne payment integration
5. UI/UX improvements for seniors and caregivers

**Target users**: Seniors (60+) and their caregivers/guardians
**Brand**: BrainTrust Club (unchanged)
**Backend strategy**: BaaS (Supabase/Firebase) in future phase

---

## Architecture

### Directory Structure (Additions)

```
src/
├── app/
│   ├── training/
│   │   ├── reaction/          # Existing: reaction time
│   │   ├── sequence/          # Existing: number sequence
│   │   ├── stroop/            # Existing: stroop test
│   │   ├── memory/            # NEW: N-back working memory
│   │   ├── pattern/           # NEW: spatial pattern matching
│   │   └── word/              # NEW: word association
│   ├── screening/
│   │   ├── self-check/        # Existing: self-check
│   │   ├── lifestyle/         # Existing: lifestyle check
│   │   ├── cognitive/         # NEW: comprehensive cognitive test (MMSE-inspired, original items)
│   │   └── moca/              # NEW: MoCA-style assessment
│   ├── education/             # NEW: education system
│   │   ├── courses/           # Course listing
│   │   ├── [id]/              # Course detail
│   │   └── enrollment/        # Enrollment form
│   ├── checkout/              # Enhanced with PortOne
│   └── mypage/                # Enhanced with education tab
├── components/
│   ├── training/              # Game components (3 new)
│   ├── screening/             # Screening components (2 new)
│   ├── education/             # NEW: course components
│   ├── payment/               # NEW: PortOne payment
│   └── ui/                    # Enhanced shared UI
└── lib/
    ├── data/
    │   ├── courses.ts         # NEW: course data
    │   └── screenings.ts      # NEW: screening question data
    ├── portone.ts             # NEW: payment module
    └── types/                 # NEW: TypeScript types
```

---

## New Cognitive Training Games

### 1. Memory (N-Back) - `/training/memory`
- **Cognitive domain**: Working memory
- **Mechanic**: Sequential numbers shown; user indicates if current matches N-back
- **Difficulty levels**: Easy (1-back), Normal (2-back), Hard (3-back)
- **Rounds**: 20 trials per session
- **Features**: Korean TTS, SVG results chart, localStorage save

### 2. Pattern Matching - `/training/pattern`
- **Cognitive domain**: Visuospatial
- **Mechanic**: Grid highlights cells in sequence; user reproduces pattern
- **Difficulty levels**: Easy (3x3, 3 cells), Normal (4x4, 5 cells), Hard (5x5, 7 cells)
- **Rounds**: 10 patterns per session
- **Features**: Korean TTS, SVG results chart, localStorage save

### 3. Word Association - `/training/word`
- **Cognitive domain**: Language / semantic memory
- **Mechanic**: Present word pairs; test recall of associations
- **Difficulty levels**: Easy (5 pairs), Normal (8 pairs), Hard (12 pairs)
- **Rounds**: Study phase → test phase per session
- **Features**: Korean TTS, SVG results chart, localStorage save

All games follow existing patterns: voice guidance, difficulty selection, results visualization, member save.

---

## New Cognitive Screening Tests

### 1. Comprehensive Cognitive Test - `/screening/cognitive`
- **Inspiration**: MMSE format, but **entirely original items** to avoid IP/patent issues
- **Domains covered**:
  - Temporal orientation (3 items)
  - Spatial orientation (2 items)
  - Registration/memory (3 items)
  - Attention/calculation (3 items)
  - Recall (2 items)
  - Language (2 items)
- **Total**: ~15 items
- **Scoring**: 0-30 points with domain-specific subscores
- **Disclaimer**: "Reference-only self-assessment, not a medical diagnosis"

### 2. MoCA-Style Assessment - `/screening/moca`
- **Domains covered**:
  - Visuospatial/executive (3 items)
  - Naming (2 items)
  - Attention (3 items)
  - Language (2 items)
  - Abstraction (1 item)
  - Delayed recall (2 items)
  - Orientation (2 items)
- **Total**: ~12 items
- **Scoring**: 0-30 points with domain-specific subscores
- **Disclaimer**: "Reference-only self-assessment, not a medical diagnosis"

Both tests include: progress bar, time tracking, detailed results with domain breakdown, recommendations.

---

## Education/Course System

### Course Listing - `/education/courses`
- Card layout: thumbnail, title, duration, price, enrollment button
- Filter by category (certification, professional development, etc.)
- Static JSON data initially

### Course Detail - `/education/courses/[id]`
- Hero image + course overview
- Curriculum accordion (modules, lessons, duration)
- Instructor profile
- Completion criteria
- Student reviews
- CTA: "Apply Now" → enrollment page

### Enrollment - `/education/enrollment`
- Personal info form
- Course selection summary
- Payment via PortOne
- Confirmation receipt

### Progress Management (MyPage tab)
- Enrolled courses list
- Progress percentage per course
- Attendance record
- Certificate download (if completed)

---

## Payment System (PortOne)

### Integration
- **SDK**: PortOne browser SDK (`@portone/browser-sdk`)
- **Payment methods**: Card, KakaoPay, Naver Pay, bank transfer
- **Flow**: Cart/order form → PortOne payment modal → client verification → receipt storage

### Payment Flow
1. User submits order/enrollment form
2. Server creates PortOne payment ID (API route)
3. Browser opens PortOne payment modal
4. On success, verify payment via PortOne API
5. Store receipt in localStorage (phase 1) / Supabase (phase 2)
6. Show confirmation page

### Refund
- MyPage refund request form
- Admin approval workflow (future phase)

### Scope
- Phase 1 (current): Client-side payment + localStorage receipts
- Phase 2 (future): Server-side verification + Supabase persistence

---

## UI/UX Improvements

### Senior-Friendly Design
- Base font size: 18px minimum
- Touch targets: minimum 48x48px
- Button/text contrast: WCAG AA or higher
- Clear focus indicators

### Navigation
- Mobile: bottom fixed tab bar (Home, Training, Screening, Blog, My)
- Desktop: persistent sidebar with icons
- Breadcrumbs on all inner pages

### Interactions
- Smooth page transitions (CSS transitions, no heavy animations)
- Progress indicators on multi-step flows (games, tests, checkout)
- Loading skeletons for async content

### Accessibility
- Semantic HTML throughout
- ARIA labels on interactive elements
- Keyboard navigable
- Korean TTS maintained for games and tests

---

## Implementation Order

1. **UI/UX improvements** — foundation for all other work
2. **New training games** (memory, pattern, word) — extend existing patterns
3. **New screening tests** (cognitive, MoCA-style) — extend existing patterns
4. **Education system** — new section, uses existing UI components
5. **PortOne payment** — integrate into shop + education enrollment
6. **MyPage enhancements** — education tab, order history, refund requests

---

## Technical Notes

- All new code follows existing TypeScript + Tailwind patterns
- Static data in `lib/data/` with TypeScript interfaces
- localStorage for all persistence (phase 1)
- No breaking changes to existing pages/components
- Mobile-first responsive design
- Korean language throughout
