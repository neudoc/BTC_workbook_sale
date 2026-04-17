import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "주문/결제",
  description: "주문/결제(데모)",
  robots: { index: false, follow: false }
};

export default function CheckoutPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <PageTitle
        title="주문/결제"
        description="실제 결제는 연동되어 있지 않은 데모 화면입니다."
      />
      <CheckoutForm />
    </div>
  );
}
