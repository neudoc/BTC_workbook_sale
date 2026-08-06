import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle } from "@/components/ui/PageTitle";

export const metadata: Metadata = {
  title: "두뇌 게임",
  description:
    "기억력, 주의력, 시지각을 가볍게 훈련하는 두뇌 게임입니다. 참고·체험용으로 누구나 무료로 이용할 수 있습니다.",
};

const games = [
  {
    href: "/games/game1_memory.html",
    thumb: "/images/games/game1.svg",
    title: "기억의 서랍",
    desc: "잠시 나타나는 물건들을 기억했다가 찾아냅니다.",
    domain: "기억력",
  },
  {
    href: "/games/game2_speed.html",
    thumb: "/images/games/game2.svg",
    title: "색깔 맞추기",
    desc: "글자의 뜻이 아닌 '색'을 빠르게 고릅니다. (스트룹 과제)",
    domain: "주의력 · 억제",
  },
  {
    href: "/games/game3_visual.html",
    thumb: "/images/games/game3.svg",
    title: "똑같은 그림자 찾기",
    desc: "검은 그림자와 같은 모양을 찾아 시지각을 훈련합니다.",
    domain: "시지각",
  },
  {
    href: "/games/game4_recall.html",
    thumb: "/images/games/game4.svg",
    title: "시각 기억 테스트",
    desc: "화면에 보인 그림의 위치와 순서를 기억해 봅니다.",
    domain: "시각 기억",
  },
  {
    href: "/games/game5_card.html",
    thumb: "/images/games/game5.svg",
    title: "카드 짝 맞추기",
    desc: "뒤집은 카드의 위치를 기억해 같은 짝을 찾습니다.",
    domain: "작업 기억",
  },
  {
    href: "/games/game6_focus.html",
    thumb: "/images/games/game6.svg",
    title: "집중력 플래시 챌린지",
    desc: "순간적으로 스치는 숫자를 기억해 그대로 입력합니다.",
    domain: "집중력",
  },
];

export default function GamesPage() {
  return (
    <div className="space-y-8">
      <PageTitle
        title="두뇌 게임"
        description="기억력·주의력·시지각을 가볍게 훈련하는 게임입니다. 부담 없이 하루 몇 분씩 즐겨 보세요."
      />

      <div className="rounded-[18px] border border-brand-200 bg-brand-50 p-5">
        <p className="text-sm leading-6 text-slate-700">
          게임은 <strong>참고·체험용</strong>이며 의학적 진단이나 치료를 대체하지
          않습니다. 점수에 얽매이기보다 <strong>꾸준히 즐기는 것</strong>이 더
          도움이 됩니다.
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          게임을 끝내면 결과가 <strong>인지훈련 기록</strong>에 저장되어{" "}
          <Link href="/mypage" className="font-semibold text-brand-800 underline">
            마이페이지
          </Link>
          에서 변화를 확인할 수 있습니다. 로그인하면 계정에 저장되어 다른 기기에서도
          이어서 볼 수 있습니다.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((g) => (
          <a
            key={g.href}
            href={g.href}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm transition hover:border-brand-300 hover:shadow-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={g.thumb}
              alt={`${g.title} 미리보기`}
              width={320}
              height={180}
              loading="lazy"
              className="aspect-[16/9] w-full border-b border-slate-100 bg-slate-50 object-cover"
            />
            <div className="flex flex-1 flex-col p-6">
            <span className="inline-flex w-fit items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-800">
              {g.domain}
            </span>
            <h2 className="mt-3 text-lg font-bold text-slate-950 transition group-hover:text-brand-700">
              {g.title}
            </h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{g.desc}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700">
              게임 시작 <span aria-hidden>→</span>
            </span>
            </div>
          </a>
        ))}
      </div>

      <p className="text-xs leading-6 text-slate-500">
        ※ 게임은 새 창에서 열립니다. 소리가 나올 수 있으니 필요하면 기기 음량을
        조절해 주세요.
      </p>
    </div>
  );
}
