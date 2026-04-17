import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "문의하기",
  description: "문의 접수(데모)"
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <PageTitle
        title="문의하기"
        description="본 폼은 데모이며, 실제 운영에서는 이메일/CRM/CS 시스템과 연동해야 합니다."
      />
      <ContactForm />
    </div>
  );
}

