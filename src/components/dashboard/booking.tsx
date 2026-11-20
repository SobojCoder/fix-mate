"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ClipboardList, Eye } from "lucide-react";

import { getBooking } from "@/lib/api/booking";
import { authClient } from "@/lib/auth-client";

type Booking = {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: string;
  basePrice: number;
  technicianName: string;
  preferredDate: string;
  status: string;
  paymentStatus: string;
};

type BookingsListProps = {
  statusBadge: Record<string, string>;
  payBadge: Record<string, string>;
  iconBtn: string;
};

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

export function BookingsList({
  statusBadge,
  payBadge,
  iconBtn,
}: BookingsListProps) {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const id = user?.id;

  const [bookings, setBookings] = useState<Booking[] | null>(null);

  /* Same fetch as before — only once the session id is known. The server
     returns [] when nothing matches; the catch covers network/parse
     failures so the page never crashes. */
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

  /* Session loading */
  if (isPending) return <BookingsSkeleton />;

  /* Signed out — the dashboard layout guard handles the redirect */
  if (!id) return null;

  /* Bookings on the way */
  if (bookings === null) return <BookingsSkeleton />;

  /* Empty state */
  if (bookings.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/15 bg-[#0B1020]/60 px-6 py-14 text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#2563EB]/15 text-[#FFB020]">
          <ClipboardList size={30} />
        </div>

        <h2 className="mt-5 text-lg font-bold">No repair requests yet</h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
          Book a service and your request will show up here with live status
          updates.
        </p>

        <Link
          href="/services"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#FFB020] px-6 py-3 text-sm font-bold text-[#05070D] transition hover:bg-[#2563EB] hover:text-white"
        >
          Browse Services
        </Link>
      </div>
    );
  }

  /* Table */
  return (
    <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0B1020]">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <th className="px-5 py-4">Service</th>
            <th className="px-5 py-4">Technician</th>
            <th className="px-5 py-4">Preferred Date</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Payment</th>
            <th className="px-5 py-4">Price</th>
            <th className="px-5 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((booking) => (
            <tr
              key={booking._id}
              className="border-b border-white/5 transition last:border-0 hover:bg-white/[0.03]"
            >
              {/* Service */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={booking.serviceImage}
                    alt={booking.serviceTitle}
                    width={44}
                    height={44}
                    unoptimized
                    className="size-11 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <p className="max-w-[240px] truncate font-bold">
                      {booking.serviceTitle}
                    </p>
                    <p className="text-xs text-slate-400">{booking.category}</p>
                  </div>
                </div>
              </td>

              {/* Technician */}
              <td className="px-5 py-4 text-slate-300">
                {booking.technicianName}
              </td>

              {/* Preferred date */}
              <td className="px-5 py-4 text-slate-300">
                {booking.preferredDate}
              </td>

              {/* Status */}
              <td className="px-5 py-4">
                <span
                  className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                    statusBadge[booking.status] ?? statusBadge.requested
                  }`}
                >
                  {booking.status}
                </span>
              </td>

              {/* Payment */}
              <td className="px-5 py-4">
                <span
                  className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                    payBadge[booking.paymentStatus] ?? payBadge.unpaid
                  }`}
                >
                  {booking.paymentStatus}
                </span>
              </td>

              {/* Price */}
              <td className="px-5 py-4 font-bold text-[#FFB020]">
                ৳{booking.basePrice}
              </td>

              {/* Actions */}
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-2">
                  {/* View */}
                  <Link
                    href={`/services/${booking.serviceId}`}
                    title="View"
                    aria-label={`View ${booking.serviceTitle}`}
                    className={`${iconBtn} border-[#2563EB]/40 text-[#60A5FA] hover:bg-[#2563EB]/15`}
                  >
                    <Eye size={16} />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
