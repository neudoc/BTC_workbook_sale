import type { Metadata } from "next";
import Link from "next/link";
import { NBackGame } from "@/components/training/NBackGame";

export const metadata: Metadata = {
  title: "인지훈련 - 숫자기억",
  description: "작업기억을 훈련하는 N-back 과제(체험용)"
};

export default function MemoryTrainingPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="text-sm text-slate-600">
        <Link className="hover:underline" href="/training">
          인지훈련
        </Link>{" "}
        / 숫자기억
      </div>
      <NBackGame />
    </div>
  );
}
