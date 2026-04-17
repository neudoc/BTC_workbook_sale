import { NextResponse } from "next/server";
import type { Role, Session } from "@/lib/session";

const COOKIE_NAME = "bt_session";

function first(value: FormDataEntryValue | null) {
  if (!value) return "";
  return typeof value === "string" ? value : "";
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = first(formData.get("email")).trim();
  const name = first(formData.get("name")).trim() || "사용자";
  const roleInput = first(formData.get("role")).trim();
  const next = first(formData.get("next")).trim();
  const adminCode = first(formData.get("adminCode")).trim();

  if (!email) {
    return NextResponse.redirect(new URL(`/login?error=이메일을+입력해+주세요`, request.url));
  }

  let role: Role | null = null;
  if (roleInput === "member") role = "member";
  if (roleInput === "expert_pending") role = "expert_pending";
  if (roleInput === "expert") role = "expert";

  if (roleInput === "admin") {
    const required = process.env.ADMIN_INVITE_CODE;
    if (!required) {
      return NextResponse.redirect(
        new URL(`/login?error=관리자+로그인은+비활성화되어+있습니다`, request.url)
      );
    }
    if (!adminCode || adminCode !== required) {
      return NextResponse.redirect(new URL(`/login?error=관리자+코드가+올바르지+않습니다`, request.url));
    }
    role = "admin";
  }

  if (!role) {
    return NextResponse.redirect(new URL(`/login?error=로그인+유형을+선택해+주세요`, request.url));
  }

  const session: Session = { email, name, role };

  const response = NextResponse.redirect(new URL(next || "/", request.url));
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
