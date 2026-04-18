import type { Metadata } from "next";
import { AccessDenied } from "@/components/AccessDenied";
import { getSession } from "@/lib/session";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "관리자",
  description: "관리자 대시보드",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = getSession();
  if (!session) return <AccessDenied title="로그인이 필요합니다" />;
  if (session.role !== "admin")
    return <AccessDenied title="관리자 전용 페이지입니다" />;

  return <AdminShell session={session}>{children}</AdminShell>;
}
