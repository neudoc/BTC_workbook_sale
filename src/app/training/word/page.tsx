import type { Metadata } from "next";
import Link from "next/link";
import { WordGame } from "@/components/training/WordGame";

export const metadata: Metadata = {
  title: "인지훈련 - 단어연상",
  description: "언어 및 의미기억을 훈련하는 단어 연상 과제(체험용)"
};

export default function WordTrainingPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="text-sm text-slate-600">
        <Link className="hover:underline" href="/training">인지훈련</Link> / 단어연상
      </div>
      <WordGame />
    </div>
  );
}
