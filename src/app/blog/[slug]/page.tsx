import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/data/posts";

export function generateMetadata({
  params
}: {
  params: { slug: string };
}): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: "블로그" };
  return {
    title: post.title,
    description: post.excerpt
  };
}

export default function BlogDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const post = getPost(params.slug);
  if (!post) return notFound();

  return (
    <article className="max-w-3xl space-y-6">
      <div className="text-sm text-slate-600">
        <Link className="hover:underline" href="/blog">
          블로그
        </Link>{" "}
        / {post.title}
      </div>

      <header className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2">
        <div className="text-sm text-slate-600">{post.category}</div>
        <h1 className="text-2xl font-semibold">{post.title}</h1>
        <div className="text-sm text-slate-600">{post.date}</div>
        <p className="mt-2 text-slate-700">{post.excerpt}</p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        {post.content.map((p, idx) => (
          <p key={idx} className="text-slate-800">
            {p}
          </p>
        ))}
      </section>

      <section className="rounded-2xl border border-brand-100 bg-brand-50 p-6">
        <div className="font-semibold">다음으로</div>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link className="underline" href="/training">
            인지훈련 체험하기
          </Link>
          <Link className="underline" href="/screening">
            간단 자가점검
          </Link>
          <Link className="underline" href="/shop">
            관련 상품 보기
          </Link>
        </div>
        <p className="mt-3 text-sm text-slate-700">
          안내: 본 콘텐츠는 건강관리 참고용이며 의료적 진단/치료를 대체하지 않습니다.
        </p>
      </section>
    </article>
  );
}

