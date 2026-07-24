import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";
import { ContactForm } from "@/components/contact/ContactForm";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "구매 및 지도사 문의",
  description: "인지학습 교재 구매, 기관 도입, 인지학습지도사 교육과 제휴를 문의하세요.",
};

export default function ContactPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="space-y-5">
        <PageTitle
          title="구매 및 지도사 문의"
          description="인지학습 교재 선택, 기관 도입, 인지학습지도사 과정, 제휴 상담을 남겨 주세요."
        />
        <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-700 shadow-sm">
          <p className="font-bold text-slate-950">{siteConfig.contact.company}</p>
          <p className="text-slate-500">대표 {siteConfig.contact.ceo}</p>
          <dl className="mt-3 space-y-2">
            <div>
              <dt className="text-xs font-semibold text-slate-500">본사주소</dt>
              <dd>{siteConfig.contact.address}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-slate-500">상담시간</dt>
              <dd>{siteConfig.contact.hours}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-slate-500">문의전화</dt>
              <dd>
                <a className="font-semibold text-brand-700 hover:underline" href={`tel:${siteConfig.contact.phone}`}>
                  {siteConfig.contact.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-slate-500">이메일</dt>
              <dd>
                <a className="font-semibold text-brand-700 hover:underline" href={`mailto:${siteConfig.contact.email}`}>
                  {siteConfig.contact.email}
                </a>
              </dd>
            </div>
          </dl>
        </div>
        <div className="rounded-lg border border-brand-200 bg-brand-50 p-5 text-sm leading-7 text-slate-700">
          <p className="font-bold text-brand-950">상담 시 알려주시면 좋은 내용</p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>가정용, 기관용, 지도사용 중 어떤 목적이신지</li>
            <li>대상자의 연령대와 인지학습 경험</li>
            <li>교재 구매, 교육 신청, 제휴 문의 중 필요한 항목</li>
          </ul>
        </div>
      </div>
      <ContactForm />
    </div>
  );
}
