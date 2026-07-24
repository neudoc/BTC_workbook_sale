export type Product = {
  slug: string;
  title: string;
  summary: string;
  price: number;
  tags: string[];
};

// BTC 1% 인지학습지 — 레벨(예방/관리/돌봄) × 계절(봄·여름·가을·겨울) SKU 구성
// 봄 세트 150,000원(학습교구 포함) · 여름·가을·겨울 각 75,000원(교구 미포함)
type Season = { key: string; kr: string; books: string; price: number };

const seasons: Season[] = [
  { key: "spring", kr: "봄", books: "교재 1·2·3권", price: 150000 },
  { key: "summer", kr: "여름", books: "교재 4·5·6권", price: 75000 },
  { key: "fall", kr: "가을", books: "교재 7·8·9권", price: 75000 },
  { key: "winter", kr: "겨울", books: "교재 10·11·12권", price: 75000 },
];

const levels = [
  { n: 1, label: "예방", tag: "난이도상" },
  { n: 2, label: "관리", tag: "MCI" },
  { n: 3, label: "돌봄", tag: "중증도" },
];

export const products: Product[] = levels.flatMap((lv) =>
  seasons.map((s) => ({
    slug: `level${lv.n}-${s.key}`,
    title: `레벨 ${lv.n} ${s.kr} 세트 (${s.books})`,
    summary:
      s.key === "spring"
        ? `${s.books} + 지침서 + 학습교구 Set(16종) 포함 — ${lv.label}(레벨 ${lv.n})`
        : `${s.books} + 지침서 + 증정본 (학습교구 미포함) — ${lv.label}(레벨 ${lv.n})`,
    price: s.price,
    tags: [`레벨${lv.n}`, lv.label, s.kr, lv.tag],
  }))
);

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug) ?? null;
}
