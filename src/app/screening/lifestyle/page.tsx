import type { Metadata } from "next";
import Link from "next/link";
import { LifestyleCheck } from "@/components/screening/LifestyleCheck";

export const metadata: Metadata = {
  title: "자가점검 - 생활습관 체크",
  description: "수면/운동/식사/사회활동 등 생활습관 체크"
};

export default function LifestylePage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="text-sm text-slate-600">
        <Link className="hover:underline" href="/screening">
          자가점검
        </Link>{" "}
        / 생활습관 체크
      </div>
      <LifestyleCheck />
    </div>
  );
}

