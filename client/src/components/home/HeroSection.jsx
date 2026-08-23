import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Clock,
  Ticket,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Flame,
  CheckCircle2,
  Volume2,
} from "lucide-react";

const EVENT_START_DATE = new Date("2026-10-11T19:00:00+05:30").getTime();

const HeroSection = ({ eventId }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = EVENT_START_DATE - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#141418] text-white pt-6 pb-12 sm:py-20 lg:py-24">
      {/* Background Image with Layered Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-banner.jpg"
          alt="Junagadh Garba Mahotsav"
          className="h-full w-full object-cover object-center scale-105 transform motion-safe:animate-pulse-slow"
          style={{ filter: "brightness(0.36) contrast(1.15)" }}
        />
        {/* Cinematic Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-[#141418]/65 to-[#141418]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141418]/90 via-transparent to-[#141418]/90" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[320px] sm:w-[600px] h-[260px] sm:h-[350px] bg-[#C9A96E]/20 blur-[100px] sm:blur-[140px] rounded-full pointer-events-none" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto max-w-5xl px-3.5 sm:px-6 lg:px-8 text-center flex flex-col items-center w-full">
        
        {/* Live Scarcity / Trust Pill */}
        <div className="inline-flex items-center gap-2 rounded-full glass-dark border border-[#C9A96E]/40 px-3 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-[#F5ECD7] mb-4 sm:mb-6 shadow-lg shadow-black/40">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="flex items-center gap-1 text-[#E5C384] font-bold">
            <Flame size={13} className="text-amber-400 fill-amber-400 shrink-0" />
            <span>Passes Live</span>
          </span>
          <span className="text-white/40">•</span>
          <span className="text-white/90 truncate">3,840+ Booked</span>
        </div>

        {/* Festival Badge */}
        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.2em] text-[#C9A96E] mb-2 sm:mb-3">
          <Sparkles size={12} className="shrink-0" />
          <span>Raghav Events Presents</span>
          <Sparkles size={12} className="shrink-0" />
        </div>

        {/* Grand Headline */}
        <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15] max-w-4xl px-2">
          Grand Junagadh <br className="hidden xs:inline" />
          <span className="gold-gradient-text">Garba Mahotsav</span> 2026
        </h1>

        {/* Subtitle */}
        <p className="mt-3 sm:mt-4 max-w-2xl text-xs sm:text-base text-white/80 font-normal leading-relaxed px-2">
          10 Nights of Royal Gujarati Raas, Live Celebrity Folk Orchestra &amp; Authentic Dandiya at Satyam Party Plot.
        </p>

        {/* Key Event Badges Strip - Horizontal Scroll on Mobile */}
        <div className="mt-4 sm:mt-6 w-full flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 text-[11px] sm:text-sm font-medium text-white/90">
          <div className="shrink-0 flex items-center gap-1.5 rounded-xl glass-dark border border-white/10 px-3 py-1.5">
            <Calendar size={14} className="text-[#C9A96E] shrink-0" />
            <span>11 – 20 Oct 2026</span>
          </div>

          <div className="shrink-0 flex items-center gap-1.5 rounded-xl glass-dark border border-white/10 px-3 py-1.5">
            <Clock size={14} className="text-[#C9A96E] shrink-0" />
            <span>7:00 PM Onwards</span>
          </div>

          <div className="shrink-0 flex items-center gap-1.5 rounded-xl glass-dark border border-white/10 px-3 py-1.5">
            <MapPin size={14} className="text-[#C9A96E] shrink-0" />
            <span>Satyam Party Plot, Junagadh</span>
          </div>
        </div>

        {/* Live Countdown Timer Grid */}
        <div className="mt-5 sm:mt-7 rounded-2xl glass-dark border border-[#C9A96E]/30 p-3.5 sm:p-5 shadow-2xl backdrop-blur-xl max-w-lg w-full">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2 mb-2.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#E5C384]">
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-[#C9A96E]" /> Festival Countdown
            </span>
            <span className="text-white/60 text-[9px] sm:text-[10px]">Starts 11 Oct 2026</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 sm:gap-3 text-center">
            <div className="rounded-xl bg-white/5 border border-white/10 p-1.5 sm:p-3">
              <span className="block text-lg xs:text-xl sm:text-3xl font-extrabold text-white font-mono leading-tight">
                {String(timeLeft.days).padStart(2, "0")}
              </span>
              <span className="text-[9px] sm:text-xs font-semibold uppercase tracking-wider text-white/60 block mt-0.5">
                Days
              </span>
            </div>

            <div className="rounded-xl bg-white/5 border border-white/10 p-1.5 sm:p-3">
              <span className="block text-lg xs:text-xl sm:text-3xl font-extrabold text-white font-mono leading-tight">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-[9px] sm:text-xs font-semibold uppercase tracking-wider text-white/60 block mt-0.5">
                Hours
              </span>
            </div>

            <div className="rounded-xl bg-white/5 border border-white/10 p-1.5 sm:p-3">
              <span className="block text-lg xs:text-xl sm:text-3xl font-extrabold text-white font-mono leading-tight">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-[9px] sm:text-xs font-semibold uppercase tracking-wider text-white/60 block mt-0.5">
                Mins
              </span>
            </div>

            <div className="rounded-xl bg-white/5 border border-white/10 p-1.5 sm:p-3">
              <span className="block text-lg xs:text-xl sm:text-3xl font-extrabold text-[#E5C384] font-mono leading-tight">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="text-[9px] sm:text-xs font-semibold uppercase tracking-wider text-white/60 block mt-0.5">
                Secs
              </span>
            </div>
          </div>
        </div>

        {/* CTA Action Buttons */}
        <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 w-full max-w-md sm:max-w-none">
          <Link
            to={`/TicketBooking${eventId ? `?event=${eventId}` : ""}`}
            className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl btn-gold px-6 sm:px-8 py-3.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-lg shadow-[#C9A96E]/20 touch-press"
          >
            <Ticket size={16} className="text-[#1A1A1A]" />
            <span>Book Official Passes</span>
            <ArrowRight size={15} className="text-[#1A1A1A]" />
          </Link>

          <a
            href="#passes"
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-xl glass-dark border border-white/20 px-5 sm:px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10 transition touch-press"
          >
            <span>View Pass Tiers</span>
            <ChevronDown size={15} className="text-[#C9A96E]" />
          </a>
        </div>

        {/* Trust Badges Footer */}
        <div className="mt-7 sm:mt-10 pt-4 sm:pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] sm:text-xs text-white/70 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
            <span>10 Nights Pass</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-[#C9A96E] shrink-0" />
            <span>Verified QR Wristbands</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Volume2 size={13} className="text-[#C9A96E] shrink-0" />
            <span>50,000 sq.ft Wooden Arena</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
