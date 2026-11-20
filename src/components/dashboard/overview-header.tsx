/* Shared greeting header for every dashboard overview page */
export default function OverviewHeader({
  kicker,
  name,
  subtitle,
  roleLabel,
}: {
  kicker: string;
  name: string;
  subtitle: string;
  roleLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">
          {kicker}
        </p>

        <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight md:text-3xl">
          Welcome back, <span className="text-[#FFB020]">{name}</span>
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
          {subtitle}
        </p>
      </div>

      <span className="inline-flex shrink-0 items-center rounded-full border border-[#FFB020]/40 bg-[#FFB020]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FFB020]">
        {roleLabel}
      </span>
    </div>
  );
}
