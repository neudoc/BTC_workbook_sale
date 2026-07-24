import Database from "better-sqlite3";

const db = new Database("dev.db");
const now = new Date().toISOString();

db.prepare(
  "UPDATE Product SET description = ?, tags = ?, updatedAt = ? WHERE slug = ?"
).run(
  "상급 인지학습 활동을 위한 1레벨 세트입니다. 워크북 3권과 지도에 필요한 지침서가 모두 포함되어 있습니다.",
  "1레벨,상급,세트",
  now,
  "level1-set"
);

db.prepare(
  "UPDATE Product SET description = ?, tags = ?, updatedAt = ? WHERE slug = ?"
).run(
  "초급 인지학습 활동을 위한 3레벨 세트입니다. 워크북 3권과 지도에 필요한 지침서가 모두 포함되어 있습니다.",
  "3레벨,초급,세트",
  now,
  "level3-set"
);

db.prepare(
  "UPDATE Product SET thumbnailUrl = ?, updatedAt = ? WHERE slug = ?"
).run("/images/products/memory-cover.png", now, "dementia-behavior-guide");

db.prepare(
  "UPDATE Product SET thumbnailUrl = ?, updatedAt = ? WHERE slug = ?"
).run("/images/products/qna-cover.png", now, "dementia-qna");

const rows = db
  .prepare(
    "SELECT slug, tags, thumbnailUrl FROM Product WHERE slug IN ('level1-set','level3-set','dementia-behavior-guide','dementia-qna') ORDER BY slug"
  )
  .all();

console.log(JSON.stringify(rows, null, 2));
db.close();
