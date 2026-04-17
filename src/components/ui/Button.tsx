import Link from "next/link";

type Variant = "primary" | "outline" | "soft";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-700 text-white hover:bg-brand-800 border border-brand-700",
  outline:
    "bg-white text-slate-900 hover:bg-slate-50 border border-slate-200",
  soft:
    "bg-brand-50 text-brand-900 hover:bg-brand-100 border border-brand-100"
};

export function ButtonLink({
  href,
  children,
  variant = "primary"
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-xl px-5 py-3 font-medium transition-colors ${variants[variant]}`}
    >
      {children}
    </Link>
  );
}
