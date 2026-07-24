import "dotenv/config";
import { hashSync } from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPw = hashSync("admin1234", 10);
  await prisma.user.upsert({
    where: { email: "admin@btc.kr" },
    update: {},
    create: { email: "admin@btc.kr", name: "관리자", passwordHash: adminPw, role: "admin" }
  });

  const memberPw = hashSync("member1234", 10);
  await prisma.user.upsert({
    where: { email: "member@test.com" },
    update: {},
    create: { email: "member@test.com", name: "일반회원", passwordHash: memberPw, role: "member" }
  });

  const expertPw = hashSync("expert1234", 10);
  await prisma.user.upsert({
    where: { email: "expert@test.com" },
    update: {},
    create: { email: "expert@test.com", name: "전문가", passwordHash: expertPw, role: "expert" }
  });

  // BTC 1% 인지학습지 — 레벨(예방/관리/돌봄) × 계절(봄·여름·가을·겨울) 12 SKU
  const levels = [
    { n: 1, label: "예방", stage: "Level 1 예방 (Prevention)", target: "치매 전 단계 / 정상군", feature: "고난이도 인지훈련 + 재미 요소", diff: "상" },
    { n: 2, label: "관리", stage: "Level 2 관리 (MCI · Early Stage)", target: "경도인지장애(MCI) / 초기 단계", feature: "집중력 강화, 회상요법", diff: "중" },
    { n: 3, label: "돌봄", stage: "Level 3 돌봄 (Moderate · Care)", target: "중증도 인지저하", feature: "감각자극, 간단한 과제, 정서적 안정", diff: "하" },
  ];
  const seasons = [
    { key: "spring", kr: "봄", books: "교재 1·2·3권", price: 150000, extra: "학습교구 Set(16종) + 첫만남 TEST용 학습지", gyogu: "포함" },
    { key: "summer", kr: "여름", books: "교재 4·5·6권", price: 75000, extra: "증정본 「치매」(중앙대병원 신경과 윤영철 교수)", gyogu: "미포함" },
    { key: "fall", kr: "가을", books: "교재 7·8·9권", price: 75000, extra: "증정본 「치매에 관한 79가지 궁금증 해결집」", gyogu: "미포함" },
    { key: "winter", kr: "겨울", books: "교재 10·11·12권", price: 75000, extra: "증정본 「메모리200」(국내 유일 BNT 학습서)", gyogu: "미포함" },
  ];

  let order = 0;
  for (const lv of levels) {
    for (const s of seasons) {
      const description =
        "의사가 만들고 신경과 교수들이 감수한 노화·치매 예방 전문 인지학습 프로그램입니다.\n\n" +
        `■ 단계: ${lv.stage} (난이도 ${lv.diff})\n` +
        `■ 대상: ${lv.target}\n` +
        `■ 특징: ${lv.feature}\n\n` +
        `[${s.kr} 세트 구성]\n` +
        `· ${s.books} (본문 각 36p)\n` +
        `· 학습지도사 지침서\n` +
        `· ${s.extra}\n` +
        `· 학습교구: ${s.gyogu}\n\n` +
        "[전체 프로그램] 학습지는 총 12권으로 봄·여름·가을·겨울 4세트입니다.\n" +
        "· 봄 세트 150,000원 (학습교구 Set 포함)\n" +
        "· 여름·가을·겨울 세트 각 75,000원 (학습교구 미포함)\n" +
        "· 4세트 전체 합계 375,000원";

      const data = {
        slug: `level${lv.n}-${s.key}`,
        name: `레벨 ${lv.n} ${s.kr} 세트 (${s.books})`,
        shortDescription: `${s.books} + 지침서 + ${s.extra} · 학습교구 ${s.gyogu} · ${lv.label}(난이도 ${lv.diff})`,
        description,
        price: s.price,
        category: `레벨 ${lv.n} · ${lv.label}`,
        stock: 100,
        thumbnailUrl: `/images/products/textbook-level${lv.n}-${s.key}.png`,
        tags: `레벨${lv.n},${lv.label},${s.kr},${s.gyogu === "포함" ? "교구포함" : "교구미포함"}`,
        isActive: true,
        createdAt: new Date(Date.UTC(2026, 6, 23, 0, 0, order++)),
      };

      await prisma.product.upsert({ where: { slug: data.slug }, update: data, create: data });
    }
  }

  const posts = [
    {
      slug: "cognitive-reserve-basics",
      title: "인지 예비능, 쉽게 이해하기",
      excerpt: "인지 예비능은 뇌가 변화에 적응하고 기능을 유지하도록 돕는 '여유 능력'으로 설명할 수 있어요.",
      content: "인지 예비능은 한 문장으로 말하면 '뇌가 다양한 상황에 대응할 수 있는 여유'입니다.\n\n학습, 운동, 사회적 활동, 수면, 영양 같은 생활습관은 뇌건강을 지지하는 기반이 될 수 있습니다.\n\n가장 중요한 것은 무리하지 않고, 꾸준히, 나에게 맞는 방식으로 실천하는 것입니다.\n\n이 글은 의료적 진단이나 치료 정보를 제공하지 않으며, 건강관리 참고용입니다.",
      category: "인지 예비능",
      tags: "인지예비능,뇌건강",
      authorId: 1,
      status: "published",
      publishedAt: new Date("2026-03-27")
    },
    {
      slug: "daily-brain-routine",
      title: "하루 10분 뇌건강 루틴 만들기",
      excerpt: "인지훈련은 '길게'보다 '자주'가 중요합니다. 짧은 루틴을 만드는 팁을 정리했습니다.",
      content: "시간을 크게 내기 어렵다면 10분 루틴부터 시작해보세요.\n\n예: 3분 스트레칭 → 5분 간단 퀴즈/게임 → 2분 기록(기분/컨디션).\n\n지나친 경쟁이나 무리한 목표는 오히려 지속을 방해할 수 있습니다.\n\n필요하면 가족과 함께 '같이 하는 약속'을 만드는 것도 도움이 됩니다.",
      category: "뇌건강",
      tags: "뇌건강,루틴,인지훈련",
      authorId: 1,
      status: "published",
      publishedAt: new Date("2026-03-27")
    },
    {
      slug: "caregiver-communication",
      title: "보호자에게 도움이 되는 대화 방법 3가지",
      excerpt: "훈련만큼 중요한 것이 일상 대화입니다. 부담을 줄이고 관계를 지키는 대화 팁을 소개합니다.",
      content: "첫째, 정답을 강요하기보다 '과정'을 칭찬합니다.\n\n둘째, 질문은 짧게, 선택지는 2개 정도로 줄입니다.\n\n셋째, 감정이 먼저입니다. '왜 못해?'보다 '괜찮아, 같이 해보자'를 사용합니다.\n\n가족의 부담이 커질수록 도움을 요청하는 것도 중요합니다.",
      category: "보호자",
      tags: "보호자,대화,소통",
      authorId: 1,
      status: "published",
      publishedAt: new Date("2026-03-27")
    }
  ];

  for (const p of posts) {
    await prisma.blogPost.upsert({ where: { slug: p.slug }, update: {}, create: p });
  }

  const resources = [
    { title: "인지훈련 지도사 교육 매뉴얼", category: "교육자료", description: "지도사 과정 교육용 기본 매뉴얼입니다.", visibility: "expert_only" },
    { title: "인지평가 기록 양식", category: "평가양식", description: "대상자 인지평가 시 사용하는 기록 양식입니다.", visibility: "expert_only" },
    { title: "기관 운영 가이드", category: "운영가이드", description: "기관에서 프로그램 운영 시 참고하는 가이드입니다.", visibility: "expert_only" },
  ];

  for (const r of resources) {
    const exists = await prisma.expertResource.findFirst({ where: { title: r.title } });
    if (!exists) await prisma.expertResource.create({ data: r });
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
