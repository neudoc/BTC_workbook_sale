import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const posts = await prisma.blogPost.findMany({
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const session = getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const body = await request.json();
  const {
    slug,
    title,
    excerpt,
    content,
    category,
    tags,
    thumbnailUrl,
    status,
  } = body;

  if (!slug || !title || !content || !category) {
    return NextResponse.json(
      { error: "slug, title, content, category는 필수입니다." },
      { status: 400 }
    );
  }

  const isPublished = status === "published";

  const post = await prisma.blogPost.create({
    data: {
      slug,
      title,
      excerpt: excerpt || "",
      content,
      category,
      tags: tags || "",
      thumbnailUrl: thumbnailUrl || null,
      status: status || "draft",
      authorId: session.id,
      publishedAt: isPublished ? new Date() : null,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return NextResponse.json(post, { status: 201 });
}

export async function PUT(request: Request) {
  const session = getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const body = await request.json();
  const { id, slug, title, excerpt, content, category, tags, thumbnailUrl, status } = body;

  if (!id) {
    return NextResponse.json(
      { error: "id가 필요합니다." },
      { status: 400 }
    );
  }

  const existing = await prisma.blogPost.findUnique({ where: { id: Number(id) } });
  if (!existing) {
    return NextResponse.json(
      { error: "게시글을 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  const wasDraft = existing.status !== "published";
  const nowPublishing = status === "published";

  const data: Record<string, unknown> = {};
  if (slug !== undefined) data.slug = slug;
  if (title !== undefined) data.title = title;
  if (excerpt !== undefined) data.excerpt = excerpt;
  if (content !== undefined) data.content = content;
  if (category !== undefined) data.category = category;
  if (tags !== undefined) data.tags = tags;
  if (thumbnailUrl !== undefined) data.thumbnailUrl = thumbnailUrl;
  if (status !== undefined) data.status = status;
  if (wasDraft && nowPublishing) data.publishedAt = new Date();

  const post = await prisma.blogPost.update({
    where: { id: Number(id) },
    data,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return NextResponse.json(post);
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

  await prisma.blogPost.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ message: "삭제되었습니다." });
}
