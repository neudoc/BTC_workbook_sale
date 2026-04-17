import Link from "next/link";

import { ButtonLink } from "@/components/ui/Button";
import { homepageContent } from "@/lib/data/homepage";

export default function HomePage() {
  const {
    hero,
    conversionTracks,
    services,
    reserve,
    products,
    experience,
    blog,
    expert,
    trust,
    finalCta
  } = homepageContent;

  return (
    <div className="space-y-12">
      <section
        id={hero.id}
        data-testid={hero.id}
        className="relative overflow-hidden rounded-[2rem] border border-brand-200 bg-[radial-gradient(circle_at_top_left,_rgba(214,235,224,0.95),_rgba(255,255,255,0.92)_42%,_rgba(241,245,249,0.96)_100%)] px-6 py-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] md:px-10 md:py-8 focus-within:ring-2 focus-within:ring-brand-600/20"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[linear-gradient(135deg,rgba(21,128,61,0.18),rgba(255,255,255,0))]" />
        <div className="pointer-events-none absolute -right-16 top-8 h-40 w-40 rounded-full bg-brand-100/80 blur-3xl" />
        <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.95fr)] lg:items-end">
          <div className="max-w-3xl">
            {hero.eyebrow ? (
              <p className="inline-flex rounded-full border border-brand-200 bg-white/80 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-brand-900 uppercase">
                {hero.eyebrow}
              </p>
            ) : null}
            <h1 className="mt-4 max-w-4xl text-3xl font-semibold tracking-tight text-slate-950 md:text-[3.1rem] md:leading-[1.04]">
              인지 케어 서비스를
              <br />
              더 빠르게 비교하고 연결하는 첫 화면
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-700 md:max-w-2xl md:text-lg">{hero.description}</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {hero.actions.map((action) => (
                <ButtonLink key={action.href} href={action.href} variant={action.variant}>
                  {action.label}
                </ButtonLink>
              ))}
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-600 md:max-w-2xl">{hero.disclaimer}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-3xl border border-white/70 bg-white/90 p-3.5 shadow-sm backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-800">대표 경로</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">3가지</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">쇼핑, 가맹 문의, 지도사 과정 흐름만 우선 배치했습니다.</p>
            </div>
            <div className="rounded-3xl border border-white/70 bg-slate-950 p-3.5 text-white shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-100">현재 안내</p>
              <p className="mt-2 text-lg font-semibold">참고/체험용 정보 중심</p>
              <p className="mt-1 text-sm leading-6 text-slate-300">의료 진단을 대체하지 않는 범위에서 체험과 안내를 제공합니다.</p>
            </div>
            <div className="rounded-3xl border border-brand-100 bg-brand-50/80 p-3.5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-800">전문가 흐름</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">로그인/승인 후 진행</p>
              <p className="mt-1 text-sm leading-6 text-slate-700">익명 전체 접근을 약속하지 않고, 필요한 절차를 먼저 안내합니다.</p>
            </div>
          </div>
        </div>
      </section>

      <section id={conversionTracks.id} data-testid={conversionTracks.id} className="mt-4 space-y-3 md:mt-8">
        <div className="max-w-3xl">
          <h2 className="text-xl font-semibold md:text-2xl">{conversionTracks.title}</h2>
          {conversionTracks.description ? (
            <p className="mt-2 text-sm text-slate-700 md:text-base">{conversionTracks.description}</p>
          ) : null}
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {conversionTracks.tracks.map((track) => (
            <Link
              key={track.title}
              href={track.href}
              className="group rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-[0_18px_45px_-38px_rgba(15,23,42,0.55)] transition-transform transition-colors hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-950">{track.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{track.description}</p>
                </div>
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-100 bg-brand-50 text-lg text-brand-900 transition-colors group-hover:bg-brand-100">
                  {"->"}
                </span>
              </div>
              <div className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-800">
                {track.href}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id={services.id} data-testid={services.id} className="space-y-5">
        <div className="max-w-3xl">
          <h2 className="text-xl font-semibold md:text-2xl">{services.title}</h2>
          {services.description ? <p className="mt-3 text-slate-700">{services.description}</p> : null}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {services.items.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_-38px_rgba(15,23,42,0.55)] transition-transform transition-colors hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50/30"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-800">{item.eyebrow}</p>
              <h3 className="mt-3 text-lg font-semibold text-slate-950 md:text-xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-700 md:text-base">{item.description}</p>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-700" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-900 group-hover:underline">
                {item.ctaLabel}
                <span aria-hidden="true">{"->"}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section
        id={reserve.id}
        data-testid={reserve.id}
        className="rounded-3xl border border-brand-100 bg-brand-50/50 p-8 md:p-10"
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.35fr)] lg:items-start">
          <div>
            {reserve.eyebrow ? <p className="text-sm font-medium text-brand-800">{reserve.eyebrow}</p> : null}
            <h2 className="mt-3 text-xl font-semibold md:text-2xl">{reserve.title}</h2>
            {reserve.description ? <p className="mt-3 leading-7 text-slate-700">{reserve.description}</p> : null}
            <div className="mt-5 flex flex-wrap gap-3">
              {reserve.actions.map((action) => (
                <ButtonLink key={action.href} href={action.href} variant={action.variant}>
                  {action.label}
                </ButtonLink>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {reserve.blocks.map((block) => (
              <article key={block.title} className="rounded-2xl border border-brand-100 bg-white p-5">
                <h3 className="text-base font-semibold text-slate-950">{block.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-700">{block.description}</p>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
                  {block.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-700" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id={products.id} data-testid={products.id} className="space-y-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-xl font-semibold md:text-2xl">{products.title}</h2>
            {products.description ? <p className="mt-3 text-slate-700">{products.description}</p> : null}
          </div>
          <ButtonLink href={products.action.href} variant={products.action.variant}>
            {products.action.label}
          </ButtonLink>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {products.items.map((item) => (
            <Link
              key={item.slug}
              href={products.action.href}
              className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_-38px_rgba(15,23,42,0.55)] transition-transform transition-colors hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50/30"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-800">대표 상품</p>
                  <h3 className="mt-3 text-lg font-semibold text-slate-950">{item.title}</h3>
                </div>
                <span className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-900">
                  {item.price.toLocaleString("ko-KR")}원
                </span>
              </div>
              <p className="mt-4 min-h-[4.5rem] text-sm leading-6 text-slate-700">{item.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-900 group-hover:underline">
                쇼핑몰에서 보기
                <span aria-hidden="true">{"->"}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section
        id={experience.id}
        data-testid={experience.id}
        className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10"
      >
        <div className="max-w-3xl">
          <h2 className="text-xl font-semibold md:text-2xl">{experience.title}</h2>
          {experience.description ? <p className="mt-3 text-slate-700">{experience.description}</p> : null}
          <p className="mt-3 text-sm leading-6 text-slate-600">{experience.disclaimer}</p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {experience.actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group rounded-[1.75rem] border border-brand-100 bg-brand-50/45 p-6 shadow-[0_18px_45px_-38px_rgba(15,23,42,0.4)] transition-transform transition-colors hover:-translate-y-0.5 hover:border-brand-200 hover:bg-white"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-800">체험 시작</p>
              <h3 className="mt-3 text-lg font-semibold text-slate-950">{action.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-700">{action.description}</p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-900 group-hover:underline">
                {action.label}
                <span aria-hidden="true">{"->"}</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {experience.bullets.map((group) => (
            <div key={group.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-semibold">{group.title}</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id={blog.id} data-testid={blog.id} className="space-y-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-xl font-semibold md:text-2xl">{blog.title}</h2>
            {blog.description ? <p className="mt-3 text-slate-700">{blog.description}</p> : null}
          </div>
          <ButtonLink href={blog.action.href} variant={blog.action.variant}>
            {blog.action.label}
          </ButtonLink>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {blog.items.map((post) => (
            <Link
              key={post.slug}
              href={blog.action.href}
              className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_-38px_rgba(15,23,42,0.55)] transition-transform transition-colors hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50/30"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-brand-800">{post.category}</p>
                <p className="text-sm text-slate-500">{post.date}</p>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-slate-950">{post.title}</h3>
              <p className="mt-3 min-h-[4.5rem] text-sm leading-6 text-slate-700">{post.excerpt}</p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-900 group-hover:underline">
                블로그에서 이어보기
                <span aria-hidden="true">{"->"}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section
        id={expert.id}
        data-testid={expert.id}
        className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10"
      >
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-xl font-semibold md:text-2xl">{expert.title}</h2>
            {expert.description ? <p className="mt-3 text-slate-700">{expert.description}</p> : null}
            <div className="mt-5 flex flex-wrap gap-3">
              {expert.actions.map((action) => (
                <ButtonLink key={action.href} href={action.href} variant={action.variant}>
                  {action.label}
                </ButtonLink>
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              게스트는 전문가센터 소개와 과정 개요를 먼저 확인하고, 전체 교육자료와 운영 도구는 로그인 또는 승인 후
              이어집니다.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="font-semibold">안내 범위</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              {expert.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        id={trust.id}
        data-testid={trust.id}
        className="rounded-3xl border border-slate-200 bg-slate-50 p-8 md:p-10"
      >
        <div className="max-w-3xl">
          <h2 className="text-xl font-semibold md:text-2xl">{trust.title}</h2>
          {trust.description ? <p className="mt-3 text-slate-700">{trust.description}</p> : null}
        </div>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {trust.points.map((point) => (
            <li key={point.title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-800">Trust Proof</p>
              <h3 className="mt-3 text-base font-semibold text-slate-950">{point.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-700">{point.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section
        id={finalCta.id}
        data-testid={finalCta.id}
        className="rounded-3xl border border-brand-100 bg-gradient-to-br from-white to-brand-50 p-8 md:p-12"
      >
        <div className="max-w-3xl">
          {finalCta.eyebrow ? <p className="text-sm font-medium text-brand-800">{finalCta.eyebrow}</p> : null}
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-4xl">{finalCta.title}</h2>
          {finalCta.description ? <p className="mt-4 text-slate-700 md:text-lg">{finalCta.description}</p> : null}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {finalCta.actions.map((action) => (
              <ButtonLink key={`${action.href}-${action.label}`} href={action.href} variant={action.variant}>
                {action.label}
              </ButtonLink>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-600">{finalCta.disclaimer}</p>
        </div>
      </section>
    </div>
  );
}
