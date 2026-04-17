# Core Features Design Spec

## Overview

BrainTrust Club(BTC) 프로토타입에 5개 핵심 기능을 추가한다. 현재 localStorage 기반 프로토타입을 Prisma + SQLite 기반으로 전환하고, 인증, 쇼핑몰, 관리자, 전문가센터, 블로그 관리 기능을 구현한다.

## 공통 기반: Prisma + SQLite

### 데이터베이스 스키마

**User**
- id (Int, PK, autoincrement)
- email (String, unique)
- name (String)
- passwordHash (String)
- role (Enum: MEMBER, EXPERT_PENDING, EXPERT, ADMIN)
- phone (String, optional)
- createdAt, updatedAt (DateTime)

**Product**
- id (Int, PK)
- name, slug (String, slug unique)
- shortDescription, description (String)
- price, salePrice (Int, salePrice optional)
- category (String)
- stock (Int, default 0)
- thumbnailUrl (String, optional)
- images (String, JSON array, optional)
- tags (String, optional)
- isActive (Boolean, default true)
- createdAt, updatedAt (DateTime)

**Order**
- id (Int, PK)
- userId (Int, FK → User)
- orderNumber (String, unique)
- totalAmount (Int)
- status (Enum: PENDING, PAID, SHIPPED, DELIVERED, CANCELLED, REFUNDED)
- recipientName, recipientPhone, address (String)
- createdAt, updatedAt (DateTime)

**OrderItem**
- id (Int, PK)
- orderId (Int, FK → Order)
- productId (Int, FK → Product)
- quantity (Int)
- unitPrice (Int)

**BlogPost**
- id (Int, PK)
- title, slug (String, slug unique)
- excerpt (String)
- content (String, markdown)
- category (String)
- tags (String, optional)
- authorId (Int, FK → User)
- thumbnailUrl (String, optional)
- status (Enum: DRAFT, PUBLISHED)
- publishedAt (DateTime, optional)
- createdAt, updatedAt (DateTime)

**ExpertResource**
- id (Int, PK)
- title (String)
- category (String)
- description (String, optional)
- fileUrl (String, optional)
- content (String, optional)
- visibility (Enum: PUBLIC, EXPERT_ONLY)
- createdAt, updatedAt (DateTime)

**Inquiry**
- id (Int, PK)
- type (String)
- name, email, phone, message (String)
- status (Enum: PENDING, ANSWERED)
- answer (String, optional)
- createdAt, updatedAt (DateTime)

**TrainingRecord**
- id (Int, PK)
- userId (Int, FK → User)
- gameType (String)
- score (Int)
- duration (Int, seconds)
- resultJson (String, optional)
- playedAt (DateTime)

**ScreeningResult**
- id (Int, PK)
- userId (Int, FK → User)
- testType (String)
- score (Int)
- level (String)
- resultSummary (String)
- resultJson (String, optional)
- createdAt (DateTime)

### 기술 결정

- ORM: Prisma (타입 안전성, 마이그레이션 지원)
- DB: SQLite (개발용, 향후 PostgreSQL 마이그레이션 가능)
- 인증: 기존 쿠키 세션 방식 유지, bcrypt로 비밀번호 해시
- 파일 업로드: `public/uploads/` 디렉토리에 저장

---

## Feature 1: 인증/회원가입 시스템

### API 엔드포인트
- `POST /api/auth/register` — 회원가입 (email, name, password)
- `POST /api/auth/login` — 기존 보강 (password 검증 추가)
- `POST /api/auth/logout` — 기존 유지
- `GET /api/auth/me` — 기존 보강 (DB에서 사용자 정보 조회)

### 회원가입 플로우
1. 이메일/이름/비밀번호 입력
2. 이메일 중복 체크
3. bcrypt 해시 후 DB 저장
4. 자동 로그인 (쿠키 발급)
5. 기본 역할: MEMBER

### 전문가 신청 플로우
1. 마이페이지에서 "전문가 신청" 버튼
2. 신청 폼 제출 → role을 EXPERT_PENDING으로 변경
3. 관리자가 승인/반려
4. 승인 시 role → EXPERT

### 관리자 계정
- ADMIN_INVITE_CODE 환경변수로 관리자 가입
- 또는 시드 스크립트로 기본 관리자 생성

### 페이지
- `/login` — 로그인/회원가입 통합 페이지 (탭 전환)
- 회원가입 폼: 이메일, 이름, 비밀번호, 비밀번호 확인

---

## Feature 3: 쇼핑몰 상품 관리

### 공개 페이지
- `/shop` — 상품 목록 (카테고리 필터, 검색)
- `/shop/[slug]` — 상품 상세

### API 엔드포인트
- `GET /api/products` — 상품 목록 (필터, 검색, 페이지네이션)
- `GET /api/products/[slug]` — 상품 상세
- `POST /api/products` — 상품 생성 (Admin)
- `PUT /api/products/[slug]` — 상품 수정 (Admin)
- `DELETE /api/products/[slug]` — 상품 삭제 (Admin)
- `POST /api/orders` — 주문 생성
- `GET /api/orders` — 내 주문 목록

### 장바구니
- 비회원: localStorage 유지
- 회원: DB에 Cart/CartItem 테이블 추가 (또는 localStorage + 주문 시 DB 저장)
- 결제는 데모 상태로 유지 (실제 PG 연동은 향후)

---

## Feature 4: 관리자 대시보드

### 구조: `/admin` 하위 탭형 레이아웃
- `/admin` — 대시보드 요약 (통계 카드)
- `/admin/members` — 회원 관리
- `/admin/products` — 상품 관리
- `/admin/orders` — 주문 관리
- `/admin/blog` — 블로그 관리
- `/admin/inquiries` — 문의 관리
- `/admin/experts` — 전문가 승인 관리
- `/admin/resources` — 전문가 자료 관리

### 공통 레이아웃
- 좌측 사이드바 네비게이션
- 상단 헤더 (관리자 이름, 로그아웃)
- AdminLayout 컴포넌트로 권한 체크

### 대시보드 요약 카드
- 총 회원 수, 신규 가입 수
- 총 주문 수, 매출액
- 미답변 문의 수
- 전문가 승인 대기 수

### 회원 관리
- 회원 목록 (검색, 역할 필터)
- 역할 변경
- 전문가 승인/반려

### API 엔드포인트
- `GET /api/admin/members` — 회원 목록
- `PUT /api/admin/members/[id]` — 회원 정보 수정 (역할 변경)
- `GET /api/admin/orders` — 전체 주문 목록
- `PUT /api/admin/orders/[id]` — 주문 상태 변경
- `GET /api/admin/stats` — 대시보드 통계
- `GET /api/admin/inquiries` — 문의 목록
- `PUT /api/admin/inquiries/[id]` — 문의 답변

---

## Feature 5: 전문가센터

### 페이지 구조
- `/expert` — 전문가센터 홈 (상태별 분기)
- `/expert/resources` — 교육자료실 (승인된 전문가만)
- `/expert/forms` — 평가양식/도구
- `/expert/notice` — 전문가 공지
- `/expert/qna` — Q&A

### 접근 제어
- 비로그인/Guest: 소개 페이지만
- EXPERT_PENDING: 승인 대기 안내
- EXPERT: 전체 자료 접근
- ADMIN: 전체 접근 + 자료 업로드

### 교육자료실
- 카테고리별 분류 (교육자료, 평가양식, 운영가이드 등)
- 파일 다운로드 (관리자가 업로드한 파일)
- 목록 보기, 검색

### 관리자 자료 업로드
- `/admin/resources`에서 파일 업로드
- 제목, 카테고리, 설명, 공개 범위 설정

### API 엔드포인트
- `GET /api/expert/resources` — 자료 목록 (전문가만)
- `POST /api/admin/resources` — 자료 업로드 (Admin)
- `PUT /api/admin/resources/[id]` — 자료 수정 (Admin)
- `DELETE /api/admin/resources/[id]` — 자료 삭제 (Admin)

---

## Feature 7: 블로그 관리

### 공개 블로그
- `/blog` — 글 목록 (카테고리, 태그, 검색)
- `/blog/[slug]` — 글 상세

### 관리자 블로그 관리 (`/admin/blog`)
- 글 목록 (상태 필터: 공개/비공개)
- 글 작성 (제목, 카테고리, 태그, 내용-마크다운, 썸네일)
- 글 수정
- 글 삭제
- 공개/비공개 토글

### API 엔드포인트
- `GET /api/blog` — 공개 글 목록 (필터, 검색, 페이지네이션)
- `GET /api/blog/[slug]` — 글 상세
- `POST /api/admin/blog` — 글 생성 (Admin)
- `PUT /api/admin/blog/[id]` — 글 수정 (Admin)
- `DELETE /api/admin/blog/[id]` — 글 삭제 (Admin)

### 에디터
- 텍스트영역 기반 마크다운 편집
- 미리보기 기능
- 이미지 업로드는 향후 확장

---

## 구현 순서

1. **Prisma 설정 + 스키마** — DB 기반 구축
2. **인증/회원가입** — register API, 로그인 보강, 회원가입 페이지
3. **쇼핑몰 상품 관리** — Product CRUD API, 프론트 연동
4. **관리자 대시보드** — AdminLayout, 각 관리 탭
5. **전문가센터** — 자료실, 접근 제어
6. **블로그 관리** — CRUD, 에디터, 카테고리/태그

---

## 파일 구조 (추가/변경 예상)

```
prisma/
  schema.prisma
  seed.ts
  dev.db
src/
  lib/
    prisma.ts          # Prisma client singleton
    auth.ts            # 비밀번호 해시, 세션 유틸
    storage.ts         # 기존 (점진적 마이그레이션)
  app/
    api/
      auth/
        register/route.ts
        login/route.ts  (보강)
        logout/route.ts
        me/route.ts     (보강)
      products/
        route.ts
        [slug]/route.ts
      orders/
        route.ts
      blog/
        route.ts
        [slug]/route.ts
      admin/
        members/route.ts
        products/route.ts
        orders/route.ts
        blog/route.ts
        inquiries/route.ts
        resources/route.ts
        stats/route.ts
      expert/
        resources/route.ts
    admin/
      layout.tsx        # AdminLayout with sidebar
      page.tsx          # Dashboard
      members/page.tsx
      products/page.tsx
      orders/page.tsx
      blog/page.tsx
      inquiries/page.tsx
      experts/page.tsx
      resources/page.tsx
    expert/
      page.tsx          (보강)
      resources/page.tsx
    login/
      page.tsx          (회원가입 탭 추가)
    blog/
      page.tsx          (DB 연동)
```
