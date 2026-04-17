import Link from "next/link";

export function AccessDenied({
  title = "권한이 필요합니다",
  description = "로그인 상태 또는 권한에 따라 접근할 수 없는 페이지입니다."
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="mt-2 text-slate-700">{description}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-xl bg-brand-700 px-5 py-3 font-medium text-white hover:bg-brand-800"
        >
          로그인
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 font-medium hover:bg-slate-50"
        >
          홈
        </Link>
      </div>
    </div>
  );
}

