import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Ticket, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import HeroSection from "./home/HeroSection";
import PassesSection from "./home/PassesSection";
import FestivalSchedule from "./home/FestivalSchedule";
import VenueExperience from "./home/VenueExperience";
import GallerySection from "./home/GallerySection";
import TestimonialsSection from "./home/TestimonialsSection";
import FaqSection from "./home/FaqSection";
import VipBanner from "./home/VipBanner";

const EventInfo = () => {
  const { api } = useAuth();
  const [eventData, setEventData] = useState(null);
  const [showMobileStickyBar, setShowMobileStickyBar] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get("api/events");
        if (res.data && res.data.length > 0) {
          setEventData(res.data[0]);
        }
      } catch (err) {
        console.error("Error fetching event data:", err);
      }
    };
    fetchEvent();

    const handleScroll = () => {
      // Show sticky bar once user scrolls past initial hero (400px)
      if (window.scrollY > 400) {
        setShowMobileStickyBar(true);
      } else {
        setShowMobileStickyBar(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [api]);

  const eventId = eventData?._id || "";

  return (
    <main className="w-full overflow-hidden bg-[#FBF8F2] selection:bg-[#C9A96E]/30 selection:text-[#1A1A1A] pb-16 sm:pb-0">
      {/* 1. Cinematic Hero with Countdown & Live Stats */}
      <HeroSection eventId={eventId} />

      {/* 2. Interactive Season Pass Selector & Instant Pricing Calculator */}
      <PassesSection eventId={eventId} />

      {/* 3. 10-Night Grand Festival Schedule & Theme Explorer */}
      <FestivalSchedule eventId={eventId} />

      {/* 4. World-Class Venue & Ground Experience */}
      <VenueExperience />

      {/* 5. Atmosphere & Visual Photo Showcase */}
      <GallerySection />

      {/* 6. Social Proof & Verified Attendee Testimonials */}
      <TestimonialsSection />

      {/* 7. Interactive Attendee FAQ Accordion */}
      <FaqSection />

      {/* 8. VIP & Group Inquiries Banner */}
      <VipBanner eventId={eventId} />

      {/* 9. Floating Mobile Sticky Quick-Booking Bar (Visible on Scroll) */}
      {showMobileStickyBar && (
        <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-[#141418]/95 backdrop-blur-md border-t border-[#C9A96E]/30 px-3.5 py-2.5 shadow-2xl pb-safe animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1 text-[10px] font-bold text-[#E5C384] uppercase tracking-wider">
                <ShieldCheck size={11} className="text-[#C9A96E] shrink-0" />
                <span>10 Nights Official Pass</span>
              </div>
              <p className="text-sm font-extrabold text-white truncate">
                From <span className="text-[#E5C384]">₹1,499</span>
              </p>
            </div>

            <Link
              to={`/TicketBooking${eventId ? `?event=${eventId}` : ""}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl btn-gold px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#1A1A1A] shadow-md touch-press shrink-0"
            >
              <Ticket size={14} />
              <span>Book Pass</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      )}
    </main>
  );
};

export default EventInfo;
