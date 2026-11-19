import Link from "next/link";
import {
  ArrowRight,
  LayoutGrid,
  Laptop,
  Refrigerator,
  Smartphone,
  Snowflake,
  Tv,
  WashingMachine,
  Zap,
} from "lucide-react";

/* Values must match the categories stored in MongoDB */
const categories = [
  {
    title: "Smartphone",
    value: "Smartphone",
    icon: Smartphone,
    description: "Screen, battery, charging port & software fixes.",
  },
  {
    title: "Laptop & PC",
    value: "Laptop & PC",
    icon: Laptop,
    description: "Hardware, OS, upgrades & performance tune-ups.",
  },
  {
    title: "AC",
    value: "AC",
    icon: Snowflake,
    description: "Gas refill, cooling issues & annual servicing.",
  },
  {
    title: "Refrigerator",
    value: "Refrigerator",
    icon: Refrigerator,
    description: "Compressor, cooling coil & leak repairs.",
  },
  {
    title: "TV",
    value: "TV",
    icon: Tv,
    description: "Display, soundboard & smart TV problems.",
  },
  {
    title: "Washing Machine",
    value: "Washing Machine",
    icon: WashingMachine,
    description: "Drum, spin cycle & plumbing issues.",
  },
  {
    title: "Electrical",
    value: "Electrical",
    icon: Zap,
    description: "Wiring, sockets, MCB & fixture installation.",
  },
];

const Categories = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#05070D] px-6 py-20 text-white md:px-12">
      {/* Heading */}
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#FFB020]/40 px-4 py-2 text-sm text-[#FFB020]">
          <LayoutGrid size={16} />
          Categories
        </span>

        <h2 className="mt-5 text-3xl font-bold md:text-5xl">
          Browse by <span className="text-[#FFB020]">Category</span>
        </h2>

        <p className="mt-4 text-slate-300">
          Pick your device type and land on a page that&apos;s already filtered
          for it.
        </p>

        <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gradient-to-r from-[#2563EB] to-[#FFB020]" />
      </div>

      {/* Category cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <Link
              key={category.value}
              href={`/services?category=${encodeURIComponent(category.value)}`}
              className="group flex flex-col rounded-2xl border border-[#2563EB]/40 bg-[#0B1020] p-6 transition duration-300 hover:-translate-y-1.5 hover:border-[#FFB020] hover:shadow-xl hover:shadow-blue-950/40"
            >
              <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-blue-600/10 text-[#FFB020] transition group-hover:bg-[#2563EB] group-hover:text-white">
                <Icon size={28} strokeWidth={1.8} />
              </div>

              <h3 className="text-lg font-bold">{category.title}</h3>

              <p className="mt-2 flex-1 text-sm leading-6 text-slate-400">
                {category.description}
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] transition group-hover:text-[#FFB020]">
                View services
                <ArrowRight size={15} />
              </span>
            </Link>
          );
        })}

        {/* Browse-everything card */}
        <Link
          href="/services"
          className="group flex flex-col rounded-2xl border border-dashed border-[#FFB020]/50 bg-[#0B1020] p-6 transition duration-300 hover:-translate-y-1.5 hover:border-[#FFB020] hover:shadow-xl hover:shadow-blue-950/40"
        >
          <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-[#FFB020]/10 text-[#FFB020] transition group-hover:bg-[#FFB020] group-hover:text-[#05070D]">
            <LayoutGrid size={28} strokeWidth={1.8} />
          </div>

          <h3 className="text-lg font-bold">All Services</h3>

          <p className="mt-2 flex-1 text-sm leading-6 text-slate-400">
            Browse the full catalogue with search, filters &amp; sorting.
          </p>

          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#FFB020] transition group-hover:text-white">
            Explore now
            <ArrowRight size={15} />
          </span>
        </Link>
      </div>
    </section>
  );
};

export default Categories;
