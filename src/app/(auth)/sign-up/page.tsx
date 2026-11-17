
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
} from "lucide-react";

import repairImage from "@/../public/images/repair-hero.jpg";

export default function SignUp() {
  return (
    <section className="min-h-screen bg-[#05070D] px-5 py-10 text-white md:px-10">

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">

        {/* Left Content */}
        <div className="flex flex-col justify-between">

          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/50 bg-[#2563EB]/10 px-4 py-2 text-sm text-[#FFB020]">
              <Wrench size={17} />
              Your Trusted Repair Partner
            </span>

            <h1 className="mt-8 text-4xl font-extrabold leading-tight sm:text-5xl xl:text-6xl">
              Join <span className="text-[#FFB020]">FixMate</span>
              <br />
              Today!
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
              Get access to trusted repair services,
              manage your bookings, and enjoy a hassle-free
              repair experience.
            </p>

            {/* Benefits */}
            <div className="mt-8 space-y-5">

              <div className="flex items-center gap-4">
                <div className="rounded-full border border-[#2563EB]/50 bg-[#2563EB]/15 p-3 text-[#FFB020]">
                  <ShieldCheck size={23} />
                </div>
                <span className="font-semibold">
                  Trusted Technicians
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-full border border-[#2563EB]/50 bg-[#2563EB]/15 p-3 text-[#FFB020]">
                  <Zap size={23} />
                </div>
                <span className="font-semibold">
                  Fast & Reliable Service
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-full border border-[#2563EB]/50 bg-[#2563EB]/15 p-3 text-[#FFB020]">
                  <Lock size={23} />
                </div>
                <span className="font-semibold">
                  Secure & Easy Payments
                </span>
              </div>

            </div>
          </div>

          {/* Repair Image */}
          <div className="relative mt-10 h-[280px] overflow-hidden rounded-3xl border border-[#2563EB]/40 shadow-[0_0_35px_#2563EB20] md:h-[350px]">
            <Image
              src={repairImage}
              alt="Professional device repair service"
              fill
              priority
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#05070D]/80 to-transparent" />

            <div className="absolute bottom-5 left-5">
              <p className="text-xl font-bold">
                Repair. Restore. Relax.
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Your device deserves the best care.
              </p>
            </div>
          </div>

        </div>

        {/* Right Signup Form */}
        <div className="w-full rounded-3xl border border-[#2563EB]/60 bg-[#0B1020] p-6 shadow-[0_0_40px_#2563EB15] sm:p-10">

          {/* Tabs */}
          <div className="mb-8 grid grid-cols-2 border-b border-slate-700">

            <div className="border-b-2 border-[#2563EB] pb-4 text-center text-xl font-bold text-white">
              Sign Up
            </div>

            <Link
              href="/sign-in"
              className="pb-4 text-center text-xl font-semibold text-slate-400 transition hover:text-[#FFB020]"
            >
              Login
            </Link>

          </div>

          {/* Heading */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold">
              Create Your Account
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              It's quick and easy. Get started today!
            </p>
          </div>

          {/* Input Fields */}
          <div className="space-y-5">

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Full Name
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#05070D]/70 px-4 transition focus-within:border-[#2563EB]">
                <User size={20} className="text-[#FFB020]" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full bg-transparent py-4 text-sm text-white outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email Address
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#05070D]/70 px-4 transition focus-within:border-[#2563EB]">
                <Mail size={20} className="text-[#FFB020]" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-transparent py-4 text-sm text-white outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#05070D]/70 px-4 transition focus-within:border-[#2563EB]">
                <Lock size={20} className="text-[#FFB020]" />
                <input
                  type="password"
                  placeholder="Create a password"
                  className="w-full bg-transparent py-4 text-sm text-white outline-none placeholder:text-slate-500"
                />
                <Eye size={20} className="cursor-pointer text-slate-400" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Phone Number
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#05070D]/70 px-4 transition focus-within:border-[#2563EB]">
                <Phone size={20} className="text-[#FFB020]" />
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full bg-transparent py-4 text-sm text-white outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

          </div>

          {/* Terms */}
          <div className="mt-5 flex items-start gap-3 text-sm text-slate-400">
            <input
              type="checkbox"
              className="mt-1 size-4 accent-[#2563EB]"
            />
            <p>
              I agree to the{" "}
              <Link href="/terms" className="text-[#FFB020] hover:underline">
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-[#FFB020] hover:underline">
                Privacy Policy
              </Link>.
            </p>
          </div>

          {/* Signup Button */}
          
          <button
            type="button"
            className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-[#FFB020] py-4 font-bold text-[#05070D] transition hover:bg-[#2563EB] hover:text-white"
          >
            <UserPlus size={20} />
            Create Account
          </button>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-700" />
            <span className="text-sm text-slate-400">
              Or continue with
            </span>
            <div className="h-px flex-1 bg-slate-700" />
          </div>

          {/* Social Signup */}
          <div className="grid grid-cols-2 gap-4">

            <button
              type="button"
              className="flex items-center justify-center gap-3 rounded-xl border border-slate-700 py-3 text-sm font-medium transition hover:border-[#2563EB] hover:bg-[#2563EB]/10"
            >
              <span className="text-lg font-bold text-[#4285F4]">G</span>
              Google
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-3 rounded-xl border border-slate-700 py-3 text-sm font-medium transition hover:border-[#FFB020] hover:bg-[#FFB020]/10"
            >
              <span className="text-lg font-bold">𝕏</span>
              X
            </button>

          </div>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#FFB020] hover:underline"
            >
              Login
            </Link>
          </p>

        </div>
      </div>

      {/* Bottom Security Note */}
      <div className="mx-auto mt-10 flex max-w-7xl items-center justify-center gap-3 text-center text-sm text-slate-400">
        <ShieldCheck size={20} className="text-[#2563EB]" />
        Your information is safe and secure with FixMate.
      </div>

    </section>
  );
}
