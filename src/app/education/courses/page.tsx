import type { Metadata } from "next";
import Image from "next/image";
import { PageTitle } from "@/components/ui/PageTitle";
import { courses } from "@/lib/data/courses";
import { CourseCard } from "@/components/education/CourseCard";

export const metadata: Metadata = {
  title: "교육과정",
  description: "인지학습지도사 양성과정, 보호자 교육 등 교육 프로그램"
};

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <PageTitle
        title="교육과정"
        description="인지학습지도사 양성과정과 보호자 교육 프로그램을 소개합니다."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <figure className="overflow-hidden rounded-2xl border border-slate-200 shadow-card">
          <Image
            src="/images/about/instructor-ceremony.jpg"
            alt="인지학습 전문 지도사 양성과정 설명회 및 협약식 단체사진"
            width={1400}
            height={663}
            priority
            className="h-auto w-full object-cover"
          />
          <figcaption className="bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
            인지학습 전문 지도사 양성과정 · BTC 사업설명회 및 협약식 (2026. 2. 12, 동남보건대학교)
          </figcaption>
        </figure>
        <figure className="overflow-hidden rounded-2xl border border-slate-200 shadow-card">
          <Image
            src="/images/about/kyungwoon-training.jpg"
            alt="경운대학교 RISE총괄사업단 인지훈련 전문지도사 양성과정 단체사진"
            width={2600}
            height={1345}
            className="h-auto w-full object-cover"
          />
          <figcaption className="bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
            경운대학교 RISE총괄사업단 · 인지훈련 전문지도사 양성과정 (2025. 12. 6 ~ 2026. 1. 10, 별관 강의실 601호)
          </figcaption>
        </figure>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
        <p className="flex items-center gap-3 text-sm font-bold tracking-[0.18em] text-gold-600">
          <span className="inline-block h-px w-8 bg-gold-400" aria-hidden />
          교육 교재
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          인지훈련 전문지도사 양성 교재
        </h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-[220px_1fr] sm:items-start">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm">
            <Image
              src="/images/previews/lecture/cover.jpg"
              alt="뇌 건강 코칭, 1%의 변화를 이끄는 힘 표지"
              width={396}
              height={612}
              className="h-auto w-full object-contain"
            />
          </div>
          <div className="text-sm leading-7 text-slate-700">
            <p className="text-lg font-bold text-slate-950">뇌 건강 코칭, 1%의 변화를 이끄는 힘</p>
            <p className="mt-1 text-slate-500">대표저자 윤영철 · 공동저자 정호태, 전유진 · BTC 발행</p>
            <p className="mt-4">
              인지학습지도사 양성과정에서 사용하는 공식 교재입니다. 뇌건강과
              치매 예방의 이론부터, 어르신을 &lsquo;가르치는 선생님&rsquo;이 아닌
              잠재된 능력을 끌어내는 <strong>&lsquo;촉진자(Facilitator)&rsquo;</strong>로서의
              태도, 실제 60분 수업 운영·교안 작성·그룹 관리와 돌발 상황 대처까지
              현장 실무를 단계적으로 담았습니다.
            </p>
            <p className="mt-3">
              이론편(기초 다지기)과 실전편(수업 운영)으로 구성되어, 자격과정
              수강생이 수료 후 바로 현장에 적용할 수 있도록 설계되었습니다.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6">
          <h3 className="text-lg font-bold text-slate-950">차례</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {["toc1", "toc2", "toc3"].map((n) => (
              <figure
                key={n}
                className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm"
              >
                <Image
                  src={`/images/previews/lecture/${n}.jpg`}
                  alt="교재 차례"
                  width={396}
                  height={612}
                  className="h-auto w-full object-contain"
                />
              </figure>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6">
          <h3 className="text-lg font-bold text-slate-950">본문 예시</h3>
          <p className="mt-1 text-sm text-slate-500">교재 56 · 59페이지</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { src: "p56", label: "56페이지" },
              { src: "p59", label: "59페이지" },
            ].map((pg) => (
              <figure
                key={pg.src}
                className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm"
              >
                <Image
                  src={`/images/previews/lecture/${pg.src}.jpg`}
                  alt={`교재 ${pg.label} 예시`}
                  width={396}
                  height={612}
                  className="h-auto w-full object-contain"
                />
              </figure>
            ))}
          </div>
          <p className="mt-4 text-xs leading-6 text-slate-500">
            ※ 위 이미지는 교재 내용 일부 예시이며, 실제 인쇄본과 색상·해상도에
            차이가 있을 수 있습니다.
          </p>
        </div>
      </section>
    </div>
  );
}
