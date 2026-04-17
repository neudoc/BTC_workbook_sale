"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cartStorage, orderStorage, type CartItem } from "@/lib/storage";

function formatPrice(won: number) {
  return won.toLocaleString("ko-KR") + "원";
}

function makeId() {
  return "BT" + Math.random().toString(16).slice(2, 10).toUpperCase();
}

export function CheckoutForm() {
  const router = useRouter();
  const [buyerName, setBuyerName] = useState("");
  const [payment, setPayment] = useState<"card" | "bank">("card");
  const [items, setItems] = useState<CartItem[]>(() => cartStorage.getItems());

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="text-lg font-semibold">주문할 상품이 없습니다.</div>
        <p className="mt-2 text-slate-700">장바구니에 상품을 담아주세요.</p>
      </div>
    );
  }

  return (
    <form
      className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        const id = makeId();
        const createdAt = new Date().toISOString();
        orderStorage.add({ id, createdAt, items, total, buyerName: buyerName || "구매자" });
        cartStorage.clear();
        window.dispatchEvent(new Event("storage"));
        router.push(`/order-complete?id=${encodeURIComponent(id)}`);
      }}
    >
      <div className="space-y-2">
        <div className="text-sm font-medium">구매자 이름</div>
        <input
          className="w-full rounded-xl border border-slate-200 px-4 py-3"
          value={buyerName}
          onChange={(e) => setBuyerName(e.target.value)}
          placeholder="예: 홍길동"
        />
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium">결제 수단(데모)</div>
        <div className="grid gap-2">
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
            <input
              type="radio"
              checked={payment === "card"}
              onChange={() => setPayment("card")}
            />
            <div>
              <div className="font-medium">카드결제</div>
              <div className="text-sm text-slate-600">실제 PG 연동 전 데모입니다.</div>
            </div>
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
            <input
              type="radio"
              checked={payment === "bank"}
              onChange={() => setPayment("bank")}
            />
            <div>
              <div className="font-medium">무통장(데모)</div>
              <div className="text-sm text-slate-600">운영 정책에 따라 교체하세요.</div>
            </div>
          </label>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
        <div className="font-semibold">주문 요약</div>
        <ul className="mt-2 space-y-1 text-slate-700">
          {items.map((item) => (
            <li key={item.slug} className="flex items-center justify-between gap-3">
              <span>
                {item.title} · {item.quantity}개
              </span>
              <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
          <span className="font-semibold">총액</span>
          <span className="text-xl font-semibold">{formatPrice(total)}</span>
        </div>
        <div className="mt-2 text-xs text-slate-600">
          결제/배송/환불 정책 문구는 실제 운영 정책으로 교체 필요
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-brand-700 px-5 py-3 font-medium text-white hover:bg-brand-800"
      >
        {payment === "card" ? "결제하기(데모)" : "주문완료(데모)"}
      </button>
    </form>
  );
}

