"use client";

import { useState } from "react";
import { cartStorage } from "@/lib/storage";

export function AddToCartButton({
  slug,
  title,
  price
}: {
  slug: string;
  title: string;
  price: number;
}) {
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
      onClick={() => {
        cartStorage.addItem({ slug, title, price }, 1);
        window.dispatchEvent(new Event("storage"));
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
      }}
    >
      {added ? "담았습니다" : "장바구니 담기"}
    </button>
  );
}

