"use client";

import { useEffect, useState } from "react";

interface Inquiry {
  id: number;
  type: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  answer: string | null;
  createdAt: string;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [answeringId, setAnsweringId] = useState<number | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function load() {
    fetch("/api/admin/inquiries")
      .then((r) => r.json())
      .then((d) => setInquiries(Array.isArray(d) ? d : []))
      .catch(() => setInquiries([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function submitAnswer(id: number) {
    if (!answerText.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, answer: answerText })
      });
      if (res.ok) {
        setAnsweringId(null);
        setAnswerText("");
        load();
      } else {
        alert("답변 등록에 실패했습니다.");
      }
    } catch {
      alert("답변 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">문의 관리</h1>
        <p className="mt-1 text-slate-600">고객 문의에 답변을 작성합니다.</p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">로딩 중...</div>
      ) : inquiries.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">문의 내역이 없습니다.</div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div key={inq.id} className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{inq.type}</span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${inq.status === "answered" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                      {inq.status === "answered" ? "답변 완료" : "미답변"}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    {inq.name} ({inq.email}) {inq.phone ? `· ${inq.phone}` : ""} · {new Date(inq.createdAt).toLocaleDateString("ko-KR")}
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-wrap">{inq.message}</div>

              {inq.answer && answeringId !== inq.id ? (
                <div className="rounded-xl bg-brand-50 p-4 text-sm text-slate-700 whitespace-pre-wrap">
                  <div className="mb-1 text-xs font-medium text-brand-800">답변</div>
                  {inq.answer}
                </div>
              ) : null}

              {answeringId === inq.id ? (
                <div className="space-y-3">
                  <textarea
                    rows={4}
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder="답변을 입력하세요..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-2"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => submitAnswer(inq.id)} disabled={submitting || !answerText.trim()} className="inline-flex items-center justify-center rounded-xl bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-50">
                      {submitting ? "등록 중..." : "답변 등록"}
                    </button>
                    <button onClick={() => { setAnsweringId(null); setAnswerText(""); }} className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => { setAnsweringId(inq.id); setAnswerText(inq.answer || ""); }} className="inline-flex items-center justify-center rounded-xl bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800">
                  {inq.answer ? "답변 수정" : "답변 작성"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
