import React from "react";
import { Calendar, MapPin, Sparkles, Clock } from "lucide-react";

const EventHeader = ({ title, venue, datetime }) => {
  return (
    <div className="rounded-2xl border border-[#E8DCC5] bg-white p-5 sm:p-7 shadow-xs mb-6 sm:mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="space-y-1.5 min-w-0">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FBF8F2] border border-[#E8DCC5] px-3 py-0.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#936E2A]">
          <Sparkles size={12} className="text-[#C9A96E]" />
          <span>Official 10-Night Season Pass Reservation</span>
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#292929] tracking-tight font-display">
          {title}
        </h1>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-4 text-xs font-semibold text-[#77736B] pt-1">
          <span className="flex items-center gap-1.5 text-[#292929]">
            <Calendar size={14} className="text-[#C9A96E] shrink-0" />
            <span>{datetime}</span>
          </span>
          <span className="text-[#E8DCC5] hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <MapPin size={14} className="text-[#C9A96E] shrink-0" />
            <span>{venue}</span>
          </span>
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-2 rounded-xl bg-[#FBF8F2] border border-[#E8DCC5] px-3.5 py-2 text-xs font-bold text-[#292929]">
        <Clock size={15} className="text-[#C9A96E]" />
        <span>7:00 PM – 1:00 AM (10 Nights)</span>
      </div>
    </div>
  );
};

export default EventHeader;
