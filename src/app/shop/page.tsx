import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageTitle } from "@/components/ui/PageTitle";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "인지학습 교재 구매",
  description:
    "BTC 1% 인지학습지 — 레벨별(예방·관리·돌봄) 봄·여름·가을·겨울 세트를 구매할 수 있습니다.",
};

export const dynamic = "force-dynamic";

function formatPrice(won: number) {
  return `${won.toLocaleString("ko-KR")}원`;
}

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });

  // Group SKUs by level (category) while preserving season order (createdAt asc)
  const groups: { category: string; items: typeof products }[] = [];
  for (const product of products) {
    const key = product.category || "기타";
    let group = groups.find((g) => g.category === key);
    if (!group) {
      group = { category: key, items: [] };
      groups.push(group);
    }
    group.items.push(product);
  }

  return (
    <div className="space-y-10">
      <PageTitle
        title="인지학습 교재 구매"
        description="의사가 만든 노화·치매 예방 인지학습지입니다. 레벨을 고른 뒤, 봄·여름·가을·겨울 세트를 계절별로 구매할 수 있습니다."
      />

      <div className="rounded-lg border border-brand-200 bg-brand-50 p-5">
        <h2 className="text-lg font-bold text-brand-900">구매 안내</h2>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          학습지는 총 12권으로 봄·여름·가을·겨울 4세트입니다. 봄 세트(150,000원)에는
          학습교구 Set(16종)가 포함되며, 여름·가을·겨울 세트는 각 75,000원(교구 미포함)입니다.
          교구는 봄 세트에 한 번만 준비하면 이후 학기에 공통으로 사용됩니다.
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          각 세트에는 <strong>인지학습지도사 지침서</strong>가 함께 제공되어, 전문가가
          아닌 보호자도 지침서를 보며 어르신과 함께 학습을 진행할 수 있습니다. 상품을
          선택하면 실제 교재 본문 예시 페이지를 미리 볼 수 있습니다.
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-flex items-center justify-center rounded-full bg-brand-700 px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-800"
        >
          구매 상담하기
        </Link>
      </div>

      {groups.map((group) => (
        <section key={group.category} className="space-y-4">
          <h2 className="border-l-4 border-gold-400 pl-3 text-xl font-bold text-slate-950">
            {group.category}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {group.items.map((product) => {
              const price = product.salePrice ?? product.price;
              return (
                <div
                  key={product.id}
                  className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <Link
                    href={`/shop/${product.slug}`}
                    className="relative block aspect-[3/4] overflow-hidden bg-slate-50 p-3"
                  >
                    {product.thumbnailUrl ? (
                      <Image
                        src={product.thumbnailUrl}
                        alt={product.name}
                        width={420}
                        height={560}
                        className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
                        상품 이미지 준비 중
                      </div>
                    )}
                  </Link>

                  <div className="p-5">
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {product.tags
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean)
                        .slice(0, 3)
                        .map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>

                    <Link
                      className="block text-base font-bold text-slate-950 transition group-hover:text-brand-700"
                      href={`/shop/${product.slug}`}
                    >
                      {product.name}
                    </Link>

                    <p className="mt-2 min-h-[3.5rem] text-sm leading-6 text-slate-700">
                      {product.shortDescription}
                    </p>

                    <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4">
                      <div className="text-lg font-bold text-slate-950">{formatPrice(price)}</div>
                      <Link
                        href={`/shop/${product.slug}`}
                        className="inline-flex items-center justify-center rounded-full bg-slate-950 px-3 py-2 text-xs font-bold text-white transition hover:bg-brand-700"
                      >
                        상세 보기
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {products.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center text-slate-600">
          등록된 상품이 없습니다.
        </div>
      ) : null}
    </div>
  );
}
