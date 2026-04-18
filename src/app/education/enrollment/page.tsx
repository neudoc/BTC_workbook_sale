import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageTitle } from "@/components/ui/PageTitle";
import { EnrollmentForm } from "@/components/education/EnrollmentForm";

export const metadata: Metadata = {
  title: "수강신청",
  description: "교육과정 수강신청",
  robots: { index: false, follow: false }
};

export default function EnrollmentPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="text-sm text-slate-600">
        <Link className="hover:underline" href="/education/courses">교육과정</Link> / 수강신청
      </div>
      <PageTitle title="수강신청" description="교육과정 신청서를 작성해주세요." />
      <Suspense fallback={<div>로딩 중...</div>}>
        <EnrollmentForm />
      </Suspense>
    </div>
  );
}
