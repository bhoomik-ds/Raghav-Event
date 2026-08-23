const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[0-9\s-]{10,15}$/;

const issueSession = (res, user) => {
  const secret = process.env.JWT_SECRET || "navratri-jwt-secret-key-2026";
  const token = jwt.sign(
    { sub: user._id.toString(), role: user.role, email: user.email },
    secret,
    { expiresIn: "7d" },
  );

  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

const publicUser = (user) => ({
  id: user._id.toString(),
  _id: user._id.toString(),
  name: user.name,
  email: user.email,
  phone: user.phone,
  city: user.city || "",
  role: user.role,
  status: user.status,
  createdAt: user.createdAt,
});

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword, city } = req.body;

    if (!name || !email || !phone || !password) {
      return res
        .status(400)
        .json({ message: "Please complete all required fields" });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    if (!emailPattern.test(cleanEmail)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    const cleanPhone = String(phone).trim();
    if (!phonePattern.test(cleanPhone)) {
      return res.status(400).json({ message: "Please enter a valid 10-digit mobile number" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res
        .status(409)
        .json({ message: "An account with this email address already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: String(name).trim(),
      email: cleanEmail,
      phone: cleanPhone,
      city: city ? String(city).trim() : "",
      passwordHash,
      role: "user",
      status: "active",
    });

    const token = issueSession(res, user);
    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: publicUser(user),
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Unable to create account. Please try again." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail }).select("+passwordHash");

    if (!user || !(await bcrypt.compare(String(password), user.passwordHash))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.status !== "active") {
      return res.status(403).json({ message: "Your account has been deactivated. Contact support." });
    }

    const token = issueSession(res, user);
    res.json({
      success: true,
      message: "Signed in successfully",
      user: publicUser(user),
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Unable to sign in. Please try again." });
  }
};

exports.logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
  res.json({ success: true, message: "Signed out successfully" });
};

exports.me = (req, res) => {
  res.json({
    success: true,
    user: publicUser(req.user),
  });
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, city } = req.body;

    if (!name || !phone) {
      return res
        .status(400)
        .json({ message: "Name and mobile number are required" });
    }

    const cleanPhone = String(phone).trim();
    if (!phonePattern.test(cleanPhone)) {
      return res.status(400).json({ message: "Please enter a valid mobile number" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: String(name).trim(),
        phone: cleanPhone,
        city: city ? String(city).trim() : "",
      },
      { new: true, runValidators: true },
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: publicUser(updatedUser),
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

exports.issueSession = issueSession;
exports.publicUser = publicUser;
