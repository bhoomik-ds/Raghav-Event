import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Ticket, Calendar, MapPin, ExternalLink, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const MyTickets = () => {
  const { api } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("api/my-bookings");
        setBookings(response.data || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [api]);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#FBF8F2] flex flex-col items-center justify-center p-8">
        <div className="h-8 w-8 rounded-full border-2 border-[#E8DCC5] border-t-[#3B3B3B] animate-spin mb-3" />
        <p className="font-semibold text-[#77736B] text-xs uppercase tracking-wider">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF8F2] py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        
        {/* Header Title */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DCC5] pb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C9A96E]">
              My Bookings
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292929] tracking-tight mt-1">
              Your Festival Passes
            </h1>
          </div>

          <Link
            to="/TicketBooking"
            className="inline-flex items-center gap-2 self-start sm:self-auto rounded-lg bg-[#3B3B3B] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#242424] shadow-xs transition"
          >
            <Ticket size={14} className="text-[#E5D2A8]" />
            <span>Book New Pass</span>
          </Link>
        </div>

        {/* Empty State */}
        {bookings.length === 0 ? (
          <div className="rounded-xl border border-[#E8DCC5] bg-white p-8 sm:p-12 text-center shadow-xs max-w-md mx-auto">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-[#FBF8F2] text-[#3B3B3B] mx-auto mb-4 border border-[#E8DCC5]">
              <Ticket size={24} />
            </div>
            <h2 className="text-lg font-extrabold text-[#292929]">No Passes Booked Yet</h2>
            <p className="mt-2 text-xs text-[#77736B] font-medium leading-relaxed">
              You haven't reserved passes for Junagadh Navratri 2026 at Satyam Party Plot.
            </p>
            <Link
              to="/#events"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#3B3B3B] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#242424] transition"
            >
              <span>Explore Pass Options</span>
              <ArrowRight size={14} className="text-[#E5D2A8]" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const event = booking.eventId || {};
              const eventDateStr = event.date
                ? new Date(event.date).toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : new Date(booking.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });

              const isPaid = booking.paymentStatus === "paid";
              const cityName = event.venue?.city || booking.city || "Junagadh";

              return (
                <article
                  key={booking._id}
                  className="rounded-xl border border-[#E8DCC5] bg-white p-5 sm:p-6 shadow-xs transition-all hover:border-[#C9A96E]"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                    
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded bg-[#FBF8F2] border border-[#E8DCC5] px-2 py-0.5 text-[10px] font-bold text-[#77736B]">
                          {cityName}
                        </span>
                        
                        <span className="rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                          <ShieldCheck size={11} className="text-emerald-600" />
                          {isPaid ? "Confirmed Pass" : "Pending Payment"}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-extrabold text-[#292929]">
                        {event.title || "Grand Junagadh Garba Mahotsav 2026"}
                      </h3>

                      <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs text-[#77736B] font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} className="text-[#C9A96E]" /> {eventDateStr}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={13} className="text-[#C9A96E]" /> {event.venue?.name || "Satyam Party Plot"}
                        </span>
                      </div>

                      {/* Ticket types summary */}
                      <div className="pt-1 flex flex-wrap gap-1.5">
                        {booking.tickets &&
                          booking.tickets.map((t, idx) => (
                            <span
                              key={idx}
                              className="rounded bg-[#FBF8F2] border border-[#E8DCC5] px-2.5 py-1 text-[11px] font-bold text-[#292929]"
                            >
                              {t.quantity}x {t.ticketType}
                            </span>
                          ))}
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 border-[#E8DCC5] pt-3 md:pt-0 gap-3 shrink-0">
                      <div className="text-left md:text-right">
                        <p className="text-[10px] font-bold uppercase text-[#77736B]">Total Paid</p>
                        <p className="text-lg sm:text-xl font-extrabold text-[#292929]">
                          ₹{(booking.finalAmount || booking.totalAmount || 0).toLocaleString("en-IN")}
                        </p>
                      </div>

                      <Link
                        to={`/view-ticket/${booking.bookingId || booking._id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#3B3B3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#242424] transition shadow-xs"
                      >
                        <Ticket size={13} className="text-[#E5D2A8]" />
                        <span>View Pass</span>
                        <ExternalLink size={11} />
                      </Link>
                    </div>

                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;
