# Vercel 배포 가이드 (Neon Postgres)

이 프로젝트는 로컬 SQLite에서 **Neon Postgres**로 전환되어 Vercel에 배포할 수 있습니다.
아래 단계는 한 번만 설정하면 됩니다. (코드 준비는 완료된 상태)

## 1. Neon 데이터베이스 만들기
1. https://neon.tech 가입 후 프로젝트 생성 (region: 가까운 곳, 예: AWS Tokyo)
2. Dashboard → **Connection Details** → **Pooled connection** 문자열 복사
   (형식: `postgresql://USER:PASSWORD@ep-xxx-pooler.../DBNAME?sslmode=require`)

## 2. 로컬에서 스키마 생성 + 데이터 시드
프로젝트 폴더에서 (`.env` 파일에 아래 한 줄 추가 — 이 파일은 git에 올라가지 않음):

```
DATABASE_URL="위에서 복사한 Neon 연결 문자열"
```

그다음:

```bash
npm install
npx prisma db push     # Neon에 테이블 생성
npm run seed           # 상품 12종·블로그·관리자 계정 등 초기 데이터 입력
```

## 3. GitHub에 최신 코드 올리기
```bash
git add -A
git commit -m "Postgres 전환 및 Vercel 배포 준비"
git push
```

## 4. Vercel 배포
1. https://vercel.com 에 GitHub 계정으로 로그인
2. **Add New → Project** → 이 저장소(`BTC_workbook_sale`) 선택 → Import
3. **Environment Variables**에 추가:
   - Name: `DATABASE_URL`  /  Value: Neon Pooled 연결 문자열 (2단계와 동일)
4. **Deploy** 클릭 → 몇 분 후 `https://<프로젝트>.vercel.app` 주소 생성

이후 GitHub에 push할 때마다 Vercel이 자동으로 다시 배포합니다.

## 참고
- 관리자 로그인: `admin@btc.kr` / `admin1234` (배포 후 반드시 비밀번호 변경 권장)
- 상품/썸네일 이미지는 `public/images/`에 포함되어 함께 배포됩니다.
- `.env`(비밀정보), `dev.db`, `자료/`(교재 원본) 는 저장소에 올라가지 않습니다.
