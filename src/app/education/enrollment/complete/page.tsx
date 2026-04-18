import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "수강신청 완료",
  description: "수강신청이 완료되었습니다.",
  robots: { index: false, follow: false }
};

export default function EnrollmentCompletePage({
  searchParams
}: {
  searchParams: { courseId?: string };
}) {
  const courseId = searchParams.courseId;

  if (!courseId) {
    redirect("/education/courses");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="text-4xl">✅</div>
        <h1 className="mt-4 text-2xl font-semibold text-green-900">수강신청이 완료되었습니다!</h1>
        <p className="mt-2 text-green-800">
          신청해 주셔서 감사합니다. 빠른 시일 내에 연락드리겠습니다.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">다음 안내</h2>
        <ul className="mt-3 space-y-2 text-slate-700">
          <li className="flex items-start gap-2">
            <span className="text-brand-700">•</span>
            <span>접수 확인 이메일이 발송됩니다.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-700">•</span>
            <span>교육 시작 전 별도 안내가 있을 예정입니다.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-700">•</span>
            <span>문의사항은 고객센터로 연락 주시기 바랍니다.</span>
          </li>
        </ul>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/education/courses"
          className="inline-flex items-center justify-center rounded-xl bg-brand-700 px-5 py-3 font-medium text-white hover:bg-brand-800"
        >
          교육과정 목록
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 font-medium hover:bg-slate-50"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
