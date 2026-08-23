import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "Are passes valid for all 10 nights of Navratri 2026?",
    answer:
      "Yes! All official passes (Family Pass, Couple Pass, and Children Pass) grant full unlimited access for all 10 consecutive nights from 11 October through 20 October 2026 at Satyam Party Plot, Junagadh. No daily re-booking needed.",
  },
  {
    question: "How and when do I collect my physical cloth wristband?",
    answer:
      "Upon online booking, you receive an instant verified digital QR e-pass via WhatsApp and Email. Simply show your QR code along with original photo ID at the Satyam Party Plot helpdesk (open daily from 4:00 PM onwards starting 11 October) to collect your official cloth entry wristband.",
  },
  {
    question: "What are the entry criteria for Couple Pass?",
    answer:
      "The Couple Pass is strictly reserved for 1 Male and 1 Female attendee pair. Both attendees must enter together at the gate for wristband verification on the first day of check-in.",
  },
  {
    question: "Are children allowed, and what is the policy for toddlers?",
    answer:
      "Yes! Grand Junagadh Garba Mahotsav is 100% family friendly. Children aged 5 to 12 years require a Children Pass (₹1,499 for 10 nights) and must be accompanied by an adult. Toddlers under 5 years of age enter completely free.",
  },
  {
    question: "What are the parking arrangements at Satyam Party Plot?",
    answer:
      "We provide over 1,000 dedicated, well-lit parking bays for both cars and two-wheelers right adjacent to the venue. Traffic marshals and security personnel guide you to ensure safe parking.",
  },
  {
    question: "What payment methods are supported on the portal?",
    answer:
      "We support all major Indian payment methods including UPI (Google Pay, PhonePe, Paytm), Net Banking, Debit Cards, and Credit Cards with 256-bit bank-grade SSL encryption.",
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="py-12 sm:py-24 bg-[#141418] text-white relative">
      <div className="mx-auto max-w-4xl px-3.5 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full glass-dark border border-[#C9A96E]/40 px-3 py-0.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#E5C384] mb-2 sm:mb-3">
            <HelpCircle size={12} className="text-[#C9A96E]" />
            <span>Got Questions?</span>
          </div>

          <h2 className="text-2xl xs:text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            Frequently Asked Questions
          </h2>

          <p className="mt-2 sm:mt-4 text-xs sm:text-base text-white/70 font-normal leading-relaxed px-2">
            Everything you need to know about pass validity, gate guidelines, wristbands, and festival policies.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3 sm:space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl glass-dark border border-white/10 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between gap-3 p-4 sm:p-6 text-left focus:outline-none touch-press"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs sm:text-base font-extrabold text-white leading-snug">
                    {item.question}
                  </span>
                  <div
                    className={`grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-[#E5C384] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-[#C9A96E]/20" : ""
                    }`}
                  >
                    <ChevronDown size={16} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-1 border-t border-white/10 text-xs sm:text-sm text-white/80 leading-relaxed font-medium animate-in fade-in duration-200">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FaqSection;
