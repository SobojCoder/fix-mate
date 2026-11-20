import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";

/* Themed 404 — repair/tools style, with a Back to Home button (spec) */
export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#05070D] px-6 text-center text-white">
      {/* Glow orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-24 h-[380px] w-[380px] rounded-full bg-[#2563EB]/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-28 h-[420px] w-[420px] rounded-full bg-[#FFB020]/15 blur-3xl"
      />

      <div className="relative">
        {/* Tools illustration */}
        <div className="mx-auto grid size-24 place-items-center rounded-full border border-[#FFB020]/40 bg-[#0B1020] text-[#FFB020] shadow-[0_0_50px_rgba(255,176,32,0.25)]">
          <Wrench size={44} strokeWidth={1.8} />
        </div>

        <p className="mt-8 text-7xl font-extrabold tracking-tight text-[#2563EB]">
          404
        </p>

        <h1 className="mt-3 text-2xl font-extrabold md:text-3xl">
          This page <span className="text-[#FFB020]">went missing</span>
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
          The page you&apos;re looking for doesn&apos;t exist, was moved, or the
          service is no longer available.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#FFB020] px-7 py-3.5 text-sm font-bold text-[#05070D] transition hover:bg-[#2563EB] hover:text-white"
        >
          Back to Home
          <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
}
