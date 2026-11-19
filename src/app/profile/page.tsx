"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Camera,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import Navbar from "@/components/navbar";
import { authClient } from "@/lib/auth-client";

type FormState = {
  name: string;
  image: string;
  phone: string;
  area: string;
  bio: string;
};

const fieldBox =
  "w-full rounded-2xl border border-white/10 bg-[#05070D]/80 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.25)]";

const fieldLabel =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400";

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: session, isPending, refetch } = authClient.useSession();
  const user = session?.user;

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: "",
    image: "",
    phone: "",
    area: "",
    bio: "",
  });

  /* Load current values when entering edit mode (event handler, not effect,
     so a session refetch mid-edit can't clobber what the user is typing) */
  const startEdit = () => {
    if (user) {
      setForm({
        name: user.name ?? "",
        image: (user.image as string) ?? "",
        phone: (user.phone as string) ?? "",
        area: (user.area as string) ?? "",
        bio: (user.bio as string) ?? "",
      });
    }
    setEditing(true);
  };
  const cancelEdit = () => setEditing(false);

  /* Not signed in → go to sign in */
  useEffect(() => {
    if (!isPending && !user) router.replace("/sign-in");
  }, [isPending, user, router]);

  const handlePickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const body = new FormData();
      body.append("image", file);

      const res = await fetch("/api/upload", { method: "POST", body });
      const payload = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !payload.url) {
        toast.error(payload.error || "Upload failed.");
        return;
      }

      const { error } = await authClient.updateUser({ image: payload.url });
      if (error) {
        toast.error(error.message || "Could not save photo.");
        return;
      }

      await refetch();
      toast.success("Profile photo updated.");
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await authClient.updateUser({
        name: form.name.trim(),
        image: form.image.trim(),
        phone: form.phone.trim(),
        area: form.area.trim(),
        bio: form.bio.trim(),
      });

      if (error) {
        toast.error(error.message || "Could not save changes.");
        return;
      }

      await refetch();
      setEditing(false);
      toast.success("Profile updated.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await authClient.signOut();
      if (error) {
        toast.error(error.message || "Could not sign out.");
        return;
      }
      toast.success("Signed out successfully.");
      router.push("/sign-in");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  /* Session still resolving, or redirecting away */
  if (isPending || !user) {
    return (
      <div className="min-h-screen bg-[#05070D] text-white">
        <Navbar />
        <div className="mx-auto mt-24 max-w-4xl animate-pulse space-y-6 px-6">
          <div className="h-40 rounded-3xl bg-[#0B1020]" />
          <div className="h-64 rounded-3xl bg-[#0B1020]" />
        </div>
      </div>
    );
  }

  const initial = (user.name || "?").trim().charAt(0).toUpperCase();
  const accountType = (user.accountType as string) || "Customer";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070D] text-white">
      <Navbar />

      {/* Decorative glow orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-[#2563EB]/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-40 h-[380px] w-[380px] rounded-full bg-[#FFB020]/15 blur-3xl"
      />

      <main className="relative mx-auto max-w-4xl px-6 pb-24 pt-14">
        {/* ── Header card ── */}
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#0B1020]/85 shadow-[0_35px_90px_-30px_rgba(37,99,235,0.5)] backdrop-blur-xl">
          {/* Banner strip */}
          <div className="h-24 bg-gradient-to-r from-[#2563EB] via-[#1D4ED8] to-[#FFB020]" />

          <div className="-mt-12 flex flex-col items-center gap-5 px-6 pb-8 sm:flex-row sm:items-end sm:px-9">
            {/* Avatar + photo picker */}
            <div className="relative shrink-0">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "Profile photo"}
                  width={112}
                  height={112}
                  unoptimized
                  className="h-28 w-28 rounded-full object-cover ring-4 ring-[#0B1020]"
                />
              ) : (
                <span className="grid h-28 w-28 place-items-center rounded-full bg-[#2563EB] text-4xl font-extrabold ring-4 ring-[#0B1020]">
                  {initial}
                </span>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                aria-label="Change profile photo"
                className="absolute bottom-1 right-1 grid h-9 w-9 place-items-center rounded-full bg-[#FFB020] text-[#05070D] shadow-lg transition hover:brightness-110 disabled:opacity-60"
              >
                <Camera size={17} />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePickImage}
              />
            </div>

            {/* Identity */}
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <h1 className="truncate text-3xl font-extrabold">
                  {user.name}
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFB020]/40 bg-[#FFB020]/10 px-3 py-1 text-xs font-semibold text-[#FFB020]">
                  <ShieldCheck size={14} />
                  {accountType}
                </span>
              </div>

              <p className="mt-2 flex items-center justify-center gap-2 text-sm text-slate-400 sm:justify-start">
                <Mail size={15} className="text-[#2563EB]" />
                {user.email}
              </p>

              {uploading && (
                <p className="mt-2 text-xs text-[#FFB020]">
                  Uploading photo…
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {!editing && (
                <button
                  type="button"
                  onClick={startEdit}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FFB020] px-5 py-3 text-sm font-bold text-[#05070D] transition hover:bg-[#2563EB] hover:text-white"
                >
                  <Pencil size={16} />
                  Edit Profile
                </button>
              )}

              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-red-400 hover:text-red-400"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </section>

        {/* ── Details / edit form ── */}
        <section className="mt-8 rounded-3xl border border-white/10 bg-[#0B1020]/85 p-6 backdrop-blur-xl sm:p-9">
          {editing ? (
            <form onSubmit={handleSave} className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Edit Profile</h2>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-white"
                >
                  <X size={15} />
                  Cancel
                </button>
              </div>

              <div>
                <label htmlFor="name" className={fieldLabel}>
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  className={fieldBox}
                />
              </div>

              <div>
                <label htmlFor="image" className={fieldLabel}>
                  Image URL
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#05070D]/80 px-4 transition focus-within:border-[#2563EB] focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.25)]">
                  <Image
                    src={form.image || user.image || "/window.svg"}
                    alt="Profile preview"
                    width={36}
                    height={36}
                    unoptimized
                    className="my-2 h-9 w-9 shrink-0 rounded-full object-cover"
                  />
                  <input
                    id="image"
                    name="image"
                    type="url"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://example.com/your-photo.jpg"
                    className="w-full bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-slate-600"
                  />
                </div>
                <p className="mt-1.5 text-xs text-slate-500">
                  Paste a direct image link, or use the camera button on your
                  avatar to upload a file.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="phone" className={fieldLabel}>
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+880 1234-567890"
                    className={fieldBox}
                  />
                </div>

                <div>
                  <label htmlFor="area" className={fieldLabel}>
                    City / Area
                  </label>
                  <input
                    id="area"
                    name="area"
                    type="text"
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    placeholder="Mirpur, Dhaka"
                    className={fieldBox}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bio" className={fieldLabel}>
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="A short bio — skills & experience, especially useful for technicians."
                  className={`${fieldBox} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#FFB020] to-[#F59E0B] px-7 py-3.5 text-sm font-bold text-[#05070D] transition hover:from-[#2563EB] hover:to-[#1D4ED8] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={17} />
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </form>
          ) : (
            <div>
              <h2 className="text-xl font-bold">Details</h2>

              <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[#05070D]/70 p-5">
                  <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <Phone size={14} className="text-[#FFB020]" />
                    Phone
                  </dt>
                  <dd className="mt-2 text-sm text-slate-200">
                    {(user.phone as string) || (
                      <span className="text-slate-500">Not set yet</span>
                    )}
                  </dd>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#05070D]/70 p-5">
                  <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <MapPin size={14} className="text-[#FFB020]" />
                    City / Area
                  </dt>
                  <dd className="mt-2 text-sm text-slate-200">
                    {(user.area as string) || (
                      <span className="text-slate-500">Not set yet</span>
                    )}
                  </dd>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#05070D]/70 p-5 sm:col-span-2">
                  <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <User size={14} className="text-[#FFB020]" />
                    Bio
                  </dt>
                  <dd className="mt-2 text-sm leading-6 text-slate-200">
                    {(user.bio as string) || (
                      <span className="text-slate-500">Not set yet</span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
