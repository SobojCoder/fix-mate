"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CirclePlus, Eye, Pencil, Trash, Wrench, X } from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { getServices } from "@/lib/api/services";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const SERVICE_MODES = ["Home Visit", "Shop Drop-off"];

export type Service = {
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

type EditForm = {
  title: string;
  category: string;
  description: string;
  basePrice: string;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
};

const emptyEdit: EditForm = {
  title: "",
  category: "",
  description: "",
  basePrice: "",
  estimatedDuration: "",
  serviceMode: "",
  serviceArea: "",
};

const fieldLabel =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400";

const fieldBox =
  "w-full rounded-xl border border-white/10 bg-[#05070D] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.25)]";

const optionBox = "bg-[#05070D] text-white";

const errorText = "mt-1.5 text-xs font-medium text-red-400";

const statusBadge: Record<string, string> = {
  pending: "border-amber-400/40 bg-amber-400/10 text-amber-400",
  approved: "border-emerald-400/40 bg-emerald-400/10 text-emerald-400",
  rejected: "border-red-400/40 bg-red-400/10 text-red-400",
};

const iconBtn = "grid size-9 place-items-center rounded-lg border transition";

export default function MyServicesPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [services, setServices] = useState<Service[] | null>(null);
  const [editTarget, setEditTarget] = useState<Service | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(emptyEdit);
  const [editErrors, setEditErrors] = useState<Partial<EditForm>>({});
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [busy, setBusy] = useState(false);

  const email = user?.email;

  /* My services, newest first. TODO(Phase C): the server should filter —
     GET /services?technicianEmail=… (verifyToken + verifyTechnician).
     Until it does, the param is ignored, so filter client-side too. */
  useEffect(() => {
    if (!email) return;

    let cancelled = false;

    (async () => {
      try {
        const data = await getServices(`technicianEmail=${email}`);
        const list = Array.isArray(data) ? (data as Service[]) : [];

        if (!cancelled) {
          setServices(
            list
              .filter((s) => s.technicianEmail === email)
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              ),
          );
        }
      } catch {
        if (!cancelled) setServices([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [email]);

  const loading = services === null;


  /* ── Edit ── */
  const openEdit = (service: Service) => {
    setEditTarget(service);
    setEditForm({
      title: service.title,
      category: service.category,
      description: service.description,
      basePrice: String(service.basePrice),
      estimatedDuration: service.estimatedDuration,
      serviceMode: service.serviceMode,
      serviceArea: service.serviceArea,
    });
    setEditErrors({});
  };

  const closeEdit = () => {
    setEditTarget(null);
    setEditErrors({});
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    setEditErrors((prev) => {
      const next = { ...prev };
      delete next[name as keyof EditForm];
      return next;
    });
  };

  const saveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editTarget) return;

    const errs: Partial<EditForm> = {};
    if (!editForm.title.trim()) errs.title = "Title is required.";
    if (!editForm.category) errs.category = "Please pick a category.";
    if (editForm.description.trim().length < 10)
      errs.description = "Describe the service in at least 10 characters.";
    if (!(Number(editForm.basePrice) > 0))
      errs.basePrice = "Enter a price greater than 0.";
    if (!editForm.estimatedDuration.trim())
      errs.estimatedDuration = "Estimated duration is required.";
    if (!editForm.serviceMode)
      errs.serviceMode = "Please pick a service mode.";
    if (!editForm.serviceArea.trim())
      errs.serviceArea = "Service area is required.";

    setEditErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setBusy(true);
    try {
      /* TODO(Phase C): PATCH /api/services/:id — the server must also set
         approvalStatus back to 'pending' after an edit (spec rule). */
      const res = await fetch(`${BASE_URL}/api/services/${editTarget._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editForm,
          title: editForm.title.trim(),
          description: editForm.description.trim(),
          serviceArea: editForm.serviceArea.trim(),
          basePrice: Number(editForm.basePrice),
          approvalStatus: "pending",
        }),
      });

      if (!res.ok) throw new Error("update failed");

      const updated: Service = {
        ...editTarget,
        ...editForm,
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        serviceArea: editForm.serviceArea.trim(),
        basePrice: Number(editForm.basePrice),
        approvalStatus: "pending",
      };
      setServices((prev) =>
        (prev ?? []).map((s) => (s._id === updated._id ? updated : s)),
      );

      toast.success("Service updated — sent back for admin approval.");
      closeEdit();
    } catch {
      toast.error(
        "Could not update the service. Make sure the API server is running.",
      );
    } finally {
      setBusy(false);
    }
  };

  /* ── Delete ── */
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setBusy(true);
    try {
      /* TODO(Phase C): DELETE /api/services/:id (verifyToken + verifyTechnician) */
      const res = await fetch(`${BASE_URL}/api/services/${deleteTarget._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("delete failed");

      const id = deleteTarget._id;
      setServices((prev) => (prev ?? []).filter((s) => s._id !== id));
      toast.success("Service deleted.");
      setDeleteTarget(null);
    } catch {
      toast.error(
        "Could not delete the service. Make sure the API server is running.",
      );
    } finally {
      setBusy(false);
    }
  };

  if (!user) {
    return (
      <div className="h-96 animate-pulse rounded-3xl bg-[#0B1020]" aria-hidden />
    );
  }

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#FFB020]/40 px-4 py-2 text-sm text-[#FFB020]">
            <Wrench size={16} />
            My Services
          </span>

          <h1 className="mt-4 text-2xl font-extrabold tracking-tight md:text-3xl">
            Your <span className="text-[#FFB020]">Services</span>
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            View, edit or remove the services you offer. Edited services go
            back to pending review.
          </p>
        </div>

        <Link
          href="/dashboard/technician/add-service"
          className="inline-flex items-center gap-2 rounded-xl bg-[#FFB020] px-5 py-3 text-sm font-bold text-[#05070D] transition hover:bg-[#2563EB] hover:text-white"
        >
          <CirclePlus size={16} />
          Add Service
        </Link>
      </div>

      {/* Table / empty state */}
      {loading ? (
        <div className="space-y-3 rounded-3xl border border-white/10 bg-[#0B1020] p-5" aria-hidden>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 bg-[#0B1020]/60 px-6 py-14 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#2563EB]/15 text-[#FFB020]">
            <Wrench size={30} />
          </div>

          <h2 className="mt-5 text-lg font-bold">No services yet</h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
            Add your first repair service — it appears for customers once the
            admin approves it.
          </p>

          <Link
            href="/dashboard/technician/add-service"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#FFB020] px-6 py-3 text-sm font-bold text-[#05070D] transition hover:bg-[#2563EB] hover:text-white"
          >
            <CirclePlus size={16} />
            Add Service
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0B1020]">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="px-5 py-4">Service</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Availability</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {services.map((service) => (
                <tr
                  key={service._id}
                  className="border-b border-white/5 transition last:border-0 hover:bg-white/[0.03]"
                >
                  {/* Service */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={service.image}
                        alt={service.title}
                        width={44}
                        height={44}
                        unoptimized
                        className="size-11 shrink-0 rounded-lg object-cover"
                      />
                      <div className="min-w-0">
                        <p className="max-w-[240px] truncate font-bold">
                          {service.title}
                        </p>
                        <p className="text-xs text-slate-400">
                          {service.serviceMode}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-4 text-slate-300">
                    {service.category}
                  </td>

                  {/* Price */}
                  <td className="px-5 py-4 font-bold text-[#FFB020]">
                    ৳{service.basePrice}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                        statusBadge[service.approvalStatus] ??
                        statusBadge.pending
                      }`}
                    >
                      {service.approvalStatus}
                    </span>
                  </td>

                  {/* Availability */}
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-2 text-slate-300">
                      <span
                        className={`size-2.5 rounded-full ${
                          service.isAvailable ? "bg-emerald-400" : "bg-slate-600"
                        }`}
                      />
                      {service.isAvailable ? "Live" : "Hidden"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {/* View */}
                      <Link
                        href={`/services/${service._id}`}
                        title="View"
                        aria-label={`View ${service.title}`}
                        className={`${iconBtn} border-[#2563EB]/40 text-[#60A5FA] hover:bg-[#2563EB]/15`}
                      >
                        <Eye size={16} />
                      </Link>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => openEdit(service)}
                        title="Edit"
                        aria-label={`Edit ${service.title}`}
                        className={`${iconBtn} border-amber-400/40 text-amber-400 hover:bg-amber-400/10`}
                      >
                        <Pencil size={16} />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(service)}
                        title="Delete"
                        aria-label={`Delete ${service.title}`}
                        className={`${iconBtn} border-red-400/40 text-red-400 hover:bg-red-400/10`}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Edit modal ── */}
      {editTarget && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
          onClick={closeEdit}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Edit service"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0B1020] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold">Edit Service</h2>

              <button
                type="button"
                onClick={closeEdit}
                aria-label="Close"
                className="grid size-9 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:text-white"
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={saveEdit} noValidate className="mt-5 space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="edit-title" className={fieldLabel}>
                  Title
                </label>
                <input
                  id="edit-title"
                  name="title"
                  type="text"
                  value={editForm.title}
                  onChange={handleEditChange}
                  className={fieldBox}
                />
                {editErrors.title && (
                  <p className={errorText}>{editErrors.title}</p>
                )}
              </div>

              {/* Category + mode */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="edit-category" className={fieldLabel}>
                    Category
                  </label>
                  <select
                    id="edit-category"
                    name="category"
                    value={editForm.category}
                    onChange={handleEditChange}
                    className={fieldBox}
                  >
                    <option value="" className={optionBox}>
                      Select category
                    </option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className={optionBox}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {editErrors.category && (
                    <p className={errorText}>{editErrors.category}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="edit-mode" className={fieldLabel}>
                    Service Mode
                  </label>
                  <select
                    id="edit-mode"
                    name="serviceMode"
                    value={editForm.serviceMode}
                    onChange={handleEditChange}
                    className={fieldBox}
                  >
                    <option value="" className={optionBox}>
                      Select mode
                    </option>
                    {SERVICE_MODES.map((m) => (
                      <option key={m} value={m} className={optionBox}>
                        {m}
                      </option>
                    ))}
                  </select>
                  {editErrors.serviceMode && (
                    <p className={errorText}>{editErrors.serviceMode}</p>
                  )}
                </div>
              </div>

              {/* Price + duration */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="edit-price" className={fieldLabel}>
                    Base Price (USD)
                  </label>
                  <input
                    id="edit-price"
                    name="basePrice"
                    type="number"
                    min={0}
                    step="0.01"
                    value={editForm.basePrice}
                    onChange={handleEditChange}
                    className={fieldBox}
                  />
                  {editErrors.basePrice && (
                    <p className={errorText}>{editErrors.basePrice}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="edit-duration" className={fieldLabel}>
                    Estimated Duration
                  </label>
                  <input
                    id="edit-duration"
                    name="estimatedDuration"
                    type="text"
                    value={editForm.estimatedDuration}
                    onChange={handleEditChange}
                    className={fieldBox}
                  />
                  {editErrors.estimatedDuration && (
                    <p className={errorText}>{editErrors.estimatedDuration}</p>
                  )}
                </div>
              </div>

              {/* Area */}
              <div>
                <label htmlFor="edit-area" className={fieldLabel}>
                  Service Area
                </label>
                <input
                  id="edit-area"
                  name="serviceArea"
                  type="text"
                  value={editForm.serviceArea}
                  onChange={handleEditChange}
                  className={fieldBox}
                />
                {editErrors.serviceArea && (
                  <p className={errorText}>{editErrors.serviceArea}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="edit-description" className={fieldLabel}>
                  Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  rows={4}
                  value={editForm.description}
                  onChange={handleEditChange}
                  className={`${fieldBox} resize-y`}
                />
                {editErrors.description && (
                  <p className={errorText}>{editErrors.description}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-5">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/30 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-xl bg-[#FFB020] px-6 py-3 text-sm font-bold text-[#05070D] transition hover:bg-[#2563EB] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busy ? "Saving…" : "Save Changes"}
                </button>
              </div>

              <p className="text-right text-[11px] text-slate-500">
                Saving sends the service back to{" "}
                <span className="font-semibold text-amber-400">pending</span>{" "}
                review.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete confirmation modal ── */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-label="Confirm delete"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0B1020] p-6 text-center shadow-2xl"
          >
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-red-500/15 text-red-400">
              <Trash size={26} />
            </div>

            <h2 className="mt-4 text-lg font-bold">Delete this service?</h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              <span className="font-semibold text-white">
                {deleteTarget.title}
              </span>{" "}
              will be permanently removed. This can&apos;t be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/30 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={busy}
                className="flex-1 rounded-xl bg-red-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}