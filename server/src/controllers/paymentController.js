const Razorpay = require("razorpay");
const crypto = require("crypto");
const { mongoose } = require("../config/database");
const Event = require("../models/Event");
const Booking = require("../models/Booking");
const { sendTicketEmail } = require("../utils/emailService");

const isRealRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  return Boolean(
    keyId &&
    keySecret &&
    !keyId.includes("dummy") &&
    !keySecret.includes("dummy")
  );
};

const getRazorpayInstance = () => {
  if (isRealRazorpay()) {
    return new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return null;
};

const calculateTickets = async (eventId, seats) => {
  if (!mongoose.isValidObjectId(eventId)) {
    return { error: "Invalid event ID" };
  }

  const event = await Event.findOne({ _id: eventId, status: "published" });
  if (!event) {
    return { error: "Event not found or is no longer available" };
  }

  if (!Array.isArray(seats) || seats.length === 0) {
    return { error: "Please select at least one ticket type" };
  }

  let totalAmount = 0;
  let totalQuantity = 0;
  const requestedByType = new Map();

  for (const requested of seats) {
    const quantity = Number(requested.quantity);
    const ticketType = String(requested.ticketType || "").trim();
    const ticket = event.ticketTypes.find(
      (item) => item.name.toLowerCase() === ticketType.toLowerCase(),
    );

    if (!ticket || !Number.isInteger(quantity) || quantity < 1) {
      return { error: `Invalid ticket selection for '${ticketType}'` };
    }

    totalQuantity += quantity;
    requestedByType.set(
      ticket.name,
      (requestedByType.get(ticket.name) || 0) + quantity,
    );
  }

  if (totalQuantity > 10) {
    return { error: "You can book a maximum of 10 tickets per order" };
  }

  const normalized = [];
  for (const [ticketName, quantity] of requestedByType) {
    const ticket = event.ticketTypes.find((item) => item.name === ticketName);
    if (!ticket) {
      return { error: `Ticket type '${ticketName}' not found` };
    }
    if (ticket.availableSeats < quantity) {
      return {
        error: `Only ${ticket.availableSeats} ${ticket.name} tickets available (you requested ${quantity})`,
      };
    }
    totalAmount += ticket.price * quantity;
    normalized.push({ ticket, quantity });
  }

  return {
    event,
    amount: totalAmount,
    totalQuantity,
    normalized,
    selections: normalized.map(({ ticket, quantity }) => ({
      ticketType: ticket.name,
      quantity,
    })),
  };
};

exports.createOrder = async (req, res) => {
  try {
    const { eventId, seats } = req.body;
    const result = await calculateTickets(eventId, seats);

    if (result.error) {
      return res.status(400).json({ success: false, message: result.error });
    }

    const rzp = getRazorpayInstance();
    const amountInPaise = Math.round(result.amount * 100);

    if (rzp) {
      try {
        const order = await rzp.orders.create({
          amount: amountInPaise,
          currency: "INR",
          receipt: `rcpt_${Date.now().toString(36)}`,
          notes: {
            eventId: String(result.event._id),
            totalTickets: String(result.totalQuantity),
          },
        });

        return res.json({
          success: true,
          isMock: false,
          order_id: order.id,
          amount: order.amount,
          calculatedAmount: result.amount,
          key_id: process.env.RAZORPAY_KEY_ID,
          currency: "INR",
        });
      } catch (rzpError) {
        console.error("Razorpay order creation failed:", rzpError.message);
        // Fallback to simulated test order in development
        if (process.env.NODE_ENV !== "production") {
          const mockOrderId = `order_mock_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
          return res.json({
            success: true,
            isMock: true,
            order_id: mockOrderId,
            amount: amountInPaise,
            calculatedAmount: result.amount,
            key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_navratri",
            currency: "INR",
            note: "Using simulated test payment gateway",
          });
        }
        return res.status(502).json({
          success: false,
          message: "Payment gateway error: " + (rzpError.error?.description || rzpError.message),
        });
      }
    } else {
      // Mock gateway for test environments without Razorpay keys configured
      const mockOrderId = `order_mock_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
      return res.json({
        success: true,
        isMock: true,
        order_id: mockOrderId,
        amount: amountInPaise,
        calculatedAmount: result.amount,
        key_id: "rzp_test_mock_navratri",
        currency: "INR",
      });
    }
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ success: false, message: "Unable to initiate payment" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingData,
    } = req.body;

    if (!bookingData || !razorpay_order_id || !razorpay_payment_id) {
      return res
        .status(400)
        .json({ success: false, message: "Incomplete payment data received" });
    }

    const guestName = String(bookingData.guestName || "").trim();
    const mobile = String(bookingData.mobile || "").trim();
    const city = String(bookingData.city || "").trim();
    const email = String(bookingData.email || "").trim().toLowerCase();

    if (guestName.length < 2) {
      return res.status(400).json({ success: false, message: "Valid attendee name is required" });
    }
    if (!/^\+?[0-9\s-]{10,15}$/.test(mobile)) {
      return res.status(400).json({ success: false, message: "Valid 10-digit mobile number is required" });
    }

    // Check if booking already confirmed (Idempotency)
    const existing = await Booking.findOne({
      $or: [
        { razorpayOrderId: razorpay_order_id },
        { razorpayPaymentId: razorpay_payment_id },
      ],
    });

    if (existing) {
      return res.json({
        success: true,
        message: "Booking already confirmed",
        bookingId: existing._id,
        publicBookingId: existing.bookingId,
      });
    }

    // Verify signature for real Razorpay payments
    const isMock = razorpay_order_id.startsWith("order_mock_") || razorpay_payment_id.startsWith("pay_mock_");
    if (!isMock && isRealRazorpay()) {
      if (!razorpay_signature) {
        return res.status(400).json({ success: false, message: "Payment signature missing" });
      }

      const expected = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      const providedBuf = Buffer.from(String(razorpay_signature));
      const expectedBuf = Buffer.from(expected);

      if (
        providedBuf.length !== expectedBuf.length ||
        !crypto.timingSafeEqual(providedBuf, expectedBuf)
      ) {
        return res.status(400).json({ success: false, message: "Invalid payment verification signature" });
      }
    }

    // Calculate seats & inventory
    const result = await calculateTickets(bookingData.eventId, bookingData.seats);
    if (result.error) {
      return res.status(400).json({ success: false, message: result.error });
    }

    const event = result.event;
    const allocatedTickets = [];

    // Atomically decrement seats & assign seat numbers
    for (const { ticket, quantity } of result.normalized) {
      const eventTicket = event.ticketTypes.find((t) => t.name === ticket.name);
      if (!eventTicket || eventTicket.availableSeats < quantity) {
        return res.status(400).json({
          success: false,
          message: `Seats for ${ticket.name} were just booked by another user. Please reselect.`,
        });
      }

      const startingIndex = eventTicket.soldCount || 0;
      const seatNumbers = Array.from(
        { length: quantity },
        (_, i) => `${ticket.name.toUpperCase().replace(/\s+/g, "")}-${startingIndex + i + 1}`,
      );

      eventTicket.availableSeats -= quantity;
      eventTicket.soldCount = (eventTicket.soldCount || 0) + quantity;

      allocatedTickets.push({
        ticketType: ticket.name,
        quantity,
        seatNumbers,
        price: ticket.price,
      });
    }

    await event.save();

    // Generate readable public booking ID
    const year = new Date().getFullYear();
    const randomHex = crypto.randomBytes(3).toString("hex").toUpperCase();
    const publicBookingId = `NR-${year}-${Date.now().toString(36).toUpperCase()}-${randomHex}`;

    // Determine linked user ID if present
    const linkedUserId = req.user?._id || (mongoose.isValidObjectId(bookingData.userId) ? bookingData.userId : null);

    const booking = await Booking.create({
      bookingId: publicBookingId,
      userId: linkedUserId,
      eventId: event._id,
      guestName,
      mobile,
      city: city || event.venue?.city || "Gujarat",
      userEmail: email || req.user?.email || "",
      tickets: allocatedTickets,
      totalTickets: result.totalQuantity,
      totalAmount: result.amount,
      finalAmount: result.amount,
      paymentStatus: "paid",
      bookingStatus: "confirmed",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature || "mock_signature",
      paidAt: new Date(),
    });

    // Send email notification asynchronously
    if (email) {
      sendTicketEmail(booking.toObject(), event.toObject(), email).catch((err) =>
        console.error("Background email error:", err.message),
      );
    }

    return res.json({
      success: true,
      message: "Booking confirmed successfully!",
      bookingId: booking._id,
      publicBookingId: booking.bookingId,
      totalAmount: booking.finalAmount,
    });
  } catch (error) {
    console.error("Booking verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error completing booking. Please contact support with payment ID.",
    });
  }
};
