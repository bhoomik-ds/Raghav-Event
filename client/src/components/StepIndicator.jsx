import React from "react";
import { Check } from "lucide-react";

const steps = [
  { number: 1, label: "Passes" },
  { number: 2, label: "Attendee" },
  { number: 3, label: "Payment" },
  { number: 4, label: "Pass QR" },
];

const StepIndicator = ({ step = 1 }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
      <div className="relative flex items-center justify-between">
        
        {/* Continuous Background Track */}
        <div className="absolute left-[12%] right-[12%] top-4 -translate-y-1/2 h-1 bg-[#E8DCC5] rounded-full z-0" />
        
        {/* Active Progress Fill */}
        <div
          className="absolute left-[12%] top-4 -translate-y-1/2 h-1 bg-gradient-to-r from-[#D4AF37] to-[#C9A96E] rounded-full z-0 transition-all duration-300"
          style={{
            width: `${Math.min(76, Math.max(0, ((step - 1) / (steps.length - 1)) * 76))}%`,
          }}
        />

        {steps.map((s) => {
          const isDone = step > s.number;
          const isCurrent = step === s.number;

          return (
            <div
              key={s.number}
              className="relative z-10 flex flex-col items-center gap-1.5"
            >
              <div
                className={`grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full border text-xs sm:text-sm font-extrabold transition-all shadow-xs ${
                  isDone
                    ? "border-[#C9A96E] bg-[#292929] text-[#E5C384]"
                    : isCurrent
                      ? "border-[#C9A96E] bg-white text-[#292929] ring-4 ring-[#C9A96E]/20"
                      : "border-[#E8DCC5] bg-white text-[#A39E93]"
                }`}
              >
                {isDone ? <Check size={14} strokeWidth={3} className="text-[#C9A96E]" /> : s.number}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider text-center ${
                  isCurrent
                    ? "text-[#292929] font-extrabold"
                    : isDone
                      ? "text-[#936E2A]"
                      : "text-[#A39E93]"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
