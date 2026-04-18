import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle } from "@/components/ui/PageTitle";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "쇼핑몰",
  description: "워크북, 교구, 훈련도구를 구매할 수 있습니다."
};

function formatPrice(won: number) {
  return won.toLocaleString("ko-KR") + "원";
}

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <PageTitle title="쇼핑몰" description="인지훈련에 도움이 되는 워크북과 교구를 만나보세요." />

      <div className="grid gap-4 md:grid-cols-2">
        {products.map((p) => (
          <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link className="text-lg font-semibold hover:underline" href={`/shop/${p.slug}`}>
                  {p.name}
                </Link>
                <div className="mt-1 text-slate-700">{p.shortDescription}</div>
                <div className="mt-3 text-sm text-slate-600">
                  {p.tags.split(",").filter(Boolean).map((t) => (
                    <span key={t} className="mr-2 inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
                      {t.trim()}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-semibold">{formatPrice(p.price)}</div>
                {p.salePrice ? (
                  <div className="text-sm text-red-600 line-through">{formatPrice(p.salePrice)}</div>
                ) : null}
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={`/shop/${p.slug}`}
                className="inline-flex items-center justify-center rounded-xl bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
              >
                상세 보기
              </Link>
            </div>
          </div>
        ))}
        {products.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700">
            등록된 상품이 없습니다.
          </div>
        ) : null}
      </div>
    </div>
  );
}
