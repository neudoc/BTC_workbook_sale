import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { type, name, email, phone, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "필수 항목을 입력해주세요." }, { status: 400 });
  }

  const inquiry = await prisma.inquiry.create({
    data: { type: type || "일반 문의", name, email, phone: phone || "", message }
  });

  return NextResponse.json(inquiry, { status: 201 });
}
