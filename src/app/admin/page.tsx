import { getSession } from "@/lib/session";
import { DashboardClient } from "@/components/admin/DashboardClient";

export default function AdminDashboardPage() {
  const session = getSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">대시보드</h1>
        <p className="mt-1 text-slate-600">서비스 운영 현황을 한눈에 확인하세요.</p>
      </div>

      <DashboardClient adminName={session?.name ?? "관리자"} />
    </div>
  );
}
