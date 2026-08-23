const express = require("express");
const { authenticateUser, requireAdmin } = require("../middleware/auth");
const controller = require("../controllers/adminController");

const router = express.Router();

// Apply auth + admin guard to all routes
router.use(authenticateUser, requireAdmin);

router.get("/dashboard", controller.dashboard);

// Events management
router.get("/events", controller.listEvents);
router.post("/events", controller.createEvent);
router.put("/events/:id", controller.updateEvent);
router.delete("/events/:id", controller.deleteEvent);

// Bookings management
router.get("/bookings", controller.listBookings);
router.get("/bookings/:id", controller.getBooking);
router.patch("/bookings/:id/status", controller.updateBookingStatus);

// Users management
router.get("/users", controller.listUsers);
router.get("/users/:id", controller.getUser);
router.patch("/users/:id/status", controller.updateUserStatus);

// Payments ledger
router.get("/payments", controller.listPayments);

module.exports = router;
