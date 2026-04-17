import type { Metadata } from "next";
import Link from "next/link";
import { PatternGame } from "@/components/training/PatternGame";

export const metadata: Metadata = {
  title: "인지훈련 - 패턴매칭",
  description: "시공간 능력을 훈련하는 패턴 기억 과제(체험용)"
};

export default function PatternTrainingPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="text-sm text-slate-600">
        <Link className="hover:underline" href="/training">인지훈련</Link> / 패턴매칭
      </div>
      <PatternGame />
    </div>
  );
}
