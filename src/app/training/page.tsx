import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle } from "@/components/ui/PageTitle";

export const metadata: Metadata = {
  title: "인지훈련",
  description: "무료 인지훈련(브라우저 체험)"
};

const games = [
  {
    href: "/training/reaction",
    title: "반응 속도",
    desc: "색이 바뀌면 눌러 반응 시간을 측정합니다."
  },
  {
    href: "/training/sequence",
    title: "숫자 순서 기억",
    desc: "표시된 순서를 따라 눌러 기억력/주의집중을 자극합니다."
  },
  {
    href: "/training/stroop",
    title: "색-단어 과제",
    desc: "단어의 의미가 아니라 ‘글자 색’을 선택하는 집중 훈련."
  },
  {
    href: "/training/memory",
    title: "숫자기억 (N-Back)",
    desc: "이전 숫자와 비교하는 작업기억 훈련."
  },
  {
    href: "/training/pattern",
    title: "패턴매칭",
    desc: "격자 패턴을 기억하고 재현하는 시공간 훈련."
  },
  {
    href: "/training/word",
    title: "단어연상",
    desc: "단어 짝을 기억하는 언어·의미기억 훈련."
  }
];

export default function TrainingPage() {
  return (
    <div className="space-y-6">
      <PageTitle
        title="인지훈련(무료 체험)"
        description="의료적 진단이 아닌 체험/참고용 훈련입니다. 무리하지 않고 즐겁게 진행하세요."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {games.map((g) => (
          <Link
            key={g.href}
            href={g.href}
            className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-brand-200 hover:bg-brand-50/30 transition-colors"
          >
            <div className="text-lg font-semibold">{g.title}</div>
            <div className="mt-2 text-slate-700">{g.desc}</div>
            <div className="mt-4 text-sm text-brand-800 underline">시작</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

