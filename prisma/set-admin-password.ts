import "dotenv/config";
import { hashSync } from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

// 사용법: npm run set-admin-pw -- "새비밀번호"
// (선택) 다른 계정 지정: ADMIN_EMAIL=other@btc.kr npm run set-admin-pw -- "새비밀번호"
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@btc.kr";
  const pw = process.argv[2];
  if (!pw || pw.length < 8) {
    console.error('사용법: npm run set-admin-pw -- "새비밀번호(8자 이상)"');
    process.exit(1);
  }
  await prisma.user.update({
    where: { email },
    data: { passwordHash: hashSync(pw, 10) },
  });
  console.log(`✅ 비밀번호를 변경했습니다: ${email}`);
}

main()
  .catch((e) => {
    console.error("변경 실패:", e.message || e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
