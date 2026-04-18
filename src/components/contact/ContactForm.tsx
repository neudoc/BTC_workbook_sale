"use client";

import { useState } from "react";

export function ContactForm() {
  const [type, setType] = useState("일반 문의");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, name, email, phone, message })
    });
    if (res.ok) {
      setSubmitted(true);
      setMessage("");
    } else {
      const data = await res.json();
      setError(data.error || "문의 접수에 실패했습니다.");
    }
    setLoading(false);
  }

  return (
    <form className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4" onSubmit={handleSubmit}>
      {submitted ? (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-green-900">
          문의가 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.
        </div>
      ) : null}
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900">{error}</div>
      ) : null}

      <div className="space-y-2">
        <label className="block text-sm font-medium">문의 유형</label>
        <select
          className="w-full rounded-xl border border-slate-200 px-4 py-3"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="일반 문의">일반 문의</option>
          <option value="제휴 문의">제휴 문의</option>
          <option value="교육 문의">교육 문의</option>
          <option value="전문가 신청">전문가 신청</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">이름</label>
        <input className="w-full rounded-xl border border-slate-200 px-4 py-3" value={name} onChange={(e) => setName(e.target.value)} placeholder="예: 홍길동" required />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">이메일</label>
        <input className="w-full rounded-xl border border-slate-200 px-4 py-3" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@example.com" />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">연락처</label>
        <input className="w-full rounded-xl border border-slate-200 px-4 py-3" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">문의 내용</label>
        <textarea className="w-full min-h-40 rounded-xl border border-slate-200 px-4 py-3" value={message} onChange={(e) => setMessage(e.target.value)} required placeholder="문의 내용을 입력해 주세요." />
      </div>

      <button type="submit" disabled={loading} className="w-full rounded-xl bg-brand-700 px-5 py-3 font-medium text-white hover:bg-brand-800 disabled:opacity-50">
        {loading ? "전송 중..." : "문의 보내기"}
      </button>
    </form>
  );
}
