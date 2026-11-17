
import Link from "next/link";
import {
  Search,
  ClipboardList,
  Wrench,
  CreditCard,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Find a Service",
    description:
      "Browse our wide range of repair services and choose what you need.",
    icon: Search,
  },
  {
    number: "02",
    title: "Send a Request",
    description:
      "Describe your problem and submit a repair request to a technician.",
    icon: ClipboardList,
  },
  {
    number: "03",
    title: "Technician Fixes It",
    description:
      "Our verified technician will inspect and repair your device.",
    icon: Wrench,
  },
  {
    number: "04",
    title: "Pay After Completion",
    description:
      "Review the completed work and pay securely after the repair.",
    icon: CreditCard,
  },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#05070D] px-6 py-20 text-white md:px-12">

      {/* Heading */}
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#FFB020]/40 px-4 py-2 text-sm text-[#FFB020]">
          <Wrench size={16} />
          Simple • Fast • Reliable
        </span>

        <h2 className="mt-5 text-3xl font-bold md:text-5xl">
          How <span className="text-[#FFB020]">FixMate</span> Works?
        </h2>

        <p className="mt-4 text-slate-300">
          Get your repair done in just 4 easy steps!
        </p>

        <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gradient-to-r from-[#2563EB] to-[#FFB020]" />
      </div>

      {/* Steps */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div key={step.number} className="relative">

              {/* Step Card */}
              <div className="group relative flex h-full flex-col items-center rounded-2xl border border-[#2563EB]/40 bg-[#0B1020] px-5 py-10 text-center transition duration-300 hover:-translate-y-2 hover:border-[#FFB020] hover:shadow-xl hover:shadow-blue-950/40">

                {/* Number */}
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#2563EB] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/30">
                  {step.number}
                </span>

                {/* Icon */}
                <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-blue-600/10 text-[#FFB020] transition group-hover:bg-[#2563EB] group-hover:text-white">
                  <Icon size={38} strokeWidth={1.8} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {step.description}
                </p>
              </div>

              {/* Arrow */}
              {index !== steps.length - 1 && (
                <ArrowRight
                  size={28}
                  className="absolute -right-7 top-1/2 z-10 hidden -translate-y-1/2 text-[#FFB020] lg:block"
                />
              )}

            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-14 text-center">
        <Link
          href="/services"
          className="inline-flex items-center gap-3 rounded-xl bg-[#FFB020] px-8 py-4 font-bold text-[#05070D] transition hover:bg-[#2563EB] hover:text-white"
        >
          Explore Services
          <ArrowRight size={20} />
        </Link>

        <p className="mt-4 text-sm text-slate-400">
          Your repair journey starts here!
        </p>
      </div>

    </section>
  );
}
