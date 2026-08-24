require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });

const fs = require("fs").promises;
const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { connectDatabase, mongoose } = require("./src/config/database");
const Event = require("./src/models/Event");
const User = require("./src/models/User");
const Booking = require("./src/models/Booking");
const authRoutes = require("./src/routes/authRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const { authenticateUser } = require("./src/middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;
const configuredOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const validateProductionConfig = () => {
  if (process.env.NODE_ENV !== "production") return;

  const required = [
    "MONGODB_URI",
    "JWT_SECRET",
    "FRONTEND_URL",
    "RAZORPAY_KEY_ID",
    "RAZORPAY_KEY_SECRET",
  ];
  const missing = required.filter((name) => !process.env[name]);
  if (missing.length) {
    throw new Error(
      `Missing production environment variables: ${missing.join(", ")}`,
    );
  }
};

// Configure Security & Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

const allowedOrigins = [
  ...configuredOrigins,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5175",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".onrender.com") ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());

// Database connection check
const requireDatabase = async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    console.error("Database connection unavailable:", error.message);
    res.status(503).json({
      message:
        "Database service temporarily unavailable. Please try again in a few moments.",
    });
  }
};

app.use("/api", requireDatabase);

// Rate limiters for security
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many authentication attempts, please try again later.",
  },
});

const paymentLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many checkout requests, please try again in a few minutes.",
  },
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/payment", paymentLimiter, paymentRoutes);
app.use("/api/admin", adminRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Raghav Events API", time: new Date() });
});

// Public Events APIs
app.get("/api/events", async (req, res) => {
  try {
    const query = { status: "published" };

    if (req.query.category && req.query.category !== "All") {
      query.category = req.query.category;
    }

    if (req.query.city && req.query.city !== "All") {
      query["venue.city"] = new RegExp(`^${req.query.city.trim()}$`, "i");
    }

    if (req.query.search) {
      const s = String(req.query.search).trim();
      query.$or = [
        { title: new RegExp(s, "i") },
        { "venue.name": new RegExp(s, "i") },
        { "venue.city": new RegExp(s, "i") },
        { category: new RegExp(s, "i") },
        { organizer: new RegExp(s, "i") },
      ];
    }

    const events = await Event.find(query).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error("Events fetch error:", error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

app.get("/api/events/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    console.error("Single event fetch error:", error);
    res.status(500).json({ message: "Failed to load event details" });
  }
});

// Single Booking Retrieval for Digital Ticket & Gate Entry
app.get("/api/ticketbooking/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = mongoose.isValidObjectId(id)
      ? { $or: [{ _id: id }, { bookingId: id }, { razorpayOrderId: id }] }
      : { bookingId: id };

    const booking = await Booking.findOne(query).populate(
      "eventId",
      "title category date time duration venue organizer bannerImage highlights ticketTypes",
    );

    if (!booking) {
      return res.status(404).json({ message: "Ticket / Booking not found" });
    }

    res.json({
      ...booking.toObject(),
      _id: booking._id.toString(),
      eventId: booking.eventId,
    });
  } catch (error) {
    console.error("Ticket retrieval error:", error);
    res.status(500).json({ message: "Unable to retrieve ticket pass" });
  }
});

// Authenticated User's Bookings
app.get("/api/my-bookings", authenticateUser, async (req, res) => {
  try {
    const bookings = await Booking.find({
      $or: [{ userId: req.user._id }, { userEmail: req.user.email }],
    })
      .populate(
        "eventId",
        "title category date time venue bannerImage organizer",
      )
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("My bookings fetch error:", error);
    res.status(500).json({ message: "Failed to fetch your bookings" });
  }
});

app.get("/api/my-bookings/:userId", authenticateUser, async (req, res) => {
  try {
    if (
      String(req.user._id) !== String(req.params.userId) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You do not have permission to access these bookings",
      });
    }

    const bookings = await Booking.find({ userId: req.params.userId })
      .populate(
        "eventId",
        "title category date time venue bannerImage organizer",
      )
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("User bookings fetch error:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

// System Health Check
app.get("/health", async (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    database: isConnected ? "connected" : "disconnected",
    dbName: process.env.DB_NAME || "RaghavEvents",
  });
});

// Unhandled error handler
app.use((error, req, res, next) => {
  console.error("Unhandled server error:", error);
  res.status(error.status || 500).json({
    message: error.message || "Internal server error occurred",
  });
});

// Seeding Helpers
const seedEvents = async () => {
  try {
    const count = await Event.countDocuments();
    if (count > 0) return;

    const dataPath = path.join(__dirname, "data", "events.json");
    const raw = await fs.readFile(dataPath, "utf8");
    const parsed = JSON.parse(raw);

    const formattedEvents = parsed.map(({ _id, ...event }) => ({
      ...event,
      status: "published",
    }));

    if (formattedEvents.length) {
      await Event.insertMany(formattedEvents);
      console.log(`Seeded ${formattedEvents.length} default Navratri events`);
    }
  } catch (error) {
    console.log("Event seed check:", error.message);
  }
};

const migrateCouplePassPrice = async () => {
  try {
    const result = await Event.updateMany(
      {
        ticketTypes: {
          $elemMatch: { name: "Couple Pass", price: { $ne: 10 } },
        },
      },
      { $set: { "ticketTypes.$[ticket].price": 10 } },
      { arrayFilters: [{ "ticket.name": "Couple Pass" }] },
    );

    if (result.modifiedCount > 0) {
      console.log(
        `Updated Couple Pass price in ${result.modifiedCount} event(s)`,
      );
    }
  } catch (error) {
    console.log("Couple Pass price migration check:", error.message);
  }
};

const seedAdmin = async () => {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) return;
  try {
    const bcrypt = require("bcryptjs");
    const email = process.env.ADMIN_EMAIL.toLowerCase().trim();
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    const existing = await User.findOne({ email }).select("+passwordHash");

    if (existing) {
      existing.passwordHash = passwordHash;
      existing.role = "admin";
      existing.status = "active";
      await existing.save();
      console.log("Configured admin account verified and updated");
      return;
    }

    await User.create({
      name: "Raghav Events Admin",
      email,
      phone: process.env.ADMIN_PHONE || "9999999999",
      city: "Junagadh",
      passwordHash,
      role: "admin",
      status: "active",
    });
    console.log("Initial administrator account created");
  } catch (error) {
    console.log("Admin seed check:", error.message);
  }
};

const start = async () => {
  try {
    validateProductionConfig();
    await connectDatabase();
    await seedEvents();
    await migrateCouplePassPrice();
    await seedAdmin();
    app.listen(PORT, () =>
      console.log(`🚀 Raghav Events Ticket Server running on port ${PORT}`),
    );
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exitCode = 1;
  }
};

if (require.main === module) start();
module.exports = app;
