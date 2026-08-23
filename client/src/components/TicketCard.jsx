import React from "react";
import { Plus, Minus, Users, Heart, Baby, CheckCircle2 } from "lucide-react";

const getPassIcon = (name = "") => {
  if (name.includes("Family")) return Users;
  if (name.includes("Couple")) return Heart;
  if (name.includes("Child")) return Baby;
  return Users;
};

const getPassBadge = (name = "") => {
  if (name.includes("Family")) return "Up to 4 Persons";
  if (name.includes("Couple")) return "1 Male & 1 Female Only";
  if (name.includes("Child")) return "5 to 12 Years Only";
  return "10 Nights Entry";
};

const TicketCard = ({
  id,
  name,
  price,
  rawPrice,
  description,
  count = 0,
  available = 0,
  onAdd,
  onRemove,
  maxAllowed = 10,
}) => {
  const isSoldOut = available <= 0;
  const isMaxReached = count >= available || count >= maxAllowed;
  const passBadge = getPassBadge(name);

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-6 transition-all duration-200 ${
        isSoldOut
          ? "border-slate-200 bg-slate-50 opacity-60"
          : count > 0
            ? "border-[#C9A96E] bg-white ring-2 ring-[#C9A96E]/30 shadow-md"
            : "border-[#E8DCC5] bg-white hover:border-[#C9A96E]/70 shadow-xs"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Pass Details Column */}
        <div className="space-y-2 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-[#FBF8F2] border border-[#E8DCC5] text-[#936E2A] shrink-0">
              {React.createElement(getPassIcon(name), { size: 15 })}
            </div>

            <h3 className="text-base sm:text-lg font-extrabold text-[#292929] tracking-tight">
              {name}
            </h3>

            {passBadge && (
              <span className="rounded-full bg-[#FBF8F2] border border-[#E8DCC5] px-2.5 py-0.5 text-[10px] font-bold text-[#77736B]">
                {passBadge}
              </span>
            )}

            {isSoldOut && (
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                Sold Out
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-extrabold text-[#292929]">
              {price || `₹${rawPrice?.toLocaleString("en-IN")}`}
            </span>
            <span className="text-xs font-bold text-[#936E2A]">
              / 10 Nights Pass
            </span>
          </div>

          {description && (
            <p className="text-xs text-[#77736B] font-medium leading-relaxed max-w-lg">
              {description}
            </p>
          )}

          {!isSoldOut && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#77736B] pt-0.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>
                Available passes:{" "}
                <strong className="text-[#292929]">{available}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Stepper Quantity Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E8DCC5]/70 shrink-0">
          <span className="text-xs font-bold text-[#77736B] sm:hidden">
            Quantity:
          </span>

          <div className="flex items-center gap-2 bg-[#FBF8F2] border border-[#E8DCC5] rounded-xl p-1">
            <button
              type="button"
              onClick={() => onRemove(id)}
              disabled={count === 0 || isSoldOut}
              className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-lg bg-white border border-[#E8DCC5] text-[#292929] font-bold transition hover:bg-[#E8DCC5] active:scale-95 disabled:opacity-30 disabled:pointer-events-none touch-press shadow-xs"
              aria-label={`Remove one ${name} pass`}
            >
              <Minus size={14} />
            </button>

            <span className="min-w-8 text-center text-sm sm:text-base font-extrabold text-[#292929]">
              {count}
            </span>

            <button
              type="button"
              onClick={() => onAdd(id)}
              disabled={isSoldOut || isMaxReached}
              className={`grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-lg font-bold transition active:scale-95 touch-press shadow-xs ${
                isSoldOut || isMaxReached
                  ? "border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-[#292929] text-white hover:bg-black"
              }`}
              aria-label={`Add one ${name} pass`}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
