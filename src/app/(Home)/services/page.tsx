import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  House,
  MapPin,
  Search,
  SearchX,
  Store,
  User,
} from "lucide-react";

import { getServices } from "@/lib/api/services";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

type Service = {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: string;
  isAvailable: boolean;
  createdAt: string;
};

/* Filter options — must match the values stored in MongoDB */
const CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const SERVICE_MODES = ["Home Visit", "Shop Drop-off"];

const SORT_OPTIONS = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

const fieldLabel =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400";

const fieldBox =
  "w-full rounded-xl border border-white/10 bg-[#05070D] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.25)]";

const optionBox = "bg-[#05070D] text-white";

const gridCols =
  "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

export default function ServicesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="min-h-screen bg-[#05070D] text-white">
      {/* ── Page heading ── */}
      <section className="relative overflow-hidden px-6 pb-12 pt-16 md:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 -top-20 h-[420px] w-[420px] rounded-full bg-[#2563EB]/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 top-10 h-[380px] w-[380px] rounded-full bg-[#FFB020]/15 blur-3xl"
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#FFB020]/40 bg-[#0B1020] px-4 py-2 text-sm text-[#FFB020]">
            <Search size={16} />
            Browse Services
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-5xl">
            Find the Right Repair
            <span className="block text-[#FFB020]">for Your Device.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-300">
            Search, filter and sort verified repair services — every result comes
            straight from our live service catalogue.
          </p>

          <div className="mx-auto mt-8 h-1 w-28 rounded-full bg-gradient-to-r from-[#2563EB] to-[#FFB020]" />
        </div>
      </section>

      {/* ── Filters + results (streamed behind Suspense) ── */}
      <section className="px-6 pb-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          <Suspense fallback={<ResultsSkeleton />}>
            <ServicesResults searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

const ServicesResults = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const search = await searchParams;
  const urlSearch = new URLSearchParams(search as Record<string, string>);
  const query = urlSearch.toString();

  const services: Service[] = await getServices(query);

  const q = urlSearch.get("search") ?? "";
  const category = urlSearch.get("category") ?? "";
  const mode = urlSearch.get("serviceMode") ?? "";
  const sort = urlSearch.get("sort") || "newest";
  const hasFilters = Boolean(q || category || mode || sort !== "newest");

  return (
    <>
      {/* ── Search / filter / sort bar (plain GET form → lives in the URL) ── */}
      <form
        method="get"
        action="/services"
        className="rounded-3xl border border-white/10 bg-[#0B1020]/85 p-5 backdrop-blur-xl sm:p-6"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
          {/* Search */}
          <div className="md:col-span-2 xl:col-span-1">
            <label htmlFor="search" className={fieldLabel}>
              Search
            </label>
            <div className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                id="search"
                name="search"
                type="search"
                defaultValue={q}
                placeholder="Search by title or category…"
                className={`${fieldBox} pl-10`}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className={fieldLabel}>
              Category
            </label>
            <select
              id="category"
              name="category"
              defaultValue={category}
              className={fieldBox}
            >
              <option value="" className={optionBox}>
                All categories
              </option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className={optionBox}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Service mode */}
          <div>
            <label htmlFor="serviceMode" className={fieldLabel}>
              Service mode
            </label>
            <select
              id="serviceMode"
              name="serviceMode"
              defaultValue={mode}
              className={fieldBox}
            >
              <option value="" className={optionBox}>
                Any mode
              </option>
              {SERVICE_MODES.map((m) => (
                <option key={m} value={m} className={optionBox}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label htmlFor="sort" className={fieldLabel}>
              Sort by
            </label>
            <select
              id="sort"
              name="sort"
              defaultValue={sort}
              className={fieldBox}
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value} className={optionBox}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-end gap-3 md:col-span-2 xl:col-span-1">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#FFB020] px-6 py-3 text-sm font-bold text-[#05070D] transition hover:bg-[#2563EB] hover:text-white"
            >
              Apply
              <ArrowRight size={16} />
            </button>

            {hasFilters && (
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-[#FFB020] hover:text-[#FFB020]"
              >
                Clear
              </Link>
            )}
          </div>
        </div>
      </form>

      {/* ── Result count ── */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-400">
          Showing{" "}
          <span className="font-semibold text-white">{services.length}</span>{" "}
          {services.length === 1 ? "service" : "services"}
          {category && (
            <>
              {" "}
              in{" "}
              <span className="font-semibold text-[#FFB020]">{category}</span>
            </>
          )}
          {q && (
            <>
              {" "}
              matching{" "}
              <span className="font-semibold text-[#FFB020]">
                &ldquo;{q}&rdquo;
              </span>
            </>
          )}
        </p>

        {hasFilters && (
          <Link
            href="/services"
            className="text-sm font-semibold text-[#2563EB] transition hover:text-[#FFB020]"
          >
            Reset all filters
          </Link>
        )}
      </div>

      {/* ── Grid / empty state ── */}
      {services.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-white/15 bg-[#0B1020]/60 px-6 py-16 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#2563EB]/15 text-[#FFB020]">
            <SearchX size={30} />
          </div>

          <h2 className="mt-5 text-xl font-bold">No services found</h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
            We couldn&apos;t find anything matching your search. Try a different
            keyword, or clear your filters to see everything we offer.
          </p>

          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#FFB020] px-6 py-3 text-sm font-bold text-[#05070D] transition hover:bg-[#2563EB] hover:text-white"
          >
            Show all services
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className={`mt-8 ${gridCols}`}>
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      )}
    </>
  );
};

const ServiceCard = ({ service }: { service: Service }) => {
  const isHomeVisit = service.serviceMode === "Home Visit";

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#2563EB]/30 bg-[#0B1020] transition duration-300 hover:-translate-y-1 hover:border-[#FFB020]">
      {/* Image + overlay badges */}
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />

        <span className="absolute left-3 top-3 rounded-full bg-[#05070D]/90 px-3 py-1 text-xs font-semibold text-[#FFB020] backdrop-blur">
          {service.category}
        </span>

        <span
          className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur ${
            isHomeVisit
              ? "bg-[#FFB020]/90 text-[#05070D]"
              : "bg-[#2563EB]/90 text-white"
          }`}
        >
          {isHomeVisit ? <House size={12} /> : <Store size={12} />}
          {service.serviceMode}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold leading-snug transition group-hover:text-[#FFB020]">
          {service.title}
        </h3>

        <div className="mt-3 space-y-1.5 text-sm text-slate-400">
          <p className="flex items-center gap-2">
            <MapPin size={14} className="shrink-0 text-[#2563EB]" />
            {service.serviceArea}
          </p>
          <p className="flex items-center gap-2">
            <User size={14} className="shrink-0 text-[#2563EB]" />
            {service.technicianName}
          </p>
        </div>

        {/* Price + action */}
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-white/10 pt-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Starting at
            </p>
            <p className="mt-0.5 text-xl font-extrabold text-[#FFB020]">
              ৳{service.basePrice}
            </p>
          </div>

          <Link
            href={`/services/${service._id}`}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#FFB020] hover:text-[#05070D]"
          >
            View Details
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
};

const ResultsSkeleton = () => (
  <div aria-hidden className="animate-pulse">
    <div className="h-36 rounded-3xl bg-[#0B1020]" />
    <div className="mt-8 h-5 w-52 rounded bg-[#0B1020]" />
    <div className={`mt-8 ${gridCols}`}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-72 rounded-2xl bg-[#0B1020]" />
      ))}
    </div>
  </div>
);
