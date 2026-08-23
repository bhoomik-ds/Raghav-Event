import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  Tag,
  ShieldCheck,
  Ticket,
  ChevronLeft,
  Lock,
  Sparkles,
  Info,
} from "lucide-react";
import TicketList from "./TicketList";
import EventHeader from "./EventHeader";
import StepIndicator from "./StepIndicator";
import { useAuth } from "../context/AuthContext";

const VALID_PROMO_CODES = {
  GARBA2026: 0.1,
  JUNAGADH: 0.15,
  FESTIVE5: 0.05,
};

const TicketPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { api, showToast } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState({});
  const [loading, setLoading] = useState(true);
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);

  const [eventDetails, setEventDetails] = useState({
    id: null,
    title: "Grand Junagadh Garba Mahotsav 2026",
    category: "Garba",
    venue: "Satyam Party Plot, Zanzarda Chokdi, Junagadh",
    date: "11 – 20 October 2026",
    time: "7:00 PM Onwards",
  });

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const requestedId = searchParams.get("event");
        let eventData = null;

        if (requestedId) {
          try {
            const singleRes = await api.get(`api/events/${requestedId}`);
            eventData = singleRes.data;
          } catch {
            // fallback to list
          }
        }

        if (!eventData) {
          const listRes = await api.get("api/events");
          eventData =
            (listRes.data || []).find((e) => e._id === requestedId) ||
            listRes.data?.[0];
        }

        if (eventData) {
          const eventDateObj = new Date(eventData.date);
          const formattedDate = eventDateObj.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          setEventDetails({
            id: eventData._id,
            title: eventData.title,
            category: eventData.category || "Garba",
            venue: `${eventData.venue?.name || "Satyam Party Plot"}, ${eventData.venue?.city || "Junagadh"}`,
            date: formattedDate,
            time: eventData.time || "7:00 PM Onwards",
          });

          if (eventData.ticketTypes && Array.isArray(eventData.ticketTypes)) {
            const formatted = eventData.ticketTypes.map((t) => ({
              id: t._id || t.name,
              name: t.name,
              price: `₹${t.price.toLocaleString("en-IN")}`,
              rawPrice: Number(t.price),
              available: Number(t.availableSeats),
              description: t.description || `${t.name} entry pass with arena access.`,
            }));
            setTickets(formatted);

            const requestedPass = searchParams.get("pass");
            if (requestedPass) {
              const matched = formatted.find(
                (t) =>
                  t.name.toLowerCase().includes(requestedPass.toLowerCase()) ||
                  t.id.toLowerCase().includes(requestedPass.toLowerCase()),
              );
              if (matched) {
                setSelectedTickets({ [matched.id]: 1 });
              }
            }
          }
        }
      } catch (err) {
        console.error("Error loading event passes:", err);
        showToast("Unable to load pass details. Please refresh.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [searchParams, api, showToast]);

  const totalSelectedTickets = Object.values(selectedTickets).reduce(
    (sum, qty) => sum + qty,
    0,
  );

  const handleAdd = (id) => {
    const ticket = tickets.find((t) => t.id === id);
    const currentQty = selectedTickets[id] || 0;

    if (totalSelectedTickets >= 10) {
      showToast("Maximum 10 passes allowed per booking.", "warning");
      return;
    }

    if (ticket && currentQty >= ticket.available) {
      showToast(`Only ${ticket.available} passes left for ${ticket.name}.`, "warning");
      return;
    }

    setSelectedTickets((prev) => ({ ...prev, [id]: currentQty + 1 }));
  };

  const handleRemove = (id) => {
    setSelectedTickets((prev) => {
      if (!prev[id]) return prev;
      const updated = { ...prev };
      if (updated[id] > 1) {
        updated[id] = updated[id] - 1;
      } else {
        delete updated[id];
      }
      return updated;
    });
  };

  const rawSubtotal = Object.entries(selectedTickets).reduce((acc, [id, qty]) => {
    const ticket = tickets.find((t) => t.id === id);
    return acc + (ticket ? ticket.rawPrice * qty : 0);
  }, 0);

  const discountRate = appliedPromo ? appliedPromo.rate : 0;
  const discountAmount = Math.round(rawSubtotal * discountRate);
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const cleanCode = promoCodeInput.trim().toUpperCase();
    if (!cleanCode) return;

    if (VALID_PROMO_CODES[cleanCode]) {
      setAppliedPromo({
        code: cleanCode,
        rate: VALID_PROMO_CODES[cleanCode],
      });
      showToast(`Promo ${cleanCode} applied!`, "success");
      setPromoCodeInput("");
    } else {
      showToast("Invalid promo code. Try GARBA2026 or JUNAGADH", "error");
    }
  };

  const handleProceed = () => {
    if (totalSelectedTickets === 0) {
      showToast("Please select at least 1 pass to continue.", "warning");
      return;
    }

    const seatsPayload = [];
    const seatStrings = [];

    Object.entries(selectedTickets).forEach(([id, qty]) => {
      const ticket = tickets.find((t) => t.id === id);
      if (ticket && qty > 0) {
        seatsPayload.push({
          ticketType: ticket.name,
          quantity: qty,
          price: ticket.rawPrice,
        });

        seatStrings.push(`${qty}x ${ticket.name} (₹${ticket.rawPrice.toLocaleString("en-IN")})`);
      }
    });

    const bookingPayload = {
      eventId: eventDetails.id,
      seats: seatsPayload,
      selectedSeats: seatStrings,
      totalAmount: finalTotal,
      rawAmount: rawSubtotal,
      discountAmount,
      totalTickets: totalSelectedTickets,
      eventDetails,
      promoApplied: appliedPromo?.code || null,
    };

    localStorage.setItem("pendingBooking", JSON.stringify(bookingPayload));
    navigate(`/payment/${eventDetails.id}`, { state: bookingPayload });
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] bg-[#FBF8F2] flex flex-col items-center justify-center p-8">
        <div className="h-9 w-9 rounded-full border-3 border-[#E8DCC5] border-t-[#C9A96E] animate-spin mb-4" />
        <p className="font-extrabold text-[#77736B] text-xs uppercase tracking-wider">
          Loading Festival Passes...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF8F2] py-6 sm:py-10 pb-28 sm:pb-16">
      <div className="mx-auto max-w-6xl px-3.5 sm:px-6 lg:px-8">
        
        {/* Top Back Nav & Step Progress */}
        <div className="mb-4 sm:mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#77736B] hover:text-[#292929] transition mb-3 touch-press"
          >
            <ChevronLeft size={16} />
            <span>Back to Festival Overview</span>
          </Link>

          <StepIndicator step={1} />
        </div>

        {/* Event Header Banner */}
        <EventHeader
          title={eventDetails.title}
          venue={eventDetails.venue}
          datetime={`${eventDetails.date} • ${eventDetails.time}`}
          category={eventDetails.category}
        />

        {/* Main 2-Column Booking Grid */}
        <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr] items-start">
          
          {/* LEFT: Pass Tiers Selection Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8DCC5] pb-3 px-1">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-[#292929]">
                  Select Your Season Passes
                </h2>
                <p className="text-xs text-[#77736B]">
                  All passes grant entry for all 10 nights (11 – 20 October 2026).
                </p>
              </div>
              <span className="text-[11px] font-bold bg-white border border-[#E8DCC5] px-2.5 py-1 rounded-full text-[#77736B] shrink-0">
                Max 10
              </span>
            </div>

            <TicketList
              tickets={tickets}
              selectedTickets={selectedTickets}
              onAdd={handleAdd}
              onRemove={handleRemove}
              totalSelected={totalSelectedTickets}
            />

            {/* Information & Security Card */}
            <div className="rounded-2xl bg-white border border-[#E8DCC5] p-4 sm:p-5 text-xs text-[#292929] space-y-2 shadow-xs">
              <div className="flex items-center gap-2 font-extrabold text-[#292929]">
                <ShieldCheck size={18} className="text-[#C9A96E] shrink-0" />
                <span>Verified QR Gate Pass &amp; Entry Wristbands</span>
              </div>
              <p className="text-[#77736B] text-xs leading-relaxed font-medium">
                Passes include entry wristband &amp; ground access at Satyam Party Plot, Zanzarda Chokdi, Junagadh. Valid original photo ID is required at the counter for wristband pickup.
              </p>
            </div>
          </div>

          {/* RIGHT: Order Summary Card */}
          <div className="lg:sticky lg:top-24 rounded-2xl border border-[#E8DCC5] bg-white p-5 sm:p-7 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E8DCC5] pb-3.5 mb-4">
              <h3 className="text-base sm:text-lg font-extrabold text-[#292929]">
                Booking Summary
              </h3>
              <span className="text-xs font-bold text-[#936E2A]">
                10 Nights Pass
              </span>
            </div>

            {/* Selected Breakdown */}
            <div className="space-y-3 pb-4">
              {totalSelectedTickets === 0 ? (
                <div className="py-8 text-center text-[#77736B] border border-dashed border-[#E8DCC5] rounded-xl bg-[#FBF8F2]/60">
                  <Ticket className="mx-auto h-7 w-7 text-[#C9A96E] mb-2" />
                  <p className="text-xs font-bold text-[#292929]">No passes selected</p>
                  <p className="text-[11px] text-[#77736B] mt-0.5">
                    Choose quantity on the left to proceed
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {Object.entries(selectedTickets).map(([id, qty]) => {
                    const ticket = tickets.find((t) => t.id === id);
                    if (!ticket) return null;
                    return (
                      <div
                        key={id}
                        className="flex justify-between items-center text-xs font-semibold text-[#292929] bg-[#FBF8F2] p-2.5 rounded-xl border border-[#E8DCC5]"
                      >
                        <div>
                          <p className="font-extrabold">{ticket.name}</p>
                          <p className="text-[11px] text-[#77736B]">
                            ₹{ticket.rawPrice.toLocaleString("en-IN")} × {qty}
                          </p>
                        </div>
                        <span className="font-extrabold text-sm text-[#292929]">
                          ₹{(ticket.rawPrice * qty).toLocaleString("en-IN")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Promo Code Input */}
            <div className="border-t border-[#E8DCC5] pt-4 mb-4">
              {appliedPromo ? (
                <div className="flex items-center justify-between rounded-xl bg-[#FBF8F2] border border-[#C9A96E] p-2.5 text-xs font-semibold text-[#292929]">
                  <span className="flex items-center gap-1.5 truncate">
                    <Tag size={14} className="text-[#C9A96E] shrink-0" />
                    <span>Code <strong>{appliedPromo.code}</strong> ({appliedPromo.rate * 100}% off)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setAppliedPromo(null)}
                    className="text-[#77736B] hover:text-rose-600 font-bold underline shrink-0 ml-2 text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    placeholder="Promo Code (e.g. GARBA2026)"
                    className="flex-1 rounded-xl border border-[#E8DCC5] bg-[#FBF8F2] px-3.5 py-2.5 text-xs font-bold uppercase text-[#292929] outline-none focus:border-[#C9A96E]"
                  />
                  <button
                    type="submit"
                    className="rounded-xl btn-charcoal px-4 py-2.5 text-xs font-bold uppercase tracking-wider shrink-0 touch-press"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Price Calculations */}
            <div className="border-t border-[#E8DCC5] pt-4 space-y-2.5 text-xs font-semibold text-[#77736B]">
              <div className="flex justify-between text-[#292929]">
                <span>Subtotal ({totalSelectedTickets} pass{totalSelectedTickets !== 1 ? "es" : ""})</span>
                <span>₹{rawSubtotal.toLocaleString("en-IN")}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#936E2A] font-bold">
                  <span>Promo Discount ({appliedPromo?.code})</span>
                  <span>- ₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between text-[11px]">
                <span>Convenience / Platform Fee</span>
                <span className="text-emerald-700 font-bold">FREE (₹0)</span>
              </div>

              <div className="border-t border-[#E8DCC5] pt-3.5 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-extrabold text-[#292929] block">Total Payable</span>
                  <span className="text-[10px] text-[#77736B] font-medium">Includes all 10 nights</span>
                </div>
                <span className="text-2xl font-extrabold text-[#292929]">
                  ₹{finalTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Proceed Button */}
            <button
              type="button"
              onClick={handleProceed}
              disabled={totalSelectedTickets === 0}
              className={`mt-6 w-full min-h-[48px] flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-sm transition touch-press ${
                totalSelectedTickets > 0
                  ? "btn-gold text-[#1A1A1A]"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <span>Continue to Attendee Details</span>
              <ArrowRight size={16} />
            </button>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-[#77736B]">
              <Lock size={12} className="text-[#C9A96E]" />
              <span>256-Bit SSL Encrypted Secure Checkout</span>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Mobile Sticky Checkout Bar */}
      {totalSelectedTickets > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-[#141418]/95 backdrop-blur-md border-t border-[#C9A96E]/30 p-3 shadow-2xl lg:hidden pb-safe animate-in slide-in-from-bottom duration-200">
          <div className="mx-auto max-w-md flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#E5C384]">
                {totalSelectedTickets} pass{totalSelectedTickets !== 1 ? "es" : ""} selected
              </p>
              <p className="text-base font-extrabold text-white leading-tight">
                ₹{finalTotal.toLocaleString("en-IN")}
              </p>
            </div>

            <button
              type="button"
              onClick={handleProceed}
              className="flex-1 max-w-[190px] min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-xl btn-gold py-2.5 px-4 text-xs font-extrabold uppercase tracking-wider text-[#1A1A1A] shadow-md touch-press"
            >
              <span>Continue</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketPage;
