
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  CreditCard,
  Headset,
  ArrowRight,
  Star,
  CheckCircle,
} from "lucide-react";

import technician from "@/../public/images/repair-hero.jpg";

const features = [
  {
    title: "Verified Technicians",
    description: "Skilled and trusted professionals to handle your repair needs.",
    icon: ShieldCheck,
  },
  {
    title: "Fast & Reliable Service",
    description: "Get your devices repaired quickly without unnecessary delays.",
    icon: Zap,
  },
  {
    title: "Secure Payments",
    description: "Pay securely online only after your repair is completed.",
    icon: CreditCard,
  },
  {
    title: "24/7 Customer Support",
    description: "Our support team is always ready to help you.",
    icon: Headset,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="overflow-hidden rounded-3xl bg-[#05070D] px-6 py-20 text-white md:px-12">
      
      <div className="grid items-center gap-12 lg:grid-cols-2">

        {/* Left Content */}
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#FFB020]/40 px-4 py-2 text-sm text-[#FFB020]">
            <Star size={16} />
            Why Choose FixMate?
          </div>

          <h2 className="text-3xl font-bold md:text-5xl">
            Why <span className="text-[#FFB020]">Choose Us?</span>
          </h2>

          <p className="mt-4 max-w-lg leading-7 text-slate-300">
            We&apos;re more than just a repair service.
            We&apos;re your trusted partner for fast,
            reliable, and transparent repairs.
          </p>

          {/* Feature Cards */}
          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={index}
                  className="group rounded-2xl border border-[#2563EB]/30 bg-[#0B1020] p-5 transition hover:-translate-y-1 hover:border-[#FFB020]"
                >
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-[#2563EB]/15 text-[#FFB020] transition group-hover:bg-[#2563EB] group-hover:text-white">
                    <Icon size={27} />
                  </div>

                  <h3 className="font-bold">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Button */}
          <Link
            href="/services"
            className="mt-8 inline-flex items-center gap-3 rounded-xl bg-[#FFB020] px-7 py-4 font-bold text-[#05070D] transition hover:bg-[#2563EB] hover:text-white"
          >
            Explore Services
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* Right Image */}
        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-[#2563EB]/20 blur-3xl" />

          <div className="relative overflow-hidden rounded-3xl border border-[#2563EB]/40">
            <Image
              src={technician}
              alt="Professional device repair technician"
              className="h-[450px] w-full object-cover"
              priority
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#05070D] via-transparent to-transparent" />

            {/* Trust Badge */}
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-blue-400/40 bg-[#05070D]/90 p-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-[#FFB020]" size={30} />
                <div>
                  <h3 className="font-bold">Trusted Service</h3>
                  <p className="text-xs text-slate-400">
                    Quality you can count on
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
  );
}
