export type BlogPost = {
  slug: string;
  title: string;
  category: "뇌건강" | "인지 예비능" | "보호자" | "훈련 팁";
  date: string; // YYYY-MM-DD
  excerpt: string;
  content: string[];
};

export const posts: BlogPost[] = [
  {
    slug: "cognitive-reserve-basics",
    title: "인지 예비능, 쉽게 이해하기",
    category: "인지 예비능",
    date: "2026-03-27",
    excerpt:
      "인지 예비능은 뇌가 변화에 적응하고 기능을 유지하도록 돕는 ‘여유 능력’으로 설명할 수 있어요.",
    content: [
      "인지 예비능은 한 문장으로 말하면 ‘뇌가 다양한 상황에 대응할 수 있는 여유’입니다.",
      "학습, 운동, 사회적 활동, 수면, 영양 같은 생활습관은 뇌건강을 지지하는 기반이 될 수 있습니다.",
      "가장 중요한 것은 무리하지 않고, 꾸준히, 나에게 맞는 방식으로 실천하는 것입니다.",
      "이 글은 의료적 진단이나 치료 정보를 제공하지 않으며, 건강관리 참고용입니다."
    ]
  },
  {
    slug: "daily-brain-routine",
    title: "하루 10분 뇌건강 루틴 만들기",
    category: "뇌건강",
    date: "2026-03-27",
    excerpt:
      "인지훈련은 ‘길게’보다 ‘자주’가 중요합니다. 짧은 루틴을 만드는 팁을 정리했습니다.",
    content: [
      "시간을 크게 내기 어렵다면 10분 루틴부터 시작해보세요.",
      "예: 3분 스트레칭 → 5분 간단 퀴즈/게임 → 2분 기록(기분/컨디션).",
      "지나친 경쟁이나 무리한 목표는 오히려 지속을 방해할 수 있습니다.",
      "필요하면 가족과 함께 ‘같이 하는 약속’을 만드는 것도 도움이 됩니다."
    ]
  },
  {
    slug: "caregiver-communication",
    title: "보호자에게 도움이 되는 대화 방법 3가지",
    category: "보호자",
    date: "2026-03-27",
    excerpt:
      "훈련만큼 중요한 것이 일상 대화입니다. 부담을 줄이고 관계를 지키는 대화 팁을 소개합니다.",
    content: [
      "첫째, 정답을 강요하기보다 ‘과정’을 칭찬합니다.",
      "둘째, 질문은 짧게, 선택지는 2개 정도로 줄입니다.",
      "셋째, 감정이 먼저입니다. ‘왜 못해?’보다 ‘괜찮아, 같이 해보자’를 사용합니다.",
      "가족의 부담이 커질수록 도움을 요청하는 것도 중요합니다."
    ]
  }
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug) ?? null;
}

