const { mongoose } = require("../config/database");

const bookingTicketSchema = new mongoose.Schema(
  {
    ticketType: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    seatNumbers: [String],
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    guestName: { type: String, required: true },
    mobile: { type: String, required: true },
    city: String,
    userEmail: String,
    tickets: [bookingTicketSchema],
    totalTickets: { type: Number, required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    finalAmount: { type: Number, required: true, min: 0 },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
      index: true,
    },
    razorpayOrderId: { type: String, unique: true, sparse: true },
    razorpayPaymentId: { type: String, unique: true, sparse: true },
    razorpaySignature: String,
    paidAt: Date,
  },
  { timestamps: true, collection: "Passbooking" },
);

bookingSchema.index({ createdAt: -1 });

module.exports =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
