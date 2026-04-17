import type { Metadata } from "next";
import Link from "next/link";
import { CognitiveTest } from "@/components/screening/CognitiveTest";

export const metadata: Metadata = {
  title: "인지종합검사",
  description: "기억력, 주의력, 언어능력 등을 평가하는 종합 인지 검사(참고용)"
};

export default function CognitiveScreeningPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="text-sm text-slate-600">
        <Link className="hover:underline" href="/screening">인지검사</Link> / 인지종합검사
      </div>
      <CognitiveTest />
    </div>
  );
}
