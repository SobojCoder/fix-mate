"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  HiWrenchScrewdriver,
  HiChevronDown,
  HiBars3,
  HiXMark,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineUserCircle,
  HiOutlineWrench,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { MdOutlineDashboard } from "react-icons/md";

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



export default function Navbar() {
  const pathname = usePathname();
  
  const [dark, setDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const servicesRef = useRef<HTMLLIElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // close the services dropdown when clicking outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        servicesRef.current &&
        !servicesRef.current.contains(e.target as Node)
      ) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // close the user menu when clicking outside or pressing Escape
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    setMobileOpen(false);
    try {
      const { error } = await authClient.signOut();
      if (error) {
        toast.error(error.message || "Could not sign out.");
        return;
      }
      toast.success("Signed out successfully.");
      window.location.reload();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  /* Avatar: real photo when available, otherwise blue initial circle */
  const renderAvatar = (size = 40) => {
    if (user?.image) {
      return (
        <Image
          src={user.image}
          alt={user.name || "User"}
          width={size}
          height={size}
          unoptimized
          className="shrink-0 rounded-full object-cover ring-2 ring-[#2563EB]/60"
        />
      );
    }
    return (
      <span
        style={{ width: size, height: size, fontSize: size * 0.4 }}
        className="grid shrink-0 place-items-center rounded-full bg-[#2563EB] font-bold text-white ring-2 ring-[#2563EB]/60"
      >
        {(user?.name || "?").charAt(0).toUpperCase()}
      </span>
    );
  };

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

          {/* Auth area: skeleton → avatar menu, or Login / Sign Up */}
          {isPending ? (
            <span
              aria-hidden
              className="hidden h-10 w-28 animate-pulse rounded-full bg-white/10 sm:block"
            />
          ) : user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((o) => !o)}
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
                aria-label="Account menu"
                className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 transition-colors ${iconBtn}`}
              >
                {renderAvatar(32)}
                <span className="hidden max-w-[110px]  truncate text-sm font-semibold sm:block">
                  {user.name}
                </span>
                <HiChevronDown
                  className={`h-4 w-4 transition-transform ${
                    userMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {userMenuOpen && (
                <div
                  role="menu"
                  aria-label="Account"
                  className="absolute right-0 top-full z-50 mt-3 w-64 origin-top-right overflow-hidden rounded-2xl border shadow-2xl"
                  style={{
                    backgroundColor: dark ? "#0B1020" : "#ffffff",
                    borderColor: dark ? "rgba(255,255,255,0.1)" : "#e2e8f0",
                    color: dark ? "#ffffff" : "#05070D",
                  }}
                >
                  {/* Header: photo, name, email */}
                  <div className="flex items-center gap-3 p-4">
                    {renderAvatar(44)}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">
                        {user.name}
                      </p>
                      <p
                        className="truncate text-xs"
                        style={{ color: dark ? "#94a3b8" : "#64748b" }}
                      >
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div
                    className="h-px"
                    style={{
                      backgroundColor: dark
                        ? "rgba(255,255,255,0.1)"
                        : "#e2e8f0",
                    }}
                  />

                  {/* Links */}
                  <div className="p-2">
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                        dark
                          ? "hover:bg-white/10"
                          : "hover:bg-slate-100 hover:text-[#05070D]"
                      }`}
                    >
                      <HiOutlineUserCircle className="h-5 w-5 text-[#2563EB]" />
                      Profile
                    </Link>
                    <Link
                      href={`/dashboard/${user?.accountType?.toLowerCase()}`}
                      onClick={() => setUserMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                        dark
                          ? "hover:bg-white/10"
                          : "hover:bg-slate-100 hover:text-[#05070D]"
                      }`}
                    >
                      <MdOutlineDashboard className="h-5 w-5 text-[#2563EB]" />
                      Dashboard
                    </Link>

                    <Link
                      href="/services"
                      onClick={() => setUserMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                        dark
                          ? "hover:bg-white/10"
                          : "hover:bg-slate-100 hover:text-[#05070D]"
                      }`}
                    >
                      <HiOutlineWrench className="h-5 w-5 text-[#FFB020]" />
                      Services
                    </Link>
                  </div>

                  <div
                    className="h-px"
                    style={{
                      backgroundColor: dark
                        ? "rgba(255,255,255,0.1)"
                        : "#e2e8f0",
                    }}
                  />

                  {/* Sign out */}
                  <div className="p-2">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/15"
                    >
                      <HiOutlineArrowRightOnRectangle className="h-5 w-5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                className={`hidden rounded-full border px-5 py-2 text-sm font-semibold transition-colors sm:block ${iconBtn}`}
              >
                Login
              </Link>
              <Link
                href="/sign-up"
                className="hidden rounded-full bg-[#FFB020] px-5 py-2 text-sm font-semibold text-[#05070D] transition hover:brightness-110 sm:block"
              >
                Sign Up
              </Link>
            </>
          )}

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
          <div className="mt-3">
            {user ? (
              <div
                className="rounded-xl border p-3"
                style={{
                  borderColor: dark ? "rgba(255,255,255,0.1)" : "#e2e8f0",
                }}
              >
                <div className="flex items-center gap-3">
                  {renderAvatar(44)}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{user.name}</p>
                    <p
                      className="truncate text-xs"
                      style={{ color: dark ? "#94a3b8" : "#64748b" }}
                    >
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid gap-1">
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                      isActive("/profile")
                        ? "bg-[#2563EB] text-white"
                        : idleLink
                    }`}
                  >
                    <HiOutlineUserCircle className="h-5 w-5 text-[#2563EB]" />
                    Profile
                  </Link>
                  <Link
                    href={`/dashboard/${user?.accountType}`}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                      isActive("/profile")
                        ? "bg-[#2563EB] text-white"
                        : idleLink
                    }`}
                  >
                    <MdOutlineDashboard className="h-5 w-5 text-[#2563EB]" />
                    Dashboard
                  </Link>
                  <Link
                    href="/services"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${idleLink}`}
                  >
                    <HiOutlineWrench className="h-5 w-5 text-[#FFB020]" />
                    Services
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/15"
                  >
                    <HiOutlineArrowRightOnRectangle className="h-5 w-5" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-xl border py-3 text-center text-sm font-semibold ${iconBtn}`}
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl bg-[#FFB020] py-3 text-center text-sm font-semibold text-[#05070D]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}