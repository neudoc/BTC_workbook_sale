export type Product = {
  slug: string;
  title: string;
  summary: string;
  price: number;
  tags: string[];
};

export const products: Product[] = [
  {
    slug: "workbook-basic",
    title: "인지훈련 워크북 (기초)",
    summary: "집에서 따라할 수 있는 기초 인지훈련 문제 모음.",
    price: 18000,
    tags: ["워크북", "초급", "가정용"]
  },
  {
    slug: "workbook-advanced",
    title: "인지훈련 워크북 (심화)",
    summary: "조금 더 다양한 난이도의 훈련 문제로 구성.",
    price: 22000,
    tags: ["워크북", "중급", "가정용"]
  },
  {
    slug: "training-cards",
    title: "인지활동 카드 세트",
    summary: "대화·회상·주의집중을 돕는 활동 카드 60장.",
    price: 29000,
    tags: ["교구", "카드", "활동"]
  },
  {
    slug: "puzzle-set",
    title: "두뇌 퍼즐 세트",
    summary: "공간지각/문제해결을 자극하는 퍼즐 구성(초·중 난이도).",
    price: 26000,
    tags: ["교구", "퍼즐"]
  }
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug) ?? null;
}

