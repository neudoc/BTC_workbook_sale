import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { getSession } from "@/lib/session";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  const session = getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "파일을 선택해주세요." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "JPG, PNG, GIF, WebP 파일만 업로드 가능합니다." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "파일 크기는 5MB 이하여야 합니다." },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = path.extname(file.name) || ".jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const filepath = path.join(process.cwd(), "public", "uploads", "blog", filename);

  await writeFile(filepath, buffer);

  return NextResponse.json({ url: `/uploads/blog/${filename}` });
}
