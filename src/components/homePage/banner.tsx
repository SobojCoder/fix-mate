
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  ShieldCheck,
  Zap,
  CreditCard,
  Headset,
} from "lucide-react";

import hero_image from "@/../public/images/repair-hero.jpg";

export default function Banner() {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl bg-[#05070D] text-white">

      {/* Background Image */}
      <Image
        src={hero_image}
        alt="Professional technician repairing electronic devices"
        fill
        priority
        className="absolute inset-0 -z-20 object-cover object-center"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#05070D] via-[#05070D]/95 to-[#05070D]/20" />

      {/* Hero Content */}
      <div className="relative flex min-h-[520px] items-center px-6 py-16 md:px-14">

        <div className="max-w-2xl">

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-[#05070D]/70 px-4 py-2 text-sm text-[#FFB020]">
            <ShieldCheck size={18} />
            Trusted Repair Service
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
            Broken Device?
            <span className="block text-[#FFB020]">
              Get It Fixed by
            </span>
            Verified Technicians
          </h1>

          {/* Subtitle */}
          <p className="mt-5 max-w-lg text-sm leading-7 text-slate-200 md:text-base">
            Fast, reliable, and hassle-free repair services.
            Find skilled technicians for your smartphones,
            laptops, and home appliances.
          </p>

          {/* Search Box */}
          <form
            action="/services"
            method="GET"
            className="mt-8 flex max-w-xl items-center gap-2 rounded-xl bg-white p-2 shadow-xl"
          >
            <Search className="ml-3 shrink-0 text-slate-500" size={21} />

            <input
              type="text"
              name="search"
              placeholder="Search a service (e.g. Phone Repair)"
              className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-[#05070D] outline-none placeholder:text-slate-400"
            />

            <button
              type="submit"
              className="flex shrink-0 items-center gap-2 rounded-lg bg-[#FFB020] px-4 py-3 text-sm font-bold text-[#05070D] transition hover:bg-[#2563EB] hover:text-white"
            >
              Search
              <ArrowRight size={18} />
            </button>
          </form>

          {/* CTA */}
          <Link
            href="/services"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-[#FFB020]"
          >
            Explore All Services
            <ArrowRight size={18} />
          </Link>

        </div>
      </div>

      {/* Feature Bar */}
      <div className="relative mx-5 mb-5 grid grid-cols-2 gap-5 rounded-2xl border border-white/10 bg-[#05070D]/90 p-5 backdrop-blur-md md:mx-10 md:grid-cols-4 md:gap-6">

        <div className="flex items-center gap-3">
          <ShieldCheck className="shrink-0 text-[#2563EB]" size={30} />
          <div>
            <h3 className="text-sm font-semibold">Verified</h3>
            <p className="text-xs text-slate-300">Technicians</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Zap className="shrink-0 text-[#FFB020]" size={30} />
          <div>
            <h3 className="text-sm font-semibold">Fast Service</h3>
            <p className="text-xs text-slate-300">Quick Support</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CreditCard className="shrink-0 text-[#2563EB]" size={30} />
          <div>
            <h3 className="text-sm font-semibold">Secure Payment</h3>
            <p className="text-xs text-slate-300">Pay After Service</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Headset className="shrink-0 text-[#FFB020]" size={30} />
          <div>
            <h3 className="text-sm font-semibold">24/7 Support</h3>
            <p className="text-xs text-slate-300">Always Available</p>
          </div>
        </div>

      </div>
    </section>
  );
}
