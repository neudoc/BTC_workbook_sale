import type { Metadata } from "next";
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
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
