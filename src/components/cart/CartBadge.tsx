"use client";

import { useEffect, useState } from "react";
import { cartStorage } from "@/lib/storage";

export function CartBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(cartStorage.getCount());
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  if (count <= 0) return null;

  return (
    <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-brand-700 px-2 py-0.5 text-xs text-white">
      {count}
    </span>
  );
}

