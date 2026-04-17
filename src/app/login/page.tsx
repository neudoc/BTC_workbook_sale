import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle } from "@/components/ui/PageTitle";

export const metadata: Metadata = {
  title: "로그인",
  robots: { index: false, follow: false }
};

function first(value: string | string[] | undefined) {
  if (!value) return "";
  return Array.isArray(value) ? value[0] : value;
}

export default function LoginPage({
  searchParams
}: {
  searchParams?: { next?: string | string[]; error?: string | string[] };
}) {
  const next = first(searchParams?.next) || "/";
  const error = first(searchParams?.error);

  return (
    <div className="max-w-xl space-y-6">
      <PageTitle title="로그인 / 신청" description="데모 로그인(쿠키 기반)입니다." />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-900">
          {error}
        </div>
      ) : null}

      <form
        action="/api/auth/login"
        method="post"
        className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4"
      >
        <input type="hidden" name="next" value={next} />

        <div className="space-y-2">
          <label className="block text-sm font-medium">이름</label>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
            name="name"
            placeholder="예: 홍길동"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">이메일</label>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <fieldset className="space-y-2">
          <legend className="block text-sm font-medium">유형 선택</legend>
          <div className="grid gap-2">
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
              <input type="radio" name="role" value="member" defaultChecked />
              <div>
                <div className="font-medium">일반 회원</div>
                <div className="text-sm text-slate-600">
                  마이페이지에 검사/훈련/주문 기록을 저장합니다(브라우저 로컬 저장).
                </div>
              </div>
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
              <input type="radio" name="role" value="expert_pending" />
              <div>
                <div className="font-medium">전문가 신청(대기)</div>
                <div className="text-sm text-slate-600">
                  전문가센터 접근은 승인 후 가능합니다(프로토타입에서는 단순화).
                </div>
              </div>
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
              <input type="radio" name="role" value="expert" />
              <div>
                <div className="font-medium">승인된 전문가(데모)</div>
                <div className="text-sm text-slate-600">
                  전문가센터를 바로 확인하기 위한 데모 옵션입니다.
                </div>
              </div>
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
              <input type="radio" name="role" value="admin" />
              <div>
                <div className="font-medium">관리자</div>
                <div className="text-sm text-slate-600">
                  환경변수 <code>ADMIN_INVITE_CODE</code>가 설정된 경우에만 로그인됩니다.
                </div>
              </div>
            </label>
          </div>
        </fieldset>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            관리자 코드(선택)
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
            name="adminCode"
            placeholder="관리자 코드"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-brand-700 px-5 py-3 font-medium text-white hover:bg-brand-800"
        >
          계속하기
        </button>

        <p className="text-xs text-slate-600">
          운영 환경에서는 DB/인증/승인 프로세스/PG 연동을 통해 보안·정책을 충족해야 합니다.
        </p>
      </form>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
        <div className="font-semibold">권한 안내</div>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>
            일반 회원: <Link className="underline" href="/mypage">마이페이지</Link> 이용 가능
          </li>
          <li>
            전문가: <Link className="underline" href="/expert">전문가센터</Link> 이용 가능(승인 후)
          </li>
          <li>관리자: 관리자 페이지 접근(데모)</li>
        </ul>
      </div>
    </div>
  );
}
