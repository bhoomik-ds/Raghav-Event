import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Check,
  ShieldCheck,
  X,
  ArrowRight,
  Ticket,
  Sparkles,
  Info,
  Calculator,
  Plus,
  Minus,
  CheckCircle2,
} from "lucide-react";
import { PASS_DATA } from "./passData";

const PassesSection = ({ eventId }) => {
  const navigate = useNavigate();
  const [selectedPassModal, setSelectedPassModal] = useState(null);
  const [calculatorCounts, setCalculatorCounts] = useState({
    "family-pass": 0,
    "couple-pass": 1,
    "children-pass": 0,
  });

  const handleCalcCountChange = (passId, delta) => {
    setCalculatorCounts((prev) => {
      const current = prev[passId] || 0;
      const next = Math.max(0, Math.min(10, current + delta));
      return { ...prev, [passId]: next };
    });
  };

  const totalCalculatedTickets = Object.values(calculatorCounts).reduce(
    (sum, count) => sum + count,
    0,
  );

  const calculatedTotalAmount = PASS_DATA.reduce((sum, pass) => {
    return sum + (calculatorCounts[pass.id] || 0) * pass.price;
  }, 0);

  const handleProceedFromCalculator = () => {
    if (totalCalculatedTickets === 0) return;
    const selectedEntries = Object.entries(calculatorCounts).filter(
      ([, qty]) => qty > 0,
    );
    if (selectedEntries.length > 0) {
      const firstPass = PASS_DATA.find((p) => p.id === selectedEntries[0][0]);
      navigate(
        `/TicketBooking?pass=${encodeURIComponent(firstPass.name)}${
          eventId ? `&event=${eventId}` : ""
        }`,
      );
    } else {
      navigate(`/TicketBooking${eventId ? `?event=${eventId}` : ""}`);
    }
  };

  return (
    <section id="passes" className="py-12 sm:py-24 bg-[#FBF8F2] relative">
      <div className="relative mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E8DCC5] bg-white px-3 py-0.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#936E2A] mb-2 sm:mb-3 shadow-xs">
            <Sparkles size={12} className="text-[#C9A96E]" />
            <span>Official Pass Tiers</span>
          </div>

          <h2 className="text-2xl xs:text-3xl sm:text-5xl font-extrabold text-[#292929] tracking-tight font-display">
            Choose Your Season Pass
          </h2>

          <p className="mt-2 sm:mt-4 text-xs sm:text-base text-[#77736B] font-medium leading-relaxed max-w-2xl mx-auto px-2">
            Every pass provides verified access for{" "}
            <strong className="text-[#292929]">all 10 nights</strong> (11 – 20
            Oct 2026). No daily re-booking required!
          </p>
        </div>

        {/* 3 Pass Cards Grid */}
        <div className="grid gap-5 sm:gap-8 lg:grid-cols-3 items-stretch">
          {PASS_DATA.map((pass) => {
            const Icon = pass.icon;
            const isRec = pass.recommended;

            return (
              <div
                key={pass.id}
                className={`relative flex flex-col justify-between rounded-2xl bg-white p-5 sm:p-8 transition-all duration-300 ${
                  isRec
                    ? "border-2 border-[#C9A96E] shadow-lg shadow-[#C9A96E]/10 lg:-translate-y-1.5"
                    : "border border-[#E8DCC5] hover:border-[#C9A96E]/60 shadow-xs hover:shadow-md"
                }`}
              >
                {/* Most Popular Badge */}
                {isRec && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full btn-gold px-3.5 py-0.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider shadow-md whitespace-nowrap">
                    ⭐ Most Popular Choice
                  </div>
                )}

                <div>
                  {/* Top Row: Icon & Tagline */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-xl bg-[#FBF8F2] border border-[#E8DCC5] text-[#292929] shadow-xs shrink-0">
                      <Icon size={20} className="text-[#936E2A]" />
                    </div>

                    <span className="rounded-full bg-[#FBF8F2] border border-[#E8DCC5] px-2.5 py-0.5 text-[11px] font-bold text-[#77736B]">
                      {pass.tagline}
                    </span>
                  </div>

                  {/* Pass Title */}
                  <h3 className="text-lg sm:text-2xl font-extrabold text-[#292929]">
                    {pass.name}
                  </h3>

                  {/* Price Banner */}
                  <div className="mt-2 sm:mt-3 flex items-baseline gap-2 border-b border-[#E8DCC5]/70 pb-4">
                    <span className="text-2xl sm:text-4xl font-extrabold text-[#292929]">
                      {pass.formattedPrice}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[11px] sm:text-xs font-bold text-[#936E2A]">
                        All 10 Nights
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-[#77736B] font-medium">
                        (₹{(pass.price / 10).toFixed(0)}/night avg)
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs sm:text-sm text-[#77736B] leading-relaxed font-medium">
                    {pass.description}
                  </p>

                  {/* Feature Checklist */}
                  <div className="mt-4 sm:mt-5 space-y-2 sm:space-y-2.5">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#936E2A] block">
                      Included Privileges:
                    </span>
                    {pass.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-xs font-semibold text-[#292929]"
                      >
                        <div className="grid h-4 w-4 place-items-center rounded-full bg-[#FBF8F2] border border-[#C9A96E]/40 text-[#936E2A] shrink-0 mt-0.5">
                          <Check size={11} strokeWidth={3} />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-6 sm:mt-8 pt-4 border-t border-[#E8DCC5]/70 space-y-2">
                  <Link
                    to={`/TicketBooking?pass=${encodeURIComponent(pass.name)}${
                      eventId ? `&event=${eventId}` : ""
                    }`}
                    className={`w-full min-h-[46px] inline-flex items-center justify-center gap-2 rounded-xl py-3 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition shadow-sm touch-press ${
                      isRec
                        ? "btn-gold text-[#1A1A1A]"
                        : "btn-charcoal text-white"
                    }`}
                  >
                    <Ticket size={15} />
                    <span>Book {pass.name}</span>
                    <ArrowRight size={14} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setSelectedPassModal(pass)}
                    className="w-full inline-flex items-center justify-center gap-1.5 text-center text-xs font-bold text-[#77736B] hover:text-[#292929] transition py-1.5 touch-press"
                  >
                    <Info size={13} className="text-[#C9A96E]" />
                    <span>View Guidelines & Rules</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Pass Estimator / Quick Calculator */}
        <div className="mt-10 sm:mt-14 rounded-2xl border border-[#E8DCC5] bg-white p-4 sm:p-8 shadow-sm max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-4 border-b border-[#E8DCC5] pb-4 mb-4 sm:mb-6">
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#936E2A] mb-1">
                <Calculator size={13} />
                <span>Instant Pass Calculator</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-extrabold text-[#292929]">
                Estimate &amp; Book In One Tap
              </h3>
            </div>
            <p className="text-[11px] sm:text-xs text-[#77736B]">
              Select pass quantities to calculate exact festival pricing.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {PASS_DATA.map((pass) => {
              const count = calculatorCounts[pass.id] || 0;
              return (
                <div
                  key={pass.id}
                  className="rounded-xl border border-[#E8DCC5] bg-[#FBF8F2] p-3.5 sm:p-4 flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-[#292929]">
                        {pass.name}
                      </h4>
                      <span className="text-xs font-bold text-[#936E2A]">
                        {pass.formattedPrice}
                      </span>
                    </div>
                    <span className="text-[10px] bg-white border border-[#E8DCC5] px-2 py-0.5 rounded text-[#77736B] font-bold">
                      10 Nights
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E8DCC5]/60">
                    <span className="text-xs text-[#77736B] font-bold">
                      Quantity:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCalcCountChange(pass.id, -1)}
                        disabled={count === 0}
                        className="grid h-8 w-8 sm:h-7 sm:w-7 place-items-center rounded-lg border border-[#E8DCC5] bg-white text-[#292929] font-bold disabled:opacity-40 touch-press"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-6 text-center font-extrabold text-sm sm:text-base text-[#292929]">
                        {count}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCalcCountChange(pass.id, 1)}
                        className="grid h-8 w-8 sm:h-7 sm:w-7 place-items-center rounded-lg bg-[#292929] text-white font-bold hover:bg-black touch-press"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Calculator Bottom Summary */}
          <div className="mt-5 pt-4 border-t border-[#E8DCC5] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="text-center sm:text-left flex sm:flex-col items-baseline sm:items-start justify-between w-full sm:w-auto">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#77736B]">
                Total ({totalCalculatedTickets} Pass
                {totalCalculatedTickets !== 1 ? "es" : ""}):
              </span>
              <span className="text-xl sm:text-3xl font-extrabold text-[#292929]">
                ₹{calculatedTotalAmount.toLocaleString("en-IN")}
              </span>
            </div>

            <button
              type="button"
              onClick={handleProceedFromCalculator}
              disabled={totalCalculatedTickets === 0}
              className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 rounded-xl btn-gold px-6 sm:px-8 py-3.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-sm touch-press disabled:opacity-50 disabled:pointer-events-none"
            >
              <span>Continue to Reservation</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Guidelines & Details Modal - Mobile Bottom Sheet Style */}
      {selectedPassModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-2xl border border-[#E8DCC5] bg-white p-5 sm:p-8 shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 max-h-[88vh] overflow-y-auto pb-safe">
            {/* Mobile Sheet Drag Indicator */}
            <div className="w-12 h-1.5 bg-[#E8DCC5] rounded-full mx-auto mb-4 sm:hidden" />

            <button
              onClick={() => setSelectedPassModal(null)}
              className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-lg bg-[#FBF8F2] text-[#77736B] hover:bg-[#E8DCC5] hover:text-[#292929] transition"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-1.5">
              <span className="rounded-full bg-[#FBF8F2] border border-[#E8DCC5] px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-[#936E2A]">
                {selectedPassModal.tagline}
              </span>
              <span className="text-[11px] text-[#77736B] font-semibold">
                • 10 Nights Pass
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-[#292929]">
              {selectedPassModal.name}
            </h3>

            <p className="text-xl sm:text-3xl font-extrabold text-[#292929] mt-1.5 mb-3 sm:mb-4">
              {selectedPassModal.formattedPrice}{" "}
              <span className="text-xs font-semibold text-[#77736B]">
                (Valid 11 – 20 October 2026)
              </span>
            </p>

            <div className="border-t border-[#E8DCC5] py-3 sm:py-4 text-xs text-[#77736B] font-medium leading-relaxed space-y-3 sm:space-y-4">
              <p className="text-xs sm:text-sm text-[#292929]">
                {selectedPassModal.description}
              </p>

              <div>
                <h4 className="font-extrabold text-[#292929] uppercase text-[10px] sm:text-[11px] mb-2 text-[#936E2A]">
                  Pass Privileges &amp; Inclusions:
                </h4>
                <ul className="space-y-1.5 sm:space-y-2">
                  {selectedPassModal.features.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[#292929] font-medium"
                    >
                      <CheckCircle2
                        size={14}
                        className="text-[#C9A96E] shrink-0 mt-0.5"
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-[#FBF8F2] border border-[#E8DCC5] p-3 text-[11px] text-[#77736B] space-y-1">
                <p className="font-bold text-[#292929]">
                  📍 Satyam Party Plot, Zanzarda Chokdi, Junagadh
                </p>
                <p>🕒 7:00 PM – 1:00 AM Daily Entry</p>
              </div>
            </div>

            <div className="pt-3 sm:pt-4 border-t border-[#E8DCC5] flex gap-2">
              <Link
                to={`/TicketBooking?pass=${encodeURIComponent(
                  selectedPassModal.name,
                )}${eventId ? `&event=${eventId}` : ""}`}
                onClick={() => setSelectedPassModal(null)}
                className="flex-1 min-h-[46px] inline-flex items-center justify-center gap-2 rounded-xl btn-gold py-3 text-xs sm:text-sm font-extrabold uppercase text-[#1A1A1A] shadow-md touch-press"
              >
                <span>Book {selectedPassModal.name}</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PassesSection;
