"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthToggle() {
  const pathname = usePathname();

  const isSignUp = pathname === "/sign-up";

  return (
    <div className="mb-8 flex rounded-xl border border-[#2563EB]/30 bg-[#05070D] p-1.5">

      <Link
        href="/sign-up"
        className={`flex-1 rounded-lg py-3 text-center text-sm font-bold transition ${
          isSignUp
            ? "bg-[#2563EB] text-white shadow-lg"
            : "text-slate-400 hover:text-[#FFB020]"
        }`}
      >
        Sign Up
      </Link>

      <Link
        href="/sign-in"
        className={`flex-1 rounded-lg py-3 text-center text-sm font-bold transition ${
          !isSignUp
            ? "bg-[#2563EB] text-white shadow-lg"
            : "text-slate-400 hover:text-[#FFB020]"
        }`}
      >
        Sign In
      </Link>

    </div>
  );
}