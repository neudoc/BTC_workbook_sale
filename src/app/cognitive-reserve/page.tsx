import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle } from "@/components/ui/PageTitle";

export const metadata: Metadata = {
  title: "인지 예비능",
  description: "인지 예비능 개념과 뇌건강 관리의 핵심 포인트를 소개합니다."
};

export default function CognitiveReservePage() {
  return (
    <div className="space-y-8">
      <PageTitle
        title="인지 예비능"
        description="인지 예비능은 뇌가 변화에 적응하고 기능을 유지하도록 돕는 '여유 능력'으로 이해할 수 있습니다."
      />

      <section className="rounded-2xl border border-slate-200 p-6 bg-white space-y-4">
        <h2 className="text-lg font-semibold">왜 중요한가요?</h2>
        <ul className="list-disc pl-5 text-slate-700 space-y-2">
          <li>일상 속 인지 건강: 기억력, 집중력, 사고력 같은 뇌 기능을 더 오래 건강하게 유지할 수 있습니다.</li>
          <li>뇌 건강의 토대: 공부, 일, 취미생활 같은 일상적인 활동들이 뇌를 강하게 만들어줍니다.</li>
          <li>나이 들어서도 똑똑하게: 세월이 흘러도 기억력과 판단력을 잃지 않고 활기찬 일상을 누릴 수 있습니다.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-brand-100 p-6 bg-brand-50 space-y-3">
        <h2 className="text-lg font-semibold">지금 시작해보기</h2>
        <p className="text-slate-700">
          가볍게 시작할 수 있도록 무료 인지훈련과 간단 자가점검을 제공합니다.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link className="underline" href="/training">
            인지훈련 보러가기
          </Link>
          <Link className="underline" href="/screening">
            자가점검 보러가기
          </Link>
        </div>
      </section>
    </div>
  );
}
