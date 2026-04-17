import Link from "next/link";

export function FeatureCard({
  title,
  description,
  href
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-6 hover:border-brand-200 hover:bg-brand-50/30 transition-colors"
    >
      <div className="text-lg font-semibold">{title}</div>
      <div className="mt-2 text-slate-700">{description}</div>
      <div className="mt-4 text-sm text-brand-800 group-hover:underline">
        자세히 보기
      </div>
    </Link>
  );
}

