import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle2,
  Ticket,
  User,
  MapPin,
  Calendar,
  Clock,
  Printer,
  Share2,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import QRCode from "qrcode";
import { useAuth } from "../context/AuthContext";

const ViewTicket = () => {
  const { id } = useParams();
  const { api, showToast } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const canvasRef = useRef(null);
  const fallbackDate = "2026-10-11T19:00:00+05:30";

  useEffect(() => {
    api
      .get(`api/ticketbooking/${id}`)
      .then((res) => {
        setBooking(res.data);
      })
      .catch((err) => {
        console.error("Failed to load pass:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [id, api]);

  // Generate QR Code
  useEffect(() => {
    if (booking && canvasRef.current) {
      const qrPayload = JSON.stringify({
        bookingId: booking.bookingId || booking._id,
        event: booking.eventId?.title || "Navratri Celebration",
        guest: booking.guestName,
        passes: booking.totalTickets,
        status: booking.paymentStatus,
        verificationUrl: `${window.location.origin}/view-ticket/${booking.bookingId || booking._id}`,
      });

      QRCode.toCanvas(canvasRef.current, qrPayload, {
        width: 150,
        margin: 1,
        color: {
          dark: "#292929",
          light: "#ffffff",
        },
      }).catch((err) => console.error("QR Code rendering error:", err));
    }
  }, [booking]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Festival Pass: ${booking?.eventId?.title || "Garba Night"}`,
          text: `Entry pass for ${booking?.eventId?.title} (Booking ID: ${booking?.bookingId})`,
          url,
        });
      } catch {
        // cancelled
      }
    } else {
      navigator.clipboard.writeText(url);
      showToast("Pass link copied to clipboard.", "success");
    }
  };

  const getCalendarLink = () => {
    if (!booking?.eventId) return "#";
    const title = encodeURIComponent(
      booking.eventId.title || "Navratri Garba Night",
    );
    const details = encodeURIComponent(
      `Pass for ${booking.guestName}. Booking ID: ${booking.bookingId}. Satyam Party Plot, Junagadh.`,
    );
    const location = encodeURIComponent(
      `${booking.eventId.venue?.name || "Satyam Party Plot"}, ${booking.eventId.venue?.city || "Junagadh"}`,
    );

    const eventDate = new Date(booking.eventId.date || fallbackDate);
    const startStr = eventDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startStr}/${startStr}`;
  };

  const getMapsLink = () => {
    if (!booking?.eventId?.venue) return "#";
    const query = encodeURIComponent(
      `${booking.eventId.venue.name || "Satyam Party Plot"} ${booking.eventId.venue.address || "Zanzarda Chokdi"} ${booking.eventId.venue.city || "Junagadh"}`,
    );
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#FBF8F2] flex flex-col items-center justify-center p-8">
        <div className="h-8 w-8 rounded-full border-2 border-[#E8DCC5] border-t-[#3B3B3B] animate-spin mb-3" />
        <p className="font-semibold text-[#77736B] text-xs uppercase tracking-wider">
          Generating official pass...
        </p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-[70vh] bg-[#FBF8F2] flex flex-col items-center justify-center p-8 text-center">
        <div className="rounded-xl border border-[#E8DCC5] bg-white p-8 max-w-md shadow-sm">
          <h2 className="text-xl font-extrabold text-[#292929] mb-2">
            Pass Not Found
          </h2>
          <p className="text-xs text-[#77736B] mb-5 font-medium">
            Could not locate ticket record for ID: <code>{id}</code>
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#3B3B3B] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#242424]"
          >
            <ArrowLeft size={15} /> Return Home
          </Link>
        </div>
      </div>
    );
  }

  const event = booking.eventId || {};
  const formattedEventDate = event.date
    ? new Date(event.date).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "11 - 20 October 2026";

  const bookingDate = new Date(
    booking.createdAt || booking.paidAt || fallbackDate,
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-[#FBF8F2] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Navigation & Actions */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 no-print">
          <Link
            to="/my-tickets"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3B3B3B] hover:text-[#C9A96E] transition"
          >
            <ArrowLeft size={15} /> My Passes
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E8DCC5] bg-white px-3.5 py-1.5 text-xs font-bold text-[#3B3B3B] hover:bg-[#FBF8F2] transition shadow-xs"
            >
              <Share2 size={13} className="text-[#C9A96E]" /> Share
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#3B3B3B] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#242424] transition shadow-xs"
            >
              <Printer size={13} className="text-[#E5D2A8]" /> Print Pass
            </button>
          </div>
        </div>

        {/* Printable Pass Container */}
        <div className="printable-ticket overflow-hidden rounded-xl border border-[#E8DCC5] bg-white shadow-sm">
          {/* Header */}
          <div className="bg-[#292929] p-6 text-white border-b border-[#3B3B3B] text-center">
            <span className="inline-block rounded-full border border-[#C9A96E]/40 bg-[#3B3B3B] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#E5D2A8] mb-2">
              Official Entry E-Pass
            </span>

            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {event.title || "Grand Junagadh Garba 2026"}
            </h1>
            <p className="mt-1 text-xs text-[#E5D2A8] font-medium">
              Organized by {event.organizer || "Raghav Events Junagadh"}
            </p>

            <div className="mt-3 inline-flex items-center gap-1.5 rounded bg-emerald-900/40 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
              <CheckCircle2 size={13} /> Verified & Confirmed
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Reference & QR */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-5 rounded-lg bg-[#FBF8F2] border border-[#E8DCC5] p-5 text-center sm:text-left">
              <div className="space-y-1 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#77736B]">
                  Gate Verification Reference
                </p>
                <p className="text-xl font-mono font-extrabold text-[#292929] tracking-wider select-all">
                  {booking.bookingId || booking._id}
                </p>
                <p className="text-xs text-[#77736B]">
                  Scan this QR code at Satyam Party Plot gate to collect
                  wristband.
                </p>
                <p className="text-[11px] text-[#77736B] pt-1">
                  Booked on: {bookingDate}
                </p>
              </div>

              <div className="shrink-0 rounded-lg border border-[#E8DCC5] bg-white p-2 shadow-xs">
                <canvas ref={canvasRef} className="h-32 w-32" />
              </div>
            </div>

            {/* Event Schedule & Venue Grid */}
            <div className="grid gap-3 sm:grid-cols-2 rounded-lg bg-[#FBF8F2] border border-[#E8DCC5] p-4 text-xs font-semibold text-[#292929]">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#77736B]">
                  Date & Time
                </p>
                <p className="flex items-center gap-1.5 text-[#292929] font-bold">
                  <Calendar size={14} className="text-[#C9A96E]" />{" "}
                  {formattedEventDate}
                </p>
                <p className="flex items-center gap-1.5 text-[#77736B] text-[11px] pl-5">
                  <Clock size={12} className="text-[#C9A96E]" />{" "}
                  {event.time || "7:00 PM Onwards"} (10 Nights)
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#77736B]">
                  Venue Location
                </p>
                <p className="flex items-center gap-1.5 text-[#292929] font-bold">
                  <MapPin size={14} className="text-[#C9A96E]" />{" "}
                  {event.venue?.name || "Satyam Party Plot"}
                </p>
                <p className="text-[#77736B] text-[11px] pl-5 truncate">
                  {event.venue?.address ||
                    "Satyam Party Plot, Zanzarda Chokdi, Junagadh"}
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap items-center gap-2.5 no-print">
              <a
                href={getCalendarLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3B3B3B] hover:underline bg-[#FBF8F2] px-3 py-1.5 rounded border border-[#E8DCC5]"
              >
                <Calendar size={13} className="text-[#C9A96E]" /> Add to Google
                Calendar <ExternalLink size={11} />
              </a>

              <a
                href={getMapsLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3B3B3B] hover:underline bg-[#FBF8F2] px-3 py-1.5 rounded border border-[#E8DCC5]"
              >
                <MapPin size={13} className="text-[#C9A96E]" /> Open in Google
                Maps <ExternalLink size={11} />
              </a>
            </div>

            {/* Attendee Details */}
            <div className="border-t border-[#E8DCC5] pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#77736B] mb-2 flex items-center gap-1.5">
                <User size={13} className="text-[#C9A96E]" /> Primary Attendee
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <p className="text-[#77736B]">Attendee Name</p>
                  <p className="font-bold text-[#292929] mt-0.5">
                    {booking.guestName}
                  </p>
                </div>
                <div>
                  <p className="text-[#77736B]">Mobile Number</p>
                  <p className="font-bold text-[#292929] mt-0.5">
                    {booking.mobile}
                  </p>
                </div>
                <div>
                  <p className="text-[#77736B]">City</p>
                  <p className="font-bold text-[#292929] mt-0.5">
                    {booking.city || "Junagadh"}
                  </p>
                </div>
              </div>
            </div>

            {/* Allocated Passes */}
            <div className="border-t border-[#E8DCC5] pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#77736B] mb-2 flex items-center gap-1.5">
                <Ticket size={13} className="text-[#C9A96E]" /> Confirmed Passes
                ({booking.totalTickets || 1})
              </h3>

              <div className="space-y-2">
                {Array.isArray(booking.tickets) &&
                  booking.tickets.map((t, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center rounded-lg bg-[#FBF8F2] border border-[#E8DCC5] p-3 text-xs font-bold text-[#292929]"
                    >
                      <div>
                        <p className="text-sm font-extrabold text-[#292929]">
                          {t.quantity}x {t.ticketType}
                        </p>
                        <p className="text-[11px] text-[#77736B] font-normal">
                          Allocated ID:{" "}
                          {t.seatNumbers?.join(", ") || "General Access"}
                        </p>
                      </div>
                      <span className="text-sm font-extrabold text-[#292929]">
                        ₹{(t.price * t.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Payment Summary Box */}
            <div className="rounded-lg border border-[#E8DCC5] bg-[#FBF8F2] p-4 text-xs font-medium text-[#77736B] space-y-1.5">
              <div className="flex justify-between">
                <span>Payment Status</span>
                <span className="font-bold uppercase text-emerald-700">
                  {booking.paymentStatus || "PAID"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Transaction ID</span>
                <span className="font-mono text-[#292929] text-[11px]">
                  {booking.paymentId || "ONLINE_SECURE_PAYMENT"}
                </span>
              </div>
              <div className="border-t border-[#E8DCC5] pt-1.5 flex justify-between items-baseline text-[#292929] font-extrabold text-sm">
                <span>Amount Paid</span>
                <span className="text-base text-[#292929]">
                  ₹
                  {(
                    booking.finalAmount ||
                    booking.totalAmount ||
                    0
                  ).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Gate Instructions */}
            <div className="rounded-lg border border-[#E8DCC5] bg-white p-3.5 text-[11px] leading-relaxed text-[#77736B] space-y-1">
              <p className="font-bold text-[#292929] text-xs flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#C9A96E]" /> Gate
                Instructions
              </p>
              <p>
                • Arrive at Satyam Party Plot by 7:00 PM with original
                government photo ID matching booking name.
              </p>
              <p>
                • Present this digital pass QR code to receive your entry
                wristband.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTicket;
