"use client"
import { Suspense } from "react";
import { ClipboardList } from "lucide-react";

import { BookingsList } from "@/components/dashboard/booking";

/* Spec status colors: Requested=blue, Accepted=indigo, In Progress=amber,
   Completed=green, Rejected=red, Cancelled=gray */
const statusBadge: Record<string, string> = {
  requested: "border-blue-400/40 bg-blue-400/10 text-blue-400",
  accepted: "border-indigo-400/40 bg-indigo-400/10 text-indigo-400",
  "in progress": "border-amber-400/40 bg-amber-400/10 text-amber-400",
  in_progress: "border-amber-400/40 bg-amber-400/10 text-amber-400",
  completed: "border-emerald-400/40 bg-emerald-400/10 text-emerald-400",
  rejected: "border-red-400/40 bg-red-400/10 text-red-400",
  cancelled: "border-slate-400/40 bg-slate-400/10 text-slate-400",
};

const payBadge: Record<string, string> = {
  paid: "border-emerald-400/40 bg-emerald-400/10 text-emerald-400",
  unpaid: "border-amber-400/40 bg-amber-400/10 text-amber-400",
};

const iconBtn = "grid size-9 place-items-center rounded-lg border transition";

export default function MyBookingPage() {
  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-[#FFB020]/40 px-4 py-2 text-sm text-[#FFB020]">
          <ClipboardList size={16} />
          My Bookings
        </span>

        <h1 className="mt-4 text-2xl font-extrabold tracking-tight md:text-3xl">
          Your <span className="text-[#FFB020]">Bookings</span>
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
          Track repair requests and payment status in one place.
        </p>
      </div>

      <Suspense fallback={<BookingsSkeleton />}>
        <BookingsList statusBadge={statusBadge} payBadge={payBadge} iconBtn={iconBtn} />
      </Suspense>
    </div>
  );
}

/* Streaming fallback */
const BookingsSkeleton = () => (
  <div
    aria-hidden
    className="space-y-3 rounded-3xl border border-white/10 bg-[#0B1020] p-5"
  >
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="h-16 animate-pulse rounded-xl bg-white/5" />
    ))}
  </div>
);
