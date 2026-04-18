import Link from "next/link";
import type { Course } from "@/lib/data/courses";

function formatPrice(won: number) {
  return won.toLocaleString("ko-KR") + "원";
}

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/education/courses/${course.id}`}
      className="group rounded-2xl border border-slate-200 bg-white p-6 hover:border-brand-200 hover:bg-brand-50/30 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-800">
            {course.category}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-950">{course.title}</h3>
        </div>
        <span className="shrink-0 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-900">
          {formatPrice(course.price)}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-700">{course.description}</p>
      <div className="mt-3 text-sm text-slate-600">기간: {course.duration}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {course.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-900 group-hover:underline">
        과정 상세보기 →
      </div>
    </Link>
  );
}
