"use client";

import { useEffect, useState } from "react";

interface Order {
  id: number;
  orderNumber: string;
  userName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

const ORDER_STATUSES = [
  { value: "pending", label: "결제 대기" },
  { value: "paid", label: "결제 완료" },
  { value: "shipping", label: "배송 중" },
  { value: "delivered", label: "배송 완료" },
  { value: "cancelled", label: "주문 취소" },
  { value: "refunded", label: "환불 완료" },
];

function formatPrice(won: number) {
  return won.toLocaleString("ko-KR") + "원";
}

function getStatusLabel(status: string) {
  return ORDER_STATUSES.find((s) => s.value === status)?.label ?? status;
}

function getStatusColor(status: string) {
  switch (status) {
    case "paid":
      return "bg-emerald-50 text-emerald-700";
    case "shipping":
      return "bg-blue-50 text-blue-700";
    case "delivered":
      return "bg-slate-100 text-slate-700";
    case "cancelled":
    case "refunded":
      return "bg-red-50 text-red-700";
    default:
      return "bg-amber-50 text-amber-700";
  }
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("ko-KR");
  } catch {
    return dateStr;
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleStatusChange(orderId: number, newStatus: string) {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch {
      alert("상태 변경에 실패했습니다.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">주문 관리</h1>
        <p className="mt-1 text-slate-600">주문 내역을 확인하고 상태를 관리합니다.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">주문번호</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">주문자</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">금액</th>
                <th className="px-4 py-3 text-center font-medium text-slate-600">상태</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">날짜</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">액션</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    로딩 중...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    주문 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-mono text-xs">{order.orderNumber}</td>
                    <td className="px-4 py-3 font-medium">{order.userName}</td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="text-xs px-2 py-1"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
