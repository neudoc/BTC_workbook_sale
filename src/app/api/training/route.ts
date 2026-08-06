import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

/** 로그인한 회원의 최근 인지훈련 기록 */
export async function GET() {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const records = await prisma.trainingRecord.findMany({
    where: { userId: session.id },
    orderBy: { playedAt: "desc" },
    take: 100,
  });

  return NextResponse.json(records);
}

/** 게임·훈련 결과 저장 (로그인 상태에서만) */
export async function POST(request: Request) {
  const session = getSession();
  if (!session) {
    // 비로그인 사용자는 기기(localStorage)에만 저장됩니다.
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const { gameType, score, duration, resultJson } = (body ?? {}) as {
    gameType?: unknown;
    score?: unknown;
    duration?: unknown;
    resultJson?: unknown;
  };

  if (typeof gameType !== "string" || !gameType.trim()) {
    return NextResponse.json({ error: "게임 정보가 필요합니다." }, { status: 400 });
  }

  const safeScore = Number.isFinite(Number(score)) ? Math.trunc(Number(score)) : 0;
  const safeDuration = Number.isFinite(Number(duration)) ? Math.trunc(Number(duration)) : 0;

  const record = await prisma.trainingRecord.create({
    data: {
      userId: session.id,
      gameType: gameType.trim().slice(0, 100),
      score: safeScore,
      duration: safeDuration,
      resultJson: typeof resultJson === "string" ? resultJson.slice(0, 2000) : null,
    },
  });

  return NextResponse.json(record, { status: 201 });
}
