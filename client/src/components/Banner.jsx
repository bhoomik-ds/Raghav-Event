import React from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Ticket, ShieldCheck, ArrowRight } from "lucide-react";

const Banner = () => {
  return (
    <section className="relative bg-[#292929] text-white overflow-hidden py-14 sm:py-20 border-b border-[#3B3B3B]">
      
      {/* Background Graphic Overlay */}
      <div 
        className="absolute inset-0 opacity-10 bg-cover bg-center pointer-events-none mix-blend-luminosity"
        style={{ backgroundImage: "url('/images/background.png')" }}
      />
      
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top Venue Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A96E]/40 bg-[#3B3B3B] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#E5D2A8] mb-6 shadow-xs">
          <ShieldCheck size={14} className="text-[#C9A96E]" />
          <span>Official Event Platform • Junagadh 2026</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Grand Junagadh Garba Mahotsav
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base font-medium text-[#E5D2A8] leading-relaxed">
          10 Nights of Traditional Garba & Dandiya Celebrations
        </p>

        {/* Venue & Date Strip */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-white/90">
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
            <Calendar size={15} className="text-[#C9A96E]" />
            <span>11 – 20 October 2026</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
            <MapPin size={15} className="text-[#C9A96E]" />
            <span>Satyam Party Plot, Zanzarda Chokdi, Junagadh</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            to="/TicketBooking"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#C9A96E] px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#292929] hover:bg-[#B89555] transition shadow-xs active:scale-95"
          >
            <Ticket size={16} />
            <span>Book Official Passes</span>
          </Link>

          <a
            href="#events"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10 transition"
          >
            <span>View Pass Tiers</span>
            <ArrowRight size={14} className="text-[#C9A96E]" />
          </a>
        </div>

      </div>
    </section>
  );
};

export default Banner;
