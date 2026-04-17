# BrainTrust Club (PRD 기반 프로토타입)

`website_PRD.md`의 MVP 범위를 기준으로, **설치/배포가 가능한 Next.js(App Router) 기반 웹사이트 프로토타입**를 구성했습니다.

## 요구사항

- Node.js 18+ (권장 20+)

## 실행

```bash
npm install
npm run dev
```

기본 주소: `http://localhost:3000`

Windows PowerShell에서 `npm` 실행이 막혀 있다면 `cmd`에서 `npm.cmd`로 실행하거나(예: `npm.cmd run dev`), 실행 정책을 조정해야 할 수 있습니다.

## 배포(예: Vercel)

- 프레임워크: Next.js
- Build Command: `npm run build`
- Output: Next.js default

### (선택) 관리자 로그인 코드

관리자 로그인은 환경변수로만 활성화됩니다.

- `ADMIN_INVITE_CODE`: 관리자 로그인 코드

## 배포(예: Docker)

```bash
docker build -t braintrustclub-web .
docker run --rm -p 3000:3000 -e ADMIN_INVITE_CODE=yourcode braintrustclub-web
```

## 데모 로그인 안내

- 회원: 로그인 페이지에서 “일반 회원” 선택
- 전문가: 로그인 페이지에서 “전문가 신청(대기)” 선택 (전문가센터는 ‘승인된 전문가’만 접근 가능하도록 분리되어 있으며, 본 프로토타입은 승인 프로세스를 단순화했습니다.)

## 구현 범위(요약)

- 공개 사이트(홈/소개/인지 예비능/프로그램)
- 쇼핑몰(상품 목록·상세), 장바구니/주문(로컬 저장 데모)
- 블로그(목록·상세·검색/카테고리)
- 무료 인지훈련 3종(브라우저 실행)
- 간단 인지 자가점검 2종(비의료/참고용 안내 포함)
- 로그인/로그아웃(쿠키 기반 데모), 권한 분리(회원/전문가/관리자)
- 마이페이지(검사/훈련 기록, 주문내역: 로컬 저장 데모)
- 문의하기(로컬 저장 데모)
- SEO 기본(robots, sitemap, 메타)

## 주의

이 저장소의 인증/권한/결제/데이터저장은 **프로덕션 보안 요구사항을 만족하지 않는 데모 구현**입니다. 실제 운영 환경에서는 PRD에 명시된 것처럼 DB(PostgreSQL), NextAuth/커스텀 인증, PG 연동, 관리자 CMS 등을 통해 교체/확장해야 합니다.
