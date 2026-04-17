import type { Metadata } from "next";
import Link from "next/link";
import { StroopGame } from "@/components/training/StroopGame";

export const metadata: Metadata = {
  title: "인지훈련 - 색-단어 과제",
  description: "글자 색을 맞히는 집중 훈련(체험용)"
};

export default function StroopTrainingPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="text-sm text-slate-600">
        <Link className="hover:underline" href="/training">
          인지훈련
        </Link>{" "}
        / 색-단어 과제
      </div>
      <StroopGame />
    </div>
  );
}

