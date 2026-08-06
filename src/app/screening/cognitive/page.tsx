import type { Metadata } from "next";
import Link from "next/link";
import { CognitiveTest } from "@/components/screening/CognitiveTest";

export const metadata: Metadata = {
  title: "간이인지검사",
  description: "기억력, 주의력, 언어 등 주요 인지 기능을 간단히 확인하는 검사(참고용)"
};

export default function CognitiveScreeningPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="text-sm text-slate-600">
        <Link className="hover:underline" href="/screening">인지검사</Link> / 간이인지검사
      </div>
      <CognitiveTest />
    </div>
  );
}
