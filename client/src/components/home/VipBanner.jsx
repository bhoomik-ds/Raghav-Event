import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, MessageCircle, Ticket } from "lucide-react";

const VipBanner = ({ eventId }) => {
  return (
    <section className="py-8 sm:py-12 bg-[#FBF8F2] border-t border-[#E8DCC5]">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#292929] via-[#1E1E24] to-[#141418] p-5 sm:p-12 text-white shadow-xl relative overflow-hidden border border-white/10">
          
          {/* Glowing Aura Accent */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#C9A96E]/20 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-8 text-center lg:text-left">
            
            <div className="max-w-xl space-y-2 sm:space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-0.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#E5C384]">
                <Sparkles size={12} className="text-[#C9A96E]" />
                <span>Corporate &amp; VIP Group Bookings</span>
              </div>
              <h3 className="text-xl sm:text-4xl font-extrabold text-white font-display">
                Need Bulk Passes or VIP Lounge Seating?
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal">
                Looking for 10+ corporate passes, sponsored stalls, or exclusive air-conditioned VIP lounge seating? Our event relations desk is available 24/7.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3.5 w-full sm:w-auto shrink-0">
              <a
                href="https://wa.me/919876543210?text=Hi%20Raghav%20Events,%20I%20am%20interested%20in%20Navratri%202026%20passes"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 sm:px-6 py-3 text-xs font-extrabold uppercase tracking-wider transition shadow-md touch-press"
              >
                <MessageCircle size={15} />
                <span>WhatsApp Desk</span>
              </a>

              <Link
                to={`/TicketBooking${eventId ? `?event=${eventId}` : ""}`}
                className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 rounded-xl btn-gold px-6 sm:px-7 py-3 text-xs font-extrabold uppercase tracking-wider shadow-md touch-press text-[#1A1A1A]"
              >
                <Ticket size={15} />
                <span>Book Pass Online</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default VipBanner;
