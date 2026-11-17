
import Link from "next/link";
import {
  Wrench,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { ImFacebook2 } from "react-icons/im";
import { TfiFacebook } from "react-icons/tfi";
import { PiYoutubeLogoBold } from "react-icons/pi";
import { FaLinkedinIn } from "react-icons/fa";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About Us", href: "/about" },
  { name: "Track Job", href: "/my-jobs" },
  { name: "Contact", href: "/contact" },
];

const categories = [
  "Phone Repair",
  "Laptop Repair",
  "AC Repair",
  "Refrigerator Repair",
  "TV Repair",
  "Home Appliances",
];

export default function Footer() {
  return (
    <footer className="bg-[#05070D] text-white">

      {/* Top Border */}
      <div className="h-1 bg-gradient-to-r from-[#2563EB] via-[#FFB020] to-[#2563EB]" />

      <div className="mx-auto max-w-7xl px-6 py-16">

        {/* Main Footer */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-[#2563EB]">
                <Wrench size={27} className="text-white" />
              </div>

              <h2 className="text-3xl font-extrabold">
                Fix<span className="text-[#FFB020]">Mate</span>
              </h2>
            </Link>

            <h3 className="mt-6 text-lg font-semibold text-[#FFB020]">
              Fix smarter. Live better.
            </h3>

            <p className="mt-3 max-w-xs text-sm leading-7 text-slate-400">
              Your trusted repair partner for all devices
              and home appliances. Quality service,
              verified technicians, and hassle-free repairs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold">
              Quick Links
            </h3>

            <div className="mt-3 h-1 w-12 rounded-full bg-[#FFB020]" />

            <ul className="mt-6 space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-3 text-sm text-slate-400 transition hover:translate-x-1 hover:text-[#FFB020]"
                  >
                    <span className="text-[#2563EB]">❯</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xl font-bold">
              Popular Categories
            </h3>

            <div className="mt-3 h-1 w-12 rounded-full bg-[#FFB020]" />

            <ul className="mt-6 space-y-4">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    href="/services"
                    className="flex items-center gap-3 text-sm text-slate-400 transition hover:translate-x-1 hover:text-[#FFB020]"
                  >
                    <span className="text-[#2563EB]">❯</span>
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold">
              Contact Us
            </h3>

            <div className="mt-3 h-1 w-12 rounded-full bg-[#FFB020]" />

            <div className="mt-6 space-y-6">

              <div className="flex items-center gap-4">
                <div className="rounded-full bg-[#2563EB] p-3">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email Us</p>
                  <p className="text-sm text-slate-300">
                    support@fixmate.com
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-full bg-[#2563EB] p-3">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Call Us</p>
                  <p className="text-sm text-slate-300">
                    +880 1234-567890
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-full bg-[#2563EB] p-3">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Our Location</p>
                  <p className="text-sm text-slate-300">
                    Dhaka, Bangladesh
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-gradient-to-r from-[#2563EB] via-slate-700 to-[#FFB020]" />

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">

          <p className="text-center text-sm text-slate-400">
            © {new Date().getFullYear()}{" "}
            <span className="font-bold text-[#FFB020]">
              FixMate
            </span>
            . All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3">

            <Link
              href="https://x.com"
              aria-label="X"
              className="flex size-11 items-center justify-center rounded-xl border border-slate-700 text-white transition hover:border-[#2563EB] hover:bg-[#2563EB]"
            >
              <span className="text-xl font-bold">𝕏</span>
            </Link>

            <Link
              href="https://facebook.com"
              aria-label="Facebook"
              className="flex size-11 items-center justify-center rounded-xl border border-slate-700 text-white transition hover:border-[#2563EB] hover:bg-[#2563EB]"
            >
              <TfiFacebook size={20} />
            </Link>

            <Link
              href="https://youtube.com"
              aria-label="YouTube"
              className="flex size-11 items-center justify-center rounded-xl border border-slate-700 text-white transition hover:border-[#FFB020] hover:bg-[#FFB020] hover:text-black"
            >
              <PiYoutubeLogoBold size={20} />
            </Link>

            <Link
              href="https://linkedin.com"
              aria-label="LinkedIn"
              className="flex size-11 items-center justify-center rounded-xl border border-slate-700 text-white transition hover:border-[#2563EB] hover:bg-[#2563EB]"
            >
              <FaLinkedinIn size={20} />
            </Link>

          </div>
        </div>
      </div>
    </footer>
  );
}
