import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, MapPin, Calendar, Ticket } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#1E1E24] text-white/80 border-t border-white/10 pb-20 sm:pb-12">
      
      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Brand Column */}
          <div className="sm:col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl border border-white/20 bg-white p-0.5 flex items-center justify-center shrink-0">
                <img
                  src="/images/Logo.jpeg"
                  alt="Raghav Events"
                  className="h-full w-full object-contain rounded-lg"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-white font-display">
                Raghav Events
              </span>
            </Link>
            <p className="text-xs text-white/70 leading-relaxed max-w-sm">
              Official ticketing and season passes for Junagadh Navratri Mahotsav 2026 at Satyam Party Plot, Zanzarda Chokdi (11-20 October).
            </p>
            <div className="flex items-center gap-2 text-xs text-[#E5C384] font-semibold pt-1">
              <ShieldCheck size={14} className="text-[#C9A96E]" />
              <span>Official Organizers Seal</span>
            </div>
          </div>

          {/* Passes */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-3 text-[#E5C384]">
              Festival Passes
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/TicketBooking?pass=Family%20Pass" className="hover:text-white transition block py-0.5">
                  Family Pass (₹7,499)
                </Link>
              </li>
              <li>
                <Link to="/TicketBooking?pass=Couple%20Pass" className="hover:text-white transition block py-0.5">
                  Couple Pass (₹3,999)
                </Link>
              </li>
              <li>
                <Link to="/TicketBooking?pass=Children%20Pass" className="hover:text-white transition block py-0.5">
                  Children Pass (₹1,499)
                </Link>
              </li>
            </ul>
          </div>

          {/* Venue & Dates */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-3 text-[#E5C384]">
              Venue &amp; Schedule
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <span className="text-white font-bold block">
                  Satyam Party Plot
                </span>
                <span className="text-[11px] text-white/60 block">
                  Zanzarda Chokdi, Junagadh
                </span>
              </li>
              <li className="pt-1">
                <span className="text-white font-bold block">
                  11 – 20 October 2026
                </span>
                <span className="text-[11px] text-white/60 block">
                  7:00 PM Onwards (10 Nights)
                </span>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-3 text-[#E5C384]">
              Help &amp; Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/my-tickets" className="hover:text-white transition block py-0.5">
                  View Bookings
                </Link>
              </li>
              <li>
                <Link to="/signin" className="hover:text-white transition block py-0.5">
                  Attendee Login
                </Link>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition block py-0.5">
                  FAQs &amp; Guidelines
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50 text-center sm:text-left">
          <p>© 2026 Raghav Events Junagadh. All rights reserved.</p>
          <p>Official Navratri Garba Ticketing Portal</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
