"use client";

import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  CreditCard,
  CircleCheck,
  Search,
  Wrench,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import OverviewHeader from "@/components/dashboard/overview-header";
import StatsCard from "@/components/dashboard/stats-card";

/* Quick actions → the customer's main pages */
const actions = [
  {
    label: "Browse Services",
    description: "Find verified technicians",
    href: "/services",
    icon: Search,
  },
  {
    label: "My Bookings",
    description: "Track every repair job",
    href: "/dashboard/customer/bookings",
    icon: ClipboardList,
  },
  {
    label: "Payment History",
    description: "Receipts & transactions",
    href: "/dashboard/customer/payments",
    icon: CreditCard,
  },
];

export default function CustomerDashboardPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  /* TODO(Phase C): replace these zeros with real data from
     GET /api/bookings/my (verifyToken + verifyCustomer):
     - total   = bookings.length
     - active  = status is requested | accepted | in-progress
     - done    = status is completed */
  const total = 0;
  const active = 0;
  const completed = 0;

  return (
    <div className="space-y-6">
      <OverviewHeader
        kicker="Customer Dashboard"
        name={user?.name ?? "there"}
        subtitle="Track your repair requests and payments — every job, one place."
        roleLabel="Customer"
      />

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          label="Total Requests"
          value={total}
          icon={ClipboardList}
          accent="blue"
          hint="All time"
        />
        <StatsCard
          label="Active Jobs"
          value={active}
          icon={Wrench}
          accent="amber"
          hint="In progress"
        />
        <StatsCard
          label="Completed Jobs"
          value={completed}
          icon={CircleCheck}
          accent="green"
          hint="All time"
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

      {/* Requests panel — friendly empty state until bookings API exists */}
      {total === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 bg-[#0B1020]/60 px-6 py-12 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#2563EB]/15 text-[#FFB020]">
            <ClipboardList size={30} />
          </div>

          <h2 className="mt-5 text-lg font-bold">No repair requests yet</h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
            Send your first repair request and follow it step by step — from
            requested, to accepted, to completed.
          </p>

          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#FFB020] px-6 py-3 text-sm font-bold text-[#05070D] transition hover:bg-[#2563EB] hover:text-white"
          >
            Browse Services
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-[#0B1020] p-6">
          <h2 className="text-base font-bold">Recent requests</h2>
          {/* TODO(Phase C): list the customer's latest bookings with
              status + payment badges here */}
        </div>
      )}
    </div>
  );
}
