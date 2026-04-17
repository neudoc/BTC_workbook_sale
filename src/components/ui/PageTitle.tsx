export function PageTitle({
  title,
  description
}: {
  title: string;
  description?: string;
}) {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
        {title}
      </h1>
      {description ? (
        <p className="mt-2 text-slate-700 md:text-lg">{description}</p>
      ) : null}
    </div>
  );
}

