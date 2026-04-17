import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { getProduct } from "@/lib/data/products";

function formatPrice(won: number) {
  return won.toLocaleString("ko-KR") + "원";
}

export function generateMetadata({
  params
}: {
  params: { slug: string };
}): Metadata {
  const product = getProduct(params.slug);
  if (!product) return { title: "상품" };
  return {
    title: product.title,
    description: product.summary
  };
}

export default function ProductDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const product = getProduct(params.slug);
  if (!product) return notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <div className="text-sm text-slate-600">
        <Link className="hover:underline" href="/shop">
          쇼핑몰
        </Link>{" "}
        / {product.title}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p className="text-slate-700">{product.summary}</p>
        <div className="flex flex-wrap gap-2">
          {product.tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="pt-2">
          <div className="text-sm text-slate-600">가격(데모)</div>
          <div className="text-2xl font-semibold">{formatPrice(product.price)}</div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <AddToCartButton slug={product.slug} title={product.title} price={product.price} />
          <Link
            href="/cart"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            장바구니로
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-brand-100 bg-brand-50 p-6">
        <div className="font-semibold">구매/배송 안내(예시)</div>
        <ul className="mt-2 list-disc pl-5 text-slate-700 space-y-1">
          <li>결제는 실제 PG 연동 전 데모로 제공됩니다.</li>
          <li>배송/환불 정책은 운영 정책에 맞게 교체하세요.</li>
        </ul>
        <div className="mt-3 text-sm">
          <Link className="underline" href="/legal/shipping">
            배송 정책
          </Link>{" "}
          ·{" "}
          <Link className="underline" href="/legal/refund">
            환불/교환 정책
          </Link>
        </div>
      </div>
    </div>
  );
}

