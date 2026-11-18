"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Star,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

import repairImage from "@/../public/images/repair-hero.jpg";
import { HiWrenchScrewdriver } from "react-icons/hi2";
import AuthToggle from "@/components/authToggle";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Could not sign in.");
        return;
      }

      if (data) {
        toast.success("Welcome back!");
        router.push("/");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#05070D] px-5 py-10 text-white md:px-10">
      {/* Decorative glow orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#2563EB]/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-52 -right-32 h-[460px] w-[460px] rounded-full bg-[#FFB020]/15 blur-3xl"
      />

      {/* Logo (no global navbar renders on this route) */}
      <Link
        href="/"
        className="relative mb-8 flex items-center justify-center gap-2.5"
      >
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#2563EB] text-white shadow-[0_0_20px_rgba(37,99,235,0.55)]">
          <HiWrenchScrewdriver className="h-6 w-6" />
        </span>
        <span className="text-3xl font-extrabold tracking-tight">
          Fix<span className="text-[#FFB020]">Mate</span>
        </span>
      </Link>

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
        {/* ── Visual storytelling panel (desktop only) ── */}
        <div className="relative hidden overflow-hidden rounded-[32px] border border-white/10 shadow-[0_35px_90px_-25px_rgba(37,99,235,0.55)] lg:block">
          <div className="relative h-[620px] w-full">
            <Image
              src={repairImage}
              alt="Technician repairing a device"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#05070D] via-[#05070D]/75 to-[#2563EB]/40" />

            {/* Brand chip */}
            <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md">
              <Zap size={15} className="text-[#FFB020]" />
              Trusted by 12,000+ customers
            </div>

            {/* Headline */}
            <div className="absolute bottom-32 left-7 right-7">
              <h1 className="text-4xl font-extrabold leading-[1.15] xl:text-5xl">
                Repair done{" "}
                <span className="bg-gradient-to-r from-[#FFB020] to-[#2563EB] bg-clip-text text-transparent">
                  right.
                </span>
                <br />
                On your schedule.
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
                Book verified technicians, track every job in real time, and get
                your devices back — fixed fast and guaranteed.
              </p>
            </div>

            {/* Floating stat cards */}
            <div className="absolute bottom-6 left-6 right-6 flex gap-3">
              <div className="flex-1 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-md">
                <div className="flex items-center gap-1.5">
                  <Star size={15} className="fill-[#FFB020] text-[#FFB020]" />
                  <span className="text-base font-bold">4.9</span>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-300">
                  Average rating
                </p>
              </div>
              <div className="flex-1 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-md">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-[#FFB020]" />
                  <span className="text-base font-bold">100%</span>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-300">
                  Verified pros
                </p>
              </div>
              <div className="hidden flex-1 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-md sm:block">
                <div className="flex items-center gap-1.5">
                  <Zap size={15} className="text-[#FFB020]" />
                  <span className="text-base font-bold">24/7</span>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-300">Support</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Form card ── */}
        <div className="relative w-full rounded-[32px] border border-white/10 bg-[#0B1020]/85 p-6 shadow-[0_35px_90px_-30px_rgba(37,99,235,0.5)] backdrop-blur-xl sm:p-9">
          {/* Dotted texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[32px] bg-[radial-gradient(#ffffff14_1px,transparent_1px)] [background-size:20px_20px] opacity-60"
          />

          <div className="relative">
            {/* Tabs */}
            <AuthToggle />

            {/* Heading */}
            <div className="mb-7 text-center">
              <h2 className="text-3xl font-extrabold">
                Welcome{" "}
                <span className="bg-gradient-to-r from-[#FFB020] to-[#2563EB] bg-clip-text text-transparent">
                  back
                </span>
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Sign in to manage your repairs and bookings.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400"
                >
                  Email address
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#05070D]/80 px-4 transition focus-within:border-[#2563EB] focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.25)]">
                  <Mail size={18} className="shrink-0 text-[#FFB020]" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400"
                >
                  Password
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#05070D]/80 px-4 transition focus-within:border-[#2563EB] focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.25)]">
                  <Lock size={18} className="shrink-0 text-[#FFB020]" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    className="w-full bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="shrink-0 text-slate-400 transition hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {error && (
                  <p className="mt-1.5 text-xs font-medium text-red-400">
                    {error}
                  </p>
                )}
              </div>

              {/* Remember me + forgot password */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-400">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    className="size-4 accent-[#2563EB]"
                  />
                  Remember me
                </label>

                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-[#FFB020] transition hover:text-white"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FFB020] to-[#F59E0B] py-4 text-sm font-bold text-[#05070D] transition hover:from-[#2563EB] hover:to-[#1D4ED8] hover:text-white hover:shadow-[0_12px_35px_-10px_rgba(37,99,235,0.8)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in…" : "Sign In"}
                {!loading && (
                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                or continue with
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Social sign-in (decorative — no OAuth providers are configured) */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-semibold transition hover:border-[#2563EB]/60 hover:bg-[#2563EB]/10"
              >
                <span className="text-base font-bold text-[#4285F4]">G</span>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-semibold transition hover:border-[#FFB020]/60 hover:bg-[#FFB020]/10"
              >
                <FaGithub size={17} />
                GitHub
              </button>
            </div>

            {/* Sign-up link */}
            <p className="mt-7 text-center text-sm text-slate-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="font-bold text-[#FFB020] transition hover:text-white"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom security note */}
      <div className="relative mx-auto mt-10 flex max-w-6xl items-center justify-center gap-2.5 text-center text-xs text-slate-500">
        <ShieldCheck size={15} className="text-[#2563EB]" />
        Your information is safe and secure with FixMate.
      </div>
    </section>
  );
}
