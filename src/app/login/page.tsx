import type { Metadata } from "next";
import Link from "next/link";
import { LoginPageClient } from "@/components/auth/LoginPageClient";

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
  searchParams?: { next?: string | string[]; error?: string | string[]; registered?: string | string[] };
}) {
  const next = first(searchParams?.next) || "/";
  const error = first(searchParams?.error);
  const registered = first(searchParams?.registered);

  return (
    <div className="max-w-xl space-y-6">
      {registered ? (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-green-900">
          회원가입이 완료되었습니다. 로그인해주세요.
        </div>
      ) : null}
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-900">
          {error}
        </div>
      ) : null}

      <LoginPageClient next={next} />

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
        <div className="font-semibold">테스트 계정</div>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>관리자: admin@btc.kr / admin1234</li>
          <li>일반회원: member@test.com / member1234</li>
          <li>전문가: expert@test.com / expert1234</li>
        </ul>
      </div>
    </div>
  );
}
