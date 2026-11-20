"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardList,
  Clock,
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
  approvalStatus: string;
  createdAt: string;
};

/* Quick actions → the admin's main pages */
const actions = [
  {
    label: "Service Approvals",
    description: "Approve or reject listings",
    href: "/dashboard/admin/services",
    icon: BadgeCheck,
  },
  {
    label: "Manage Users",
    description: "Change roles & access",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    label: "All Bookings",
    description: "Monitor every job",
    href: "/dashboard/admin/bookings",
    icon: ClipboardList,
  },
];

const breakdownRow =
  "grid items-center gap-3 text-sm sm:grid-cols-[9rem_1fr_2.5rem]";

const barTrack = "h-2.5 overflow-hidden rounded-full bg-white/5";

export default function AdminDashboardPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [services, setServices] = useState<Service[] | null>(null);

  /* Public catalogue → approval breakdown. TODO(Phase C): swap to the
     protected admin APIs for users/bookings/transactions. */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await getServices();
        if (!cancelled && Array.isArray(data)) {
          setServices(data as Service[]);
        } else if (!cancelled) {
          setServices([]);
        }
      } catch {
        if (!cancelled) setServices([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const loading = services === null;
  const all = services ?? [];

  const counts = {
    pending: all.filter((s) => s.approvalStatus === "pending").length,
    approved: all.filter((s) => s.approvalStatus === "approved").length,
    rejected: all.filter((s) => s.approvalStatus === "rejected").length,
  };
  const max = Math.max(counts.pending, counts.approved, counts.rejected, 1);

  /* TODO(Phase C): GET /api/admin/users → totalUsers / totalTechnicians */
  const totalUsers = 0;
  const totalTechnicians = 0;

  const pendingQueue = all
    .filter((s) => s.approvalStatus === "pending")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const breakdown = [
    { label: "Pending", count: counts.pending, bar: "bg-[#FFB020]" },
    { label: "Approved", count: counts.approved, bar: "bg-emerald-400" },
    { label: "Rejected", count: counts.rejected, bar: "bg-red-400" },
  ];

  return (
    <div className="space-y-6">
      <OverviewHeader
        kicker="Admin Dashboard"
        name={user?.name ?? "there"}
        subtitle="Moderate listings, manage users and keep the whole platform healthy."
        roleLabel="Admin"
      />

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          label="Total Users"
          value={totalUsers}
          icon={Users}
          accent="blue"
          hint="All accounts"
        />
        <StatsCard
          label="Total Technicians"
          value={totalTechnicians}
          icon={UserCheck}
          accent="indigo"
          hint="On the platform"
        />
        <StatsCard
          label="Pending Services"
          value={counts.pending}
          icon={Clock}
          accent="amber"
          loading={loading}
          hint="Awaiting review"
        />
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.href}
              href={action.href}
              className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0B1020] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#FFB020]"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#2563EB]/15 text-[#FFB020] transition group-hover:bg-[#2563EB] group-hover:text-white">
                <Icon size={19} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold">
                  {action.label}
                </span>
                <span className="block truncate text-xs text-slate-400">
                  {action.description}
                </span>
              </span>

              <ArrowRight
                size={16}
                className="shrink-0 text-slate-500 transition group-hover:text-[#FFB020]"
              />
            </Link>
          );
        })}
      </div>

      {/* Approval breakdown + queue */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart: service approval breakdown */}
        <div className="rounded-3xl border border-white/10 bg-[#0B1020] p-6">
          <h2 className="text-base font-bold">Service approval breakdown</h2>

          {loading ? (
            <div className="mt-6 space-y-4" aria-hidden>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-6 animate-pulse rounded bg-white/5" />
              ))}
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {breakdown.map((row) => (
                <div key={row.label} className={breakdownRow}>
                  <span className="font-medium text-slate-300">
                    {row.label}
                  </span>

                  <span className={barTrack}>
                    <span
                      className={`block h-full rounded-full ${row.bar}`}
                      style={{ width: `${(row.count / max) * 100}%` }}
                    />
                  </span>

                  <span className="text-right font-bold">{row.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending queue */}
        <div className="rounded-3xl border border-white/10 bg-[#0B1020] p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-base font-bold">Awaiting approval</h2>

            {pendingQueue.length > 0 && (
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
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded-xl bg-white/5" />
              ))}
            </div>
          ) : pendingQueue.length === 0 ? (
            <div className="mt-6 px-4 py-8 text-center">
              <div className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
                <BadgeCheck size={26} />
              </div>

              <h3 className="mt-4 text-sm font-bold">All caught up</h3>

              <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-slate-400">
                No services are waiting for review. New submissions from
                technicians will appear here.
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
              {pendingQueue.map((service) => (
                <li
                  key={service._id}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#05070D]/60 p-3.5"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#FFB020]/15 text-[#FFB020]">
                    <Clock size={16} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{service.title}</p>
                    <p className="truncate text-xs text-slate-400">
                      {service.category} · {service.technicianName}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
