import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";

export const metadata: Metadata = {
  title: "이용약관",
  description: "이용약관(예시 문구)"
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <PageTitle title="이용약관" description="운영 정책에 맞게 반드시 법률 검토 후 교체하세요." />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 text-slate-800">
        <h2 className="text-lg font-semibold">1. 목적</h2>
        <p>본 약관은 BrainTrust Club 서비스 이용 조건과 절차를 규정합니다.</p>
        <h2 className="text-lg font-semibold">2. 서비스 제공</h2>
        <p>서비스 구성(콘텐츠/체험/쇼핑/회원 기능)은 운영 정책에 따라 변경될 수 있습니다.</p>
        <h2 className="text-lg font-semibold">3. 회원의 의무</h2>
        <p>회원은 타인의 권리를 침해하거나 서비스 운영을 방해하는 행위를 해서는 안 됩니다.</p>
      </div>
    </div>
  );
}

