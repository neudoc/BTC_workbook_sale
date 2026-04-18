import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

function formatPrice(won: number) {
  return won.toLocaleString("ko-KR") + "원";
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) return { title: "상품" };
  return { title: product.name, description: product.shortDescription };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) return notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <div className="text-sm text-slate-600">
        <Link className="hover:underline" href="/shop">쇼핑몰</Link> / {product.name}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <p className="text-slate-700">{product.shortDescription}</p>
        {product.description ? (
          <div className="text-slate-700 whitespace-pre-line">{product.description}</div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {product.tags.split(",").filter(Boolean).map((t) => (
            <span key={t} className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm">
              {t.trim()}
            </span>
          ))}
        </div>

        <div className="pt-2">
          <div className="text-sm text-slate-600">가격</div>
          <div className="text-2xl font-semibold">{formatPrice(product.price)}</div>
          {product.salePrice ? (
            <div className="text-sm text-red-600 line-through">{formatPrice(product.salePrice)}</div>
          ) : null}
        </div>

        <div className="text-sm text-slate-600">재고: {product.stock}개</div>

        <div className="mt-3 text-xs text-slate-500">
          카테고리: {product.category || "미분류"}
        </div>
      </div>

      <div className="rounded-2xl border border-brand-100 bg-brand-50 p-6">
        <div className="font-semibold">구매/배송 안내</div>
        <ul className="mt-2 list-disc pl-5 text-slate-700 space-y-1">
          <li>결제는 실제 PG 연동 전 데모로 제공됩니다.</li>
          <li>배송/환불 정책은 운영 정책에 맞게 교체하세요.</li>
        </ul>
        <div className="mt-3 text-sm">
          <Link className="underline" href="/legal/shipping">배송 정책</Link>
          {" "}·{" "}
          <Link className="underline" href="/legal/refund">환불/교환 정책</Link>
        </div>
      </div>
    </div>
  );
}
