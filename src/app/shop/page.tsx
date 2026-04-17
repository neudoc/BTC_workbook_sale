import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle } from "@/components/ui/PageTitle";
import { products } from "@/lib/data/products";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

export const metadata: Metadata = {
  title: "쇼핑몰",
  description: "워크북, 교구, 훈련도구를 구매할 수 있습니다(데모)."
};

function formatPrice(won: number) {
  return won.toLocaleString("ko-KR") + "원";
}

export default function ShopPage() {
  return (
    <div className="space-y-6">
      <PageTitle
        title="쇼핑몰"
        description="카드결제 흐름은 데모로 구성되어 있습니다. 실제 운영 시 PG 연동이 필요합니다."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {products.map((p) => (
          <div
            key={p.slug}
            className="rounded-2xl border border-slate-200 bg-white p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link className="text-lg font-semibold hover:underline" href={`/shop/${p.slug}`}>
                  {p.title}
                </Link>
                <div className="mt-1 text-slate-700">{p.summary}</div>
                <div className="mt-3 text-sm text-slate-600">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="mr-2 inline-flex items-center rounded-full bg-slate-100 px-3 py-1"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-semibold">{formatPrice(p.price)}</div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <AddToCartButton slug={p.slug} title={p.title} price={p.price} />
              <Link
                href={`/shop/${p.slug}`}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
              >
                상세 보기
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

