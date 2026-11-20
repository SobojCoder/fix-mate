"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
import { getBooking } from "@/lib/api/booking";
import OverviewHeader from "@/components/dashboard/overview-header";
import StatsCard from "@/components/dashboard/stats-card";

type Booking = {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: string;
  basePrice: number;
  preferredDate: string;
  status: string;
  paymentStatus: string;
};

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

/* Spec status colors: Requested=blue, Accepted=indigo, In Progress=amber,
   Completed=green, Rejected=red, Cancelled=gray */
const statusBadge: Record<string, string> = {
  requested: "border-blue-400/40 bg-blue-400/10 text-blue-400",
  accepted: "border-indigo-400/40 bg-indigo-400/10 text-indigo-400",
  "in progress": "border-amber-400/40 bg-amber-400/10 text-amber-400",
  in_progress: "border-amber-400/40 bg-amber-400/10 text-amber-400",
  "in-progress": "border-amber-400/40 bg-amber-400/10 text-amber-400",
  completed: "border-emerald-400/40 bg-emerald-400/10 text-emerald-400",
  rejected: "border-red-400/40 bg-red-400/10 text-red-400",
  cancelled: "border-slate-400/40 bg-slate-400/10 text-slate-400",
};

const payBadge: Record<string, string> = {
  paid: "border-emerald-400/40 bg-emerald-400/10 text-emerald-400",
  unpaid: "border-amber-400/40 bg-amber-400/10 text-amber-400",
};

/* Active = requested, accepted or in progress (any spelling) */
function isActiveStatus(status: string) {
  const s = (status || "").toLowerCase();
  return (
    s === "requested" ||
    s === "accepted" ||
    s === "in progress" ||
    s === "in_progress" ||
    s === "in-progress"
  );
}

export default function CustomerDashboardPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const id = user?.id;

  const [bookings, setBookings] = useState<Booking[] | null>(null);

  /* My bookings for the stat cards. TODO(Phase C): swap to the protected
     GET /bookings/my (verifyToken + verifyCustomer) once it exists —
     same query, the server does the filtering. */
  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    (async () => {
      try {
        const data = await getBooking(`applicantId=${id}`);
        if (!cancelled) setBookings(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setBookings([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const loading = bookings === null;
  const list = bookings ?? [];

  const total = list.length;
  const active = list.filter((b) => isActiveStatus(b.status)).length;
  const completed = list.filter(
    (b) => (b.status || "").toLowerCase() === "completed",
  ).length;

  /* Latest 5 — booking ids are ObjectIds, so a bigger id means newer */
  const recent = [...list]
    .sort((a, b) => (a._id < b._id ? 1 : -1))
    .slice(0, 5);

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
          loading={loading}
        />
        <StatsCard
          label="Active Jobs"
          value={active}
          icon={Wrench}
          accent="amber"
          hint="In progress"
          loading={loading}
        />
        <StatsCard
          label="Completed Jobs"
          value={completed}
          icon={CircleCheck}
          accent="green"
          hint="All time"
          loading={loading}
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

      {/* Requests panel */}
      {loading ? (
        <div
          aria-hidden
          className="space-y-3 rounded-3xl border border-white/10 bg-[#0B1020] p-6"
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      ) : total === 0 ? (
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
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-base font-bold">Recent requests</h2>

            <Link
              href="/dashboard/customer/bookings"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] transition hover:text-[#FFB020]"
            >
              View all
              <ArrowRight size={14} />
            </Link>
          </div>

          <ul className="mt-5 space-y-3">
            {recent.map((booking) => (
              <li
                key={booking._id}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#05070D]/60 p-3"
              >
                <Image
                  src={booking.serviceImage}
                  alt={booking.serviceTitle}
                  width={44}
                  height={44}
                  unoptimized
                  className="size-11 shrink-0 rounded-lg object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">
                    {booking.serviceTitle}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {booking.category} · {booking.preferredDate}
                  </p>
                </div>

                <span
                  className={`hidden shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider sm:block ${
                    statusBadge[booking.status] ?? statusBadge.requested
                  }`}
                >
                  {booking.status}
                </span>

                <span
                  className={`hidden shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider md:block ${
                    payBadge[booking.paymentStatus] ?? payBadge.unpaid
                  }`}
                >
                  {booking.paymentStatus}
                </span>

                <span className="shrink-0 text-sm font-bold text-[#FFB020]">
                  ৳{booking.basePrice}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
