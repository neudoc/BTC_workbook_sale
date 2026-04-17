import type { Metadata } from "next";
import Link from "next/link";
import { MocaTest } from "@/components/screening/MocaTest";

export const metadata: Metadata = {
  title: "MoCA 스타일 검사",
  description: "시공간 기능, 집중력, 기억력, 언어 능력 등을 평가하는 인지 검사(참고용)"
};

export default function MocaScreeningPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="text-sm text-slate-600">
        <Link className="hover:underline" href="/screening">인지검사</Link> / MoCA 스타일 검사
      </div>
      <MocaTest />
    </div>
  );
}
