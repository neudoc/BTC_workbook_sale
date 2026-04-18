import { NextResponse } from "next/server";
import { compareSync } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { Session } from "@/lib/session";

const COOKIE_NAME = "bt_session";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = (formData.get("email") as string)?.trim() || "";
  const password = (formData.get("password") as string) || "";
  const next = (formData.get("next") as string)?.trim() || "/";

  if (!email || !password) {
    return NextResponse.redirect(
      new URL(`/login?error=이메일과+비밀번호를+입력해+주세요`, request.url)
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.redirect(
      new URL(`/login?error=등록되지+않은+이메일입니다`, request.url)
    );
  }

  if (!compareSync(password, user.passwordHash)) {
    return NextResponse.redirect(
      new URL(`/login?error=비밀번호가+올바르지+않습니다`, request.url)
    );
  }

  const session: Session = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as Session["role"]
  };

  const response = NextResponse.redirect(new URL(next, request.url));
  response.cookies.set({
    name: COOKIE_NAME,
    value: encodeURIComponent(JSON.stringify(session)),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
  return response;
}
