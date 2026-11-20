"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { CirclePlus, Save } from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

/* Must match the values stored in MongoDB */
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

type FormState = {
  title: string;
  category: string;
  description: string;
  basePrice: string;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
};

type FormErrors = Partial<Record<keyof FormState | "image", string>>;

const emptyForm: FormState = {
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

const readOnlyBox =
  "w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-slate-400 outline-none";

const optionBox = "bg-[#05070D] text-white";

const errorText = "mt-1.5 text-xs font-medium text-red-400";

export default function AddServicePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [preview, setPreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  /* Generic input change — clears this field's error while typing */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name as keyof FormErrors];
      return next;
    });
  };

  /* Pick image → preview now, upload to ImgBB through /api/upload */
  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGEBB_API_KEY}`, {
        method: "POST",
        body: formData,
        })
        const result = await res.json();

        console.log(result);
      if (!res.ok || !result.data.url) {
        toast.error(result.data.error || "Image upload failed.");
        return;
      }

      setImageUrl(result.data.url);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.image;
        return next;
      });
    } catch {
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  /* Simple validation — errors show under each field, form won't submit */
  const validate = (): FormErrors => {
    const errs: FormErrors = {};

    if (!form.title.trim()) errs.title = "Title is required.";
    if (!form.category) errs.category = "Please pick a category.";
    if (form.description.trim().length < 10)
      errs.description = "Describe the service in at least 10 characters.";
    if (!(Number(form.basePrice) > 0))
      errs.basePrice = "Enter a price greater than 0.";
    if (!form.estimatedDuration.trim())
      errs.estimatedDuration = "Estimated duration is required.";
    if (!form.serviceMode) errs.serviceMode = "Please pick a service mode.";
    if (!form.serviceArea.trim())
      errs.serviceArea = "Service area is required.";
    if (!imageUrl) errs.image = "Upload a service image.";

    return errs;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    try {
      /* TODO(Phase C): POST /api/services (verifyToken + verifyTechnician)
         on the Express server — not implemented there yet. */
         
      const res = await fetch(`${BASE_URL}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          title: form.title.trim(),
          description: form.description.trim(),
          serviceArea: form.serviceArea.trim(),
          basePrice: Number(form.basePrice),
          image: imageUrl,
          technicianName: user?.name ?? "",
          technicianEmail: user?.email ?? "",
          approvalStatus: "pending",
          isAvailable: true,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("save failed");

      toast.success("Service submitted! It's waiting for admin approval.");
      setForm(emptyForm);
      setErrors({});
      setPreview("");
      setImageUrl("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      toast.error(
        "Could not save the service. Make sure the API server is running.",
      );
    } finally {
      setSaving(false);
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
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-[#FFB020]/40 px-4 py-2 text-sm text-[#FFB020]">
          <CirclePlus size={16} />
          New Service
        </span>

        <h1 className="mt-4 text-2xl font-extrabold tracking-tight md:text-3xl">
          Add a <span className="text-[#FFB020]">Service</span>
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
          Fill in the details below. Your service stays hidden until an admin
          approves it.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-3xl border border-white/10 bg-[#0B1020] p-6 md:p-8"
      >
        <div className="grid gap-5 md:grid-cols-2">
          {/* Title */}
          <div className="md:col-span-2">
            <label htmlFor="title" className={fieldLabel}>
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. iPhone Screen Replacement"
              className={fieldBox}
            />
            {errors.title && <p className={errorText}>{errors.title}</p>}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className={fieldLabel}>
              Category
            </label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
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
            {errors.category && <p className={errorText}>{errors.category}</p>}
          </div>

          {/* Service mode */}
          <div>
            <label htmlFor="serviceMode" className={fieldLabel}>
              Service Mode
            </label>
            <select
              id="serviceMode"
              name="serviceMode"
              value={form.serviceMode}
              onChange={handleChange}
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
            {errors.serviceMode && (
              <p className={errorText}>{errors.serviceMode}</p>
            )}
          </div>

          {/* Base price */}
          <div>
            <label htmlFor="basePrice" className={fieldLabel}>
              Base Price (USD)
            </label>
            <input
              id="basePrice"
              name="basePrice"
              type="number"
              min={0}
              step="0.01"
              value={form.basePrice}
              onChange={handleChange}
              placeholder="e.g. 45"
              className={fieldBox}
            />
            {errors.basePrice && <p className={errorText}>{errors.basePrice}</p>}
          </div>

          {/* Estimated duration */}
          <div>
            <label htmlFor="estimatedDuration" className={fieldLabel}>
              Estimated Duration
            </label>
            <input
              id="estimatedDuration"
              name="estimatedDuration"
              type="text"
              value={form.estimatedDuration}
              onChange={handleChange}
              placeholder="e.g. 2-3 hours, 1 day"
              className={fieldBox}
            />
            {errors.estimatedDuration && (
              <p className={errorText}>{errors.estimatedDuration}</p>
            )}
          </div>

          {/* Service area */}
          <div className="md:col-span-2">
            <label htmlFor="serviceArea" className={fieldLabel}>
              Service Area
            </label>
            <input
              id="serviceArea"
              name="serviceArea"
              type="text"
              value={form.serviceArea}
              onChange={handleChange}
              placeholder="e.g. Dhanmondi, Dhaka"
              className={fieldBox}
            />
            {errors.serviceArea && (
              <p className={errorText}>{errors.serviceArea}</p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="description" className={fieldLabel}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={form.description}
              onChange={handleChange}
              placeholder="What does this service include?"
              className={`${fieldBox} resize-y`}
            />
            {errors.description && (
              <p className={errorText}>{errors.description}</p>
            )}
          </div>

          {/* Image upload */}
          <div className="md:col-span-2">
            <label htmlFor="image" className={fieldLabel}>
              Service Image
            </label>

            <div className="flex flex-wrap items-center gap-4">
              <input
                ref={fileInputRef}
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="block w-full cursor-pointer rounded-xl border border-dashed border-white/20 bg-[#05070D] px-4 py-3 text-sm text-slate-400 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#2563EB] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-[#FFB020]/60"
              />

              {preview && (
                <Image
                  src={preview}
                  alt="Service preview"
                  width={128}
                  height={72}
                  unoptimized
                  className="h-20 w-36 shrink-0 rounded-xl border border-white/10 object-cover"
                />
              )}

              {uploading && (
                <span className="text-xs font-semibold text-[#FFB020]">
                  Uploading…
                </span>
              )}
            </div>

            {errors.image && <p className={errorText}>{errors.image}</p>}
          </div>

          {/* Technician (read-only, from session) */}
          <div>
            <label htmlFor="technicianName" className={fieldLabel}>
              Technician Name
            </label>
            <input
              id="technicianName"
              type="text"
              value={user.name ?? ""}
              readOnly
              className={readOnlyBox}
            />
          </div>

          <div>
            <label htmlFor="technicianEmail" className={fieldLabel}>
              Technician Email
            </label>
            <input
              id="technicianEmail"
              type="email"
              value={user.email ?? ""}
              readOnly
              className={readOnlyBox}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
          <button
            type="submit"
            disabled={saving || uploading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FFB020] px-7 py-3.5 text-sm font-bold text-[#05070D] transition hover:bg-[#2563EB] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />
            {saving ? "Saving…" : "Save Service"}
          </button>

          <p className="text-xs text-slate-500">
            Saved as <span className="font-semibold text-amber-400">pending</span>{" "}
            — the admin approves it before customers can see it.
          </p>
        </div>
      </form>
    </div>
  );
}
