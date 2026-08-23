import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Ticket,
  User,
  LogOut,
  ShieldCheck,
  Calendar,
  MapPin,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#FBF8F2]/95 backdrop-blur-md border-b border-[#E8DCC5] transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
          
          {/* Brand Logo & Title */}
          <Link to="/" className="flex items-center gap-3 focus:outline-none group">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl border border-[#E8DCC5] bg-white p-1 flex items-center justify-center shrink-0 shadow-xs group-hover:border-[#C9A96E] transition">
              <img
                src="/images/Logo.jpeg"
                alt="Raghav Events"
                className="h-full w-full object-contain rounded-lg"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
            <div>
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-[#292929] block leading-tight group-hover:text-[#936E2A] transition font-display">
                Raghav Events
              </span>
              <span className="text-[10px] sm:text-[11px] font-extrabold text-[#936E2A] tracking-wider uppercase block">
                Junagadh Navratri 2026
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-extrabold uppercase tracking-wider text-[#77736B]">
            <a
              href="/#passes"
              className="transition hover:text-[#292929]"
            >
              Passes
            </a>

            <a
              href="/#schedule"
              className="transition hover:text-[#292929]"
            >
              10-Night Lineup
            </a>

            <a
              href="/#venue"
              className="transition hover:text-[#292929]"
            >
              Venue &amp; Ground
            </a>

            <a
              href="/#experience"
              className="transition hover:text-[#292929]"
            >
              Atmosphere
            </a>

            <a
              href="/#faq"
              className="transition hover:text-[#292929]"
            >
              FAQ
            </a>

            {user && (
              <Link
                to="/my-tickets"
                className={`transition hover:text-[#292929] ${
                  isActive("/my-tickets") ? "text-[#292929]" : ""
                }`}
              >
                My Bookings
              </Link>
            )}

            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1 text-[#936E2A] hover:text-[#7A5B20] font-bold"
              >
                <ShieldCheck size={14} /> Admin
              </Link>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-3">
            
            {user ? (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-xs font-bold text-[#292929] hover:text-[#936E2A] transition"
                >
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#292929] text-xs font-bold text-white shadow-xs">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name}</span>
                </Link>

                <button
                  onClick={signOut}
                  className="rounded-lg p-2 text-[#77736B] hover:text-[#292929] hover:bg-[#E8DCC5]/40 transition"
                  title="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/signin"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#292929] hover:text-[#936E2A] transition px-3 py-2"
              >
                <User size={14} /> Sign In
              </Link>
            )}

            {/* Primary CTA */}
            <Link
              to="/TicketBooking"
              className="inline-flex items-center gap-2 rounded-xl btn-gold px-4 sm:px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider shadow-sm active:scale-95 text-[#1A1A1A]"
            >
              <Ticket size={14} />
              <span>Book Passes</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden grid h-10 w-10 place-items-center rounded-xl border border-[#E8DCC5] bg-white text-[#292929] transition hover:bg-[#FBF8F2]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8DCC5] bg-white px-4 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            <a
              href="/#passes"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-extrabold text-[#292929] hover:bg-[#FBF8F2]"
            >
              <Ticket size={16} className="text-[#C9A96E]" /> Season Passes
            </a>

            <a
              href="/#schedule"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-extrabold text-[#292929] hover:bg-[#FBF8F2]"
            >
              <Calendar size={16} className="text-[#C9A96E]" /> 10-Night Lineup
            </a>

            <a
              href="/#venue"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-extrabold text-[#292929] hover:bg-[#FBF8F2]"
            >
              <MapPin size={16} className="text-[#C9A96E]" /> Venue &amp; Ground
            </a>

            <a
              href="/#experience"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-extrabold text-[#292929] hover:bg-[#FBF8F2]"
            >
              <Sparkles size={16} className="text-[#C9A96E]" /> Atmosphere
            </a>

            <a
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-extrabold text-[#292929] hover:bg-[#FBF8F2]"
            >
              <HelpCircle size={16} className="text-[#C9A96E]" /> FAQs
            </a>

            {user && (
              <Link
                to="/my-tickets"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-extrabold text-[#292929] hover:bg-[#FBF8F2]"
              >
                <Calendar size={16} className="text-[#C9A96E]" /> My Bookings
              </Link>
            )}

            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-extrabold text-[#936E2A] hover:bg-[#FBF8F2]"
              >
                <ShieldCheck size={16} /> Admin Studio
              </Link>
            )}
          </div>

          <div className="border-t border-[#E8DCC5] pt-4">
            {user ? (
              <div className="flex items-center justify-between px-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 text-sm font-bold text-[#292929]"
                >
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#292929] text-xs font-bold text-white">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#E8DCC5] bg-[#FBF8F2] py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#292929]"
              >
                <User size={15} /> Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
