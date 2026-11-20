import type { Metadata } from "next";
import { LayoutGrid } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard | FixMate",
  description: "Your FixMate account dashboard.",
};

export default function DashboardPage() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0B1020] p-8 md:p-10">
      <span className="inline-flex items-center gap-2 rounded-full border border-[#FFB020]/40 px-4 py-2 text-sm text-[#FFB020]">
        <LayoutGrid size={16} />
        Overview
      </span>

      <h1 className="mt-5 text-2xl font-bold md:text-3xl">
        Welcome to your <span className="text-[#FFB020]">dashboard</span>
      </h1>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
        Use the sidebar to navigate — the menu you see is driven by your
        account type (Customer, Technician or Admin). Each section will be
        built out from here.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["Recent activity", "Quick actions", "Notifications"].map((title) => (
          <div
            key={title}
            className="rounded-2xl border border-dashed border-white/15 bg-[#05070D]/60 p-5"
          >
            <p className="text-sm font-bold text-slate-300">{title}</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Coming soon.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
