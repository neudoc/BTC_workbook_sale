import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import { PageTitle } from "@/components/ui/PageTitle";

export const metadata: Metadata = {
  title: "장바구니",
  description: "장바구니(로컬 저장 데모)",
  robots: { index: false, follow: false }
};

export default function CartPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="장바구니" description="브라우저 로컬 저장 기반 데모입니다." />
      <CartView />
    </div>
  );
}
