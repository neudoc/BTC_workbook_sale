import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalUsers,
    newUsers,
    totalOrders,
    revenueResult,
    pendingInquiries,
    pendingExpertApprovals,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    }),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { not: "cancelled" } },
    }),
    prisma.inquiry.count({
      where: { status: "pending" },
    }),
    prisma.user.count({
      where: { role: "expert_pending" },
    }),
  ]);

  const totalRevenue = revenueResult._sum.totalAmount ?? 0;

  return NextResponse.json({
    totalUsers,
    newUsers,
    totalOrders,
    totalRevenue,
    pendingInquiries,
    pendingExpertApprovals,
  });
}
