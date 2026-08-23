const { mongoose } = require("../config/database");

const ticketTypeSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    totalSeats: { type: Number, required: true, min: 0 },
    availableSeats: { type: Number, required: true, min: 0 },
    soldCount: { type: Number, default: 0, min: 0 },
    description: { type: String, trim: true },
  },
  { _id: false },
);

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    about: { type: String, required: true },
    highlights: [String],
    date: { type: Date, required: true, index: true },
    time: { type: String, required: true },
    duration: String,
    venue: {
      name: String,
      city: { type: String, index: true },
      address: String,
    },
    organizer: String,
    ageLimit: String,
    rating: Number,
    votes: String,
    interested: String,
    tags: [String],
    priceRange: String,
    originalPrice: String,
    bannerImage: String,
    galleryImages: [String],
    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "completed"],
      default: "published",
      index: true,
    },
    ticketTypes: [ticketTypeSchema],
  },
  { timestamps: true, collection: "events" },
);

eventSchema.index({ title: "text", "venue.city": "text", category: "text" });

module.exports = mongoose.models.Event || mongoose.model("Event", eventSchema);
