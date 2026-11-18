import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Info,
  Target,
  Heart,
  ShieldCheck,
  Zap,
  CreditCard,
  Headset,
  Star,
  Users,
  Wrench,
  CheckCircle,
} from "lucide-react";

import Navbar from "@/components/navbar";
import repairImage from "@/../public/images/repair-hero.jpg";

/* ── Stats ── */
const stats = [
  { value: "12,000+", label: "Happy customers", icon: Users },
  { value: "4.9", label: "Average rating", icon: Star },
  { value: "500+", label: "Verified technicians", icon: Wrench },
  { value: "24/7", label: "Customer support", icon: Headset },
];

/* ── Values ── */
const values = [
  {
    title: "Verified Technicians",
    description:
      "Every professional on FixMate is skill-tested and background-checked before they ever reach you.",
    icon: ShieldCheck,
  },
  {
    title: "Transparent Pricing",
    description:
      "See your quote upfront with no hidden fees — you approve the price before any work begins.",
    icon: CreditCard,
  },
  {
    title: "Fast & Reliable",
    description:
      "Most repairs are completed the same day, so your device is back in your hands when you need it.",
    icon: Zap,
  },
  {
    title: "24/7 Support",
    description:
      "Our support team is around the clock, ready to help with any question about your repair.",
    icon: Headset,
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#05070D] text-white">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-6 pb-16 pt-20 md:px-12">
        {/* Decorative glow orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#2563EB]/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 top-10 h-[380px] w-[380px] rounded-full bg-[#FFB020]/15 blur-3xl"
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#FFB020]/40 bg-[#0B1020] px-4 py-2 text-sm text-[#FFB020]">
            <Info size={16} />
            About FixMate
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-6xl">
            We Fix What Matters.
            <span className="block text-[#FFB020]">You Get On With Life.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-300">
            FixMate connects you with verified technicians for your phones,
            laptops, and home appliances — booked in minutes, tracked in real
            time, and guaranteed from start to finish.
          </p>

          <div className="mx-auto mt-8 h-1 w-28 rounded-full bg-gradient-to-r from-[#2563EB] to-[#FFB020]" />
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="px-6 md:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          {/* Text */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#FFB020]/40 px-4 py-2 text-sm text-[#FFB020]">
              <Target size={16} />
              Our Story
            </span>

            <h2 className="mt-5 text-3xl font-bold md:text-5xl">
              Repair shouldn&apos;t be{" "}
              <span className="text-[#FFB020]">a gamble.</span>
            </h2>

            <p className="mt-5 leading-7 text-slate-300">
              FixMate started with a simple frustration: getting a device
              repaired meant guessing who to trust, how much it would cost, and
              when it would be done. Quotes changed mid-job, and no one picked
              up the phone afterwards.
            </p>

            <p className="mt-4 leading-7 text-slate-300">
              So we built the repair experience we wanted ourselves — verified
              technicians, upfront pricing, live job tracking, and support that
              actually answers. Today, thousands of customers hand us their most
              essential devices with confidence.
            </p>

            {/* Mission bullets */}
            <ul className="mt-7 space-y-3">
              {[
                "Upfront quotes you approve before work starts",
                "Live tracking on every repair, start to finish",
                "A satisfaction guarantee on every job",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle size={19} className="mt-0.5 shrink-0 text-[#FFB020]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-[#2563EB]/20 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-[#2563EB]/40">
              <Image
                src={repairImage}
                alt="Professional device repair technician at work"
                className="h-[450px] w-full object-cover"
                priority
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#05070D] via-transparent to-transparent" />

              {/* Overlay badge */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-blue-400/40 bg-[#05070D]/90 p-4 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <Heart className="text-[#FFB020]" size={30} />
                  <div>
                    <h3 className="font-bold">Built on Trust</h3>
                    <p className="text-xs text-slate-400">
                      The reason customers keep coming back
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 text-[#FFB020]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={15} fill="currentColor" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats band ── */}
      <section className="px-6 pt-20 md:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#2563EB]/30 bg-[#0B1020] p-6 text-center transition hover:-translate-y-1 hover:border-[#FFB020]"
              >
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-[#2563EB]/15 text-[#FFB020]">
                  <Icon size={25} />
                </div>

                <p className="text-3xl font-extrabold text-[#FFB020]">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Values ── */}
      <section className="px-6 pt-20 md:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#FFB020]/40 px-4 py-2 text-sm text-[#FFB020]">
            <Heart size={16} />
            What We Stand For
          </span>

          <h2 className="mt-5 text-3xl font-bold md:text-5xl">
            Our <span className="text-[#FFB020]">Values</span>
          </h2>

          <p className="mt-4 text-slate-300">
            Four principles behind every repair we handle.
          </p>

          <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gradient-to-r from-[#2563EB] to-[#FFB020]" />
        </div>

        <div className="mx-auto mt-14 grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <div
                key={value.title}
                className="group rounded-2xl border border-[#2563EB]/30 bg-[#0B1020] p-6 transition hover:-translate-y-1 hover:border-[#FFB020]"
              >
                <div className="mb-5 flex size-14 items-center justify-center rounded-xl bg-[#2563EB]/15 text-[#FFB020] transition group-hover:bg-[#2563EB] group-hover:text-white">
                  <Icon size={28} />
                </div>

                <h3 className="text-lg font-bold">{value.title}</h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="px-6 pb-24 pt-20 md:px-12">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-[#2563EB]/40 bg-[#0B1020] px-6 py-16 text-center md:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#2563EB]/25 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#FFB020]/15 blur-3xl"
          />

          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold md:text-5xl">
              Ready to get your device{" "}
              <span className="text-[#FFB020]">fixed?</span>
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-300">
              Join thousands of customers who book trusted technicians through
              FixMate — fast, transparent, and guaranteed.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-3 rounded-xl bg-[#FFB020] px-8 py-4 font-bold text-[#05070D] transition hover:bg-[#2563EB] hover:text-white"
              >
                Get Started Free
                <ArrowRight size={20} />
              </Link>

              <Link
                href="/services"
                className="inline-flex items-center gap-3 rounded-xl border border-white/20 px-8 py-4 font-bold text-white transition hover:border-[#FFB020] hover:text-[#FFB020]"
              >
                Explore Services
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
