"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { courses } from "@/lib/data/courses";
import { enrollmentStorage } from "@/lib/storage";
import { makeId } from "@/lib/id";

function formatPrice(won: number) {
  return won.toLocaleString("ko-KR") + "원";
}

export function EnrollmentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId") ?? "";
  const course = courses.find((c) => c.id === courseId);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  if (!course) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="text-lg font-semibold">과정을 먼저 선택해주세요.</div>
        <a href="/education/courses" className="mt-3 inline-block text-brand-800 underline">
          교육과정 목록으로
        </a>
      </div>
    );
  }

  return (
    <form
      className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        enrollmentStorage.add({
          id: makeId("enrollment"),
          createdAt: new Date().toISOString(),
          courseId: course.id,
          courseTitle: course.title,
          buyerName: name || "신청자",
          buyerPhone: phone,
          buyerEmail: email,
          total: course.price,
          status: "confirmed"
        });
        router.push(`/education/enrollment/complete?courseId=${encodeURIComponent(course.id)}`);
      }}
    >
      <div className="rounded-2xl bg-brand-50 border border-brand-100 p-4">
        <div className="font-semibold">{course.title}</div>
        <div className="mt-1 text-sm text-slate-700">{course.duration} · {formatPrice(course.price)}</div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">이름</label>
        <input
          className="w-full rounded-xl border border-slate-200 px-4 py-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 홍길동"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">연락처</label>
        <input
          className="w-full rounded-xl border border-slate-200 px-4 py-3"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="예: 010-1234-5678"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">이메일</label>
        <input
          className="w-full rounded-xl border border-slate-200 px-4 py-3"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="예: example@email.com"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-brand-700 px-5 py-3 font-medium text-white hover:bg-brand-800"
      >
        수강신청 완료
      </button>

      <p className="text-xs text-slate-600">
        * 현재는 데모 신청입니다. 실제 결제는 PortOne 연동 후 적용됩니다.
      </p>
    </form>
  );
}
