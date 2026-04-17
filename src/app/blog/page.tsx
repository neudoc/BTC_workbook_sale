import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle } from "@/components/ui/PageTitle";
import { posts } from "@/lib/data/posts";
import { first } from "@/lib/url";

export const metadata: Metadata = {
  title: "블로그",
  description: "뇌건강, 인지 예비능, 보호자 팁 등 콘텐츠"
};

const categories = ["뇌건강", "인지 예비능", "보호자", "훈련 팁"] as const;

export default function BlogPage({
  searchParams
}: {
  searchParams?: { q?: string | string[]; category?: string | string[] };
}) {
  const q = first(searchParams?.q).trim();
  const category = first(searchParams?.category).trim();

  const filtered = posts.filter((p) => {
    const okCategory = category ? p.category === category : true;
    const okQuery = q
      ? (p.title + " " + p.excerpt + " " + p.content.join(" ")).includes(q)
      : true;
    return okCategory && okQuery;
  });

  return (
    <div className="space-y-6">
      <PageTitle title="블로그" description="검색 유입을 위한 콘텐츠 허브(데모)입니다." />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        <form className="flex flex-col sm:flex-row gap-3" action="/blog" method="get">
          <input
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3"
            name="q"
            defaultValue={q}
            placeholder="검색어를 입력하세요 (예: 인지 예비능)"
          />
          <select
            className="rounded-xl border border-slate-200 px-4 py-3"
            name="category"
            defaultValue={category}
          >
            <option value="">전체 카테고리</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            className="rounded-xl bg-slate-900 px-5 py-3 font-medium text-white hover:bg-black"
            type="submit"
          >
            검색
          </button>
        </form>
        <div className="text-sm text-slate-600">
          결과 {filtered.length}개 · 키워드 예시: 치매 예방, 뇌건강, 인지훈련, 보호자 교육
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-brand-200 hover:bg-brand-50/30 transition-colors"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-slate-600">{p.category}</div>
              <div className="text-sm text-slate-600">{p.date}</div>
            </div>
            <div className="mt-2 text-lg font-semibold">{p.title}</div>
            <div className="mt-2 text-slate-700">{p.excerpt}</div>
            <div className="mt-4 text-sm text-brand-800 underline">읽기</div>
          </Link>
        ))}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700">
            검색 결과가 없습니다.
          </div>
        ) : null}
      </div>
    </div>
  );
}

