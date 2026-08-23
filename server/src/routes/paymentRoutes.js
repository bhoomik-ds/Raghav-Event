const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { optionalAuthenticate } = require("../middleware/auth");

// Define the routes
router.post("/create-order", paymentController.createOrder);
router.post("/verify", optionalAuthenticate, paymentController.verifyPayment);

module.exports = router;
