import type { Metadata } from "next";
import Link from "next/link";
import { ReactionTimeGame } from "@/components/training/ReactionTimeGame";

export const metadata: Metadata = {
  title: "인지훈련 - 반응 속도",
  description: "반응 시간을 측정하는 간단한 훈련(체험용)"
};

export default function ReactionTrainingPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="text-sm text-slate-600">
        <Link className="hover:underline" href="/training">
          인지훈련
        </Link>{" "}
        / 반응 속도
      </div>
      <ReactionTimeGame />
    </div>
  );
}

