import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Sparkles,
  Music,
  ArrowRight,
  Shirt,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const FESTIVAL_NIGHTS = [
  {
    night: 1,
    date: "11 Oct 2026",
    day: "Sunday",
    tithi: "Prathama (Maha Sthapana)",
    title: "Maha Sthapana & Royal Inaugural Raas",
    themeColor: "#D4AF37",
    colorName: "Royal Gold & Yellow",
    artist: "Junagadh Royal Dhol Symphony & Folk Ensemble",
    timing: "7:00 PM – 12:30 AM",
    description:
      "The grand festival commences with auspicious Ghatasthapana & Maa Ambe Deep Prajvalan, followed by the grand inaugural Raas circle with 50+ traditional dholis.",
    highlights: [
      "Auspicious Ghatasthapana & Royal Aarti",
      "Grand 50-Dhol Welcoming Procession",
      "Traditional 2-Taali & 3-Taali opening rounds",
    ],
  },
  {
    night: 2,
    date: "12 Oct 2026",
    day: "Monday",
    tithi: "Dwitiya",
    title: "Kathiyawadi Dhol Dhamaka & Traditional Raas",
    themeColor: "#059669",
    colorName: "Peacock Green & Emerald",
    artist: "Saurashtra Folk Beats Orchestra",
    timing: "7:00 PM – 1:00 AM",
    description:
      "High tempo traditional Kathiyawadi rhythmic Garbi with energetic 4-step and 8-step circles under starry open skies.",
    highlights: [
      "Fast-paced traditional Kathiyawadi rhythms",
      "Special couples synchronized Garba circle",
      "Live Shehnai & Dhol fusion",
    ],
  },
  {
    night: 3,
    date: "13 Oct 2026",
    day: "Tuesday",
    tithi: "Tritiya",
    title: "Saurashtra Tal Garbi & Folk Heritage",
    themeColor: "#6B7280",
    colorName: "Silver & Charcoal Ethnic",
    artist: "Gir Heritage Folk Troupe",
    timing: "7:00 PM – 1:00 AM",
    description:
      "Celebrating the authentic folklore of Saurashtra with ancient Gujarati devotional melodies and authentic raas formations.",
    highlights: [
      "Authentic Saurashtra Mandvi Raas",
      "Traditional folk storytelling interludes",
      "Family friendly gentle tempo rounds",
    ],
  },
  {
    night: 4,
    date: "14 Oct 2026",
    day: "Wednesday",
    tithi: "Chaturthi",
    title: "Dandiya Under The Stars Symphony",
    themeColor: "#EA580C",
    colorName: "Radiant Orange & Amber",
    artist: "Celebrity Dandiya Orchestra Live",
    timing: "7:00 PM – 1:00 AM",
    description:
      "A mega high-energy Dandiya night with clashing wooden sticks, state-of-the-art acoustic sound, and synchronized floor lighting.",
    highlights: [
      "Dedicated Mega Dandiya Arena",
      "Best Dandiya Player Spot Competitions",
      "Live percussion & brass ensemble",
    ],
  },
  {
    night: 5,
    date: "15 Oct 2026",
    day: "Thursday",
    tithi: "Panchami",
    title: "Panchami Fusion Raas & Percussion Fest",
    themeColor: "#E2E8F0",
    colorName: "Ivory White & Champagne",
    artist: "Electro-Folk Raas Project",
    timing: "7:00 PM – 1:00 AM",
    description:
      "The mid-festival peak blending traditional folk vocals with modern acoustic percussion for an electrifying dance experience.",
    highlights: [
      "Dynamic acoustic drums & live Octapad",
      "Continuous non-stop 90-minute Garba set",
      "White traditional attire spotlight",
    ],
  },
  {
    night: 6,
    date: "16 Oct 2026",
    day: "Friday",
    tithi: "Shasthi",
    title: "Glamour Garba & Best Attire Gala",
    themeColor: "#BE123C",
    colorName: "Royal Red & Maroon",
    artist: "Gujarat Celebrity Star Singers",
    timing: "7:00 PM – 1:30 AM",
    description:
      "Weekend energy begins with celebrity guest appearances, red carpet entries, and prestigious Best Dressed Male/Female/Child awards.",
    highlights: [
      "Celebrity guest appearances & judges",
      "Best Traditional Costume Awards",
      "Live 360-degree photo booth stations",
    ],
  },
  {
    night: 7,
    date: "17 Oct 2026",
    day: "Saturday",
    tithi: "Saptami",
    title: "Saptami Mega Circle Extravaganza",
    themeColor: "#1D4ED8",
    colorName: "Royal Blue & Indigo",
    artist: "Grand Junagadh Navratri Symphony",
    timing: "7:00 PM – 2:00 AM",
    description:
      "Peak Saturday celebration with 10,000+ dancers forming giant concentric circles across the entire 50,000 sq.ft arena floor.",
    highlights: [
      "Massive 12-concentric circle formation",
      "Extended midnight dance hours",
      "Special Kathiyawadi midnight food feast",
    ],
  },
  {
    night: 8,
    date: "18 Oct 2026",
    day: "Sunday",
    tithi: "Maha Ashtami",
    title: "Maha Ashtami 1008-Diya Maha Aarti & Raas",
    themeColor: "#DB2777",
    colorName: "Auspicious Pink & Rani",
    artist: "Divine Shreshtha Folk Ensemble",
    timing: "6:30 PM – 1:30 AM",
    description:
      "The most auspicious night featuring a breathtaking 1,008-Diya Maha Aarti dedicated to Maa Jagdamba, followed by divine devotion-filled Garba.",
    highlights: [
      "Grand 1008-Diya illuminated Maha Aarti",
      "Spiritual energy with traditional stutis",
      "Special blessings & prasad for all attendees",
    ],
  },
  {
    night: 9,
    date: "19 Oct 2026",
    day: "Monday",
    tithi: "Maha Navami",
    title: "Navami Power Dhol Climax Marathon",
    themeColor: "#7C3AED",
    colorName: "Royal Purple & Violet",
    artist: "Junagadh Dhol Superstars & Brass Band",
    timing: "7:00 PM – 2:00 AM",
    description:
      "Non-stop high adrenaline Garba marathon leading into the final celebration with lightning-fast dhol beats and thrilling choreography.",
    highlights: [
      "High tempo non-stop Dodhiyu rounds",
      "Battle of the Dholis live face-off",
      "Mega laser and light show",
    ],
  },
  {
    night: 10,
    date: "20 Oct 2026",
    day: "Tuesday",
    tithi: "Vijaya Dashami (Maha Finale)",
    title: "Maha Finale Night & Grand Prize Ceremony",
    themeColor: "#F59E0B",
    colorName: "Festive Multicolor Royal Attire",
    artist: "Mega Finale All-Star Orchestra",
    timing: "7:00 PM – 2:00 AM",
    description:
      "The grand climax of Navratri 2026! Crowning the Garba King & Queen, Best Couple, Best Family, and grand fireworks celebration.",
    highlights: [
      "Grand Prize Ceremonies (₹5 Lakh+ in awards)",
      "Garba King, Queen, & Best Prince/Princess",
      "Spectacular Climax Celebrations & Fireworks",
    ],
  },
];

const FestivalSchedule = ({ eventId }) => {
  const [activeNightIndex, setActiveNightIndex] = useState(0);
  const activeNight = FESTIVAL_NIGHTS[activeNightIndex];

  const handlePrev = () => {
    setActiveNightIndex((prev) => (prev > 0 ? prev - 1 : FESTIVAL_NIGHTS.length - 1));
  };

  const handleNext = () => {
    setActiveNightIndex((prev) => (prev < FESTIVAL_NIGHTS.length - 1 ? prev + 1 : 0));
  };

  return (
    <section id="schedule" className="py-12 sm:py-24 bg-[#141418] text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#141418] via-[#1E1E24] to-[#141418] opacity-90" />
      <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#C9A96E]/10 blur-[120px] sm:blur-[150px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full glass-dark border border-[#C9A96E]/40 px-3 py-0.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#E5C384] mb-2 sm:mb-3">
            <Calendar size={12} className="text-[#C9A96E]" />
            <span>10 Days • 10 Themes</span>
          </div>

          <h2 className="text-2xl xs:text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            10-Night Grand Lineup
          </h2>

          <p className="mt-2 sm:mt-4 text-xs sm:text-base text-white/70 font-normal leading-relaxed max-w-2xl mx-auto px-2">
            Discover each night’s unique theme, guest performers, dress code colors, and special cultural highlights.
          </p>
        </div>

        {/* 10-Night Horizontal Selector Scroll with Quick Nav */}
        <div className="relative mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 px-1 no-scrollbar justify-start lg:justify-center scroll-smooth snap-x snap-mandatory">
            {FESTIVAL_NIGHTS.map((item, idx) => {
              const isSelected = idx === activeNightIndex;
              return (
                <button
                  key={item.night}
                  type="button"
                  onClick={() => setActiveNightIndex(idx)}
                  className={`shrink-0 snap-center flex flex-col items-center rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 transition-all duration-150 border text-center touch-press min-w-[76px] ${
                    isSelected
                      ? "bg-[#C9A96E] text-[#1A1A1A] border-[#C9A96E] shadow-md shadow-[#C9A96E]/20 font-bold scale-[1.03]"
                      : "glass-dark border-white/10 text-white/70 hover:border-white/30 hover:text-white"
                  }`}
                >
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider opacity-80">
                    Night {item.night}
                  </span>
                  <span className="text-xs sm:text-xs font-extrabold mt-0.5">
                    {item.date.split(" ")[0]} Oct
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Prev / Next Indicators on mobile */}
          <div className="flex items-center justify-between text-xs text-white/50 px-2 mt-1 sm:hidden">
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 hover:text-white py-1"
            >
              <ChevronLeft size={14} /> <span>Previous Night</span>
            </button>
            <span className="text-[11px] font-bold text-[#E5C384]">
              {activeNightIndex + 1} / 10
            </span>
            <button
              onClick={handleNext}
              className="flex items-center gap-1 hover:text-white py-1"
            >
              <span>Next Night</span> <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Active Night Showcase Card */}
        <div className="rounded-2xl glass-dark border border-[#C9A96E]/30 p-4 sm:p-10 shadow-2xl backdrop-blur-xl max-w-4xl mx-auto">
          <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] items-start">
            
            {/* Left Info Column */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#C9A96E]/20 border border-[#C9A96E]/50 px-2.5 py-0.5 text-[11px] sm:text-xs font-bold text-[#E5C384]">
                  Night {activeNight.night} of 10 • {activeNight.tithi}
                </span>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-white/80">
                  {activeNight.day}, {activeNight.date}
                </span>
              </div>

              <h3 className="text-xl sm:text-3xl font-extrabold text-white leading-snug">
                {activeNight.title}
              </h3>

              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                {activeNight.description}
              </p>

              {/* Highlights Checklist */}
              <div className="pt-2 space-y-1.5 sm:space-y-2">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#E5C384] block">
                  Night Special Highlights:
                </span>
                {activeNight.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-white/90 font-medium">
                    <Sparkles size={13} className="text-[#C9A96E] shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Meta Column */}
            <div className="rounded-xl bg-white/5 border border-white/10 p-4 sm:p-5 space-y-3 sm:space-y-4">
              
              <div className="space-y-0.5 border-b border-white/10 pb-2.5 sm:pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 flex items-center gap-1">
                  <Clock size={11} className="text-[#C9A96E]" /> Daily Arena Timings
                </span>
                <p className="text-xs sm:text-sm font-bold text-white">
                  {activeNight.timing}
                </p>
                <p className="text-[10px] text-white/60">
                  Gate opens 6:30 PM for smooth check-in
                </p>
              </div>

              <div className="space-y-0.5 border-b border-white/10 pb-2.5 sm:pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 flex items-center gap-1">
                  <Music size={11} className="text-[#C9A96E]" /> Live Orchestra
                </span>
                <p className="text-xs font-bold text-[#E5C384]">
                  {activeNight.artist}
                </p>
              </div>

              <div className="space-y-0.5 pb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 flex items-center gap-1">
                  <Shirt size={11} className="text-[#C9A96E]" /> Dress Code Color
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="h-3 w-3 rounded-full border border-white/40 shadow-xs shrink-0"
                    style={{ backgroundColor: activeNight.themeColor }}
                  />
                  <p className="text-xs font-extrabold text-white truncate">
                    {activeNight.colorName}
                  </p>
                </div>
              </div>

              <Link
                to={`/TicketBooking${eventId ? `?event=${eventId}` : ""}`}
                className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl btn-gold py-2.5 sm:py-3 text-xs font-extrabold uppercase tracking-wider shadow-sm mt-1 touch-press text-[#1A1A1A]"
              >
                <span>Book 10-Night Pass</span>
                <ArrowRight size={14} />
              </Link>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default FestivalSchedule;
