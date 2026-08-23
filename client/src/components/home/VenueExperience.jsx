import React from "react";
import {
  MapPin,
  Volume2,
  ShieldCheck,
  Car,
  UtensilsCrossed,
  HeartPulse,
  Sparkles,
  ExternalLink,
  Layers,
} from "lucide-react";

const VENUE_FEATURES = [
  {
    icon: Layers,
    title: "50,000 sq.ft Wooden Sprung Ground",
    description:
      "Custom engineered wooden cushioned sub-floor allowing you to dance 6+ hours with zero foot fatigue.",
  },
  {
    icon: Volume2,
    title: "360° Meyer Sound Acoustics",
    description:
      "Crystal clear live orchestra sound and resonant dhol frequencies evenly distributed across all sections.",
  },
  {
    icon: ShieldCheck,
    title: "3-Tier RFID Wristband Security",
    description:
      "Tamper-proof cloth wristbands with instant QR gate scanning for rapid 5-second entry with zero crowding.",
  },
  {
    icon: Car,
    title: "1,000+ Free Vehicle Parking",
    description:
      "Spacious dedicated parking zones for cars and two-wheelers with round-the-clock traffic marshals.",
  },
  {
    icon: UtensilsCrossed,
    title: "25+ Gourmet Food Stalls",
    description:
      "Hygienic Kathiyawadi cuisine, live chaat counters, hot beverages, and traditional festive snacks.",
  },
  {
    icon: HeartPulse,
    title: "On-Site Medical & Doctor Care",
    description:
      "24/7 emergency first-aid station, on-ground doctor, air-conditioned rest lounge, and ambulance support.",
  },
];

const VenueExperience = () => {
  return (
    <section id="venue" className="py-12 sm:py-24 bg-[#FBF8F2] relative">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E8DCC5] bg-white px-3 py-0.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#936E2A] mb-2 sm:mb-3 shadow-xs">
            <MapPin size={12} className="text-[#C9A96E]" />
            <span>World-Class Infrastructure</span>
          </div>

          <h2 className="text-2xl xs:text-3xl sm:text-5xl font-extrabold text-[#292929] tracking-tight font-display">
            The Grand Satyam Arena
          </h2>

          <p className="mt-2 sm:mt-4 text-xs sm:text-base text-[#77736B] font-medium leading-relaxed max-w-2xl mx-auto px-2">
            Satyam Party Plot at Zanzarda Chokdi is Junagadh's most prestigious open-air festive destination, fully upgraded for Navratri 2026.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VENUE_FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#E8DCC5] bg-white p-5 sm:p-7 shadow-xs hover:border-[#C9A96E] hover:shadow-md transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-xl bg-[#FBF8F2] border border-[#E8DCC5] text-[#936E2A] mb-3 sm:mb-4 shadow-xs">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-sm sm:text-lg font-extrabold text-[#292929]">
                    {feat.title}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-[#77736B] leading-relaxed font-medium">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Venue Location Showcase Card */}
        <div className="mt-8 sm:mt-12 rounded-2xl border border-[#E8DCC5] bg-white overflow-hidden shadow-sm">
          <div className="grid lg:grid-cols-[1.2fr_1fr] items-center">
            
            {/* Visual Image */}
            <div className="relative h-56 sm:h-80 lg:h-full min-h-[220px]">
              <img
                src="/images/venue-ambiance.jpg"
                alt="Satyam Party Plot Venue"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-white/10" />
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 rounded-xl glass-dark border border-white/20 p-2.5 sm:p-3 text-white">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#E5C384] font-bold block">
                  Official Venue
                </span>
                <p className="text-xs sm:text-sm font-extrabold">
                  Satyam Party Plot • Zanzarda Chokdi, Junagadh
                </p>
              </div>
            </div>

            {/* Venue Location Details */}
            <div className="p-5 sm:p-10 space-y-4 sm:space-y-5">
              <div>
                <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#936E2A] block mb-1">
                  Prime Location &amp; Directions
                </span>
                <h3 className="text-lg sm:text-2xl font-extrabold text-[#292929]">
                  Satyam Party Plot, Junagadh
                </h3>
                <p className="text-xs sm:text-sm text-[#77736B] mt-1 leading-relaxed font-medium">
                  Zanzarda Chokdi, Bypass Road, Junagadh 362001. Centrally located with 4-lane wide road access.
                </p>
              </div>

              <div className="space-y-2 text-xs text-[#292929] border-t border-b border-[#E8DCC5] py-3 sm:py-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#77736B] font-semibold">From Railway Station:</span>
                  <span className="font-bold">12 Mins (4.5 km)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#77736B] font-semibold">From Bus Stand:</span>
                  <span className="font-bold">10 Mins (3.8 km)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#77736B] font-semibold">Gate Entry Timings:</span>
                  <span className="font-bold text-[#936E2A]">6:30 PM Daily</span>
                </div>
              </div>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Satyam+Party+Plot+Zanzarda+Chokdi+Junagadh"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 rounded-xl btn-charcoal px-6 py-3 text-xs font-extrabold uppercase tracking-wider shadow-xs touch-press"
              >
                <MapPin size={15} className="text-[#C9A96E]" />
                <span>Open in Google Maps</span>
                <ExternalLink size={13} />
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default VenueExperience;
