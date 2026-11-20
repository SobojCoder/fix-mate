"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CirclePlus,
  ClipboardList,
  Clock,
  LayoutGrid,
  Wrench,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { getServices } from "@/lib/api/services";
import OverviewHeader from "@/components/dashboard/overview-header";
import StatsCard from "@/components/dashboard/stats-card";

type Service = {
  _id: string;
  title: string;
  category: string;
  image: string;
  basePrice: number;
  technicianEmail: string;
  approvalStatus: string;
  isAvailable: boolean;
  createdAt: string;
};

/* Quick actions → the technician's main pages */
const actions = [
  {
    label: "Add Service",
    description: "List a new repair service",
    href: "/dashboard/technician/add-service",
    icon: CirclePlus,
  },
  {
    label: "My Services",
    description: "Edit, pause or delete",
    href: "/dashboard/technician/my-services",
    icon: Wrench,
  },
  {
    label: "Manage Requests",
    description: "Accept & update jobs",
    href: "/dashboard/technician/requests",
    icon: ClipboardList,
  },
];

const approvalBadge: Record<string, string> = {
  pending: "border-amber-400/40 bg-amber-400/10 text-amber-400",
  approved: "border-emerald-400/40 bg-emerald-400/10 text-emerald-400",
  rejected: "border-red-400/40 bg-red-400/10 text-red-400",
};

export default function TechnicianDashboardPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [services, setServices] = useState<Service[] | null>(null);

  /* All services (public API). TODO(Phase C): replace with the protected
     GET /api/technician/services so the server does the owner filtering. */
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
  const mine = (services ?? []).filter((s) => s.technicianEmail === user?.email);
  const approved = mine.filter((s) => s.approvalStatus === "approved").length;

  /* TODO(Phase C): pending requests = count of bookings with
     status 'requested' for this technician (GET /api/bookings/technician) */
  const pendingRequests = 0;

  const recent = [...mine]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <OverviewHeader
        kicker="Technician Dashboard"
        name={user?.name ?? "there"}
        subtitle="Manage your services and turn incoming requests into finished jobs."
        roleLabel="Technician"
      />

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          label="Total Services"
          value={mine.length}
          icon={LayoutGrid}
          accent="blue"
          loading={loading}
          hint="You listed"
        />
        <StatsCard
          label="Approved Services"
          value={approved}
          icon={BadgeCheck}
          accent="green"
          loading={loading}
          hint={mine.length > 0 ? `of ${mine.length}` : "Live on the site"}
        />
        <StatsCard
          label="Pending Requests"
          value={pendingRequests}
          icon={Clock}
          accent="amber"
          hint="Needs action"
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

      {/* Your services */}
      <div className="rounded-3xl border border-white/10 bg-[#0B1020] p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-bold">Your services</h2>

          {mine.length > 0 && (
            <Link
              href="/dashboard/technician/my-services"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] transition hover:text-[#FFB020]"
            >
              View all
              <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="mt-5 space-y-3" aria-hidden>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-white/5" />
            ))}
          </div>
        ) : mine.length === 0 ? (
          <div className="mt-6 px-4 py-8 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-[#2563EB]/15 text-[#FFB020]">
              <CirclePlus size={26} />
            </div>

            <h3 className="mt-4 text-sm font-bold">No services yet</h3>

            <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-slate-400">
              Add your first repair service — it goes to the admin for approval
              before customers can see it.
            </p>

            <Link
              href="/dashboard/technician/add-service"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#FFB020] px-5 py-2.5 text-sm font-bold text-[#05070D] transition hover:bg-[#2563EB] hover:text-white"
            >
              Add Service
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <ul className="mt-5 space-y-3">
            {recent.map((service) => (
              <li
                key={service._id}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#05070D]/60 p-3"
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  width={44}
                  height={44}
                  unoptimized
                  className="size-11 shrink-0 rounded-lg object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{service.title}</p>
                  <p className="truncate text-xs text-slate-400">
                    {service.category} · ৳{service.basePrice}
                  </p>
                </div>

                <span
                  className={`hidden shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider sm:block ${
                    approvalBadge[service.approvalStatus] ??
                    approvalBadge.pending
                  }`}
                >
                  {service.approvalStatus}
                </span>

                <span
                  title={service.isAvailable ? "Available" : "Hidden"}
                  className={`size-2.5 shrink-0 rounded-full ${
                    service.isAvailable ? "bg-emerald-400" : "bg-slate-600"
                  }`}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
