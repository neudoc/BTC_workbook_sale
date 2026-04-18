import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "";
  const q = searchParams.get("q") || "";

  const where: Record<string, unknown> = { isActive: true };
  if (category) where.category = category;
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { shortDescription: { contains: q } },
      { tags: { contains: q } }
    ];
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const body = await request.json();
  const { name, slug, shortDescription, description, price, salePrice, category, stock, tags, thumbnailUrl } = body;

  if (!name || !slug || !price) {
    return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: { name, slug, shortDescription: shortDescription || "", description: description || "", price, salePrice: salePrice || null, category: category || "", stock: stock || 0, tags: tags || "", thumbnailUrl: thumbnailUrl || null }
  });

  return NextResponse.json(product, { status: 201 });
}
