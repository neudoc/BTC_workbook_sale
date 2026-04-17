"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cartStorage, type CartItem } from "@/lib/storage";

function formatPrice(won: number) {
  return won.toLocaleString("ko-KR") + "원";
}

export function CartView() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(cartStorage.getItems());
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="text-lg font-semibold">장바구니가 비어있습니다.</div>
        <div className="mt-4">
          <Link
            className="inline-flex items-center justify-center rounded-xl bg-brand-700 px-5 py-3 font-medium text-white hover:bg-brand-800"
            href="/shop"
          >
            쇼핑몰로 가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        {items.map((item) => (
          <div
            key={item.slug}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0"
          >
            <div>
              <div className="font-semibold">{item.title}</div>
              <div className="text-sm text-slate-600">
                {formatPrice(item.price)} · 수량 {item.quantity}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50"
                type="button"
                onClick={() => {
                  cartStorage.updateQuantity(item.slug, Math.max(0, item.quantity - 1));
                  window.dispatchEvent(new Event("storage"));
                }}
              >
                -
              </button>
              <button
                className="rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50"
                type="button"
                onClick={() => {
                  cartStorage.updateQuantity(item.slug, item.quantity + 1);
                  window.dispatchEvent(new Event("storage"));
                }}
              >
                +
              </button>
              <button
                className="rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50"
                type="button"
                onClick={() => {
                  cartStorage.updateQuantity(item.slug, 0);
                  window.dispatchEvent(new Event("storage"));
                }}
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-sm text-slate-600">총 결제 금액(데모)</div>
          <div className="text-2xl font-semibold">{formatPrice(total)}</div>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="rounded-xl border border-slate-200 px-5 py-3 font-medium hover:bg-slate-50"
            onClick={() => {
              cartStorage.clear();
              window.dispatchEvent(new Event("storage"));
            }}
          >
            비우기
          </button>
          <Link
            href="/checkout"
            className="rounded-xl bg-brand-700 px-5 py-3 font-medium text-white hover:bg-brand-800 text-center"
          >
            주문하기
          </Link>
        </div>
      </div>
    </div>
  );
}

