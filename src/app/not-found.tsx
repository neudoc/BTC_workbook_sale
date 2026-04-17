import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-2xl font-semibold">페이지를 찾을 수 없습니다.</h1>
      <p className="mt-3 text-slate-700">
        주소가 잘못되었거나 이동/삭제된 페이지입니다.
      </p>
      <div className="mt-6">
        <Link
          className="inline-flex items-center justify-center rounded-xl bg-brand-700 px-5 py-3 text-white hover:bg-brand-800"
          href="/"
        >
          홈으로 가기
        </Link>
      </div>
    </div>
  );
}

