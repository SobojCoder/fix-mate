import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Clock,
  House,
  Mail,
  MapPin,
  Store,
} from "lucide-react";

import { getServiceId, getServices } from "@/lib/api/services";
import RequestRepair from "@/components/services/request-repair";
import Navbar from "@/components/navbar";

type Service = {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: string;
  isAvailable: boolean;
  createdAt: string;
};

export default function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="min-h-screen bg-[#05070D] px-6 py-10 text-white md:px-12">
      <div className="mx-auto max-w-6xl">
        <Suspense fallback={<DetailsSkeleton />}>
          <ServiceDetails params={params} />
        
        </Suspense>
      </div>
    </div>
  );
}

async function ServiceDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const service = await getServiceId(id);
console.log(service);
  /* Spec: missing, unapproved or unavailable → Not Found */
  if (!service || service.approvalStatus !== "approved" || !service.isAvailable) {
    notFound();
  }

  const isHomeVisit = service.serviceMode === "Home Visit";

  return (
      <>
      
      {/* Back link */}
      <Link
        href="/services"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-[#FFB020]"
      >
        <ArrowLeft size={16} />
        Back to services
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* ── Main column ── */}
        <div className="space-y-6 lg:col-span-2">
          {/* Large image */}
          <div className="relative h-64 overflow-hidden rounded-3xl border border-white/10 sm:h-80">
            <Image
              src={service.image}
              alt={service.title}
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
            />

            <span className="absolute left-4 top-4 rounded-full bg-[#05070D]/90 px-4 py-1.5 text-xs font-bold text-[#FFB020] backdrop-blur">
              {service.category}
            </span>

            <span
              className={`absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold backdrop-blur ${
                isHomeVisit
                  ? "bg-[#FFB020]/90 text-[#05070D]"
                  : "bg-[#2563EB]/90 text-white"
              }`}
            >
              {isHomeVisit ? <House size={13} /> : <Store size={13} />}
              {service.serviceMode}
            </span>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              {service.title}
            </h1>

            <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={15} className="text-[#2563EB]" />
                {service.serviceArea}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={15} className="text-[#2563EB]" />
                {service.estimatedDuration}
              </span>
            </p>
          </div>

          {/* Description */}
          <section className="rounded-3xl border border-white/10 bg-[#0B1020] p-6">
            <h2 className="text-base font-bold">What&apos;s included</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-300">
              {service.description}
            </p>
          </section>

          {/* Detail tiles */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DetailTile
              label="Starting Price"
              value={`৳${service.basePrice}`}
              accent
            />
            <DetailTile label="Duration" value={service.estimatedDuration} />
            <DetailTile label="Service Mode" value={service.serviceMode} />
            <DetailTile label="Service Area" value={service.serviceArea} />
          </section>
        </div>

        {/* ── Side column ── */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {/* Booking card */}
          <div className="rounded-3xl border border-[#2563EB]/30 bg-[#0B1020] p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Starting at
            </p>
            <p className="mt-1 text-4xl font-extrabold text-[#FFB020]">
              ৳{service.basePrice}
            </p>

            <ul className="mt-5 space-y-3 border-t border-white/10 pt-5 text-sm text-slate-300">
              <li className="flex items-center gap-2.5">
                <Clock size={16} className="shrink-0 text-[#2563EB]" />
                {service.estimatedDuration}
              </li>
              <li className="flex items-center gap-2.5">
                {isHomeVisit ? (
                  <House size={16} className="shrink-0 text-[#2563EB]" />
                ) : (
                  <Store size={16} className="shrink-0 text-[#2563EB]" />
                )}
                {service.serviceMode}
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin size={16} className="shrink-0 text-[#2563EB]" />
                {service.serviceArea}
              </li>
            </ul>

            <div className="mt-5">
              <RequestRepair service={service} />
            </div>

            <p className="mt-4 text-center text-xs leading-5 text-slate-500">
              Pay only after the job is completed — no advance payment.
            </p>
          </div>

          {/* Technician summary */}
          {/* TODO(Phase C): GET /services/:id should also return the
              technician's photo, area and bio from the users collection. */}
          <div className="rounded-3xl border border-white/10 bg-[#0B1020] p-6">
            <h2 className="text-base font-bold">Your technician</h2>

            <div className="mt-4 flex items-center gap-3.5">
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#2563EB] text-lg font-bold ring-2 ring-[#2563EB]/60">
                {(service.technicianName || "?").charAt(0).toUpperCase()}
              </span>

              <div className="min-w-0">
                <p className="truncate font-bold">{service.technicianName}</p>
                <p className="truncate text-xs text-slate-400">
                  {service.technicianEmail}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2.5 border-t border-white/10 pt-4 text-sm text-slate-300">
              <p className="flex items-center gap-2.5">
                <MapPin size={15} className="shrink-0 text-[#2563EB]" />
                {service.serviceArea}
              </p>
              <p className="flex items-center gap-2.5">
                <Mail size={15} className="shrink-0 text-[#2563EB]" />
                Contact through FixMate
              </p>
            </div>

            <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-bold text-emerald-400">
              <BadgeCheck size={14} />
              Approved professional
            </span>
          </div>
        </aside>
      </div>
    </>
  );
}

/* Small info tile under the description */
const DetailTile = ({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) => (
  <div className="rounded-2xl border border-white/10 bg-[#0B1020] p-4">
    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
      {label}
    </p>
    <p
      className={`mt-1.5 text-sm font-bold ${accent ? "text-[#FFB020]" : "text-white"}`}
    >
      {value}
    </p>
  </div>
);

/* Streaming fallback */
const DetailsSkeleton = () => (
  <div aria-hidden className="animate-pulse">
    <div className="h-5 w-36 rounded bg-[#0B1020]" />

    <div className="mt-6 grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="h-64 rounded-3xl bg-[#0B1020] sm:h-80" />
        <div className="h-9 w-3/4 rounded bg-[#0B1020]" />
        <div className="h-40 rounded-3xl bg-[#0B1020]" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-[#0B1020]" />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="h-64 rounded-3xl bg-[#0B1020]" />
        <div className="h-56 rounded-3xl bg-[#0B1020]" />
      </div>
    </div>
  </div>
);
