import React from "react";
import { Star, ShieldCheck, Sparkles } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Dr. Bhavin Patel",
    city: "Junagadh",
    role: "Family Pass Holder",
    rating: 5,
    comment:
      "The wooden sprung dance floor at Satyam Party Plot made a huge difference! Our whole family danced for 10 straight nights without back or knee pain. Sound quality was extraordinary.",
  },
  {
    name: "Pooja & Jignesh Vora",
    city: "Zanzarda Road, Junagadh",
    role: "Couple Pass Holders",
    rating: 5,
    comment:
      "Best couple Garba experience in Saurashtra! The entry management with QR wristbands was super fast with zero wait time. Strict security and family-first crowd made us feel very safe.",
  },
  {
    name: "Mehul Rathod",
    city: "Moti Baug, Junagadh",
    role: "Folk Garba Enthusiast",
    rating: 5,
    comment:
      "The traditional dhol rhythms and orchestra were breathtaking. Raghav Events truly organized the biggest and most authentic Navratri festival in Junagadh. Already booked for 2026!",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-12 sm:py-24 bg-[#FBF8F2] relative">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E8DCC5] bg-white px-3 py-0.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#936E2A] mb-2 sm:mb-3 shadow-xs">
            <Sparkles size={12} className="text-[#C9A96E]" />
            <span>Community Voice</span>
          </div>

          <h2 className="text-2xl xs:text-3xl sm:text-5xl font-extrabold text-[#292929] tracking-tight font-display">
            Loved By 15,000+ Attendees
          </h2>

          <p className="mt-2 sm:mt-4 text-xs sm:text-base text-[#77736B] font-medium leading-relaxed max-w-2xl mx-auto px-2">
            Read verified experiences from attendees who celebrated the grand festival with us.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#E8DCC5] bg-white p-5 sm:p-8 shadow-xs hover:border-[#C9A96E]/70 hover:shadow-md transition duration-200 flex flex-col justify-between"
            >
              <div>
                {/* 5-star rating */}
                <div className="flex items-center gap-1 text-amber-400 mb-3 sm:mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-[#292929] leading-relaxed font-medium italic">
                  "{item.comment}"
                </p>
              </div>

              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-[#E8DCC5]/70 flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#292929]">
                    {item.name}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-[#77736B] font-semibold">
                    {item.city} • {item.role}
                  </p>
                </div>

                <div className="flex items-center gap-1 rounded-full bg-[#FBF8F2] border border-[#E8DCC5] px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-emerald-700">
                  <ShieldCheck size={11} />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
