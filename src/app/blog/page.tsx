import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageTitle } from "@/components/ui/PageTitle";
import { prisma } from "@/lib/prisma";
import { first } from "@/lib/url";

export const metadata: Metadata = {
  title: "블로그",
  description: "뇌건강, 인지 예비능, 보호자 팁 등 콘텐츠"
};

const categories = ["뇌건강", "인지 예비능", "보호자", "훈련 팁"] as const;

export default async function BlogPage({
  searchParams
}: {
  searchParams?: { q?: string | string[]; category?: string | string[] };
}) {
  const q = first(searchParams?.q).trim();
  const category = first(searchParams?.category).trim();

  const where: Record<string, unknown> = { status: "published" };
  if (category) where.category = category;
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { excerpt: { contains: q } },
      { content: { contains: q } }
    ];
  }

  const posts = await prisma.blogPost.findMany({
    where,
    orderBy: { publishedAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <PageTitle title="블로그" description="뇌건강과 인지 예비능에 관한 유익한 정보를 만나보세요." />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        <form className="flex flex-col sm:flex-row gap-3" action="/blog" method="get">
          <input
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3"
            name="q"
            defaultValue={q}
            placeholder="검색어를 입력하세요 (예: 인지 예비능)"
          />
          <select className="rounded-xl border border-slate-200 px-4 py-3" name="category" defaultValue={category}>
            <option value="">전체 카테고리</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button className="rounded-xl bg-slate-900 px-5 py-3 font-medium text-white hover:bg-black" type="submit">
            검색
          </button>
        </form>
        <div className="text-sm text-slate-600">
          결과 {posts.length}개
        </div>
      </div>

      <div className="grid gap-4">
        {posts.map((p) => (
          <Link
            key={p.id}
            href={`/blog/${p.slug}`}
            className="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-brand-200 hover:bg-brand-50/30 transition-colors"
          >
            <div className="flex">
              {p.thumbnailUrl && (
                <div className="relative h-auto w-32 shrink-0 sm:w-40">
                  <Image
                    src={p.thumbnailUrl}
                    alt={p.title}
                    width={160}
                    height={120}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-slate-600">{p.category}</div>
                  <div className="text-sm text-slate-600">
                    {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("ko-KR") : ""}
                  </div>
                </div>
                <div className="mt-2 text-lg font-semibold">{p.title}</div>
                <div className="mt-2 text-slate-700">{p.excerpt}</div>
                <div className="mt-4 text-sm text-brand-800 underline">읽기</div>
              </div>
            </div>
          </Link>
        ))}
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700">
            검색 결과가 없습니다.
          </div>
        ) : null}
      </div>
    </div>
  );
}
