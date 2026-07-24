import { existsSync, readFileSync } from "node:fs";
import Database from "better-sqlite3";

const files = [
  "src/app/page.tsx",
  "src/components/SiteHeader.tsx",
  "src/components/SiteFooter.tsx",
  "src/components/ui/BottomNav.tsx",
  "src/app/shop/page.tsx",
  "src/app/shop/[slug]/page.tsx",
  "src/app/contact/page.tsx",
  "src/components/contact/ContactForm.tsx",
  "src/lib/site.ts",
  "prisma/seed.ts",
];

const required = [
  "인지학습 교재",
  "집과 기관에서",
  "바로 쓰는",
  "보호자와 현장 선생님을 위한 수준별 워크북, 지도서, 실전 책자를 제공합니다.",
  "인지학습지도사",
  "사회적 기여",
  "https://neudoc.tistory.com/",
  'slug: "level1-set"',
  'tags: "1레벨,상급,세트"',
  'slug: "level3-set"',
  'tags: "3레벨,초급,세트"',
  'slug: "dementia-behavior-guide"',
  'thumbnailUrl: "/images/products/memory-cover.png"',
  'slug: "dementia-qna"',
  'thumbnailUrl: "/images/products/qna-cover.png"',
  'image: "/images/products/instructor-level1-cover.png"',
  'image: "/images/products/instructor-level2-cover.png"',
  'image: "/images/products/instructor-level3-cover.png"',
  "text-sm font-bold tracking-[0.16em]",
  "text-[1.85rem]",
  "lg:text-[3.35rem]",
  "object-contain",
];

const forbidden = [
  'tags: "1레벨,초급,세트"',
  'tags: "3레벨,고급,세트"',
  'thumbnailUrl: "/images/products/behavior.jpg"',
  'thumbnailUrl: "/images/products/qna.jpg"',
  "집과 기관에서 바로 시작하는",
];

const mojibakeMarkers = ["?쇳", "?몄", "移섎", "援먯", "釉붾", "硫붾", "臾몄", "寃"];

const contents = files.map((file) => {
  try {
    return [file, readFileSync(file, "utf8")];
  } catch (error) {
    throw new Error(`Could not read ${file}: ${error.message}`);
  }
});

const allText = contents.map(([, content]) => content).join("\n");
const failures = [];

for (const phrase of required) {
  if (!allText.includes(phrase)) {
    failures.push(`Missing required phrase: ${phrase}`);
  }
}

for (const phrase of forbidden) {
  if (allText.includes(phrase)) {
    failures.push(`Forbidden outdated phrase remains: ${phrase}`);
  }
}

for (const [file, content] of contents) {
  for (const marker of mojibakeMarkers) {
    if (content.includes(marker)) {
      failures.push(`Mojibake marker "${marker}" found in ${file}`);
    }
  }
}

if (!existsSync("public/images/products/memory-cover.png")) {
  failures.push("Missing public/images/products/memory-cover.png");
}

if (!existsSync("public/images/products/qna-cover.png")) {
  failures.push("Missing public/images/products/qna-cover.png");
}

for (const file of [
  "public/images/products/instructor-level1-cover.png",
  "public/images/products/instructor-level2-cover.png",
  "public/images/products/instructor-level3-cover.png",
]) {
  if (!existsSync(file)) {
    failures.push(`Missing ${file}`);
  }
}

const shopPage = readFileSync("src/app/shop/page.tsx", "utf8");
const productDetailPage = readFileSync("src/app/shop/[slug]/page.tsx", "utf8");
const homePage = readFileSync("src/app/page.tsx", "utf8");
for (const phrase of [
  'image: "/images/products/level1.jpg"',
  'image: "/images/products/level2.jpg"',
  'image: "/images/products/level3.jpg"',
]) {
  if (homePage.includes(phrase)) {
    failures.push(`Homepage featured products should not use old image path: ${phrase}`);
  }
}
if (shopPage.includes("object-cover")) {
  failures.push("Shop product images must use object-contain so covers are not cropped.");
}
if (productDetailPage.includes("object-cover")) {
  failures.push("Product detail images must use object-contain so covers are not cropped.");
}

if (existsSync("dev.db")) {
  const db = new Database("dev.db", { readonly: true });
  const rows = db
    .prepare(
      "SELECT slug, tags, thumbnailUrl FROM Product WHERE slug IN ('level1-set','level3-set','dementia-behavior-guide','dementia-qna')"
    )
    .all();
  db.close();

  const bySlug = new Map(rows.map((row) => [row.slug, row]));
  if (bySlug.get("level1-set")?.tags !== "1레벨,상급,세트") {
    failures.push("dev.db level1-set tags must be 1레벨,상급,세트");
  }
  if (bySlug.get("level3-set")?.tags !== "3레벨,초급,세트") {
    failures.push("dev.db level3-set tags must be 3레벨,초급,세트");
  }
  if (bySlug.get("dementia-behavior-guide")?.thumbnailUrl !== "/images/products/memory-cover.png") {
    failures.push("dev.db dementia-behavior-guide thumbnailUrl must be /images/products/memory-cover.png");
  }
  if (bySlug.get("dementia-qna")?.thumbnailUrl !== "/images/products/qna-cover.png") {
    failures.push("dev.db dementia-qna thumbnailUrl must be /images/products/qna-cover.png");
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Homepage content verification passed.");
