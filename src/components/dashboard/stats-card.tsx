import type { LucideIcon } from "lucide-react";

type Accent = "blue" | "amber" | "green" | "indigo" | "red";

const accentStyles: Record<Accent, string> = {
  blue: "bg-[#2563EB]/15 text-[#60A5FA]",
  amber: "bg-[#FFB020]/15 text-[#FFB020]",
  green: "bg-emerald-500/15 text-emerald-400",
  indigo: "bg-indigo-500/15 text-indigo-400",
  red: "bg-red-500/15 text-red-400",
};

/* Reusable overview stat card — same shape on every dashboard */
export default function StatsCard({
  label,
  value,
  icon: Icon,
  hint,
  accent = "blue",
  loading = false,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  hint?: string;
  accent?: Accent;
  loading?: boolean;
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#0B1020] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#FFB020]/60 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <span
          className={`grid size-12 shrink-0 place-items-center rounded-xl ${accentStyles[accent]}`}
        >
          <Icon size={22} />
        </span>

        {hint && (
          <span className="text-right text-xs font-medium text-slate-500">
            {hint}
          </span>
        )}
      </div>

      <p className="mt-5 text-3xl font-extrabold tracking-tight">
        {loading ? "—" : value}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-400">{label}</p>
    </div>
  );
}
