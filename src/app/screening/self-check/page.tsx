import type { Metadata } from "next";
import Link from "next/link";
import { ScreeningSelfCheck } from "@/components/screening/ScreeningSelfCheck";

export const metadata: Metadata = {
  title: "자가점검 - 인지건강 자가점검",
  description: "기억/주의/일상 변화에 대한 간단 체크(참고용)"
};

export default function SelfCheckPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="text-sm text-slate-600">
        <Link className="hover:underline" href="/screening">
          자가점검
        </Link>{" "}
        / 인지건강 자가점검
      </div>
      <ScreeningSelfCheck />
    </div>
  );
}

