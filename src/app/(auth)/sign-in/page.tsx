
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  ShieldCheck,
  Zap,
  Wrench,
  UserPlus,
  Headset,
  CalendarDays,
  LogIn,
} from "lucide-react";

import repairImage from "@/../public/images/repair-hero.jpg";





export default function Login() {
  return (
    <section className="min-h-screen bg-[#05070D] px-5 py-10 text-white md:px-10">

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">

        {/* Left Side */}
        <div className="relative">

          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFB020]/50 bg-[#FFB020]/10 px-5 py-3 text-sm font-semibold text-[#FFB020]">
            <ShieldCheck size={19} />
            Trusted Repair Partner
          </div>

          <h1 className="mt-8 text-5xl font-extrabold leading-tight sm:text-6xl">
            Welcome
            <span className="block text-[#FFB020]">
              Back!
            </span>
          </h1>

          <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
            Sign in to your FixMate account and continue
            your repair journey. Manage your bookings and
            track your repair services easily.
          </p>

          {/* Repair Image */}
          <div className="relative mt-9 h-[300px] overflow-hidden rounded-3xl border border-[#2563EB]/40 shadow-[0_0_35px_#2563EB25] sm:h-[380px]">

            <Image
              src={repairImage}
              alt="Professional technician repairing a device"
              fill
              priority
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#05070D]/90 via-transparent to-transparent" />

            <div className="absolute bottom-5 left-5">
              <h3 className="text-2xl font-bold">
                Fix smarter. Live better.
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Your trusted partner for every repair.
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-3 gap-3">

            <div className="flex flex-col items-center gap-3 rounded-xl border border-[#2563EB]/30 bg-[#0B1020] p-4 text-center">
              <Wrench className="text-[#FFB020]" size={25} />
              <span className="text-xs font-medium text-slate-300">
                Track Jobs
              </span>
            </div>

            <div className="flex flex-col items-center gap-3 rounded-xl border border-[#2563EB]/30 bg-[#0B1020] p-4 text-center">
              <CalendarDays className="text-[#FFB020]" size={25} />
              <span className="text-xs font-medium text-slate-300">
                Manage Bookings
              </span>
            </div>

            <div className="flex flex-col items-center gap-3 rounded-xl border border-[#2563EB]/30 bg-[#0B1020] p-4 text-center">
              <Headset className="text-[#FFB020]" size={25} />
              <span className="text-xs font-medium text-slate-300">
                Expert Support
              </span>
            </div>

          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full rounded-3xl border border-[#2563EB]/60 bg-[#0B1020] p-6 shadow-[0_0_40px_#2563EB20] sm:p-10">

          {/* Heading */}
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Login to <span className="text-[#FFB020]">FixMate</span>
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Access your account to manage repairs,
              book services and more.
            </p>

            <div className="mx-auto mt-6 flex w-32 overflow-hidden rounded-full">
              <div className="h-1 flex-1 bg-[#2563EB]" />
              <div className="h-1 flex-1 bg-[#FFB020]" />
            </div>
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Email Address
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#05070D]/70 px-4 transition focus-within:border-[#2563EB]">
              <Mail size={21} className="text-[#FFB020]" />

              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full bg-transparent py-4 text-sm text-white outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Password
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#05070D]/70 px-4 transition focus-within:border-[#2563EB]">
              <Lock size={21} className="text-[#FFB020]" />

              <input
                type="password"
                placeholder="Enter your password"
                className="w-full bg-transparent py-4 text-sm text-white outline-none placeholder:text-slate-500"
              />

              <Eye size={20} className="cursor-pointer text-slate-400" />
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex flex-wrap items-center justify-between gap-3">

            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
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

          {/* Login Button */}
          <button
            type="button"
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-[#FFB020] py-4 font-bold text-[#05070D] transition hover:bg-[#2563EB] hover:text-white"
          >
            <LogIn size={21} />
            Login
          </button>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-700" />
            <span className="text-sm text-slate-400">
              Or continue with
            </span>
            <div className="h-px flex-1 bg-slate-700" />
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">

            <button
              type="button"
              className="flex items-center justify-center gap-3 rounded-xl border border-slate-700 py-3 text-sm font-semibold transition hover:border-[#2563EB] hover:bg-[#2563EB]/10"
            >
              <span className="text-xl font-bold text-[#4285F4]">
                G
              </span>
              Google
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-3 rounded-xl border border-slate-700 py-3 text-sm font-semibold transition hover:border-[#FFB020] hover:bg-[#FFB020]/10"
            >
              <span className="text-xl font-bold">𝕏</span>
              X
            </button>

          </div>

          {/* Sign Up */}
          <p className="mt-9 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-bold text-[#FFB020] transition hover:text-white"
            >
              Sign Up
            </Link>
          </p>

        </div>
      </div>

      {/* Security Note */}
      <div className="mx-auto mt-10 flex max-w-7xl items-center justify-center gap-3 text-center text-sm text-slate-400">
        <ShieldCheck size={20} className="text-[#2563EB]" />
        Your information is safe and secure with FixMate.
      </div>

    </section>
  );
}
