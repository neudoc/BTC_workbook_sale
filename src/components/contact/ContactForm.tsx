"use client";

import { useState } from "react";

const inquiryTypes = [
  "교재 구매 문의",
  "기관 도입 문의",
  "인지학습지도사 문의",
  "제휴 및 강의 문의",
];

export function ContactForm() {
  const [type, setType] = useState(inquiryTypes[0]);
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
      body: JSON.stringify({ type, name, email, phone, message }),
    });

    if (res.ok) {
      setSubmitted(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "문의 접수에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }

    setLoading(false);
  }

  return (
    <form className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
      {submitted ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-900">
          문의가 접수되었습니다. 확인 후 빠르게 연락드리겠습니다.
        </div>
      ) : null}
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-900">
          {error}
        </div>
      ) : null}

      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-800" htmlFor="type">
          문의 유형
        </label>
        <select
          id="type"
          className="w-full"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {inquiryTypes.map((inquiryType) => (
            <option key={inquiryType} value={inquiryType}>
              {inquiryType}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-800" htmlFor="name">
            이름
          </label>
          <input
            id="name"
            className="w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="홍길동"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-800" htmlFor="phone">
            연락처
          </label>
          <input
            id="phone"
            className="w-full"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-0000-0000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-800" htmlFor="email">
          이메일
        </label>
        <input
          id="email"
          className="w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-800" htmlFor="message">
          문의 내용
        </label>
        <textarea
          id="message"
          className="min-h-40 w-full"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          placeholder="필요한 교재, 사용 목적, 기관명 또는 지도사 교육 관심 여부를 적어 주세요."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-brand-700 px-5 py-3 font-bold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "전송 중..." : "문의 보내기"}
      </button>
    </form>
  );
}
