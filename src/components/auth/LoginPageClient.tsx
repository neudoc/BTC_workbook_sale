"use client";

import { useState } from "react";
import Link from "next/link";

export function LoginPageClient({ next }: { next: string }) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const body = {
      email: form.get("email") as string,
      name: form.get("name") as string,
      password: form.get("password") as string
    };
    const confirm = form.get("confirm") as string;
    if (body.password !== confirm) {
      setError("비밀번호가 일치하지 않습니다.");
      setLoading(false);
      return;
    }
    if (body.password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      setLoading(false);
      return;
    }
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      window.location.href = `/login?registered=1&next=${encodeURIComponent(next)}`;
    } else {
      const data = await res.json();
      setError(data.error || "회원가입에 실패했습니다.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex rounded-2xl border border-slate-200 overflow-hidden">
        <button
          type="button"
          onClick={() => { setTab("login"); setError(""); }}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            tab === "login" ? "bg-brand-700 text-white" : "bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          로그인
        </button>
        <button
          type="button"
          onClick={() => { setTab("register"); setError(""); }}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            tab === "register" ? "bg-brand-700 text-white" : "bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          회원가입
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900">{error}</div>
      ) : null}

      {tab === "login" ? (
        <form action="/api/auth/login" method="post" className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <input type="hidden" name="next" value={next} />
          <div className="space-y-2">
            <label className="block text-sm font-medium">이메일</label>
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3" name="email" type="email" placeholder="you@example.com" required />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">비밀번호</label>
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3" name="password" type="password" placeholder="비밀번호" required />
          </div>
          <button type="submit" className="w-full rounded-xl bg-brand-700 px-5 py-3 font-medium text-white hover:bg-brand-800">
            로그인
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">이름</label>
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3" name="name" placeholder="예: 홍길동" required />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">이메일</label>
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3" name="email" type="email" placeholder="you@example.com" required />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">비밀번호</label>
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3" name="password" type="password" placeholder="6자 이상" required />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">비밀번호 확인</label>
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3" name="confirm" type="password" placeholder="비밀번호 확인" required />
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-brand-700 px-5 py-3 font-medium text-white hover:bg-brand-800 disabled:opacity-50">
            {loading ? "처리 중..." : "회원가입"}
          </button>
        </form>
      )}
    </div>
  );
}
