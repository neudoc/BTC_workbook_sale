import { hashSync } from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPw = hashSync("admin1234", 10);
  await prisma.user.upsert({
    where: { email: "admin@btc.kr" },
    update: {},
    create: {
      email: "admin@btc.kr",
      name: "관리자",
      passwordHash: adminPw,
      role: "admin"
    }
  });

  const memberPw = hashSync("member1234", 10);
  await prisma.user.upsert({
    where: { email: "member@test.com" },
    update: {},
    create: {
      email: "member@test.com",
      name: "일반회원",
      passwordHash: memberPw,
      role: "member"
    }
  });

  const expertPw = hashSync("expert1234", 10);
  await prisma.user.upsert({
    where: { email: "expert@test.com" },
    update: {},
    create: {
      email: "expert@test.com",
      name: "전문가",
      passwordHash: expertPw,
      role: "expert"
    }
  });

  const products = [
    {
      slug: "workbook-basic",
      name: "인지훈련 워크북 (기초)",
      shortDescription: "집에서 따라할 수 있는 기초 인지훈련 문제 모음.",
      description: "기초 수준의 인지훈련 문제를 체계적으로 구성한 워크북입니다. 기억력, 주의집중력, 실행기능 등 다양한 인지 영역을 골고루 훈련할 수 있도록 설계되었습니다.",
      price: 18000,
      category: "워크북",
      stock: 100,
      tags: "워크북,초급,가정용"
    },
    {
      slug: "workbook-advanced",
      name: "인지훈련 워크북 (심화)",
      shortDescription: "조금 더 다양한 난이도의 훈련 문제로 구성.",
      description: "심화 수준의 인지훈련 문제로 구성된 워크북입니다. 기초 워크북을 마친 분들이 더 높은 난이도로 도전할 수 있도록 설계되었습니다.",
      price: 22000,
      category: "워크북",
      stock: 80,
      tags: "워크북,중급,가정용"
    },
    {
      slug: "training-cards",
      name: "인지활동 카드 세트",
      shortDescription: "대화·회상·주의집중을 돕는 활동 카드 60장.",
      description: "대화, 회상, 주의집중을 돕는 60장의 활동 카드 세트입니다. 가정이나 기관에서 다양하게 활용할 수 있습니다.",
      price: 29000,
      category: "교구",
      stock: 50,
      tags: "교구,카드,활동"
    },
    {
      slug: "puzzle-set",
      name: "두뇌 퍼즐 세트",
      shortDescription: "공간지각/문제해결을 자극하는 퍼즐 구성(초·중 난이도).",
      description: "공간지각과 문제해결 능력을 자극하는 퍼즐 세트입니다. 초급과 중급 난이도로 구성되어 있어 단계적으로 도전할 수 있습니다.",
      price: 26000,
      category: "교구",
      stock: 60,
      tags: "교구,퍼즐"
    }
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p
    });
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
    await prisma.blogPost.upsert({
      where: { slug: p.slug },
      update: {},
      create: p
    });
  }

  const resources = [
    {
      title: "인지훈련 지도사 교육 매뉴얼",
      category: "교육자료",
      description: "지도사 과정 교육용 기본 매뉴얼입니다.",
      visibility: "expert_only"
    },
    {
      title: "인지평가 기록 양식",
      category: "평가양식",
      description: "대상자 인지평가 시 사용하는 기록 양식입니다.",
      visibility: "expert_only"
    },
    {
      title: "기관 운영 가이드",
      category: "운영가이드",
      description: "기관에서 프로그램 운영 시 참고하는 가이드입니다.",
      visibility: "expert_only"
    }
  ];

  for (const r of resources) {
    await prisma.expertResource.create({ data: r });
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
