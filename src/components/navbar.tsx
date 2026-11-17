"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiWrenchScrewdriver,
  HiChevronDown,
  HiBars3,
  HiXMark,
  HiOutlineSun,
  HiOutlineMoon,
} from "react-icons/hi2";

/*
  Palette
  Black  #05070D  – navbar surface
  White  #FFFFFF  – text / light mode surface
  Blue   #2563EB  – active link, logo tile
  Amber  #FFB020  – primary action (Sign Up)
*/

const links = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services", dropdown: true },
  { label: "Track Job", href: "/track-job" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const services = [
  "Smartphone Screen",
  "Laptop Servicing",
  "AC Servicing",
  "Refrigerator",
  "TV Repair",
  "Washing Machine",
  "Electrical Wiring",
];

export default function Navbar() {
  const pathname = usePathname();
  const [dark, setDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef(null);

  // close the services dropdown when clicking outside
  useEffect(() => {
    const onClick = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const shell = dark
    ? "bg-[#05070D]/90 border-white/10 text-white"
    : "bg-white/90 border-slate-200 text-[#05070D]";
  const idleLink = dark
    ? "text-slate-300 hover:text-white hover:bg-white/10"
    : "text-slate-600 hover:text-[#05070D] hover:bg-slate-100";
  const iconBtn = dark
    ? "border-white/15 text-slate-200 hover:bg-white/10"
    : "border-slate-200 text-slate-700 hover:bg-slate-100";

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6">
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl border px-4 py-2.5 shadow-[0_8px_30px_rgba(37,99,235,0.18)] backdrop-blur-xl ${shell}`}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#2563EB] text-white shadow-[0_0_20px_rgba(37,99,235,0.55)]">
            <HiWrenchScrewdriver className="h-6 w-6" />
          </span>
          <span className="text-xl font-bold tracking-tight">
            Fix<span className="text-[#FFB020]">Mate</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active = isActive(l.href);
            const cls = `flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active ? "bg-[#2563EB] text-white" : idleLink
            }`;

            if (l.dropdown) {
              return (
                <li key={l.label} ref={servicesRef} className="relative">
                  <button
                    type="button"
                    className={cls}
                    aria-expanded={servicesOpen}
                    aria-haspopup="true"
                    onClick={() => setServicesOpen((o) => !o)}
                  >
                    {l.label}
                    <HiChevronDown
                      className={`h-4 w-4 transition-transform ${
                        servicesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {servicesOpen && (
                    <ul
                      className={`absolute left-0 top-full mt-3 w-60 rounded-2xl border p-2 shadow-2xl ${
                        dark
                          ? "border-white/10 bg-[#0B1020] text-white"
                          : "border-slate-200 bg-white text-[#05070D]"
                      }`}
                    >
                      {services.map((s) => (
                        <li key={s}>
                          <Link
                            href={`/services?type=${encodeURIComponent(s)}`}
                            onClick={() => setServicesOpen(false)}
                            className={`block rounded-xl px-3 py-2 text-sm ${
                              dark ? "hover:bg-white/10" : "hover:bg-slate-100"
                            }`}
                          >
                            {s}
                          </Link>
                        </li>
                      ))}
                      <li className="mt-1 border-t border-white/10 pt-1">
                        <Link
                          href="/services"
                          onClick={() => setServicesOpen(false)}
                          className="block rounded-xl px-3 py-2 text-sm font-semibold text-[#FFB020] hover:bg-white/10"
                        >
                          View all services
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              );
            }

            return (
              <li key={l.label}>
                <Link href={l.href} className={cls}>
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDark((d) => !d)}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className={`grid h-10 w-10 place-items-center rounded-full border transition-colors ${iconBtn}`}
          >
            {dark ? (
              <HiOutlineSun className="h-5 w-5" />
            ) : (
              <HiOutlineMoon className="h-5 w-5" />
            )}
          </button>

          <Link
            href="/login"
            className={`hidden rounded-full border px-5 py-2 text-sm font-semibold transition-colors sm:block ${iconBtn}`}
          >
            Login
          </Link>
          <Link
            href="/register"
            className="hidden rounded-full bg-[#FFB020] px-5 py-2 text-sm font-semibold text-[#05070D] transition hover:brightness-110 sm:block"
          >
            Sign Up
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className={`grid h-10 w-10 place-items-center rounded-full border lg:hidden ${iconBtn}`}
          >
            {mobileOpen ? (
              <HiXMark className="h-5 w-5" />
            ) : (
              <HiBars3 className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className={`mx-auto mt-2 max-w-7xl rounded-2xl border p-3 backdrop-blur-xl lg:hidden ${shell}`}
        >
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-sm font-medium ${
                    isActive(l.href) ? "bg-[#2563EB] text-white" : idleLink
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className={`rounded-xl border py-3 text-center text-sm font-semibold ${iconBtn}`}
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl bg-[#FFB020] py-3 text-center text-sm font-semibold text-[#05070D]"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}