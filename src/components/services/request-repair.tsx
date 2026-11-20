"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { CircleCheck, Send, X } from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

/* The service fields this button needs (passed from the server page) */
type BookingService = {
  _id: string;
  title: string;
  image: string;
  category: string;
  basePrice: number;
  technicianName: string;
  technicianEmail: string;
};

type FormState = {
  phone: string;
  address: string;
  date: string;
  problem: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const emptyForm: FormState = { phone: "", address: "", date: "", problem: "" };

const fieldLabel =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400";

const fieldBox =
  "w-full rounded-xl border border-white/10 bg-[#05070D] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.25)]";

const errorText = "mt-1.5 text-xs font-medium text-red-400";

const primaryBtn =
  "flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFB020] px-6 py-3.5 text-sm font-bold text-[#05070D] transition hover:bg-[#2563EB] hover:text-white";

/* Local yyyy-mm-dd (avoids UTC edge cases) */
const todayStr = () => {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

export default function RequestRepair({
  service,
}: {
  service: BookingService;
}) {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  /* Lock background scroll while the modal is open */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  /* accountType covers current users, role covers the admin() plugin */
  const accountType = ((user?.accountType as string | undefined) ?? "").toLowerCase();
  const role =
    (user as { role?: string } | undefined)?.role === "admin" ||
    accountType === "admin"
      ? "admin"
      : accountType === "technician"
        ? "technician"
        : "customer";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name as keyof FormState];
      return next;
    });
  };

  const openModal = () => {
    setForm(emptyForm);
    setErrors({});
    setSent(false);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setSent(false);
    setForm(emptyForm);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errs: FormErrors = {};
    if (!form.phone.trim()) errs.phone = "Phone number is required.";
    if (!form.address.trim()) errs.address = "Address is required.";
    if (!form.date) errs.date = "Pick a preferred date.";
    else if (form.date < todayStr()) errs.date = "Date can't be in the past.";
    if (form.problem.trim().length < 20)
      errs.problem = "Describe the problem in at least 20 characters.";

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    try {
      /* TODO(Phase C): POST /api/bookings (verifyToken + verifyCustomer).
         The server must also refuse duplicate active requests for the
         same service — its message is shown below when returned. */
      const res = await fetch(`${BASE_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service._id,
          serviceTitle: service.title,
          serviceImage: service.image,
          category: service.category,
          basePrice: service.basePrice,
          technicianName: service.technicianName,
          technicianEmail: service.technicianEmail,
          customerName: user?.name ?? "",
          customerEmail: user?.email ?? "",
          customerPhone: form.phone.trim(),
          address: form.address.trim(),
          preferredDate: form.date,
          problemDescription: form.problem.trim(),
          status: "requested",
          paymentStatus: "unpaid",
        }),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(payload?.message || "");
      }

      setSent(true);
      toast.success("Repair request sent!");
    } catch (err) {
      toast.error(
        err instanceof Error && err.message
          ? err.message
          : "Could not send the request. Make sure the API server is running.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* ── Loading ── */
  if (isPending) {
    return (
      <div
        aria-hidden
        className="h-12 w-full animate-pulse rounded-xl bg-white/5"
      />
    );
  }

  /* ── Logged out → sign in, then come back ── */
  if (!user) {
    return (
      <div>
        <Link
          href={`/sign-in?callbackUrl=${encodeURIComponent(`/services/${service._id}`)}`}
          className={primaryBtn}
        >
          Request Repair
        </Link>
        <p className="mt-3 text-center text-xs text-slate-500">
          Sign in as a customer to send a request.
        </p>
      </div>
    );
  }

  /* ── Technician / Admin → disabled with notice ── */
  if (role !== "customer") {
    return (
      <div>
        <button
          type="button"
          disabled
          className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-white/10 px-6 py-3.5 text-sm font-bold text-slate-500"
        >
          Request Repair
        </button>
        <p className="mt-3 text-center text-xs font-medium text-amber-400">
          Only customers can request a repair.
        </p>
      </div>
    );
  }

  /* ── Customer → open the request form ── */
  return (
    <>
      <button type="button" onClick={openModal} className={primaryBtn}>
        <Send size={16} />
        Request Repair
      </button>

      {/* `open` only becomes true after a click, so this always runs on the client */}
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={closeModal}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Request a repair"
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0B1020] p-6 text-white shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold">Request a Repair</h2>
                  <p className="mt-0.5 truncate text-sm text-slate-400">
                    {service.title}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Close"
                  className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:text-white"
                >
                  <X size={17} />
                </button>
              </div>

              {sent ? (
                /* ── Success ── */
                <div className="py-8 text-center">
                  <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
                    <CircleCheck size={30} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold">Request sent!</h3>

                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-400">
                    {service.technicianName} will review your request. Track its
                    status from My Bookings.
                  </p>

                  <div className="mt-6 space-y-3">
                    <Link
                      href="/dashboard/customer/bookings"
                      onClick={closeModal}
                      className={primaryBtn}
                    >
                      View My Bookings
                    </Link>

                    <button
                      type="button"
                      onClick={closeModal}
                      className="w-full rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/30 hover:text-white"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                /* ── Form ── */
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="mt-5 space-y-4"
                >
                  {/* Read-only identity */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="req-name" className={fieldLabel}>
                        Name
                      </label>
                      <input
                        id="req-name"
                        type="text"
                        value={user.name ?? ""}
                        readOnly
                        className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-slate-400 outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="req-email" className={fieldLabel}>
                        Email
                      </label>
                      <input
                        id="req-email"
                        type="email"
                        value={user.email ?? ""}
                        readOnly
                        className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-slate-400 outline-none"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="req-phone" className={fieldLabel}>
                      Phone
                    </label>
                    <input
                      id="req-phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="01XXXXXXXXX"
                      className={fieldBox}
                    />
                    {errors.phone && (
                      <p className={errorText}>{errors.phone}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="req-address" className={fieldLabel}>
                      Address
                    </label>
                    <input
                      id="req-address"
                      name="address"
                      type="text"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="House, road, area, city"
                      className={fieldBox}
                    />
                    {errors.address && (
                      <p className={errorText}>{errors.address}</p>
                    )}
                  </div>

                  {/* Preferred date */}
                  <div>
                    <label htmlFor="req-date" className={fieldLabel}>
                      Preferred Date
                    </label>
                    <input
                      id="req-date"
                      name="date"
                      type="date"
                      min={todayStr()}
                      value={form.date}
                      onChange={handleChange}
                      className={fieldBox}
                    />
                    {errors.date && <p className={errorText}>{errors.date}</p>}
                  </div>

                  {/* Problem description */}
                  <div>
                    <label htmlFor="req-problem" className={fieldLabel}>
                      Problem Description
                    </label>
                    <textarea
                      id="req-problem"
                      name="problem"
                      rows={4}
                      value={form.problem}
                      onChange={handleChange}
                      placeholder="What is wrong with the device?"
                      className={`${fieldBox} resize-y`}
                    />
                    <p className="mt-1.5 text-[11px] text-slate-500">
                      Minimum 20 characters.
                    </p>
                    {errors.problem && (
                      <p className={errorText}>{errors.problem}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="flex gap-3 border-t border-white/10 pt-5">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/30 hover:text-white"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FFB020] px-5 py-3 text-sm font-bold text-[#05070D] transition hover:bg-[#2563EB] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Send size={15} />
                      {saving ? "Sending…" : "Send Request"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
