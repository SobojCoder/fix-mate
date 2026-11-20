"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardList,
  Clock,
  CreditCard,
  UserCheck,
  Users,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { getServices } from "@/lib/api/services";
import OverviewHeader from "@/components/dashboard/overview-header";
import StatsCard from "@/components/dashboard/stats-card";

type Service = {
  _id: string;
  title: string;
  category: string;
  technicianName: string;
  approvalStatus: "pending" | "approved" | "rejected" | string;
  createdAt: string;
};

/* Shortcuts to the admin's main pages */
const shortcuts = [
  { label: "Service approvals", hint: "Approve or reject listings", href: "/dashboard/admin/services", icon: BadgeCheck },
  { label: "Manage users", hint: "Change roles and access", href: "/dashboard/admin/users", icon: Users },
  { label: "All bookings", hint: "Monitor every job", href: "/dashboard/admin/bookings", icon: ClipboardList },
  { label: "Transactions", hint: "Stripe payments and revenue", href: "/dashboard/admin/transactions", icon: CreditCard },
];

const card = "rounded-3xl border border-white/10 bg-[#0B1020] p-6";

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.max(1, Math.round(diff / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

/* Donut chart: pending / approved / rejected */
function Donut({
  segments,
  total,
  centerValue,
  centerLabel,
}: {
  segments: { label: string; value: number; color: string }[];
  total: number;
  centerValue: string;
  centerLabel: string;
}) {
  const r = 52;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="relative mx-auto size-44">
      <svg viewBox="0 0 140 140" className="size-full -rotate-90" role="img" aria-label="Service approval breakdown">
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
        {total > 0 &&
          segments.map((s) => {
            const len = (s.value / total) * c;
            const el = (
              <circle
                key={s.label}
                cx="70"
                cy="70"
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth="14"
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset}
              />
            );
            offset += len;
            return el;
          })}
      </svg>

      <div className="absolute inset-0 grid place-content-center text-center">
        <span className="text-3xl font-extrabold leading-none">{centerValue}</span>
        <span className="mt-1 text-xs text-slate-400">{centerLabel}</span>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [services, setServices] = useState<Service[] | null>(null);

  /* TODO(Phase C): swap to the protected admin APIs
     (GET /api/admin/users, /api/admin/bookings, /api/admin/payments). */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await getServices();
        if (!cancelled) setServices(Array.isArray(data) ? (data as Service[]) : []);
      } catch {
        if (!cancelled) setServices([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const loading = services === null;

  const stats = useMemo(() => {
    const all = services ?? [];
    const pending = all.filter((s) => s.approvalStatus === "pending");
    const approved = all.filter((s) => s.approvalStatus === "approved").length;
    const rejected = all.filter((s) => s.approvalStatus === "rejected").length;

    const byCategory = Object.entries(
      all.reduce<Record<string, number>>((acc, s) => {
        acc[s.category] = (acc[s.category] ?? 0) + 1;
        return acc;
      }, {}),
    ).sort((a, b) => b[1] - a[1]);

    const queue = [...pending]
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .slice(0, 5);

    const reviewed = approved + rejected;

    return {
      total: all.length,
      pending: pending.length,
      approved,
      rejected,
      byCategory,
      queue,
      approvalRate: reviewed ? Math.round((approved / reviewed) * 100) : null,
    };
  }, [services]);

  /* TODO(Phase C): GET /api/admin/users → totalUsers / totalTechnicians */
  const totalUsers = 0;
  const totalTechnicians = 0;

  const segments = [
    { label: "Pending", value: stats.pending, color: "#FFB020" },
    { label: "Approved", value: stats.approved, color: "#34D399" },
    { label: "Rejected", value: stats.rejected, color: "#F87171" },
  ];
  const topCategory = stats.byCategory[0]?.[1] ?? 1;

  return (
    <div className="space-y-6">
      <OverviewHeader
        kicker="Admin Dashboard"
        name={user?.name ?? "there"}
        subtitle={
          loading
            ? "Moderate listings, manage users and keep the platform healthy."
            : stats.pending > 0
              ? `${stats.pending} ${stats.pending === 1 ? "service is" : "services are"} waiting for your review.`
              : "Every listing has been reviewed. Nothing is waiting on you."
        }
        roleLabel="Admin"
      />

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard label="Total Users" value={totalUsers} icon={Users} accent="blue" hint="All accounts" />
        <StatsCard label="Total Technicians" value={totalTechnicians} icon={UserCheck} accent="indigo" hint="On the platform" />
        <StatsCard label="Pending Services" value={stats.pending} icon={Clock} accent="amber" loading={loading} hint="Awaiting review" />
      </div>

      {/* Moderation queue (main focus) + approval chart */}
      <div className="grid gap-6 lg:grid-cols-5">
        <section className={`${card} lg:col-span-3`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold">Moderation queue</h2>
              <p className="mt-0.5 text-xs text-slate-400">Oldest submissions first</p>
            </div>

            {stats.queue.length > 0 && (
              <Link
                href="/dashboard/admin/services"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] transition hover:text-[#FFB020]"
              >
                Review all
                <ArrowRight size={14} />
              </Link>
            )}
          </div>

          {loading ? (
            <div className="mt-5 space-y-3" aria-hidden>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-2xl bg-white/5" />
              ))}
            </div>
          ) : stats.queue.length === 0 ? (
            <div className="mt-6 px-4 py-10 text-center">
              <div className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
                <BadgeCheck size={26} />
              </div>
              <h3 className="mt-4 text-sm font-bold">All caught up</h3>
              <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-slate-400">
                New services from technicians will show up here as soon as they are submitted.
              </p>
              <Link
                href="/dashboard/admin/services"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#FFB020] px-5 py-2.5 text-sm font-bold text-[#05070D] transition hover:bg-[#2563EB] hover:text-white"
              >
                View all services
                <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <ul className="mt-5 space-y-3">
              {stats.queue.map((service) => (
                <li key={service._id}>
                  <Link
                    href="/dashboard/admin/services"
                    className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-[#05070D]/60 p-4 transition hover:border-[#FFB020]/60"
                  >
                    <span className="h-10 w-1 shrink-0 rounded-full bg-[#FFB020]" aria-hidden />

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold">{service.title}</span>
                      <span className="mt-0.5 block truncate text-xs text-slate-400">
                        {service.technicianName}
                      </span>
                    </span>

                    <span className="hidden shrink-0 rounded-full bg-[#2563EB]/15 px-3 py-1 text-xs font-semibold text-[#7AA2F7] sm:inline">
                      {service.category}
                    </span>

                    <span className="shrink-0 text-xs text-slate-500">{timeAgo(service.createdAt)}</span>

                    <ArrowRight size={16} className="shrink-0 text-slate-600 transition group-hover:text-[#FFB020]" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={`${card} lg:col-span-2`}>
          <h2 className="text-base font-bold">Approval breakdown</h2>
          <p className="mt-0.5 text-xs text-slate-400">All listings by review status</p>

          {loading ? (
            <div className="mx-auto mt-6 size-44 animate-pulse rounded-full bg-white/5" aria-hidden />
          ) : (
            <>
              <div className="mt-6">
                <Donut
                  segments={segments}
                  total={stats.total}
                  centerValue={stats.approvalRate === null ? "—" : `${stats.approvalRate}%`}
                  centerLabel="approved"
                />
              </div>

              <ul className="mt-6 space-y-2.5">
                {segments.map((s) => (
                  <li key={s.label} className="flex items-center gap-3 text-sm">
                    <span className="size-2.5 rounded-full" style={{ backgroundColor: s.color }} aria-hidden />
                    <span className="flex-1 text-slate-300">{s.label}</span>
                    <span className="font-bold">{s.value}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>

      {/* Category distribution + shortcuts */}
      <div className="grid gap-6 lg:grid-cols-5">
        <section className={`${card} lg:col-span-3`}>
          <h2 className="text-base font-bold">Services by category</h2>
          <p className="mt-0.5 text-xs text-slate-400">Where technicians are listing the most work</p>

          {loading ? (
            <div className="mt-5 space-y-4" aria-hidden>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-6 animate-pulse rounded bg-white/5" />
              ))}
            </div>
          ) : stats.byCategory.length === 0 ? (
            <p className="mt-6 text-sm text-slate-400">No services have been listed yet.</p>
          ) : (
            <ul className="mt-5 space-y-4">
              {stats.byCategory.map(([name, count]) => (
                <li key={name} className="grid items-center gap-3 text-sm sm:grid-cols-[9rem_1fr_2rem]">
                  <span className="truncate font-medium text-slate-300">{name}</span>
                  <span className="h-2.5 overflow-hidden rounded-full bg-white/5">
                    <span
                      className="block h-full rounded-full bg-[#2563EB]"
                      style={{ width: `${(count / topCategory) * 100}%` }}
                    />
                  </span>
                  <span className="text-right font-bold">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={`${card} lg:col-span-2`}>
          <h2 className="text-base font-bold">Jump to</h2>
          <ul className="mt-4 space-y-2">
            {shortcuts.map(({ label, hint, href, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFB020]"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#2563EB]/15 text-[#FFB020] transition group-hover:bg-[#2563EB] group-hover:text-white">
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">{label}</span>
                    <span className="block truncate text-xs text-slate-400">{hint}</span>
                  </span>
                  <ArrowRight size={15} className="shrink-0 text-slate-600 transition group-hover:text-[#FFB020]" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}