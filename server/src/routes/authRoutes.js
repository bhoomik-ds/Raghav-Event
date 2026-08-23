const express = require("express");
const { authenticateUser } = require("../middleware/auth");
const controller = require("../controllers/authController");

const router = express.Router();
router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.get("/me", authenticateUser, controller.me);
router.put("/profile", authenticateUser, controller.updateProfile);
module.exports = router;
