import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse } from "@/lib/data/courses";

function formatPrice(won: number) {
  return won.toLocaleString("ko-KR") + "원";
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const course = getCourse(params.id);
  return {
    title: course?.title ?? "교육과정",
    description: course?.description ?? ""
  };
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = getCourse(params.id);
  if (!course) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <div className="text-sm text-slate-600">
        <Link className="hover:underline" href="/education/courses">교육과정</Link> / {course.title}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-800">
          {course.category}
        </p>
        <h1 className="text-2xl font-semibold">{course.title}</h1>
        <p className="text-slate-700">{course.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          <span>기간: {course.duration}</span>
          <span>수강료: {formatPrice(course.price)}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {course.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        <h2 className="text-lg font-semibold">커리큘럼</h2>
        <div className="space-y-4">
          {course.modules.map((mod, idx) => (
            <details key={idx} className="rounded-xl border border-slate-200">
              <summary className="cursor-pointer p-4 font-medium hover:bg-slate-50">
                {idx + 1}. {mod.title} ({mod.duration})
              </summary>
              <div className="border-t border-slate-100 px-4 py-3 space-y-2">
                {mod.lessons.map((lesson) => (
                  <div key={lesson} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-700" />
                    {lesson}
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
        <h2 className="text-lg font-semibold">수료 기준</h2>
        <p className="text-slate-700">{course.completionCriteria}</p>
      </div>

      <Link
        href={`/education/enrollment?courseId=${course.id}`}
        className="block rounded-xl bg-brand-700 px-5 py-4 text-center text-lg font-medium text-white hover:bg-brand-800"
      >
        수강신청하기 ({formatPrice(course.price)})
      </Link>
    </div>
  );
}
