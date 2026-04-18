import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(inquiries);
}

export async function PUT(request: Request) {
  const session = getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const body = await request.json();
  const { id, answer } = body;

  if (!id || !answer) {
    return NextResponse.json(
      { error: "id와 answer가 필요합니다." },
      { status: 400 }
    );
  }

  const inquiry = await prisma.inquiry.update({
    where: { id: Number(id) },
    data: {
      answer,
      status: "answered",
    },
  });

  return NextResponse.json(inquiry);
}
