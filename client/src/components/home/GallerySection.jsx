import React from "react";
import { Sparkles, Camera } from "lucide-react";

const GALLERY_ITEMS = [
  {
    image: "/images/hero-banner.jpg",
    title: "10,000+ Dancers Under Illuminated Night Skies",
    category: "Grand Raas Arena",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    image: "/images/dandiya-raas.jpg",
    title: "Authentic Gujarati Dandiya Raas Beats",
    category: "Festive Joy",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    image: "/images/venue-ambiance.jpg",
    title: "Royal Archway & Grand Stage Illumination",
    category: "Satyam Arena",
    span: "md:col-span-1 md:row-span-1",
  },
];

const GallerySection = () => {
  return (
    <section id="experience" className="py-12 sm:py-24 bg-[#141418] text-white relative">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full glass-dark border border-[#C9A96E]/40 px-3 py-0.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#E5C384] mb-2 sm:mb-3">
            <Camera size={12} className="text-[#C9A96E]" />
            <span>Festival Atmosphere</span>
          </div>

          <h2 className="text-2xl xs:text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            The Junagadh Experience
          </h2>

          <p className="mt-2 sm:mt-4 text-xs sm:text-base text-white/70 font-normal leading-relaxed max-w-2xl mx-auto px-2">
            Witness the unmatched cultural ecstasy, vibrant chaniya cholis, hypnotic dhol rhythms, and unforgettable festive memories.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3 md:grid-rows-2">
          {GALLERY_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 glass-dark min-h-[220px] sm:min-h-[260px] md:min-h-[300px] ${item.span}`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Gradient Shade */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

              {/* Text Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-7 flex flex-col justify-end">
                <span className="inline-block rounded-full bg-[#C9A96E]/25 border border-[#C9A96E]/40 px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#E5C384] w-fit mb-1.5">
                  {item.category}
                </span>
                <h3 className="text-sm sm:text-xl font-extrabold text-white leading-snug">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default GallerySection;
