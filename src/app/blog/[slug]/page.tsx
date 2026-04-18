import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) return { title: "블로그" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, status: "published" }
  });
  if (!post) return notFound();

  return (
    <article className="max-w-3xl space-y-6">
      <div className="text-sm text-slate-600">
        <Link className="hover:underline" href="/blog">블로그</Link> / {post.title}
      </div>

      <header className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2">
        {post.thumbnailUrl && (
          <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl sm:h-64">
            <Image
              src={post.thumbnailUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        <div className="text-sm text-slate-600">{post.category}</div>
        <h1 className="text-2xl font-semibold">{post.title}</h1>
        <div className="text-sm text-slate-600">
          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("ko-KR") : ""}
        </div>
        <p className="mt-2 text-slate-700">{post.excerpt}</p>
        {post.tags ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {post.tags.split(",").filter(Boolean).map((t) => (
              <span key={t} className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm">
                {t.trim()}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="text-slate-800 whitespace-pre-line leading-relaxed">{post.content}</div>
      </section>

      <section className="rounded-2xl border border-brand-100 bg-brand-50 p-6">
        <div className="font-semibold">다음으로</div>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link className="underline" href="/training">인지훈련 체험하기</Link>
          <Link className="underline" href="/screening">간단 자가점검</Link>
          <Link className="underline" href="/shop">관련 상품 보기</Link>
        </div>
        <p className="mt-3 text-sm text-slate-700">
          안내: 본 콘텐츠는 건강관리 참고용이며 의료적 진단/치료를 대체하지 않습니다.
        </p>
      </section>
    </article>
  );
}
