"use client";

import { useState } from "react";
import { inquiryStorage } from "@/lib/storage";
import { makeId } from "@/lib/id";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        inquiryStorage.add({
          id: makeId("inq"),
          createdAt: new Date().toISOString(),
          name: name || "문의자",
          email,
          message
        });
        setSubmitted(true);
        setMessage("");
      }}
    >
      {submitted ? (
        <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4 text-slate-800">
          문의가 접수되었습니다(로컬 저장 데모). 빠른 시일 내에 답변드리겠습니다.
        </div>
      ) : null}

      <div className="space-y-2">
        <label className="block text-sm font-medium">이름</label>
        <input
          className="w-full rounded-xl border border-slate-200 px-4 py-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 홍길동"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">이메일</label>
        <input
          className="w-full rounded-xl border border-slate-200 px-4 py-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">문의 내용</label>
        <textarea
          className="w-full min-h-40 rounded-xl border border-slate-200 px-4 py-3"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          placeholder="문의 내용을 입력해 주세요."
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-brand-700 px-5 py-3 font-medium text-white hover:bg-brand-800"
      >
        문의 보내기
      </button>

      <p className="text-xs text-slate-600">
        운영 환경에서는 개인정보처리방침과 동의 문구, 스팸 방지, 저장/보관 정책을 적용해야 합니다.
      </p>
    </form>
  );
}

