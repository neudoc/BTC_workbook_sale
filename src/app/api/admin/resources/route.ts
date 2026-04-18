import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const resources = await prisma.expertResource.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(resources);
}

export async function POST(request: Request) {
  const session = getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const body = await request.json();
  const { title, category, description, fileUrl, content, visibility } = body;

  if (!title || !category) {
    return NextResponse.json(
      { error: "title과 category는 필수입니다." },
      { status: 400 }
    );
  }

  const resource = await prisma.expertResource.create({
    data: {
      title,
      category,
      description: description || "",
      fileUrl: fileUrl || null,
      content: content || null,
      visibility: visibility || "expert_only",
    },
  });

  return NextResponse.json(resource, { status: 201 });
}

export async function PUT(request: Request) {
  const session = getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const body = await request.json();
  const { id, title, category, description, fileUrl, content, visibility } = body;

  if (!id) {
    return NextResponse.json(
      { error: "id가 필요합니다." },
      { status: 400 }
    );
  }

  const existing = await prisma.expertResource.findUnique({ where: { id: Number(id) } });
  if (!existing) {
    return NextResponse.json(
      { error: "리소스를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  const data: Record<string, unknown> = {};
  if (title !== undefined) data.title = title;
  if (category !== undefined) data.category = category;
  if (description !== undefined) data.description = description;
  if (fileUrl !== undefined) data.fileUrl = fileUrl;
  if (content !== undefined) data.content = content;
  if (visibility !== undefined) data.visibility = visibility;

  const resource = await prisma.expertResource.update({
    where: { id: Number(id) },
    data,
  });

  return NextResponse.json(resource);
}

export async function DELETE(request: Request) {
  const session = getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const body = await request.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json(
      { error: "id가 필요합니다." },
      { status: 400 }
    );
  }

  await prisma.expertResource.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ message: "삭제되었습니다." });
}
