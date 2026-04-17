import type { Metadata } from "next";
import Link from "next/link";
import { NumberSequenceGame } from "@/components/training/NumberSequenceGame";

export const metadata: Metadata = {
  title: "인지훈련 - 숫자 순서 기억",
  description: "순서를 기억해 누르는 훈련(체험용)"
};

export default function SequenceTrainingPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="text-sm text-slate-600">
        <Link className="hover:underline" href="/training">
          인지훈련
        </Link>{" "}
        / 숫자 순서 기억
      </div>
      <NumberSequenceGame />
    </div>
  );
}

