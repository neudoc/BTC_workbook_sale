import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatPrice(won: number) {
  return `${won.toLocaleString("ko-KR")}원`;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) return { title: "상품" };
  return { title: product.name, description: product.shortDescription };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) return notFound();

  const price = product.salePrice ?? product.price;
  const tags = product.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const levelMatch = product.slug.match(/^level(\d)/);
  const level = levelMatch ? levelMatch[1] : null;
  const previewPages = level
    ? [1, 2, 3, 4, 5].map((n) => `/images/previews/level${level}/p${n}.jpg`)
    : [];
  const guidePages = level
    ? [1, 2].map((n) => `/images/previews/level${level}/guide${n}.jpg`)
    : [];

  return (
    <div className="space-y-8">
      <div className="text-sm text-slate-600">
        <Link className="font-semibold text-brand-700 hover:underline" href="/shop">
          교재 구매
        </Link>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </div>

      <div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-800"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          {product.name}
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-700">{product.shortDescription}</p>
      </div>

      <section className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[0.95fr_1.05fr]">
        <div className="flex flex-col gap-6 bg-gradient-to-b from-slate-100 to-white p-6 lg:pt-10">
          <div className="flex items-start justify-center">
            {product.thumbnailUrl ? (
              <Image
                src={product.thumbnailUrl}
                alt={product.name}
                width={620}
                height={820}
                className="block h-auto w-3/4 rounded-sm object-contain shadow-xl"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-500">
                상품 이미지 준비 중
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gold-200 bg-gold-50 p-4">
            <p className="flex items-center gap-2 text-sm font-bold text-gold-800">
              <span aria-hidden>👪</span> 보호자도 함께 학습할 수 있어요
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              모든 세트에는 <strong>인지학습지도사 지침서</strong>가 함께
              제공됩니다. 전문가가 아니어도 지침서의 안내를 따라 어르신과 나란히
              앉아 한 장씩 학습을 이끌 수 있도록, 쉬운 말과 단계별 지도 방법으로
              구성했습니다.
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {product.description ? (
            <div className="whitespace-pre-line border-b border-slate-100 pb-5 text-sm leading-7 text-slate-700">
              {product.description}
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 rounded-2xl bg-slate-50 p-4 sm:grid-cols-3">
            <div>
              <div className="text-xs font-semibold text-slate-500">판매가</div>
              {product.salePrice ? (
                <div className="mt-1 text-sm text-slate-400 line-through">
                  {formatPrice(product.price)}
                </div>
              ) : null}
              <div className="mt-1 text-2xl font-bold text-slate-950">{formatPrice(price)}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">분류</div>
              <div className="mt-1 font-bold text-slate-900">{product.category || "교재"}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">재고</div>
              <div className="mt-1 font-bold text-slate-900">{product.stock}개</div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-brand-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-800"
            >
              구매 상담하기
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-slate-800 transition hover:border-brand-600 hover:text-brand-800"
            >
              다른 교재 보기
            </Link>
          </div>
        </div>
      </section>

      {previewPages.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-3 text-sm font-bold tracking-[0.18em] text-gold-600">
                <span className="inline-block h-px w-8 bg-gold-400" aria-hidden />
                교재 미리보기
              </p>
              <h2 className="mt-2 text-xl font-bold text-slate-950">
                실제 학습지 예시 페이지를 확인하세요
              </h2>
            </div>
            <p className="text-sm text-slate-500">레벨 {level} 교재 본문 예시 · 총 36p 구성</p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {previewPages.map((src, i) => (
              <figure
                key={src}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm"
              >
                <Image
                  src={src}
                  alt={`레벨 ${level} 교재 예시 ${i + 1}쪽`}
                  width={480}
                  height={470}
                  className="h-auto w-full object-contain"
                />
              </figure>
            ))}
          </div>
          <p className="mt-4 text-xs leading-6 text-slate-500">
            ※ 위 이미지는 실제 교재 본문 중 일부 예시이며, 구매 결정을 돕기 위한
            참고용입니다. 인쇄본의 색상·해상도와 차이가 있을 수 있습니다.
          </p>

          {guidePages.length > 0 ? (
            <div className="mt-8 border-t border-slate-100 pt-6">
              <p className="flex items-center gap-3 text-sm font-bold tracking-[0.18em] text-gold-600">
                <span className="inline-block h-px w-8 bg-gold-400" aria-hidden />
                지도사 지침서 예시
              </p>
              <h3 className="mt-2 text-lg font-bold text-slate-950">
                보호자도 이렇게 이끌 수 있어요
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                지침서에는 활동의 의미, 따뜻한 지도 멘트, 돌발 상황 대처법, 난이도
                조절 방법이 담겨 있어 전문가가 아니어도 어르신과 함께 학습을 진행할
                수 있습니다.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {guidePages.map((src, i) => (
                  <figure
                    key={src}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm"
                  >
                    <Image
                      src={src}
                      alt={`레벨 ${level} 지도사 지침서 예시 ${i + 1}`}
                      width={620}
                      height={770}
                      className="h-auto w-full object-contain"
                    />
                  </figure>
                ))}
              </div>
              <p className="mt-3 text-xs leading-6 text-slate-500">
                ※ 지침서 예시 페이지이며, 본문 예시와 동일한 회차가 아닐 수 있습니다.
              </p>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-2xl border border-brand-200 bg-brand-50 p-6">
        <h2 className="text-lg font-bold text-brand-950">구매 및 배송 안내</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700">
          <li>대량 구매, 기관 도입, 지도사 교육 연계 구매는 문의 페이지에서 상담할 수 있습니다.</li>
          <li>배송과 교환 안내는 운영 정책에 따라 개별 안내됩니다.</li>
          <li>교재는 교육 목적 자료이며 의학적 진단이나 치료를 대체하지 않습니다.</li>
        </ul>
      </section>
    </div>
  );
}
