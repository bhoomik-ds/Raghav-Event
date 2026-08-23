import { Users, Heart, Baby } from "lucide-react";

export const PASS_DATA = [
  {
    id: "family-pass",
    name: "Family Pass",
    price: 7499,
    formattedPrice: "₹7,499",
    tagline: "Up to 4 Persons",
    badge: "Most Popular",
    icon: Users,
    description:
      "All-inclusive festival season pass for up to 4 immediate family members. Grants access to the grand arena, family seating zones, and fast-track gates for all 10 nights.",
    features: [
      "Access for up to 4 family members",
      "Valid for all 10 consecutive nights (11 - 20 Oct)",
      "Designated family seating & viewing lounge",
      "Official cloth entry wristbands for all 4",
      "Separate fast-track family entry gate",
      "Full access to food court & rest zones",
    ],
    recommended: true,
  },
  {
    id: "couple-pass",
    name: "Couple Pass",
    price: 3999,
    formattedPrice: "₹3,999",
    tagline: "1 Male & 1 Female Only",
    badge: "Trending Choice",
    icon: Heart,
    description:
      "Exclusive couple entry pass valid strictly for 1 male and 1 female attendee for all 10 nights of Garba celebration at Satyam Party Plot.",
    features: [
      "Valid strictly for 1 Male & 1 Female pair",
      "Valid for all 10 consecutive nights (11 - 20 Oct)",
      "Access to main Garba circle floor & arena",
      "2 Cloth entry wristbands provided at gate",
      "Instant digital QR check-in",
      "Photo ID verification required at gate",
    ],
    recommended: false,
  },
  {
    id: "children-pass",
    name: "Children Pass",
    price: 1499,
    formattedPrice: "₹1,499",
    tagline: "5 to 12 Years of Age",
    badge: "Kids Special",
    icon: Baby,
    description:
      "Special festive entry pass for children between 5 to 12 years accompanied by an adult pass holder. Toddlers under 5 enter free.",
    features: [
      "Valid for children aged 5 to 12 years",
      "Valid for all 10 nights (11 - 20 Oct)",
      "Access to children play & food village zone",
      "Must be accompanied by adult guardian",
      "Kids special non-allergic wristband",
      "Children under 5 years enter Free",
    ],
    recommended: false,
  },
];
