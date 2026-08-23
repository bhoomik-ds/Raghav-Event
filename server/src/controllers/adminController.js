const Event = require("../models/Event");
const Booking = require("../models/Booking");
const User = require("../models/User");
const { mongoose } = require("../config/database");

const escapeRegExp = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const eventPayload = (body) => {
  const ticketTypes = Array.isArray(body.ticketTypes)
    ? body.ticketTypes.map((ticket, index) => ({
        _id: String(ticket._id || `tt_${Date.now()}_${index}`),
        name: String(ticket.name || "").trim(),
        price: Math.max(0, Number(ticket.price) || 0),
        totalSeats: Math.max(0, Number(ticket.totalSeats) || 0),
        availableSeats: Math.max(
          0,
          Number(ticket.availableSeats !== undefined ? ticket.availableSeats : ticket.totalSeats) || 0,
        ),
        soldCount: Math.max(0, Number(ticket.soldCount) || 0),
        description: ticket.description ? String(ticket.description).trim() : "",
      }))
    : [];

  return {
    title: String(body.title || "").trim(),
    category: String(body.category || "Garba").trim(),
    about: String(body.about || "").trim(),
    highlights: Array.isArray(body.highlights)
      ? body.highlights.map((h) => String(h).trim()).filter(Boolean)
      : typeof body.highlights === "string"
        ? body.highlights.split(",").map((h) => h.trim()).filter(Boolean)
        : [],
    date: body.date ? new Date(body.date) : new Date(),
    time: String(body.time || "7:00 PM Onwards").trim(),
    duration: body.duration ? String(body.duration).trim() : "5 hours",
    venue: {
      name: body.venue?.name ? String(body.venue.name).trim() : "Satyam Party Plot",
      city: body.venue?.city ? String(body.venue.city).trim() : "Junagadh",
      address: body.venue?.address ? String(body.venue.address).trim() : "Satyam Party Plot, Zanzarda Chokdi, Junagadh",
    },
    organizer: body.organizer ? String(body.organizer).trim() : "Raghav Events",
    ageLimit: body.ageLimit ? String(body.ageLimit).trim() : "All ages",
    rating: Number(body.rating) || 4.9,
    votes: body.votes ? String(body.votes).trim() : "1.2K",
    interested: body.interested ? String(body.interested).trim() : "5.4K",
    tags: Array.isArray(body.tags)
      ? body.tags.map((t) => String(t).trim()).filter(Boolean)
      : ["Navratri", "Garba", "Live Music"],
    priceRange: body.priceRange ? String(body.priceRange).trim() : "₹499 onwards",
    originalPrice: body.originalPrice ? String(body.originalPrice).trim() : "₹799",
    bannerImage: body.bannerImage ? String(body.bannerImage).trim() : "/images/background.png",
    galleryImages: Array.isArray(body.galleryImages) && body.galleryImages.length > 0
      ? body.galleryImages
      : ["/images/background.png"],
    status: ["draft", "published", "cancelled", "completed"].includes(body.status)
      ? body.status
      : "published",
    ticketTypes,
  };
};

exports.dashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalEvents,
      activeEvents,
      totalBookings,
      confirmedBookings,
      revenueResult,
      ticketsSoldResult,
      upcomingEvents,
      recentBookings,
    ] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Event.countDocuments({ status: "published" }),
      Booking.countDocuments(),
      Booking.countDocuments({ bookingStatus: "confirmed" }),
      Booking.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$finalAmount" } } },
      ]),
      Booking.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalTickets" } } },
      ]),
      Event.countDocuments({ date: { $gte: new Date() }, status: "published" }),
      Booking.find()
        .populate("eventId", "title date venue bannerImage")
        .sort({ createdAt: -1 })
        .limit(6),
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalEvents,
        activeEvents,
        totalBookings,
        confirmedBookings,
        totalRevenue: revenueResult[0]?.total || 0,
        ticketsSold: ticketsSoldResult[0]?.total || 0,
        upcomingEvents,
      },
      recentBookings,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({ message: "Unable to retrieve dashboard metrics" });
  }
};

exports.listEvents = async (req, res) => {
  try {
    const query = {};
    if (req.query.status && req.query.status !== "all") {
      query.status = req.query.status;
    }
    if (req.query.category && req.query.category !== "All") {
      query.category = req.query.category;
    }
    if (req.query.search) {
      const search = escapeRegExp(req.query.search);
      query.$or = [
        { title: new RegExp(search, "i") },
        { "venue.name": new RegExp(search, "i") },
        { "venue.city": new RegExp(search, "i") },
      ];
    }

    const events = await Event.find(query).sort({ date: 1 });
    res.json({ success: true, events });
  } catch (error) {
    console.error("Admin list events error:", error);
    res.status(500).json({ message: "Failed to list events" });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const payload = eventPayload(req.body);

    if (!payload.title || !payload.about || !payload.ticketTypes.length) {
      return res.status(400).json({
        message: "Title, description, and at least one ticket tier are required.",
      });
    }

    const event = await Event.create(payload);
    res.status(201).json({ success: true, message: "Event created successfully", event });
  } catch (error) {
    console.error("Admin create event error:", error);
    res.status(500).json({ message: "Failed to create event" });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    if (!mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const payload = eventPayload(req.body);
    const event = await Event.findByIdAndUpdate(eventId, payload, {
      new: true,
      runValidators: true,
    });

    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ success: true, message: "Event updated successfully", event });
  } catch (error) {
    console.error("Admin update event error:", error);
    res.status(500).json({ message: "Failed to update event" });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    if (!mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    if (req.query.permanent === "true") {
      const deleted = await Event.findByIdAndDelete(eventId);
      if (!deleted) return res.status(404).json({ message: "Event not found" });
      return res.json({ success: true, message: "Event permanently deleted" });
    }

    // Default soft cancel
    const event = await Event.findByIdAndUpdate(
      eventId,
      { status: "cancelled" },
      { new: true },
    );
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ success: true, message: "Event cancelled", event });
  } catch (error) {
    console.error("Admin delete event error:", error);
    res.status(500).json({ message: "Failed to delete event" });
  }
};

exports.listBookings = async (req, res) => {
  try {
    const query = {};
    if (req.query.paymentStatus && req.query.paymentStatus !== "all") {
      query.paymentStatus = req.query.paymentStatus;
    }
    if (req.query.bookingStatus && req.query.bookingStatus !== "all") {
      query.bookingStatus = req.query.bookingStatus;
    }
    if (req.query.eventId && mongoose.isValidObjectId(req.query.eventId)) {
      query.eventId = req.query.eventId;
    }
    if (req.query.search) {
      const search = escapeRegExp(req.query.search);
      query.$or = [
        { bookingId: new RegExp(search, "i") },
        { guestName: new RegExp(search, "i") },
        { userEmail: new RegExp(search, "i") },
        { mobile: new RegExp(search, "i") },
      ];
    }

    const bookings = await Booking.find(query)
      .populate("eventId", "title date time venue bannerImage")
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 })
      .limit(200);

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Admin list bookings error:", error);
    res.status(500).json({ message: "Failed to list bookings" });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const id = req.params.id;
    const query = mongoose.isValidObjectId(id)
      ? { $or: [{ _id: id }, { bookingId: id }] }
      : { bookingId: id };

    const booking = await Booking.findOne(query)
      .populate("eventId", "title date time venue bannerImage")
      .populate("userId", "name email phone");

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ success: true, booking });
  } catch (error) {
    console.error("Admin get booking error:", error);
    res.status(500).json({ message: "Failed to load booking details" });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingStatus, paymentStatus } = req.body;
    const id = req.params.id;

    const updateFields = {};
    if (bookingStatus) updateFields.bookingStatus = bookingStatus;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;

    const booking = await Booking.findByIdAndUpdate(id, updateFields, { new: true });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.json({ success: true, message: "Booking status updated", booking });
  } catch (error) {
    console.error("Admin update booking status error:", error);
    res.status(500).json({ message: "Failed to update booking status" });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const query = {};
    if (req.query.role && req.query.role !== "all") {
      query.role = req.query.role;
    }
    if (req.query.status && req.query.status !== "all") {
      query.status = req.query.status;
    }
    if (req.query.search) {
      const search = escapeRegExp(req.query.search);
      query.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { phone: new RegExp(search, "i") },
      ];
    }

    const users = await User.find(query)
      .select("-passwordHash")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ success: true, users });
  } catch (error) {
    console.error("Admin list users error:", error);
    res.status(500).json({ message: "Failed to list users" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });

    const userBookings = await Booking.find({ userId: user._id })
      .populate("eventId", "title date")
      .sort({ createdAt: -1 });

    res.json({ success: true, user, bookings: userBookings });
  } catch (error) {
    console.error("Admin get user error:", error);
    res.status(500).json({ message: "Failed to load user profile" });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { status, role } = req.body;
    const updateFields = {};

    if (status && ["active", "disabled"].includes(status)) {
      updateFields.status = status;
    }
    if (role && ["user", "admin"].includes(role)) {
      updateFields.role = role;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
    }).select("-passwordHash");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, message: "User updated successfully", user });
  } catch (error) {
    console.error("Admin update user error:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

exports.listPayments = async (req, res) => {
  try {
    const payments = await Booking.find()
      .select(
        "bookingId guestName userEmail eventId finalAmount totalAmount paymentStatus razorpayPaymentId razorpayOrderId paidAt createdAt",
      )
      .populate("eventId", "title")
      .sort({ createdAt: -1 })
      .limit(200);

    res.json({ success: true, payments });
  } catch (error) {
    console.error("Admin list payments error:", error);
    res.status(500).json({ message: "Failed to list payments" });
  }
};
