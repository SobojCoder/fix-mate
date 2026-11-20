"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    ArrowLeftRight,
  BadgeCheck,
  CalendarCheck,
  CalendarDays,
  ChartBar,
  ChevronDown,
  ClipboardList,
  CreditCard,
  Heart,
  LayoutGrid,
  LogOut,
  MapPin,
  Menu,
  PlusCircle,
  Settings,
  Star,
  Tag,
  User,
  UserCheck,
  Users,
  Wallet,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { MdOutlineDashboard } from "react-icons/md";

/* ══════════════════════════════════════════════
   Menu configuration
   ══════════════════════════════════════════════ */

type DashboardRole = "customer" | "technician" | "admin";

type MenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type SessionUser = {
  name?: string;
  email?: string;
  image?: string | null;
  accountType?: string;
  role?: string;
};

/* One menu item shape: { label, href, icon } — grouped per accountType */
const menuItemsByRole: Record<DashboardRole, MenuItem[]> = {
  customer: [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutGrid },
    { label: "My Bookings", href: "/dashboard/customer/bookings", icon: ClipboardList },
    { label: "Saved Services", href: "/dashboard/customer/saved", icon: Heart },
    { label: "Payments", href: "/dashboard/customer/payments", icon: CreditCard },
    { label: "Settings", href: "/dashboard/customer/settings", icon: Settings },
  ],
  technician: [
    { label: "Overview", href: "/dashboard/technician", icon: LayoutGrid },
    { label: "Job Requests", href: "/dashboard/technician/jobs", icon: ClipboardList },
    { label: "add-service", href: "/dashboard/technician/add-service", icon: PlusCircle },
    { label: "My Services", href: "/dashboard/technician/services", icon: Wrench },
    { label: "Earnings", href: "/dashboard/technician/earnings", icon: Wallet },
    { label: "Reviews", href: "/dashboard/technician/reviews", icon: Star },
    { label: "Settings", href: "/dashboard/technician/settings", icon: Settings },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutGrid },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Technicians", href: "/dashboard/technicians", icon: UserCheck },
    {
      label: "Services",
      href: "/dashboard/admin/services",
      icon: BadgeCheck,
    },
    { label: "Booking", href: "/dashboard/admin/booking", icon: CalendarCheck },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: ArrowLeftRight },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ],
};

const accountTypeLabel: Record<DashboardRole, string> = {
  customer: "Customer",
  technician: "Technician",
  admin: "Admin",
};

/* Sign-up only offers Customer / Technician, so admins come from the
   Better Auth admin() plugin (role === "admin") — both are honored here. */
const resolveRole = (user: SessionUser | undefined): DashboardRole => {
  if (!user) return "customer";
  const accountType = (user.accountType ?? "").toLowerCase();
  if (user.role === "admin" || accountType === "admin") return "admin";
  if (accountType === "technician") return "technician";
  return "customer";
};

/* ══════════════════════════════════════════════
   Shared bits
   ══════════════════════════════════════════════ */

const Avatar = ({
  image,
  name,
  
  size = 40,
}: {
  image?: string | null;
  name: string;
  size?: number;
}) => {
  if (image) {
    return (
      <Image
        src={image}
        alt={name || "User"}
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
      {(name || "?").charAt(0).toUpperCase()}
    </span>
  );
};

const DashboardSkeleton = () => (
  <div className="flex min-h-screen animate-pulse bg-[#05070D]">
    {/* Sidebar */}
    <div className="hidden w-64 flex-col gap-4 border-r border-white/10 bg-[#0B1020] p-5 lg:flex">
      <div className="flex items-center gap-3">
        <div className="size-11 rounded-full bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-28 rounded bg-white/10" />
          <div className="h-3 w-16 rounded bg-white/10" />
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-11 rounded-xl bg-white/5" />
        ))}
      </div>
    </div>

    {/* Content */}
    <div className="flex-1 space-y-4 p-6">
      <div className="h-14 rounded-xl bg-[#0B1020]" />
      <div className="h-72 rounded-3xl bg-[#0B1020]" />
    </div>
  </div>
);

/* ══════════════════════════════════════════════
   Sidebar
   ══════════════════════════════════════════════ */

const Sidebar = ({
  user,
  role,
  open,
  onClose,
  pending,
}: {
  user?: SessionUser;
  role: DashboardRole;
  open: boolean;
  onClose: () => void;
  pending: boolean;
}) => {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const menu = menuItemsByRole[role];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#0B1020] transition-transform duration-200 lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Header: photo, name, accountType */}
      <div className="flex items-center gap-3 border-b border-white/10 p-5">
        {pending || !user ? (
          <>
            <div className="size-11 shrink-0 rounded-full bg-white/10" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-28 rounded bg-white/10" />
              <div className="h-3 w-16 rounded bg-white/10" />
            </div>
          </>
        ) : (
          <>
            <Avatar image={user.image} name={user.name ?? ""} size={44} />

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">

              <p className="truncate text-xl font-bold text-white">
                {user.name || "User"}
              </p>
              <span className="mt-1 inline-flex items-center rounded-full border border-[#FFB020]/40 bg-[#FFB020]/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#FFB020]">
                {accountTypeLabel[role]}
              </span>
                </div>
            <p className="text-blue-100 text-sm">{user.email}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:text-white lg:hidden"
            >
              <X size={17} />
            </button>
          </>
        )}
      </div>

      {/* Menu items for the current accountType */}
      {pending || !user ? (
        <div className="space-y-3 p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-11 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      ) : (
        <nav
          className="flex-1 space-y-1 overflow-y-auto p-4"
          aria-label="Dashboard navigation"
        >
          {menu.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#2563EB] text-white shadow-[0_0_16px_rgba(37,99,235,0.35)]"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} className={active ? "text-[#FFB020]" : ""} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}

      {/* Footer note */}
      <div className="border-t border-white/10 p-4">
        <p className="text-center text-[11px] uppercase tracking-wider text-slate-500">
          Signed in as {accountTypeLabel[role]}
        </p>
      </div>
    </aside>
  );
};

/* ══════════════════════════════════════════════
   Dashboard navbar
   ══════════════════════════════════════════════ */
     

const DashboardNavbar = ({
  user,
  pending,
  onToggleMenu,
}: {
  user?: SessionUser;
  pending: boolean;
  onToggleMenu: () => void;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  /* Close the avatar menu on outside click */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  /* Close on Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await authClient.signOut();
      if (error) {
        toast.error(error.message || "Could not sign out.");
        return;
      }
      toast.success("Signed out successfully.");
      router.push("/sign-in");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#05070D]/85 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Mobile menu toggle + logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMenu}
            aria-label="Open menu"
            className="grid size-10 place-items-center rounded-xl border border-white/15 text-slate-200 transition hover:bg-white/10 lg:hidden"
          >
            <Menu size={19} />
          </button>

          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-lg bg-[#2563EB] text-white shadow-[0_0_16px_rgba(37,99,235,0.55)]">
              <Wrench size={18} />
            </span>
            <span className="text-lg font-bold tracking-tight">
              Fix<span className="text-[#FFB020]">Mate</span>
             
            </span>
          </Link>
        </div>

        {/* Avatar menu */}
        <div className="relative" ref={menuRef}>
          {pending || !user ? (
            <span
              aria-hidden
              className="block h-10 w-28 animate-pulse rounded-full bg-white/10"
            />
          ) : (
            <>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                aria-label="Account menu"
                className="flex items-center gap-2 rounded-full border border-white/15 py-1 pl-1 pr-3 transition hover:bg-white/10"
              >
                <Avatar image={user.image} name={user.name ?? ""} size={32} />
                <span className="hidden max-w-[110px] truncate text-sm font-semibold sm:block">
                  {user.name}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-3 w-64 origin-top-right overflow-hidden rounded-2xl border border-white/10 bg-[#0B1020] shadow-2xl"
                >
                  <div className="flex items-center gap-3 p-4">
                    { user?.image ?
        
           <Image
             src={user.image}
             alt={user.name || "User"}
             width={44}
             height={44}
             unoptimized
             className="shrink-0 rounded-full object-cover ring-2 ring-[#2563EB]/60"
           />
           :
       
         <span
           style={{ width: 44, height: 44, fontSize: 44 * 0.4 }}
           className="grid shrink-0 place-items-center rounded-full bg-[#2563EB] font-bold text-white ring-2 ring-[#2563EB]/60"
         >
           {(user?.name || "?").charAt(0).toUpperCase()}
         </span>
      }
      
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">
                        {user.name}
                      </p>
                      <p
                        className="truncate text-xs"
                      >
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    role="menuitem"
                    className="flex items-center border-t border-t border-white/10 gap-3 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    <User size={16} className="h-5 w-5 text-[#2563EB]"/>
                    Profile
                  </Link>
                  <Link
                      href={`/dashboard/${user?.accountType?.toLowerCase()}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                    >
                      <MdOutlineDashboard size={16} className="h-5 w-5 text-[#2563EB]" />
                      Dashboard
                    </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    role="menuitem"
                    className="flex w-full items-center gap-3 border-t border-white/10 px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

/* ══════════════════════════════════════════════
   Layout
   ══════════════════════════════════════════════ */

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as SessionUser | undefined;

  /* Not signed in → go to sign in (same guard as the profile page) */
  useEffect(() => {
    if (!isPending && !user) router.replace("/sign-in");
  }, [isPending, user, router]);

  /* Escape closes the mobile sidebar */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Pending, or waiting on the redirect → skeleton only */
  if (!user) return <DashboardSkeleton />;

  const role = resolveRole(user);

  return (
    <div className="min-h-screen bg-[#05070D] text-white">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          aria-hidden
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      <Sidebar
        user={user}
        role={role}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        pending={isPending}
      />

      <div className="flex min-h-screen flex-col lg:pl-64">
        <DashboardNavbar
          user={user}
          pending={isPending}
          onToggleMenu={() => setSidebarOpen((o) => !o)}
        />

        <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
