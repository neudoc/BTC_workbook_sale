import type { Metadata } from "next";
import { AccessDenied } from "@/components/AccessDenied";
import { MyPageClient } from "@/components/mypage/MyPageClient";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "마이페이지",
  description: "내 기록/주문내역(데모)",
  robots: { index: false, follow: false }
};

export default function MyPage() {
  const session = getSession();
  if (!session) return <AccessDenied />;

  return <MyPageClient session={session} />;
}
